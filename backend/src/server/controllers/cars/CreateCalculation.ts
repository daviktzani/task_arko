/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from 'yup';
import { validation } from '../../shared/middleware';

interface ICarCalculation {
    precoCarro: number;
    entrada: number;
    taxaJurosMensal: number;
    parcelas: number;
    aluguelMensal: number;
    mesesAluguel: number;
    gastoMensalCombustivel?: number;
    gastoMensalSeguro?: number;
}   

export const createValidation = validation((getSchema) => ({
    body: getSchema<ICarCalculation>(yup.object().shape({
    precoCarro: yup.number().required().positive().integer(),
    entrada: yup.number().required().positive().integer(),
    taxaJurosMensal: yup.number().required().positive().integer(),
    parcelas: yup.number().required().positive().integer(),
    aluguelMensal: yup.number().required().positive().integer(),
    mesesAluguel: yup.number().required().positive().integer(),
    gastoMensalCombustivel: yup.number().positive().optional(),
    gastoMensalSeguro: yup.number().positive().optional(),
    })),
}));

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const create = async (req: Request<{}, {}, ICarCalculation>, res: Response) => {

    console.log(req.body);

    return res.send('Create!');
};