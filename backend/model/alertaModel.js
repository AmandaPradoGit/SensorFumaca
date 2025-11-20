import db from '../config/db.js';
const limitvalor =300;
const nivelAmarelo = 400;
const nivelVermelho = 600;

export function getAlertas(callback) {
  const query = "SELECT * FROM alertas ORDER BY data_hora DESC";
  db.query(query, callback);
}

export  function addAlerta({sensor, valor, nivel},callback) {
  const sql = "INSERT INTO alertas (sensor, valor, nivel, data_hora) VALUES (?, ?, ?, NOW())";
  db.query(sql, [sensor, valor, nivel], (err, result) => {
    if (err) {
      console.error("Erro ao adicionar alerta:", err);
      return callback(err);
    }
    callback(null, result);
  });
};
 
