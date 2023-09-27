import { Request, Response, NextFunction } from 'express';
import getDB from '../../DB/getDB';
import { generateError } from '../../helpers';

// Definir un controlador asincrónico para obtener un usuario por su ID
const getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let connection;

  try {
    // Obtener una conexión a la base de datos
    connection = await getDB();

    if (!connection) {
      throw generateError('No se pudo establecer una conexión a la base de datos', 500);
    }

    const { idUser } = req.params;

    if (!idUser) {
      throw generateError('No se ha obtenido ningún ID', 400);
    }

    // Realizar una consulta a la base de datos para obtener la información del usuario por su ID
    const [user] = await connection.query(
      'SELECT username, id, userimage FROM user WHERE id = ?',
      [idUser]
    );

    if (!user) {
      throw generateError('No existe ningún usuario con el ID proporcionado', 404);
    }

    // Enviar una respuesta JSON con el usuario encontrado
    res.send({
      status: 'Ok',
      data: user,
    });
  } catch (error: any) {
    next(error);
  } finally {
    // Liberar la conexión a la base de datos en cualquier caso (éxito o error)
    if (connection) connection.release();
  }
};

export default getUser;
