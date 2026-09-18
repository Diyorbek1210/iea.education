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
