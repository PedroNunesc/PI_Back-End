"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
const auth = new AuthMiddleware_1.AuthMiddleware();
const controller = new UserController_1.UserController();
router.put('/users/:id', auth.authenticateToken, controller.update);
'S';
router.delete('/users/:id', auth.authenticateToken, controller.delete);
'S';
router.post('/users', controller.create);
'S';
router.get('/users', controller.listAll);
'S';
router.post('/auth/demo', (req, res) => controller.demoLogin(req, res));
exports.default = router;
//# sourceMappingURL=UserRoutes.js.map