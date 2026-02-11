/* eslint-disable @typescript-eslint/no-explicit-any */
import { IResult } from "@/pages/Index";

const API_URL = import.meta.env.VITE_API_URL_PROD;

export async function calcularCarro(body: any): Promise<IResult> {
    const response = await fetch(`${API_URL}/cars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.errors?.body?.message || "Erro ao calcular");

    return data;
}
