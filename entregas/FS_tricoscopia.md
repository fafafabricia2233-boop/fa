# FS_tricoscopia — relatório de entrega

Peça: Reel de **texto fixo** da marca **Fabrícia Satza**. Montada em
17/09/2026. **Não aprovada** — falta a dona avaliar. Não publicada.

Arquivo atual: `projeto-remotion/out/fabricia/FS_tricoscopia_v6.mp4`
As anteriores ficam em `..._v1` a `..._v5` para comparação.

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

---

# v2 (18/09/2026) — mais tricoscopia, e os fios grossos

*"Quarto que mostre mais imagens da tricoscopia por mais tempo, e uma
tricoscopia de fios grossos e bonitos."*

**A tela do tricoscópio passou de UM corte de 2,90 s para DOIS somando
4,90 s** — de 27% para **42%** do tempo de cena.

| | v1 | v2 |
|---|---|---|
| 1 cabelo finalizado | 2,80 s | 2,70 s |
| 2 tricoscopia (rosto) | 2,70 s | 2,30 s |
| 3 exame de perto | 2,30 s | 1,90 s |
| 4 imagem: o couro | 2,90 s | 2,40 s |
| **5 imagem: os fios grossos** | — | **2,50 s** |
| cena | 10,70 s | **11,80 s** |
| total | 12,80 s | **13,90 s** |

Os três planos dela encurtaram um pouco e a peça ganhou 1,10 s no total — em
vez de espremer tudo pra caber na duração antiga.

## Como os "fios grossos e bonitos" foram achados

A fita da tela tem 143 s. A janela **não foi pescada no olho**: medi a fita
inteira em janelas do tamanho do corte, com três sinais por quadro:

- **cobertura de fio** — fração de pixels bem mais escuros que o couro;
- **espessura média** — comprimento médio das corridas escuras ao longo das
  linhas, que é o que "fio grosso" significa em pixel;
- **nitidez** — gradiente médio.

Dez candidatas saíram por cima. Conferidas em folha de contato, **a de 67,8 s
é a única em que os fios ficam grossos, separados, com brilho e sobre couro
limpo do começo ao fim do corte.** As de 36,4 s e 85,8 s têm quadros moles no
meio. E a de 75,0 s tinha a MAIOR espessura medida de todas — porque está
**fora de foco**: borrão engorda o traço. **Sinal sozinho engana; a folha de
contato é que decide.**

## Um ajuste que a imagem nova obrigou

O corte dos fios grossos é couro branco em macro, e derrubou o contraste da
legenda para **4,4:1** — abaixo do piso de 4,5. Duas correções, nesta ordem:

1. **O véu subiu de 0,40 para 0,44** nesta peça. Escurecer o plano estragaria a
   prova, que é justamente o couro limpo e claro — quem cede é o véu.
2. Brilho do plano em −0,09, que de quebra aproximou a luma dele dos outros.

Resultado: **5,1:1**. O `veuDaLegenda()` do padrão ganhou o parâmetro de alfa
para isso, com a nota de quando usá-lo.

## QA da v2

417 frames como no plano · 13,900 s · H.264 High 1080×1920 30 fps constante ·
faixa limitada bt709 · AAC 48 kHz · decodificação limpa · **nenhum frame
preto** · pior contraste da legenda **5,1:1** · emendas 94,2→108,6 ·
109,5→111,7 · 111,3→116,3 · 111,6→101,8.

**Nenhum corte com frame congelado**: conferido no corte dos fios que os
quadros mais lentos (diferença de 0,14 a 0,83 por pixel) são o aparelho
pairando, não repetição — **nenhum par de quadros idênticos**. Legenda, fonte,
grade e fecho não mudaram. Trilha reajustada para os 13,90 s. Não aprovada.

---

# v3 (18/09/2026) — o exame vira gancho, e a palavra em negrito

## 1. A ordem mudou: abre no exame de perto

*"E se o gancho a primeira parte do vídeo for mostrando o exame de perto a luz
na risca aberta."*

