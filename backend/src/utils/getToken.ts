import { Request } from "express";

export function getBearerOrCookieToken(
  req: Request,
  cookieName: string
): string | undefined {
  const header = req.headers.authorization;
  if (header) return header;
  const cookies = req.cookies as Record<string, string> | undefined;
  return cookies?.[cookieName];
}

export function getRefreshCookieToken(
  req: Request,
  cookieName: string
): string | undefined {
  const cookies = req.cookies as Record<string, string> | undefined;
  return cookies?.[cookieName];
}
