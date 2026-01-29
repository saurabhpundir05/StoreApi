//#region imports
import { prisma } from "../models/prisma";
import { UserRepository } from "./users.repository";
import { ProductRepository } from "./product.repository";
import { StockRepository } from "./stock.repository";
//#endregion

//#region Unit Of Work

// In Prisma, we don't manually call commit or rollback.
// Instead, Prisma uses a callback-based transaction system.
export class UnitOfWork {
  async execute<T>(
    work: (repos: {
      users: UserRepository;
      products: ProductRepository;
      stocks: StockRepository;
    }) => Promise<T>,
  ): Promise<T> {
    try {
      return await prisma.$transaction(async (tx) => {
        return await work({
          users: new UserRepository(tx),
          products: new ProductRepository(tx),
          stocks: new StockRepository(tx),
        });
      });
    } catch (error) {
      console.error("Transaction failed, rolling back", error);
      throw error;
    }
  }
}
// How Commit and Rollback work in this code:
// Automatic Commit: If the work function finishes successfully
// (the Promise resolves), Prisma automatically commits the transaction to the database.

// Automatic Rollback: If any error is thrown inside the work function (e.g., throw new Error()),
// Prisma catches it and automatically rolls back all changes made during that transaction.
//#endregion
