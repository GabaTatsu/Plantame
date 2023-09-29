import { Request, Response, NextFunction } from 'express';
import getDB from '../../DB/getDB';
import { generateError } from '../../helpers';
import sensorMonitorSchema from '../../schemas/sensorMonitorSchema';

const insertSensorMonitor = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    let connection;

    try {
        connection = await getDB();

        if (!connection) {
            throw generateError(
                'No se pudo establecer una conexión a la base de datos',
                500,
            );
        }

        const { idProject } = req.params;
        const { temperature, humidity } = req.body;

        // Validar los datos de entrada utilizando el esquema de Joi
        const { error } = sensorMonitorSchema.validate({
            temperature,
            humidity,
        });

        if (error) {
            throw generateError('Datos de entrada no válidos', 400);
        }

        const [project] = await connection.query(
            'SELECT id FROM project WHERE id = ?',
            [idProject],
        );

        if (!project) {
            throw generateError('El proyecto especificado no existe', 404);
        }

        // Insertar los datos del sensorMonitor en la base de datos
        await connection.query(
            `INSERT INTO sensorMonitor (hour, temperature, humidity, idProject)
       VALUES (?, ?, ?, ?)`,
            [new Date(), temperature, humidity, idProject],
        );

        res.send({
            status: 'Ok',
            message: 'Datos de sensores insertados con éxito!',
        });
    } catch (error: any) {
        next(error);
    } finally {
        // Liberar la conexión a la base de datos (si se estableció)
        if (connection) connection.release();
    }
};

export default insertSensorMonitor;
