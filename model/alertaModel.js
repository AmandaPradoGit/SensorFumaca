import db from "../config/db.js";

export function getAlertas(callback) {
  const query = "SELECT * FROM DadosAlerta ORDER BY dataHora DESC";
  db.query(query, callback);
}

export function addAlerta(callback) {
  const query = "INSERT INTO DadosAlerta (dataHora) VALUES (NOW())";
  db.query(query, callback);
}

