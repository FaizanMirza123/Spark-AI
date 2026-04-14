import { body, param, query } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    return;
  }
  next();
}

export const loginRules = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];

export const signupRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 8 })
    .matches(/[0-9]/)
    .matches(/[a-z]/)
    .matches(/[A-Z]/)
    .withMessage("Password must be 8+ chars with uppercase, lowercase, and number"),
  body("confirmPassword").custom((val, { req }) => {
    if (val !== req.body.password) throw new Error("Passwords don't match");
    return true;
  }),
];

export const bookingRules = [
  body("serviceId").isUUID().withMessage("Valid service ID required"),
  body("scheduledDate").isISO8601().withMessage("Valid date required"),
  body("scheduledTime").matches(/^\d{2}:\d{2}$/).withMessage("Time format HH:MM required"),
  body("address").trim().isLength({ min: 5 }).withMessage("Address must be at least 5 characters"),
  body("notes").optional().trim(),
];

export const serviceRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("description").trim().isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
  body("categoryId").isUUID().withMessage("Valid category ID required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be positive"),
  body("duration").isInt({ gt: 0 }).withMessage("Duration must be a positive integer"),
  body("imageUrl").optional().isURL().withMessage("Valid URL required"),
];

export const uuidParam = param("id").isUUID().withMessage("Valid ID required");

export const paginationQuery = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
];
