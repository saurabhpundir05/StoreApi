"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const discountTypeServices_1 = require("../services/discountTypeServices");
const discountType_dto_1 = require("../dtos/discountType.dto");
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const router = express_1.default.Router();
//add discount types
router.post("/addDiscountType", checkAuth_1.default, async (req, res) => {
    try {
        const dto = new discountType_dto_1.AddDTO(req.body);
        const result = await (0, discountTypeServices_1.insertDiscountsTypes)(dto);
        return res.status(201).json({
            message: "Discount type added successfully",
            discountType: result,
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
exports.default = router;
