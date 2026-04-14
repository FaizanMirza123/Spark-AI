import { Router } from "express";
import { listServices, getService, createService, updateService, listCategories } from "../controllers/services.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { serviceRules, uuidParam, validate } from "../middleware/validate.js";

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Services]
 *     summary: List all service categories
 *     responses:
 *       200: { description: Array of categories }
 */
router.get("/categories", listCategories);

/**
 * @swagger
 * /api/services:
 *   get:
 *     tags: [Services]
 *     summary: List services with optional filters
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter by category slug
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by service name
 *     responses:
 *       200: { description: Array of services }
 */
router.get("/services", listServices);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     tags: [Services]
 *     summary: Get service by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Service details }
 *       404: { description: Not found }
 */
router.get("/services/:id", uuidParam, validate, getService);

/**
 * @swagger
 * /api/services:
 *   post:
 *     tags: [Services]
 *     summary: Create a new service (admin/provider only)
 *     security: [{ cookieAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, categoryId, price, duration]
 *             properties:
 *               name: { type: string, example: "Deep Cleaning" }
 *               description: { type: string, example: "Full home deep cleaning service" }
 *               categoryId: { type: string, format: uuid }
 *               price: { type: number, example: 120 }
 *               duration: { type: integer, example: 180 }
 *               imageUrl: { type: string }
 *     responses:
 *       201: { description: Service created }
 */
router.post("/services", authenticate, authorize("admin", "provider"), serviceRules, validate, createService);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     tags: [Services]
 *     summary: Update a service (admin only)
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
 *               description: { type: string }
 *               price: { type: number }
 *               duration: { type: integer }
 *               isActive: { type: boolean }
 *     responses:
 *       200: { description: Service updated }
 */
router.put("/services/:id", authenticate, authorize("admin"), uuidParam, validate, updateService);

export default router;
