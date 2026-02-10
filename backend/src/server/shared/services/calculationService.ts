import { ICarCalculation } from "../../controllers/cars/CreateCalculation";
import { IResult } from "../../controllers/cars/CreateCalculation";

export function calcular(x: ICarCalculation): IResult {

    //Depreciação em média de 1,67% ao mês.
    let depreciacao = 0;

    if (x.taxaDepreciacaoMensal !== undefined) {
        depreciacao = x.taxaDepreciacaoMensal/100;
    } 
    else {
        depreciacao = 0.0167;
    }

    const valorRevenda = x.precoCarro * Math.pow(1 - depreciacao, x.periodoAnalise);

    const custoAVistaReal = x.precoCarro - valorRevenda;

    const valorFinanciado = x.precoCarro - x.entrada;

    const parcelaFinanciamento = valorFinanciado *
        (x.taxaJurosMensal * Math.pow(1 + x.taxaJurosMensal, x.parcelas)) /
        (Math.pow(1 + x.taxaJurosMensal, x.parcelas) - 1);

    const totalFinanciamento = parcelaFinanciamento * x.parcelas + x.entrada;
    const custoFinanciamentoReal = totalFinanciamento - valorRevenda;
    const custoAluguel = x.aluguelMensal * x.periodoAnalise;

    const extrasMensais =
        (x.gastoMensalCombustivel || 0) +
        (x.gastoMensalSeguro || 0) +
        (x.gastoMensalIPVA || 0);

    const extrasTotais = extrasMensais * x.periodoAnalise;

    const custoFinalAVista = custoAVistaReal + extrasTotais;
    const custoFinalFinanciamento = custoFinanciamentoReal + extrasTotais;
    const custoFinalAluguel = custoAluguel + extrasTotais;

    let melhorOpcao: "COMPRA_A_VISTA" | "FINANCIAMENTO" | "ALUGUEL";
    if(x.modo === "A_VISTA_vs_ALUGUEL") {
        if(custoFinalAVista < custoFinalAluguel) {
            melhorOpcao = "COMPRA_A_VISTA";
        }
        else {
            melhorOpcao = "ALUGUEL";
        }
    }
    else if(x.modo === "FINANCIAMENTO_vs_ALUGUEL") {
        if(custoFinalFinanciamento < custoFinalAluguel) {
            melhorOpcao = "FINANCIAMENTO";
        }
        else {
            melhorOpcao = "ALUGUEL";
        }
    }
    else {
        throw new Error("Modo de comparação inválido");
    }

    return {
        compraAVista: {
            custoTotal: Number(custoFinalAVista.toFixed(2)),
            valorRevenda: Number(valorRevenda.toFixed(2)),
            custoReal: Number(custoAVistaReal.toFixed(2)),
        },

        financiamento: {
            custoTotal: Number(totalFinanciamento.toFixed(2)),
            valorRevenda: Number(valorRevenda.toFixed(2)),
            custoReal: Number(custoFinanciamentoReal.toFixed(2)),
            parcelaFinanciamento: Number(parcelaFinanciamento.toFixed(2)),
        },

        aluguel: {
            custoTotal: Number(custoFinalAluguel.toFixed(2)),
        },

        melhorOpcao,
    };
}
