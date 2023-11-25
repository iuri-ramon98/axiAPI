import { Router } from 'express';
import { RotaPrivada } from '../config/Passport'
import MedicamentoValidator from '../validators/MedicamentoValidator'
import * as MedicamentoController from '../controllers/MedicamentoController';

const router = Router();

router.post('/medicamento/registrar', RotaPrivada, MedicamentoValidator.registrar, MedicamentoController.registrar);
router.post('/medicamento/listar', RotaPrivada, MedicamentoController.listar);
router.put('/medicamento/alterar', RotaPrivada, MedicamentoValidator.registrar, MedicamentoController.alterar);
router.post('/registro-medicamento', MedicamentoController.registroMedicacao);
router.post('/listar-registros', RotaPrivada, MedicamentoController.listarRegistros);
router.post('/relatorio-registros', RotaPrivada, MedicamentoController.relatorioRegistros);

export default router;