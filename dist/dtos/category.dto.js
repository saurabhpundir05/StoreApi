"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteDTO = exports.AddDTO = void 0;
class AddDTO {
    constructor({ c_name }) {
        this.name = c_name;
    }
    validate() {
        if (!this.name) {
            throw new Error("Category name is required");
        }
    }
}
exports.AddDTO = AddDTO;
class DeleteDTO {
    constructor({ c_id }) {
        this.id = c_id;
    }
    validate() {
        if (!this.id) {
            throw new Error("Category id is required");
        }
    }
}
exports.DeleteDTO = DeleteDTO;
