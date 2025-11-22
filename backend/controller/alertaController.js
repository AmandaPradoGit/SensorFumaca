import { getAlertas, addAlerta } from '../model/alertaModel.js';
import sensorModel from '../model/sensorModel.js';

class AlertaController {

    async listarPorSensorId(req, res) {
        const sensorId = req.query.sensor_id;
        try {
            const alertas = await sensorModel.buscarAlertasPorSensor(sensorId);
            res.json(alertas);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar alertas.' });
        }
    }

    async listar(req, res) {
        try {
            // Verifica sessão
            if (!req.session?.usuario) {
                return res.status(401).json({ error: 'Não autorizado' });
            }
            // Busca sensores com alertas do usuário
            const sensores = await sensorModel.listarComAlertasPorUsuario(
                req.session.usuario.id
            );
            res.json(sensores);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar sensores e alertas' });
        }
    }

    async criarAlerta(req, res) {
        try {
            // Verifica sessão
            if (!req.session?.usuario) {
                return res.status(401).json({ error: 'Não autorizado' });
            }

            const { mensagem } = req.body;

            addAlerta(mensagem, (err) => {
                if (err) {
                    return res.status(500).send("Erro ao salvar alerta");
                }
                res.status(201).send("Alerta salvo com sucesso!");
            });

        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar alerta' });
        }
    }
}

export default new AlertaController();
