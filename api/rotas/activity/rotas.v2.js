const roteador = require("express").Router()
const TabelaActivity = require('./TabelaActivity')
const SerializadorActivity = require('../../Serializador').SerializadorActivity


roteador.options('/', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods','GET,POST')
    resposta.set('Access-Control-Allow-Headers','Content-Type')
    resposta.status(204)
    resposta.end()
})

roteador.get('/', async (requisicao, resposta) => {
    const resultados = await TabelaActivity.listar()
    resposta.status(200)
    const serializador = new SerializadorActivity(
      resposta.getHeader('Content-Type')
    )
    resposta.send(
      serializador.serializar(resultados)
    );
  
})

module.exports = roteador

