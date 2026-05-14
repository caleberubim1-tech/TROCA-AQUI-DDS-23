//Importando as dependências necessárias
const db = require("../config/db.js"); 

module.exports = {
    //Busca o usuário na tabela, com o email fornecido
    buscarPorEmail: async (email) => {
        //Query SQL para buscar o usuário pelo email
        const query = "SELECT * FROM usuarios WHERE email = ?";
        //Guarda o resultado da consula na variavel resultado
        const [linhas] = await db.execute(query, [email]);
        //Se o resultado for vazio, retorna null
        return linhas[0]
    },
    //CRUD
    //CREATE
    criarUsuario: async (nome, email, senha, telefone, foto, perfil) =>{
        //Query pra fazer a consulta no banco
        const query = "INSERT INTO usuarios (nome, email, senha, telefone, foto, perfil) VALUES (?, ?, ?, ?, ?, ?)";
        //Guarda o resultado da consulta na variavel resultado
        const [resultado] = await db.execute(query, [nome, email, senha, telefone, foto, perfil]);
        //Retorna pro controller o resultado, nessa caso o usuários criado
        return resultado.insertId;
    }
}