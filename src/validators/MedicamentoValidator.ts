import { checkSchema } from "express-validator";


export default {
    registrar: checkSchema({
        equipamento_id: {
            notEmpty: true,
            errorMessage: 'Equipamento não informado.'
        },
        nome_medicamento: {
            isLength: {
                options: { min: 3, max: 60 },
                errorMessage: 'Nome do medicamento com tamanho inválido.'
            }
        },
        num_compartimento: {
            isInt: {
                options: { min: 1, max: 10 },
                errorMessage: 'O número de compartimentos vai de 1 a 10.'
            },
            notEmpty: true,
            errorMessage: 'O número de compartimentos não pode ser vazio.'
        },
        hora_inicio: {
            notEmpty: true,
            errorMessage: 'Não foi informada uma hora válida.'
        },
        intervalo: {
            notEmpty: true,
            errorMessage: 'Não foi informada uma hora válida.'
        },
        num_doses: {
            isInt: {
                options: { min: 1, max: 10 },
                errorMessage: 'O número de doses vai de 1 a 10.'
            },
            notEmpty: true,
            errorMessage: 'O número de compartimentos não pode ser vazio.'
        },
        flag_medicamento_ativo: {
            notEmpty: true,
            isBoolean: true,
            errorMessage: "Deve ser informado se o medicamento ainda é tomado."
        }
    }),
}