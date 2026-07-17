import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/db";
import { UserAccountModel } from "@/lib/models/user-account";
import { UserSessionModel } from "@/lib/models/user-session";

export const sessionCookieName = "oppfinder-session";
const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;

export type CurrentAccount = {
  id: string;
  email: string;
};

export function normalizeEmail(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function validateEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export function validatePassword(value: string) {
  return value.length >= 8 && value.length <= 128;
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const hash = scryptSync(password, salt, 64).toString("base64url");

  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, hash] = storedHash.split("$");

  if (algorithm !== "scrypt" || !salt || !hash) {
    return false;
  }

  const stored = Buffer.from(hash, "base64url");
  const candidate = scryptSync(password, salt, stored.length);

  return stored.length === candidate.length && timingSafeEqual(stored, candidate);
}

export async function createSession(userId: string) {
  await connectToDatabase();

  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + sessionMaxAgeSeconds * 1000);

  await UserSessionModel.create({
    userId,
    tokenHash,
    expiresAt
  });

  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: sessionMaxAgeSeconds
  });
  cookieStore.delete("oppfinder-profile");
  cookieStore.delete("oppfinder-session-cleared");
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (token) {
    await connectToDatabase();
    await UserSessionModel.deleteOne({ tokenHash: hashSessionToken(token) });
  }

  cookieStore.delete(sessionCookieName);
  cookieStore.delete("oppfinder-profile");
  cookieStore.delete("oppfinder-session-cleared");
}

export async function getCurrentAccount(): Promise<CurrentAccount | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (!token || !process.env.MONGODB_URI) {
    return null;
  }

  await connectToDatabase();

  const session = await UserSessionModel.findOne({
    tokenHash: hashSessionToken(token),
    expiresAt: { $gt: new Date() }
  }).lean<{
    userId: { toString(): string };
  }>();

  if (!session) {
    return null;
  }

  const account = await UserAccountModel.findById(session.userId).lean<{
    _id: { toString(): string };
    email: string;
  }>();

  if (!account) {
    return null;
  }

  return {
    id: account._id.toString(),
    email: account.email
  };
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("base64url");
}
