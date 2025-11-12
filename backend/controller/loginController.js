import { getUsuarios } from "../model/usuario.js";

export const listUsers = (req, res) => {
  getUsuarios((err, users) => {
    if (err) {
      console.error("Erro ao obter usuários:", err);
      return res.status(500).json({ error: "Erro ao obter usuários." });
    }
    res.status(200).json(users);
  });
};
