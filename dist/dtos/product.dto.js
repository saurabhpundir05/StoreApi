"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddToCartDTO = exports.DeleteDTO = exports.UpdateDTO = exports.AddDTO = exports.ProductResponseDTO = void 0;
// DTO for Product Response
class ProductResponseDTO {
    constructor(products) {
        this.pid = products.p_id;
        this.name = products.p_name;
        this.price = products.price;
        this.c_id = products.c_id;
    }
}
exports.ProductResponseDTO = ProductResponseDTO;
class AddDTO {
    constructor({ p_name, price, c_id }) {
        this.name = p_name?.trim() ?? "";
        this.price = Number(price);
        this.c_id = c_id ?? null;
    }
    validate() {
        if (!this.name) {
            throw new Error("Product name is required");
        }
        if (isNaN(this.price) || this.price <= 0) {
            throw new Error("Price must be a positive number");
        }
    }
}
exports.AddDTO = AddDTO;
class UpdateDTO {
    constructor({ p_id, p_name, price, c_id }) {
        this.p_id = p_id;
        this.name = p_name;
        this.price = price;
        this.c_id = c_id ?? null; // default to null if undefined
    }
    validate() {
        if (this.p_id == null || this.name == null || this.price == null) {
            throw new Error("p_id, name, and price are required");
        }
        // c_id can be null, so no need to validate it
    }
}
exports.UpdateDTO = UpdateDTO;
class DeleteDTO {
    constructor({ p_id }) {
        this.p_id = p_id;
    }
    validate() {
        if (this.p_id == null) {
            throw new Error("p_id is required");
        }
    }
}
exports.DeleteDTO = DeleteDTO;
class AddToCartDTO {
    constructor({ p_name }) {
        this.p_name = p_name;
    }
    validate() {
        if (!this.p_name) {
            throw new Error("p_name is required");
        }
    }
}
exports.AddToCartDTO = AddToCartDTO;
