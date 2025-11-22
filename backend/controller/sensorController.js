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
                  if (req.is('json')) {
                     return res.status(400).json({ 
                    error: 'Dados incompletos. É necessário ID do sensor, nome do local e ID do usuário.' 
                });
                }
                return res.redirect('/cadastrarSensores?erro=Preencha todos os campos');
            }

            const sensorExistente = await sensorModel.buscarPorIdentificador(finalSensorId);
            if (sensorExistente) {
                if (req.is('json')) {
                     return res.status(400).json({ 
                    error: 'Sensor com esse ID já cadastrado.' 
                });
                }
                return res.redirect('/cadastrarSensores?erro=Sensor com esse ID já cadastrado');
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
            if (req.is('json')) {
                     return res.status(400).json({ 
                    error: 'Erro ao cadastrar sensor.' 
                });
                }
                return res.redirect('/cadastrarSensores?err0r=Erro ao cadastrar sensor');
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
    async listarComAlertas(req, res) {
        try {
            const isApp = req.is('json');
            const usuarioId = isApp ? req.body?.idUsuario : req.session?.usuario?.id;

            if (!usuarioId) {
                return res.status(401).json({ error: 'Usuário não identificado' });
            }

            const sensoresComAlertas = await sensorModel.listarSensoresComAlertas(usuarioId);
            res.json(sensoresComAlertas);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar sensores com alertas' });
        }
    }
}

export default new SensorController();
