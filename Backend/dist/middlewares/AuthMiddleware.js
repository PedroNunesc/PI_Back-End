"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthMiddleware {
    async authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }
        try {
            const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = payload;
            return next();
        }
        catch {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
    async isAdmin(req, res, next) {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        return next();
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=AuthMiddleware.js.map