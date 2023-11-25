import { checkSchema } from "express-validator";


export default {
    registrar: checkSchema({
        usuario_id: {
            notEmpty: true,
            errorMessage: 'Usuário não informado.'
        },
        data_ultima_alteracao: {
            notEmpty: true,
            isDate: true,
            errorMessage: 'Não foi informada uma data válida.'
        },
        cb_nome_completo: {
            isLength: {
                options: { min: 3, max: 60 },
                errorMessage: 'Nome com tamanho inválido'
            }
        },
        cb_nome_social: {
            isLength: {
                options: { min: 3, max: 60 },
                errorMessage: 'Nome com tamanho inválido'
            }
        },
        cb_data_nascimento: {
            notEmpty: true,
            isDate: true,
            errorMessage: 'Não foi informada uma data válida.'
        },
        cb_sexo: {
            notEmpty: true,
            isInt: {
                options: { min: 0, max: 2 },
                errorMessage: 'Valor inválido'
            },
            errorMessage: 'Sexo não informado.'
        },
        cb_estado_civil: {
            notEmpty: true,
            isInt: {
                options: { min: 0, max: 4 },
                errorMessage: 'Valor inválido'
            },
            errorMessage: 'Estado civil não informado.'
        },
        cb_raca_cor: {
            notEmpty: true,
            isInt: {
                options: { min: 0, max: 5 },
                errorMessage: 'Valor inválido'
            },
            errorMessage: 'Raça/Cor não informado.'
        },
        ie_endereco: {
            isLength: {
                options: { min: 0, max: 60 },
                errorMessage: 'Endereço com tamanho inválido'
            }
        },
        ie_pessoa_referencia: {
            isLength: {
                options: { min: 0, max: 60 },
                errorMessage: 'Nome com tamanho inválido'
            }
        },
        ie_telefone: {
            isLength: {
                options: { min: 0, max: 11 },
                errorMessage: 'Telefone inválido'
            },
        },
        ie_us_referencia: {
            isLength: {
                options: { min: 0, max: 60 },
                errorMessage: 'US com tamanho inválido'
            }
        },
        ic_flag_avc: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_anemia: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_asma: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_diabetes: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_hipertensao_arterial: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_dac: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_insuficiencia_cardiaca: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_dpoc: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_ulcera_gastrointestinal: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_eplepsia: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_depressao: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_ansiedade: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_incontinencia_urinaria: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_declinio_cognitivo: {
            isBoolean: true,
            notEmpty: true
        },
        ic_outras_doencas: {
            isLength: {
                options: { max: 100 },
                errorMessage: 'Tamanho excedido.'
            },
        },
        ic_peso: {
            notEmpty: true,
            isFloat: true
        },
        ic_altura: {
            notEmpty: true,
            isFloat: true
        },
        ic_imc: {
            notEmpty: true,
            isFloat: true
        },
        ic_flag_polifarmacia: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_fumante: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_alcool: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_atividade_fisica: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_deficiencia_auditiva: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_deficiencia_fisica: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_deficiencia_visual: {
            isBoolean: true,
            notEmpty: true
        },
        ic_flag_deficiencia_intelectual: {
            isBoolean: true,
            notEmpty: true
        },
        ic_outras_deficiencias: {
            isLength: {
                options: { max: 100 },
                errorMessage: 'Tamanho excedido.'
            },
        },
        p_moradia: {
            notEmpty: true,
            isInt: {
                options: { min: 0, max: 4 },
                errorMessage: 'Valor inválido'
            },
            errorMessage: 'Moradia não informado.'
        },
        p_esquecimento: {
            isBoolean: true,
            notEmpty: true
        },
        p_mudanca_humor: {
            isBoolean: true,
            notEmpty: true
        }
    }),

}