"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const cart_dto_1 = require("../dtos/cart.dto");
const cartServices_1 = require("../services/cartServices");
const router = express_1.default.Router();
//add to cart
router.post("/addToCart", checkAuth_1.default, async (req, res) => {
    try {
        const dto = new cart_dto_1.AddCartDTO(req.body);
        dto.validate();
        const result = await (0, cartServices_1.addToCart)(dto.items);
        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            data: result,
        });
    }
    catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : "Something went wrong";
        return res.status(400).json({ success: false, message });
    }
});
//delete cart details
router.delete("/deleteAllRecords", checkAuth_1.default, async (req, res) => {
    try {
        const result = await (0, cartServices_1.deleteAllRecords)();
        return res.status(200).json({
            message: "Cart Data Deleted Successfully",
        });
    }
    catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : "Something went wrong";
        return res.status(400).json({ success: false, message });
    }
});
exports.default = router;
