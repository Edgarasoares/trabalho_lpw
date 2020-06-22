const express = require('express');
const { response } = require('express');
const server = express()

server.use(express.json())

server.use((request, response, next) => {
    console.log('Controle de Estoque da Empresa ABC.')
    return next()
});

const produtos = []


function checarSeIdExiste(request, response, next) {
    const id = request.params.id
    const existe = produtos.filter(produto => produto.id == id)
    if (existe.length === 0) {
        return response.status(400).json({ Mensagem: 'Não existe Produto com este id.' })
    }
    return next()
}

function checarCampos(request, response, next) {
    const { id, nome_prod, quantidade_prod, valor_unidade } = request.body;
    if ((id === undefined || id === '') || (nome_prod === undefined || nome_prod == '') || (quantidade_prod === undefined || quantidade_prod === '') || (valor_unidade === undefined || valor_unidade === '')) {
        return response.status(400).json({ Mensagem: 'O campo id do produto ou nome do produto ou quantidade ou valor unitario ou complemento não existe no corpo da requisição' })
    }
    return next()
}

function calcularProdutos(produto) {
    for (let i = 0; i < produto.length; i++) {
        produto[i].preco_Total = produto[i].quantidade_prod * produto[i].valor_unidade
        produto[i].preco_de_venda = produto[i].valor_unidade * 1.2
        produto[i].lucro = produto[i].preco_de_venda - produto[i].valor_unidade
        if (produto[i].quantidade_prod < 50) {
            produto[i].situacao = 'A situação do produto é estável'
        } else if (produto[i].quantidade_prod >= 50 && produto[i].quantidade_prod < 100) {
            produto[i].situacao = 'A situação do produto é boa'
        } else if (produto[i].quantidade_prod >= 100) {
            produto[i].situacao = 'A situação do produto é excelente'
        }
    }
}

server.get('/produtos', (request, response) => {
    calcularProdutos(produtos)
    return response.json(produtos)
})

server.get('/produtos/:id', checarSeIdExiste, (request, response) => {
    const id = request.params.id
    const produtoFiltrado = produtos.find(produto => produto.id == id)
    return response.json(produtoFiltrado)
});

server.post('/produtos', checarCampos, (request, response) => {
    produtos.push(request.body)
    const ultimoProduto = produtos[produtos.length - 1]
    calcularProdutos(produtos)
    return response.json(ultimoProduto)
})

server.put('/produtos', checarCampos, (request, response) => {
    const id = request.body.id
    let indice = 0
    let produtoFiltrado = produtos.filter((produto, index) => {
        if (produto.id === id) {
            indice = index
            return produto.id === id
        }
    })

    if (produtoFiltrado.length === 0) {
        return response.status(400).json({ Mensagem: 'Não existe produto com este id' })
    }
    produtos[indice] = request.body
    return response.json(produtos)
})


server.delete('/produtos', (request, response) => {
    const id = request.body.id
    const produtoFiltrado = produtos.find((produto, index) => {
        if (produto.id === id) {
            console.log(produto)
            produtos.splice(index, 1)
            return produto.id === id
        }
    })
    if (!produtoFiltrado) {
        return response.status(400).json({ Mensagem: 'Não existe produto com este id' })
    }

    return response.json(produtos)
})

server.post('/produtos/:id/complemento', checarSeIdExiste, (request, response) => {
    const complementos = request.body.complemento
    const id = request.params.id;
    for (let i = 0; i < produtos.length; i++) {
        if (produtos[i].id === Number(id)) {
            console.log(typeof produtos[i].complemento)
            produtos[i].complemento.push(complementos)
        }
    }
    return response.json(produtos)
})

server.listen(3333);