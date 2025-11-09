import express from "express";
import { SerialPort, ReadlineParser } from "serialport";
import alertasRouter from "./routes.js";
import { addAlerta } from "./model/alertaModel.js";

const app = express();
app.use(express.json());

// Serial (Arduino Uno via USB)
//const port = new SerialPort({ path: "COM3", baudRate: 9600 });
//const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

//parser.on("data", (linha) => {
  //console.log("Arduino:", linha);
  //addAlerta(linha, (err) => {
    //if (err) console.error("Erro ao salvar alerta:", err);
  //});
//});

// Rotas API
app.use("/alertas", alertasRouter);

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
