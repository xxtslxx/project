const roteador = require("express").Router()
const TabelaActivity = require('./TabelaActivity')
const Activity = require('./Activity')
const { get } = require("express/lib/request")
const SerializadorActivity = require('../../Serializador').SerializadorActivity

roteador.options('/:idActivity', (requisicao, resposta) => {
  resposta.set('Access-Control-Allow-Methods','GET,POST')
  resposta.set('Access-Control-Allow-Headers','Content-Type')
  resposta.status(204)
  resposta.end()
})

roteador.get('/', async (requisicao, resposta) => {
  const resultados = await TabelaActivity.listar()
  resposta.status(200)
  const serializador = new SerializadorActivity(
    resposta.getHeader('Content-Type'),
    ['empresa']
  )
  resposta.send(
    serializador.serializar(resultados)
  );

})

roteador.post('/', async (requisicao, resposta, proximo) => {
  try {
     const dadosRecebidos = requisicao.body
     const activity = new Activity(dadosRecebidos)
     await activity.criar()
     resposta.status(201)
     const serializador = new SerializadorActivity(
      resposta.getHeader('Content-Type'),
      ['empresa']
    )
     resposta.send(
         serializador.serializar(activity)
    )
   } catch (erro) {
     proximo(erro)
   }
})

roteador.options('/:idActivity', (requisicao, resposta) => {
  resposta.set('Access-Control-Allow-Methods','GET, PUT, DELETE')
  resposta.set('Access-Control-Allow-Headers','Content-Type')
  resposta.status(204)
  resposta.end()
})
 
roteador.get('/:idActivity', async (requisicao, resposta, proximo) => {
    try {
       const id = requisicao.params.idActivity
       const activity = new Activity({ id: id })
       await activity.carregar()
       resposta.status(200)
       const serializador = new SerializadorActivity(
         resposta.getHeader('Content-Type'),
         ['email', 'empresa', 'dataCriacao', 'dataAtualizacao', 'versao']
       )
       resposta.send(
          serializador.serializar(activity)
       )
    } catch (erro) {
         proximo(erro)
    }
    
})

roteador.put('/:idActivity', async (requisicao, resposta, proximo) => {
    try {
      const id = requisicao.params.idActivity
      const dadosRecebidos = requisicao.body
      const dados = Object.assign({}, dadosRecebidos,{ id: id})
      const activity = new Activity(dados)
      await activity.atualizar()
      resposta.status(204)
      resposta.end()
    } catch (erro) {
        proximo(erro)
    }
})

roteador.delete('/:idActivity', async (requisicao, resposta, proximo) => {
  try {
    const id = requisicao.params.idActivity
    const activity = new Activity({ id: id})
    await activity.carregar()
    await activity.remover()
    resposta.status(204)
    resposta.end()
    } catch (erro) {
      proximo(erro) 
    }
})

const roteadorTasks = require('./tasks')

const verificarActivity = async (requisicao, resposta, proximo) => {
  try {
    const id = requisicao.params.idActivity
    const activity = new Activity({ id: id })
    await activity.carregar()
    requisicao.activity = activity
    proximo()
  } catch (erro) {
      proximo(erro)
  }
}

roteador.use('/:idActivity/tasks', verificarActivity, roteadorTasks)
  
module.exports = roteador
 