const express = require('express');
const jwt = require('jsonwebtoken');
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

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === fakeUser.email && password === fakeUser.password) {
    const token = jwt.sign({ id: fakeUser.id, email: fakeUser.email }, process.env.SECRET_KEY, {
      expiresIn: 60 // 60segundos, 1minuto
    });

    // Definir o cookie HTTP-only
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true em produção (https)
      sameSite: 'Lax',
      maxAge: 60000 // 1minuto
    });

    return res.status(200).json({ auth: true });
  }

  res.status(401).json({ message: 'Credenciais inválidas' });
});

function jwtAuthMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ auth: false, message: 'Token ausente' });

  try {
    const userDecodedSendOnSign = jwt.verify(token, SECRET_KEY);
    req.user = userDecodedSendOnSign
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
}

app.get('/resource-protected-by-jwt-auth-cookie', jwtAuthMiddleware, (req, res) => {
  res.status(200).json({ message: `Olá, usuário ${req.user.email}! Essa é uma área protegida.` });
});


app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ auth: false });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
