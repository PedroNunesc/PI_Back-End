"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const Auth_1 = require("../config/Auth");
const bcrypt = __importStar(require("bcryptjs"));
const userRepository = new UserRepository_1.UserRepository();
class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }
            const user = await userRepository.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            const token = (0, Auth_1.generateToken)({ id: user.id, role: user.role });
            return res.status(200).json({ message: "Logged in successfully!", token: token });
        }
        catch (error) {
            console.error("Login error: ", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async me(req, res) {
        try {
            const id = req.user.id;
            const user = await userRepository.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.json(user);
        }
        catch (error) {
            console.error("Me error: ", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async logout(req, res) {
        try {
            return res.status(200).json({ message: "Logged out successfully" });
        }
        catch (error) {
            console.error("Logout error: ", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map