import path from 'path';
import 'dotenv/config'; 

import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import axios from 'axios';

import usuarioRouter from './routes/usuarioRoutes.js';
import sensorRouter from './routes/sensorRoutes.js';
import alertaRouter from './routes/alertaRoutes.js';

import userController from './controller/usuarioController.js';
import sensorModel from './model/sensor.js';
import * as alertaModel from './model/alertaModel.js';

import { autenticar } from './auth.js';
import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
console.log("TELEGRAM_BOT_TOKEN:", !!process.env.TELEGRAM_BOT_TOKEN);
console.log("TELEGRAM_CHAT_ID:", process.env.TELEGRAM_CHAT_ID);

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
//teste 
app.get("/debug", (req, res) => {
    res.json(req.session);
});


app.get('/', (req, res) => {
    res.redirect('/cadastro');
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'cadastro.html'));
});

app.get('/entrar', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'entrar.html'));
});

app.get('/sensores', autenticar, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'sensores.html'));
});

// Lista alertas do usuário ou de um sensor específico
app.get('/api/sensores', autenticar, async (req, res) => {
  const usuarioId = req.session.usuario.id;

  try {
    const sensores = await alertaModel.listarComUltimaLeitura(usuarioId);
    res.json(sensores);
  } catch (err) {
    console.error("ERRO EM /api/sensores:", err);
    res.status(500).json({ erro: 'Erro ao buscar sensores' });
  }
});


app.get('/cadastrarSensores', autenticar, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'cadastrarSensores.html'));
});

app.get('/dashboards', autenticar, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'dashboards.html'));
});

app.use('/usuarios', usuarioRouter);
app.use('/sensores', sensorRouter);

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao fazer logout' });
        }
        res.redirect('/entrar');
    });
});
app.post('/cadastro', userController.register);

// Lista alertas do usuário ou de um sensor específico
app.get('/api/alertas', autenticar, async (req, res) => {
  const usuarioId = req.session.userId || (req.session.usuario && req.session.usuario.id);  const { sensorId } = req.query;
  try {
    const alertas = sensorId
      ? await alertaModel.listarPorSensor(sensorId)
      : await alertaModel.listarPorUsuario(usuarioId);
    res.json(alertas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar alertas' });
  }
});

app.use("/alertas", alertaRouter);

// Recebe dados do ESP32 via POST

app.post("/dados", (req, res) => {
  // 🔥 logs
  console.log('>>>> /dados RECEBIDO - start', new Date().toISOString());
  console.log('Headers:', req.headers);
  console.log('Body present? ', req.body && Object.keys(req.body).length > 0);

  try {
    const { sensor, valor, nivel } = req.body;
    console.log("📡 Dados recebidos:", sensor, valor, nivel);

    // Processamento em background (não trava o ESP/Postman)
    (async () => {
      try {
        await alertaModel.addAlerta(sensor, valor, nivel);
        console.log("addAlerta finalizado em background");
      } catch (err) {
        console.error("Erro no addAlerta (background):", err);
      }
    })();

    // Resposta imediata
    return res.status(200).json({ mensagem: "Recebido" });

  } catch (err) {
    console.error("Erro inicial no /dados:", err);
    return res.status(500).json({ erro: "Erro interno" });
  }
});



const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});