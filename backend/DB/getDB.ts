import { createPool, Pool, PoolConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

let pool: Pool | undefined;

// Función para obtener una conexión de la base de datos
const getDB = async (): Promise<PoolConnection | undefined> => {
  try {
    // Si el pool no existe, crea una nueva instancia
    if (!pool) {
      pool = await createPool({
        connectionLimit: 10,
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DATABASE,
        timezone: 'Z',
      });
    }
    
    // Obtiene y devuelve una conexión de la pool
    return await pool.getConnection();
  } catch (error: any) {
    console.error(error.message);
    return undefined; // Devuelve undefined en caso de error
  }
};

export default getDB;