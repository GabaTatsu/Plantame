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
// Define la función principal para manejar la solicitud del usuario
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let connection;
    try {
        connection = yield (0, getDB_1.default)();
        if (!connection) {
            throw (0, helpers_1.generateError)('No se pudo establecer una conexión a la base de datos', // Mensaje de error
            500);
        }
        const { idUser } = req.params;
        if (!idUser) {
            throw (0, helpers_1.generateError)('No se ha obtenido ningún ID', 400);
        }
        // Define la consulta SQL para obtener datos de usuario, proyectos y monitores de sensor
        const query = `
            SELECT
                u.id AS userId,
                u.username AS username,
                p.id AS projectId,
                p.title AS projectTitle,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', sm.id,
                        'hour', sm.hour,
                        'temperature', sm.temperature,
                        'humidity', sm.humidity
                    )
                ) AS sensorMonitors
            FROM user u
            LEFT JOIN project p ON u.id = p.idUser
            LEFT JOIN sensorMonitor sm ON p.id = sm.idProject
            WHERE u.id = ?
            GROUP BY u.id, u.username, p.id, p.title
            ORDER BY u.id, p.id;
        `;
        const [userAndProjects] = yield connection.query(query, [idUser]); // Ejecuta la consulta SQL
        if (!userAndProjects || userAndProjects.length === 0) {
            throw (0, helpers_1.generateError)('No se encontraron datos para el usuario especificado', 404);
        }
        // Crea un objeto de resultado para enviar como respuesta
        const result = {
            status: 'Ok',
            data: {
                user: {},
                projects: [],
            },
        };
        let currentUser;
        let currentProject;
        // Itera a través del resultado de la consulta para estructurar los datos
        for (const row of userAndProjects) {
            if (!currentUser || currentUser.id !== row.userId) {
                currentUser = {
                    id: row.userId,
                    username: row.username,
                };
                result.data.user = currentUser;
                currentProject = undefined;
            }
            if (!currentProject || currentProject.id !== row.projectId) {
                currentProject = {
                    id: row.projectId,
                    title: row.projectTitle,
                    sensorMonitors: row.sensorMonitors,
                };
                result.data.projects.push(currentProject);
            }
        }
        res.send(result); // Envía el resultado como respuesta HTTP
    }
    catch (error) {
        next(error);
    }
    finally {
        if (connection)
            connection.release(); // Libera la conexión a la base de datos
    }
});
exports.default = getUser;
