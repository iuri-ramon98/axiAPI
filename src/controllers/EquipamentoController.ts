/*
   Controller de equipamento, regras de negócio, consultas e registros no BD
*/

import { Request, Response } from 'express';
import { Equipamento } from '../models/Equipamentos';
import { Usuario } from '../models/Usuarios';
import { validationResult, matchedData } from 'express-validator';


export const registrar = async (req: Request, res: Response) => {
    if (req.body.mac) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(406);
            res.json({ status: "error", message: errors.mapped() });
            return;
        }

        let usuarioLogado = await Usuario.findOne({ where: { "usuario_id": req.user } });
        console.log("usuario logado", usuarioLogado);
        if (usuarioLogado && (usuarioLogado.flag_tipo_usuario == 0)) {//usuario é um Admin
            let mac = req.body.mac;
            let num_compartimentos = req.body.num_compartimentos;

            let hasEquip = await Equipamento.findOne({ where: { mac } });
            if (!hasEquip) {

                let newEquip = await Equipamento.create({ "mac": mac, "num_compartimentos":num_compartimentos });
                /* tratamento de erros com catch => posteriormente colocar em todos os awaits para tratar erros
                    catch(function (err) {
                        console.log(err);
                    });  
                */

                res.status(201);
                res.json({ status: "ok", message: `Equipamento ${newEquip.equipamento_id} cadastrado.` });
                return;
            } else {
                res.status(406);
                res.json({ status: "error", message: 'MAC já cadastrado.' });
                return;
            }
        }else{
            res.status(401);
            res.json({ status: "error", message: 'Não autorizado para este tipo de usuário' });
            return;
        }
    }
    res.status(406);
    res.json({ status: "error", message: 'MAC não enviados.' });
}


export const encontrar = async (req: Request, res: Response) => {
    if (req.body.mac) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(406);
            res.json({ status: "error", message: errors.mapped() });
            return;
        }


        let mac = req.body.mac

        let equip = await Equipamento.findOne({ where: { mac } });
        if (equip) {
            res.status(201);
            res.json({ status: "ok", equipamento_id: `${equip.equipamento_id}` });
            return;
        } else {
            res.status(406);
            res.json({ status: "error", message: 'MAC não cadastrado.' });
            return;
        }
    }
    res.status(406);
    res.json({ status: "error", message: 'MAC não enviados.' });
}
