"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const category_dto_1 = require("../dtos/category.dto");
const categoryServices_1 = require("../services/categoryServices");
const router = express_1.default.Router();
//add new category
router.post("/addCategory", checkAuth_1.default, async (req, res) => {
    try {
        const categoryData = new category_dto_1.AddDTO(req.body);
        categoryData.validate();
        await (0, categoryServices_1.insertNewCategories)(categoryData.name);
        return res.status(201).json({ message: "Category inserted" });
    }
    catch (err) {
        console.log(err);
        if (err instanceof Error)
            return res.status(400).json({ message: err.message });
        return res.status(400).json({ message: "Something went wrong" });
    }
});
//delete a category
router.delete("/deleteCategory", checkAuth_1.default, async (req, res) => {
    try {
        const categoryData = new category_dto_1.DeleteDTO(req.body);
        categoryData.validate();
        await (0, categoryServices_1.deleteCategories)(categoryData.id);
        return res.status(200).json({ message: "Category deleted successfully" });
    }
    catch (err) {
        console.log(err);
        if (err instanceof Error)
            return res.status(400).json({ message: err.message });
        return res.status(400).json({ message: "Something went wrong" });
    }
});
exports.default = router;
