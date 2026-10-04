/**
 * Minimal allowlist sanitiser for SVG markup that is about to be injected with
 * `dangerouslySetInnerHTML`.
 *
 * The app fetches avatar SVGs from a third-party generator and renders them
 * inline so CSS can animate the eyes. That makes the response effectively
 * trusted markup, and the CSP allows inline scripts for hydration — so a
 * compromised or tampered response containing `<script>` or `onload=` would run.
 *
 * This is intentionally narrow: it drops the constructs that can execute or
 * exfiltrate, and leaves geometry/colour attributes alone so the artwork still
 * renders. It is a second line of defence, not a replacement for trusting the
 * origin.
 */

const DANGEROUS_ELEMENTS = [
  "script",
  "foreignobject",
  "iframe",
  "object",
  "embed",
  "audio",
  "video",
  "handler",
  "set",
  "animate",
  "animatetransform",
  "animatemotion",
];

/** A whole `on*="…"` / `on*='…'` / `on*=…` attribute, value included. */
const EVENT_HANDLER_ATTRIBUTE = /\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi;

/** A whole attribute whose value can carry a `javascript:` or HTML data URL. */
const SCRIPT_URL_ATTRIBUTE =
  /\s[\w:-]+\s*=\s*(?:"\s*(?:javascript|vbscript|data:text\/html|data:image\/svg)[^"]*"|'\s*(?:javascript|vbscript|data:text\/html|data:image\/svg)[^']*'|(?:javascript|vbscript|data:text\/html)[^\s>]*)/gi;

/** Residual constructs with no legitimate place in an avatar SVG. */
const RESIDUAL = [
  /<\?xml[\s\S]*?\?>/gi,
  // A DOCTYPE may carry an internal subset in brackets, so match to the last
  // `>` rather than the first.
  /<!DOCTYPE[^>]*(?:\[[\s\S]*?\])?[^>]*>/gi,
  /<!ENTITY[\s\S]*?>/gi,
  /<\?[\s\S]*?\?>/gi,
];

export function sanitizeSvg(svg: string): string {
  if (!svg) return "";

  let output = svg;

  for (const element of DANGEROUS_ELEMENTS) {
    // Paired form: <script …>…</script>
    output = output.replace(new RegExp(`<${element}\\b[\\s\\S]*?<\\/${element}\\s*>`, "gi"), "");
    // Self-closing / unpaired form: <script … />
    output = output.replace(new RegExp(`<${element}\\b[^>]*\\/?>`, "gi"), "");
  }

  output = output.replace(EVENT_HANDLER_ATTRIBUTE, "");
  output = output.replace(SCRIPT_URL_ATTRIBUTE, "");
  for (const pattern of RESIDUAL) output = output.replace(pattern, "");

  return output.trim();
}
