"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userServices_1 = require("../services/userServices");
const user_dto_1 = require("../dtos/user.dto");
const jwtToken_1 = require("../helpers/jwtToken");
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const checkTrueUser_1 = __importDefault(require("../middleware/checkTrueUser"));
const router = express_1.default.Router();
// Signup route
router.post("/signup", async (req, res) => {
    try {
        const signupData = new user_dto_1.SignupDTO(req.body);
        signupData.validate();
        const userId = Number(signupData.id);
        const existingUser = await (0, userServices_1.findUserById)(userId);
        if (existingUser) {
            return res.status(409).json({ message: "User id already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(signupData.password, 10);
        await (0, userServices_1.createNewUser)(userId, signupData.name, hashedPassword);
        return res.status(201).json({
            message: "User created successfully, now Log In",
        });
    }
    catch (err) {
        //err: unknown, the error could be any type, not just Error.
        console.error(err);
        //err instanceof Error Checks if err is a real JavaScript Error object.
        //If it is, use err.message (the error message string). If it’s not (e.g., someone
        // threw a string or something weird), fallback to "Something went wrong".
        const message = err instanceof Error ? err.message : "Something went wrong";
        return res.status(400).json({ message });
    }
});
//Login route
router.post("/login", async (req, res) => {
    try {
        const loginData = new user_dto_1.LoginDTO(req.body);
        loginData.validate();
        const user = await (0, userServices_1.loginUser)(loginData.id);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordMatch = await bcrypt_1.default.compare(loginData.password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = (0, jwtToken_1.generateToken)(user.id, user.name);
        return res.status(200).json({
            message: "Login successful",
            token,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
        }
        return res.status(400).json({ message: "Something went wrong" });
    }
});
// delete user account
router.delete("/deleteUserId", checkAuth_1.default, checkTrueUser_1.default, async (req, res) => {
    try {
        const inputData = new user_dto_1.LoginDTO(req.body);
        inputData.validate();
        const result = await (0, userServices_1.deleteUserAccount)(Number(inputData.id));
        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ message: "User not found / Is hard deleted" });
        }
        return res.status(200).json({
            message: "User deleted successfully",
        });
    }
    catch (err) {
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
        }
        return res.status(400).json({ message: "Something went wrong" });
    }
});
//soft delete user account
router.delete("/softDeleteUser", checkAuth_1.default, checkTrueUser_1.default, async (req, res) => {
    try {
        const inputData = new user_dto_1.LoginDTO(req.body);
        inputData.validate();
        const result = await (0, userServices_1.softDeleteUserAccount)(Number(inputData.id));
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User soft deleted" });
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
        }
        return res.status(400).json({ message: "Something went wrong" });
    }
});
//update password and name
router.patch("/updateUserPassword", checkAuth_1.default, async (req, res) => {
    try {
        const inputData = new user_dto_1.SignupDTO(req.body);
        inputData.validate();
        const hashedPassword = await bcrypt_1.default.hash(inputData.password, 10);
        const result = await (0, userServices_1.updateUserDetails)(Number(inputData.id), inputData.name, hashedPassword);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found or deleted" });
        }
        return res.status(200).json({
            message: "User password updated successfully",
        });
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error) {
            return res.status(400).json({ message: err.message });
        }
        return res.status(400).json({ message: "Something went wrong" });
    }
});
exports.default = router;
