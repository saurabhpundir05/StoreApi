//#region imports
import express from "express";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/users.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes.";
import discountRoutes from "./routes/discount.routes";
import discountValuesRoutes from "./routes/discount-values.routes";
import cartRoute from "./routes/cart.routes";
import stockRoute from "./routes/stock.routes";
import { setupSwagger } from "./helpers/swagger-config.helper";
import cors from "cors";
import dotenv from "dotenv";
import { logger } from "./logging/winston.logging";
//#endregion

//#region Server

dotenv.config(); //is built-in middleware that Reads incoming request bodies
// Parses JSON data Makes it available as req.body(else req.body undefined) req.body.name=rohan
const app = express();
const PORT = Number(process.env.PORT) || 3001;
app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/discount", discountRoutes);
app.use("/discountvalues", discountValuesRoutes);
app.use("/cart", cartRoute);
app.use("/stock", stockRoute);

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
//#endregion
