//Impora o módulo mysql para conectar ao banco de dados
const mysql = require("mysql2/promise"); // importando o módulo mysql para se conectar ao banco de dados MySQL

//Cria uma pool de conexão , várias conexões de uma vez
const pool = mysql.createPool({ // criando um pool de conexões com o banco de dados
    host: process.env.DB_HOST, // Onde o banco está hospedado
    user: process.env.DB_USER, // O usuário que fará a conexão 
    password: process.env.DB_PASSWORD, // A senha do usuario 
    database: process.env.DB_NAME, // O nome do banco de dados ao qual deseja conectar
    //Se todas conexões estiverem ocupadas, deica o usuário esperando por uma conexão disponível, em vez de lançar um erro imediatamente se o pool estiver cheio
    waitForConnections: true,
    // Quantidade máxima de conexões ao mesmo tempo
    connectionLimit: 10,
    //Máximo de lista de espera
    queueLimit: 0 // 0 = ilimitado
});

module.exports = pool; // exportando o pool de conexões para ser usado em outros arquivos do projeto
