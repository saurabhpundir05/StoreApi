// DTO for Admin Signup
export class SignupDTO {
  email: string;
  name: string;
  password: string;

  constructor({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }) {
    this.email = email;
    this.name = name;
    this.password = password;
  }

  // validate if all fields required and correct
  validate() {
    if (!this.email || !this.name || !this.password) {
      throw new Error("Email, password, and name are required");
    }
    if (this.password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
  }
}

// DTO for Admin Login
export class LoginDTO {
  email: string;
  password: string;

  constructor({ email, password }: { email: string; password: string }) {
    this.email = email;
    this.password = password;
  }

  // validate if all fields input
  validate() {
    if (!this.email || !this.password) {
      throw new Error("Email and password are required");
    }
  }
}

// DTO for Admin Update
export class UpdateDTO {
  adminId: number;
  email: string;
  name: string;
  password: string;

  constructor({
    adminId,
    email,
    name,
    password,
  }: {
    adminId: number;
    email: string;
    name: string;
    password: string;
  }) {
    this.adminId = adminId;
    this.email = email;
    this.name = name;
    this.password = password;
  }

  // validate if all fields required and correct
  validate() {
    if (!this.adminId || !this.email || !this.name || !this.password) {
      throw new Error("Id, Email, password, and name are required");
    }
    if (this.password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
  }
}

// DTO for Admin Delete
export class DeleteDTO {
  adminId: number;
  password: string;

  constructor({ adminId, password }: { adminId: number; password: string }) {
    this.adminId = adminId;
    this.password = password;
  }

  // validate if all fields input
  validate() {
    if (!this.adminId || !this.password) {
      throw new Error("Id and password are required");
    }
  }
}
