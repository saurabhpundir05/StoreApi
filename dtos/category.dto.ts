// DTO for Adding Categories
export interface AddCategoryInput {
  c_name: string;
}

export class AddDTO {
  c_name: string;

  constructor({ c_name }: AddCategoryInput) {
    this.c_name = c_name;
  }

  validate() {
    if (!this.c_name) {
      throw new Error("Category name is required");
    }
  }
}

//DTO for deleting Categories
export interface DeleteCategoryInput {
  c_id: number;
}

export class DeleteDTO {
  c_id: number;

  constructor({ c_id }: DeleteCategoryInput) {
    this.c_id = c_id;
  }

  validate() {
    if (!this.c_id) {
      throw new Error("Category id is required");
    }
  }
}

//DTO for updating Categories
export interface UpdateCategoryInput {
  c_id: number;
  c_name: string;
}

export class UpdateDTO {
  c_id: number;
  c_name: string;

  constructor({ c_id, c_name }: UpdateCategoryInput) {
    this.c_id = c_id;
    this.c_name = c_name;
  }

  validate() {
    if (!this.c_id || !this.c_name) {
      throw new Error("Category id and name are required");
    }
  }
}

//DTO for get all category
export interface Category {
  c_id: number;
  c_name: string;
}

// DTO for Category Response
export class CategoryResponseDTO {
  c_id: number;
  c_name: string;

  constructor({ c_id, c_name }: Category) {
    this.c_id = c_id;
    this.c_name = c_name;
  }
}
