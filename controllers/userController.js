const pool = require('../db');

class UserController {
    async register(req, res) {
        try {
            
            const { email, senha } = req.body;
            
            // Validação básica
            if (!email || !senha) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            // Inserir usuário no banco de dados
            const query = "INSERT INTO usuario (email, senha, dataCadastro) VALUES (?, ?, NOW())";
            const [result] = await pool.execute(query, [email, senha]);
            
            res.status(201).json({
                message: 'Usuário cadastrado com sucesso',
                userId: result.insertId
            });
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({ error: 'Erro ao cadastrar usuário' });
        }
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;
            
            // Validação básica
            if (!email || !senha) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            // Verificar usuário no banco de dados
            const query = "SELECT * FROM Usuario WHERE email = ? AND senha = ?";
            const [rows] = await pool.execute(query, [email, senha]);

            if (rows.length === 0) {
                return res.status(401).json({ error: 'Email ou senha inválidos' });
            }

            res.json({
                message: 'Login realizado com sucesso',
                userId: rows[0].id
            });
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            res.status(500).json({ error: 'Erro ao fazer login' });
        }
    }
}

module.exports = new UserController();