// DTO for Adding Categories
export interface AddCategoryInput {
  c_name: string;
}

export class AddDTO {
  name: string;

  constructor({ c_name }: AddCategoryInput) {
    this.name = c_name;
  }

  validate() {
    if (!this.name) {
      throw new Error("Category name is required");
    }
  }
}

export interface DeleteCategoryInput {
  c_id: number;
}

export class DeleteDTO {
  id: number;

  constructor({ c_id }: DeleteCategoryInput) {
    this.id = c_id;
  }

  validate() {
    if (!this.id) {
      throw new Error("Category id is required");
    }
  }
}
