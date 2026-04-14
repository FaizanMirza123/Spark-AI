import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

export class Role extends Model {
  declare id: number;
  declare name: string;
}

Role.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.ENUM("customer", "provider", "admin"), allowNull: false, unique: true },
  },
  { sequelize, modelName: "Role", tableName: "roles" },
);
