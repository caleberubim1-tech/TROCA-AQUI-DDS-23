//importado do módulo express
const express = require("express");//criando uma instância do express
const router = express.Router();//criando um roteador para as rotas de usuário

//Importar o controller do usuário
const usuarioController = require("../controllers/usuarioController.js");//importando o controller do usuário para lidar com as requisições relacionadas aos usuários

//Declaração das rotas do usuário MULTER
const upload = require("../config/multer.js");//importando a configuração do multer para lidar com o upload de arquivos, nesse caso a foto do usuário


//Importando o middleware de autenticação
const { verificarAutenticacao, somenteAdmin} = require("../middlewares/authMiddleware.js");//importando o middleware de autenticação para proteger as rotas que exigem autenticação e autorização

//Rotas publicas

//Envia os dados de login para o controller do usuário, para validar as credenciais e gerar o token de acesso
router.post("/login", usuarioController.login);//definindo a rota para login, usando o método POST e chamando a função de login do controller do usuário

//Rotas de saída
router.post("/logout", usuarioController.logout);//definindo a rota para logout, usando o método POST e chamando a função de logout do controller do usuário

//Rota de cadastro de usuario
//Importando o multer para lidar com o upload de arquivos
router.post('/cadastrar', upload.single('foto'), usuarioController.cadastrar);//definindo a rota para cadastro de usuário, usando o método POST e chamando a função de cadastro do controller do usuário, além de usar o middleware para lidar com o upload da foto do usuário

//Rotas privadas
//Daqui pra baixo, só executa se tiver acesso pra tal
router.use(verificarAutenticacao);//aplicando o middleware de autenticação para todas as rotas abaixo, garantindo que apenas usuários autenticados possam acessá-las
router.use(somenteAdmin);//aplicando o middleware de autorização para todas as rotas abaixo, garantindo que apenas administradores possam acessá-las


//Obtém a lista de usuários
router.get("/", (req, res) => {//definindo a rota para obter todos os usuários
    res.status(200).render("usuarios/listar");//enviando uma resposta JSON com uma mensagem
});

//Retornar a página de cadastro de usuário
router.get("/cadastro", (req, res) => {//definindo a rota para obter a página de cadastro de usuário
    res.status(200).render("usuarios/cadastrar");//enviando uma resposta JSON com uma mensagem
});

module.exports = router;//exportando o roteador para ser usado em outros arquivos