import getDB from './getDB';
import * as bcrypt from 'bcrypt'; // Importa bcrypt para el hashing de contraseñas

async function main(): Promise<void> {
    let connection = null;

    try {
        connection = await getDB(); // Establece la conexión a la base de datos
        const hashedPassword = await bcrypt.hash('1234', 10);

        console.log('Eliminando tablas...');

        if (connection) {
            await connection.query('DROP TABLE IF EXISTS sensorMonitor');
            await connection.query('DROP TABLE IF EXISTS project');
            await connection.query('DROP TABLE IF EXISTS user');
        }

        console.log('Tablas eliminadas!');

        console.log('Creando tablas...');

        if (connection) {
            await connection.query(`
                CREATE TABLE IF NOT EXISTS user (
                    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                    username VARCHAR(30) NOT NULL,
                    password VARCHAR(200) NOT NULL,
                    admin BOOLEAN,
                    userimage varchar(255)
                )
            `);

            await connection.query(`
                CREATE TABLE IF NOT EXISTS project (
                    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                    title VARCHAR(50) NOT NULL,
                    createdAt DATETIME,
                    idUser INT UNSIGNED NOT NULL,
                    FOREIGN KEY (idUser) REFERENCES user (id)
                    ON DELETE CASCADE
                )
            `);

            await connection.query(`
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
            await connection.query(
                `INSERT INTO user (username, password, admin, userimage)
                VALUES ('Sebas', '${hashedPassword}', true,'saitama.png'),
                ('Alba', '${hashedPassword}', false,'alba.jpg')`,
            );

            await connection.query(
                `INSERT INTO project (title, createdAt, idUser)
                VALUES ('trabajo1', '2022-08-09 17:00:00', 1),
                ('trabajo3', '2022-08-09 17:00:00', 2),
                ('trabajo4', '2022-08-09 17:00:00', 2),
                ('trabajo2', '2022-08-09 17:00:00', 1)`,
            );

            await connection.query(
                `INSERT INTO sensorMonitor (hour, temperature, humidity, idProject)
                VALUES ('2022-08-09 17:00:00', 30, 40, 1),
                ('2022-08-09 17:00:00', "30.8", 20, 1),
                ('2022-08-09 17:00:00', 20, 5, 2),
                ('2022-08-09 17:00:00', 10, 80, 2),
                ('2022-08-09 17:00:00', 0, 20, 3),
                ('2022-08-09 17:00:00', 40, 5, 3),
                ('2022-08-09 17:00:00', 50, 30, 4),
                ('2022-08-09 17:00:00', 60, 80, 4)`,
            );

            console.log('Datos de prueba insertados con éxito!');
        }
    } catch (error: any) {
        console.error(error.message);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

main();
