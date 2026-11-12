# Rodapé interativo — Arlete Space

O rodapé editorial mantém os contactos, navegação, Instagram, créditos e WhatsApp.
No desktop, a moldura (`data-footer-frame`) ocupa exatamente `100svh`,
incluindo as margens externas. O footer é um cartão vinho com cantos arredondados,
texto creme e informação centrada verticalmente no espaço acima das ferramentas. A física é uma camada absoluta
na própria composição, sem uma secção adicional. O conteúdo fica sobre essa
camada; só os links capturam cliques, permitindo arrastar as ferramentas no
espaço livre. A base reserva espaço para copyright e a assinatura `<s/a>`.
No móvel, a altura é automática para preservar a leitura de todos os contactos.
O componente físico é reutilizável:

```tsx
import { GravityPlayground } from "@/shared/ui/gravity-footer/GravityPlayground";
import { salonTools } from "@/shared/ui/gravity-footer/assets";

<GravityPlayground assets={salonTools} />
```

## Configuração

`shared/ui/gravity-footer/assets.ts` contém os sete objetos: caminho local,
largura de referência em px, posição horizontal de entrada (0–1) e rotação
inicial em radianos. `geometry.json` contém proporções e polígonos convexos
normalizados derivados do canal alpha. Não usar retângulos do tamanho total
para ferramentas com silhuetas irregulares.

Para processar novos PNGs transparentes com os mesmos nomes:

```sh
node scripts/prepare-footer-tools.mjs /pasta/com/os/pngs
```

O script usa `sharp`, recorta margens transparentes, cria WebP com alpha e
calcula os polígonos. Os assets finais estão em `public/images/footer-tools/`
(aproximadamente 224 KB no total). Nenhum asset depende de URLs externas.

## Movimento e ciclo de vida

GSAP ScrollTrigger revela o conteúdo e carrega a física no primeiro encontro
com a área interativa. Matter.js simula corpos compostos, colisões e gravidade.
Há um único loop RAF, sem Runner nem ticker adicional. A entrada progressiva
usa tempo de simulação, portanto não avança enquanto o rodapé está oculto.
O motor pausa fora do viewport e com o documento oculto; o loop termina quando
todos os corpos dormem e retoma numa interação.

Arrastar usa uma constraint no ponto agarrado. A velocidade de lançamento é
calculada com os últimos 100 ms do movimento, limitada a 24 px por passo.
No rato, é possível mover em ambos os eixos. No toque, o arrasto é horizontal:
`touch-action: pan-y pinch-zoom` mantém o scroll vertical e o zoom nativos.
`pointercancel` solta a peça sem criar um lançamento involuntário.

O rodapé persiste no layout do Next.js, portanto a queda não se repete ao navegar
entre páginas. Um novo carregamento da página inicia outra visita. Não são
criados motores adicionais por mudança de rota.

ResizeObserver atualiza paredes, escala e posições. O cleanup cancela RAF,
remove listeners e constraints, desliga o observer e limpa Composite e Engine.
A alteração dinâmica para movimento reduzido também executa esse cleanup.
GSAP fica limitado aos elementos deste rodapé, que opta por não participar do
Reveal global (`data-reveal="none"`). A composição está em `shared/ui/Footer.module.css`;
o nome e horários estão à esquerda, com navegação, contacto, redes e morada ao lado.

Sem JavaScript, falha ao carregar a física ou movimento reduzido, as mesmas
imagens formam uma composição estática. As imagens são decorativas, sem foco,
com `aria-hidden` na área, e nenhum link fica dentro da simulação.

## Assets gerados

Modo: ferramenta integrada `image_gen` com `transparent_background: true`,
um pedido por ferramenta. A otimização e a geometria são locais.

Prompt comum (substituir SUBJECT por cada assunto abaixo):

> Use case: product-mockup. Website asset for a premium editorial hair salon physics playground: SUBJECT. A single isolated product cutout on a genuinely transparent background. Photorealistic premium 3D studio render with fine material detail, soft directional lighting, cohesive burgundy/champagne salon tool collection. Entire object visible, centered with small safe margin, no crop. No text, no branding, no logo, no other objects, no ground plane, no cast shadow. 1024 square.

Assuntos:

- scissors: a SINGLE pair of closed professional hairdressing scissors, polished champagne silver steel, burgundy finger ring inserts, horizontal blades pointing right
- comb: a SINGLE professional wide tooth hair comb, translucent amber tortoiseshell acetate, horizontal orientation, teeth pointing down
- hairbrush: a SINGLE premium paddle hairbrush with matte burgundy handle and oval champagne gold head, dense black bristles, overhead view, handle pointing right, horizontal orientation
- bowl: a SINGLE hair dye mixing bowl, matte burgundy molded bowl with subtle pouring lip and small integrated handle, elevated front three-quarter view, realistic empty dark interior
- tint-brush: a SINGLE salon hair coloring tint brush, champagne beige slim tapered handle on right, rectangular black bristle head on left, overhead product view, horizontal orientation
- clip: a SINGLE professional long alligator hair sectioning clip, matte champagne gold metal with visible spring and serrated clamp, horizontal side view, jaws pointing left

O secador usou este prompt:

> Use case: product-mockup. Asset for interactive premium hair salon website: a SINGLE professional hair dryer, full isolated product cutout on genuine transparent background. High-end photorealistic 3D studio render, soft directional studio lighting, matte burgundy body with champagne metallic accents. Side view, nozzle pointing left, handle pointing down, no cable, no logo, no text, no props, no ground plane or cast shadow. Entire object visible with small safe margin. Natural realistic proportions, very crisp detailed materials. 1024 square.

## Verificação

Testado no Chromium com o build de produção: inicialização adiada, sete entradas
progressivas, repouso, agarrar e lançar, pausa fora do viewport, redimensionar de
1440 para 390 px, scroll vertical por gesto de toque, movimento reduzido dinâmico,
links de marcação e composição sem JavaScript. Sem erros de página nos cenários.

A navegação e o playground ficam fora da área `main` que as transições tornam
inerte; apenas o clique em links continua a ser tratado pelo sistema de transições.

Teste de ciclo de vida reproduzível, sem navegador:

```sh
node scripts/check-footer-physics.mjs
```

Este teste usa Matter.js real e confirma repouso, um único RAF, pausa e limpeza
de todos os corpos, constraints, listeners, observer e frames pendentes.

A tipografia do site foi aumentada nas regras de texto pequeno de `app/globals.css`
e nas classes do menu de serviços. A tipografia e a superfície do footer ficam
isoladas em `shared/ui/Footer.module.css`.
