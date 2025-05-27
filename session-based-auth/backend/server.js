const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require("dotenv").config();

const app = express();
const SECRET_KEY = process.env.SECRET_KEY
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

// autorizar dominio e portas porque estamos utilizando cookies.
// "aceite requisicoes vindas do frontend rodando no especificado em origin e permita envio de cookies"
app.use(cors({
  origin: 'http://localhost:5500',
  credentials: true
}));

const fakeUser = {
  id: 1,
  email: process.env.AUTH_EMAIL,
  password: process.env.AUTH_PASSWORD
};

// configurar sessao
app.use(session({
  name: 'session_based_auth_value',
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // true em produção (HTTPS)
    sameSite: 'lax',
    maxAge: 60000 // 1mionuto
  }
}));

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === fakeUser.email && password === fakeUser.password) {
    req.session.user = { id: fakeUser.id, email: fakeUser.email };

    return res.status(200).json({ auth: true });
  }

  res.status(401).json({ message: 'Credenciais inválidas' });
});

function sessionAuthMiddleware(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ auth: false, message: 'Não autenticado' });
  }
}

app.get('/resource-protected-by-session', sessionAuthMiddleware, (req, res) => {
  res.status(200).json({ message: `Olá, usuário ${req.session.user.email}! Essa é uma área protegida.` });
});


app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('session_based_auth_value');
    res.json({ auth: false });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
