import express, { Router, Request, Response } from "express";
import checkAuthUsingJwt from "../middleware/checkAuth";
import {
  AddDTO,
  ProductResponseDTO,
  UpdateDTO,
  DeleteDTO,
} from "../dtos/product.dto";
import {
  addNewProduct,
  getAllProductDetails,
  updateProduct,
  deleteProductDetails,
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
      const result = await addNewProduct(
        inputData.name,
        inputData.price,
        inputData.c_id
      );
      return res.status(201).json({
        message: "Product added successfully",
        product_id: result.product_id,
      });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: "Something went wrong" });
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
        inputData.name,
        inputData.price,
        inputData.c_id
      );
      if (!result) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(result);
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
      const result = await deleteProductDetails(inputData.p_id);
      if (!result) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(result);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error)
        return res.status(400).json({ message: err.message });
      return res.status(400).json({ message: "Something went wrong" });
    }
  }
);

export default router;
