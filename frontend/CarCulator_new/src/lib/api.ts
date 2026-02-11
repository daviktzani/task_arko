/* eslint-disable @typescript-eslint/no-explicit-any */
import { IResult } from "@/pages/Index"; // depois podemos mover para types

export async function calcularCarro(body: any): Promise<IResult> {
    const response = await fetch("http://localhost:3333/cars", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.errors?.body?.message || "Erro ao calcular"
        );
    }

    return data;
}
