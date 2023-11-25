/*
    Model da tabela de ficha de saúde do usuário
*/

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/DataBase';
import { Usuario } from './Usuarios';


export interface FichaInstance extends Model {
    ficha_saude_id: number;
    usuario_id: number;
    data_ultima_alteracao: Date;
    cb_nome_completo: string;
    cb_nome_social: string;
    cb_data_nascimento: Date;
    cb_sexo: number;
    cb_estado_civil: number;
    cb_raca_cor: number;
    ie_endereco: string;
    ie_pessoa_referencia: string;
    ie_telefone: string;
    ie_us_referencia: string;
    ic_flag_avc: boolean;
    ic_flag_anemia: boolean;
    ic_flag_asma: boolean;
    ic_flag_diabetes: boolean;
    ic_flag_hipertensao_arterial: boolean;
    ic_flag_dac: boolean;
    ic_flag_insuficiencia_cardiaca: boolean;
    ic_flag_dpoc: boolean;
    ic_flag_ulcera_gastrointestinal: boolean;
    ic_flag_eplepsia: boolean;
    ic_flag_depressao: boolean;
    ic_flag_ansiedade: boolean;
    ic_flag_incontinencia_urinaria: boolean;
    ic_flag_declinio_cognitivo: boolean;
    ic_outras_doencas: string;
    ic_peso: number;
    ic_altura: number;
    ic_imc: number;
    ic_flag_polifarmacia: boolean;
    ic_flag_fumante: boolean;
    ic_flag_alcool: boolean;
    ic_flag_atividade_fisica: boolean;
    ic_flag_deficiencia_auditiva: boolean;
    ic_flag_deficiencia_fisica: boolean;
    ic_flag_deficiencia_visual: boolean;
    ic_flag_deficiencia_intelectual: boolean;
    ic_outras_deficiencias: string;
    p_moradia: number;
    p_esquecimento: boolean;
    p_mudanca_humor: boolean;
}

export const FichaSaude = sequelize.define<FichaInstance>('FichaSaude', {
    ficha_saude_id: {
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
        unique: 'unique-ficha-per-user'
    },
    data_ultima_alteracao: {
        type: DataTypes.DATEONLY //verificar se é o correto
    },
    cb_nome_completo: {
        type: DataTypes.STRING
    },
    cb_nome_social: {
        type: DataTypes.STRING
    },
    cb_data_nascimento: {
        type: DataTypes.DATEONLY
    },
    cb_sexo: {
        type: DataTypes.INTEGER
    },
    cb_estado_civil: {
        type: DataTypes.INTEGER
    },
    cb_raca_cor: {
        type: DataTypes.INTEGER
    },
    ie_endereco: {
        type: DataTypes.STRING
    },
    ie_pessoa_referencia: {
        type: DataTypes.STRING
    },
    ie_telefone: {
        type: DataTypes.STRING
    },
    ie_us_referencia: {
        type: DataTypes.STRING
    },
    ic_flag_avc: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_anemia: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_asma: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_diabetes: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_hipertensao_arterial: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_dac: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_insuficiencia_cardiaca: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_dpoc: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_ulcera_gastrointestinal: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_eplepsia: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_depressao: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_ansiedade: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_incontinencia_urinaria: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_declinio_cognitivo: {
        type: DataTypes.BOOLEAN
    },
    ic_outras_doencas: {
        type: DataTypes.STRING
    },
    ic_peso: {
        type: DataTypes.FLOAT
    },
    ic_altura: {
        type: DataTypes.FLOAT
    },
    ic_imc: {
        type: DataTypes.FLOAT
    },
    ic_flag_polifarmacia: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_fumante: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_alcool: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_atividade_fisica: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_deficiencia_auditiva: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_deficiencia_fisica: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_deficiencia_visual: {
        type: DataTypes.BOOLEAN
    },
    ic_flag_deficiencia_intelectual: {
        type: DataTypes.BOOLEAN
    },
    ic_outras_deficiencias: {
        type: DataTypes.STRING
    },
    p_moradia: {
        type: DataTypes.INTEGER
    },
    p_esquecimento: {
        type: DataTypes.BOOLEAN
    },
    p_mudanca_humor: {
        type: DataTypes.BOOLEAN
    }
}, {
    tableName: 'ficha_saude',
    timestamps: false
});

FichaSaude.belongsTo(Usuario, { foreignKey: 'usuario_id', targetKey: 'usuario_id', as: 'Usuario' });