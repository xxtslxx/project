const TabelaActivity = require('./TabelaActivity')
const CampoInvalido = require('../../erros/CampoInvalido')
const DadosNaoFornecidos = require('../../erros/DadosNaoFornecidos')

class Activity {
  constructor ({ id, empresa, email, categoria, dataCriacao, dataAtualizacao, versao }) {
    this.id = id
    this.empresa = empresa
    this.email = email
    this.categoria = categoria
    this.dataCriacao = dataCriacao
    this.dataAtualizacao = dataAtualizacao
    this.versao = versao
  }

  async criar () {
      this.validar()
      const resultado = await TabelaActivity.inserir({
        empresa: this.empresa,
        email: this.email,
        categoria: this.categoria
      })

      this.id = resultado.id
      this.dataCriacao = resultado.dataCriacao
      this.dataAtualizacao = resultado.dataAtualizacao
      this.versao = resultado.versao
  }

  async carregar () {
    const encontrado = await TabelaActivity.pegarPorId(this.id)
    this.empresa = encontrado.empresa
    this.email = encontrado.email
    this.categoria = encontrado.categoria
    this.dataCriacao = encontrado.dataCriacao
    this.dataAtualizacao = encontrado.dataAtualizacao
    this.versao = encontrado.versao
  }

  async atualizar () {
    await TabelaActivity.pegarPorId(this.id)
    const campos = ['empresa', 'email', 'categoria']
    const dadosParaAtualizar = {}

    campos.forEach((campo) => {
      const valor = this[campo]

      if (typeof valor === 'string' && valor.length > 0) {
        dadosParaAtualizar[campo] = valor 
      }
    })

    if (Object.keys(dadosParaAtualizar).length === 0) {
      throw new DadosNaoFornecidos()
    }

    await TabelaActivity.atualizar(this.id, dadosParaAtualizar)
  }

  remover () {
    return TabelaActivity.remover(this.id)
  }

  validar () {
    const campos = ['empresa', 'email', 'categoria']

    campos.forEach(campo => {
      const valor = this[campo]

      if (typeof valor !== 'string' || valor.length === 0) {
        throw new CampoInvalido(campo)
      }
    })
  }
}

module.exports = Activity