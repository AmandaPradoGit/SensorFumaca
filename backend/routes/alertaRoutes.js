import express from "express";
import { listarAlertas, criarAlerta } from "../controller/alertaController.js";

const router = express.Router();

router.get("/:usuarioId", listarAlertas);
router.post("/", criarAlerta);
router.get("/", async (req, res) => {
  try {
    const usuarioId = req.session.usuario; // pega o usuário logado
    const alertas = await alertaModel.listarPorUsuario(usuarioId);
    res.json(alertas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar alertas" });
  }
});

export default router;
