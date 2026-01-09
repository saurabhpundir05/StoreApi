import { prisma } from "../models/prismaDbConnection";
import { ProductResponseDTO } from "../dtos/product.dto";

//add new product
export const addNewProduct = async (
  p_name: string,
  price: number,
  c_id: number | null = null
): Promise<{ product_id: number }> => {
  return prisma.$transaction(async (tx) => {
    //tx is the transaction client
    // Check if product already exists (use findFirst because p_name is not unique)
    let product = await tx.product.findFirst({
      where: { p_name: p_name },
    });
    if (!product) {
      // Product doesn't exist, create it
      product = await tx.product.create({
        data: {
          p_name: p_name,
          price,
          c_id,
        },
      });
      // Create stock entry with quantity 1
      await tx.stock.create({
        data: {
          p_id: product.p_id,
          quantity: 1,
        },
      });
    } else {
      // Product exists, increase stock quantity
      const stock = await tx.stock.findUnique({
        where: { p_id: product.p_id },
      });

      if (stock) {
        await tx.stock.update({
          where: { p_id: product.p_id },
          data: { quantity: stock.quantity + 1 },
        });
      } else {
        // If stock entry doesn't exist, create it
        await tx.stock.create({
          data: {
            p_id: product.p_id,
            quantity: 1,
          },
        });
      }
    }
    return { product_id: product.p_id };
  });
};

// get all product details
export const getAllProductDetails = async (): Promise<ProductResponseDTO[]> => {
  const products = await prisma.product.findMany();
  return products.map((p) => new ProductResponseDTO(p as any));
};

//update product details
export const updateProduct = async (
  p_id: number,
  p_name: string,
  price: number,
  c_id: number | null = null
): Promise<{ message: string; p_id: number } | null> => {
  try {
    // Update product
    const updatedProduct = await prisma.product.updateMany({
      where: { p_id },
      data: { p_name, price, c_id },
    });
    // Check if any row was updated
    if (updatedProduct.count === 0) {
      return null; // No product found to update
    }
    return { message: "Product updated successfully", p_id };
  } catch (err) {
    throw err; // Prisma automatically handles transactions internally
  }
};

//delete product details
export const deleteProductDetails = async (
  p_id: number
): Promise<{ message: string; p_id: number } | null> => {
  try {
    // Decrease stock quantity if exists
    const stock = await prisma.stock.findUnique({ where: { p_id } });
    if (stock) {
      await prisma.stock.update({
        where: { p_id },
        data: { quantity: Math.max(stock.quantity - 1, 0) },
      });
    }
    // Delete the product
    const deletedProduct = await prisma.product.deleteMany({
      where: { p_id },
    });
    if (deletedProduct.count === 0) {
      return null; // Product not found
    }
    return { message: "Product deleted successfully", p_id };
  } catch (err) {
    throw err;
  }
};
