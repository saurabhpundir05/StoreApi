//#region imports
import express, { Router, Request, Response } from "express";
import checkAuthUsingJwt from "../middleware/jwt-auth.middleware";
import { authorizeRole } from "../middleware/authorize-role.middleware";
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
} from "../services/category.services";
//#endregion

//#region Api's

const router: Router = express.Router();

//add new category
router.post(
  "/addcategory",
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

//view all category
router.get(
  "/getallcategories",
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

//modify a category
router.patch(
  "/update",
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

//delete a category
router.delete(
  "/delete",
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

//#region Swagger

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management endpoints
 */

/**
 * @swagger
 * /category/addcategory:
 *   post:
 *     summary: Add a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - c_name
 *             properties:
 *               c_name:
 *                 type: string
 *                 example: "Hardware"
 *     responses:
 *       201:
 *         description: Category inserted successfully
 *       400:
 *         description: Validation error or bad request
 */

/**
 * @swagger
 * /category/delete:
 *   delete:
 *     summary: Delete a category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - c_id
 *             properties:
 *               c_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       400:
 *         description: Validation error or bad request
 */

/**
 * @swagger
 * /category/update:
 *   patch:
 *     summary: Update a category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - c_id
 *               - c_name
 *             properties:
 *               c_id:
 *                 type: integer
 *                 example: 4
 *               c_name:
 *                 type: string
 *                 example: "Beverages"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *       400:
 *         description: Validation error or bad request
 */

/**
 * @swagger
 * /category/getallcategories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Returns list of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   c_id:
 *                     type: integer
 *                     example: 1
 *                   c_name:
 *                     type: string
 *                     example: "Hardware"
 *       500:
 *         description: Server or database error
 */

//#endregion
