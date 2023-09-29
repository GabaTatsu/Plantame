import { Request, Response, NextFunction } from 'express';
import getDB from '../../DB/getDB';
import { generateError } from '../../helpers';

// Define las interfaces de TypeScript para las estructuras de datos
interface SensorMonitor {
    id: number;
    hour: string;
    temperature: number;
    humidity: number;
}

interface Project {
    id: number;
    title: string;
    sensorMonitors: SensorMonitor[];
}

interface User {
    id: number;
    username: string;
}

// Define la función principal para manejar la solicitud del usuario
const getUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    let connection;

    try {
        connection = await getDB();
        if (!connection) {
            throw generateError(
                'No se pudo establecer una conexión a la base de datos', // Mensaje de error
                500,
            );
        }

        const { idUser } = req.params;
        if (!idUser) {
            throw generateError('No se ha obtenido ningún ID', 400);
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

        const [userAndProjects] = await connection.query(query, [idUser]); // Ejecuta la consulta SQL

        if (!userAndProjects || (userAndProjects as any[]).length === 0) {
            throw generateError(
                'No se encontraron datos para el usuario especificado',
                404,
            );
        }

        // Crea un objeto de resultado para enviar como respuesta
        const result = {
            status: 'Ok',
            data: {
                user: {} as User,
                projects: [] as Project[],
            },
        };

        let currentUser: User | undefined;
        let currentProject: Project | undefined;

        // Itera a través del resultado de la consulta para estructurar los datos
        for (const row of userAndProjects as any[]) {
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
    } catch (error: any) {
        next(error);
    } finally {
        if (connection) connection.release(); // Libera la conexión a la base de datos
    }
};

export default getUser;
