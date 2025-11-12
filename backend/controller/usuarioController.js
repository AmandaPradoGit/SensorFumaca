import usuarioModel from '../model/usuario.js';

class UserController {
    async register(req, res) {
        try {
            const { email, senha } = req.body;
            
            if (!email || !senha) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            // Verificar se o email já existe
            const usuarioExistente = await usuarioModel.buscarPorEmail(email);
            if (usuarioExistente) {
                return res.status(409).json({ error: 'Email já cadastrado' });
            }

            // Chamar o model para inserir o usuário
            const userId = await usuarioModel.criar(email, senha);
            
            res.redirect('../views/entrar.html');
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

            const usuario = await usuarioModel.verificarCredenciais(email, senha);

            if (!usuario) {
                return res.status(401).json({ error: 'Email ou senha inválidos' });
            }

            res.redirect('sensores.html');
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            res.status(500).json({ error: 'Erro ao fazer login' });
        }
    }
}

export default new UserController();