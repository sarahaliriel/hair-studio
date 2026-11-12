# Auditoria — Arc Scroll do Arlete Space

Data: 11 de novembro de 2026.
Escopo: O Espaço → Serviços e Avaliações → O Teu Momento.

## Diagnóstico

A implementação anterior simulava a fixação das secções com compensação de scroll em JavaScript. Em cada evento de scroll, um `requestAnimationFrame` calculava a distância percorrida e escrevia `style.translate` nas secções anteriores visíveis.

O scroll nativo e a atualização dessas propriedades pertenciam a mecanismos separados. Entre o movimento do documento e a aplicação da compensação, o DOM podia apresentar uma posição deslocada. Fixar mais secções ampliou a cobertura, mas conservou essa fragilidade da arquitetura.

Uma amostra durante gestos reais de roda, para a primeira transição em Chrome headless a 1440 × 1200, registou 3 leituras divergentes em 100 frames, com desvio máximo de 379,53 px. O limite inferior esperado era 1200 px; foram observados, por exemplo, 820,47 px e 1500,47 px enquanto a compensação ainda correspondia à posição de scroll anterior.

Esses valores são leituras do DOM durante a sequência de frames, não uma medição de todos os frames efetivamente apresentados pelo compositor. São evidência do desfasamento entre os dois mecanismos. Os testes anteriores aguardavam o scroll estabilizar antes de medir; por isso validavam o estado final, sem cobrir esta condição transitória.

Foi identificada também uma fonte secundária de descontinuidade: o recálculo de dimensões substituía imediatamente o progresso suavizado pelo progresso instantâneo. Isso podia produzir um salto da máscara durante um resize ou atualização do layout. O progresso existente é agora preservado entre medições.

## Correção aplicada

1. Criado `shared/ui/ArcScrollScene.tsx`. Cada cena contém o conteúdo anterior numa composição única e a secção de entrada a seguir, mantendo a ordem real do DOM.
2. A composição anterior usa `position: sticky`. O navegador fixa o conjunto quando o seu limite inferior chega ao fundo da viewport. Hero, O Espaço, galeria e avaliações mantêm as relações espaciais entre si quando partilham o enquadramento.
3. Removida toda a compensação de scroll por `translate` nas secções anteriores, incluindo a seleção individual de secções e a reposição desses estilos.
4. O JavaScript mede a altura dos grupos; a fixação durante o scroll é responsabilidade do CSS. O cálculo dos pontos de entrada ignora o deslocamento visual dos antecessores sticky para evitar realimentar a geometria.
5. Mantido o progresso suavizado durante as novas medições de layout.

A solução não duplica conteúdo, não interceta o scroll e não adiciona espaçadores nem distância artificial de scroll.

## Funcionamento atual

| Parte | Responsabilidade |
| --- | --- |
| `ArcScrollScene.tsx` | Agrupa o enquadramento anterior e a secção de entrada. |
| `app/page.tsx` | Compõe duas cenas: a primeira reúne Hero + O Espaço antes de Serviços; a segunda inclui essa cena, o cuidado, a galeria e as avaliações antes de O Teu Momento. |
| `app/globals.css` | Aplica sticky ao grupo anterior, define as camadas e desativa a fixação com movimento reduzido. |
| `ArcScroll.tsx` | Calcula o progresso, desenha a máscara do fundo e controla a entrada dos elementos. Não desloca as secções anteriores. |

A máscara é uma superfície fixa na viewport, com a cor real da secção de entrada. Apenas o fundo acompanha a curva. O conteúdo da próxima secção permanece oculto durante esta fase.

O intervalo total continua a ser aproximadamente uma altura da viewport. O arco ocupa os primeiros 78% desse intervalo. A entrada dos elementos começa aos 80% e termina aos 100%, com deslocamento ascendente de até 32 px, revelação local e pequeno desfasamento entre elementos. A opacidade permanece a 1; não existe fade. O movimento local usa recorte próprio, separado da máscara do arco.

O progresso acompanha o scroll nos dois sentidos com suavização de aproximadamente 65 ms. Um `ResizeObserver` acompanha o tamanho do conteúdo e há recálculo no resize. Listeners, observadores, frames pendentes e propriedades temporárias são removidos no cleanup. Com `prefers-reduced-motion`, os grupos ficam estáticos e o conteúdo é apresentado sem animação.

A transição de navegação entre páginas é um mecanismo separado; esta correção atua apenas nas duas transições da landing page.

## Verificação

Foram recolhidas mais quatro amostras de 100 frames com gestos de roda para a frente e para trás:

| Viewport | Transição | Leituras fora da tolerância | Desvio máximo |
| --- | --- | --- | --- |
| 1440 × 1200 | Serviços | 0 / 100 | 0,47 px |
| 1440 × 1200 | O Teu Momento | 0 / 100 | 0,31 px |
| 390 × 844 | Serviços | 0 / 100 | 0,22 px |
| 390 × 844 | O Teu Momento | 0 / 100 | 0,13 px |

A tolerância foi de 2 px; as diferenças residuais são consistentes com arredondamento da geometria.

Outras verificações:

- Posições intermédias nas duas transições: 15%, 40%, 75%, 90% e 100%, seguidas de regresso a 40%.
- Viewports: desktop 1440 × 1200, tablet 768 × 1024 e mobile emulado 390 × 844.
- Medição da posição de todas as secções visíveis no enquadramento inicial, incluindo Hero + O Espaço e galeria + avaliações.
- Verificação de opacidade 1, entrada do conteúdo apenas após o arco, ausência de overflow horizontal, scroll inverso, resize na segunda cena e regresso à primeira.
- Movimento reduzido: ambos os grupos passam a `position: static`.
- Sem erros de execução no browser nas verificações de interação.
- TypeScript e ESLint dos ficheiros alterados aprovados. O último build de produção não está aprovado; ver a pendência abaixo.

Os testes foram executados em Chrome headless. A emulação de viewport não substitui validação em Safari/iOS e Android físicos, nem constitui um benchmark de FPS ou uma garantia de ausência de artefactos em todos os dispositivos.

## Pendência adicional de produção

A validação com `npm run build -- --webpack` compilou a aplicação e passou a fase TypeScript, mas falhou na pré-renderização de `/_global-error` com `usePageTransition requires PageTransitionProvider`.

O ficheiro `app/template.tsx` chama `usePageTransition`; o hook em `shared/ui/PageTransition.tsx` lança uma exceção quando não encontra o contexto. O provider está no layout normal da aplicação. O erro de build indica que o template também está a ser executado num contexto de erro sem esse provider. Esta é uma falha distinta do controlador do arco, que não usa esse hook.

O estado de produção deve permanecer marcado como pendente até resolver essa utilização do contexto no caminho de erro e repetir o build. A correção do arco foi verificada no browser; isso não equivale à aprovação integral do build da aplicação.
