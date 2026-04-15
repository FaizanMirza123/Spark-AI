import type { Request, Response } from "express";
import { Booking } from "../models/booking.js";
import { Service } from "../models/service.js";
import { User } from "../models/user.js";
import { Category } from "../models/category.js";
import { AppError } from "../middleware/error.js";

const BOOKING_INCLUDES = [
  { model: User, as: "Customer", attributes: ["id", "name", "email", "avatarUrl"] },
  { model: User, as: "Provider", attributes: ["id", "name", "email", "avatarUrl", "phone"] },
  { model: Service, include: [Category] },
];

function normalizeBooking(raw: Booking) {
  const j = raw.toJSON() as Record<string, unknown>;
  const cust = j.Customer as Record<string, unknown> | undefined;
  const prov = j.Provider as Record<string, unknown> | undefined;
  const svc = j.Service as Record<string, unknown> | undefined;
  delete j.Customer;
  delete j.Provider;
  delete j.Service;
  let service = null;
  if (svc) {
    const cat = svc.Category as Record<string, unknown> | undefined;
    delete svc.Category;
    service = { ...svc, category: cat ?? null };
  }
  return {
    ...j,
    customer: cust ? { ...cust, role: "customer" } : null,
    provider: prov ? { ...prov, role: "provider" } : null,
    service,
  };
}

export async function listBookings(req: Request, res: Response) {
  const { status, page = "1", limit = "20" } = req.query as Record<string, string>;
  const where: Record<string, unknown> = {};

  if (req.user!.role === "customer") where.customerId = req.user!.userId;
  else if (req.user!.role === "provider") where.providerId = req.user!.userId;

  if (status) where.status = status;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const bookings = await Booking.findAll({
    where,
    include: BOOKING_INCLUDES,
    limit: parseInt(limit),
    offset,
    order: [["createdAt", "DESC"]],
  });
  res.json(bookings.map(normalizeBooking));
}

export async function getBooking(req: Request, res: Response) {
  const booking = await Booking.findByPk(req.params.id as string, { include: BOOKING_INCLUDES });
  if (!booking) throw new AppError(404, "Booking not found");

  if (
    req.user!.role !== "admin" &&
    booking.customerId !== req.user!.userId &&
    booking.providerId !== req.user!.userId
  ) {
    throw new AppError(403, "Access denied");
  }
  res.json(normalizeBooking(booking));
}

export async function createBooking(req: Request, res: Response) {
  const { serviceId, scheduledDate, scheduledTime, address, notes } = req.body;
  const service = await Service.findByPk(serviceId);
  if (!service) throw new AppError(404, "Service not found");

  const platformFee = Number(service.price) * 0.05;
  const totalAmount = Number(service.price) + platformFee;

  const booking = await Booking.create({
    customerId: req.user!.userId,
    serviceId,
    providerId: service.providerId,
    scheduledDate,
    scheduledTime,
    address,
    notes: notes ?? "",
    totalAmount,
  });

  const full = await Booking.findByPk(booking.id, { include: BOOKING_INCLUDES });
  res.status(201).json(normalizeBooking(full!));
}

export async function updateBookingStatus(req: Request, res: Response) {
  const booking = await Booking.findByPk(req.params.id as string);
  if (!booking) throw new AppError(404, "Booking not found");

  const { role, userId } = req.user!;
  // Customers can only cancel their own bookings
  if (role === "customer") {
    if (booking.customerId !== userId) throw new AppError(403, "Access denied");
    if (req.body.status !== "cancelled") throw new AppError(403, "Customers may only cancel bookings");
  } else if (role === "provider" && booking.providerId !== userId) {
    throw new AppError(403, "Access denied");
  }

  const { status } = req.body;
  const allowed: Record<string, string[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["in-progress", "cancelled"],
    "in-progress": ["completed", "cancelled"],
  };

  const current = booking.status;
  if (!allowed[current]?.includes(status)) {
    throw new AppError(400, `Cannot transition from ${current} to ${status}`);
  }

  await booking.update({ status });
  const full = await Booking.findByPk(booking.id, { include: BOOKING_INCLUDES });
  res.json(normalizeBooking(full!));
}
