import { beforeAll, afterAll } from "vitest";
import sequelize from "../src/config/database.js";

// Import all models to register them with Sequelize
import "../src/models/role.js";
import "../src/models/user.js";
import "../src/models/category.js";
import "../src/models/service.js";
import "../src/models/booking.js";

import { Role } from "../src/models/role.js";

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Role.bulkCreate([
    { name: "customer" },
    { name: "provider" },
    { name: "admin" },
  ]);
});

afterAll(async () => {
  await sequelize.close();
});
