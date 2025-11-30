import express from "express";
import sensorController from "../controller/sensorController.js";

const router = express.Router();

router.post("/register", sensorController.registerSensor);
router.get("/", sensorController.listar);

export default router;