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
  userId: number;
  name: string;
  email: string;
  GoogleID: string;

  constructor({
    userId,
    name,
    email,
    GoogleID,
  }: {
    userId: number;
    name: string;
    email: string;
    password: string;
    GoogleID: string;
  }) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.GoogleID = GoogleID;
  }

  validate() {
    if (!this.userId || !this.name || !this.email || !this.GoogleID) {
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
  userId: number;
  name: string;
  email: string;
  password: string;

  constructor({
    userId,
    name,
    email,
    password,
  }: {
    userId: number;
    name: string;
    email: string;
    password: string;
  }) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  // validate if all fields required and correct
  validate() {
    if (!this.userId || !this.name || !this.email || !this.password) {
      throw new Error("id, name, email, password are required");
    }
    if (this.password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
  }
}

// DTO for User Login and delete
export class DeleteDTO {
  userId: number;
  password: string;

  constructor({ userId, password }: { userId: number; password: string }) {
    this.userId = userId;
    this.password = password;
  }

  // validate if all fields input
  validate() {
    if (!this.userId || !this.password) {
      throw new Error("Email and password are required");
    }
  }
}
