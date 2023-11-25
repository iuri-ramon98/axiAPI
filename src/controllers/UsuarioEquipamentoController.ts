/*
   Controller de user_equip, regras de negócio, consultas e registros no BD
    responsavel pela transação de notificação
*/

import { Request, Response } from 'express';
import { UsuarioEquipamento } from '../models/UsuarioEquipamento';
import { validationResult, matchedData } from 'express-validator';
import { Usuario } from '../models/Usuarios';
import { QueryTypes } from 'sequelize';
import dotenv from 'dotenv';
import { Queda } from '../models/Quedas';
import { Equipamento } from '../models/Equipamentos';
import pdf from 'html-pdf';
import { FichaSaude } from '../models/FichaSaude';

dotenv.config();


export const vincular = async (req: Request, res: Response) => {

    if (req.body.usuario_id && req.body.equipamento_id && req.body.player_id) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(406);
            res.json({ status: "error", message: errors.mapped() });
            return;
        }

        let usuario_id = req.body.usuario_id;
        let equipamento_id = req.body.equipamento_id;
        let player_id = req.body.player_id;
        let flag_equipamento_ativo = req.body.flag_equipamento_ativo;
        console.log({ usuario_id, equipamento_id, player_id, flag_equipamento_ativo });

        let hasCad = await UsuarioEquipamento.findOne({ where: { usuario_id, equipamento_id } });
        if (!hasCad) { // nao tem cadastro 

            let usuarioLogado = await Usuario.findOne({ where: { "usuario_id": req.user } });
            console.log("usuario logado", usuarioLogado);
            if (usuarioLogado && (usuarioLogado.flag_tipo_usuario == 1)) { //usuario é idoso
                //console.log("usuario logado", usuarioLogado);
                let hasIdoso = await UsuarioEquipamento.sequelize?.query(
                    `select ue.user_equip_id, u.usuario_id from usuarios_equipamentos ue inner join usuarios u on ue.usuario_id = u.usuario_id where (ue.equipamento_id = ${equipamento_id} and u.flag_tipo_usuario = 1)`,
                    { type: QueryTypes.SELECT }
                );

                let resultSting: string = JSON.stringify(hasIdoso);
                let resultJson: object = JSON.parse(resultSting);
                console.log(!Object.values(resultJson).length);
                console.log(hasIdoso);
                if (!Object.values(resultJson).length) { //ja tem um idoso cadastrado ao dispositivo
                    let newCad = await UsuarioEquipamento.create({ "usuario_id": usuario_id, "equipamento_id": equipamento_id, "player_id": player_id, "flag_equipamento_ativo": flag_equipamento_ativo });
                    /* tratamento de erros com catch => posteriormente colocar em todos os awaits para tratar erros
                        catch(function (err) {
                            console.log(err);
                        });  
                    */
                    res.status(201);
                    res.json({ status: "ok", message: `Dispositivo vinculado à sua conta.`, id: newCad.user_equip_id });
                    return;
                } else {
                    res.status(406);
                    res.json({ status: "error", message: 'Só é possível cadastrar um idoso por dispositivo.' });
                    return;
                }
            } else if (usuarioLogado && (usuarioLogado.flag_tipo_usuario == 2)) {
                let newCad = await UsuarioEquipamento.create({ "usuario_id": usuario_id, "equipamento_id": equipamento_id, "player_id": player_id, "flag_equipamento_ativo": flag_equipamento_ativo });
                /* tratamento de erros com catch => posteriormente colocar em todos os awaits para tratar erros
                    catch(function (err) {
                        console.log(err);
                    });  
                */
                res.status(201);
                res.json({ status: "ok", message: `Dispositivo vinculado à sua conta.`, id: newCad.user_equip_id });
                return;
            }

        } else {
            res.status(406);
            res.json({ status: "error", message: 'Dispositivo já vinculado.' });
            return;
        }
    }
    res.status(406);
    res.json({ status: "error", message: 'Dados não enviados.' });
}



//recebe um player id e um usuario id, atualiza o player para todos os usuarios
export const atualizarPlayer = async (req: Request, res: Response) => {
    if (req.body.usuario_id && req.body.player_id) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(406);
            res.json({ status: "error", message: errors.mapped() });
            return;
        }

        let usuario_id = req.body.usuario_id;
        let player_id = req.body.player_id;

        let usuarioLogado = await UsuarioEquipamento.findOne({ where: { "usuario_id": req.user } });
        if (usuarioLogado) {
            let Atualizar = await UsuarioEquipamento.update({ "player_id": player_id }, { where: { "usuario_id": usuario_id } });
            console.log(Atualizar);
            res.status(201);
            res.json({ status: "ok", message: `Atualização bem sucedida` });
            //return;
        } else {
            res.status(406);
            res.json({ status: "error", message: 'Usuário não cadastrado.' });
            return;
        }
    }

}

