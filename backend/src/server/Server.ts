import express from 'express';
import 'dotenv/config';


//Criei as rotas em um arquivo separado. Dentro do arquivo de configurações do servidor, o server faz uso desas rotas.
import { router } from './routes/index';

const server = express();

server.use(express.json());
server.use(router);

export { server };