/*
    Model da tabela de Consulta do usuário
*/

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/DataBase';
import { Equipamento } from './Equipamentos';


export interface ConsultInstance extends Model {
    consulta_id: number;
    equipamento_id: number;
    data_consulta: Date;
    hora_consulta: Date;
    nome_medico: string;
    flag_situacao: number;
    motivo_consulta: string;

}

export const Consulta = sequelize.define<ConsultInstance>('Consulta', {
    consulta_id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    equipamento_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'equipamentos',
            key: 'equipamento_id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        unique: 'unique-consulta-per-equip'
    },
    data_consulta: {
        type: DataTypes.DATEONLY //verificar se é o correto
    },
    hora_consulta: {
        type: DataTypes.TIME
    },
    nome_medico: {
        type: DataTypes.STRING
    },
    flag_situacao: {
        type: DataTypes.INTEGER
    },
    motivo_consulta: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'consultas',
    timestamps: false,
    freezeTableName: true
});

Consulta.belongsTo(Equipamento, { foreignKey: 'equipamento_id', targetKey: 'equipamento_id', as: 'Equipamento' });
