/*
    Model da tabela de Medicamentos do usuário
*/

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/DataBase';
import { Medicamento } from './Medicamentos';


export interface RegsInstance extends Model {
    registro_medicacao_id: number;
    medicamento_id: number;
    data_consumo: Date;
    hora_consumo: Date;
}

export const RegistroMedicacao = sequelize.define<RegsInstance>('RegistroMedicacao', {
    registro_medicacao_id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    medicamento_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'medicamentos',
            key: 'medicamento_id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        unique: 'unique-registro-per-medicamento'
    },
    data_consumo: {
        type: DataTypes.DATEONLY
    },
    hora_consumo:{
        type: DataTypes.TIME
    },    
}, {
    tableName: 'registros_medicacoes',
    timestamps: false,
    freezeTableName: true
});

RegistroMedicacao.belongsTo(Medicamento, { foreignKey: 'medicamento_id', targetKey: 'medicamento_id', as: 'Medicamento' });
