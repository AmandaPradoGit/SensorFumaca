import db from "../config/db.js";

export const addUsuario = (email, senha, dataCadastro,  callback) => {
  const query = "INSERT INTO Usuario (email, senha, dataCadastro) VALUES (?, ?, NOW())";
  db.query(query, [email, senha, dataCadastro], (err, results) => {
    if (err) return callback(err);
    callback(null, results.insertId);
  });
};

export const getUsuarios = (callback) => {
  const query = "SELECT * FROM Usuario";
  db.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};
