/**
 * Upload allowlist shared by the client (pre-flight feedback) and the server
 * (authoritative check). The server copy is the one that matters — the client
 * import only avoids uploading something the server will reject.
 */

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
export const MAX_UPLOAD_LABEL = "25 MB";

export type UploadFolder = "resources" | "shadowing";

interface AllowedType {
  /** MIME types accepted for this upload. */
  types: string[];
  /** Canonical extension stored on R2, keyed by MIME type. */
  extByType: Record<string, string>;
}

const AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/webm",
  "audio/ogg",
];
const AUDIO_EXT: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/webm": "weba",
  "audio/ogg": "ogg",
};

const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const VIDEO_EXT: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

const DOC_EXT: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "text/plain": "txt",
  "text/csv": "csv",
  "text/vtt": "vtt",
  "application/json": "json",
};

const POLICY: Record<UploadFolder, AllowedType> = {
  resources: { types: Object.keys(DOC_EXT), extByType: DOC_EXT },
  shadowing: { types: [...AUDIO_TYPES, ...VIDEO_TYPES], extByType: { ...AUDIO_EXT, ...VIDEO_EXT } },
};

function normalizeMime(mime: string): string {
  return mime.split(";")[0]!.trim().toLowerCase();
}

/** Resolves the R2 object extension for a MIME type, or null if disallowed. */
export function extensionForMime(folder: UploadFolder, mime: string): string | null {
  return POLICY[folder].extByType[normalizeMime(mime)] ?? null;
}

export function isAllowedMime(folder: UploadFolder, mime: string): boolean {
  return extensionForMime(folder, mime) !== null;
}

export function allowedMimeList(folder: UploadFolder): string {
  return POLICY[folder].types.join(", ");
}

export class UploadRejected extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadRejected";
  }
}

/**
 * Derives the byte length of a base64 payload without decoding it, so an
 * oversized body is rejected before the buffer is allocated.
 */
export function decodedBase64Bytes(base64: string): number {
  const clean = base64.replace(/[^A-Za-z0-9+/=]/g, "");
  const padding = clean.endsWith("==") ? 2 : clean.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((clean.length * 3) / 4) - padding);
}

/**
 * Checks the leading bytes of a file against its declared MIME type. Catches
 * a renamed executable or HTML payload, both of which matter because uploads
 * are served back from the R2 public bucket under the app's own origin path.
 */
export function sniffMatches(buffer: Uint8Array, mime: string): boolean {
  const startsWith = (...bytes: number[]) => bytes.every((byte, index) => buffer[index] === byte);

  const ascii = (start: number, length: number) => {
    if (buffer.length < start + length) return "";
    let out = "";
    for (let i = start; i < start + length; i++) out += String.fromCharCode(buffer[i]!);
    return out;
  };

  switch (normalizeMime(mime)) {
    case "application/pdf":
      return ascii(0, 5) === "%PDF-";
    case "audio/mpeg":
    case "audio/mp3":
      // ID3 tag or a raw MPEG frame sync.
      return startsWith(0x49, 0x44, 0x33) || (buffer[0] === 0xff && (buffer[1]! & 0xe0) === 0xe0);
    case "audio/wav":
    case "audio/x-wav":
      return ascii(0, 4) === "RIFF" && ascii(8, 4) === "WAVE";
    case "audio/ogg":
      return ascii(0, 4) === "OggS";
    case "audio/webm":
    case "video/webm":
      return buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3;
    case "video/mp4":
    case "video/quicktime":
      // ISO base media file format: 4-byte size then "ftyp".
      return ascii(4, 4) === "ftyp";
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      // Legacy OLE2 and modern ZIP/OOXML containers.
      return (
        startsWith(0xd0, 0xcf, 0x11, 0xe0) ||
        (startsWith(0x50, 0x4b, 0x03, 0x04) && ascii(30, 2) === "PK")
      );
    case "text/plain":
    case "text/csv":
    case "text/vtt":
    case "application/json": {
      // Reject binary masquerading as text: control bytes other than tab/CR/LF.
      const limit = Math.min(buffer.length, 1024);
      for (let i = 0; i < limit; i++) {
        const byte = buffer[i]!;
        const isAllowedByte =
          byte === 9 || byte === 10 || byte === 13 || (byte >= 32 && byte !== 127);
        if (!isAllowedByte) return false;
      }
      return true;
    }
    default:
      return true;
  }
}

/**
 * Full server-side upload validation: size, declared type, real type, and a
 * canonical extension derived from the MIME type rather than the user-supplied
 * filename, which removes the traversal vector entirely.
 */
export function validateUpload(input: {
  folder: UploadFolder;
  fileName: string;
  contentType: string;
  buffer: Uint8Array;
}): { key: string; contentType: string } {
  const { folder, buffer, contentType } = input;

  if (buffer.byteLength === 0) throw new UploadRejected("The uploaded file is empty.");
  if (buffer.byteLength > MAX_UPLOAD_BYTES) {
    throw new UploadRejected(`Files must be ${MAX_UPLOAD_LABEL} or smaller.`);
  }

  const extension = extensionForMime(folder, contentType);
  if (!extension) {
    throw new UploadRejected(
      `That file type is not allowed here. Allowed: ${allowedMimeList(folder)}.`,
    );
  }

  if (!sniffMatches(buffer, contentType)) {
    throw new UploadRejected("The file contents do not match its file type.");
  }

  const safeName = input.fileName
    .replace(/[^A-Za-z0-9._ -]/g, "")
    .replace(/\.{2,}/g, ".")
    .slice(0, 80)
    .trim();
  const stem =
    safeName
      .replace(/\.[^.]*$/, "")
      .replace(/[._ -]+$/, "")
      .slice(0, 40) || "upload";

  return {
    key: `${folder}/${Date.now().toString(36)}-${crypto.randomUUID()}-${stem}.${extension}`,
    contentType: normalizeMime(contentType),
  };
}
