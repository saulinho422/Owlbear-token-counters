// Ferramenta personalizada para Owlbear Rodeo seguindo o padrão de classe
import OBR from '@owlbear-rodeo/sdk';
import { gerarTooltipDistancia } from './ruler-metros';

class RulerTool {
  id = 'minha-extensao-ruler-metros.ruler';
  icons = [
    {
      icon: '/icon.png',
      label: 'Régua Metros',
    },
  ];

  // Método chamado quando a ferramenta é ativada
  activate() {}
  // Método chamado quando a ferramenta é desativada
  deactivate() {}

  // Handler de eventos de ponteiro
  pointerDown(ctx: any, event: any) {
    ctx.metadata.set('start', { x: event.pointer.x, y: event.pointer.y });
  }
  pointerUp(ctx: any, event: any) {
    const start = ctx.metadata.get('start');
    if (!start) return;
    const dx = event.pointer.x - start.x;
    const dy = event.pointer.y - start.y;
    const distPx = Math.sqrt(dx * dx + dy * dy);
    const pxPorQuadrado = 50;
    const quadrados = distPx / pxPorQuadrado;
    OBR.notification.show(gerarTooltipDistancia(quadrados), 'INFO');
    ctx.metadata.set('start', null);
  }
}

// Registro da ferramenta
if ((OBR as any).tool && typeof (OBR as any).tool.register === 'function') {
  (OBR as any).tool.register(new RulerTool());
} else if ((OBR as any).tools && typeof (OBR as any).tools.register === 'function') {
  (OBR as any).tools.register(new RulerTool());
}
