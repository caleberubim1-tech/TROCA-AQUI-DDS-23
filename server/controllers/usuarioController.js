//Importacao do model 
const usuarioModel = require('../models/usuarioModel.js');
//importar pacotes
//para criptografar a senha do usuário
const bcrypt = require('bcrypt'); //importando o bcrypt para criptografar a senha do usuário
//para lidar con cookies
const jwt = require('jsonwebtoken'); //importando o jsonwebtoken para lidar com tokens de autenticação

module.exports = {
    //FUNÇÕES DE LOGIN
    login: async (req, res) => {
        try {
            //Pega as informações das caixinhas da view, de acordo com o name delas
            const { email, senha } = req.body; //pegando o email e a senha do corpo da requisição

            //Executa a funçao de busca no model
            const usuario = await usuarioModel.buscarPorEmail(email); //buscando o usuário pelo email
            //Se nao encontrar o usuário, retorna uma mensagem de erro
            if (!usuario) {
                return res.status(404).render('error', { messagem: 'Credenciais inválidas' });
            }
            //compara a senha fornecida com a senha armazenada no banco de dados
            const senhaValida = await bcrypt.compare(senha, usuario.senha); //comparando a senha fornecida com a senha armazenada no banco de dados
            if (!senhaValida) {
                return res.status(404).render('error', { messagem: 'Credenciais inválidas' });
            }
            //Gera o token de acesso , contendo o perfil
            const token = jwt.sign(
                { id: usuario.id, perfil: usuario.perfil, nome: usuario.nome }, //payload do token, contendo o id e o perfil do usuário
                process.env.JWT_SECRET, //chave secreta para assinar o token
                { expiresIn: '2h' } //tempo de expiração do token
            );

            //Guarda o token em um cookie, para ser usado nas próximas requisições
            res.cookie('token', token, { httpOnly: true }); //guardando o token em um cookie, para ser usado nas próximas requisições

            //Redireciona o usuário para a página inicial, ou para a página de acordo com o perfil
            if (usuario.perfil === 'administrador') return res.redirect('/usuarios'); //redirecionando o usuário para a página de administrador
            if (usuario.perfil === 'ofertante') return res.redirect('/produtos/meus-produtos'); //redirecionando o usuário para a página inicial
            if (usuario.perfil === 'interessado') return res.redirect('/produtos/vitrine'); //redirecionando o usuário para a página de moderador
        }
        catch (error) {
            res.status(500).render('error', { messagem: 'Erro interno do servidor' });

        }
    },
    logout: (req, res) => {
        //Limpa o token dos cookies, efetivando o logout do usuário
        res.clearCookie('token'); //limpando o token dos cookies, efetivando o logout do usuário
        //Volta para a página de login
        res.redirect('/login'); //redirecionando o usuário para a página de login
    },



};