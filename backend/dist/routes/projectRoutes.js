"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const insertSensorMonitor_1 = __importDefault(require("../controllers/project/insertSensorMonitor"));
const router = express_1.default.Router();
router.post('/project/sensor/:idProject', insertSensorMonitor_1.default); // Ingresar datos de sensores
exports.default = router;
