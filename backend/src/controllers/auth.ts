import type { Request, Response } from "express";
import { User } from "../models/user.js";
import { Role } from "../models/role.js";
import { signToken, loadFullUser } from "../middleware/auth.js";
import { AppError } from "../middleware/error.js";
import env from "../config/env.js";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export async function signup(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new AppError(409, "Email already registered");

  const role = await Role.findOne({ where: { name: "customer" } });
  if (!role) throw new AppError(500, "Role not found");

  const user = await User.create({ name, email, password, roleId: role.id });
  const fullUser = await loadFullUser(user.id);
  if (!fullUser) throw new AppError(500, "User creation failed");

  const token = signToken(fullUser);
  res.cookie("session-token", token, COOKIE_OPTS);
  res.cookie("user-role", fullUser.Role?.name ?? "customer", { ...COOKIE_OPTS, httpOnly: false });
  res.status(201).json(fullUser.toSafe());
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email }, include: [Role] });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError(401, "Invalid email or password");
  }
  if (!user.isActive) throw new AppError(403, "Account deactivated");

  const token = signToken(user);
  res.cookie("session-token", token, COOKIE_OPTS);
  res.cookie("user-role", user.Role?.name ?? "customer", { ...COOKIE_OPTS, httpOnly: false });
  res.json(user.toSafe());
}

export async function me(req: Request, res: Response) {
  const user = await loadFullUser(req.user!.userId);
  if (!user) throw new AppError(404, "User not found");
  res.json(user.toSafe());
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("session-token", { path: "/" });
  res.clearCookie("user-role", { path: "/" });
  res.json({ message: "Logged out" });
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.json({ message: "If an account exists, a reset link was sent." });
    return;
  }
  res.json({ message: "If an account exists, a reset link was sent." });
}
