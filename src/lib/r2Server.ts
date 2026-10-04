import { createServerFn } from "@tanstack/react-start";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

import { assertSameOrigin, enforceRateLimit } from "./server-security";
import {
  MAX_UPLOAD_BYTES,
  decodedBase64Bytes,
  validateUpload,
  type UploadFolder,
} from "./uploadPolicy";

/**
 * Server function that uploads a file to Cloudflare R2 via the S3-compatible
 * API. The file is sent from the browser to this server function, which then
 * uploads it to R2. Credentials stay server-side, no CORS configuration needed.
 *
 * Required env vars (server-only, no VITE_ prefix):
 *   R2_ACCOUNT_ID       – Cloudflare account ID
 *   R2_ACCESS_KEY_ID    – R2 API token access key
 *   R2_SECRET_ACCESS_KEY – R2 API token secret key
 *   R2_BUCKET_NAME      – R2 bucket name
 *
 * Optional:
 *   R2_PUBLIC_URL       – public base URL (e.g. https://pub-xxx.r2.dev)
 */

const UPLOAD_LIMIT = 30;
const UPLOAD_WINDOW_MS = 60 * 60 * 1000;

const uploadInput = z.object({
  fileBase64: z.string().min(1),
  fileName: z.string().min(1).max(300),
  contentType: z.string().min(1).max(200),
  folder: z.enum(["resources", "shadowing"]),
});

export const uploadToR2 = createServerFn({ method: "POST" })
  .validator(uploadInput)
  .handler(async ({ data }) => {
    assertSameOrigin();
    enforceRateLimit("r2-upload", UPLOAD_LIMIT, UPLOAD_WINDOW_MS);

    const accountId = process.env["R2_ACCOUNT_ID"];
    const accessKeyId = process.env["R2_ACCESS_KEY_ID"];
    const secretAccessKey = process.env["R2_SECRET_ACCESS_KEY"];
    const bucketName = process.env["R2_BUCKET_NAME"];
    const publicUrl = process.env["R2_PUBLIC_URL"];

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      throw new Error(
        `R2 upload isn't configured yet. Missing vars: ${[
          !accountId && "R2_ACCOUNT_ID",
          !accessKeyId && "R2_ACCESS_KEY_ID",
          !secretAccessKey && "R2_SECRET_ACCESS_KEY",
          !bucketName && "R2_BUCKET_NAME",
        ]
          .filter(Boolean)
          .join(", ")}`,
      );
    }

    // Reject on the encoded length first so an oversized body never reaches
    // Buffer.from(), then on the real decoded length.
    const declaredBytes = decodedBase64Bytes(data.fileBase64);
    if (declaredBytes > MAX_UPLOAD_BYTES) {
      throw new Error(`Files must be ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB or smaller.`);
    }

    let buffer: Uint8Array;
    try {
      buffer = new Uint8Array(Buffer.from(data.fileBase64, "base64"));
    } catch {
      throw new Error("The uploaded file could not be decoded.");
    }

    const { key, contentType } = validateUpload({
      folder: data.folder as UploadFolder,
      fileName: data.fileName,
      contentType: data.contentType,
      buffer,
    });

    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: contentType,
          // Defence in depth: uploads are served back from a public bucket on
          // the app's own path, so anything the browser might treat as active
          // content is forced to download instead of render. Media types can
          // never execute script, so they stay inline for playback.
          ContentDisposition:
            data.folder === "shadowing"
              ? "inline"
              : `attachment; filename="${key.slice(key.lastIndexOf("/") + 1)}"`,
          CacheControl: "private, max-age=86400",
          Metadata: { source: "iea-upload" },
        }),
      );
    } catch (err) {
      console.error("[R2 upload error]", err);
      throw new Error("The file could not be stored. Please try again.");
    }

    const objectUrl = publicUrl
      ? `${publicUrl.replace(/\/$/, "")}/${key}`
      : `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`;

    return { objectUrl };
  });
