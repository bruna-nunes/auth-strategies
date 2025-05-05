# Token Based Authentication

## Como funciona

➡️ O cliente (ex: navegador ou app) envia uma requisição para obter um token de acesso (enviando suas credenciais no body)

➡️ O servidor responde com um código 422 `Unprocessable Entity` ou 401 `Unauthorized` se as credenciais forem inválidas

➡️ O servidor responde com um código 200 `Ok` se as credenciais forem válidas e um token no body ou header.

➡️ O cliente guarda esse token localmente. O local pode variar: localstorage, cookies (sendo esse o mais recomendado)

➡️ O cliente manda o token em todas as requisições seguintes. Se o token for válido, o servidor retorna um código 200 `Ok` + response desejada, senão, retorna um 401 `Unauthorized`

Por convenção, espera-se que o header esteja assim:

```http
Authorization: Bearer <token>`
```

> ✏️  "Bearer" vem de _bearer of the token_ — quem porta o token tem acesso. <br> É muito importante proteger esse token, porque se alguém interceptar ou roubar, ela pode usá-lo como se fosse o usuário.

Tokens podem ser do tipo `opaque` (string aleatória; sem nenhum significado, e só pode ser verificado pelo servidor de autorização) ou `self-contained` (contém ou carregam consigo informações do usuário)

## Exemplos de estratégias Token Based
- SWT (Simple Web Tokens)
- JWT (JSON Web Tokens) - uma das mais utilizadas
- OAuth (Open Authorization)
- SAML (Security Assertions Markup Language)
- OpenID

## Cuidados a serem tomados ao utilizar estratégias baseadas em tokens

### ✅ Usar sempre HTTPS

Sem HTTPS, o token pode ser interceptado por sniffers (programas que "farejam" o tráfego da rede).  Com HTTPS, todo o tráfego (incluindo o token no header) é criptografado

### ✅ Usar tokens com expiração curta

Evita que um token roubado fique válido por muito tempo.

Em JWT por exemplo, isso é o `exp` (expiration).

Para opaque tokens, o servidor pode armazenar data de validade.

> Exemplo: tokens que duram só 15 minutos, e utiliza-se um refresh token para renovar.

### ✅ Guardar o token em lugar seguro (frontend)

Evitar guardar em:
- `localStorage` e `sessionStorage`: acessível via JavaScript — exposto a XSS.

Dar preferência para:
- Cookies com `HttpOnly` e `Secure` (não acessíveis por JS, enviados só via HTTPS).

### ✅ Usar refresh tokens separados
Usar um token de acesso curto (ex: 15min) e um refresh token (armazenado com `HttpOnly`) para pegar novos access tokens. Se o token for roubado, expirará logo.

### ✅ Proteger contra ataques CSRF (se usar cookies)
Se o token estiver armazenado em cookie, adicionar proteção contra Cross-Site Request Forgery:

> Usar SameSite: Strict ou Lax no cookie.

> Verificar um CSRF token no corpo da requisição (se necessário).

### ✅ Monitorar e gerenciar ativamente

- Bloquear após X tentativas inválidas.
- Alterar os tokens periodicamente.
- Nunca aceitar um token que não pode ser verificado (tokens podem ser forjados)

> ### 💣 O que é CSRF?
CSRF (Cross-Site Request Forgery), ou Falsificação de requisição entre sites.

É um ataque onde o navegador de um usuário faz uma requisição maliciosa para um site em que ele já está autenticado, sem ele perceber.
Se o usuário acessar um site malicioso enquanto está logado/autenticado no sistema, o site pode enviar uma requisição para o servidor como se fosse o usuário, e o cookie será enviado junto, o que autenticará a solicitação como se fosse o próprio usuário.

Com o same-site configurado, o navegador só envia esse cookie se o site que fez a requisição for o mesmo da origem do cookie, agindo como proteção.

Também é possível enviar na requisição um CSRF token: um token (valor único gerado pelo servidor), que valida a requisição.

Também é possível armazenar tokens fora de cookies, em localsStorage ou sessionstorage, mas isso deixa vulnerável a ataques XSS

> ### 💥 O que é um ataque XSS?
XSS (Cross-Site Scripting) é quando há injeção de JavaScript malicioso em uma página da aplicação, que é executado pelo navegador do usuário. Ele pode acessar valores do localStorage e sessionStorage por exemplo; recuperar o token se estiver armazenado lá, e enviar na requisição, que será válida.

Para se proteger de ataques XXS, escapar e sanitizar todas as entradas de texto e dados de usuário é essencial


### ✅ Vantagens
- O servidor não precisa guardar sessões
- Reutilizável: Um mesmo token pode ser usado em apps web e mobile


### ❌ Desvantagens
- Tokens podem ficar expostos no frontend, requer mais cuidado com segurança
- A revogação de um token é complicada já que não fica no servidor, sendo preciso utilizar blacklist ou abordagem semelhante

