# Basic Authentication

## Como funciona

➡️ O cliente (ex: navegador ou app) envia uma requisição para acessar um recurso protegido.

➡️ O servidor responde com um código 401 `Unauthorized` e um cabeçalho `WWW-Authenticate` dizendo que precisa de autenticação básica.

➡️ O cliente responde com um cabeçalho `Authorization` que inclui o **nome de usuário** e a **senha** codificados em `Base64`.

Por convenção, espera-se que o header esteja assim:

```
Authorization: Basic <base64(username:password)>`
```

```bash
Authorization: Basic dXNlcjpwYXNzd29yZA==
```
> `dXNlcjpwYXNzd29yZA==` é o resultado de `user:password` convertido em Base64.

### ✅ Vantagens
- Simples implementação


### ❌ Desvantagens
- Envia credenciais a cada requisição
  - Por esse motivo, é inseguro sem HTTPS
- Por ser simples demais, não é ideal para sistemas mais complexos com permissões, expiração de sessão etc.


### 🔓 Por que Basic Auth é inseguro sem HTTPS
Quando se utiliza HTTP, tudo é transmitido em texto puro (plaintext) pela rede.

Se alguém estiver na mesma rede e usar um sniffer, é possível ver toda a requisição (URL, Cabeçalhos, corpo da requisição e o header Authorization com usuário e senha em Base64).
>‼️ Base64 não é criptografia, só codificação. Qualquer um pode decodificar facilmente.

Quando se utiliza HTTPS (HTTP sobre TLS), a comunicação é criptografada: mesmo que alguém intercepte os dados, verá só dados embaralhados.

O header Authorization ainda é enviado, mas criptografado na transmissão.

