import { Router } from "express";
import { listUsers, getUser, updateUser, deleteUser, createUser, toggleUserStatus, getProfile, updateProfile, changePassword, getDashboard } from "../controllers/users.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { uuidParam, validate } from "../middleware/validate.js";
import { body } from "express-validator";

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List all users (admin only)
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [customer, provider, admin] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: Array of users }
 */
router.get("/", authenticate, authorize("admin"), listUsers);

router.post("/", authenticate, authorize("admin"),
  body("name").trim().isLength({ min: 2 }),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }).matches(/[0-9]/).matches(/[a-z]/).matches(/[A-Z]/),
  body("role").optional().isIn(["customer", "provider", "admin"]),
  validate,
  createUser,
);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: User profile }
 */
router.get("/profile", authenticate, getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update current user profile
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *     responses:
 *       200: { description: Profile updated }
 */
router.put("/profile", authenticate, updateProfile);

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     tags: [Users]
 *     summary: Change password
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200: { description: Password changed }
 */
router.post(
  "/change-password",
  authenticate,
  body("currentPassword").isLength({ min: 8 }),
  body("newPassword").isLength({ min: 8 }).matches(/[0-9]/).matches(/[a-z]/).matches(/[A-Z]/),
  validate,
  changePassword,
);

/**
 * @swagger
 * /api/users/dashboard:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin dashboard data
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: Dashboard KPIs and recent data }
 */
router.get("/dashboard", authenticate, authorize("admin"), getDashboard);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID (admin only)
 *     security: [{ cookieAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: User details }
 */
router.get("/:id", authenticate, authorize("admin"), uuidParam, validate, getUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user (admin only)
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
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *     responses:
 *       200: { description: User updated }
 */
router.put("/:id", authenticate, authorize("admin"), uuidParam, validate, updateUser);

router.delete("/:id", authenticate, authorize("admin"), uuidParam, validate, deleteUser);

/**
 * @swagger
 * /api/users/{id}/status:
 *   patch:
 *     tags: [Users]
 *     summary: Toggle user active status (admin only)
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
 *             required: [isActive]
 *             properties:
 *               isActive: { type: boolean }
 *     responses:
 *       200: { description: Status updated }
 */
router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  uuidParam,
  body("isActive").isBoolean(),
  validate,
  toggleUserStatus,
);

export default router;