export const notificarQueda = async (req: Request, res: Response) => {

    if (req.body.mac && req.body.data_queda && req.body.hora_queda) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(406);
            res.json({ status: "error", message: errors.mapped() });
            return;
        }

        let players: any = await UsuarioEquipamento.sequelize?.query(
            `select ue.player_id from usuarios_equipamentos ue INNER JOIN usuarios u ON u.usuario_id = ue.usuario_id INNER JOIN equipamentos e ON e.equipamento_id = ue.equipamento_id where ((e.mac = '${req.body.mac}') and (u.flag_tipo_usuario = 2))`
        );
        console.log(players);
        let include_player_ids: string[] = [];

        //let playerString: string = JSON.stringify(players);
        //let playerJson: object = JSON.parse(playerString);
        console.log(players[0]);
        console.log(Object.values(players[0]).length);
        if (Object.values(players[0]).length > 1) { //possui mais de um familiar ativo
            for (let i in players) {
                console.log(players[0][i].player_id);
                console.log(i);
                include_player_ids.push(players[0][i].player_id);
            }
        } else if (Object.values(players[0]).length == 1) {
            include_player_ids = [players[0][0].player_id]
        } else {
            res.status(406);
            res.json({ status: "error", message: "Nenhum familiar ativo para este disposito, cadastre." });
            return;
        }

        console.log("teste", include_player_ids);

        //testar se eh possivel a inserção da queda

        let equipamento = await Equipamento.findOne({where: { "mac": req.body.mac }})

        if (equipamento) {
            let newQueda = await Queda.create({ "equipamento_id": equipamento.equipamento_id, "data_queda": req.body.data_queda, "hora_queda": req.body.hora_queda });
        }

        //fim do codigo

        let data = {
            app_id: process.env.APP_ID,
            contents: { "en": "Alerta de queda!!! Entre em contado com o idoso imediatamente" },
            include_player_ids: include_player_ids
        }

        console.log("data", JSON.stringify(data.include_player_ids));

        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic YzRmOWU2MzgtZTE4Ni00YzI2LTg3YmYtOWM4MjU2YzQ3NDM5"
        };

        var options = {
            host: "onesignal.com",
            port: 443,
            path: "/api/v1/notifications",
            method: "POST",
            headers: headers
        };

        var https = require('https');
        var requisicao = https.request(options, function (resposta: any) {
            resposta.on('data', function (data: any) {
                console.log("Response:");
                console.log(JSON.parse(data));
            });
        });

        requisicao.on('error', function (e: any) {
            console.log("ERROR:");
            console.log(e);
            res.status(406);
            res.json({ status: "error", message: e });
            return;
        });

        requisicao.write(JSON.stringify(data));
        requisicao.end();
        res.status(201);
        res.json({ status: "ok", message: `Notificação entregue` });
        return;
    }
}

export const notificarConsulta = async (req: Request, res: Response) => {

    if (req.body.mac && req.body.data_consulta && req.body.hora_consulta) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(406);
            res.json({ status: "error", message: errors.mapped() });
            return;
        }

        let players: any = await UsuarioEquipamento.sequelize?.query(
            `select ue.player_id from usuarios_equipamentos ue INNER JOIN usuarios u ON u.usuario_id = ue.usuario_id INNER JOIN equipamentos e ON e.equipamento_id = ue.equipamento_id where ((e.mac = '${req.body.mac}') and (ue.flag_equipamento_ativo = true))`
        );
        let include_player_ids: string[] = [];

        //let playerString: string = JSON.stringify(players);
        //let playerJson: object = JSON.parse(playerString);
        console.log(players[0]);
        console.log(Object.values(players[0]).length);
        if (Object.values(players[0]).length > 1) { //possui mais de um familiar ativo
            for (let i in players) {
                console.log(players[0][i].player_id);
                console.log(i);
                include_player_ids.push(players[0][i].player_id);
            }
        } else if (Object.values(players[0]).length == 1) {
            include_player_ids = [players[0][0].player_id]
        } else {
            res.status(406);
            res.json({ status: "error", message: "Nenhum usuário ativo para este disposito, cadastre." });
            return;
        }

        console.log("teste", include_player_ids);

        /*testar se eh possivel a inserção da queda

        let equipamento = await Equipamento.findOne({})

        if(equipamento){
            let newQueda = await Queda.create({ "equipamento_id": equipamento.equipamento_id, "data_queda": req.body.data_queda, "hora_queda": req.body.hora_queda });
        }
        
        /fim do codigo*/

        let data = {
            app_id: process.env.APP_ID,
            contents: { "en": `Consulta próxima às ${req.body.hora_consulta}` },
            include_player_ids: include_player_ids
        }

        console.log("data", JSON.stringify(data.include_player_ids));

        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic YzRmOWU2MzgtZTE4Ni00YzI2LTg3YmYtOWM4MjU2YzQ3NDM5"
        };

        var options = {
            host: "onesignal.com",
            port: 443,
            path: "/api/v1/notifications",
            method: "POST",
            headers: headers
        };

        var https = require('https');
        var requisicao = https.request(options, function (resposta: any) {
            resposta.on('data', function (data: any) {
                console.log("Response:");
                console.log(JSON.parse(data));
            });
        });

        requisicao.on('error', function (e: any) {
            console.log("ERROR:");
            console.log(e);
            res.status(406);
            res.json({ status: "error", message: e });
            return;
        });

        requisicao.write(JSON.stringify(data));
        requisicao.end();
        res.status(201);
        res.json({ status: "ok", message: `Notificação entregue` });
        return;
    }
}