| | v2 | v3 |
|---|---|---|
| 1 | cabelo finalizado 2,70 s | **exame de perto 2,10 s** |
| 2 | tricoscopia (rosto) 2,30 s | cabelo finalizado 2,60 s |
| 3 | exame de perto 1,90 s | tricoscopia (rosto) 2,20 s |
| 4 | imagem: o couro 2,40 s | imagem: o couro 2,40 s |
| 5 | imagem: os fios 2,50 s | imagem: os fios 2,50 s |

**Funciona melhor, e a razão é de estrutura:** o exame abre **sem contexto** —
vê-se um exame acontecendo antes de saber de quem é o cabelo e por quê. Quem
dá o contexto é a frase, na leitura, não a imagem. O cabelo bonito, que antes
abria, agora chega como resposta à primeira linha em vez de adiantá-la.

O corte do gancho ganhou 0,20 s (1,90 → 2,10) e o do cabelo perdeu 0,10; o
tempo de tela do tricoscópio ficou intacto em **4,90 s**. Duração total igual:
417 frames, 13,90 s — a trilha não precisou ser refeita.

## 2. A palavra em negrito — e a ressalva

*"Deixe uma palavra de destaque da legenda em negrito igual a referência do
vídeo que te enviei."*

**"couro cabeludo" saiu em negrito.** Como a referência faz: só o peso, na
mesma cor, sem mudar tamanho.

**A ressalva, porque ela é de fonte:** a "Fabrícia" que ela mandou em 16/09 (a
Futura PT) tem **um peso só**. Pedir 500 nela faria o navegador engordar a
forma — negrito sintético, que o manual dela proíbe. Então a palavra sai na
face **Medium da "Fabricia Satza"**, a do kit de 13/09, que é uma **Jost** —
prima da Futura: mesmo esqueleto geométrico, mesmo "a" de um andar.

A diferença medida entre as duas: **altura de x de 24,8 px contra 23,4** a
54 px. Conferido em tamanho real, lado a lado, antes de decidir: **o olho lê
como PESO, não como outra fonte.** Mesmo assim vai como ressalva, não como
solução — o §01 do pedido dela proíbe substituir por fonte visualmente
semelhante, e aqui foi feito numa palavra, sabendo.

**A correção exata é um arquivo:** a Medium (ou Bold) da própria Futura. No dia
em que chegar, é uma linha no plano e um render, e o remendo some.

O motor ganhou o campo `texto.familiaEnfase` pra isso, com a nota de quando
some.

**A linha 3 passou de 580,8 para 600,2 px** com o negrito, e o bloco ficou
548,6 · 540,0 · 600,2 — variação de **10%**, ainda dentro do padrão alinhado
(a referência dela tem 9%).

## 3. QA da v3

417 frames como no plano · 13,900 s · faixa limitada bt709 · decodificação
limpa · **nenhum frame preto** · pior contraste da legenda **5,1:1** · emendas
111,2→104,6 · 101,2→108,7 · 109,7→116,4 · 111,7→102,0 · nenhum corte com frame
congelado.

Fonte reconferida no arquivo entregue: a tinta da linha com o negrito mede
**594 px** contra **600,2** de avanço previsto pela soma das duas faces — bate,
então as duas saíram no arquivo. Não aprovada.

---

# v4 (18/09/2026) — a tricoscopia toma a peça, e a tela aparece como tela

*"Tá pouco tempo mostrando a tricoscopia, tem que mostrar mais tempo, as
pessoas têm que ver um pouco da tela."*

Duas mudanças — e a segunda é a que resolve de verdade.

## 1. Tempo: 4,90 s → 7,70 s

| | v3 | v4 |
|---|---|---|
| 1 exame de perto (gancho) | 2,10 s | 1,90 s |
| 2 cabelo finalizado | 2,60 s | 2,10 s |
| 3 tricoscopia (rosto) | 2,20 s | 1,90 s |
| **4 A TELA, com moldura** | — | **2,20 s** |
| 5 dentro da imagem: o couro | 2,40 s | 2,60 s |
| 6 dentro da imagem: os fios | 2,50 s | 2,90 s |
| **tricoscopia** | 4,90 s (42%) | **7,70 s (57%)** |
| cena | 11,80 s | 13,60 s |
| total | 13,90 s | **15,70 s** |

