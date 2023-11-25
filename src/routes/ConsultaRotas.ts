import { Router } from 'express';
import { RotaPrivada } from '../config/Passport'
import ConsultaValidator from '../validators/ConsultasValidator'
import * as ConsultaController from '../controllers/ConsultaController';

const router = Router();

router.post('/consulta/registrar', RotaPrivada, ConsultaValidator.registrar, ConsultaController.registrar);
router.post('/consulta/listar', RotaPrivada, ConsultaController.listar);
router.put('/consulta/alterar', RotaPrivada, ConsultaValidator.alterar, ConsultaController.alterar);

export default router;