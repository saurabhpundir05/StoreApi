import express, { Router, Request, Response } from "express";
import checkAuthUsingJwt from "../middleware/checkAuth";
import {
  AddDTO,
  DeleteDTO,
  UpdateDTO,
  CategoryResponseDTO,
} from "../dtos/category.dto";
import {
  insertNewCategories,
  deleteCategories,
  updateCategories,
  getAllCategories,
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
      await insertNewCategories(categoryData.c_name);
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
      await deleteCategories(categoryData.c_id);
      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error)
        return res.status(400).json({ message: err.message });
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
);

//modiy a category
router.patch(
  "/updateCategory",
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const categoryData = new UpdateDTO(req.body);
      categoryData.validate();
      await updateCategories(categoryData.c_id, categoryData.c_name);
      return res.status(201).json({ message: "Category modified" });
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error)
        return res.status(400).json({ message: err.message });
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
);

//view all category
router.get(
  "/getAllCategories",
  checkAuthUsingJwt,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const productDTOs: CategoryResponseDTO[] = await getAllCategories();
      return res.status(200).json(productDTOs);
    } catch (err: unknown) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
  }
);
export default router;
