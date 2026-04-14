import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import { Category } from "./category.js";
import { User } from "./user.js";

export class Service extends Model {
  declare id: string;
  declare name: string;
  declare description: string;
  declare categoryId: string;
  declare price: number;
  declare duration: number;
  declare imageUrl: string;
  declare rating: number;
  declare reviewCount: number;
  declare providerId: string;
  declare isActive: boolean;
  declare Category?: Category;
  declare Provider?: User;
}

Service.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    duration: { type: DataTypes.INTEGER, allowNull: false },
    imageUrl: { type: DataTypes.STRING(500), defaultValue: "" },
    rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0 },
    reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { sequelize, modelName: "Service", tableName: "services" },
);

Service.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Service, { foreignKey: "categoryId" });

Service.belongsTo(User, { as: "Provider", foreignKey: "providerId" });
