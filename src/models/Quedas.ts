/*
    Model da tabela de Medicamentos do usuário
*/

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/DataBase';
import { Equipamento } from './Equipamentos';


export interface QuedInstance extends Model {
    queda_id: number;
    equipamento_id: number;
    data_queda: Date;
    hora_queda: Date;
}

export const Queda = sequelize.define<QuedInstance>('Queda', {
    queda_id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    equipamento_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'medicamentos',
            key: 'medicamento_id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        unique: 'unique-registro-per-medicamento'
    },
    data_queda: {
        type: DataTypes.DATEONLY
    },
    hora_queda:{
        type: DataTypes.TIME
    },    
}, {
    tableName: 'quedas',
    timestamps: false,
    freezeTableName: true
});

Queda.belongsTo(Equipamento, { foreignKey: 'equipamento_id', targetKey: 'equipamento_id', as: 'Equipamento' });
