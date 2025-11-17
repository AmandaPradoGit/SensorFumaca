// userController.js
import usuarioModel from '../model/usuario.js';

class UserController {

    async register(req, res) {
        try {
            const { email, senha, pass } = req.body;
            const password = senha || pass;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            const usuarioExistente = await usuarioModel.buscarPorEmail(email);
            if (usuarioExistente) {
                return res.status(409).json({ error: 'Email já cadastrado' });
            }

            const userId = await usuarioModel.criar(email, password);

           if (req.is('json')) {
            // Se o Content-Type é JSON, então é o App Android.
            return res.status(200).json({
                id: usuario.id,
                email: usuario.email
            });
            } else {
                // Senão, é um formulário do site.
                req.session.usuario = {
                    id: usuario.id,
                    email: usuario.email
                };
                return res.redirect('/sensores');
            }

        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({ error: 'Erro ao cadastrar usuário' });
        }
    }

    async login(req, res) {
        try {
            const { email, senha, pass } = req.body;
            const password = senha || pass;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            const usuario = await usuarioModel.verificarCredenciais(email, password);
            if (!usuario) {
                return res.status(401).json({ error: 'Email ou senha inválidos' });
            }

            if (req.is('json')) {
            // Se o Content-Type é JSON, então é o App Android.
            return res.status(200).json({
                id: usuario.id,
                email: usuario.email
            });
            } else {
                // Senão, é um formulário do site.
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
        req.session.destroy(err => {
            if (err) return res.status(500).json({ error: 'Erro ao fazer logout' });
            res.redirect('/entrar');
        });
    }
}

export default new UserController();
