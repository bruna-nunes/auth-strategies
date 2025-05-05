# Json Web Tokens
Um tipo de estratégia de autenticação Token Based

## Como funciona

- É auto-contido (isso é, contém dados do usuário codificados em sua composição)
    - É composto por três partes: cabeçalho, dados (payload) e assinatura, elas são separadas por "." <br> Ex. `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoxLCJpYXQiOjE2NDk1MzI4ODMsImV4cCI6MTY0OTUzNjQ4M30.o2AyCJiUkK3iCdbXto0xP6MF97KlyeNHPXw_mMdIQcg`
- É assinado com uma chave secreta para evitar alterações.
    - O token não é "criptografado", e sim "assinado". Somente com o secret a assinatura pode ser validada.
- As "secrets" (`ACCESS_SECRET`, `REFRESH_SECRET`) são chaves secretas usadas para assinar e verificar tokens JWT.

> Essa assinatura serve pra garantir que ninguém consiga alterar o conteúdo do token sem que a assinatura fique inválida.

### 📁 Onde guardar essas secrets?
Nunca deixar a secret exposta no código-fonte. Usar .env ou semelhantes.

### ✅ Como gerar secrets?
As secrets são geradas no momento do desenvolvimento, por conta própria. São como senhas secretas que só o servidor conhece.
As secrets são geradas e guardadas do seu lado do backend, e só o código deve ter acesso a elas. São usadas para:
- Assinar tokens (quando cria com `jwt.sign(...)`)
- Verificar se os tokens são válidos (com `jwt.verify(...)`)

> ⚠️ Importante: Os valores das secrets são decididas no momento do desenvolvimento. Elas não são geradas automaticamente por nenhuma biblioteca — e é possível trocá-las a qualquer momento (mas isso invalida todos os tokens emitidos antes da troca).

### 📜 Registered Claims
São chaves (ou "claims") padronizadas que o JWT reconhece como especiais, com significado definido pela especificação oficial.

Essas claims são opcionais, mas quando usadas, devem seguir o formato certo.

#### 🔑 Principais registered claims

| Claim	| Significado |
| --- | --- |
| `iss`	| Issuer — quem emitiu o token |
| `sub` | Subject — pra quem é o token (ID do usuário, por exemplo) |
| `aud` | Audience — quem deve aceitar esse token (ex: mobile, web) |
| `exp` | Expiration — quando o token expira (timestamp UNIX) |
| `nbf` | Not Before — só é válido depois desse tempo |
| `iat` | Issued At — quando o token foi criado |
| `jti`	| JWT ID — ID único do token (bom pra blacklist/revogação) |

Pode-se definir outros itens (em aberto) além das registered claims — são chamadas de:

Public claims → como "name", "email" etc

Private claims → como "role": "admin" ou "plan": "pro"

#### ✅ Quando usar registered claims?

| Claim	| Quando usar |
| --- | --- |
| `exp` | Sempre, para controlar expiração |
| `iat` | Quase sempre, ajuda no debug |
| `sub` | Bom para identificar o usuário (ex: ID do usuário em algum contexto) |
| `iss` | Útil quando houver vários emissores de token |
| `aud` | Útil se o mesmo token for pra diferentes apps |
| `jti` | Recomendado se for implementar revogação ou blacklist |

### ⚠️ Cuidados ao utilizar
- Nunca expor o token no HTML; Nem passar como query string
- Guardar o token com segurança. Preferência: `HttpOnly Cookie`
 