import express, { Router } from 'express';
import getUser from '../controllers/user/getUser';

const router: Router = express.Router();

router.get('/user/:idUser', getUser); // Obtener un solo usuario

export default router;