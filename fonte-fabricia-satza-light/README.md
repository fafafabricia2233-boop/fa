# Fabrícia Satza Light

Fonte de marca para a New Hair / Fabrícia Satza.

## Arquivos

| Arquivo | `a` | Quando usar |
|---|---|---|
| `FabriciaSatzaLight-Regular.ttf` | dois andares | Texto corrido, legendas, corpo de carrossel |
| `FabriciaSatzaLightAlt-Regular.ttf` | um andar (geométrico) | Títulos e headlines — é o desenho dos posters de referência |

Nos dois arquivos o recurso OpenType `ss01` alterna entre as duas formas do `a`,
em softwares que suportam recursos tipográficos (Illustrator, InDesign, Figma).

## Base técnica

Construída a partir da **Jost\*** (indestructible type\*), licenciada em
**SIL Open Font License 1.1** — que permite expressamente criar obras derivadas
e renomeá-las. A licença completa está em `OFL.txt` e acompanha os arquivos.

O peso foi instanciado em `wght = 350`, escolhido por comparação de renderização
com a referência visual: é o que mais se aproxima em espessura de haste.

**A fonte original enviada (Futura BT Light, da Bitstream) não foi usada como
fonte de contornos.** Aquele arquivo é software proprietário — "All rights
reserved. Confidential." — e copiar seus glifos para um arquivo renomeado
violaria a licença. Ele serviu apenas como referência de medição e comparação
visual.

## O que foi alterado

Apenas metadata. Nada de desenho, métrica ou espaçamento:

- `name` — Family, Subfamily, Full Name, PostScript Name, Unique ID, Version,
  Designer, Manufacturer, License, License URL, Typographic Family/Subfamily
- `OS/2` — `usWeightClass = 300` (Light), `achVendID = FSAT`
- `DSIG` removida (a assinatura digital deixa de ser válida em qualquer
  arquivo modificado; mantê-la seria um erro técnico)
- Em `...Alt-Regular.ttf`: `cmap` aponta U+0061 para `a.alt` e `ss01` passa a
  fazer o caminho inverso. O glifo `a.alt` já tem kerning próprio no `GPOS`,
  então o espaçamento de pares se mantém.

## Validação

`validate.py` compara os arquivos finais contra a base instanciada e verifica:

- **0 contornos alterados** (comparação byte a byte do `glyf` compilado)
- **0 métricas horizontais alteradas** (`hmtx` idêntico em todos os 535 glifos)
- **210 pares de kerning** preservados no `GPOS`
- **524 codepoints** no `cmap`, sem nenhum caractere faltando entre
  A–Z, a–z, 0–9, acentuados do português, pontuação e símbolos
- Tabelas preservadas: `GDEF GPOS GSUB OS/2 STAT cmap gasp glyf head hhea
  hmtx loca maxp name post prep`
- Estrutura TrueType (`glyf`/`loca`, curvas quadráticas) mantida — sem
  conversão para CFF

Rode com:

```
pip install fonttools
python3 validate.py
```

## Comparação visual

- `comparacao-lado-a-lado.png` — referência × os dois arquivos, com todo o
  alfabeto, números, acentos, pontuação, pares de kerning e as frases de teste
- `zoom-letras-criticas.png` — `a g B R G S ?` em corpo grande

## Reconstruir

```
pip install fonttools
curl -L -o jost.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/jost/Jost%5Bwght%5D.ttf"
python3 build.py
```
