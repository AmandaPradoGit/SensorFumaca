import sensorModel from '../model/sensor.js';

class SensorController {
    async registerSensor(req, res) {
        try {
            const { chave_sensor, nome_local } = req.body;
            
            if (!chave_sensor || !nome_local) {
                return res.status(400).json({ error: 'Preencha todos os campos' });
            }

            if (!req.session || !req.session.usuario.id) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }
            const usuarioId = req.session.usuario.id;

            const sensorExistente = await sensorModel.buscarPorIdentificador(chave_sensor);
            if (sensorExistente) {
                return res.status(409).json({ error: 'Sensor já cadastrado' });
            }

            // Chamar o model para inserir o sensor
            const sensorId = await sensorModel.criar(chave_sensor, nome_local, usuarioId);
            
            res.redirect('/sensores');
        } catch (error) {
            console.error('Erro ao cadastrar sensor:', error);
            res.status(500).json({ error: 'Erro ao cadastrar sensor' });
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
