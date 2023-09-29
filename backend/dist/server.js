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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const app = (0, express_1.default)();
dotenv.config();
const PORT = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : undefined;
// Middleware
app.use(express_1.default.json()); // Middleware para el análisis de solicitudes JSON
app.use(express_1.default.static('static'));
app.use((0, express_fileupload_1.default)()); // Middleware para el manejo de archivos
app.use((0, morgan_1.default)('dev')); // Middleware para el registro de solicitudes HTTP en el modo 'dev'
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
})); // Middleware para habilitar CORS
// Rutas para usuarios
app.use('/api', userRoutes_1.default);
// Rutas para proyectos
app.use('/api', projectRoutes_1.default);
// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500);
    res.json({
        status: 'Error',
        message: err.message,
    });
});
// Iniciar el servidor
if (PORT !== undefined) {
    app.listen(PORT, () => {
        console.log(`Server listening at http://localhost:${PORT}`);
    });
}
else {
    console.error('El puerto no está definido en las variables de entorno.');
}
