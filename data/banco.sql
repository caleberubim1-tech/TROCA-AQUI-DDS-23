 -- Deleta o banco de dados
DROP DATABASE sistema_trocas;

 -- Cria o banco de dados sistema_trocas
CREATE DATABASE IF NOT EXISTS sistema_trocas;

-- UTILIZA BANCO CRIADO PARA CRIAÇÃO DAS TABELAS
USE sistema_trocas;
-- Deleta as tabelas antigas caso exitam
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS interesses;

-- Tabela usuarios 
CREATE TABLE usuarios(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR (100),
    email VARCHAR (100),
    senha VARCHAR (255),
    telefone VARCHAR (20),
    foto VARCHAR (255),
    perfil ENUM ('administrador' , 'ofertante' , 'interessado')
    );
    -- ENUM limita para as opcões que estão entre os parenteses 
    
    -- Tabela produtos
    CREATE TABLE produtos(
		id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR (100),
        descricao TEXT,
        preco DECIMAL (10,2),
        condicao ENUM ('novo' , 'usado') DEFAULT 'usado',
        foto VARCHAR (255),
        is_publico BOOLEAN DEFAULT TRUE,
        status_troca BOOLEAN DEFAULT FALSE,
        id_usuario INT,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
    );
    
    -- Tabela interesses
    CREATE TABLE interesses(
		id INT AUTO_INCREMENT PRIMARY KEY,
        id_produto INT,
        id_interessado INT,
        data_interesse DATETIME DEFAULT CURRENT_TIMESTAMP,
        -- REFERENCIAS DE CHAVES ESTRANGEIRAS
        FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE CASCADE,
		FOREIGN KEY (id_interessado) REFERENCES usuarios(id) ON DELETE CASCADE
    );
    
    -- INSERTS DE USUARIOS
    -- ADM
    INSERT INTO usuarios(nome, email, senha, telefone, perfil)
    VALUES('Admin Calebe', 'crubim@gmail.com', '$2a$10$bnVggkOhZQJP9ipjXWe01eztcGAB/T3ptXbA36MzwiAyAn6EkYaca' , '40028922' , 'administrador');
    
    
    -- OFERTANTE
     INSERT INTO usuarios(nome, email, senha, telefone, perfil)
    VALUES('George Ofertante', 'ofertante@gmail.com', '$2a$10$bnVggkOhZQJP9ipjXWe01eztcGAB/T3ptXbA36MzwiAyAn6EkYaca' , '40028922' , 'ofertante');
    
    -- INTERESSADO
     INSERT INTO usuarios(nome, email, senha, telefone, perfil)
    VALUES('Joao Interessado', 'interessado@gmail.com', '$2a$10$bnVggkOhZQJP9ipjXWe01eztcGAB/T3ptXbA36MzwiAyAn6EkYaca' , '40028922' , 'interessado');