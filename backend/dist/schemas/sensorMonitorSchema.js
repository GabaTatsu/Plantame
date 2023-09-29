"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const sensorMonitorSchema = joi_1.default.object({
    temperature: joi_1.default.number().min(-50).max(100).precision(1).required(),
    humidity: joi_1.default.number().min(0).max(100).precision(1).required(),
});
exports.default = sensorMonitorSchema;
