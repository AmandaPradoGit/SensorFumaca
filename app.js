const express = require('express');
const path = require('path');
const app = express();
const usuarioRoutes = require('./routes/usuarioRoutes');
const userController = require('./controllers/userController');
const pool = require('./config/db'); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname)); 


app.get('/', (req, res) => {
    res.redirect('/cadastro');
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cadastro.html'));
});

app.use('/usuarios', usuarioRoutes);

app.post('/cadastro', userController.register);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});