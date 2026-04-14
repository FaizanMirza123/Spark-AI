import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export class Category extends Model {
  declare id: string;
  declare name: string;
  declare slug: string;
  declare description: string;
  declare imageUrl: string;
}

Category.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    description: { type: DataTypes.STRING(500), defaultValue: "" },
    imageUrl: { type: DataTypes.STRING(500), defaultValue: "" },
  },
  { sequelize, modelName: "Category", tableName: "categories" },
);
