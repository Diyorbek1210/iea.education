/**
 * Server-only security helpers: client IP resolution and rate limiting.
 *
 * Everything here runs inside server functions only. Never import this module
 * from a component — it reads request state via unctx-backed accessors.
 */

/* ------------------------------------------------------------------ *
 * Client identity
 * ------------------------------------------------------------------ */

import {
  getRequestHeader,
  getRequestIP,
  setResponseHeader,
  setResponseStatus,
} from "@tanstack/react-start/server";

/**
 * Resolves the caller IP for rate-limiting buckets.
 *
 * The app is deployed behind a CDN/proxy (Render, Cloudflare), so
 * `x-forwarded-for` is the only reliable source. It is attacker-controlled
 * when the app is reachable directly, which only weakens the limit for that
 * one attacker — it never grants access — so it is safe to prefer here.
 */
export function clientIp(): string {
  const forwarded = getRequestIP({ xForwardedFor: true });
  if (forwarded) return forwarded;
  const direct = getRequestIP();
  if (direct) return direct.replace(/^::ffff:/, "");
  return getRequestHeader("cf-connecting-ip") ?? "unknown";
}

/* ------------------------------------------------------------------ *
 * Fixed-window rate limiter
 * ------------------------------------------------------------------ */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Keeps the limiter map from growing without bound on long-lived instances. */
const SWEEP_INTERVAL_MS = 60_000;
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  /** Seconds until the current window resets. */
  retryAfter: number;
}

/**
 * Consumes one unit from a named bucket for the current caller.
 *
 * State is per-instance and in-memory: on a horizontally scaled deployment
 * each replica enforces its own window, which is the correct trade-off here —
 * it needs no external store and no shared-secret infrastructure, and still
 * removes the "one client can drain the Gemini key" failure mode.
 */
export function consumeRateLimit(
  scope: string,
  limit: number,
  windowMs: number,
  keySuffix?: string,
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const key = keySuffix ? `${scope}:${keySuffix}` : scope;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  bucket.count += 1;
  const remaining = Math.max(0, limit - bucket.count);
  if (bucket.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, remaining, retryAfter: 0 };
}

export class RateLimitError extends Error {
  /** Lets the Start error handler emit 429 instead of a generic 500. */
  readonly statusCode = 429;
  readonly retryAfter: number;

  constructor(scope: string, retryAfter: number) {
    super(`Too many ${scope} requests. Try again in ${retryAfter}s.`);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

/**
 * Rate limits an action, keyed by caller IP plus an optional extra dimension
 * (authenticated uid) so one user cannot exhaust a shared bucket.
 *
 * The response status and `Retry-After` are set before throwing: Start's server
 * function error handler reads them off the ambient response, so a rejected
 * caller gets a real 429 with a machine-readable backoff hint instead of an
 * opaque 500.
 */
export function enforceRateLimit(
  scope: string,
  limit: number,
  windowMs: number,
  subject?: string,
): void {
  const suffix = subject ? `${clientIp()}|${subject}` : clientIp();
  const result = consumeRateLimit(scope, limit, windowMs, suffix);
  if (result.ok) return;

  try {
    setResponseStatus(429);
    setResponseHeader("retry-after", String(result.retryAfter));
  } catch {
    // Not inside a request scope — the thrown statusCode still applies.
  }
  throw new RateLimitError(scope, result.retryAfter);
}

/* ------------------------------------------------------------------ *
 * Origin checks
 * ------------------------------------------------------------------ */

/**
 * Rejects browser requests whose Origin header disagrees with the Host.
 *
 * The Start CSRF middleware already guards server functions; this is the
 * second lock on the door and costs one header comparison.
 */
export function assertSameOrigin(): void {
  const origin = getRequestHeader("origin");
  if (!origin) return; // non-browser client (curl, health checks)

  const host = getRequestHeader("x-forwarded-host") ?? getRequestHeader("host");
  if (!host) return;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new Error("Cross-origin request blocked");
  }
  if (originHost !== host) throw new Error("Cross-origin request blocked");
}
