const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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

    return res.status(200).json({ auth: true, token: token });
  }

  res.status(401).json({ message: 'Credenciais inválidas' });
});

function jwtAuthMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ auth: false, message: 'Token não fornecido' });

  jwt.verify(token, process.env.SECRET_KEY, (err, userDecodedSendOnSign) => {
    if (err) return res.status(403).json({ auth: false, message: 'Token inválido ou expirado' });

    req.user = userDecodedSendOnSign;
    next();
  });
}

app.get('/resource-protected-by-jwt-auth-localstorage', jwtAuthMiddleware, (req, res) => {
  res.status(200).json({ message: `Olá, usuário ${req.user.email}! Essa é uma área protegida.` });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
