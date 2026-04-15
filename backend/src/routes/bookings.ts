import { Router } from "express";
import { listBookings, getBooking, createBooking, updateBookingStatus } from "../controllers/bookings.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { bookingRules, uuidParam, validate } from "../middleware/validate.js";
import { body } from "express-validator";

const router = Router();

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     tags: [Bookings]
 *     summary: List bookings (filtered by user role)
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, confirmed, in-progress, completed, cancelled] }
 *     responses:
 *       200: { description: Array of bookings }
 */
router.get("/", authenticate, listBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     tags: [Bookings]
 *     summary: Get booking by ID
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Booking details }
 *       404: { description: Not found }
 */
router.get("/:id", authenticate, uuidParam, validate, getBooking);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Create a new booking
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serviceId, scheduledDate, scheduledTime, address]
 *             properties:
 *               serviceId: { type: string, format: uuid }
 *               scheduledDate: { type: string, format: date, example: "2026-04-20" }
 *               scheduledTime: { type: string, example: "10:00" }
 *               address: { type: string, example: "123 Main St" }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Booking created }
 */
router.post("/", authenticate, bookingRules, validate, createBooking);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   patch:
 *     tags: [Bookings]
 *     summary: Update booking status
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [confirmed, in-progress, completed, cancelled] }
 *     responses:
 *       200: { description: Status updated }
 */
router.patch(
  "/:id/status",
  authenticate,
  uuidParam,
  body("status").isIn(["confirmed", "in-progress", "completed", "cancelled"]),
  validate,
  updateBookingStatus,
);

export default router;
