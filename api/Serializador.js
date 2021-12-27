const ValorNaoSuportado = require('./erros/ValorNaoSuportado')
const jsontoxml = require('jsontoxml')

class Serializador {
    json (dados) {
      return JSON.stringify(dados)
    } 

    xml (dados) {
        let tag = this.tagSingular

        if(Array.isArray(dados)) {
            tag = this.tagPlural
            dados = dados.map((item) => {
                return {
                    [this.tagSingular]: item
                }
            })
        }

        return jsontoxml({ [tag]: dados})
    }


    serializar (dados) {
        dados = this.filtrar(dados)
        console.log(dados)
        if (this.contentType === 'application/json') {
            return this.json(dados)
        }

        if (this.contentType === 'application/xml') {
            return this.xml(dados)
        }

        throw new ValorNaoSuportado(this.contentType)
    }

    filtrarObjeto (dados) {
        const novoObjeto = {}
        
        this.camposPublicos.forEach((campo) => {
            if (dados.hasOwnProperty(campo)) {
                novoObjeto[campo] = dados[campo]
            }
        })

        return novoObjeto

    }

    filtrar (dados) {
        if (Array.isArray(dados)) {
            dados = dados.map(item => {
                return this.filtrarObjeto(item)
            })
        } else  {
            dados = this.filtrarObjeto(dados)
        }

        return dados
    }

}

class SerializadorActivity extends Serializador {
    constructor (contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = [
            'id',
            'categoria'
        ].concat(camposExtras || [])
        this.tagSingular = 'activity'
        this.tagPlural = 'activity'
    }
}

class SerializadorTask extends Serializador {
    constructor (contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = [
            'id',
            'titulo'
        ].concat (camposExtras || [])
        this.tagSingular =  'task'
        this.tagPlural = ' tasks'
    }
}

class SerializadorErro extends Serializador {
    constructor (contentType, camposExtras) {
        super()
        this.contentType = contentType
        this.camposPublicos = [
            'id',
            'mensagem'
        ].concat(camposExtras || [])
        this.tagSingular = 'erro'
        this.tagPlural = 'erros'
    }
}

module.exports = {
    Serializador: Serializador,
    SerializadorActivity: SerializadorActivity,
    SerializadorErro: SerializadorErro,
    SerializadorTasks: SerializadorTask,
    formatosAceitos: ['application/json', 'application/xml']
}