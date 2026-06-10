import { Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
};

const ACCESS_MAX_AGE = 15 * 60 * 1000;
const USER_REFRESH_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const ADMIN_REFRESH_MAX_AGE = 14 * 24 * 60 * 60 * 1000;

export function setUserAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {
  res.cookie("userToken", accessToken, {
    ...baseCookieOptions,
    maxAge: ACCESS_MAX_AGE,
  });
  res.cookie("userRefreshToken", refreshToken, {
    ...baseCookieOptions,
    maxAge: USER_REFRESH_MAX_AGE,
  });
}

export function setAdminAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {
  res.cookie("adminToken", accessToken, {
    ...baseCookieOptions,
    maxAge: ACCESS_MAX_AGE,
  });
  res.cookie("adminRefreshToken", refreshToken, {
    ...baseCookieOptions,
    maxAge: ADMIN_REFRESH_MAX_AGE,
  });
}

export function clearUserAuthCookies(res: Response): void {
  res.clearCookie("userToken", baseCookieOptions);
  res.clearCookie("userRefreshToken", baseCookieOptions);
}

export function clearAdminAuthCookies(res: Response): void {
  res.clearCookie("adminToken", baseCookieOptions);
  res.clearCookie("adminRefreshToken", baseCookieOptions);
}
