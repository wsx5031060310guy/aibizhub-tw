import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Partner program — every authenticated user gets a stable referral code
 * derived from a hash of their user id (so signing in from a fresh device
 * always produces the same code, no DB lookup required). The code is
 * registered in a JSONL file on first request so admins can see who's been
 * issued a code. Once we move to real DB, swap the file with a Prisma table.
 */

const REGISTRY_PATH =
  process.env.AIBIZHUB_PARTNER_LOG ??
  path.join(process.cwd(), ".local", "partner-registry.jsonl");

const PARTNER_CODE_SECRET =
  process.env.AIBIZHUB_PARTNER_SECRET ?? process.env.AUTH_SECRET ?? "aibizhub-default-salt";

export type PartnerRegistration = {
  code: string;
  userId: string;
  email: string | null;
  registeredAt: string;
};

/**
 * Deterministic 8-char base32-ish code derived from user id + secret salt.
 * Avoids confusable characters (0/O, 1/I, etc.) so partners can transcribe
 * verbally without ambiguity.
 */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function deriveCodeFromUserId(userId: string): string {
  const h = crypto
    .createHmac("sha256", PARTNER_CODE_SECRET)
    .update(userId)
    .digest();
  let code = "";
  for (let i = 0; i < 8; i += 1) {
    code += ALPHABET[h[i] % ALPHABET.length];
  }
  return code;
}

async function readRegistry(): Promise<PartnerRegistration[]> {
  try {
    const raw = await fs.readFile(REGISTRY_PATH, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as PartnerRegistration;
        } catch {
          return null;
        }
      })
      .filter((r): r is PartnerRegistration => r !== null);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function appendRegistry(record: PartnerRegistration): Promise<void> {
  await fs.mkdir(path.dirname(REGISTRY_PATH), { recursive: true });
  await fs.appendFile(REGISTRY_PATH, JSON.stringify(record) + "\n", "utf8");
}

/**
 * Returns the partner code for the user, registering them in the registry if
 * they haven't requested one before. Idempotent — repeated calls don't create
 * duplicate registrations.
 */
export async function getOrIssuePartnerCode(input: {
  userId: string;
  email: string | null;
}): Promise<{ code: string; isNew: boolean }> {
  const code = deriveCodeFromUserId(input.userId);
  const registry = await readRegistry();
  const existing = registry.find((r) => r.userId === input.userId);
  if (existing) return { code, isNew: false };

  await appendRegistry({
    code,
    userId: input.userId,
    email: input.email,
    registeredAt: new Date().toISOString(),
  });
  return { code, isNew: true };
}

export async function listPartners(): Promise<PartnerRegistration[]> {
  return readRegistry();
}
