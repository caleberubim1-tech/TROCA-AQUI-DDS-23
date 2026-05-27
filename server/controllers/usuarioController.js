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
  // CRUD
  // Criar Usuários

  renderizarCadastro: (req, res) => {
    res.render("usuarios/cadastro");
  },

  cadastrar: async (req, res) => { // async porque tem operações assíncronas dentro da função (bcrypt e model)

    try {
      // Pega as infomações das caixinhas da view, de acordo com o name delas
      const { nome, email, senha, telefone, perfil } = req.body;

      if (perfil === "administrador")
        return res
          .status(403)
          .render("erro", {
            mensagem:
              "Não é permitido criar usuários com perfil de administrador",
          });

      // Multer salva a foto da pessoa na pasta uploads/usuarios, e o nome do arquivo fica disponível em req.file.filename
      const fotoDaPessoa = req.file ? `uploads/usuarios/${req.file.filename}` : null;


      // Criptografa a senha antes de salvar no banco
      const senhaHash = await bcrypt.hash(senha, 10);

      // Chama o model passando as informações para criar o usuário
      await usuarioModel.criarUsuario(nome, email, senhaHash, telefone, fotoDaPessoa, perfil);

      // Variável para definir para onde o usuário será redirecionado após criar o novo usuário
      let redirecionadoPara = "/login";
      // Verifica se o usuário que está criando o novo usuário é um administrador, para redirecionar ele para a tela de usuários, caso contrário, redireciona para a tela de login
      if (req.cookies && req.cookies.token) {
        try {
          // lê o token dos cookies e verifica ele, usando a mesma chave secreta que foi usada para criar o token
          const decodificado = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
          if (decodificado.perfil === "administrador") {
            redirecionadoPara = "/usuarios";
          }
        }
        catch (erro) { // Se o token for inválido ou tiver expirado, ele cai aqui
          console.error("Erro ao verificar token:", erro);
        }
      }

      // Redireciona para a tela de login
      res.redirect(redirecionadoPara);

    } catch (erro) {
      console.error("Erro ao cadastrar usuário:", erro);
      res.status(500).render("erro", { mensagem: "Erro interno no servidor" });
    }
  }
}