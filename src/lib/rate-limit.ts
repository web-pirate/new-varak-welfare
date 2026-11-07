const hits = new Map<string, number[]>();

/** True if `key` may proceed: at most `max` calls per `windowMs`.
 * shortcut: in-memory, so each serverless instance counts on its own; move to Upstash/Redis if abuse persists. */
export function allow(key: string, max: number, windowMs: number, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 10_000) for (const [k, v] of hits) if (now - v[v.length - 1] >= windowMs) hits.delete(k);
  return true;
}