export const notificarMedicamento = async (req: Request, res: Response) => {

    if (req.body.mac && req.body.data_registro && req.body.hora_registro && req.body.nome_medicamento && req.body.num_compartimento && req.body.dose) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(406);
            res.json({ status: "error", message: errors.mapped() });
            return;
        }

        let players: any = await UsuarioEquipamento.sequelize?.query(
            `select ue.player_id from usuarios_equipamentos ue INNER JOIN usuarios u ON u.usuario_id = ue.usuario_id INNER JOIN equipamentos e ON e.equipamento_id = ue.equipamento_id where ((e.mac = '${req.body.mac}') and (ue.flag_equipamento_ativo = true))`
        );
        let include_player_ids: string[] = [];

        //let playerString: string = JSON.stringify(players);
        //let playerJson: object = JSON.parse(playerString);
        console.log(players[0]);
        console.log(Object.values(players[0]).length);
        if (Object.values(players[0]).length > 1) { //possui mais de um familiar ativo
            for (let i in players) {
                console.log(players[0][i].player_id);
                console.log(i);
                include_player_ids.push(players[0][i].player_id);
            }
        } else if (Object.values(players[0]).length == 1) {
            include_player_ids = [players[0][0].player_id]
        } else {
            res.status(406);
            res.json({ status: "error", message: "Nenhum usuário ativo para este disposito, cadastre." });
            return;
        }

        console.log("teste", include_player_ids);

        /*testar se eh possivel a inserção da queda

        let equipamento = await Equipamento.findOne({})

        if(equipamento){
            let newQueda = await Queda.create({ "equipamento_id": equipamento.equipamento_id, "data_queda": req.body.data_queda, "hora_queda": req.body.hora_queda });
        }
        
        /fim do codigo*/

        let data = {
            app_id: process.env.APP_ID,
            contents: { "en": `Tome ${req.body.dose} doses de ${req.body.nome_medicamento}, do compartimento ${req.body.num_compartimento}.` },
            include_player_ids: include_player_ids
        }

        console.log("data", JSON.stringify(data.include_player_ids));

        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic YzRmOWU2MzgtZTE4Ni00YzI2LTg3YmYtOWM4MjU2YzQ3NDM5"
        };

        var options = {
            host: "onesignal.com",
            port: 443,
            path: "/api/v1/notifications",
            method: "POST",
            headers: headers
        };

        var https = require('https');
        var requisicao = https.request(options, function (resposta: any) {
            resposta.on('data', function (data: any) {
                console.log("Response:");
                console.log(JSON.parse(data));
            });
        });

        requisicao.on('error', function (e: any) {
            console.log("ERROR:");
            console.log(e);
            res.status(406);
            res.json({ status: "error", message: e });
            return;
        });

        requisicao.write(JSON.stringify(data));
        requisicao.end();
        res.status(201);
        res.json({ status: "ok", message: `Notificação entregue` });
        return;
    }
}

