import pool from '../config/db.js';

class SensorModel {
    // Inserir novo sensor
    async criar(identificador, nomeSala, usuarioId) {
        const query = "INSERT INTO sensores (identificador, nomeSala, usuarioId) VALUES (?, ?, ?)";
        const [result] = await pool.execute(query, [identificador, nomeSala, usuarioId]);
        return result.insertId;
    }

    // Buscar sensor por identificador
    async buscarPorIdentificador(identificador) {
        const query = "SELECT * FROM sensores WHERE identificador = ?";
        const [rows] = await pool.execute(query, [identificador]);
        return rows.length > 0 ? rows[0] : null;
    }
}