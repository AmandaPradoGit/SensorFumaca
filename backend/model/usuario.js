import pool from '../config/db.js';

class UsuarioModel {
    // Inserir novo usuário
    async criar(email, senha) {
        const query = "INSERT INTO usuario (email, senha, dataCadastro) VALUES (?, ?, NOW())";
        const [result] = await pool.execute(query, [email, senha]);
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
        const query = "SELECT * FROM usuario WHERE email = ? AND senha = ?";
        const [rows] = await pool.execute(query, [email, senha]);
        return rows.length > 0 ? rows[0] : null;
    }

    async listarTodos() {
        const query = "SELECT id, email, dataCadastro FROM usuario";
        const [rows] = await pool.execute(query);
        return rows;
    }
}

export default new UsuarioModel();