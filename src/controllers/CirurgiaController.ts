/*
   Controller de fichas de saúde, regras de negócio, consultas e registros no BD
*/

import { Request, Response } from 'express';
import { Cirurgia } from '../models/Cirurgias';
import { validationResult, matchedData } from 'express-validator';
import { Usuario } from '../models/Usuarios';
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
    let hasUser = await Usuario.findOne({ where: { "usuario_id": req.body.usuario_id } })
    if (hasUser) {
        let newCirurgia = await Cirurgia.create(req.body);
        /* tratamento de erros com catch => posteriormente colocar em todos os awaits para tratar erros
            catch(function (err) {
                console.log(err);
            });  
        */
        res.status(201);
        res.json({ status: "ok", message: `Cirurgia ${newCirurgia.cirurgia_id} cadastrada.` });
        return;
    } else {
        res.status(406);
        res.json({ status: "error", message: 'Usuário inexistente.' });
        return;
    }
}

export const listar = async (req: Request, res: Response) => {

    if (req.body.usuario_id) {
        console.log(req.body);
        let hasUser = await Usuario.findOne({ where: { "usuario_id": req.body.usuario_id } })
        if (hasUser) {
            let cirurgias = await Cirurgia.findAll({ where: { "usuario_id": req.body.usuario_id } });
            if (cirurgias) {
                res.status(201);
                res.json({ status: "ok", message: cirurgias });
                return;
            } else {
                res.status(406);
                res.json({ status: "error", message: 'Usuário não possui cirurgia cadastrada' });
                return;
            }
        } else {
            res.status(406);
            res.json({ status: "error", message: 'Usuário inexistente.' });
            return;
        }
    } else {
        res.status(406);
            res.json({ status: "error", message: 'Usuário não informado.' });
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
    let hasCirurgia = await Cirurgia.findOne({ where: { "cirurgia_id": req.body.cirurgia_id } })
    if (hasCirurgia) {
        let cirurgia = await Cirurgia.update(req.body, { where: { "cirurgia_id": req.body.cirurgia_id } });
        /* tratamento de erros com catch => posteriormente colocar em todos os awaits para tratar erros
            catch(function (err) {
                console.log(err);
            });  
        */
        res.status(201);
        res.json({ status: "ok", message: `Atualização bem sucedida, ${cirurgia} registros alterados` });
        return;
    } else {
        res.status(406);
        res.json({ status: "error", message: 'Usuário inexistente.' });
        return;
    }
}