export const ativarEquipamento = async (req: Request, res: Response) => {
    //receber um id de vinculo
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(406);
        res.json({ status: "error", message: errors.mapped() });
        return;
    }
    let user_equip_id = req.body.user_equip_id;
    //verificar o usuario logado
    let usuarioLogado = await Usuario.findOne({ where: { "usuario_id": req.user } });
    console.log("usuarioLogado:", usuarioLogado?.usuario_id);
    //se idoso -> update todos o flag_ativo vinculos daquele usuario para falso -> update naquele vinculo para verdadeiro
    if (usuarioLogado && (usuarioLogado.flag_tipo_usuario == 1)) {
        let mudarParaFalso = await UsuarioEquipamento.update({ "flag_equipamento_ativo": false }, { where: { "usuario_id": usuarioLogado.usuario_id } });
        console.log(mudarParaFalso);
        let ativar = await UsuarioEquipamento.update({ "flag_equipamento_ativo": true }, { where: { "user_equip_id": user_equip_id, "usuario_id": usuarioLogado.usuario_id } });
        console.log(ativar);
        res.status(201);
        res.json({ status: "ok", message: `Atualização bem sucedida, ${ativar} registros alterados` });
        return;
    } else if (usuarioLogado && (usuarioLogado.flag_tipo_usuario == 2)) { //se familiar -> update naquele vinculo para verdadeiro
        let mudarParaFalso = await UsuarioEquipamento.update({ "flag_equipamento_ativo": false }, { where: { "usuario_id": usuarioLogado.usuario_id } });
        console.log(mudarParaFalso);
        let ativar = await UsuarioEquipamento.update({ "flag_equipamento_ativo": true }, { where: { "user_equip_id": user_equip_id, "usuario_id": usuarioLogado.usuario_id } });
        console.log(ativar);
        res.status(201);
        res.json({ status: "ok", message: `Atualização bem sucedida, ${ativar} registros alterados` });
        return;
    } else {
        res.status(406);
        res.json({ status: "error", message: `Não atualizado.` });
    }


}

export const inativarEquipamento = async (req: Request, res: Response) => {
    //receber um id de vinculo
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(406);
        res.json({ status: "error", message: errors.mapped() });
        return;
    }
    let user_equip_id = req.body.user_equip_id;
    //verificar o usuario logado
    let usuarioLogado = await Usuario.findOne({ where: { "usuario_id": req.user } });
    console.log("usuarioLogado:", usuarioLogado?.usuario_id);
    if (usuarioLogado && (usuarioLogado.flag_tipo_usuario == 2)) { //se familiar -> update naquele vinculo para verdadeiro
        let ativar = await UsuarioEquipamento.update({ "flag_equipamento_ativo": false }, { where: { "user_equip_id": user_equip_id, "usuario_id": usuarioLogado.usuario_id } });
        console.log(ativar);
        res.status(201);
        res.json({ status: "ok", message: `Atualização bem sucedida, ${ativar} registros alterados` });
        return;
    } else {
        res.status(406);
        res.json({ status: "error", message: `Usuário tipo Idoso ou não informado.` });
    }

}

export const listarEquipamentosVinculados = async (req: Request, res: Response) => {
    //receber um id de usuario logado
    //listar todos os equipamentos vinculados a ele
    let equipamentos: any = await UsuarioEquipamento.sequelize?.query(
        `select ue.user_equip_id, ue.flag_equipamento_ativo, e.num_compartimentos, e.mac, e.equipamento_id from usuarios_equipamentos ue INNER JOIN usuarios u ON u.usuario_id = ue.usuario_id INNER JOIN equipamentos e ON e.equipamento_id = ue.equipamento_id where (u.usuario_id = '${req.user}')`
    );
    let lista: string[] = [];
    console.log("eqips", equipamentos);

    lista.push(equipamentos[0]);

    console.log(lista);

    res.json({ status: "ok", equipamentos: lista });
    return;

}

export const listarPessoasVinculadas = async (req: Request, res: Response) => {
    //receber um id de equipamento
    //listar todos os pessoas vinculadas a ele
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(406);
        res.json({ status: "error", message: errors.mapped() });
        return;
    }

    let usuarios: any = await UsuarioEquipamento.sequelize?.query(
        `select ue.user_equip_id, ue.flag_equipamento_ativo, ue.player_id, u.usuario_id , u.nome, u.email , u.flag_tipo_usuario from usuarios_equipamentos ue INNER JOIN usuarios u ON u.usuario_id = ue.usuario_id INNER JOIN equipamentos e ON e.equipamento_id = ue.equipamento_id where (e.equipamento_id = '${req.body.equipamento_id}')`
    );
    let lista: string[] = [];
    console.log("eqips", usuarios);
    lista.push(usuarios[0]);

    console.log(lista);

    res.json({ status: "ok", usuarios: lista });
    return;
}

