/*

    Rotas de usuário

*/

import { Router } from 'express';
import { RotaPrivada } from '../config/Passport'
import UsuarioValidator from '../validators/UsuarioValidator'
import * as UsuarioController from '../controllers/UsuarioController';

const router = Router();

router.post('/usuario/registrar', UsuarioValidator.registrar, UsuarioController.registrar);
router.post('/login', UsuarioValidator.login, UsuarioController.login);

router.get('/listar', RotaPrivada,  UsuarioController.listar);
router.get('/listar2',  UsuarioController.listarUsuariosEquips);

export default router;