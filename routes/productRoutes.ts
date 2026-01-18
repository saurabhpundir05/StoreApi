import express, { Router, Request, Response } from "express";
import checkAuthUsingJwt from "../middleware/checkAuth";
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
const router: Router = express.Router();

//insert new products to product table
router.post(
  "/addNewProduct",
  checkAuthUsingJwt,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const inputData = new AddDTO(req.body);
      inputData.validate();
      const categoryId = inputData.c_id ? Number(inputData.c_id) : null;
      const result = await insertProduct(
        inputData.p_name,
        inputData.price,
        categoryId
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
  }
);

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
  }
);

// update product details
router.patch(
  "/updateProductDetails",
  checkAuthUsingJwt,
  async (req: Request, res: Response) => {
    try {
      const inputData = new UpdateDTO(req.body);
      inputData.validate();
      const result = await updateProduct(
        inputData.p_id,
        inputData.p_name,
        inputData.price,
        Number(inputData.c_id)
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
  }
);

//delete product
router.delete(
  "/deleteProduct",
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
  }
);

export default router;
