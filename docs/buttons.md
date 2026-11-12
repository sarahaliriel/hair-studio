# Botões

O componente principal é `Button`, em `components/ui/button.tsx`.
Todas as ações da página inicial, serviços e galeria usam este componente,
incluindo marcações, filtros e controlos da galeria.

```tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

<Button onClick={save}>Guardar</Button>
<Button variant="secondary" render={<Link href="/servicos" />}>Explorar serviços</Button>
<Button variant="arrow" aria-label="Ver imagem seguinte" direction="right" onClick={next} />
<Button render={<a href="https://example.com" target="_blank" rel="noopener noreferrer" />}>
  Abrir ligação
</Button>
<Button size="icon" aria-label="Fechar" onClick={close}>✕</Button>
```

O botão apresenta a animação da seta por padrão. Os tamanhos `icon*`
usam uma superfície simples para controlos compactos. `animated={false}`
permite preservar a apresentação de imagens clicáveis na galeria.

As cores usam `--wine`, `--clay` e `--bg`, e a fonte usa `--font-sans`.
Os estilos partilhados estão em `app/globals.css`. Evitar classes antigas
`button`, `text-link` e estilos locais para novas ações.

O componente não exige providers e preserva as props e os eventos do elemento
renderizado. As ligações devem usar `render` para manter a semântica de âncora.

`variant="secondary"` (também `outline`) apresenta apenas texto, fundo transparente
e borda. O texto sai para a direita e uma cópia entra pela esquerda no hover
ou foco; a borda muda para argila. `variant="arrow"` apresenta apenas o círculo
com seta e exige um nome acessível (`aria-label`). A prop `direction` aceita
`up-right`, `left`, `right` e `down`.

Dentro de cards que já são links ou botões, usar `<ArrowCircle />` decorativo,
sem criar outro elemento interativo. Ambos partilham os estilos e a animação.
