import { addUsuario } from "../model/usuario.js";

export const registerUser = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  addUsuario(email, senha, new Date(), (err, userId) => {
    if (err) {
      console.error("Erro ao registrar usuário:", err);
      return res.status(500).json({ error: "Erro ao registrar usuário." });
    }
    res.status(201).json({ message: "Usuário registrado com sucesso.", userId });
  });
};