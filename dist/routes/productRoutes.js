"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const product_dto_1 = require("../dtos/product.dto");
const productServices_1 = require("../services/productServices");
const router = express_1.default.Router();
//insert new products to product table
router.post("/addNewProduct", checkAuth_1.default, async (req, res) => {
    try {
        const inputData = new product_dto_1.AddDTO(req.body);
        inputData.validate();
        const result = await (0, productServices_1.addNewProduct)(inputData.name, inputData.price, inputData.c_id);
        return res.status(201).json({
            message: "Product added successfully",
            product_id: result.product_id,
        });
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
        }
        return res.status(400).json({ message: "Something went wrong" });
    }
});
//Get all product details
router.get("/getAllProductDetails", checkAuth_1.default, async (req, res) => {
    try {
        const productDTOs = await (0, productServices_1.getAllProductDetails)();
        return res.status(200).json(productDTOs);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
    }
});
// update product details
router.patch("/updateProductDetails", checkAuth_1.default, async (req, res) => {
    try {
        const inputData = new product_dto_1.UpdateDTO(req.body);
        inputData.validate();
        const result = await (0, productServices_1.updateProduct)(inputData.p_id, inputData.name, inputData.price, inputData.c_id);
        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(result);
    }
    catch (err) {
        if (err instanceof Error)
            return res.status(400).json({ message: err.message });
        return res.status(400).json({ message: "Something went wrong" });
    }
});
//delete product
router.delete("/deleteProduct", checkAuth_1.default, async (req, res) => {
    try {
        const inputData = new product_dto_1.DeleteDTO(req.body);
        inputData.validate();
        const result = await (0, productServices_1.deleteProductDetails)(inputData.p_id);
        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(result);
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error)
            return res.status(400).json({ message: err.message });
        return res.status(400).json({ message: "Something went wrong" });
    }
});
exports.default = router;
