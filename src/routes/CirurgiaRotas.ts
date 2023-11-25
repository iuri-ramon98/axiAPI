import { Router } from 'express';
import { RotaPrivada } from '../config/Passport'
import CirurgiaValidator from '../validators/CirurgiasValidator'
import * as CirurgiaController from '../controllers/CirurgiaController';

const router = Router();

router.post('/cirurgia/registrar', RotaPrivada, CirurgiaValidator.registrar, CirurgiaController.registrar);
router.post('/cirurgia/listar', RotaPrivada, CirurgiaController.listar);
router.put('/cirurgia/alterar', RotaPrivada, CirurgiaValidator.alterar, CirurgiaController.alterar);

export default router;