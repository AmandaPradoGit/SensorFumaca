import { getAlertas, addAlerta } from "../model/alertaModel.js";

export async function listarAlertas(req, res) {
  try {
    const usuarioId = req.params.usuarioId;
    const alertas = await getAlertas(usuarioId);
    res.json(alertas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar alertas" });
  }
}

export async function criarAlerta(req, res) {
  try {
    const { sensor, valor, nivel } = req.body;

    if (!sensor || !valor || !nivel) {
      return res.status(400).json({ erro: "Dados incompletos" });
    }

    await addAlerta(sensor, valor, nivel);
    res.status(201).json({ mensagem: "Alerta salvo com sucesso!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao registrar alerta" });
  }
}

export async function intervaloMedio(req, res) {
  try {
    const usuarioId = req.params.usuarioId;
    const intervalo = await getIntervaloMedio(usuarioId);
    res.json({ intervaloMedio: intervalo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao calcular intervalo médio" });
  }
}