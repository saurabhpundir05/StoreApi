"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const discountServices_1 = require("../services/discountServices");
const discount_dto_1 = require("../dtos/discount.dto");
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const router = express_1.default.Router();
//add discount on a product
router.post("/addDiscount", checkAuth_1.default, async (req, res) => {
    try {
        const discountData = new discount_dto_1.AddDTO(req.body);
        discountData.validate();
        await (0, discountServices_1.insertDiscounts)(discountData.id, discountData.type);
        return res.status(200).json({ message: "Discount added successfully" });
    }
    catch (err) {
        console.log(err);
        if (err instanceof Error)
            return res.status(400).json({ message: err.message });
        return res.status(400).json({ message: "Something went wrong" });
    }
});
//delete discount from a product
router.delete("/deleteDiscounts", checkAuth_1.default, async (req, res) => {
    try {
        const discountData = new discount_dto_1.DeleteDTO(req.body);
        discountData.validate();
        await (0, discountServices_1.deleteDiscounts)(discountData.id);
        return res.status(200).json({ message: "Discount deleted successfully" });
    }
    catch (err) {
        console.log(err);
        if (err instanceof Error)
            return res.status(400).json({ message: err.message });
        return res.status(400).json({ message: "Something went wrong" });
    }
});
//modify discount on products
router.patch("/modifyDiscounts", checkAuth_1.default, async (req, res) => {
    try {
        const discountData = new discount_dto_1.UpdateDiscountDTO(req.body);
        discountData.validate();
        const result = await (0, discountServices_1.modifyDiscount)(discountData.id, discountData.type);
        if (!result) {
            return res.status(404).json({ message: "Discount not found" });
        }
        return res
            .status(200)
            .json({ message: "Discount modified successfully" });
    }
    catch (err) {
        console.log(err);
        if (err instanceof Error)
            return res.status(400).json({ message: err.message });
        return res.status(400).json({ message: "Something went wrong" });
    }
});
exports.default = router;
