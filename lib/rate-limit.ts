import { headers } from "next/headers";

type Bucket = {
  count: number;
  resetAt: number;
};

declare global {
  var oppfinderRateLimit:
    | {
        buckets: Map<string, Bucket>;
      }
    | undefined;
}

const store = global.oppfinderRateLimit ?? {
  buckets: new Map<string, Bucket>()
};

global.oppfinderRateLimit = store;

export async function checkRateLimit(
  action: string,
  limit: number,
  windowMs: number
) {
  const headerStore = await headers();
  const forwardedFor = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip =
    forwardedFor ||
    headerStore.get("x-real-ip") ||
    headerStore.get("cf-connecting-ip") ||
    "local";
  const key = `${action}:${ip}`;
  const now = Date.now();
  const bucket = store.buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    store.buckets.set(key, {
      count: 1,
      resetAt: now + windowMs
    });
    return { ok: true };
  }

  if (bucket.count >= limit) {
    return { ok: false };
  }

  bucket.count += 1;
  return { ok: true };
}
