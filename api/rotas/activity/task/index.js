const roteador = require('express').Router({ mergeParams: true })
const Tabela = require('./TabelaTask')
const Task = require('./Task')
const Serializador = require('../../../Serializador').SerializadorTask

roteador.options('/', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods','GET,POST')
    resposta.set('Access-Control-Allow-Headers','Content-Type')
    resposta.status(204)
    resposta.end()
})

roteador.get('/', async (requisicao, resposta) => {
    const tasks = await Tabela.listar(requisicao.activity.id)
    const serializador = new Serializador(
        resposta.getHeader('Content-Type')
    )
    resposta.send(
        serializador.serializar(tasks)
    )
})

roteador.post('/', async (requisicao, resposta, proximo) => {
    try {
        const idActivity = requisicao.activity.id
        const corpo = requisicao.body
        const dados = Object.assign({}, corpo, { activity: idActivity })
        const task = new Task(dados)
        await task.criar()
        const serializador = new Serializador(
            resposta.getHeader('Content-Type')
        )
        resposta.status(201)
        console.log(serializador.serializar(task))
        resposta.send(
            serializador.serializar(task)
        )
    } catch (erro) {
        proximo(erro)
    }
})

roteador.options('/:id', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods','DELETE, GET, HEAD, PUT')
    resposta.set('Access-Control-Allow-Headers','Content-Type')
    resposta.status(204)
    resposta.end()
})

roteador.delete('/:id', async (requisicao, resposta) => {
    const dados = {
        id: requisicao.params.id,
        activity: requisicao.activity.id
    }

    const task = new Task(tasks)
    await task.apagar()
    resposta.status(204)
    resposta.end()
})

roteador.get('/:id', async (requisicao, resposta, proximo) => {
  try {
    const dados = {
        id: requisicao.params.id,
        activity: requisicao.activity.id
    }

    const task = new Task(dados)
    await task.carregar()
    const serializador = new Serializador(
        resposta.getHeader('Content-Type'),
        ['preco', 'estoque', 'fornecedor','dataCriacao','dataAtualizacao','versao']
    )
    console.log(serializador.serializar(task))
    resposta.send(
        serializador.serializar(task)
    )
  } catch (erro) {
      proximo(erro)
  }
})

roteador.head('/:id', async (requisicao, resposta, proximo) => {
    try {
        const dados = {
            id: requisicao.params.id,
            activity: requisicao.activity.id
        }
    
        const task = new Task(dados)
        await task.carregar()
        resposta.set('ETag', task.versao)
        const timestamp = (new Date(Task.dataAtualizacao)).getTime()
        resposta.set('Last-Modifed', timestamp)
        resposta.status(200)
        resposta.end()
      } catch (erro) {
          proximo(erro)
      }
})

roteador.put('/:id', async (requisicao, resposta, proximo) => {

    try{
        const dados = Object.assign(
            {},
            requisicao.body,
            {
                id: requisicao.params.id,
                activity: requisicao.activity.id 
            }
        )
    
        const task = new Task(dados)
        await task.atualizar()
        resposta.status(204)
        resposta.end()
    } catch (erro) {
      proximo(erro)
    }




})

roteador.options('/:id/diminuir-estoque', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods','POST')
    resposta.set('Access-Control-Allow-Headers','Content-Type')
    resposta.status(204)
    resposta.end()
})

roteador.post('/:id/diminuir-estoque', async(requisicao, resposta, proximo) => {
 try{
    const task = new Task({
        id: requisicao.params.id,
        activity: requisicao.activity.id
    })

    await task.carregar()
    task.estoque = task.estoque - requisicao.body.quantidade
    await task.diminuirEstoque()
    resposta.status(204)
    resposta.end()
 } catch(erro) {
     proximo(erro)
 }

})

module.exports = roteador 