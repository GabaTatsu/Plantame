"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getDB_1 = __importDefault(require("../../DB/getDB"));
const helpers_1 = require("../../helpers");
const sensorMonitorSchema_1 = __importDefault(require("../../schemas/sensorMonitorSchema"));
const insertSensorMonitor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let connection;
    try {
        connection = yield (0, getDB_1.default)();
        if (!connection) {
            throw (0, helpers_1.generateError)('No se pudo establecer una conexión a la base de datos', 500);
        }
        const { idProject } = req.params;
        const { temperature, humidity } = req.body;
        // Validar los datos de entrada utilizando el esquema de Joi
        const { error } = sensorMonitorSchema_1.default.validate({
            temperature,
            humidity,
        });
        if (error) {
            throw (0, helpers_1.generateError)('Datos de entrada no válidos', 400);
        }
        const [project] = yield connection.query('SELECT id FROM project WHERE id = ?', [idProject]);
        if (!project) {
            throw (0, helpers_1.generateError)('El proyecto especificado no existe', 404);
        }
        // Insertar los datos del sensorMonitor en la base de datos
        yield connection.query(`INSERT INTO sensorMonitor (hour, temperature, humidity, idProject)
       VALUES (?, ?, ?, ?)`, [new Date(), temperature, humidity, idProject]);
        res.send({
            status: 'Ok',
            message: 'Datos de sensores insertados con éxito!',
        });
    }
    catch (error) {
        next(error);
    }
    finally {
        // Liberar la conexión a la base de datos (si se estableció)
        if (connection)
            connection.release();
    }
});
exports.default = insertSensorMonitor;
