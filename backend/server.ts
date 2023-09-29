import express, { Express, Request, Response, NextFunction } from 'express';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import cors from 'cors';
import * as dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import projectRoutes from './routes/projectRoutes';

const app: Express = express();
dotenv.config();

const PORT: number | undefined = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : undefined;

// Middleware
app.use(express.json()); // Middleware para el análisis de solicitudes JSON
app.use(express.static('static'));
app.use(fileUpload()); // Middleware para el manejo de archivos
app.use(morgan('dev')); // Middleware para el registro de solicitudes HTTP en el modo 'dev'
app.use(
    cors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    }),
); // Middleware para habilitar CORS

// Rutas para usuarios
app.use('/api', userRoutes);

// Rutas para proyectos
app.use('/api', projectRoutes);

// Middleware de manejo de errores global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500);
    res.json({
        status: 'Error',
        message: err.message,
    });
});

// Iniciar el servidor
if (PORT !== undefined) {
    app.listen(PORT, () => {
        console.log(`Server listening at http://localhost:${PORT}`);
    });
} else {
    console.error('El puerto no está definido en las variables de entorno.');
}
