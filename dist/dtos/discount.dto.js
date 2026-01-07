"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDiscountDTO = exports.DeleteDTO = exports.AddDTO = void 0;
class AddDTO {
    constructor({ p_id, d_type }) {
        this.id = p_id;
        this.type = d_type;
    }
    validate() {
        if (!this.id || !this.type) {
            throw new Error("p_id and d_type are required");
        }
    }
}
exports.AddDTO = AddDTO;
class DeleteDTO {
    constructor({ d_id }) {
        this.id = d_id;
    }
    validate() {
        if (!this.id) {
            throw new Error("d_id is required");
        }
    }
}
exports.DeleteDTO = DeleteDTO;
class UpdateDiscountDTO {
    constructor({ d_id, d_type }) {
        this.id = d_id;
        this.type = d_type;
    }
    validate() {
        if (!this.id || !this.type) {
            throw new Error("d_id and d_type are required");
        }
    }
}
exports.UpdateDiscountDTO = UpdateDiscountDTO;
