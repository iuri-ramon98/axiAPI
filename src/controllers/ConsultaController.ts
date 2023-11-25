/*
   Controller de fichas de saúde, regras de negócio, consultas e registros no BD
*/

import { Request, Response } from 'express';
import { Consulta } from '../models/Consultas';
import { validationResult, matchedData } from 'express-validator';
import { Equipamento } from '../models/Equipamentos';
import dotenv from 'dotenv';

dotenv.config();

export const registrar = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(406);
        res.json({ status: "error", message: errors.mapped() });
        return;
    }
    console.log(req.body);
    let hasEquip = await Equipamento.findOne({ where: { "equipamento_id": req.body.equipamento_id } })
    if (hasEquip) {
        let newConsulta = await Consulta.create(req.body);
        /* tratamento de erros com catch => posteriormente colocar em todos os awaits para tratar erros
            catch(function (err) {
                console.log(err);
            });  
        */
        res.status(201);
        res.json({ status: "ok", message: `Consulta ${newConsulta.consulta_id} cadastrada.` });
        return;
    } else {
        res.status(406);
        res.json({ status: "error", message: 'Equipamento inexistente.' });
        return;
    }
}

export const listar = async (req: Request, res: Response) => {

    if (req.body.equipamento_id && (req.body.flag_situacao >= 0) && (req.body.flag_situacao <= 3)) {
        console.log(req.body);
        let hasEquip = await Equipamento.findOne({ where: { "equipamento_id": req.body.equipamento_id } })
        if (hasEquip) {

            let consultas;
            if (req.body.flag_situacao == 3) {
                consultas = await Consulta.findAll({ where: { "equipamento_id": req.body.equipamento_id } });
            } else {
                consultas = await Consulta.findAll({ where: { "equipamento_id": req.body.equipamento_id, "flag_situacao": req.body.flag_situacao } });
            }
            if (consultas) {
                res.status(201);
                res.json({ status: "ok", message: consultas });
                return;
            } else {
                res.status(406);
                res.json({ status: "error", message: 'Equipamento não possui consulta cadastrada' });
                return;
            }
        } else {
            res.status(406);
            res.json({ status: "error", message: 'Equipamento inexistente.' });
            return;
        }
    } else {
        res.status(406);
        res.json({ status: "error", message: 'Equipamento não informado.' });
        return;
    }
}


export const alterar = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(406);
        res.json({ status: "error", message: errors.mapped() });
        return;
    }
    console.log(req.body);
    let hasConsulta = await Consulta.findOne({ where: { "consulta_id": req.body.consulta_id } })
    if (hasConsulta) {
        let consulta = await Consulta.update(req.body, { where: { "consulta_id": req.body.consulta_id } });
        /* tratamento de erros com catch => posteriormente colocar em todos os awaits para tratar erros
            catch(function (err) {
                console.log(err);
            });  
        */
        res.status(201);
        res.json({ status: "ok", message: `Atualização bem sucedida, ${consulta} registros alterados` });
        return;
    } else {
        res.status(406);
        res.json({ status: "error", message: 'Equipamento inexistente.' });
        return;
    }
}


