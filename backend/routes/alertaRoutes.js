import express from "express";
import { listarAlertas, criarAlerta } from "../controller/alertaController.js";
import { autenticar } from "../auth.js";
import * as alertaModel from "../model/alertaModel.js";

const router = express.Router();

// Removida rota GET /:usuarioId para evitar conflito com /dashboard
router.post("/", criarAlerta);
router.get("/", async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const alertas = await alertaModel.listarPorUsuario(usuarioId);
    res.json(alertas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar alertas" });
  }
});

router.get("/dashboard", autenticar, async (req, res) => {
  const usuarioId = req.session.usuario.id;
  try {
    console.log("Dashboard chamado para usuarioId:", usuarioId);

    const hoje = new Date().toISOString().split("T")[0];

    const alertasHoje = await alertaModel.listarPorData(usuarioId, hoje);

    const sensoresAlerta = await alertaModel.listarSensoresEmAlerta(usuarioId);

    const intervaloMedio = await alertaModel.getIntervaloMedio(usuarioId);

    res.json({
      alertasHoje: alertasHoje.length,
      sensoresEmAlerta: sensoresAlerta.length,
      intervaloMedio: intervaloMedio || "00:00"
    });
  } catch (erro) {
    console.error("Erro em /alertas/dashboard:", erro);
    res.status(500).json({
      error: erro.message || "Erro ao carregar dados do dashboard"
    });
  }
});

export default router;