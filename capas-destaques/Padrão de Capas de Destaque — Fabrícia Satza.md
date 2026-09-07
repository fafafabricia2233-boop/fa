# Fabrícia Satza — Padrão de Capas de Destaque (Instagram)

Conjunto de 7 capas de destaque na identidade **Fabrícia Satza | Tricologia e
Queda Capilar** — não na identidade da New Hair FUE (marinho/dourado). As duas
convivem no perfil, mas destaque é peça de perfil pessoal e segue a paleta dela.

Gerar de novo: `python3 capas-destaques/gerar-capas.py` (usa o Chromium do
ambiente; sobrescreve os PNG na própria pasta).

---

## Formato

Arte em **1080 × 1920** (story). O Instagram recorta um **círculo central** de
diâmetro variável — na prática entre 900 e 1010 px, centrado em `y = 960`.

**Regra:** tudo que precisa ser lido cabe num círculo de **900 px** centrado em
`(540, 960)`. Fora dele só entra fundo. O `_preview-como-fica-no-instagram.png`
mostra o conjunto já recortado — é por ele que se aprova, nunca pela arte cheia.

---

## Cores

| Uso | Hex |
|---|---|
| Fundo (marfim quente, com leve degradê radial) | `#F4EFE8` → `#E2D8CB` |
| Ano e palavra — vinho ameixa profundo | `#4A2634` |
| "20" do ano, filetes — terracota suave | `#B06F53` |
| Rótulo pequeno — taupe / nude acinzentado | `#A99B91` |
| Halo do medalhão — champagne | `#C9B39B` |

Sem preto puro e sem branco puro em lugar nenhum.

---

## Fontes

| Onde | Fonte | Peso |
|---|---|---|
| Ano e palavra | **Cormorant Garamond** | 500 |
| Rótulo `TRANSPLANTE CAPILAR` | Montserrat | 300, tracking `.40em` |

Ambas embutidas em base64, vindas de `projeto-remotion/public/newhair/fontes/`.
A Catchy Mager **não entra** aqui — é display da New Hair FUE.

---

## As duas famílias de capa

O conjunto tem duas construções, e é a diferença entre elas que faz o arquivo
cirúrgico se distinguir do conteúdo pessoal já na miniatura.

### A — Capa de ano (arquivo de cirurgias)

- `20` em Cormorant **110 px**, terracota, tracking `.30em`
- Dois últimos dígitos em Cormorant **376 px**, vinho ameixa, entrelinha `.78`
- Filete terracota `96 × 1px`, margem superior `56px`
- Rótulo `TRANSPLANTE CAPILAR` — Montserrat 300, **25 px**, taupe
- Foto ao fundo em marca d'água: opacidade `.22`, sépia, `blur(3px)`

O ano quebrado em `20` / `26` é o detalhe minimalista do conjunto: na miniatura
lê-se só o número grande, que é o que identifica; aberto, lê-se o ano inteiro.

### B — Capa de palavra (conteúdo pessoal)

- Medalhão redondo **560 px** de diâmetro, topo em `y = 558`
  - anel terracota `1px` (60%) + halo champagne `18px` (22%)
  - foto ancorada pelo **rosto**, não pelo centro da imagem
- Filete terracota `60 × 1px` logo abaixo
- Palavra em Cormorant **100 px**, vinho ameixa, CAIXA ALTA

**Corpo tipográfico igual nas três palavras (100 px);** o equilíbrio de largura
vem do espacejamento, não do tamanho — `Bastidores .06em`, `Lifestyle .16em`,
`Viagens .24em`. Assim as três ocupam 557–633 px e o conjunto fica alinhado sem
uma palavra parecer maior que a outra.

---

## O conjunto

| Ordem | Arquivo | Capa | Foto |
|---|---|---|---|
| 1 | `1-bastidores.png` | BASTIDORES — viagem, água de coco, trabalho | em pé, mão no queixo |
| 2 | `2-ano-2026.png` | 2026 | implanter (marca d'água) |
| 3 | `3-ano-2025.png` | 2025 | pinças (marca d'água) |
| 4 | `4-lifestyle.png` | LIFESTYLE — trabalho e vida social | blazer terracota |
| 5 | `5-ano-2024.png` | 2024 | pinças espelhada |
| 6 | `6-viagens.png` | VIAGENS | corpo inteiro |
| 7 | `7-ano-2022.png` | 2022 | implanter espelhada |

A ordem dos arquivos é a ordem em que os destaques devem ficar no perfil —
o Instagram lista da esquerda para a direita pelo último story adicionado.

---

## Regras invioláveis

1. **Nada de texto fora do círculo de 900 px.** Aprovar sempre pelo preview.
2. **Cormorant só no ano e na palavra.** Rótulo é sempre Montserrat 300.
3. **Foto ancorada pelo rosto** no medalhão — `place()` calcula o offset a
   partir de `fx`/`fy`. Centralizar a imagem pelo meio corta o cabelo.
4. **Grão sempre por cima** (`multiply`, opacidade `.09`) — é o que tira a peça
   da aparência de render digital.
5. Sem logo, sem @ e sem moldura decorativa na capa de destaque.
6. Trocar de foto exige remedir `fx`/`fy` no dicionário `FOTOS`.

---

## Compliance

Vale o mesmo do carrossel: sem promessa de resultado, sem antes/depois, sem a
palavra **bisturi**. As capas de ano rotulam apenas a categoria
(`TRANSPLANTE CAPILAR`) — o selo de procedimento vai no story de dentro do
destaque, não na capa.
