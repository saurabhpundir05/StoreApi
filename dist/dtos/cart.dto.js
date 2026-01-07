"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCartDTO = void 0;
// DTO for adding multiple items to cart
class AddCartDTO {
    constructor(data) {
        // Ensure items is always an array
        this.items = Array.isArray(data.items) ? data.items : [];
    }
    // Simple validation method
    validate() {
        if (!this.items || this.items.length === 0) {
            throw new Error("Items array is required");
        }
        for (const item of this.items) {
            if (!item.p_name || typeof item.p_name !== "string") {
                throw new Error("Provide Valid Name");
            }
            if (!item.quantity ||
                typeof item.quantity !== "number" ||
                item.quantity <= 0) {
                throw new Error(`Out of Stock: ${item.p_name}`);
            }
        }
    }
}
exports.AddCartDTO = AddCartDTO;
