import { createServerFn } from "@tanstack/react-start";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

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
export const uploadToR2 = createServerFn({ method: "POST" })
  .validator(
    z.object({
      fileBase64: z.string(),
      fileName: z.string(),
      contentType: z.string(),
      folder: z.enum(["resources"]),
    }),
  )
  .handler(async ({ data }) => {
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

    const ext = data.fileName.split(".").pop() || "mp4";
    const key = `${data.folder}/${crypto.randomUUID()}.${ext}`;

    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });

    const buffer = Buffer.from(data.fileBase64, "base64");

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: data.contentType,
        }),
      );
    } catch (err) {
      console.error("[R2 upload error]", err);
      throw new Error(`R2 upload failed: ${err instanceof Error ? err.message : String(err)}`);
    }

    const objectUrl = publicUrl
      ? `${publicUrl.replace(/\/$/, "")}/${key}`
      : `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${key}`;

    return { objectUrl };
  });
