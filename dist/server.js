"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const discountRoutes_1 = __importDefault(require("./routes/discountRoutes"));
const discountTypeRoutes_1 = __importDefault(require("./routes/discountTypeRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config(); //is built-in middleware that Reads incoming request bodies
// Parses JSON data Makes it available as req.body(else req.body undefined) req.body.name=rohan
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/", userRoutes_1.default);
app.use("/", productRoutes_1.default);
app.use("/", categoryRoutes_1.default);
app.use("/", discountRoutes_1.default);
app.use("/", discountTypeRoutes_1.default);
app.use("/", cartRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
