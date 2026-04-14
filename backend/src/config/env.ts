import "dotenv/config";

const env = {
  port: parseInt(process.env.PORT ?? "4000", 10),
  nodeEnv: process.env.NODE_ENV ?? "development",
  db: {
    host: process.env.DB_HOST ?? "localhost",
    port: parseInt(process.env.DB_PORT ?? "3306", 10),
    name: process.env.DB_NAME ?? "sparkai",
    user: process.env.DB_USER ?? "root",
    pass: process.env.DB_PASS ?? "",
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? "dev-secret",
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  },
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
} as const;

export default env;
