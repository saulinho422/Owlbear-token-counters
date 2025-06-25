import { renderTokenCounter } from './tokenCounters';
import type { TokenCounter } from './tokenCounters';
import './tokenCounters.css';
import { gerarTooltipDistancia } from './ruler-metros';

// Owlbear Rodeo API integration
// @ts-ignore
const obAPI = window.owbear || window.Owlbear || {};

function getSelectedTokenId() {
  return obAPI.tokens?.getSelected?.()[0]?.id || null;
}

function getTokenData(tokenId: string): TokenCounter[] {
  // Agora retorna um array de contadores
  const data = obAPI.tokens?.getData?.(tokenId);
  if (data && Array.isArray(data.tokenCounters)) return data.tokenCounters;
  if (data && data.tokenCounter) return [data.tokenCounter];
  return [];
}

function setTokenData(tokenId: string, counters: TokenCounter[]) {
  obAPI.tokens?.setData?.(tokenId, { tokenCounters: counters });
}

function setupOwlbearIntegration(app: HTMLElement) {
  let currentTokenId = getSelectedTokenId();
  if (!currentTokenId) return;

  let counters = getTokenData(currentTokenId);
  if (counters.length === 0) {
    counters = [{
      id: 'vida',
      type: 'fraction',
      value: 10,
      max: 10,
      color: '#4caf50',
      visibleToPlayers: true,
    }];
  }

  // Renderiza todos os contadores
  const containers: HTMLElement[] = [];
  counters.forEach((counter, idx) => {
    const container = document.createElement('div');
    container.className = 'token-counter-container';
    renderTokenCounter(counter, container);
    app.appendChild(container);
    containers.push(container);

    // Opções de configuração para cada contador
    const options = document.createElement('div');
    options.style.margin = '8px 0';
    options.style.display = 'flex';
    options.style.gap = '8px';

    // Visibilidade
    const visLabel = document.createElement('label');
    visLabel.textContent = 'Visível aos jogadores';
    const visCheckbox = document.createElement('input');
    visCheckbox.type = 'checkbox';
    visCheckbox.checked = counter.visibleToPlayers;
    visCheckbox.addEventListener('change', () => {
      counter.visibleToPlayers = visCheckbox.checked;
      setTokenData(currentTokenId, counters);
      renderTokenCounter(counter, container);
    });
    visLabel.appendChild(visCheckbox);
    options.appendChild(visLabel);

    // Cor
    const colorLabel = document.createElement('label');
    colorLabel.textContent = 'Cor:';
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = counter.color;
    colorInput.addEventListener('input', () => {
      counter.color = colorInput.value;
      setTokenData(currentTokenId, counters);
      renderTokenCounter(counter, container);
    });
    colorLabel.appendChild(colorInput);
    options.appendChild(colorLabel);

    // Tipo
    const typeLabel = document.createElement('label');
    typeLabel.textContent = 'Tipo:';
    const typeSelect = document.createElement('select');
    const optSimple = document.createElement('option');
    optSimple.value = 'simple';
    optSimple.textContent = 'Simples';
    const optFraction = document.createElement('option');
    optFraction.value = 'fraction';
    optFraction.textContent = 'Fração';
    typeSelect.appendChild(optSimple);
    typeSelect.appendChild(optFraction);
    typeSelect.value = counter.type;
    typeSelect.addEventListener('change', () => {
      counter.type = typeSelect.value as 'simple' | 'fraction';
      setTokenData(currentTokenId, counters);
      renderTokenCounter(counter, container);
    });
    typeLabel.appendChild(typeSelect);
    options.appendChild(typeLabel);

    // Input para edição dinâmica
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Ex: -1/0, +2/+0, 5/10';
    input.style.marginLeft = '8px';
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
          counter.value = newValue;
          counter.max = newMax;
          setTokenData(currentTokenId, counters);
          renderTokenCounter(counter, container);
          input.value = '';
        }
      }
    });
    options.appendChild(input);

    // Botão para remover contador
    if (counters.length > 1) {
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remover';
      removeBtn.onclick = () => {
        counters.splice(idx, 1);
        setTokenData(currentTokenId, counters);
        app.innerHTML = '';
        setupOwlbearIntegration(app);
      };
      options.appendChild(removeBtn);
    }

    app.appendChild(options);
  });

  // Botão para adicionar novo contador
  const addBtn = document.createElement('button');
  addBtn.textContent = 'Adicionar contador';
  addBtn.onclick = () => {
    counters.push({
      id: `contador${counters.length + 1}`,
      type: 'simple',
      value: 0,
      color: '#2196f3',
      visibleToPlayers: true,
    });
    setTokenData(currentTokenId, counters);
    app.innerHTML = '';
    setupOwlbearIntegration(app);
  };
  app.appendChild(addBtn);

  // Atualiza ao trocar seleção de token
  if (obAPI.tokens?.onSelectionChange) {
    obAPI.tokens.onSelectionChange(() => {
      app.innerHTML = '';
      setupOwlbearIntegration(app);
    });
  }
}

function addRulerOverlay() {
  // Cria overlay se não existir
  let overlay = document.getElementById('ruler-metros-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'ruler-metros-overlay';
    overlay.style.position = 'fixed';
    overlay.style.bottom = '16px';
    overlay.style.right = '16px';
    overlay.style.background = 'rgba(30,30,30,0.9)';
    overlay.style.color = '#fff';
    overlay.style.padding = '10px 18px';
    overlay.style.borderRadius = '8px';
    overlay.style.fontSize = '1.2em';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';
    document.body.appendChild(overlay);
  }
  return overlay;
}

// Exemplo: escuta eventos de mouse para simular medição de distância
let startPos: {x: number, y: number} | null = null;
document.addEventListener('mousedown', (e) => {
  if (e.button === 2) { // botão direito
    startPos = { x: e.clientX, y: e.clientY };
  }
});
document.addEventListener('mouseup', (e) => {
  if (startPos && e.button === 2) {
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;
    const distPx = Math.sqrt(dx*dx + dy*dy);
    // Supondo 1 quadrado = 50px (ajuste conforme o grid do Owlbear)
    const pxPorQuadrado = 50;
    const quadrados = distPx / pxPorQuadrado;
    const overlay = addRulerOverlay();
    overlay.textContent = gerarTooltipDistancia(quadrados);
    overlay.style.display = 'block';
    setTimeout(() => { overlay.style.display = 'none'; }, 4000);
    startPos = null;
  }
});

// Inicialização Owlbear
const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  setupOwlbearIntegration(app);
}
