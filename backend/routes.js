import express from "express";
import { listarAlertas, criarAlerta } from "../backend/alertaController.js";

const router = express.Router();

router.get("/", listarAlertas);
router.post("/", criarAlerta);

export default router;