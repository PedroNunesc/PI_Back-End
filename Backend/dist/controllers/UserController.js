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
exports.UserController = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const TripRepository_1 = require("../repositories/TripRepository");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const userRepository = new UserRepository_1.UserRepository();
const tripRepository = new TripRepository_1.TripRepository();
class UserController {
    async listAll(req, res) {
        try {
            const users = await userRepository.findAll();
            return res.json(users);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async list(req, res) {
        try {
            const users = await userRepository.findAllWithTrips();
            return res.json(users);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async show(req, res) {
        try {
            const id = Number(req.params.id) || req.user.id;
            if (req.user.role !== "admin" && id !== req.user.id) {
                return res.status(403).json({ message: "Access denied" });
            }
            const user = await userRepository.findByIdWithTrips(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.json(user);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async create(req, res) {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res
                    .status(400)
                    .json({ message: "Name, email and password are required" });
            }
            const userExists = await userRepository.findByEmail(email);
            if (userExists) {
                return res.status(409).json({ message: "Email already in use" });
            }
            const user = await userRepository.createAndSave({
                name,
                email,
                password,
            });
            return res.status(201).json(user);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async update(req, res) {
        const id = Number(req.params.id) || req.user.id;
        const user = await userRepository.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { name, email, password, currentPassword } = req.body;
        if (name)
            user.name = name;
        if (email)
            user.email = email;
        if (password) {
            if (!currentPassword) {
                return res.status(400).json({
                    message: "Senha atual é obrigatória para trocar a senha"
                });
            }
            const passwordMatch = await bcrypt.compare(currentPassword, user.password);
            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Senha atual incorreta"
                });
            }
            user.password = password;
        }
        const updatedUser = await userRepository.save(user);
        return res.json(updatedUser);
    }
    async delete(req, res) {
        try {
            const id = Number(req.params.id) || req.user.id;
            if (req.user.role !== "admin" && id !== req.user.id) {
                return res.status(403).json({ message: "Access denied" });
            }
            const user = await userRepository.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            await userRepository.removeUser(user);
            return res.status(204).send();
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async demoLogin(req, res) {
        try {
            const demoEmail = `Visitante_${Date.now()}_${Math.floor(Math.random() * 10000)}@visitante.com`;
            const demoPassword = Math.random().toString(36).substring(2, 10);
            const demoName = "Usuario Visitante";
            const hashedPassword = await bcrypt.hash(demoPassword, 10);
            const demoUser = await userRepository.createAndSave({
                name: demoName,
                email: demoEmail,
                password: hashedPassword,
                role: "demo"
            });
            await tripRepository.createAndSave({
                name: "Viagem de Demonstração",
                city: "Paris",
                country: "França",
                startDate: new Date().toISOString().split("T")[0],
                endDate: new Date().toISOString().split("T")[0],
                user: demoUser,
                automaticList: false,
            });
            const token = jwt.sign({ id: demoUser.id, role: demoUser.role }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
            return res.status(201).json({ user: demoUser, token });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro ao criar conta Visitante" });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map