/*
    Model da tabela de Medicamentos do usuário
*/

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/DataBase';
import { Equipamento } from './Equipamentos';


export interface MedsInstance extends Model {
    medicamento_id: number;
    equipamento_id: number;
    nome_medicamento: string;
    num_compartimento: number;
    hora_inicio: Date;
    intervalo: number;
    num_doses: number;
    flag_medicamento_ativo: boolean;
}

export const Medicamento = sequelize.define<MedsInstance>('Medicamento', {
    medicamento_id: {
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
        unique: 'unique-medicamento-per-equip'
    },
    nome_medicamento: {
        type: DataTypes.STRING
    },
    num_compartimento: {
        type: DataTypes.INTEGER
    },
    hora_inicio: {
        type: DataTypes.TIME //verificar se é o correto
    },
    intervalo: {
        type: DataTypes.INTEGER
    },
    num_doses: {
        type: DataTypes.INTEGER
    },
    
    flag_medicamento_ativo: {
        type: DataTypes.BOOLEAN
    }
}, {
    tableName: 'medicamentos',
    timestamps: false,
    freezeTableName: true
});

Medicamento.belongsTo(Equipamento, { foreignKey: 'equipamento_id', targetKey: 'equipamento_id', as: 'Equipamento' });
