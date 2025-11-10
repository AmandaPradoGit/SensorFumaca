const express = require('express');
const app = express();
const userController = require('./controllers/userController');

// Middleware para processar dados do formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname)); // Para servir arquivos estáticos

// Rota raiz
app.get('/', (req, res) => {
    res.redirect('/cadastro');
});

// Rota para a página de cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/cadastro.html');
});


// Rotas de usuário
app.post('/cadastro', userController.register);
app.post('/login', userController.login);

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});