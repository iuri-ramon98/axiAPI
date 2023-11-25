import { checkSchema } from "express-validator";


export default {
    vincular: checkSchema({
        usuario_id: {
            notEmpty: true,
            errorMessage: 'Usuário não informado.'
        },
        equipamento_id: {
            notEmpty: true,
            errorMessage: 'Equipamento não informado.'
        },
        player_id: {
            isLength:{
				options: { min: 10 }
			},
            errorMessage: 'Player_id Inválido.'
        },
        flag_equipamento_ativo: {
			notEmpty: true,
			errorMessage: 'Campo flaq_equipamento_ativo vazio'
		}
    }),
    atualizarPlayer: checkSchema({
        usuario_id: {
            notEmpty: true,
            errorMessage: 'Usuário não informado.'
        },
        player_id: {
            isLength:{
				options: { min: 10 }
			},
            errorMessage: 'Player_id Inválido.'
        }
    }),
    notificaQueda: checkSchema({
        mac: {
            isMACAddress: true,
            errorMessage: 'Endereço MAC Inválido.'
        }
    
    }),
    listarPessoasVinculadas: checkSchema({
        equipamento_id:{
            notEmpty: true,
            errorMessage: 'Informe o id de um equipamento'
        }    
    }),
    ativarEquipamento: checkSchema({
        user_equip_id:{
            notEmpty: true,
            errorMessage: 'Informe o id do vinculo'
        }
    })
}