/*
   Controller de fichas de saúde, regras de negócio, consultas e registros no BD
*/

import { Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';
import { Equipamento } from '../models/Equipamentos';
import { FichaSaude } from '../models/FichaSaude';
import { UsuarioEquipamento } from '../models/UsuarioEquipamento';
import { Medicamento } from '../models/Medicamentos';
import dotenv from 'dotenv';
import { RegistroMedicacao } from '../models/RegistroMedicacoes';
import { QueryTypes } from 'sequelize';
import pdf from 'html-pdf';



dotenv.config();

export const registrar = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(406);
        res.json({ status: "error", message: errors.mapped() });
        return;
    }
    //verificação se o compartimento existe no equipamento 
    let equipamento = await Equipamento.findOne({ where: { "equipamento_id": req.body.equipamento_id } });
    console.log("numCompartimentos: ", equipamento?.num_compartimentos);
    console.log("numCompartimento: ", req.body.num_compartimento);
    if (equipamento && (equipamento.num_compartimentos >= req.body.num_compartimento)) {
        //verificação se o compatimento já está ocupado
        let compartimento_ocupado = await Medicamento.findOne({ where: { "equipamento_id": req.body.equipamento_id, "num_compartimento": req.body.num_compartimento, "flag_medicamento_ativo": true } });
        if (!compartimento_ocupado) {
            let newMedicamento = await Medicamento.create(req.body)
            res.status(201);
            res.json({ status: "ok", message: `Medicamento ${newMedicamento.nome_medicamento} cadastrado.` });
            return;
        } else {
            res.status(406);
            res.json({ status: "error", message: 'Compartimento já está em utilização, escolha outro.' });
            return;
        }
    } else {
        res.status(406);
        res.json({ status: "error", message: 'Compartimento inválido, escolha outro.' });
        return;
    }
}

export const listar = async (req: Request, res: Response) => {
    if (req.body.equipamento_id) {
        console.log(req.body);
        let hasEquip = await Equipamento.findOne({ where: { "equipamento_id": req.body.equipamento_id } })
        if (hasEquip) {
            let medicamentos = await Medicamento.findAll({ where: { "equipamento_id": req.body.equipamento_id } });
            if (medicamentos) {
                res.status(201);
                res.json({ status: "ok", medicamentos: medicamentos });
                return;
            } else {
                res.status(406);
                res.json({ status: "error", message: 'Equipamento não possui medicamentos cadastrados' });
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

    let hasMed = await Medicamento.findOne({ where: { "medicamento_id": req.body.medicamento_id } });
    if (hasMed) {
        //verificação se o compartimento existe no equipamento 
        console.log("numCompartimento: ", req.body.equipamento_id);
        let equipamento = await Equipamento.findOne({ where: { "equipamento_id": req.body.equipamento_id } });
        console.log("numCompartimento: ", equipamento?.equipamento_id);
        if (equipamento && (equipamento.num_compartimentos >= req.body.num_compartimento)) {
            //verificar se o medicamento irá trocar de compartimento
            if (hasMed.num_compartimento == req.body.num_compartimento) {
                let medicamento = await Medicamento.update(req.body, { where: { "medicamento_id": req.body.medicamento_id } });
                res.status(201);
                res.json({ status: "ok", message: `${medicamento} medicamento alterado.` });
                return;
            } else {
                //verificação se o compatimento já está ocupado
                let compartimento_ocupado = await Medicamento.findOne({ where: { "equipamento_id": req.body.equipamento_id, "num_compartimento": req.body.num_compartimento, "flag_medicamento_ativo": true } });
                if (!compartimento_ocupado) {
                    let medicamento = await Medicamento.update(req.body, { where: { "medicamento_id": req.body.medicamento_id } });
                    res.status(201);
                    res.json({ status: "ok", message: `${medicamento} medicamento alterado.` });
                    return;
                } else {
                    res.status(406);
                    res.json({ status: "error", message: 'Compartimento já está em utilização, escolha outro.' });
                    return;
                }
            }
        } else {
            res.status(406);
            res.json({ status: "error", message: 'Compartimento inválido, escolha outro.' });
            return;
        }
    }
}

export const registroMedicacao = async (req: Request, res: Response) => {
    if (req.body.medicamento_id && req.body.data_consumo && req.body.hora_consumo) {
        let newRegistroMedicacao = await RegistroMedicacao.create(req.body).catch(function (err) {
            console.log(err);
            res.status(406);
            res.json({ status: "error", message: err });
            return;
        });
        res.status(201);
        res.json({ status: "ok", message: `Registro de medicação cadastrado.` });
        return;
    } else {
        res.status(406);
        res.json({ status: "error", message: 'Faltando informações.' });
        return;
    }

}

export const listarRegistros = async (req: Request, res: Response) => {
    if (req.body.equipamento_id) {
        console.log(req.body);
        let hasEquip = await Equipamento.findOne({ where: { "equipamento_id": req.body.equipamento_id } })
        if (hasEquip) {
            let registros = await RegistroMedicacao.sequelize?.query(
                `select m.nome_medicamento, m.num_doses, rm.medicamento_id, rm.data_consumo, rm.hora_consumo from registros_medicacoes rm inner join medicamentos m on m.medicamento_id = rm.medicamento_id where m.equipamento_id = ${req.body.equipamento_id}`,
                { type: QueryTypes.SELECT });
            if (registros) {
                res.status(201);
                res.json({ status: "ok", registros: registros });
                return;
            } else {
                res.status(406);
                res.json({ status: "error", message: 'Equipamento não possui medicamentos cadastrados' });
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


export const relatorioRegistros = async (req: Request, res: Response) => {
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
                let nome_usuario = await FichaSaude.findOne({ where: { "usuario_id": usuario_id[0].usuario_id } });

                let registros: any = await RegistroMedicacao.sequelize?.query(
                    `select m.nome_medicamento, m.num_doses, rm.medicamento_id, rm.data_consumo, rm.hora_consumo from registros_medicacoes rm inner join medicamentos m on m.medicamento_id = rm.medicamento_id where m.equipamento_id = ${req.body.equipamento_id}`,
                    { type: QueryTypes.SELECT });
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
                        <p id="titulo"><b>RELATÓRIO DE MEDICAÇÕES</b></p>
                        <p><b>Paciente: </b>${nome_usuario.cb_nome_completo}</p>
                    </div>
                    <table id="tabela">
                        <thead>
                            <tr>
                                <th class="celula_head">Medicamento</th>
                                <th class="celula_head">Doses</th>    
                                <th class="celula_head">Data do consumo</th>
                                <th class="celula_head">Hora do consumo</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${registros.map((item: any) => (
                        `<tr>
                                <td class="celula_center">${item.nome_medicamento}</td>
                                <td class="celula_center">${item.num_doses}</td>
                                <td class="celula_center">${item.data_consumo}</td>
                                <td class="celula_center">${item.hora_consumo}</td>
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
                    res.json({ status: "error", message: 'Equipamento não possui medicamentos cadastrados' });
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