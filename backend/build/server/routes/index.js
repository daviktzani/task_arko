"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const router = (0, express_1.Router)();
exports.router = router;
//Método GET -> Forma de dizer para o servidor que ele pode passar a aceitar requisições através da rede nas rotas especificadas  
router.get('/', (req, res) => {
    return res.send('Olá, comprador de carros');
});
router.post('/teste', (req, res) => {
    console.log(req);
    return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(req.body);
});
