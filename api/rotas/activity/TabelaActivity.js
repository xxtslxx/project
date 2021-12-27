const Modelo = require('./ModeloTabelaActivity')
const NaoEncontrado = require('../../erros/NaoEncontrado')

module.exports = {
  listar () {
    return Modelo.findAll({ raw: true })
  },
  inserir(activity) {
    return Modelo.create(activity)
  },
  async pegarPorId (id) {
    const encontrado = await Modelo.findOne({
      where: {
           id: id  
      }
  })

  if (!encontrado) {
    throw new NaoEncontrado('Activity')
  }

  return encontrado
  },
  atualizar (id, dadosParaAtualizar) {
    return Modelo.update(
      dadosParaAtualizar,
      {
        where: { id: id }
      }
    )
  },
  remover (id) {
    return Modelo.destroy ({
      where: { id: id }
    })
  }
}