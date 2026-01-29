//#region imports
import express, { Router, Request, Response } from "express";
import checkAuthUsingJwt from "../middleware/jwt-auth.middleware";
import { authorizeRole } from "../middleware/authorize-role.middleware";
import {
  AddDTO,
  ProductResponseDTO,
  UpdateDTO,
  DeleteDTO,
} from "../dtos/product.dto";
import {
  insertProduct,
  getAllProductDetails,
  updateProduct,
  deleteProduct,
} from "../services/product.services";
//#endregion

//#region Api's

const router: Router = express.Router();

//insert new products to product table
router.post(
  "/add",
  checkAuthUsingJwt,
  authorizeRole("admin"),
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const inputData = new AddDTO(req.body);
      inputData.validate();
      const categoryId = inputData.c_id ? Number(inputData.c_id) : null;
      const result = await insertProduct(
        inputData.p_name,
        inputData.price,
        categoryId,
      );
      if (!result) {
        return res.status(409).json({ message: "Product already exists" });
      }
      return res.status(201).json({
        message: "Product added successfully",
        product_id: result,
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

//Get all product details
router.get(
  "/getallproducts",
  checkAuthUsingJwt,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const productDTOs: ProductResponseDTO[] = await getAllProductDetails();
      return res.status(200).json(productDTOs);
    } catch (err: unknown) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
  },
);

// update product details
router.patch(
  "/update",
  authorizeRole("admin"),
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const inputData = new UpdateDTO(req.body);
      inputData.validate();
      const result = await updateProduct(
        inputData.p_id,
        inputData.p_name,
        inputData.price,
        Number(inputData.c_id),
      );
      if (!result) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({ message: "Product updated", p_id: result });
    } catch (err: unknown) {
      if (err instanceof Error)
        return res.status(400).json({ message: err.message });
      return res.status(400).json({ message: "Something went wrong" });
    }
  },
);

//delete product
router.delete(
  "/delete",
  authorizeRole("admin"),
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const inputData = new DeleteDTO(req.body);
      inputData.validate();
      const result = await deleteProduct(inputData.p_id);
      if (!result) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({ message: "Product deleted", p_id: result });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error)
        return res.status(400).json({ message: err.message });
      return res.status(400).json({ message: "Something went wrong" });
    }
  },
);

export default router;
//#endregion

//#region Swagger

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /product/add:
 *   post:
 *     summary: Add a new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - p_name
 *               - price
 *             properties:
 *               p_name:
 *                 type: string
 *                 example: "Samsung Galaxy S26"
 *               price:
 *                 type: number
 *                 example: 99999
 *               c_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product added successfully
 *       409:
 *         description: Product already exists
 *       400:
 *         description: Validation error or bad request
 */

/**
 * @swagger
 * /product/getallproducts:
 *   get:
 *     summary: Get all product details
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   p_id:
 *                     type: integer
 *                     example: 1
 *                   p_name:
 *                     type: string
 *                     example: "Samsung Galaxy S26"
 *                   price:
 *                     type: number
 *                     example: 99999
 *                   c_id:
 *                     type: integer
 *                     nullable: true
 *                     example: 2
 *       500:
 *         description: Database error
 */

/**
 * @swagger
 * /product/update:
 *   patch:
 *     summary: Update product details
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - p_id
 *               - p_name
 *               - price
 *             properties:
 *               p_id:
 *                 type: integer
 *                 example: 1
 *               p_name:
 *                 type: string
 *                 example: "Redmi"
 *               price:
 *                 type: number
 *                 example: 1500
 *               c_id:
 *                 type: integer
 *                 nullable: true
 *                 example: null
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Validation error or bad request
 */

/**
 * @swagger
 * /product/delete:
 *   delete:
 *     summary: Delete a product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - p_id
 *             properties:
 *               p_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Validation error or bad request
 */

//#endregion
