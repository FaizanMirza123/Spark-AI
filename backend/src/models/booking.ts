import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import { User } from "./user.js";
import { Service } from "./service.js";

export type BookingStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";

export class Booking extends Model {
  declare id: string;
  declare customerId: string;
  declare serviceId: string;
  declare providerId: string;
  declare status: BookingStatus;
  declare scheduledDate: string;
  declare scheduledTime: string;
  declare address: string;
  declare totalAmount: number;
  declare notes: string;
  declare Customer?: User;
  declare Service?: Service;
  declare Provider?: User;
}

Booking.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "in-progress", "completed", "cancelled"),
      defaultValue: "pending",
    },
    scheduledDate: { type: DataTypes.DATEONLY, allowNull: false },
    scheduledTime: { type: DataTypes.STRING(5), allowNull: false },
    address: { type: DataTypes.STRING(500), allowNull: false },
    totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    notes: { type: DataTypes.TEXT, defaultValue: "" },
  },
  { sequelize, modelName: "Booking", tableName: "bookings" },
);

Booking.belongsTo(User, { as: "Customer", foreignKey: "customerId" });
Booking.belongsTo(User, { as: "Provider", foreignKey: "providerId" });
Booking.belongsTo(Service, { foreignKey: "serviceId" });
Service.hasMany(Booking, { foreignKey: "serviceId" });
