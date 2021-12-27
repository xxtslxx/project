const Sequelize = require('sequelize')
const instancia = require('../../../banco-de-dados')

const colunas = {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    estoque: {
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultvalue: 0
    },
    fornecedor: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {
            model: require('../ModeloTabelaActivity'),
            key: 'id'
        }
    }
}

const opcoes = {
    freezeTableName: true,
    tableName:'produtos',
    timestamps: true,
    createdAt:'dataCriacao',
    updateAt:'dataAtualizacao',
    version: 'versao' 
}

module.exports = instancia.define('tasks', colunas, opcoes )