import { checkSchema } from "express-validator";


export default {
    registrar: checkSchema({
        usuario_id: {
            notEmpty: true,
            errorMessage: 'Usuário não informado.'
        },
        data_cirurgia: {
            notEmpty: true,
            isDate: true,
            errorMessage: 'Não foi informada uma data válida.'
        },
        tipo_cirurgia: {
            isLength: {
                options: { min: 3, max: 60 },
                errorMessage: 'Tipo de cirurgia com tamanho inválido.'
            }
        },
        medico_responsavel: {
            isLength: {
                options: { min: 3, max: 60 },
                errorMessage: 'Nome com tamanho inválido.'
            }
        },
        motivo: {
            isLength: {
                options: { min: 3, max: 60 },
                errorMessage: 'Motivo com tamanho inválido.'
            }
        },
        observacoes: {
            isLength: {
                options: { min: 0, max: 60 },
                errorMessage: 'Observações com tamanho inválido.'
            }
        },
    }),
    alterar: checkSchema({
        cirurgia_id: {
            notEmpty: true,
            errorMessage: 'Cirurgia não informada.'
        },
        usuario_id: {
            notEmpty: true,
            errorMessage: 'Usuário não informado.'
        },
        data_cirurgia: {
            notEmpty: true,
            isDate: true,
            errorMessage: 'Não foi informada uma data válida.'
        },
        tipo_cirurgia: {
            isLength: {
                options: { min: 3, max: 60 },
                errorMessage: 'Tipo de cirurgia com tamanho inválido.'
            }
        },
        medico_responsavel: {
            isLength: {
                options: { min: 3, max: 60 },
                errorMessage: 'Nome com tamanho inválido.'
            }
        },
        motivo: {
            isLength: {
                options: { min: 3, max: 60 },
                errorMessage: 'Motivo com tamanho inválido.'
            }
        },
        observacoes: {
            isLength: {
                options: { min: 0, max: 60 },
                errorMessage: 'Observações com tamanho inválido.'
            }
        },
    }),

}

