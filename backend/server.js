import path from 'path';
import express from 'express';
import session from 'express-session';
import routes from './routes.js';
import userController from './controller/usuarioController.js';
import {autenticar} from './auth.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());  

app.use(express.static(path.join(__dirname, '..', 'views')));

app.use(session({
    secret: 'chavemuitoSecreta', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,           
        maxAge: 1000 * 60 * 60 * 24 //24 horas
    }
}));

app.get('/', (req, res) => {
    res.redirect('/inicio');
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'cadastro.html'));
});

app.post('/entrar', userController.login);

app.get('/entrar', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'entrar.html'));
});

app.get('/sensores', autenticar, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'sensores.html'));
});

app.get('/cadastrarSensores', autenticar, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'cadastrarSensores.html'));
});

app.get('/dashboards', autenticar, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'dashboards.html'));
});

app.get('/inicio', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'inicio.html'));
});


app.use('/usuarios', routes);
app.use('/sensores', routes);

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao fazer logout' });
        }
        res.redirect('/entrar');
    });
});
app.post('/cadastro', userController.register);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});