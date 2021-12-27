const Modelo = require('./ModeloTabelaTask')
const instancia = require('../../../banco-de-dados')
const NaoEncontrado = require('../../../erros/NaoEncontrado')

module.exports = {
    listar (idActivity) {
        return Modelo.findAll({
            where: {
                activity: idActivity
            },
            raw: true
        })
    },
    inserir (dados) {
        return Modelo.create(dados)
    },
    remover (idTask, idActivity) {
        return Modelo.destroy({
            where: {
                id: idTask,
                activity: idActivity
            }
        })
    },
    async pegarPorId (idTask, idActivity) {
        const encontrado = await Modelo.findOne({
            where: {
                id: idTask,
                activity: idActivity
            },
            raw: true
        })

        if(!encontrado) {
            throw new NaoEncontrado('Task')
        }

        return encontrado 
    },
    atualizar (dadosDoTask, dadosParaAtualizar) {
        return Modelo.update(
            dadosParaAtualizar,
            {
                where: dadosDoTask
            }
        )
    },
    subtrair (idTask, idActivity, campo, quantidade) {
        return instancia.transaction(async transacao => {
            const task = await Modelo.findOne({
                where: {
                    id: idTask,
                    activity: idActivity
                }
            })

            task[campo] = quantidade

            await task.save()

            return task
        })
    }
}