const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors())

function basicAuthMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
        res.setHeader("WWW-Authenticate", "Basic");
        return res.status(401).json({ message: "Unauthorized" });
    }

    const authHeaderInformations = authHeader.split(" ");
    const scheme = authHeaderInformations[0];
    const base64credentials = authHeaderInformations[1];

    if (scheme !== "Basic" || !base64credentials) {
        return res.status(400).send("Invalid Authentication format");
    }

    const credentials = Buffer.from(base64credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");

    const expectedUser = process.env.AUTH_USER;
    const expectedPassword = process.env.AUTH_PASSWORD;

    if (username === expectedUser && password === expectedPassword) {
        return next();
    }

    return res.status(401).json({ message: "Invalid credentials" });
}

app.get("/resource-protected-by-basic-auth", basicAuthMiddleware, (req, res) => {
    res.json({ message: "Access granted to protected resource" });
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));
