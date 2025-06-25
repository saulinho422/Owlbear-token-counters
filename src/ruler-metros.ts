// Função para converter quadrados em metros
export function quadradosParaMetros(quadrados: number): number {
    return quadrados * 1.5;
}

// Função utilitária para formatar a distância
export function formatarDistanciaEmMetros(quadrados: number): string {
    const metros = quadradosParaMetros(quadrados);
    return `${metros.toFixed(1)} m`;
}

// Exemplo de integração (ajuste conforme integração com Owlbear Rodeo):
// Suponha que você receba a distância em quadrados do sistema de régua:
// const distanciaQuadrados = 5;
// const distanciaMetros = formatarDistanciaEmMetros(distanciaQuadrados);
// Exiba distanciaMetros na interface do usuário.
