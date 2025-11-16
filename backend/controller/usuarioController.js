// userController.js
import usuarioModel from '../model/usuario.js';

class UserController {
    async register(req, res) {
        try {
            // MUDANÇA 1: Aceitar 'pass' (do app) ou 'senha' (do site)
            const { email, senha, pass } = req.body;
            const password = senha || pass; // Usa 'senha' se existir, senão usa 'pass'

            if (!email || !password) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            const usuarioExistente = await usuarioModel.buscarPorEmail(email);
            if (usuarioExistente) {
                return res.status(409).json({ error: 'Email já cadastrado' });
            }

            const userId = await usuarioModel.criar(email, password);

            // MUDANÇA 2: Resposta inteligente
            // Se o cliente (Android) aceita JSON...
            if (req.accepts('json')) {
                // ...responda com os dados do usuário em JSON.
                return res.status(201).json({ 
                    id: userId, 
                    email: email 
                });
            } else {
                // ...senão (é o site), crie a sessão e redirecione.
                req.session.usuario = {
                    id: userId,
                    email: email
                };
                return res.redirect('/entrar');
            }
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({ error: 'Erro ao cadastrar usuário' });
        }
    }

    async login(req, res) {
        try {
            // MUDANÇA 1: Aceitar 'pass' (do app) ou 'senha' (do site)
            const { email, senha, pass } = req.body;
            const password = senha || pass;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            const usuario = await usuarioModel.verificarCredenciais(email, password);

            if (!usuario) {
                return res.status(401).json({ error: 'Email ou senha inválidos' });
            }

            // MUDANÇA 2: Resposta inteligente
            if (req.accepts('json')) {
                // Para o Android, apenas retorne os dados do usuário.
                return res.status(200).json({
                    id: usuario.id,
                    email: usuario.email
                });
            } else {
                // Para o site, crie a sessão e redirecione.
                req.session.usuario = {
                    id: usuario.id,
                    email: usuario.email
                };
                return res.redirect('/sensores');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            res.status(500).json({ error: 'Erro ao fazer login' });
        }
    }
    
    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao fazer logout' });
            }
            res.redirect('/entrar');
        });
    }
}

export default new UserController();