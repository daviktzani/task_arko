import { IResult } from "@/lib/calculationService";
import { Car, DollarSign, TrendingDown, TrendingUp, Trophy } from "lucide-react";

const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface ResultCardProps {
    result: IResult;
}

const melhorOpcaoLabel: Record<string, string> = {
    COMPRA_A_VISTA: "Compra à vista",
    FINANCIAMENTO: "Financiamento",
    ALUGUEL: "Aluguel",
};

export function ResultCard({ result }: ResultCardProps) {
    return (
        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Winner banner */}
            <div className="rounded-xl bg-accent p-6 text-center text-accent-foreground">
                <Trophy className="mx-auto mb-2 h-8 w-8" />
                <p className="text-sm font-medium uppercase tracking-wider opacity-90">Melhor opção</p>
                <p className="text-2xl font-bold">{melhorOpcaoLabel[result.melhorOpcao]}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {/* Compra / Financiamento */}
                {result.compraAVista && (
                    <div className="rounded-xl border bg-card p-5 space-y-3">
                        <div className="flex items-center gap-2 font-semibold text-card-foreground">
                            <Car className="h-5 w-5" />
                            Compra à vista
                        </div>
                        <div className="space-y-1 text-sm">
                            <Row label="Custo total" value={formatCurrency(result.compraAVista.custoTotal)} />
                            <Row label="Valor de revenda" value={formatCurrency(result.compraAVista.valorRevenda)} />
                            <Row label="Custo real" value={formatCurrency(result.compraAVista.custoReal)} />
                        </div>
                    </div>
                )}

                {result.financiamento && (
                    <div className="rounded-xl border bg-card p-5 space-y-3">
                        <div className="flex items-center gap-2 font-semibold text-card-foreground">
                            <TrendingUp className="h-5 w-5" />
                            Financiamento
                        </div>
                        <div className="space-y-1 text-sm">
                            <Row label="Custo total" value={formatCurrency(result.financiamento.custoTotal)} />
                            <Row label="Parcela" value={formatCurrency(result.financiamento.parcelaFinanciamento)} />
                            <Row label="Valor de revenda" value={formatCurrency(result.financiamento.valorRevenda)} />
                            <Row label="Custo real" value={formatCurrency(result.financiamento.custoReal)} />
                        </div>
                    </div>
                )}

                {/* Aluguel */}
                <div className="rounded-xl border bg-card p-5 space-y-3">
                    <div className="flex items-center gap-2 font-semibold text-card-foreground">
                        <DollarSign className="h-5 w-5" />
                        Aluguel
                    </div>
                    <div className="space-y-1 text-sm">
                        <Row label="Custo total" value={formatCurrency(result.aluguel.custoTotal)} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-card-foreground">{value}</span>
        </div>
    );
}
