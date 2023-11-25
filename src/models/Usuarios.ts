/*
    Model de usuário
*/

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/DataBase';


export interface UserInstance extends Model {
    usuario_id: number;
    nome: string;
    email: string;
    senha: string;
    flag_tipo_usuario: number;
}

export const Usuario = sequelize.define<UserInstance>('Usuario', {
    usuario_id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    nome: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    senha: {
        type: DataTypes.STRING
    },
    flag_tipo_usuario: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'usuarios',
    timestamps: false
});


