import sensorModel from '../model/sensor.js';

class SensorController {
  async registerSensor(req, res) {
    try {
      const { chave_sensor, nome_local } = req.body;
      if (!chave_sensor || !nome_local) {
        return res.status(400).json({ error: 'Preencha todos os campos' });
      }
      if (!req.session || !req.session.usuario?.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }
      const usuarioId = req.session.usuario.id;
      const existe = await sensorModel.buscarPorIdentificador(chave_sensor);
      if (existe) return res.status(409).json({ error: 'Sensor já cadastrado' });
      await sensorModel.criar(chave_sensor, nome_local, usuarioId);
      return res.redirect('/sensores');
    } catch (err) {
      console.error('Erro ao cadastrar sensor:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar sensor' });
    }
  }

  // GET /sensores  -> lista por usuário
  async listar(req, res) {
    try {
      if (!req.session?.usuario) return res.status(401).json({ error: 'Não autorizado' });
      const sensores = await sensorModel.listarPorUsuario(req.session.usuario.id);
      return res.json(sensores);
    } catch (err) {
      console.error('Erro ao listar sensores:', err);
      return res.status(500).json({ error: 'Erro ao listar sensores' });
    }
  }

  // GET /sensores/:identificador  -> buscar um sensor (handler express)
  async buscarPorIdentificador(req, res) {
    try {
      const identificador = req.params.identificador;
      if (!identificador) return res.status(400).json({ error: 'Identificador ausente' });
      const sensor = await sensorModel.buscarPorIdentificador(identificador);
      if (!sensor) return res.status(404).json({ error: 'Sensor não encontrado' });
      return res.json(sensor);
    } catch (err) {
      console.error('Erro ao buscar sensor:', err);
      return res.status(500).json({ error: 'Erro ao buscar sensor' });
    }
  }
}

export default new SensorController();
