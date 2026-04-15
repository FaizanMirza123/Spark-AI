import { Sequelize } from "sequelize";
import env from "./env.js";

const sequelize =
  env.nodeEnv === "test"
    ? new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        define: { underscored: true, timestamps: true },
      })
    : new Sequelize(env.db.name, env.db.user, env.db.pass, {
        host: env.db.host,
        port: env.db.port,
        dialect: "mysql",
        logging: false,
        define: { underscored: true, timestamps: true },
      });

export default sequelize;
