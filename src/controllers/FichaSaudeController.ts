//registrar 
//alterar
//listar
/*
   Controller de fichas de saúde, regras de negócio, consultas e registros no BD
*/

import { Request, Response } from 'express';
import { FichaSaude } from '../models/FichaSaude';
import { validationResult, matchedData } from 'express-validator';
import { Usuario } from '../models/Usuarios';
import { QueryTypes } from 'sequelize';
import dotenv from 'dotenv';
import { where } from 'sequelize';

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
        let hasFicha = await FichaSaude.findOne({ where: { "usuario_id": req.body.usuario_id } });
        if (!hasFicha) {

            let newFicha = await FichaSaude.create(req.body);
            /* tratamento de erros com catch => posteriormente colocar em todos os awaits para tratar erros
                catch(function (err) {
                    console.log(err);
                });  
            */

            res.status(201);
            res.json({ status: "ok", message: `Ficha ${newFicha.ficha_saude_id} cadastrada.` });
            return;
        } else {
            res.status(406);
            res.json({ status: "error", message: 'Usuário já possui uma ficha cadastrada.' });
            return;
        }
    } else {
        res.status(406);
        res.json({ status: "error", message: 'Usuário inexistente.' });
        return;
    }
}


export const exibir = async (req: Request, res: Response) => {
    
    console.log(req.body);
    let hasUser = await Usuario.findOne({ where: { "usuario_id": req.body.usuario_id } })
    if (hasUser) {
        let Ficha = await FichaSaude.findOne({ where: { "usuario_id": req.body.usuario_id } });
        if (Ficha) {
            res.status(201);
            res.json({ status: "ok", message: Ficha });
            return;
        } else {
            res.status(400);
            res.json({ status: "error", tipo_erro: 0, message: 'Usuário não possui ficha cadastrada' });
            return;
        }
    } else {
        res.status(400);
        res.json({ status: "error", tipo_erro: 1, message: 'Usuário inexistente.' });
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
    let hasUser = await Usuario.findOne({ where: { "usuario_id": req.body.usuario_id } })
    if (hasUser) {
        let hasFicha = await FichaSaude.findOne({ where: { "usuario_id": req.body.usuario_id } });
        if (hasFicha) {

            let Ficha = await FichaSaude.update(req.body, { where: { "usuario_id": req.body.usuario_id } });
            /* tratamento de erros com catch => posteriormente colocar em todos os awaits para tratar erros
                catch(function (err) {
                    console.log(err);
                });  
            */

                res.status(201);
                res.json({ status: "ok", message: `Atualização bem sucedida, ${Ficha} registros alterados` });
                return;
        } else {
            res.status(406);
            res.json({ status: "error", message: 'Usuário não possui uma ficha cadastrada.' });
            return;
        }
    } else {
        res.status(406);
        res.json({ status: "error", message: 'Usuário inexistente.' });
        return;
    }
}