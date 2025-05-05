## ⚙️ Como executar esse exemplo

- Clone este repositório
-  Clone o arquivo `env.example` para um arquivo `.env`
    - Preencha a `SECRET_KEY` com a chave que será utilizada para assinar o `jwt`.
    - Preencha as credenciais válidas (email e senha) em `AUTH_EMAIL` e `AUTH_PASSWORD`
<br>

- Acesse a pasta `jwt-localstorage/backend` e execute:
  - `npm install` para instalar as dependências necessárias (express, cors, doteenv)
  - `npm run dev` para inicializar o backend
<br>

- Abra o arquivo `index.html` em um navegador de sua escolha (o projeto é bem simples!)
- Use as credenciais que preencheu no `.env` para logar e gerar um `jwt` que será salvo no seu `localStorage`via `Bearer Authentication`
    - Com as credenciais corretas, um alert de login com sucesso será mostrado
- Clique em "Access" abaixo de "Protected resource" para bater na rota que requer autenticação. O token será enviado e você acessará a rota via `Bearer Authentication`

> ⚠️ Os tokens estão configurados com a duração de 60 segundos apenas. Após isso é necessário fazer o login novamente.

> ✋ O projeto é bem simples e a título de simplificação e estudos, o frontend foi feito somente com HTML puro, sem necessidade de frameworks.