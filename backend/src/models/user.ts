import { DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/database.js";
import { Role } from "./role.js";

export class User extends Model {
  declare id: string;
  declare name: string;
  declare email: string;
  declare password: string;
  declare phone: string;
  declare address: string;
  declare avatarUrl: string;
  declare isActive: boolean;
  declare roleId: number;
  declare Role?: Role;

  async comparePassword(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, this.password);
  }

  toSafe() {
    const { password: _, ...rest } = this.toJSON();
    return { ...rest, role: this.Role?.name ?? "customer" };
  }
}

User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(20), defaultValue: "" },
    address: { type: DataTypes.STRING(500), defaultValue: "" },
    avatarUrl: { type: DataTypes.STRING(500), defaultValue: "" },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    hooks: {
      beforeCreate: async (user: User) => {
        user.password = await bcrypt.hash(user.password, 12);
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  },
);

User.belongsTo(Role, { foreignKey: "roleId" });
Role.hasMany(User, { foreignKey: "roleId" });
