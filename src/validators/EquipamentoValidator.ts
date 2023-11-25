import { checkSchema } from "express-validator";


export default {
    registrar: checkSchema({
        mac: {
            isMACAddress: true,
            errorMessage: 'Endereço MAC Inválido.'
        },
        num_compartimentos:{
            isInt:{
				options: {min:1, max:10},
				errorMessage: 'O número de compartimentos, deve ser um inteiro, que vai de 1 a 10.'
			},
			notEmpty: true,
			errorMessage: 'O número de compartimentos não pode ser vazio.'
        }
    }),
    encontrar: checkSchema({
        mac: {
            isMACAddress: true,
            errorMessage: 'Endereço MAC Inválido.'
        }
    })
}