import pool from "../config/db.js";

// LISTAR ALERTAS POR USUÁRIO
export async function getAlertas(usuarioId) {
  const query = `
    SELECT * 
    FROM alertas 
    WHERE usuarioId = ? 
    ORDER BY data_hora DESC
  `;
  const [rows] = await pool.execute(query, [usuarioId]);
  return rows;
}

/// -----------------------------
// ADICIONAR ALERTA (ESP32)
// -----------------------------

export async function addAlerta(sensor, valor, nivel) {
  const query = `
    INSERT INTO alertas (sensor, valor, nivel)
    VALUES (?, ?, ?)
  `;
  const [result] = await pool.execute(query, [sensor, valor, nivel]);
  return result.insertId;
}


// -----------------------------
// LISTAR ALERTAS POR USUÁRIO
// -----------------------------
export async function listarPorUsuario(usuarioId) {
  const query = `
    SELECT 
        a.id,
        a.sensor,
        a.valor,
        a.nivel,
        a.data_hora,
        S.nomeSala AS sala,
        S.identificador
    FROM alertas a
    INNER JOIN sensores S 
        ON S.identificador = a.sensor
    INNER JOIN usuario u 
        ON u.id = S.usuario_id
    WHERE u.id = ?
    ORDER BY a.data_hora DESC;
  `;

  const [rows] = await pool.execute(query, [usuarioId]);
  return rows;
}

// -----------------------------
// LISTAR ALERTAS POR SENSOR
// -----------------------------
export async function listarPorSensor(sensorId) {
  const query = `
    SELECT 
        id,
        sensor,
        valor,
        nivel,
        data_hora
    FROM alertas
    WHERE sensor = ?
    ORDER BY data_hora DESC;
  `;

  const [rows] = await pool.execute(query, [sensorId]);
  return rows;
}


// -----------------------------
// LISTAR SENSORES + ÚLTIMA LEITURA
// -----------------------------
export async function listarComUltimaLeitura(usuarioId) {
  const query = `
    SELECT 
        S.id,
        S.nomeSala,
        S.identificador,
        a.valor AS ultima_leitura,
        a.nivel,
        a.data_hora 
    FROM sensores S
    LEFT JOIN alertas a 
        ON a.id = (
          SELECT id FROM alertas 
          WHERE sensor = S.identificador 
          ORDER BY data_hora DESC LIMIT 1
        )
    WHERE S.usuario_id = ?
    ORDER BY S.nomeSala;
  `;

  const [rows] = await pool.execute(query, [usuarioId]);
  return rows;
}
export async function listarPorData(usuarioId, data) {
  const query = `
    SELECT a.* FROM alertas a
    JOIN sensores s ON a.sensor = s.identificador
    WHERE s.usuario_id = ? AND DATE(a.data_hora) = ?
  `;
  const [rows] = await pool.execute(query, [usuarioId, data]);
  return rows;
}

export async function listarSensoresEmAlerta(usuarioId) {
  const query = `
    SELECT DISTINCT a.sensor FROM alertas a
    JOIN sensores s ON a.sensor = s.identificador
    WHERE s.usuario_id = ? AND a.nivel = 'Alto'
    AND a.data_hora >= NOW() - INTERVAL 1 HOUR
  `;
  const [rows] = await pool.execute(query, [usuarioId]);
  return rows;
}