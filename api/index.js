const express =  require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
require('./banco-de-dados/criarTabelas')

app.use(bodyParser.json())

const roteador = require ('./rotas/fornecedores')
app.use('/api/fornecedores', roteador)
 
app.listen(config.get('api.porta'), () => console.log('A API esta funcionando!'))
