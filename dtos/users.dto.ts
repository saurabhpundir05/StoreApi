// DTO for User Signup
export class SignupDTO {
  name: string;
  email: string;
  password: string;

  constructor({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  // validate if all fields required and correct
  validate() {
    if (!this.name || !this.email || !this.password) {
      throw new Error("name, email, password are required");
    }
    if (this.password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
  }
}

//DTO for User SignUP using Google OAuth
export class OAuthSignupDTO {
  id: string;
  name: string;
  email: string;
  GoogleID: string;

  constructor({
    id,
    name,
    email,
    GoogleID,
  }: {
    id: string;
    name: string;
    email: string;
    password: string;
    GoogleID: string;
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.GoogleID = GoogleID;
  }

  validate() {
    if (!this.id || !this.name || !this.email || !this.GoogleID) {
      throw new Error("Id, name, email, GoogleID are required");
    }
  }
}

// DTO for User Login and delete
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

// DTO for User Details Update
export class UpdateDTO {
  id: string;
  name: string;
  email: string;
  password: string;

  constructor({
    id,
    name,
    email,
    password,
  }: {
    id: string;
    name: string;
    email: string;
    password: string;
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  // validate if all fields required and correct
  validate() {
    if (!this.id || !this.name || !this.email || !this.password) {
      throw new Error("id, name, email, password are required");
    }
    if (this.password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
  }
}

// DTO for User Login and delete
export class DeleteDTO {
  id: string;
  password: string;

  constructor({ id, password }: { id: string; password: string }) {
    this.id = id;
    this.password = password;
  }

  // validate if all fields input
  validate() {
    if (!this.id || !this.password) {
      throw new Error("Email and password are required");
    }
  }
}