export const listarQuedas = async (req: Request, res: Response) => {
    if (req.body.equipamento_id) {
        console.log(req.body);
        let hasEquip = await Equipamento.findOne({ where: { "equipamento_id": req.body.equipamento_id } })
        if (hasEquip) {
            let registros = await Queda.findAll({ where: { "equipamento_id": req.body.equipamento_id } })
            if (registros) {
                res.status(201);
                res.json({ status: "ok", registros: registros });
                return;
            } else {
                res.status(406);
                res.json({ status: "error", message: 'Equipamento não registrou nenhuma queda.' });
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


export const relatorioQuedas = async (req: Request, res: Response) => {
    if (req.body.equipamento_id) {
        console.log(req.body);
        let hasEquip = await Equipamento.findOne({ where: { "equipamento_id": req.body.equipamento_id } })
        if (hasEquip) {
            let usuario_id: any = await UsuarioEquipamento.sequelize?.query(
                `select ue.usuario_id from usuarios_equipamentos ue inner join usuarios u on ue.usuario_id = u.usuario_id where (ue.equipamento_id = ${req.body.equipamento_id} and u.flag_tipo_usuario = 1)`,
                { type: QueryTypes.SELECT }
            );
            console.log(usuario_id[0]);
            if (usuario_id) {
                let nome_usuario = await FichaSaude.findOne({ where: {"usuario_id": usuario_id[0].usuario_id}});


                let registros = await Queda.findAll({ where: { "equipamento_id": req.body.equipamento_id } })
                if (registros && nome_usuario) {

                    const html = `<html>
                <head>
                    <title>Relatório</title>
                    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
                    <style type="text/css">
                        @page{
                            margin-top: 3cm;
                            margin-left: 3cm;
                            margin-bottom: 2cm;
                            margin-left: 2cm;
                        }
                        #titulo{
                            font-size: 14px;
                            text-align: center;
                        }
                        #tabela{
                            width: 90%;
                            font-size: 12px;
                            margin: 0 auto;
                            text-align: justify;
                            border: 1px solid black;
                            border-collapse: collapse;
                            white-space: pre-line;
                            table-layout: auto;
                            width: content-box;
                            height: content-box;
                        }
                        .celula{
                            border: 1px solid black;
                            text-align: justify;
                            font-size: 12px;
                        }
                        .celula_center{
                            border: 1px solid black;
                            text-align: center;
                            font-size: 12px;
                        }
                        .celula_head{
                            border: 2px solid black;
                            background-color: #D3D3D3;
                            text-align: center;
                            font-size: 12px;
                        }
                        #rodape-final{
                            width: 100%;
                            position: absolute;
                            top: 22cm;
                            left: 0cm;
                            bottom: 3cm;
                            right: 2cm;
                            font-size: 12px;
                        }
                        #align-right{
                            text-align: right;
                        }
                    </style>
                </head>
                <body>
                    <div>
                        <p id="titulo"><b>RELATÓRIO DE QUEDAS</b></p>
                        <p><b>Paciente: </b>${nome_usuario.cb_nome_completo}</p>
                    </div>
                    <table id="tabela">
                        <thead>
                            <tr>
                                <th class="celula_head">Data da queda</th>
                                <th class="celula_head">Hora da queda</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${registros.map((item) => (
                        `<tr>
                                <td class="celula_center">${item.data_queda}</td>
                                <td class="celula_center">${item.hora_queda}</td>
                            </tr>`

                    ))}
                            
                        </tbody>
                    </table>
                    <div id="rodape-final">
                        <hr size="1" color=black>
                    </div>
                </body>
            </html>`;

                    /*const options = {
                        type: "pdf",
                        format: "A4",
                        orientation: "portrait"
                    }*/

                    /*pdf.create(html).toStream(function(err, stream) {
                        if (err) return res.end(err.stack)
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
                        // res.contentType("application/pdf");
                        //res.attachment('pdfname.pdf');
                        stream.pipe(res);
                    });*/

                    pdf.create(html).toBuffer((err, buffer) => {
                        if (err) {
                            return res.end(err.stack);
                        } else {
                            res.statusCode = 200;
                            res.json({ buffer });
                        }
                    });


                    /*pdf.create(html).toFile("../../relatorios/registros.pdf", (err, resposta) => {
                        if (err) {
                            res.status(406);
                            res.json({ status: "error", message: err });
                            return;
                        }else{
                            res.status(201);
                            res.json({ status: "ok", registros: resposta });
                            return;
                        }
                    })*/

                } else {
                    res.status(406);
                    res.json({ status: "error", message: 'Equipamento não registrou nenhuma queda.' });
                    return;
                }
            } else {
                res.status(406);
                res.json({ status: "error", message: 'Equipamento não possui idoso vinculado' });
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