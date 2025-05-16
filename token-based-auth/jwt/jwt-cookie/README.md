## ⚙️ Como executar esse exemplo

- Clone este repositório
-  Clone o arquivo `env.example` para um arquivo `.env`
    - Preencha a `SECRET_KEY` com a chave que será utilizada para assinar o `jwt`.
    - Preencha as credenciais válidas (email e senha) em `AUTH_EMAIL` e `AUTH_PASSWORD`
<br>

- Acesse a pasta `jwt-cookie/backend` e execute:
  - `npm install` para instalar as dependências necessárias (express, cors, doteenv, cookie-parser)
  - `npm run dev` para inicializar o backend
<br>

- Abra o arquivo `index.html` no navegador (via Live Server no VSCode em http://localhost:5500)
> Por que usar Live Server e não abrir o arquivo diretamente? <br> A política de segurança dos navegadores bloqueia o envio de cookies em requisições entre origens diferentes ou quando o frontend é aberto diretamente via file://. Usar um servidor local (Live Server) permite que o frontend rode em http://localhost:5500 e consiga enviar e receber cookies de autenticação corretamente, evitando problemas com CORS e cookies.
- Caso você esteja rodando o frontend em uma porta ou domínio diferente do http://localhost:5500, lembre-se de atualizar a configuração do origin no server.js, na configuração do CORS, para permitir o domínio correto. Exemplo:
```js
app.use(cors({
  origin: 'http://localhost:5500', // Altere para o domínio/porta do seu frontend
  credentials: true
}));
```
- Use as credenciais que você definiu no `.env` para realizar o login. O token JWT será enviado pelo backend e armazenado em um cookie HTTP-only.
- Clique em "Access" abaixo de "Protected resource" para bater na rota que requer autenticação. O cookie será enviado automaticamente junto à requisição para autenticação.
- Use o botão Logout para limpar o cookie e sair da sessão.

<br>
<br>

> ⚠️ Os tokens estão configurados com a duração de 60 segundos apenas. Após isso é necessário fazer o login novamente.

> 🔐 Como o token está armazenado em cookie HttpOnly, ele não fica acessível via JavaScript no frontend, aumentando a segurança contra ataques XSS.

> ✋ Este projeto é simples e serve para estudo e aprendizado da autenticação JWT com cookies HTTP-only. O frontend é puro HTML + JS sem frameworks.