// DTO for Admin Signup
export class SignupDTO {
  id: string | number;
  name: string;
  password: string;

  constructor({
    id,
    name,
    password,
  }: {
    id: string | number;
    name: string;
    password: string;
  }) {
    this.id = id;
    this.name = name;
    this.password = password;
  }

  // validate if all fields required and correct
  validate() {
    if (!this.id || !this.name || !this.password) {
      throw new Error("Username, password, and name are required");
    }
    if (this.password.length < 3) {
      throw new Error("Password must be at least 3 characters");
    }
  }
}

// DTO for Admin Login and delete
export class LoginDTO {
  id: string | number;
  password: string;

  constructor({ id, password }: { id: string | number; password: string }) {
    this.id = id;
    this.password = password;
  }

  // validate if all fields input
  validate() {
    if (!this.id || !this.password) {
      throw new Error("Username and password are required");
    }
  }
}
