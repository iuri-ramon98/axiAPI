/*
	Validadores de usuario
*/
import { checkSchema } from "express-validator";

export default {
	login: checkSchema({
		email: {
            trim: true,
			isEmail: true,
			normalizeEmail: true,
			errorMessage: 'E-mail inválido'
		},
		senha: {
			isLength:{
				options: { min: 5 }
			},
			errorMessage: 'Senha precisa ter pelo menos 5 caracteres'
		},
	}),
	registrar: checkSchema({
		nome: {
			isLength:{
				options: { min: 2 }  //testar max 50 (caso contrario travar no app)
			},
			errorMessage: 'Nome precisa ter pelo menos 2 caracteres'
		},
		email: {
			isEmail: true,
			normalizeEmail: true,
			errorMessage: 'E-mail inválido'
		},
		senha: {
			isLength:{
				options: { min: 5 }
			},
			errorMessage: 'Senha precisa ter pelo menos 5 caracteres'
		}, 
		flag_tipo_usuario:{
			isInt:{
				options: {min:0, max:2},
				errorMessage: 'Os tipos de usuario vão de 0 a 2'
			},
			notEmpty: true,
			errorMessage: 'Campo flag_tipo_usuario não pode ser vazio'
		},

		
	})


}