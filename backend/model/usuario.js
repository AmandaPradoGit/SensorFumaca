import pool from '../config/db.js';
import bcrypt from 'bcrypt';


class UsuarioModel {
    // Inserir novo usuário
    async criar(email, senha) {
    const saltRounds = 10; // custo do hash
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    const query = "INSERT INTO usuario (email, senha, dataCadastro) VALUES (?, ?, NOW())";
    const [result] = await pool.execute(query, [email, senhaHash]);
    return result.insertId;
    }

    // Buscar usuário por email
    async buscarPorEmail(email) {
        const query = "SELECT * FROM usuario WHERE email = ?";
        const [rows] = await pool.execute(query, [email]);
        return rows.length > 0 ? rows[0] : null;
    }

    // Buscar usuário por ID
    async buscarPorId(id) {
        const query = "SELECT * FROM usuario WHERE id = ?";
        const [rows] = await pool.execute(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    async verificarCredenciais(email, senha) {
    const query = "SELECT * FROM usuario WHERE email = ?";
    const [rows] = await pool.execute(query, [email]);

    if (rows.length === 0) return null;

    const usuario = rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    return senhaValida ? usuario : null;
}


    async listarTodos() {
        const query = "SELECT id, email, dataCadastro FROM usuario";
        const [rows] = await pool.execute(query);
        return rows;
    }
}

export default new UsuarioModel();