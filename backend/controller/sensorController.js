import sensorModel from '../model/sensor.js';

class SensorController {
    async registerSensor(req, res) {
        try {
            const { chave_sensor, nome_sensor } = req.body;
            
            if (!chave_sensor || !nome_sensor) {
                return res.status(400).json({ error: 'Preencha todos os campos' });
            }

            // Verificar se o sensor já existe
            const sensorExistente = await sensorModel.buscarPorIdentificador(chave_sensor);
            if (sensorExistente) {
                return res.status(409).json({ error: 'Sensor já cadastrado' });
            }

            // Chamar o model para inserir o sensor
            const sensorId = await sensorModel.criar(email, senha);
            
            res.redirect('/sensores');
        } catch (error) {
            console.error('Erro ao cadastrar sensor:', error);
            res.status(500).json({ error: 'Erro ao cadastrar sensor' });
        }
    }
}
export default new SensorController();
