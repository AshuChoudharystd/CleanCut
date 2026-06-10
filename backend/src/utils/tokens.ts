import jwt from "jsonwebtoken";

const USER_ACCESS_TTL = "15m";
const USER_REFRESH_TTL = "7d";
const ADMIN_ACCESS_TTL = "15m";
const ADMIN_REFRESH_TTL = "14d";

function getUserSecret(): string {
  return process.env.USER_JWT_SECRET as string;
}

function getAdminSecret(): string {
  return process.env.ADMIN_JWT_SECRET as string;
}

function getUserRefreshSecret(): string {
  return process.env.USER_REFRESH_SECRET || `${getUserSecret()}:refresh`;
}

function getAdminRefreshSecret(): string {
  return process.env.ADMIN_REFRESH_SECRET || `${getAdminSecret()}:refresh`;
}

export function issueUserSession(userId: string) {
  const accessToken = jwt.sign(
    { userId, type: "access" },
    getUserSecret(),
    { expiresIn: USER_ACCESS_TTL }
  );
  const refreshToken = jwt.sign(
    { userId, type: "refresh" },
    getUserRefreshSecret(),
    { expiresIn: USER_REFRESH_TTL }
  );
  return { accessToken, refreshToken };
}

export function issueAdminSession(adminId: string) {
  const accessToken = jwt.sign(
    { adminId, type: "access" },
    getAdminSecret(),
    { expiresIn: ADMIN_ACCESS_TTL }
  );
  const refreshToken = jwt.sign(
    { adminId, type: "refresh" },
    getAdminRefreshSecret(),
    { expiresIn: ADMIN_REFRESH_TTL }
  );
  return { accessToken, refreshToken };
}

export function verifyUserAccessToken(token: string): string {
  const decoded = jwt.verify(token, getUserSecret()) as { userId: string; type?: string };
  if (decoded.type && decoded.type !== "access") {
    throw new Error("Invalid token type");
  }
  return decoded.userId;
}

export function verifyAdminAccessToken(token: string): string {
  const decoded = jwt.verify(token, getAdminSecret()) as { adminId: string; type?: string };
  if (decoded.type && decoded.type !== "access") {
    throw new Error("Invalid token type");
  }
  return decoded.adminId;
}

export function verifyUserRefreshToken(token: string): string {
  const decoded = jwt.verify(token, getUserRefreshSecret()) as { userId: string; type: string };
  if (decoded.type !== "refresh") {
    throw new Error("Invalid token type");
  }
  return decoded.userId;
}

export function verifyAdminRefreshToken(token: string): string {
  const decoded = jwt.verify(token, getAdminRefreshSecret()) as { adminId: string; type: string };
  if (decoded.type !== "refresh") {
    throw new Error("Invalid token type");
  }
  return decoded.adminId;
}
