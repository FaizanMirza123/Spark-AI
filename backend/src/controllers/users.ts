import type { Request, Response } from "express";
import { User } from "../models/user.js";
import { Role } from "../models/role.js";
import { Booking } from "../models/booking.js";
import { Service } from "../models/service.js";
import { Category } from "../models/category.js";
import { AppError } from "../middleware/error.js";
import { fn, col, literal, Op } from "sequelize";

export async function listUsers(req: Request, res: Response) {
  const { role, search, page = "1", limit = "20" } = req.query as Record<string, string>;
  const where: Record<string, unknown> = {};
  if (search) where.name = { [Op.like]: `%${search}%` };

  const include: { model: typeof Role; where?: Record<string, unknown> }[] = [{ model: Role }];
  if (role) include[0].where = { name: role };

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const users = await User.findAll({
    where,
    include,
    limit: parseInt(limit),
    offset,
    order: [["createdAt", "DESC"]],
  });
  res.json(users.map((u) => u.toSafe()));
}

export async function getUser(req: Request, res: Response) {
  const user = await User.findByPk(req.params.id as string, { include: [Role] });
  if (!user) throw new AppError(404, "User not found");
  res.json(user.toSafe());
}

export async function updateUser(req: Request, res: Response) {
  const user = await User.findByPk(req.params.id as string, { include: [Role] });
  if (!user) throw new AppError(404, "User not found");
  const { name, email, phone, address } = req.body;
  await user.update({ name, email, phone, address });
  res.json(user.toSafe());
}

export async function toggleUserStatus(req: Request, res: Response) {
  const user = await User.findByPk(req.params.id as string, { include: [Role] });
  if (!user) throw new AppError(404, "User not found");
  await user.update({ isActive: req.body.isActive });
  res.json(user.toSafe());
}

export async function getProfile(req: Request, res: Response) {
  const user = await User.findByPk(req.user!.userId, { include: [Role] });
  if (!user) throw new AppError(404, "User not found");
  res.json(user.toSafe());
}

export async function updateProfile(req: Request, res: Response) {
  const user = await User.findByPk(req.user!.userId, { include: [Role] });
  if (!user) throw new AppError(404, "User not found");
  const { name, email, phone, address } = req.body;
  await user.update({ name, email, phone, address });
  res.json(user.toSafe());
}

export async function changePassword(req: Request, res: Response) {
  const user = await User.findByPk(req.user!.userId);
  if (!user) throw new AppError(404, "User not found");
  const { currentPassword, newPassword } = req.body;
  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError(400, "Current password is incorrect");
  }
  await user.update({ password: newPassword });
  res.json({ message: "Password updated" });
}

export async function getDashboard(_req: Request, res: Response) {
  const [totalUsers, totalBookings, totalRevenue, totalServices] = await Promise.all([
    User.count(),
    Booking.count(),
    Booking.sum("totalAmount", { where: { status: "completed" } }),
    Service.count({ where: { isActive: true } }),
  ]);

  const recentBookings = await Booking.findAll({
    include: [
      { model: User, as: "Customer", attributes: ["id", "name"] },
      { model: Service, attributes: ["id", "name"] },
    ],
    order: [["createdAt", "DESC"]],
    limit: 5,
  });

  const topServices = await Service.findAll({
    attributes: [
      "id",
      "name",
      [fn("COUNT", col("Bookings.id")), "bookingCount"],
    ],
    include: [{ model: Booking, attributes: [] }],
    group: ["Service.id"],
    order: [[literal("bookingCount"), "DESC"]],
    limit: 5,
    subQuery: false,
  });

  const normalizedBookings = recentBookings.map((b) => {
    const j = b.toJSON() as Record<string, unknown>;
    return { ...j, customer: j.Customer, service: j.Service, Customer: undefined, Service: undefined };
  });

  res.json({
    kpis: {
      totalRevenue: totalRevenue ?? 0,
      totalUsers,
      totalBookings,
      totalServices,
    },
    recentBookings: normalizedBookings,
    topServices,
  });
}
