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
const getDB_1 = __importDefault(require("./getDB"));
const bcrypt = __importStar(require("bcrypt")); // Importa bcrypt para el hashing de contraseñas
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let connection = null;
        try {
            connection = yield (0, getDB_1.default)(); // Establece la conexión a la base de datos
            const hashedPassword = yield bcrypt.hash('1234', 10);
            console.log('Eliminando tablas...');
            if (connection) {
                yield connection.query('DROP TABLE IF EXISTS sensorMonitor');
                yield connection.query('DROP TABLE IF EXISTS project');
                yield connection.query('DROP TABLE IF EXISTS user');
            }
            console.log('Tablas eliminadas!');
            console.log('Creando tablas...');
            if (connection) {
                yield connection.query(`
                CREATE TABLE IF NOT EXISTS user (
                    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                    username VARCHAR(30) NOT NULL,
                    password VARCHAR(200) NOT NULL,
                    admin BOOLEAN,
                    userimage varchar(255)
                )
            `);
                yield connection.query(`
                CREATE TABLE IF NOT EXISTS project (
                    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                    title VARCHAR(50) NOT NULL,
                    createdAt DATETIME,
                    idUser INT UNSIGNED NOT NULL,
                    FOREIGN KEY (idUser) REFERENCES user (id)
                    ON DELETE CASCADE
                )
            `);
                yield connection.query(`
                CREATE TABLE IF NOT EXISTS sensorMonitor (
                    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                    hour DATETIME,
                    temperature DECIMAL(4, 1) CHECK (temperature >= -50 AND temperature <= 100),
                    humidity DECIMAL(4, 1) CHECK (humidity >= 0 AND humidity <= 100),
                    idProject INT UNSIGNED NOT NULL,
                    FOREIGN KEY (idProject) REFERENCES project (id)
                    ON DELETE CASCADE
                )
            `);
            }
            console.log('Tablas creadas!');
            console.log('Insertando datos de prueba...');
            if (connection) {
                yield connection.query(`INSERT INTO user (username, password, admin, userimage)
                VALUES ('Sebas', '${hashedPassword}', true,'saitama.png'),
                ('Alba', '${hashedPassword}', false,'alba.jpg')`);
                yield connection.query(`INSERT INTO project (title, createdAt, idUser)
                VALUES ('trabajo1', '2022-08-09 17:00:00', 1),
                ('trabajo3', '2022-08-09 17:00:00', 2),
                ('trabajo4', '2022-08-09 17:00:00', 2),
                ('trabajo2', '2022-08-09 17:00:00', 1)`);
                yield connection.query(`INSERT INTO sensorMonitor (hour, temperature, humidity, idProject)
                VALUES ('2022-08-09 17:00:00', 30, 40, 1),
                ('2022-08-09 17:00:00', "30.8", 20, 1),
                ('2022-08-09 17:00:00', 20, 5, 2),
                ('2022-08-09 17:00:00', 10, 80, 2),
                ('2022-08-09 17:00:00', 0, 20, 3),
                ('2022-08-09 17:00:00', 40, 5, 3),
                ('2022-08-09 17:00:00', 50, 30, 4),
                ('2022-08-09 17:00:00', 60, 80, 4)`);
                console.log('Datos de prueba insertados con éxito!');
            }
        }
        catch (error) {
            console.error(error.message);
        }
        finally {
            if (connection)
                connection.release();
            process.exit();
        }
    });
}
main();
