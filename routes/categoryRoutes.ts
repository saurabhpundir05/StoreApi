//#region imports
import express, { Router, Request, Response } from "express";
import checkAuthUsingJwt from "../middleware/checkAuth";
import { authorizeRole } from "../middleware/authorizeRole";
import {
  AddDTO,
  DeleteDTO,
  UpdateDTO,
  CategoryResponseDTO,
} from "../dtos/category.dto";
import {
  insertNewCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../services/categoryServices";
//#endregion

//#region Api's

const router: Router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AddCategory:
 *       type: object
 *       required:
 *         - c_name
 *       properties:
 *         c_name:
 *           type: string
 *           example: Electronics
 *
 *     UpdateCategory:
 *       type: object
 *       required:
 *         - c_id
 *         - c_name
 *       properties:
 *         c_id:
 *           type: number
 *           example: 1
 *         c_name:
 *           type: string
 *           example: Home Appliances
 *
 *     DeleteCategory:
 *       type: object
 *       required:
 *         - c_id
 *       properties:
 *         c_id:
 *           type: number
 *           example: 1
 *
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         c_id:
 *           type: number
 *           example: 1
 *         c_name:
 *           type: string
 *           example: Electronics
 */

/**
 * @swagger
 * /addCategory:
 *   post:
 *     summary: Add a new category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddCategory'
 *     responses:
 *       201:
 *         description: Category inserted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

//add new category
router.post(
  "/addCategory",
  checkAuthUsingJwt,
  authorizeRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const categoryData = new AddDTO(req.body);
      categoryData.validate();
      await insertNewCategory(categoryData.c_name);
      return res.status(201).json({ message: "Category inserted" });
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof Error)
        return res.status(400).json({ message: err.message });
      return res.status(400).json({ message: "Something went wrong" });
    }
  },
);

/**
 * @swagger
 * /getAllCategories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CategoryResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database error
 */

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
  },
);

/**
 * @swagger
 * /updateCategory:
 *   patch:
 *     summary: Update an existing category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategory'
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

//modify a category
router.patch(
  "/updateCategory",
  checkAuthUsingJwt,
  authorizeRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const categoryData = new UpdateDTO(req.body);
      categoryData.validate();
      const result = await updateCategory(
        categoryData.c_id,
        categoryData.c_name,
      );
      if (!result) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res.status(200).json({
        message: "Category modified",
        c_id: result,
      });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

/**
 * @swagger
 * /deleteCategory:
 *   delete:
 *     summary: Delete a category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteCategory'
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

//delete a category
router.delete(
  "/deleteCategory",
  checkAuthUsingJwt,
  authorizeRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const categoryData = new DeleteDTO(req.body);
      categoryData.validate();
      const result = await deleteCategory(categoryData.c_id);
      if (!result) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res.status(200).json({
        message: "Category deleted successfully",
        c_id: result,
      });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

export default router;
//#endregion
