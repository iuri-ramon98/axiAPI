/*
    Model da tabela de associação Usuarios e Equipamentos
*/

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/DataBase';
import { Usuario } from './Usuarios';
import { Equipamento } from './Equipamentos';


export interface UserEquipInstance extends Model {
    user_equip_id: number;
    usuario_id: number;
    equipamento_id: number;
    player_id: string;
    flag_equipamento_ativo: boolean;
}

export const UsuarioEquipamento = sequelize.define<UserEquipInstance>('UsuarioEquipamento', {
    user_equip_id:{
        primaryKey:true,
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
        unique: 'unique-user-per-equip'
    },
    equipamento_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'usuarios',
            key: 'usuario_id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
        unique: 'unique-user-per-equip'
    },
    player_id: {
        type: DataTypes.STRING
    },
    flag_equipamento_ativo: {
        type: DataTypes.BOOLEAN
    }
}, {
    tableName: 'usuarios_equipamentos',
    timestamps: false
});

UsuarioEquipamento.belongsTo(Usuario, { foreignKey: 'usuario_id', targetKey: 'usuario_id', as: 'Usuario' });
UsuarioEquipamento.belongsTo(Equipamento, { foreignKey: 'equipamento_id', targetKey: 'equipamento_id', as: 'Equipamento' });
Usuario.belongsToMany(Equipamento, { as: 'UsersInEquips', through: UsuarioEquipamento, foreignKey: 'usuario_id'});
Equipamento.belongsToMany(Usuario, { as: 'EquipsInUsers', through: UsuarioEquipamento, foreignKey: 'equipamento_id'});