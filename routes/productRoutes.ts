//#region imports
import express, { Router, Request, Response } from "express";
import checkAuthUsingJwt from "../middleware/checkAuth";
import { authorizeRole } from "../middleware/authorizeRole";
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
} from "../services/productServices";
//#endregion

//#region Api's

const router: Router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AddProduct:
 *       type: object
 *       required:
 *         - p_name
 *         - price
 *       properties:
 *         p_name:
 *           type: string
 *           example: "Laptop"
 *         price:
 *           type: number
 *           example: 1500
 *         c_id:
 *           type: number
 *           nullable: true
 *           example: 2
 *
 *     UpdateProduct:
 *       type: object
 *       required:
 *         - p_id
 *         - p_name
 *         - price
 *         - c_id
 *       properties:
 *         p_id:
 *           type: number
 *           example: 1
 *         p_name:
 *           type: string
 *           example: "Laptop Pro"
 *         price:
 *           type: number
 *           example: 1800
 *         c_id:
 *           type: number
 *           example: 2
 *
 *     DeleteProduct:
 *       type: object
 *       required:
 *         - p_id
 *       properties:
 *         p_id:
 *           type: number
 *           example: 1
 *
 *     ProductResponse:
 *       type: object
 *       properties:
 *         p_id:
 *           type: number
 *           example: 1
 *         p_name:
 *           type: string
 *           example: "Laptop"
 *         price:
 *           type: number
 *           example: 1500
 *         c_id:
 *           type: number
 *           nullable: true
 *           example: 2
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: 2026-01-20T12:00:00Z
 */

/**
 * @swagger
 * /addNewProduct:
 *   post:
 *     summary: Add a new product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddProduct'
 *     responses:
 *       201:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product added successfully
 *                 product_id:
 *                   type: number
 *                   example: 1
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Product already exists
 */

//insert new products to product table
router.post(
  "/addNewProduct",
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

/**
 * @swagger
 * /getAllProductDetails:
 *   get:
 *     summary: Retrieve all products
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Database error
 */

//Get all product details
router.get(
  "/getAllProductDetails",
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

/**
 * @swagger
 * /updateProductDetails:
 *   patch:
 *     summary: Update an existing product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProduct'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product updated
 *                 p_id:
 *                   type: number
 *                   example: 1
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */

// update product details
router.patch(
  "/updateProductDetails",
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

/**
 * @swagger
 * /deleteProduct:
 *   delete:
 *     summary: Delete a product
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteProduct'
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted
 *                 p_id:
 *                   type: number
 *                   example: 1
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */

//delete product
router.delete(
  "/deleteProduct",
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
