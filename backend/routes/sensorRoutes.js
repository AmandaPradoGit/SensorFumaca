import express from "express";
import sensorController from "../controller/sensorController.js";

const router = express.Router();

router.post("/register", sensorController.registerSensor);

// lista todos (GET /sensores) — opcional
router.get("/", sensorController.listar);

// buscar por identificador (GET /sensores/:identificador)
// usar bind garante que o `this` do controller esteja correto, embora aqui não usemos `this`.
router.get("/:identificador", sensorController.buscarPorIdentificador.bind(sensorController));

export default router;
