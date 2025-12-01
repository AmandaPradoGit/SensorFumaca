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

export async function listarPorData(usuarioId) {
  const query = `
    SELECT a.* FROM alertas a
    JOIN sensores s ON a.sensor = s.identificador
    WHERE s.usuario_id = ? AND DATE(a.data_hora) = CURDATE()
  `;
  const [rows] = await pool.execute(query, [usuarioId]);
  return rows;
}

export async function listarSensoresEmAlerta(usuarioId) {
  const query = `
    SELECT a.sensor, a.valor, a.data_hora
    FROM alertas a
    JOIN sensores s ON a.sensor = s.identificador
    WHERE s.usuario_id = ?
    ORDER BY a.data_hora DESC
  `;
  const [rows] = await pool.execute(query, [usuarioId]);

  // Agrupar por sensor e pegar apenas o último alerta
  const sensoresMap = new Map();
  for (const alerta of rows) {
    if (!sensoresMap.has(alerta.sensor)) {
      sensoresMap.set(alerta.sensor, alerta);
    }
  }

  const sensoresEmAlerta = [];
  for (const alerta of sensoresMap.values()) {
    const minutosPassados = (Date.now() - new Date(alerta.data_hora)) / 60000;

    if (minutosPassados <= 5) {
      if (alerta.valor < 50) {
        // Estável → não entra na lista
      } else {
        // Alerta! → entra na lista de ativos
        sensoresEmAlerta.push(alerta.sensor);
      }
    }
  }

  return sensoresEmAlerta;
}



export async function getIntervaloMedio(usuarioId) {
  const query = `
    SELECT a.data_hora 
    FROM alertas a
    JOIN sensores s ON a.sensor = s.identificador
    WHERE s.usuario_id = ?
    ORDER BY a.data_hora ASC
  `;
  const [rows] = await pool.execute(query, [usuarioId]);

  if (rows.length < 2) return null;

  let totalDiff = 0;
  for (let i = 1; i < rows.length; i++) {
    const anterior = new Date(rows[i - 1].data_hora);
    const atual = new Date(rows[i].data_hora);
    totalDiff += (atual - anterior);
  }

  const mediaMs = totalDiff / (rows.length - 1);
  const mediaMin = Math.floor(mediaMs / 60000);
  const horas = Math.floor(mediaMin / 60);
  const minutos = mediaMin % 60;

  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}
