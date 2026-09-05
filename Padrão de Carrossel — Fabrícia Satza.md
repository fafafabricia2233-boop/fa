# Padrão de Carrossel — Fabrícia Satza

Marca **pessoal**: tricologia e queda capilar. `@fabriciasatza`

> Esta é uma identidade separada da New Hair. Não misture as duas.
> A New Hair é fundo escuro + dourado + Montserrat/Catchy Mager, e continua
> exatamente como está. A Fabrícia Satza é o oposto: clara, editorial, uma
> fonte só. Se um slide pode ser confundido com o da outra marca, está errado.

---

## Arquivos

| Arquivo | Papel |
|---|---|
| `Carrossel Template Base — Fabrícia Satza.html` | Template dos 6 slides. Fonte embutida, abre offline, exporta ZIP. |
| `fonte-fabricia-satza-light/` | Os `.ttf` para instalar (Canva, Word, Illustrator) + licença |
| `projeto-remotion/src/lib/fabriciaFonts.ts` | Carrega a fonte nos vídeos |
| `projeto-remotion/src/lib/fabriciaMarca.ts` | Cores e escala tipográfica dos vídeos |

---

## Tipografia

Uma família só: **Fabrícia Satza Light**. Não acrescente uma segunda fonte —
a marca se sustenta no contraste de *tamanho* e *tracking*, não de famílias.

| Uso | Família | Por quê |
|---|---|---|
| Títulos e display | `Fabricia Satza Light Alt` | `a` de um andar, o desenho dos posters da marca |
| Texto corrido e rótulos | `Fabricia Satza Light` | `a` de dois andares, lê melhor em corpo menor |

**A fonte é Light.** Ela vive de espaço em volta. Nunca desça de 30px em peça
1080px de largura, e nunca aperte o `line-height` abaixo de 1.3 em texto corrido.

### Escala (peça 1080×1350)

```
display        116px   line-height 1.04    gancho da capa
título          92px   line-height 1.08    abertura de slide
subtítulo       54px   line-height 1.32    apoio do gancho
corpo           46px   line-height 1.42    texto e itens de lista
corpo pequeno   38px   line-height 1.46    nota, ressalva
legenda/rótulo  30px   tracking .30em      CAIXA ALTA
assinatura      26px   tracking .22em      CAIXA ALTA, rodapé
```

### O rótulo em caixa alta é a assinatura da marca

`QUEDA CAPILAR`, `O QUE OBSERVAR`, `POR QUE ACONTECE`. Caixa alta,
tracking `.30em`, cor suave. É o elemento que amarra a identidade — todo slide
interno começa com um. Duas ou três palavras, nunca uma frase.

---

## Cores

```
--creme         #FDFCF8   fundo padrão
--creme-quente  #F7F4EC   fundo alternado, para dar ritmo
--tinta         #23272F   texto
--tinta-suave   rgba(35,39,47,.58)   secundário
--taupe         #B9A492   ÚNICO acento
```

**Regra do taupe:** ele aparece como filete de 1px, número de lista, ou uma
palavra destacada dentro da frase. **Nunca preenchendo área.** No momento em
que o taupe vira bloco ou botão, a peça deixa de parecer da marca.

Fundo escuro (`--tinta`) só no slide de virada, **no máximo um por carrossel**.
Ele existe para marcar a frase que você quer que a pessoa lembre.

---

## Estrutura dos 6 slides

| # | Papel | Regra |
|---|---|---|
| 01 | **Capa** | Só o gancho. Máximo respiro. Nada de logo, nada de CTA. |
| 02 | **Contexto** | Uma ideia, centralizada entre dois filetes. Frase curta. |
| 03 | **Lista** | 3 itens numerados em taupe. Nunca mais de 4. |
| 04 | **Desenvolvimento** | O conteúdo denso. Título + corpo + nota. |
| 05 | **Virada** | Fundo escuro. A frase que resume tudo. |
| 06 | **Chamada** | Sem botão, sem caixa. O @ grande e o filete. |

O gancho da capa cabe em **até 3 linhas de ~18 caracteres**. Se não couber,
o problema é o texto, não o tamanho da fonte — reescreva mais curto.

---

## Tom de escrita

A tipografia é calma; o texto precisa ser também.

- Frase curta. Ponto final. Sem exclamação.
- Sem emoji, sem `👇`, sem "ARRASTA PRA VER".
- Sem promessa de resultado. É conteúdo clínico, não anúncio.
- Explique o mecanismo, não só o sintoma. É o que diferencia o perfil.
- A seta `→` no rodapé já diz que tem mais. Não escreva "arrasta".

---

## Como usar o template

1. Abra o `.html` no navegador (funciona offline, a fonte está dentro dele).
2. Substitua os `{{PLACEHOLDERS}}` no HTML.
3. Clique em **Baixar ZIP com 6 slides** — sai em PNG 2160×2700 (`scale: 2`).

Destaque uma palavra em taupe com `<em>`:

```html
<div class="subtitulo">Ele foi <em>afinando</em> — e isso muda tudo.</div>
```

Para mais ou menos itens na lista, duplique ou remova o bloco:

```html
<div class="item"><div class="item-num">04</div><div class="item-txt">…</div></div>
```

---

## Como usar nos vídeos (Remotion)

```tsx
import { loadFabriciaTitulo, loadFabriciaTexto } from "../lib/fabriciaFonts";
import { CORES, ESCALA } from "../lib/fabriciaMarca";

const { fontFamily: titulo } = loadFabriciaTitulo();
const { fontFamily: texto } = loadFabriciaTexto();

<AbsoluteFill style={{ backgroundColor: CORES.creme }}>
  <h1 style={{ fontFamily: titulo, fontSize: ESCALA.display, color: CORES.tinta }}>
    Miniaturização
  </h1>
</AbsoluteFill>
```

As fontes são lidas do disco (`public/fabricia/fontes/`), pelo mesmo motivo do
`newhairFonts.ts`: o Chromium do Remotion não alcança o `fonts.gstatic.com`
neste ambiente.

**No vídeo, a fonte Light pede corpo maior.** Em reel 1080×1920, o mínimo
confortável de legenda é 44px, não 30px.

---

## Licença

A fonte é derivada da **Jost\*** sob **SIL OFL 1.1** — uso comercial liberado,
inclusive para clientes. A única obrigação é distribuir o `OFL.txt` junto
quando você **entregar o arquivo da fonte** para alguém. Publicar posts e
vídeos feitos com ela não exige nada.
