//#region imports
import { prisma } from "../models/prisma";
import { CartRepository } from "../repositories/cart.repository";
import { CartItemInput } from "../dtos/cart.dto";
import { UnitOfWork } from "../repositories/unitofwork";
import { ProductRepository } from "../repositories/product.repository";
import { StockRepository } from "../repositories/stock.repository";
import { DiscountRepository } from "../repositories/discount.repository";
import { DiscountValuesRepository } from "../repositories/discount.values.repository";
const uow = new UnitOfWork();
//#endregion

//#region Services

// add to cart -> the cart is inserted with cart data -> cartid, userid, product name, quantity
// product price, discount type on product, discount value for discount type, total price (without discount)
// and discounted price and final price.
export const addToCart = async (
  userId: number | null,
  adminId: number | null,
  items: CartItemInput[],
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
      let d_price = 0;

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
        if (d_type === "FLAT") d_price = t_price - d_value;
        if (d_type === "PERCENT") d_price = t_price - (t_price * d_value) / 100;
        if (d_price < 0) d_price = 0;
        if (d_price === 0) d_price = t_price;
      }

      //insert data to cart
      const cartRepo = new CartRepository(prisma);
      await cartRepo.insertData(
        userId,
        adminId,
        product.p_id,
        product.p_name,
        Number(product.price),
        item.quantity,
        d_type,
        d_value,
        t_price,
        d_price,
      );
    }
    return response;
  });
};

// get all cart details -> cartid, userid, product name, quantity
// product price, discount type on product, discount value for discount type, total price (without discount)
// and discounted price and final price.
export const getAllDetails = async () => {
  const cartRepo = new CartRepository(prisma);
  return await cartRepo.getAllDetails();
};

//delete all cart details -> turncate whole cart table
export const deleteAllRecords = async () => {
  const cartRepo = new CartRepository(prisma);
  return await cartRepo.deleteAllRecords();
};

//#endregion
