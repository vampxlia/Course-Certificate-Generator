# Sistema para Geração Automática de Certificados — Instruções

Instruções para executar a aplicação localmente e testar funcionalidades básicas (login, gerar certificado, verificar ficheiro em `output/`).

Requisitos mínimos

- Node.js v18+ e `npm` instalado.
- MySQL ou base de dados compatível (credenciais de acesso).

Passos rápidos (modo de produção local)

```bash
cd Code
npm install
npm run build
# executar servidor
node dist/app.js
```

Modo de desenvolvimento (rápido)

```bash
cd Code
npm install
npx ts-node src/app.ts
```s

Variáveis essenciais (arquivo `Code/.env`)

```text
PORT=3000
DB_HOST=127.0.0.1
DB_USER=user
DB_PASSWORD=senha
DB_NAME=nome
```

Testes básicos

- Aceder a `http://localhost:3000` (ou `https://` se configurar proxy/SSL).
- Fazer login com um utilizador de teste (ver `DataBase/AuthDatabasePopulateMockData.sql`).
- Ir a Templates → criar/usar um template de exemplo.
- Gerar um certificado e verificar o ficheiro PDF/resultado em `Code/output/`.

