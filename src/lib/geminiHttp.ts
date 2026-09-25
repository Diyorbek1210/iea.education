import { request as httpsRequest } from "node:https";

export function geminiFetch(
  url: string,
  init: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    signal?: AbortSignal;
  } = {},
): Promise<Response> {
  const u = new URL(url);
  const body = init.body ?? "";
  return new Promise((resolve, reject) => {
    const req = httpsRequest(
      {
        hostname: u.hostname,
        port: 443,
        path: u.pathname + u.search,
        method: init.method ?? "GET",
        headers: {
          ...(init.headers ?? {}),
          "Content-Length": Buffer.byteLength(body),
        },
        family: 4,
        signal: init.signal,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        res.on("end", () => {
          const headers = new Headers();
          for (const [key, value] of Object.entries(res.headers)) {
            if (value === undefined) continue;
            if (Array.isArray(value)) {
              for (const v of value) headers.append(key, v);
            } else {
              headers.set(key, value as string);
            }
          }
          resolve(
            new Response(Buffer.concat(chunks), {
              status: res.statusCode ?? 500,
              headers,
            }),
          );
        });
      },
    );
    req.on("error", (err) => reject(err));
    if (body) req.write(body);
    req.end();
  });
}

const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException("Aborted", "AbortError"));
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * POSTs to the Gemini API with retry + exponential backoff for transient
 * failures (network drops and 408/429/5xx — e.g. "model is experiencing
 * high demand"). Returns the first usable response, or the last failed one
 * once retries are exhausted so callers can surface the real error.
 */
export async function geminiFetchWithRetry(
  url: string,
  init: {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    signal?: AbortSignal;
  } = {},
  retries = 4,
): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    let response: Response | null = null;
    try {
      response = await geminiFetch(url, init);
      if (response.ok || !RETRYABLE_STATUS.has(response.status)) return response;
    } catch (err) {
      if (attempt >= retries || init.signal?.aborted) throw err;
    }
    if (attempt >= retries) return response as Response;
    // Drain the abandoned response so the connection can be reused.
    response?.arrayBuffer().catch(() => undefined);
    await sleep(Math.min(700 * 2 ** attempt, 8000), init.signal);
  }
}
