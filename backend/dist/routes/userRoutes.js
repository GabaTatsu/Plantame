"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getUser_1 = __importDefault(require("../controllers/user/getUser"));
const router = express_1.default.Router();
router.get('/user/:idUser', getUser_1.default); // Obtener un solo usuario
exports.default = router;
