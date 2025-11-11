import express from 'express';
import { getAlertas } from './model/alertaModel.js';

const router = express.Router();

router.get('/', (req, res) => {
  getAlertas((err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar alertas' });
    res.json(results);
  });
});

export default router;
