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
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let connection;
    try {
        connection = yield (0, getDB_1.default)();
        if (!connection) {
            throw (0, helpers_1.generateError)('No se pudo establecer una conexión a la base de datos', 500);
        }
        const { idUser } = req.params;
        if (!idUser) {
            throw (0, helpers_1.generateError)('No se ha obtenido ningún id', 400);
        }
        const [user] = yield connection.query('SELECT username, id, userimage FROM user WHERE id = ?', [idUser]);
        if (!user) {
            throw (0, helpers_1.generateError)('No existe ningún usuario', 404);
        }
        res.send({
            status: 'Ok',
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
    finally {
        if (connection)
            connection.release();
    }
});
exports.default = getUser;
