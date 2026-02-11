/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, FormEvent } from "react";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResultCard } from "@/components/ResultCard";
import { toast } from "sonner";

// ===============================
// TIPOS
// ===============================
type Modo = "A_VISTA_vs_ALUGUEL" | "FINANCIAMENTO_vs_ALUGUEL";

// ===============================
// CONFIG
// ===============================
const API_URL = "https://taskarko-production.up.railway.app";

// ===============================
// API
// ===============================
async function calcularAPI(dados: any) {
    try {
        const response = await fetch(`${API_URL}/cars`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dados),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const mensagem =
                data?.errors?.body?.message ||
                data?.message ||
                "Erro ao calcular no servidor";

            throw new Error(mensagem);
        }

        return data;
    } catch (e: any) {
        throw new Error(
            "Não foi possível conectar ao backend. Verifique se o servidor está rodando."
        );
    }
}

// ===============================
// COMPONENTE PRINCIPAL
// ===============================
const Index = () => {
    const [modo, setModo] = useState<Modo | null>(null);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const reset = () => {
        setModo(null);
        setResult(null);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!modo) return;

        try {
            setLoading(true);

            const fd = new FormData(e.currentTarget);

            const num = (key: string) => {
                const v = fd.get(key) as string;
                return v ? Number(v.replace(",", ".")) : undefined;
            };

            const int = (key: string) => {
                const v = fd.get(key) as string;
                if (!v) return undefined;

                const n = Number(v.replace(",", "."));

                if (!Number.isInteger(n)) {
                    throw new Error("O período em meses deve ser um número inteiro");
                }

                return n;
            };

            const payload = {
                modo,
                precoCarro: num("precoCarro")!,
                periodoAnalise: int("periodoAnalise")!,   // ← AGORA SÓ INTEIRO
                aluguelMensal: num("aluguelMensal")!,
                entrada: num("entrada"),
                taxaJurosMensal:
                    num("taxaJurosMensal") !== undefined
                        ? num("taxaJurosMensal")! / 100
                        : undefined,
                parcelas: num("parcelas"),
                gastoMensalCombustivel: num("gastoMensalCombustivel"),
                gastoMensalSeguro: num("gastoMensalSeguro"),
                gastoMensalIPVA: num("gastoMensalIPVA"),
                taxaDepreciacaoMensal: num("taxaDepreciacaoMensal"),
            };

            const resultado = await calcularAPI(payload);

            setResult(resultado);
            toast.success("Cálculo realizado com sucesso!");
        } catch (err: any) {
            toast.error(err.message || "Erro inesperado");
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-start justify-center px-4 py-12">
            <div className="w-full max-w-lg space-y-8">
                <div className="text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
                        <Car className="h-7 w-7 text-primary-foreground" />
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                        CarCulator
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Comprar ou alugar seu carro? Descubra o que é mais rentável
                    </p>
                </div>

                {!modo && (
                    <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
                        <p className="text-lg font-semibold">
                            Qual seria seu método de pagamento na compra do carro?
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setModo("A_VISTA_vs_ALUGUEL")}
                            >
                                À vista
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => setModo("FINANCIAMENTO_vs_ALUGUEL")}
                            >
                                Financiamento
                            </Button>
                        </div>
                    </div>
                )}

                {modo && !result && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={reset}
                                className="text-sm text-muted-foreground underline"
                            >
                                Voltar
                            </button>
                        </div>

                        <Field
                            label="Preço do carro à vista (R$)"
                            name="precoCarro"
                            required
                            min="1"
                        />

                        {modo === "FINANCIAMENTO_vs_ALUGUEL" && (
                            <>
                                <Field label="Valor da entrada (R$)" name="entrada" />
                                <Field label="Taxa de juros mensal (%)" name="taxaJurosMensal" step="0.01" />
                                <Field label="Quantidade de parcelas mensais" name="parcelas" min="1" step="1" />
                            </>
                        )}

                        {/* ======= CAMPO CORRIGIDO ======= */}
                        <Field
                            label="Intervalo de tempo de uso do veículo (meses)"
                            name="periodoAnalise"
                            required
                            min="1"
                            step="1"
                            onlyInteger
                        />

                        <Field
                            label="Valor do aluguel mensal (R$)"
                            name="aluguelMensal"
                            required
                        />

                        <Field
                            label="Gasto mensal com combustível (Opcional)"
                            name="gastoMensalCombustivel"
                        />

                        <Field
                            label="Gasto mensal com Seguro (Opcional)"
                            name="gastoMensalSeguro"
                        />

                        <Field
                            label="Gasto mensal com IPVA (Opcional)"
                            name="gastoMensalIPVA"
                        />

                        <Field
                            label="Taxa mensal de depreciação do preço do veículo (%)"
                            name="taxaDepreciacaoMensal"
                            placeholder="Padrão: 1,67% ao mês"
                            step="0.01"
                        />

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Calculando..." : "Calcular"}
                        </Button>
                    </form>
                )}

                {result && (
                    <div>
                        <ResultCard result={result} />

                        <Button
                            variant="outline"
                            className="mt-6 w-full"
                            onClick={reset}
                        >
                            Nova simulação
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

// ===============================
// COMPONENTE DE CAMPO
// ===============================
function Field({
    label,
    name,
    required,
    step = "0.01",
    placeholder,
    min = "0",
    onlyInteger = false,
}: {
    label: string;
    name: string;
    required?: boolean;
    step?: string;
    placeholder?: string;
    min?: string;
    onlyInteger?: boolean;
}) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={name}>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
            </Label>

            <Input
                id={name}
                name={name}
                type="number"
                min={min}
                step={step}
                placeholder={placeholder}
                required={required}

                onKeyDown={(e) => {
                    if (onlyInteger && (e.key === "." || e.key === ",")) {
                        e.preventDefault();
                    }
                }}
            />
        </div>
    );
}

export default Index;

