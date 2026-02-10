import { Router } from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { StatusCodes } from 'http-status-codes';
import { CarsController } from './../controllers';


const router = Router();

//Método GET -> Forma de dizer para o servidor que ele pode passar a aceitar requisições através da rede nas rotas especificadas  
router.get('/', (req, res) => {

    return res.send('Olá, comprador de carros');
});

router.post(
    '/cars', 
    CarsController.createValidation, 
    CarsController.create);

export { router };