import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import alertasRouter from "./routes.js";
import { addAlerta } from "./model/alertaModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Recebe dados do ESP32 via POST
app.post("/dados",async (req, res) => {
  const { sensor, valor, nivel } = req.body;

  if (!sensor || valor === undefined) {
    return res.status(400).json({ erro: "Dados incompletos" });
  }

  console.log("📡 Dados recebidos do ESP32:");
  console.log(`Sensor: ${sensor}, Valor: ${valor}, Alerta: ${nivel}`);

 addAlerta({ sensor, valor, nivel }, (err) => {
    if (err) return res.status(500).json({ erro: "Erro ao salvar alerta" });
    res.status(200).json({ mensagem: "Alerta salvo com sucesso" });
  });

});

// Página inicial (exemplo)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use("/alertas", alertasRouter);

app.listen(3001,'0.0.0.0',  () => console.log("Servidor rodando em http://localhost:3001"));
