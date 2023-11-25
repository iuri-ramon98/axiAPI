/*
    Model de equipamento
*/

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/DataBase';

export interface EquipInstance extends Model {
    equipamento_id: number;
    mac: string;
    num_compartimentos: number;
}

export const Equipamento = sequelize.define<EquipInstance>('Equipamento', {
    equipamento_id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    mac: {
        type: DataTypes.STRING,
        unique: true
    },
    num_compartimentos: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'equipamentos',
    timestamps: false
});

