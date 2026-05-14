//importado do módulo express
const express = require("express");//criando uma instância do express
const app = express(); // criando uma instância do aplicativo Express
const path = require("path"); // importando o módulo path do Node.js para trabalhar com caminhos de arquivos

//Importa o modulo do dotenv para carregar as variáveis de ambiente do arquivo .env
require('dotenv').config(); // carregando as variáveis de ambiente do arquivo .env

//Define a porta do servidor com base nas variáveis de ambiente ou usando um valor padrão
//Se der errado, o servidor irá rodar na porta 5000
const port = process.env.PORT || 5000;

//MIDDLEWARE PARA ENTENDER O JSON
app.use(express.json()); //middleware para entender o formato JSON nas requisições
app.use(express.urlencoded({ extended: true })); //middleware para entender o formato URL-encoded nas requisições

//Permite ler cookie nas requisições, necessário para o login
app.use(require('cookie-parser')()); //middleware para entender os cookies nas requisições

//CONFIGURAÇÂO DO EJS E PASTAS FRONT-END
//Define o EJS COMO ENGINE DO FRONT 
app.set('view engine', 'ejs');//definindo a pasta de views para o EJS
//aponta para o express e ejs
app.set('views', path.join(__dirname, "../client/views"));//definindo a pasta de views para o EJS
//Deica a pasta pubic acessivel ao usuario
app.use(express.static(path.join(__dirname, "../client/public"))); //definindo a pasta de arquivos estáticos para o Express
//Criação de rotas padrão para o servidor

app.get("/", (req, res) => {//definindo a rota raiz do servidor
    res.status(200).redirect("/login");//enviando uma resposta JSON com uma mensagem de boas-vindas
}); // fechando a função de callback da rota GET "/"


app.get ("/login",(req,res)=> 
    { res.render("auth/login")}) //definindo a rota para a página de login, atualmente sem implementação

app.get ("/cadastro",(req,res)=> 
    { res.render("auth/cadastro") }) //definindo a rota para a página de cadastro, atualmente sem implementação

//Importar as rotas de usuário
const usuarioRoutes = require("./routes/usuarioRoutes.js");//importando as rotas de usuário do arquivo usuarioRoutes.js

app.use("/usuarios", usuarioRoutes);//definindo a rota para as rotas de usuário, todas as rotas de usuário serão acessíveis através do caminho /usuarios


// Traz as configurações do banco
const pool = require("./config/db.js");

// Cria uma conexão teste com o banco
(async () => {
  try {
    // Se o banco de dados estiver ativo, aí sim o servidor será iniciado
    await pool.getConnection();

    console.log("Banco conectado");

    // Se o banco de dados estiver ativo, aí sim o servidor será iniciado
    app.listen(port, () => {
      console.log(`Link do servidor: http://localhost:${port}`);
      console.log(`Servidor funcionando na porta ${port}`);

    });

  } catch (erro) {

    // Se deu erro, avisa e encerra a tentativa
    console.log("Erro ao tentar conectar com o banco de dados");

    process.exit(1);
  }
})();