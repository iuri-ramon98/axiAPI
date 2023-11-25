import { checkSchema } from "express-validator";


export default {
    registrar: checkSchema({
        equipamento_id: {
            notEmpty: true,
            errorMessage: 'Equipamento não informado.'
        },
        data_consulta: {
            notEmpty: true,
            isDate: true,
            errorMessage: 'Não foi informada uma data válida.'
        },
        hora_consulta: {
            notEmpty: true,
            errorMessage: 'Não foi informada uma hora válida.'
        },
        nome_medico: {
            isLength: {
                options: { min: 3, max: 60 },
                errorMessage: 'Nome com tamanho inválido.'
            }
        },
        flag_situacao: {
            isInt: {
                options: { min: 0, max: 2 },
                errorMessage: 'Valor inválido'
            },
        },
        motivo_consulta: {
            isLength: {
                options: { min: 3, max: 60 },
                errorMessage: 'Motivo com tamanho inválido.'
            }
        },
    }),
    alterar: checkSchema({
        consulta_id: {
            notEmpty: true,
            errorMessage: 'Consulta não informada.'
        },
        equipamento_id: {
            notEmpty: true,
            errorMessage: 'Equipamento não informado.'
        },
        data_consulta: {
            notEmpty: true,
            isDate: true,
            errorMessage: 'Não foi informada uma data válida.'
        },
        hora_consulta: {
            notEmpty: true,
            errorMessage: 'Não foi informada uma hora válida.'
        },
        nome_medico: {
            isLength: {
                options: { min: 3, max: 60 },
                errorMessage: 'Nome com tamanho inválido.'
            }
        },
        flag_situacao: {
            isInt: {
                options: { min: 0, max: 2 },
                errorMessage: 'Valor inválido'
            },
        },
        motivo_consulta: {
            isLength: {
                options: { min: 3, max: 60 },
                errorMessage: 'Motivo com tamanho inválido.'
            }
        },
    }),

}

