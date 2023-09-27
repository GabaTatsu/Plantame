"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateError = void 0;
function generateError(message, code) {
    const error = new Error(message);
    error.httpStatus = code;
    return error;
}
exports.generateError = generateError;
