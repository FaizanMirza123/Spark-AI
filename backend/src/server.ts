import sequelize from "./config/database.js";
import env from "./config/env.js";
import app from "./app.js";
import { seed } from "./config/seed.js";


import "./models/index.js";

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync({ alter: env.nodeEnv === "development" ? { drop: false } : false });
    console.log("Database synced");

    await seed();

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
      console.log(`API docs at http://localhost:${env.port}/docs`);
    });
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
}

start();
