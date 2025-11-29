import pool from '../config/db.js';

class SensorModel {
    // Inserir novo sensor
    async criar(identificador, nomeSala, usuarioId) {
        const query = "INSERT INTO sensores (identificador, nomeSala, usuario_id, criado_em) VALUES (?, ?, ?,NOW())";
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
        const query = "SELECT * FROM sensores WHERE usuario_id = ?";
        const [rows] = await pool.execute(query, [usuarioId]);
        return rows;
    }
   // async InativarSensor(sensorId)(
     //   const query = "UPDATE sensores SET ativo = 0 WHERE id = ?";
       // const [result] = await pool.execute(query, [sensorId]);
       // return result.affectedRows > 0; 
  //  )
}
export default new SensorModel();