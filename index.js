const express = require("express")
const server = express()

const produtos = [{
    id: 123,
    produto: "cafe",
    quantidade: 213,
    valorUnitario: 10,
    precoTotal: 0,
    precoVenda: 0,
    lucro: 0,
    situacao: ""
}]

// LOOP 

for (let i = 0; i < produtos.length; i++) {
    produtos[i].precoTotal = produtos[i].quantidade * produtos[i].valorUnitario
    produtos[i].precoVenda = produtos[i].valorUnitario * 1.20
    produtos[i].lucro = produtos[i].precoVenda - produtos[i].valorUnitario
    if (condicao) {
        produtos[i].situacao = "alguma coisa"
    }
}

server.listen(3333)

// http://localhost:3333