Os três planos dela encurtaram 0,20 a 0,50 s cada e a peça cresceu 1,80 s.

## 2. A tela agora aparece COMO tela — e era esse o buraco

Nas versões anteriores o recorte entrava tão fundo na imagem que ela lia como
**macro abstrato**: só o plano anterior (ela com o aparelho na cabeça) dizia
que aquilo era a tela de um tricoscópio. Quem entrasse no vídeo pelo meio não
tinha como saber.

Agora o **primeiro** dos três cortes de tricoscopia mostra a **moldura em cima
e embaixo** e um pedaço do suporte. Lê-se "tela" na hora, e os dois seguintes
entram na imagem já sabendo o que é.

**E esse enquadramento é o mais NÍTIDO dos três**, o que é contraintuitivo:
562×1000 no espaço da entrega são **1124 px de largura na fita** — mais que os
1080 da entrega. É o único dos três cortes de tela que **não amplia**: ainda
desce. Os dois macros ampliam 1,40×. Mostrar mais da tela custou menos
resolução, não mais.

Brilho: o corte da tela veio sem ajuste (a moldura preta e o suporte puxam a
média pra baixo sozinhos; com o −0,055 que eu tinha posto, a emenda seguinte
dava salto de 28).

## QA da v4

471 frames como no plano · 15,700 s · H.264 High 1080×1920 30 fps constante ·
faixa limitada bt709 · AAC 48 kHz · decodificação limpa · **nenhum frame
preto** · pior contraste da legenda **4,9:1** (piso 4,5) · emendas 111,5→104,6
· 103,5→108,9 · 109,8→119,2 · 110,2→116,4 · 115,3→102,0 · nenhum corte com
frame congelado.

Legenda, fonte, negrito, grade e fecho não mudaram. Trilha reajustada para os
15,70 s (−16,68 LUFS). Não aprovada.

**Uma ressalva de duração:** 15,70 s é o limite que eu iria sem tirar plano. Se
ela quiser ainda mais tricoscopia, o caminho é **tirar um plano**, não encurtar
mais os outros — abaixo de 1,80 s os cortes com ela começam a passar rápido
demais para se ver o que acontece.

---

# v5 (18/09/2026) — gancho em duas camadas, e o final que demora

Três ordens dela, e a primeira muda a gramática da peça.

## 1. O gancho passou a ter FAIXA MASCARADA

*"Vamos fazer o gancho primeira imagem assim eu mostrando o cabelo finalizado e
uma imagem mascarada em cima mostrando a imagem da tricoscopia de pelos
grossos, pode ser a mesma que vai aparecer no final."*

