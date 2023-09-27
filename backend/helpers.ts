//Generador de errores
interface CustomError extends Error {
    httpStatus: number;
  }
  
  function generateError(message: string, code: number): CustomError {
    const error = new Error(message) as CustomError;
    error.httpStatus = code;
    return error;
  }
  
  export { generateError };