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
    async listarPorUsuario(usuarioId) {
        const query = "SELECT * FROM sensores WHERE usuarioId = ?";
        const [rows] = await pool.execute(query, [usuarioId]);
        return rows;
    }

    async buscarAlertasPorSensor(sensorId) {
        const query = "SELECT * FROM alertas WHERE sensor = ? ORDER BY data_hora DESC";
        const [rows] = await pool.execute(query, [sensorId]);
        return rows;
    }
    async listarSensoresComAlertas(usuarioId) {
        const query = `
            SELECT s.nomeSala,
                   s.identificador,
                   a.valor,
                   a.nivel,
                   a.data_hora
            FROM sensores s
            LEFT JOIN alertas a
                   ON s.identificador = a.sensor
            WHERE s.usuarioId = ?
            ORDER BY s.nomeSala ASC, a.data_hora DESC
        `;
        const [rows] = await pool.execute(query, [usuarioId]);
        return rows;
    }
}
export default new SensorModel();