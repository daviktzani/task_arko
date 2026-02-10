/* eslint-disable @typescript-eslint/no-unused-vars */
export { ICarCalculation };
export { IResult };
import { calcular } from "../../shared/services/calculationService";
import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as yup from 'yup';
import { validation } from '../../shared/middleware';

export type ModoComparacao = "A_VISTA_vs_ALUGUEL" | "FINANCIAMENTO_vs_ALUGUEL";

interface ICarCalculation {
    modo: ModoComparacao;
    precoCarro: number;
    entrada: number;
    taxaJurosMensal: number;
    periodoAnalise: number;
    parcelas: number;
    aluguelMensal: number;
    gastoMensalCombustivel?: number;
    gastoMensalSeguro?: number;
    gastoMensalIPVA?: number;
    taxaDepreciacaoMensal?: number;
}

interface IResult {
    compraAVista: {
        custoTotal: number;
        valorRevenda: number;
        custoReal: number;
    };

    financiamento: {
        custoTotal: number;
        valorRevenda: number;
        custoReal: number;
        parcelaFinanciamento: number;
    };

    aluguel: {
        custoTotal: number;
    };

    melhorOpcao: "COMPRA_A_VISTA" | "FINANCIAMENTO" | "ALUGUEL";
}

export const createValidation = validation((getSchema) => ({
    body: getSchema<ICarCalculation>(yup.object().shape({
        modo: yup.mixed<"A_VISTA_vs_ALUGUEL" | "FINANCIAMENTO_vs_ALUGUEL">().oneOf(["A_VISTA_vs_ALUGUEL", "FINANCIAMENTO_vs_ALUGUEL"]).required(),
        precoCarro: yup.number().required().positive(),
        entrada: yup.number().required().positive(),
        taxaJurosMensal: yup.number().required().positive(),
        periodoAnalise: yup.number().required().positive().integer(),
        parcelas: yup.number().required().positive().integer(),
        aluguelMensal: yup.number().required().positive(),
        gastoMensalCombustivel: yup.number().positive().optional(),
        gastoMensalSeguro: yup.number().positive().optional(),
        gastoMensalIPVA: yup.number().positive().optional(),
        taxaDepreciacaoMensal: yup.number().positive().optional(),
    })),
}));

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const create = async (req: Request<{}, {}, ICarCalculation>, res: Response) => {

    const resultado = calcular(req.body);

    return res.status(200).json(resultado);
};