import { Router } from "express";
import { signup, login, me, logout, forgotPassword } from "../controllers/auth.js";
import { authenticate } from "../middleware/auth.js";
import { loginRules, signupRules, validate } from "../middleware/validate.js";

const router = Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new customer account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, confirmPassword]
 *             properties:
 *               name: { type: string, example: "John Doe" }
 *               email: { type: string, example: "john@example.com" }
 *               password: { type: string, example: "Password1!" }
 *               confirmPassword: { type: string, example: "Password1!" }
 *     responses:
 *       201: { description: User created }
 *       409: { description: Email already registered }
 */
router.post("/signup", signupRules, validate, signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "admin@sparkai.com" }
 *               password: { type: string, example: "Admin123!" }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
router.post("/login", loginRules, validate, login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current authenticated user
 *     security: [{ cookieAuth: [] }]
 *     responses:
 *       200: { description: Current user }
 *       401: { description: Not authenticated }
 */
router.get("/me", authenticate, me);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Log out and clear session
 *     responses:
 *       200: { description: Logged out }
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, example: "john@example.com" }
 *     responses:
 *       200: { description: Reset link sent if account exists }
 */
router.post("/forgot-password", forgotPassword);

export default router;
