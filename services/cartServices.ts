import { CartRepository } from "../repositories/cart.repository";
import { CartItemInput, CartResponseDTO } from "../dtos/cart.dto";

const cartRepo = new CartRepository();

export const addToCart = (items: CartItemInput[]) => cartRepo.addToCart(items);

export const deleteAllRecords = () => cartRepo.deleteAllRecords();

export const getAllCartDetails = (): Promise<CartResponseDTO[]> =>
  cartRepo.getAllDetails();
