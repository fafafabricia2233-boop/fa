# FS_tricoscopia v1 — relatório de entrega

Peça: Reel de **texto fixo** da marca **Fabrícia Satza**. Montada em
17/09/2026. **Não aprovada** — falta a dona avaliar. Não publicada.

Arquivo: `projeto-remotion/out/fabricia/FS_tricoscopia_v1.mp4`

---

## 1. Texto na tela

> Meu cabelo está bonito. Mesmo assim, eu quero olhar o couro cabeludo...

Pelo **padrão de legenda alinhada** salvo em 17/09. A quebra saiu da
ferramenta, não do olho:

```
python3 scripts/quebrar-legenda.py "<o texto>" --corpo 54 --caixa 840
```

```
Meu cabelo está bonito.       548,6 px
Mesmo assim, eu quero         540,0 px
olhar o couro cabeludo...     580,8 px
```

Variação de **41 px = 7%** — melhor até que os 9% da referência dela. E, de
brinde, **cada linha caiu numa unidade de sentido inteira**. Nem sempre dá as
duas coisas ao mesmo tempo; aqui deu, porque a frase tem três orações de
tamanho parecido.

Fonte "Fabrícia" (a Futura PT que ela mandou), 54 px, entrelinha 1,22,
centralizada, branco suave, sem ênfase (a família tem um peso só).

**As reticências:** ela escreveu nove pontos. Ficaram **três** — a reticência
tipográfica. Nove pontos brigam com o "minimalista" e com o "frase curta, ponto
final" do tom de voz dela. Reversível numa linha.

## 2. Arquivos usados e os trechos

| # | pasta / arquivo no Drive | ID | trecho | recorte | frames |
|---|---|---|---|---|---|
| 1 | Mostrando o cabelo · "Mostrando cabelo bonito finalizado…" | `1f3khS0vJfGb4O4nw10Z1zh_XJGyOq-T6` | 17,00→19,80 s | 810×1440 em (0, 480) | 84 |
| 2 | Tricoscopia · "Tricoscopia cabelo limpo" | `1VF0yXVTLDt2X_tOgknjDqu8iDlDrYRGe` | 4,00→6,70 s | 882×1568 em (59, 285) | 81 |
| 3 | Tricoscopia · "Tricoscopia cabelo limpo" | `1VF0yXVTLDt2X_tOgknjDqu8iDlDrYRGe` | 42,00→44,30 s | 576×1024 em (272, 260) | 69 |
| 4 | Tricoscopia · "Tricoscopia do couro cabeludo limpo" | `1sMIzGI1f7w1rt2Hkkbp55xGZm4dem9tu` | 76,60→79,50 s | 387×688 em (458, 755) | 87 |

**A montagem é a frase, em três batidas:** o que ela tem (cabelo bonito) → o
que ela faz apesar disso (leva o tricoscópio ao couro) → o que ela vê (a
imagem). O corte 3 entra sem o rosto de propósito: ali o assunto é o couro.

### O que ficou de fora, de propósito

- **"Fazendo tricoscopia no cabelo limpo"**: mesmo gesto do corte 2, mas
  gravada **contra o espelho** — o "CHICAGO" da camiseta sai invertido.
- **"Tricoscopia couro cabeludo sujo descamando seborreia"**: é couro sujo com
  descamação. A frase diz que o cabelo está bonito; abrir a imagem num couro
  descamando **contradiz o texto** e vira outro assunto. Guardada — dá uma peça
  boa sozinha, com outra frase.
- **O resto da fita da tela**: são 143 s, e a maior parte está fora de foco ou
  com o aparelho correndo rápido demais. A janela foi escolhida **medindo**
  nitidez e movimento quadro a quadro, não pescada no olho.

## 3. O corte 4 é filmagem de tela — e isso custou

A fita do tricoscópio é a tela filmada de lado: tela inclinada, moldura preta
em volta, ícones da interface à esquerda e um botão ciano de câmera à direita.
O recorte entra **dentro da imagem** (387×688 no espaço da entrega = 774×1376
px na fita) e por isso **amplia 1,40×**. É o único plano da peça que amplia; os
outros três descem de 4K com pixel de sobra.

Vale porque o conteúdo é textura macro, onde a maciez lê como pouca
profundidade de campo — e porque não existe enquadramento maior dentro da tela
sem pegar moldura ou botão. Três tentativas de recorte foram descartadas por
deixarem entrar a moldura preta numa ponta ou noutra; o quarto foi conferido em
oito instantes do trecho.

## 4. Composição

- Bloco de 3 linhas (197,6 px) em **1317 → 1515 px**.
- Mais baixo que na FS_couro_cachos, e por um motivo medido: o corte 2 tem o
  rosto dela grande no meio do quadro, e a 1150 a legenda caía **em cima da
  boca**. O enquadramento do corte 2 foi refeito junto (882×1568 em vez de
  792×1408) pra levantar o rosto e liberar a faixa.
- Sobram 45 px até os últimos 360 px, onde o Reels desenha nome e legenda.
- Pior contraste da legenda na peça inteira: **5,2:1** (piso 4,5:1).

## 5. Cor e som

Mesma grade das peças anteriores (curva que protege o meio-tom da pele,
sombra quente / alta fria, `smartblur` de limiar negativo). Só o nivelamento de
exposição muda por plano: +0,023 · −0,058 · −0,02 · −0,062. Emendas de luma
medidas na entrega: **101,4→109,1 · 110,2→112,1 · 109,1→117,1**.

Trilha **diferente da peça anterior**, como manda a rotação: "harmony - lofi
type beat (FREE FOR PROFIT USE) - Prod. Riddiman", SHA-256 `1f9feee1…`
conferido contra a curadoria. Recorte a partir de **88,112 s**, tempo forte de
compasso (compasso de 3,04 s, ~79 BPM). Master a **−16,00 LUFS**, pico real
**−5,93 dBTP**, mixado por fora e muxado depois.

## 6. Medidas do arquivo entregue

MP4 `+faststart` · H.264 High · 1080×1920 · **30 fps constante** · yuv420p ·
faixa **limitada (tv)** bt709 · **384 frames** como no plano · **12,800 s** ·
AAC-LC 48 kHz estéreo · 18 MB · decodificação íntegra · **nenhum frame preto** ·
nenhum corte com frame parado.

## 7. O que NÃO foi conferido

Não há escuta perceptual aqui: a trilha foi escolhida e posicionada por medida.
E a leitura clínica das imagens do tricoscópio não foi feita nem afirmada — a
peça não diz nada sobre o que aquelas imagens mostram, de propósito.
