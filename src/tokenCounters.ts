import './tokenCounters.css';

export type CounterType = 'simple' | 'fraction';

export interface TokenCounter {
  id: string;
  type: CounterType;
  value: number;
  max?: number;
  color: string;
  visibleToPlayers: boolean;
}

export function renderTokenCounter(counter: TokenCounter, container: HTMLElement) {
  // Limpa o container
  container.innerHTML = '';

  // Cria a barra (se for fração)
  if (counter.type === 'fraction' && counter.max !== undefined) {
    const bar = document.createElement('div');
    bar.className = 'token-counter-bar';
    bar.style.background = counter.color;
    bar.style.width = `${(counter.value / counter.max) * 100}%`;
    container.appendChild(bar);
  }

  // Cria o número (sempre)
  const number = document.createElement('div');
  number.className = 'token-counter-number';
  number.textContent = counter.type === 'fraction' && counter.max !== undefined
    ? `${counter.value}/${counter.max}`
    : `${counter.value}`;
  number.style.background = counter.color;
  container.appendChild(number);
}
