const Tabela = require('./TabelaTask')
const DadosNaoFornecidos = require('../../../erros/DadosNaoFornecidos')
const CampoInvalido = require('../../../erros/CampoInvalido')

class Task {
    constructor ({ id, titulo, preco, estoque, fornecedor, dataCriacao, dataAtualizacao, versao } = {}) {
        this.id = id
        this.titulo = titulo
        this.preco = preco
        this.estoque = estoque
        this.fornecedor = fornecedor
        this.dataCriacao = dataCriacao
        this.dataAtualizacao = dataAtualizacao
        this.versao = versao

    }

    validar () {
        if (typeof this.titulo !== 'string' || this.titulo.length === 0 ) {
            throw new CampoInvalido('titulo')
        }

        if (typeof this.preco !== 'number' || this.preco === 0) {
            throw new CampoInvalido('preco')
        }
    }

    async criar () {
        this.validar()
        const resultado = await Tabela.inserir({
            titulo: this.titulo,
            preco: this.preco,
            estoque: this.estoque,
            fornecedor: this.fornecedor
        })

        this.id = resultado.id
        this.dataCriacao = resultado.dataCriacao
        this.dataAtualizacao = resultado.dataAtualizacao
        this.versao = resultado.versao

    }

    apagar () {
        return Tabela.remover(this.id, this.activity)
    }

    async carregar () {
        const task = await Tabela.pegarPorId(this.id, this.activity)
        this.titulo = task.titulo
        this.preco = task.preco
        this.estoque = task.estoque
        this.dataCriacao = task.dataCriacao
        this.dataAtualizacao = task.dataAtualizacao
        this.versao = task.versao
    }

    atualizar () {
        const dadosParaAtualizar = {}

        if (typeof this.titulo === 'string' && this.titulo.length > 0) {
            dadosParaAtualizar.titulo = this.titulo
        }

        if (typeof this.preco === 'number' && this.preco.length > 0) {
            dadosParaAtualizar.preco = this.preco
        }

        if (typeof this.estoque === 'string' && this.estoque.length > 0) {
            dadosParaAtualizar.estoque = this.estoque
        }

        if (Object.keys(dadosParaAtualizar).length === 0) {
           throw new DadosNaoFornecidos()
        }

        return Tabela.atualizar(
            {
                id: this.id,
                activity: this.activity
            },
            dadosParaAtualizar
        )
    }

    diminuirEstoque () {
        return Tabela.subtrair (
            this.id,
            this.activity,
            'estoque', 
            this.estoque 
        )
    }
}

module.exports = Task