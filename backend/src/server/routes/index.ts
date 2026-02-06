import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router();

//Método GET -> Forma de dizer para o servidor que ele pode passar a aceitar requisições através da rede nas rotas especificadas  
router.get('/', (req, res) => {

    return res.send('Olá, comprador de carros');
});

router.post('/teste', (req, res) => {
    console.log(req);
    
    return res.status(StatusCodes.UNAUTHORIZED).json(req.body);
});

export { router };