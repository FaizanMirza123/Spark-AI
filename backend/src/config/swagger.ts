import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SparkAI API",
      version: "1.0.0",
      description: "REST API for the SparkAI home services platform",
    },
    servers: [{ url: process.env.SERVER_URL ?? `http://localhost:${process.env.PORT ?? 4000}`, description: "Server" }],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "session-token",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
