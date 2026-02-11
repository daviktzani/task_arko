import express from 'express';
import 'dotenv/config';
import './shared/services/TranslationsYup';

//Criei as rotas em um arquivo separado. Dentro do arquivo de configurações do servidor, o server faz uso desas rotas.
import { router } from './routes/index';
import cors from "cors";
const server = express();

server.use(cors());
server.use(express.json());
server.use(express.json());

server.use(router);

export { server };