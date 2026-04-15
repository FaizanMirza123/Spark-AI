import type { Request, Response } from "express";
import { Service } from "../models/service.js";
import { Category } from "../models/category.js";
import { User } from "../models/user.js";
import { AppError } from "../middleware/error.js";
import { Op } from "sequelize";

export async function listServices(req: Request, res: Response) {
  const { category, search, page = "1", limit = "20", showAll } = req.query as Record<string, string>;
  const where: Record<string, unknown> = showAll === "true" ? {} : { isActive: true };
  if (category) {
    const cat = await Category.findOne({ where: { slug: category } });
    if (!cat) { res.json([]); return; }
    where.categoryId = cat.id;
  }
  if (search) where.name = { [Op.like]: `%${search}%` };

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const services = await Service.findAll({
    where,
    include: [Category, { model: User, as: "Provider", attributes: ["id", "name", "avatarUrl"] }],
    limit: parseInt(limit),
    offset,
    order: [["createdAt", "DESC"]],
  });

  const mapped = services.map((s) => {
    const j = s.toJSON() as Record<string, unknown>;
    const cat = j.Category as Record<string, unknown> | undefined;
    const prov = j.Provider as Record<string, unknown> | undefined;
    delete j.Category;
    delete j.Provider;
    return {
      ...j,
      category: cat ?? null,
      categoryName: (cat?.name as string) ?? "",
      providerName: (prov?.name as string) ?? "",
      providerAvatar: (prov?.avatarUrl as string) ?? "",
    };
  });
  res.json(mapped);
}

export async function getService(req: Request, res: Response) {
  const service = await Service.findByPk(req.params.id as string, {
    include: [Category, { model: User, as: "Provider", attributes: ["id", "name", "avatarUrl"] }],
  });
  if (!service) throw new AppError(404, "Service not found");

  const j = service.toJSON() as Record<string, unknown>;
  const cat = j.Category as Record<string, unknown> | undefined;
  const prov = j.Provider as Record<string, unknown> | undefined;
  delete j.Category;
  delete j.Provider;
  res.json({
    ...j,
    category: cat ?? null,
    categoryName: (cat?.name as string) ?? "",
    providerName: (prov?.name as string) ?? "",
    providerAvatar: (prov?.avatarUrl as string) ?? "",
  });
}

export async function createService(req: Request, res: Response) {
  const { name, description, categoryId, price, duration, imageUrl } = req.body;
  const service = await Service.create({
    name,
    description,
    categoryId,
    price,
    duration,
    imageUrl: imageUrl ?? "",
    providerId: req.user!.userId,
  });
  const full = await Service.findByPk(service.id, { include: [Category] });
  res.status(201).json(full);
}

export async function updateService(req: Request, res: Response) {
  const service = await Service.findByPk(req.params.id as string);
  if (!service) throw new AppError(404, "Service not found");
  await service.update(req.body);
  const full = await Service.findByPk(service.id, { include: [Category] });
  res.json(full);
}

export async function deleteService(req: Request, res: Response) {
  const service = await Service.findByPk(req.params.id as string);
  if (!service) throw new AppError(404, "Service not found");
  await service.destroy();
  res.status(204).send();
}

export async function listCategories(_req: Request, res: Response) {
  const categories = await Category.findAll({ order: [["name", "ASC"]] });
  res.json(categories);
}
