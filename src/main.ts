import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { renderTokenCounter } from './tokenCounters';
import type { TokenCounter } from './tokenCounters';
import './tokenCounters.css';
import './owlbear-integration';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

// Exemplo de uso: renderizar um contador abaixo de um token
const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  const container = document.createElement('div');
  container.className = 'token-counter-container';
  app.appendChild(container);

  // Estado do contador
  let counter: TokenCounter = {
    id: 'vida',
    type: 'fraction',
    value: 11,
    max: 11,
    color: '#4caf50',
    visibleToPlayers: true,
  };

  // Renderiza o contador
  renderTokenCounter(counter, container);

  // Input para edição dinâmica
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Ex: -10/11, +10/+10, 5/10';
  input.style.marginTop = '8px';
  app.appendChild(input);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value.trim();
      if (/^[+-]?\d+\/?[+-]?\d*$/.test(val)) {
        let [v, m] = val.split('/');
        let newValue = counter.value;
        let newMax = counter.max ?? 0;
        if (v.startsWith('+') || v.startsWith('-')) {
          newValue += parseInt(v, 10);
        } else {
          newValue = parseInt(v, 10);
        }
        if (m) {
          if (m.startsWith('+') || m.startsWith('-')) {
            newMax += parseInt(m, 10);
          } else {
            newMax = parseInt(m, 10);
          }
        }
        counter = { ...counter, value: newValue, max: newMax };
        renderTokenCounter(counter, container);
        input.value = '';
      }
    }
  });
}
