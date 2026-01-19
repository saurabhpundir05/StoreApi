import { prisma } from "../models/prismaDbConnection";
import { CartRepository } from "../repositories/cart.repository";
import { CartItemInput } from "../dtos/cart.dto";
import { UnitOfWork } from "../repositories/unitofwork";
import { ProductRepository } from "../repositories/product.repository";
import { StockRepository } from "../repositories/stock.repository";
import { DiscountRepository } from "../repositories/discount.repository";
import { DiscountValuesRepository } from "../repositories/discount.type.repository";
const uow = new UnitOfWork();

//add to cart
export const addToCart = async (
  id: number,
  items: CartItemInput[]
): Promise<any[]> => {
  return await uow.execute(async (repo) => {
    const response: any[] = [];
    for (const item of items) {
      //find product
      const prodRepo = new ProductRepository(prisma);
      const product = await prodRepo.findProduct(String(item.p_name));
      if (!product) throw new Error("Product not found");

      //check stock
      const stockRepo = new StockRepository(prisma);
      const stock = await stockRepo.getOneStock(product.p_id);
      if (!stock) throw new Error("Stock not available");
      if (stock < item.quantity) throw new Error("Out of stock");

      //update stock
      await stockRepo.updateStockQuantity(product.p_id, stock - item.quantity);

      // value assign
      let d_type = "NO DISCOUNT";
      let d_value = 0;
      const price = Number(product.price);
      let t_price = price * item.quantity;
      //calculate discount
      //find discount
      const disRepo = new DiscountRepository(prisma);
      const discount = await disRepo.getADiscount(product.p_id);
      if (discount) {
        //find discount value
        const disvRepo = new DiscountValuesRepository(prisma);
        const discountValue = await disvRepo.getADiscountValue(discount.d_id);
        if (discount.d_type) {
          d_type = discount.d_type;
          if (d_type === "FLAT")
            d_value = item.quantity * Number(discountValue);
          if (d_type === "PERCENT") d_value = Number(discountValue);
        }
        if (d_type === "FLAT") t_price -= d_value;
        if (d_type === "PERCENT") t_price -= (t_price * d_value) / 100;
        if (t_price < 0) t_price = 0;
      }

      //insert data to cart
      const cartRepo = new CartRepository(prisma);
      await cartRepo.insertData(
        Number(id),
        product.p_id,
        product.p_name,
        Number(product.price),
        item.quantity,
        d_type,
        d_value,
        t_price
      );
    }
    return response;
  });
};

//get all cart details
export const getAllDetails = async () => {
  const cartRepo = new CartRepository(prisma);
  return await cartRepo.getAllDetails();
};

//delete all cart details
export const deleteAllRecords = async () => {
  const cartRepo = new CartRepository(prisma);
  return await cartRepo.deleteAllRecords();
};
