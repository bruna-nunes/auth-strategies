# Session-Based Authentication
## Como funciona

➡️ O cliente (ex: navegador ou app) envia as credenciais (email e senha) em uma requisição de login para o servidor.

➡️ O servidor responde com um código 422 `Unprocessable Entity` ou 401 `Unauthorized` se as credenciais forem inválidas

➡️ O servidor verifica as credenciais. Se forem válidas, cria uma sessão associada ao usuário e envia um cookie de sessão de volta ao cliente, respondendo com um código 200 `Ok`.

➡️ O cliente salva o cookie automaticamente.

➡️ A cada nova requisição, o cliente envia esse cookie, permitindo que o servidor identifique o usuário sem precisar revalidar as credenciais.

➡️ O servidor verifica se há uma sessão ativa e permite ou nega o acesso ao recurso protegido.


### 🔐 Exemplo do cookie (enviado automaticamente pelo navegador):
```https
Cookie: session_based_auth_value=s%3ASomeSessionId.abc123...
```

### ✅ Vantagens
- Sem necessidade de enviar credenciais a cada requisição
- Cookies são enviados automaticamente
- Gerenciamento automático de sessão pelo servidor

### ❌ Desvantagens
- Requer persistência da sessão se o servidor reiniciar (ex: com banco ou store de sessão)
- Pode ser vulnerável a ataques CSRF, se não bem configurado
- A proteção real só acontece em produção com HTTPS (`cookie.secure: true`)

### 🔒 Segurança com cookies
- `httpOnly`: o cookie não é acessível via JavaScript → evita roubo via XSS
- `secure`: o cookie só será enviado via HTTPS → protege a transmissão
- `sameSite: 'lax'`: restringe o envio do cookie em requisições cross-site

> ⚠️ O atributo secure: false foi usado neste exemplo apenas para ambiente local. Em produção, deve ser true para garantir segurança.


> ### 💣 O que é CSRF?
CSRF (Cross-Site Request Forgery), ou Falsificação de requisição entre sites.

É um ataque onde o navegador de um usuário faz uma requisição maliciosa para um site em que ele já está autenticado, sem ele perceber.
Se o usuário acessar um site malicioso enquanto está logado/autenticado no sistema, o site pode enviar uma requisição para o servidor como se fosse o usuário, e o cookie será enviado junto, o que autenticará a solicitação como se fosse o próprio usuário.

Com o same-site configurado, o navegador só envia esse cookie se o site que fez a requisição for o mesmo da origem do cookie, agindo como proteção.

Também é possível enviar na requisição um CSRF token: um token (valor único gerado pelo servidor), que valida a requisição.

Também é possível armazenar tokens fora de cookies, em localsStorage ou sessionstorage, mas isso deixa vulnerável a ataques XSS

> ### 💥 O que é um ataque XSS?
XSS (Cross-Site Scripting) é quando há injeção de JavaScript malicioso em uma página da aplicação, que é executado pelo navegador do usuário. Ele pode acessar valores do localStorage e sessionStorage por exemplo; recuperar o token se estiver armazenado lá, e enviar na requisição, que será válida.

Para se proteger de ataques XXS, escapar e sanitizar todas as entradas de texto e dados de usuário é essencial.


## ⚙️ Como executar esse exemplo

- Clone este repositório
-  Clone o arquivo `env.example` para um arquivo `.env`
    - Preencha a `SECRET_KEY` com a chave que será utilizada para assinar o ID da session.
    - Preencha as credenciais válidas (email e senha) em `AUTH_EMAIL` e `AUTH_PASSWORD`
<br>

- Acesse a pasta `session-based-auth/backend` e execute:
  - `npm install` para instalar as dependências necessárias (express, express-session, cors, cookie-parser, dotenv)
  - `npm run dev` para inicializar o backend
<br>

- Abra o arquivo `index.html` em um navegador de sua escolha (o projeto é bem simples!)
- Use as credenciais que preencheu no `.env` para logar e gerar uma session que será salva nos `Cookies` do seu navegador
    - Com as credenciais corretas, uma mensagem de login com sucesso será mostrada
- Clique em "Access" abaixo de "Protected resource" para bater na rota que requer autenticação. A session será enviada e você acessará a rota via `Session Based Authentication`
- Faça logout clicando em “Sair”

> ✋ O projeto é bem simples e a título de simplificação e estudos, o frontend foi feito somente com HTML puro, sem necessidade de frameworks.