/*
    Model da tabela de Cirurgia do usuário
*/

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/DataBase';
import { Usuario } from './Usuarios';


export interface CirurgiaInstance extends Model {
    cirurgia_id: number;
    usuario_id: number;
    data_cirurgia: Date;
    tipo_cirurgia: string;
    medico_responsavel: string;
    motivo: string;
    observacoes: string;

}

export const Cirurgia = sequelize.define<CirurgiaInstance>('Cirurgia', {
    cirurgia_id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'usuarios',
            key: 'usuario_id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        unique: 'unique-cirurgia-per-user'
    },
    data_cirurgia: {
        type: DataTypes.DATEONLY //verificar se é o correto
    },
    tipo_cirurgia: {
        type: DataTypes.STRING
    },
    medico_responsavel: {
        type: DataTypes.STRING
    },
    motivo: {
        type: DataTypes.STRING
    },
    observacoes: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'cirurgias',
    timestamps: false
});

Cirurgia.belongsTo(Usuario, { foreignKey: 'usuario_id', targetKey: 'usuario_id', as: 'Usuario' });