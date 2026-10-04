import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    // A thrown Response is a deliberate exit (redirect, explicit status, 429),
    // not a crash — replacing it with the 500 page would hide the real status.
    if (error instanceof Response) throw error;
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

const isDev = import.meta.env.DEV;

/**
 * Baseline response headers for every request.
 *
 * The CSP keeps `script-src` at 'self' plus 'unsafe-inline' because TanStack
 * Start ships its hydration payload and theme bootstrap as inline scripts;
 * removing 'unsafe-inline' would need per-request nonces plumbed through the
 * router, which is a larger change than this pass. Everything else is locked
 * down: no plugins, no framing, no base-uri rewriting, and connections limited
 * to the origins the app actually talks to.
 */
const CSP_DIRECTIVES = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Workers, R2 and the Firebase/YouTube endpoints the browser calls directly.
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: data: https:",
  `connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://*.r2.dev https://*.r2.cloudflarestorage.com${isDev ? " ws: http:" : ""}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const SECURITY_HEADERS: Record<string, string> = {
  "content-security-policy": CSP_DIRECTIVES,
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  // Speaking practice uses the Web Speech API, so the microphone has to stay
  // available to same-origin documents. Everything else is denied outright.
  "permissions-policy": "camera=(), microphone=(self), geolocation=(), payment=(), usb=()",
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-resource-policy": "same-origin",
  ...(isDev ? {} : { "strict-transport-security": "max-age=31536000; includeSubDomains" }),
};

const securityHeadersMiddleware = createMiddleware().server(async (ctx) => {
  // `next()` resolves to the request context, not a bare Response — the
  // rendered response lives on `result.response`.
  const result = await ctx.next();
  const response = result.response;
  if (!(response instanceof Response)) return result;

  // Mutate in place rather than rebuilding the Response, which would drop the
  // streaming body of an SSR HTML response.
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (response.headers.has(name)) continue;
    try {
      response.headers.set(name, value);
    } catch {
      // Immutable headers guard on some runtimes — skip rather than fail.
    }
  }
  // Server-function payloads must never sit in a shared cache. Static assets
  // and documents are left alone so browser/CDN caching still works.
  if (
    !response.headers.has("cache-control") &&
    response.status === 200 &&
    ctx.handlerType === "serverFn"
  ) {
    try {
      response.headers.set("cache-control", "no-store");
    } catch {
      // As above.
    }
  }
  return result;
});

export const startInstance = createStart(() => ({
  // Security headers first so that error responses rendered by
  // `errorMiddleware` are decorated too.
  requestMiddleware: [securityHeadersMiddleware, errorMiddleware, csrfMiddleware],
}));
