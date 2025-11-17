import sensorModel from '../model/sensor.js';

class SensorController {
    async registerSensor(req, res) {
        try {
            //Aceita os nomes dos campos do site E do app.
            const { chave_sensor, nome_local, idUsuario } = req.body;

            const finalSensorId = chave_sensor;
            const finalNomeSala = nome_local;

            // Verifica se a requisição veio do app (que envia 'Content-Type: application/json')
            const isApp = req.is('json');
            const finalUsuarioId = isApp ? idUsuario : req.session?.usuario?.id;

            // Validação com os dados unificados
            if (!finalSensorId || !finalNomeSala || !finalUsuarioId) {
                return res.status(400).json({ 
                    error: 'Dados incompletos. É necessário ID do sensor, nome do local e ID do usuário.' 
                });
            }

            const sensorExistente = await sensorModel.buscarPorIdentificador(finalSensorId);
            if (sensorExistente) {
                return res.status(409).json({ error: 'Sensor com este ID já cadastrado' });
            }

            await sensorModel.criar(finalSensorId, finalNomeSala, finalUsuarioId);
            
            if (isApp) {
                // Para o Android, responda com JSON.
                const novoSensor = { 
                    id: finalSensorId, 
                    nomeSala: finalNomeSala, // Usando os nomes que o app espera na resposta
                    idUsuario: finalUsuarioId 
                };
                return res.status(201).json(novoSensor);
            } else {
                // Para o site, redirecione.
                return res.redirect('/sensores');
            }

        } catch (error) {
            console.error('Erro ao cadastrar sensor:', error);
            res.status(500).json({ error: 'Erro interno ao cadastrar sensor' });
        }
    }

    async listar(req, res) {
        try {
            if (!req.session?.usuario) {
                return res.status(401).json({ error: 'Não autorizado' });
            }
            const sensores = await sensorModel.listarPorUsuario(req.session.usuario.id);
            res.json(sensores);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar sensores' });
        }
    }
}

export default new SensorController();
