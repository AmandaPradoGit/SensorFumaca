import path from 'path';
import express from 'express';
import usuarioRoutes from './routes.js';
import userController from './controller/usuarioController.js';
import pool from './config/db.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  
app.use(express.static(path.join(__dirname, '..', 'views')));

app.get('/', (req, res) => {
    res.redirect('/cadastro');
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'cadastro.html'));
});

app.get('/entrar', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'entrar.html'));
});

app.get('/sensores', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'sensores.html'));
});

app.use('/usuarios', usuarioRoutes);
app.post('/cadastro', userController.register);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});