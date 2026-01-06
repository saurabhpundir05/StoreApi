import express, { Router, Request, Response } from "express";
import checkAuthUsingJwt from "../middleware/checkAuth";
import { AddDTO, DeleteDTO } from "../dtos/category.dto";
import {
  insertNewCategories,
  deleteCategories,
} from "../services/categoryServices";
const router: Router = express.Router();

//add new category
router.post(
  "/addCategory",
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const categoryData = new AddDTO(req.body);
      categoryData.validate();
      await insertNewCategories(categoryData.name);
      return res.status(201).json({ message: "Category inserted" });
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error)
        return res.status(400).json({ message: err.message });
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
);

//delete a category
router.delete(
  "/deleteCategory",
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const categoryData = new DeleteDTO(req.body);
      categoryData.validate();
      await deleteCategories(categoryData.id);
      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error)
        return res.status(400).json({ message: err.message });
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
);

export default router;