Feito — e com a técnica que a casa já tinha, não com uma tarja improvisada. A
faixa **dissolve na borda que encosta no cabelo** (180 px de cauda), então a
imagem do tricoscópio **nasce de dentro do cabelo dela** em vez de tapá-lo. É a
mesma regra que vale nas peças faladas desde 14/09/2026 (*"quero que continue
mascarando a imagem junto com minha fala"*), e o motor de texto fixo não a
tinha: agora tem, como `Corte.faixa`.

Faixa: do topo até 620 px, com 180 px de dissolvência na borda de baixo. A
imagem é a **mesma** que fecha a peça (63,50 s da fita da tela), como ela pediu.

**Numa imagem só, o vídeo inteiro:** o cabelo bonito por fora, o couro por
dentro.

## 2. Saiu a tricoscopia de fio ralo

*"Troca a primeira tricoscopia que mostra pelos finos e deixa só a última que é
pelo grosso."*

- O macro do couro com fio ralo (76,6 s) **saiu**.
- A **tela** passou a mostrar fio grosso também: 85,80 s em vez de 104,00 s.

A peça inteira agora só mostra tricoscopia de fio bom.

## 3. O final demora 9,50 s

*"Pode mostrar a tricoscopia de pelos grossos no final por mais de 9 segundos."*

**A janela de 9,5 s foi varrida, não escolhida no olho.** Medi todas as janelas
contínuas de 9,5 s da fita exigindo que **nenhum quadro ficasse sem fio**:

| janela | espessura média | conferência na folha |
|---|---|---|
| **63,5 s** | **20,4** | limpa do começo ao fim ✔ |
| 66,5 s | 18,3 | **dois quadros quase pretos por volta de 73 s** — o aparelho perde contato ✘ |
| 63,5 s (alt.) | 15,9 | menos grossa |

Ficou **63,50 → 73,00 s**. Conferido no corte pronto: 285 frames, **nenhum par
de quadros idênticos**, luma mínima de 80,3 (nenhum quadro escuro).

## Estrutura e duração

| # | | duração |
|---|---|---|
| 1 | **gancho: cabelo + faixa mascarada** | 3,50 s |
| 2 | exame de perto, a luz na risca | 1,90 s |
| 3 | ela levando o tricoscópio ao couro | 1,90 s |
| 4 | a tela, com moldura, em fio grosso | 2,20 s |
| 5 | **macro dos fios grossos** | **9,50 s** |
| | cena | 19,00 s |
| | **total** | **21,10 s** |

Tricoscopia em tela cheia: **11,70 s = 62% da cena** — mais os 3,50 s da faixa
no gancho. Era 7,70 s (57%) na v4 e 2,90 s (27%) na v2.

## QA da v5

633 frames como no plano · 21,100 s · H.264 High 1080×1920 30 fps constante ·
faixa limitada bt709 · AAC 48 kHz · decodificação limpa · **nenhum frame
preto** · pior contraste da legenda **4,8:1** (piso 4,5) · emendas 95,2→111,9 ·
111,5→108,7 · 109,8→104,7 · 112,1→96,8 · nenhum par de quadros idênticos no
corte longo.

Legenda, fonte, negrito, grade e fecho não mudaram. Trilha reajustada para os
21,10 s. Não aprovada.

---

# v6 (20/09/2026) — a gramática da New Hair entra na peça

*"Vamos usar a edição remotion da New Hair para editar os vídeos da Fabrícia
Satza, leia."* Lida a skill `editor-new-hair` inteira e o
`kit-new-hair/GUIA-INTEGRAL.md` (§02–09, §11–12).

**Decisão dela, perguntada antes de mexer:** o texto **continua no padrão
alinhado** e entra só o resto da gramática. Ou seja: **não** entram o título
digitado nem a legenda de rodapé, que exigiriam partir a frase em duas.

## O que entrou

| elemento | onde | de onde vem o número |
|---|---|---|
| **filme** — 7 frames de clarão quente, branco, escuro, preto | frames 98→104 | componente copiado sem alterar do `ReelFalado`, que o copiou do exemplo aprovado (§06: *"não substituir por transição genérica de slideshow"*) |
| **beat na virada** | frame 105 (3,50 s) | §05: recorte da música em (ataque − virada) = 22,855 − 3,50 = **19,355 s** |
| **zoom** 1,02→1,12 em 15 frames, easing u²(3−2u) | plano da tela, frames 259→274 | §04 |
| **SFX filme** | 3,267 s (7 frames antes da virada) | `padroes-audio.json`, ganho 0,36 |
| **SFX zoom** | 8,633 s, no início do empurrão | ganho ajustado — ver abaixo |
| **SFX click** | 9,50 s, entrada do macro | ganho ajustado — ver abaixo |

**A VIRADA é o frame 105.** Numa peça falada a virada é o fim do gancho; aqui,
sem fala, é a troca de assunto da montagem — fim do plano de abertura (cabelo
com a faixa mascarada) e entrada do assunto, ela indo olhar.

**Trilha nova, escolhida pelo critério certo.** O `padroes-audio.json` é
explícito: a faixa se escolhe pela **força da entrada**, e abaixo de ~+13 dB
ela não marca a virada. A `harmony` da v5 tem +10,2 — **não serve para esta
gramática**. Entrou **lostmemories** (+26,7 dB), SHA-256 `a7f613c0…` conferido
contra a curadoria, ataque 22,855 s confirmado pelo `conferir-musica.py`.

Resultado medido no master: música a **−32,2 dBFS** debaixo do gancho e
**−16,7** depois da virada; degrau do beat na virada, na banda grave (<200 Hz):
**+36,9 dB**. O padrão da casa é +13 a +18 — aqui é mais forte porque a música
está praticamente inaudível antes da virada, que é exatamente a forma que o §05
descreve.

**SEM TENSÃO, e é decisão.** O §05 põe o grave na última palavra do PROBLEMA, e
esta peça não tem problema delimitado — a frase é afirmativa do começo ao fim.
Forçar tensão sem problema é inventar estrutura; mesmo caso da NH_velocidade.

## Dois ganhos de SFX tiveram que sair do padrão, e o motivo é medido

Os ganhos do `padroes-audio.json` (filme 0,36 · zoom 0,38 · click 0,30) foram
calibrados num mix **em que a voz é o elemento mais alto** e a música fica 3 dB
abaixo dela. Aqui **não há voz**: a música É a cama, e nos ganhos do padrão os
SFX ficavam ABAIXO dela —

| SFX | folga contra a música, no ganho do padrão |
|---|---|
| filme | −8,2 dB |
| zoom | −9,9 dB |
| click | **−25,3 dB** (inaudível) |

O próprio manual proíbe isso: *"SFX que não se ouve mas continua somando no mix
é pior que SFX nenhum"* (§09). Então:

- **filme: 0,36, o do padrão** — o pico fica 14,6 dB acima da cama, e a cama
  está quieta ali. Não precisou mexer.
- **zoom: 0,38 → 0,60** — pico ~7 dB acima da cama.
- **click: 0,30 → 1,00** — pico ~5 dB acima da cama. Discreto de propósito: o
  pedido dela para estas peças diz *"evite efeitos sonoros chamativos"*.

Registrado aqui porque **o número do padrão continua certo para peça falada** —
o que muda é o contexto, não o arquivo.

## Duas coisas que o filme obrigou a medir

**1. O clarão lava a legenda por 0,23 s.** Na gramática da New Hair o título
**sai** antes do filme (§06: sai entre H−14 e H−7). Aqui o texto é fixo por
escolha dela, então ele atravessa o clarão: nos 3 frames brancos o contraste cai
para **3,3:1**. São 100 ms no meio de uma transição — ninguém lê ali — mas fica
medido e dito. Se incomodar, a correção é o texto sumir nos 7 frames do filme,
e aí ele deixa de ser "fixo do começo ao fim".

**2. O zoom derrubou o contraste fora do filme.** Empurrando de 1,02 a 1,12 no
plano da tela, o couro branco em macro passa a ocupar mais quadro sob a legenda:
o contraste caiu para **4,3:1**, abaixo do piso de 4,5. Véu desta peça subiu de
0,44 para **0,50** e voltou a **5,0:1**.

## Uma armadilha de mux que custou um frame

O `-shortest` trunca o vídeo pelo áudio. O `amix` + limitador devolveu um master
de **21,099979 s** contra os 21,100000 s do vídeo — 21 microssegundos a menos —
e a entrega saiu com **632 frames em vez de 633**. Conserto: `apad` + `-t` no
master antes do mux. **Contar frame da entrega é passo, e foi ele que pegou.**

## QA da v6

**633 frames** como no plano · 21,100 s · H.264 High 1080×1920 30 fps constante
· faixa limitada bt709 · AAC 48 kHz · decodificação limpa · nenhum frame preto ·
pior contraste da legenda **5,0:1 fora do filme** (3,3:1 nos 0,23 s do clarão) ·
áudio da entrega contra o master: correlação **0,9999**, deslocamento
**0,00 ms** · master a **−16,00 LUFS**, pico real **−1,94 dBTP**, LRA 3,20.

Enquadramentos, cortes, grade, fonte e fecho não mudaram. Não aprovada.
