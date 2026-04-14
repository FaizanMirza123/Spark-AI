import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { User } from "../models/user.js";
import { Role } from "../models/role.js";
import { AppError } from "./error.js";

export interface AuthPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.["session-token"] as string | undefined;
  if (!token) throw new AppError(401, "Authentication required");

  try {
    const payload = jwt.verify(token, env.jwt.secret) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError(401, "Authentication required");
    if (!roles.includes(req.user.role)) throw new AppError(403, "Insufficient permissions");
    next();
  };
}

export function signToken(user: User): string {
  const role = user.Role?.name ?? "customer";
  return jwt.sign({ userId: user.id, role } satisfies AuthPayload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  } as jwt.SignOptions);
}

export async function loadFullUser(userId: string) {
  return User.findByPk(userId, { include: [Role] });
}
