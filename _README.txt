Instruções para compilar e executar a aplicação localmente

Requisitos mínimos

- Node.js v18+ e `npm` instalado.
- instalação de MySQL ou base de dados compatível (credenciais de acesso).
- Docker instalado

1. Configuração base de dados:
	2.1 Base de dados local (autenticação):
    		Na diretoria "DataBase\autenticacao-db executar os scripts "AuthDatabaseSetup" e "AuthDatabasePopulateMockData" nesta ordem.
	2.2 Base de dados académica (simulada):
		Abrir pasta "DataBase\sistema-academico-db" no terminal,
		Executar o comando "docker compose up -d".

2. Criar ficheiro com Variáveis essenciais (Diretoria: Code/.env)
	AUTH_DB_HOST='localhost'
	AUTH_DB_NAME='SysAuth'
	AUTH_DB_USER= utilizador-local-sql
	AUTH_DB_PASSWORD= senha local sql

	INST_DB_HOST='localhost'
	INST_DB_NAME='sistemaacademico'
	INST_DB_USER='admin'
	INST_DB_PASSWORD='password123'

	NODE_ENV='local'

3. Configuração do Ambiente e arranque do servidor:
	cd Code
	npm install
	npx ts-node src/app.ts

4. Conectar através do endereço "http://localhost:3000"
	
