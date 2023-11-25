import { Router } from 'express';
import { RotaPrivada } from '../config/Passport'
import EquipamentoValidator from '../validators/EquipamentoValidator'
import * as EquipamentoController from '../controllers/EquipamentoController';

const router = Router();

router.post('/equipamento/registrar', RotaPrivada, EquipamentoValidator.registrar, EquipamentoController.registrar);
router.post('/equipamento/encontrar', RotaPrivada, EquipamentoValidator.encontrar, EquipamentoController.encontrar);

export default router;