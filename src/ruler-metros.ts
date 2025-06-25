// Conversão de quadrados para metros
export function quadradosParaMetros(quadrados: number): number {
    return quadrados * 1.5;
}

// Conversão de quadrados para pés (1 quadrado = 5 pés)
export function quadradosParaPes(quadrados: number): number {
    return quadrados * 5;
}

// Conversão de metros para quadrados
export function metrosParaQuadrados(metros: number): number {
    return metros / 1.5;
}

// Conversão de pés para quadrados
export function pesParaQuadrados(pes: number): number {
    return pes / 5;
}

// Formatação de distância com múltiplas unidades
export function formatarDistancia(quadrados: number, unidade: 'm' | 'ft' | 'sq' = 'm', arredondamento: 'normal' | 'cima' | 'baixo' = 'normal'): string {
    let valor: number;
    switch (unidade) {
        case 'm':
            valor = quadradosParaMetros(quadrados);
            break;
        case 'ft':
            valor = quadradosParaPes(quadrados);
            break;
        case 'sq':
            valor = quadrados;
            break;
    }
    if (arredondamento === 'cima') valor = Math.ceil(valor);
    else if (arredondamento === 'baixo') valor = Math.floor(valor);
    else valor = Number(valor.toFixed(1));
    const sufixo = unidade === 'm' ? 'm' : unidade === 'ft' ? 'ft' : 'sq';
    return `${valor} ${sufixo}`;
}

// Cálculo de custo de movimento (D&D 5e: cada segundo quadrado custa o dobro)
export function custoMovimento(quadrados: number): number {
    let custo = 0;
    for (let i = 1; i <= quadrados; i++) {
        custo += (i % 2 === 0) ? 2 : 1;
    }
    return custo * 1.5; // retorna em metros
}

// Tooltip customizada para exibir múltiplas unidades
export function gerarTooltipDistancia(quadrados: number): string {
    const metros = formatarDistancia(quadrados, 'm');
    const pes = formatarDistancia(quadrados, 'ft');
    const custo = custoMovimento(quadrados);
    return `${metros} | ${pes} | Custo (D&D 5e): ${custo.toFixed(1)} m`;
}

// Exemplo de uso:
// const q = 7;
// const tooltip = gerarTooltipDistancia(q);
// Exiba tooltip na interface do usuário.
