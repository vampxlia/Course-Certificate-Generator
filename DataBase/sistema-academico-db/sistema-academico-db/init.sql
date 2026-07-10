
-- ============================================================
-- SISTEMA ACADÉMICO
-- Script de criação e povoamento da Base de Dados
-- ============================================================

-- ------------------------------------------------------------
-- Eliminar a Base de Dados, caso já exista
-- ------------------------------------------------------------

DROP DATABASE IF EXISTS sistemaacademico;

-- ------------------------------------------------------------
-- Criar a Base de Dados
-- ------------------------------------------------------------

CREATE DATABASE sistemaacademico
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sistemaacademico;

-- ------------------------------------------------------------
-- Criar o utilizador da aplicação
-- ------------------------------------------------------------

CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'password123';

GRANT ALL PRIVILEGES
ON sistemaacademico.*
TO 'admin'@'%';

FLUSH PRIVILEGES;

-- ============================================================
-- TABELA: CURSOS
-- ============================================================

CREATE TABLE cursos
(
    codigo_curso SMALLINT UNSIGNED NOT NULL,
    edicao_curso SMALLINT UNSIGNED NOT NULL,
    nome_curso VARCHAR(100) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,

    CONSTRAINT pk_cursos
        PRIMARY KEY (codigo_curso, edicao_curso),
        
    CONSTRAINT chk_codigo_curso
        CHECK (codigo_curso BETWEEN 1000 AND 9999),

    CONSTRAINT chk_edicao_curso
        CHECK (edicao_curso BETWEEN 2000 AND 2999),

    CONSTRAINT chk_datas
        CHECK (data_fim >= data_inicio)
);

-- ============================================================
-- TABELA: ALUNOS
-- ============================================================

CREATE TABLE alunos
(
    codigo_aluno INT UNSIGNED NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    codigo_curso SMALLINT UNSIGNED NOT NULL,
    edicao_curso SMALLINT UNSIGNED NOT NULL,

    CONSTRAINT pk_alunos
        PRIMARY KEY (codigo_aluno),

    CONSTRAINT uk_aluno_curso
        UNIQUE (codigo_aluno, codigo_curso, edicao_curso),

    CONSTRAINT fk_alunos_cursos
        FOREIGN KEY (codigo_curso, edicao_curso)
        REFERENCES cursos (codigo_curso, edicao_curso)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_codigo_aluno
        CHECK (codigo_aluno BETWEEN 10000 AND 99999),

    CONSTRAINT uk_alunos_email
        UNIQUE (email)
);

-- ============================================================
-- TABELA: AVALIACOES
-- ============================================================

CREATE TABLE avaliacoes
(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nota TINYINT UNSIGNED NOT NULL,
    codigo_aluno INT UNSIGNED NOT NULL,
    codigo_curso SMALLINT UNSIGNED NOT NULL,
    edicao_curso SMALLINT UNSIGNED NOT NULL,

    CONSTRAINT pk_avaliacoes
        PRIMARY KEY (id),

    CONSTRAINT chk_nota
        CHECK (nota >= 0 AND nota <= 20),

    CONSTRAINT fk_avaliacao_aluno_curso
        FOREIGN KEY (
            codigo_aluno,
            codigo_curso,
            edicao_curso
        )
        REFERENCES alunos (
            codigo_aluno,
            codigo_curso,
            edicao_curso
        )
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ============================================================
-- POPULAR AS TABELAS
-- ============================================================

INSERT INTO cursos
VALUES
(1001, 2026, 'Programação Web',          '2026-09-15', '2027-06-30'),
(1002, 2026, 'Bases de Dados',           '2026-09-15', '2027-06-30'),
(1003, 2026, 'Redes de Computadores',    '2026-09-15', '2027-06-30'),
(1004, 2026, 'Sistemas Operativos', '2026-09-15', '2027-06-30'),
(1005, 2026, 'Programação Orientada a Objetos', '2026-09-15', '2027-06-30'),
(1006, 2026, 'Engenharia de Software', '2026-09-15', '2027-06-30'),
(1007, 2026, 'Segurança Informática', '2026-09-15', '2027-06-30'),
(1008, 2026, 'Inteligência Artificial', '2026-09-15', '2027-06-30'),
(1009, 2026, 'Desenvolvimento Mobile', '2026-09-15', '2027-06-30'),
(1010, 2026, 'Computação em Nuvem', '2026-09-15', '2027-06-30');


INSERT INTO alunos
VALUES
(10001, 'Ana Silva',      'ana.silva@escola.pt',      1001, 2026),
(10002, 'Bruno Costa',    'bruno.costa@escola.pt',    1001, 2026),
(10003, 'Carla Martins',  'carla.martins@escola.pt',  1002, 2026),
(10004, 'Daniel Sousa',   'daniel.sousa@escola.pt',   1003, 2026),
(10005, 'Eva Ferreira',   'eva.ferreira@escola.pt',   1002, 2026),
(10006,'Fábio Pereira','fabio.pereira@escola.pt',1004,2026),
(10007,'Gabriela Lopes','gabriela.lopes@escola.pt',1004,2026),
(10008,'Hugo Almeida','hugo.almeida@escola.pt',1005,2026),
(10009,'Inês Cardoso','ines.cardoso@escola.pt',1006,2026),
(10010,'João Rodrigues','joao.rodrigues@escola.pt',1007,2026),
(10011,'Miguel Santos','miguel.santos@escola.pt',1008,2026),
(10012,'Sofia Ribeiro','sofia.ribeiro@escola.pt',1008,2026),
(10013,'Tiago Neves','tiago.neves@escola.pt',1009,2026),
(10014,'Carolina Mendes','carolina.mendes@escola.pt',1010,2026),
(10015,'Rita Gomes','rita.gomes@escola.pt',1005,2026),
(10016,'Pedro Martins','pedro.martins@escola.pt',1005,2026),
(10017,'Leonor Alves','leonor.alves@escola.pt',1006,2026),
(10018,'André Rocha','andre.rocha@escola.pt',1007,2026),
(10019,'Beatriz Costa','beatriz.costa@escola.pt',1009,2026),
(10020,'Gonçalo Silva','goncalo.silva@escola.pt',1004,2026);


INSERT INTO avaliacoes
(nota, codigo_aluno, codigo_curso, edicao_curso)
VALUES
(16.0, 10001, 1001, 2026),
(18.5, 10002, 1001, 2026),
(14.0, 10003, 1002, 2026),
(17.5, 10004, 1003, 2026),
(19.0, 10005, 1002, 2026),
(15.5, 10001, 1001, 2026),
(13.0, 10003, 1002, 2026),
(18,10006,1004,2026),
(16,10006,1004,2026),
(15,10007,1004,2026),
(20,10008,1005,2026),
(13,10009,1006,2026),
(17,10010,1007,2026),
(3, 10011, 1008, 2026),
(5, 10012, 1008, 2026),
(7, 10013, 1009, 2026),
(4, 10014, 1010, 2026),
(2, 10015, 1005, 2026),
(6, 10016, 1005, 2026),
(9, 10017, 1006, 2026),
(10, 10018, 1007, 2026),
(11, 10019, 1009, 2026),
(12, 10020, 1004, 2026),
(13, 10011, 1008, 2026),
(14, 10012, 1008, 2026),
(15, 10013, 1009, 2026),
(16, 10014, 1010, 2026),
(17, 10015, 1005, 2026),
(18, 10016, 1005, 2026),
(19, 10017, 1006, 2026),
(20, 10018, 1007, 2026);
