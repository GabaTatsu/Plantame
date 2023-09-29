import express, { Router } from 'express';
import insertSensorMonitor from '../controllers/project/insertSensorMonitor';

const router: Router = express.Router();

router.post('/project/sensor/:idProject', insertSensorMonitor); // Ingresar datos de sensores

export default router;
