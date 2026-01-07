import express from "express";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import discountRoutes from "./routes/discountRoutes";
import discountTypesRoutes from "./routes/discountTypeRoutes";
import cartRoute from "./routes/cartRoutes";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); //is built-in middleware that Reads incoming request bodies
// Parses JSON data Makes it available as req.body(else req.body undefined) req.body.name=rohan

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.use("/", userRoutes);
app.use("/", productRoutes);
app.use("/", categoryRoutes);
app.use("/", discountRoutes);
app.use("/", discountTypesRoutes);
app.use("/", cartRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
