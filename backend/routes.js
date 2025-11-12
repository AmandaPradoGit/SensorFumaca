import express from 'express';
import userController from './controller/usuarioController.js';

const router = express.Router();

// POST /usuarios/register - Cadastro de novo usuário
router.post('/register', (req, res) => userController.register(req, res));

// POST /usuarios/login - Login de usuário
router.post('/login', (req, res) => userController.login(req, res));

export default router;