"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const AuthController_1 = require("../controllers/AuthController");
const router = (0, express_1.Router)();
const authMiddleware = new AuthMiddleware_1.AuthMiddleware();
const controller = new AuthController_1.AuthController();
router.post("/login", controller.login);
'S';
router.get("/me", authMiddleware.authenticateToken, controller.me);
'S';
router.post("/logout", authMiddleware.authenticateToken, controller.logout);
'S';
exports.default = router;
//# sourceMappingURL=AuthRoutes.js.map