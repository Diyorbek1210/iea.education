/**
 * Local-only credential store used when Firebase is not configured (demo
 * mode). There is no server to authenticate against in that mode, so this is
 * obfuscation against casual inspection of localStorage — not a substitute for
 * Firebase Auth. It does mean a plaintext password never sits on disk.
 *
 * Hashing uses PBKDF2-SHA256 via WebCrypto with a per-user random salt.
 */

const STORAGE_KEY = "iea_credentials";

export interface DemoCredential {
  uid: string;
  email: string;
  /** "pbkdf2$<iterations>$<saltHex>$<hashHex>" */
  hash: string;
  createdAt: string;
}

type CredentialStore = Record<string, DemoCredential>;

const PBKDF2_ITERATIONS = 210_000;

function toHex(bytes: Uint8Array): string {
  let out = "";
  for (const byte of bytes) out += byte.toString(16).padStart(2, "0");
  return out;
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++)
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}

async function derive(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    keyMaterial,
    256,
  );
  return new Uint8Array(bits);
}

/** Constant-time comparison so timing does not leak the stored hash. */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toHex(salt)}$${toHex(hash)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iterationsRaw, saltHex, hashHex] = stored.split("$");
  if (scheme !== "pbkdf2" || !iterationsRaw || !saltHex || !hashHex) return false;
  const iterations = Number.parseInt(iterationsRaw, 10);
  if (!Number.isFinite(iterations) || iterations < 1) return false;
  try {
    const candidate = await derive(password, fromHex(saltHex), iterations);
    return timingSafeEqual(candidate, fromHex(hashHex));
  } catch {
    return false;
  }
}

function readStore(): CredentialStore {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as CredentialStore;
  } catch {
    return {};
  }
}

function writeStore(store: CredentialStore): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function registerDemoUser(email: string, password: string): Promise<string> {
  const key = normalizeEmail(email);
  const store = readStore();
  if (store[key]) throw new Error("This email is already registered.");
  const uid = crypto.randomUUID();
  store[key] = {
    uid,
    email: key,
    hash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  writeStore(store);
  return uid;
}

export async function authenticateDemoUser(
  email: string,
  password: string,
): Promise<DemoCredential> {
  const entry = readStore()[normalizeEmail(email)];
  if (!entry) {
    // Spend comparable time on unknown accounts so response timing does not
    // reveal whether an email is registered.
    await derive(password, crypto.getRandomValues(new Uint8Array(16)), PBKDF2_ITERATIONS);
    throw new Error("Incorrect email or password.");
  }
  if (!(await verifyPassword(password, entry.hash))) {
    throw new Error("Incorrect email or password.");
  }
  return entry;
}

/**
 * Drops any credential records left behind by older builds that stored
 * plaintext passwords, so a browser that visited the site before the upgrade
 * does not keep serving old secrets to anything that reads localStorage.
 */
export function purgeLegacyPlaintextCredentials(): void {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as Record<string, { password?: unknown; hash?: unknown }>;
    let dirty = false;
    for (const entry of Object.values(parsed)) {
      if (entry && typeof entry === "object" && "password" in entry) {
        delete entry.password;
        dirty = true;
      }
    }
    if (dirty) writeStore(parsed as CredentialStore);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
