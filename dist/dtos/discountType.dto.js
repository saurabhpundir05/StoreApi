"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDTO = void 0;
class AddDTO {
    constructor({ d_id, d_flat, d_percent }) {
        this.id = d_id;
        this.flat = d_flat ?? null;
        this.percent = d_percent ?? null;
    }
    validate() {
        if (!this.id) {
            throw new Error("d_id is required");
        }
        if (this.flat === null && this.percent === null) {
            throw new Error("Either d_flat or d_percent is required");
        }
        if (this.flat !== null && this.percent !== null) {
            throw new Error("Only one of d_flat or d_percent is allowed");
        }
    }
}
exports.AddDTO = AddDTO;
