const WINDOW_MS = 60_000;
const MAX_REQUESTS = 3;

const requests = new Map<string, number[]>();

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const timestamps = requests.get(ip) || [];
  const windowStart = now - WINDOW_MS;
  const recent = timestamps.filter((t) => t > windowStart);

  if (recent.length >= MAX_REQUESTS) {
    const oldestInWindow = recent[0];
    const retryAfter = Math.ceil((oldestInWindow + WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  recent.push(now);
  requests.set(ip, recent);
  return { allowed: true };
}
