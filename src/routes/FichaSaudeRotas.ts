import { Router } from 'express';
import { RotaPrivada } from '../config/Passport'
import FichaSaudeValidator from '../validators/FichaSaudeValidator'
import * as FichaSaudeController from '../controllers/FichaSaudeController';

const router = Router();

router.post('/ficha/registrar', RotaPrivada, FichaSaudeValidator.registrar, FichaSaudeController.registrar);
router.post('/ficha/exibir', RotaPrivada, FichaSaudeController.exibir);
router.put('/ficha/alterar', RotaPrivada, FichaSaudeValidator.registrar, FichaSaudeController.alterar);

export default router;