/*

    Rotas de usuário

*/

import { Router } from 'express';
import { RotaPrivada } from '../config/Passport'
import UsuarioEquipamentoValidator from '../validators/UsuarioEquipamentoValidator'
import * as UsuarioEquipamentoController from '../controllers/UsuarioEquipamentoController';

const router = Router();

router.post('/vincular', RotaPrivada, UsuarioEquipamentoValidator.vincular,   UsuarioEquipamentoController.vincular);
router.put('/atualizar-player', RotaPrivada, UsuarioEquipamentoValidator.atualizarPlayer, UsuarioEquipamentoController.atualizarPlayer);
router.post('/notificar-queda', UsuarioEquipamentoValidator.notificaQueda, UsuarioEquipamentoController.notificarQueda);
router.post('/notificar-consulta', UsuarioEquipamentoValidator.notificaQueda, UsuarioEquipamentoController.notificarConsulta);
router.post('/notificar-medicamento', UsuarioEquipamentoValidator.notificaQueda, UsuarioEquipamentoController.notificarMedicamento);
router.put('/equipamento/ativar', RotaPrivada, UsuarioEquipamentoValidator.ativarEquipamento, UsuarioEquipamentoController.ativarEquipamento);
router.put('/equipamento/inativar', RotaPrivada, UsuarioEquipamentoValidator.ativarEquipamento, UsuarioEquipamentoController.inativarEquipamento);
router.get('/equipamento/listar-vinculados', RotaPrivada, UsuarioEquipamentoController.listarEquipamentosVinculados);
router.post('/usuario/listar-vinculados', RotaPrivada, UsuarioEquipamentoValidator.listarPessoasVinculadas, UsuarioEquipamentoController.listarPessoasVinculadas);
router.post('/listar-quedas', RotaPrivada, UsuarioEquipamentoController.listarQuedas);
router.post('/relatorio-quedas', RotaPrivada, UsuarioEquipamentoController.relatorioQuedas);

export default router;