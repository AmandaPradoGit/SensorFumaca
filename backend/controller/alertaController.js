import { getAlertas, addAlerta } from "../model/alertaModel.js";

export function listarAlertas(req, res) {
  getAlertas((err, results) => {
    if (err) return res.status(500).send("Erro ao buscar alertas");
    res.json(results);
  });
}

export function criarAlerta(req, res) {
  const { mensagem } = req.body;
  addAlerta(mensagem, (err) => {
    if (err) return res.status(500).send("Erro ao salvar alerta");
    res.status(201).send("Alerta salvo com sucesso!");
  });
}
