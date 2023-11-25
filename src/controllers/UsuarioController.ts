/*
   Controller de usuário, regras de negócio, consultas e registros no BD
*/

import { Request, Response } from 'express';
import { Usuario } from '../models/Usuarios';
import { UsuarioEquipamento } from '../models/UsuarioEquipamento';
import { gerarToken } from '../config/Passport';
import { validationResult, matchedData } from 'express-validator';
import { json } from 'sequelize';
import { JSON } from 'sequelize';

export const ping = (req: Request, res: Response) => {
    res.status(200);
    res.json({status: "ok", pong: true});
}

export const registrar = async (req: Request, res: Response) => {
    console.log(req.body);
    if(req.body.nome && req.body.email && req.body.senha ) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(406);
            res.json({status: "error", message: errors.mapped() });
            return;
        }
        
        
        let nome = req.body.nome;
        let email = req.body.email;
        let senha = req.body.senha;
        let flag_tipo_usuario = req.body.flag_tipo_usuario;
        console.log({ nome, email, senha, flag_tipo_usuario });

        let hasUser = await Usuario.findOne({where: { email }});
        if(!hasUser) {

            let newUser = await Usuario.create({ "nome": nome, "email": email, "senha": senha, "flag_tipo_usuario": flag_tipo_usuario });
            /* tratamento de erros com catch => posteriormente colocar em todos os awaits para tratar erros
                catch(function (err) {
                    console.log(err);
                });  
            */

            res.status(201);
            res.json({ status: "ok", message: `Usuário ${newUser.usuario_id} cadastrado.` });
            return;
        } else {
            res.status(406);
            res.json({ status: "error", message: 'E-mail já existe.' });
            return;
        }
    }
    res.status(406);
    res.json({ status: "error", message: 'E-mail e/ou senha não enviados.' });
}

export const login = async (req: Request, res: Response) => {
    console.log(req);

    if(req.body.email && req.body.senha) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(406);
            res.json({ status: "error", message: errors.mapped() });
            return;
        }

        let email: string = req.body.email;
        let senha: string = req.body.senha;

        let usuario = await Usuario.findOne({ 
            where: { email, senha }
        });

        if(usuario) {
            const token = gerarToken({ id: usuario.usuario_id });
            res.status(200);
            res.json({ status: "ok", usuario_id: usuario.usuario_id, nome: usuario.nome, flag_tipo_usuario: usuario.flag_tipo_usuario, token });
            return;
        }
    }
    res.status(406);
    res.json({ status: "error", message: "Usuário ou senha incorretos" });
}

export const listar = async (req: Request, res: Response) => {
    
    console.log("usuario logado", typeof(req.user));
    
    let usuarios = await Usuario.findAll();
    let list: string[] = [];

    for(let i in usuarios) {
        list.push( usuarios[i].email );
    }

    res.json({ list });
    return;
}


export const listarUsuariosEquips = async (req: Request, res: Response) => {
    let usuarios = await UsuarioEquipamento.findAll( {
        where: {
            equipamento_id: 1
          }
    });
    let list: string[] = [];

    for(let i in usuarios) {
        list.push( usuarios[i].player_id );
    }

    res.json({ list });
}