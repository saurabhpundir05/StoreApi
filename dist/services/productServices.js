"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductDetails = exports.updateProduct = exports.getAllProductDetails = exports.addNewProduct = void 0;
const prismaDbConnection_1 = require("../models/prismaDbConnection");
const product_dto_1 = require("../dtos/product.dto");
//add new product
const addNewProduct = async (name, price, c_id = null) => {
    return prismaDbConnection_1.prisma.$transaction(async (tx) => {
        //tx is the transaction client
        // Check if product already exists (use findFirst because p_name is not unique)
        let product = await tx.product.findFirst({
            where: { p_name: name },
        });
        if (!product) {
            // Product doesn't exist, create it
            product = await tx.product.create({
                data: {
                    p_name: name,
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
        }
        else {
            // Product exists, increase stock quantity
            const stock = await tx.stock.findUnique({
                where: { p_id: product.p_id },
            });
            if (stock) {
                await tx.stock.update({
                    where: { p_id: product.p_id },
                    data: { quantity: stock.quantity + 1 },
                });
            }
            else {
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
exports.addNewProduct = addNewProduct;
// get all product details
const getAllProductDetails = async () => {
    const products = await prismaDbConnection_1.prisma.product.findMany();
    return products.map((p) => new product_dto_1.ProductResponseDTO(p));
};
exports.getAllProductDetails = getAllProductDetails;
//update product details
const updateProduct = async (p_id, p_name, price, c_id = null) => {
    try {
        // Update product
        const updatedProduct = await prismaDbConnection_1.prisma.product.updateMany({
            where: { p_id },
            data: { p_name, price, c_id },
        });
        // Check if any row was updated
        if (updatedProduct.count === 0) {
            return null; // No product found to update
        }
        return { message: "Product updated successfully", p_id };
    }
    catch (err) {
        throw err; // Prisma automatically handles transactions internally
    }
};
exports.updateProduct = updateProduct;
//delete product details
const deleteProductDetails = async (p_id) => {
    try {
        // Decrease stock quantity if exists
        const stock = await prismaDbConnection_1.prisma.stock.findUnique({ where: { p_id } });
        if (stock) {
            await prismaDbConnection_1.prisma.stock.update({
                where: { p_id },
                data: { quantity: Math.max(stock.quantity - 1, 0) },
            });
        }
        // Delete the product
        const deletedProduct = await prismaDbConnection_1.prisma.product.deleteMany({
            where: { p_id },
        });
        if (deletedProduct.count === 0) {
            return null; // Product not found
        }
        return { message: "Product deleted successfully", p_id };
    }
    catch (err) {
        throw err;
    }
};
exports.deleteProductDetails = deleteProductDetails;
