//#region imports
import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

//#endregion

//#region SwaggerConfiguration

dotenv.config();
const PORT = Number(process.env.PORT) || 3001;
const HOST = String(process.env.HOST);

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Store API",
      version: "1.0.0",
      description: "API documentation for the Store backend",
    },
    servers: [
      {
        url: `http://${HOST}:${PORT}`,
        description: "development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.ts"],
};
const specs = swaggerJsdoc(options);
export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
//#endregion
