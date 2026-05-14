//importado do módulo express
const express = require("express");//criando uma instância do express

const router = express.Router();//criando um roteador para as rotas de usuário

//Importar o controller do usuário
const usuarioController = require("../controllers/usuarioController.js");//importando o controller do usuário para lidar com as requisições relacionadas aos usuários
//Declaração das rotas do usuário

//Rotas publicas
//Envia os dados de login para o controller do usuário, para validar as credenciais e gerar o token de acesso
router.post("/login", usuarioController.login);//definindo a rota para login, usando o método POST e chamando a função de login do controller do usuário

//Roas de saída
router.post("/logout", usuarioController.logout);//definindo a rota para logout, usando o método POST e chamando a função de logout do controller do usuário

//Rotas privadas



//Obtém a lista de usuários
router.get("/", (req, res) => {//definindo a rota para obter todos os usuários
    res.json({ "mensagem": "Lista de usuários" });//enviando uma resposta JSON com uma mensagem
});

//Retornar a página de cadastro de usuário
router.get("/cadastro", (req, res) => {//definindo a rota para obter a página de cadastro de usuário
    res.json({ "mensagem": "Página de cadastro de usuário" });//enviando uma resposta JSON com uma mensagem
});

module.exports = router;//exportando o roteador para ser usado em outros arquivos