# FS_couro_cachos — relatório de entrega

Peça: Reel de **texto fixo** da marca pessoal **Fabrícia Satza | Tricologia e
Terapia Capilar**. Montada em 16/09/2026. **Não aprovada** — falta a dona
avaliar. Não publicada.

Arquivo atual: `projeto-remotion/out/fabricia/FS_couro_cachos_v7.mp4`
As versões anteriores ficam em `..._v1` a `..._v6` para comparação.

---

## 1. Texto na tela

> Eu cuido muito da definição dos meus cachos.
> Mas não deixo o couro cabeludo por último.

Palavra por palavra como veio no pedido. Quebra em unidade de sentido, dois
parágrafos — um por frase — com respiro de 28 px entre eles:

```
Eu cuido muito da definição
dos meus cachos.

Mas não deixo o couro cabeludo
por último.
```

"o couro cabeludo" sai na face **Medium (peso 500 real)** e no champagne. É o
recurso de ênfase que o manual dela descreve; **negrito sintético está
desligado no código** (`fontSynthesis: none`), que é a regra que ela não abre.

Sem animação: o bloco entra no frame 0 e sai no frame 321, sem digitação, sem
palavra a palavra, sem brilho, sem salto. Ele mora **fora** das sequências de
vídeo, então não pisca nas trocas de plano.

## 2. Fontes — o que foi realmente carregado

Família **Fabrícia Satza** (derivada da Jost* sob SIL OFL 1.1), lida do disco
em `projeto-remotion/public/marcas/fabricia/fontes/`:

| face | peso | arquivo | onde entra |
|---|---|---|---|
| Light | 300 | `FabriciaSatzaLight-Regular.woff2` | a frase inteira |
| Medium | 500 | `FabriciaSatzaMedium-Regular.woff2` | "o couro cabeludo" |
| Light Alt | 300 | `FabriciaSatzaLightAlt-Regular.woff2` | declarada, **não usada** nesta peça |

A face **Alt** (o "a" de um andar) é a de display e ficou de fora de propósito:
isto é frase corrida com ponto final, não título, e misturar Alt com Light
trocaria o desenho do "a" no meio da mesma sentença.

**O render espera a fonte.** `src/lib/fabriciaFontesProntas.ts` segura o frame
com `delayRender()` até `document.fonts.load()` resolver as três faces e
`document.fonts.ready` fechar. Sem isso o Chromium mediria o texto com a fonte
de fallback e a quebra de linha sairia diferente, sem erro nenhum.

**Conferência de que a fonte oficial saiu no arquivo** — largura da tinta
medida no frame renderizado contra a métrica do `.ttf` oficial a 54 px:

| linha | previsto pelo .ttf | medido no render |
|---|---|---|
| `dos meus cachos.` | 408,0 px | 401 px |
| `Mas não deixo o couro cabeludo` | 770,7 px | 765 px |

(A tinta fica alguns px abaixo do avanço porque o avanço inclui a lateral
direita da última letra. Fallback daria diferença de dezenas de px.)

**Corpo 54 px**, e o número saiu da conta, não do gosto: margem esquerda 90 +
margem direita 180 deixam 810 px úteis; a linha mais longa mede 770,7 px a
54 px e **827,3 px a 58 px**, que estoura. O piso de texto corrido do manual
dela é 37 px, então 54 passa com folga. Entrelinha 1,46.

## 3. Arquivos usados e os trechos

Todos da pasta do Drive indicada (`1bfbAoD8r0-...`), só cenas da própria
Fabrícia. Nenhuma imagem de banco, nenhuma geração, nenhuma alteração de rosto,
pele, cabelo, textura ou proporção.

| # | pasta / arquivo no Drive | ID | trecho | frames |
|---|---|---|---|---|
| 1 | passando produto no cabelo · "passando protetor termico no cabelo, passando spray protetor no cabelo" | `1ZCxmAleTExcVGIEjWXcSL1jnk8QRAcS-` | 3,70 → 6,50 s | 84 |
| 2 | usando secador · "usando secador no cabelo, dando volume no cabelo crespo" | `1wl0D2pX1UbPrbsNnqlRGw9EMB5T3C6lu` | 68,30 → 71,00 s | 81 |
| 3 | lavando o cabelo · "Massagem craniana estimulando a circulação sanguínea do couro cabeludo" | `1TXQ7rJV4RCD3gVIpDvXdtfdZZqK_V_HE` | 1,00 → 3,60 s | 78 |
| 4 | lavando o cabelo · "Couro cabeludo limpo após lavagem, exibindo couro cabeludo limpo" | `1g_SyoyKOOADHjAPNxK46sfD46ASH1Pz1` | 0,90 → 3,50 s | 78 |

Fonte: todas 4K vertical nativa (3840×2160 com rotação nos metadados, ou seja
2160×3840), reduzidas a 1080×1920 — divisão exata por 2, sem corte e sem
esticar. A ordem segue a frase: dois planos de **definição**, depois a virada
do "mas" em dois planos de **couro cabeludo**.

### O que ficou de fora, de propósito

- **"Fazendo fitagem, finalizando o cabelo"** e **"Mostrando o cabelo
  finalizado"**: a fita mais literal de "definição", mas é gravada **contra o
  espelho** — o tripé e o celular lilás ficam dentro do quadro, e o "CHICAGO"
  da camiseta sai invertido. Espelhar o vídeo consertaria a camiseta e
  inverteria todo o resto; alteração de imagem não se faz sem sua ordem.
- **"mostrando e passando óleo capilar no cabelo e no couro"**: ótima fita,
  câmera direta, e ela pinga o produto na risca — seria o corte 3 ideal. Ficou
  fora por **composição**: o vidro fica na mão, na altura do peito, exatamente
  onde o texto fixo mora. Texto fixo não sai do lugar pra acomodar um corte.
- **"Lavando o cabelo com shampoo... com escova"**: mesma sessão do corte 3 e
  igualmente boa, mas em vários trechos aparece a nuca e as costas nuas no
  chuveiro. O corte 3 diz a mesma coisa enquadrado só na cabeça.
- **Tricoscopia (4 fitas), "Cabelo sujo", "prendendo o cabelo", "pré-poo"**:
  fora do assunto desta frase. O tricoscópio entra quando o tema pede, e aqui o
  tema é rotina em casa, não exame.
- A pasta **"finalizando o cabelo" está VAZIA** no Drive.

## 4. Composição

- Bloco de texto: 1161,6 → 1505 px. Começa muito abaixo dos 220 px de topo e
  sobra **55 px** até os últimos 360 px (1560), onde o Reels desenha nome,
  legenda e áudio. Linha mais longa acaba em **x = 860**; a coluna de botões da
  direita começa em **x ≈ 950**.
- Conferido em prévia com a interface do Reels sobreposta.
- **Véu localizado, não placa**: gradiente de café profundo com platô de 34% a
  74% e **cauda longa nos dois lados** (190 px), morrendo em zero — véu que
  acaba seco em cima de parede lisa vira linha horizontal visível.
- Legibilidade, pior frame de toda a peça: branco suave **7,5:1**, champagne
  **3,9:1** (piso dela: 4,5:1 corrido, 3,0:1 acima de 45 px). Passa.
- Texto nunca cobre olhos, boca nem a região do couro cabeludo demonstrada: em
  todos os quatro cortes a ação está acima do bloco.

### Sem cabeçalho — e por quê

O perfil da marca pede o rótulo "FABRÍCIA SATZA TRICOLOGIA" no alto de toda
peça. **Nesta ele foi desligado**: o rótulo mora a 64 px do topo, que é
exatamente onde o Instagram desenha o próprio "Reels" e o ícone da câmera; e o
pedido fixa área segura com o texto começando abaixo de ~220 px. Descer o
rótulo pra dentro da área segura o joga em cima do cabelo dela, que é o
assunto. A marca fica identificada pela fonte, pelo champagne, pelo café do véu
e pelo lockup do fim.

É uma **chave**, não uma remoção: `cabecalho: true` em
`src/compositions/planoCourroCachos.ts` devolve o rótulo e o véu de topo junto.

## 5. Movimento e cor

- Cortes secos, sem transição, sem flash, sem giro, sem zoom. Movimento é o da
  fita: medido, nenhum dos quatro cortes tem frame parado (movimento mínimo por
  frame de 1,50 a 4,43 numa escala em que "parado" é abaixo de 0,3).
- **Uma única correção de cor na peça**: o corte 2 media luma média 140,8
  contra 128,5 / 126,7 / 128,4 dos outros e saltava mais claro na emenda.
  Brilho 0,95 traz pra ~134. Resultado nas emendas: saltos de 3,0 · 0,7 · 4,7
  de luma média. Nada de suavização de pele, nitidez artificial ou mudança na
  aparência do cabelo.

## 6. Áudio

- **"cosy - lofi type beat (FREE FOR PROFIT USE) - Prod. Riddiman"**.
  SHA-256 `559af21e...` confere com a curadoria de licença do repositório.
- Recorte **97,616 s → 110,416 s**. O 97,616 é tempo forte de compasso (ataques
  de 1,6 em 1,6 s, 75 BPM) e a janela é a mais estável da faixa: desvio de
  2,04 dB contra 3,08 e 4,85 das concorrentes. 12,8 s = **4 compassos exatos**.
- Fade de entrada 0,8 s, de saída 1,2 s. Entrega a **−15,98 LUFS**, pico
  real **−3,42 dBTP**.
- Sem fala inventada, sem clone de voz, sem efeito sonoro.
- O áudio original das fitas ficou mudo: são quatro cenas de duas sessões
  diferentes, e emendar quatro ambientes daria mais salto do que naturalidade.
- **Mixado por fora do Remotion e muxado depois.** Conferido contra o master:
  correlação 1,0000, deslocamento **0,00 ms** — o atraso de 42 ms conhecido do
  render não entra por este caminho.

## 7. Fecho

Dissolvência de 10 frames do último plano para o café profundo `#28201F`,
lockup marfim (620 px) entrando em 18 frames, e o fio de 1 px em champagne
abrindo do centro. **Lockup parado** — a marca dela não tem animação de logo.
63 frames (2,10 s), curto pra não quebrar o ritmo da referência. Sem CTA, sem
assinatura escrita, sem tela de texto.

## 8. Medidas do arquivo entregue

| | |
|---|---|
| contêiner | MP4, `+faststart` |
| vídeo | H.264 High, 1080×1920, **30 fps constante**, yuv420p |
| faixa de cor | **limitada (tv)**, bt709 — igual às entregas anteriores |
| frames | **384**, exatamente o previsto no plano |
| duração | **12,800 s** (10,70 s de cena + 2,10 s de fecho) |
| áudio | AAC-LC 48 kHz estéreo, 194 kbps |
| tamanho | 11,5 MB |
| decodificação | íntegra, sem erro |
| frames pretos | nenhum |
| mídia ausente | nenhuma |

## 9. O que NÃO foi conferido

Não há escuta perceptual aqui. A trilha foi escolhida e posicionada por
**medida** (estabilidade do trecho, tempo forte de compasso, loudness), não por
audição. Mesma coisa para o "como soa": o que está afirmado acima é o que o
número mostra.

## 10. Áudio do Instagram — sugestão

Você pediu que, se houvesse um áudio do Instagram que combinasse, eu mandasse o
nome junto. **Não tenho como verificar o que está em alta no Instagram hoje**
nem confirmar que um áudio existe lá com determinado nome — então não vou
inventar um. O que dá pra dizer com segurança sobre o que combina com esta
peça: trilha **lofi / neo-soul instrumental, sem letra, 70–80 BPM**, porque o
texto é a mensagem e letra cantada disputa com leitura. Se você mandar o nome
de um áudio da biblioteca do Instagram, eu remonto o corte em cima do tempo
dele — os cortes já estão em frames e a troca é direta no plano.

## 11. Para reeditar

Projeto Remotion editável:

- motor: `projeto-remotion/src/compositions/ReelTextoFixo.tsx`
- plano desta peça (é só aqui que se mexe):
  `projeto-remotion/src/compositions/planoCourroCachos.ts`
  — texto, quebras, ênfase, tamanho, posição do bloco, véu, cortes, pontos de
  entrada/saída, correção de cor, trilha, duração e fecho
- cortes prontos: `projeto-remotion/public/fabricia/cortes/`
- render: `npx remotion render src/index.ts FabriciaCouroCachos <saida> --muted`
  e depois o mux com a trilha (comando no CONTINUIDADE.md)

As fitas brutas ficaram em `public/fabricia/bruto/` **fora do git** (1,8 GB) —
baixam de novo com `scripts/baixar-drive.sh <ID> <saida>`.

---

# v2 (16/09/2026) — o que a dona pediu depois de ver a v1

Ela mandou uma quarta referência (uma tricologista falando na câmera) e três
correções. As três estão atendidas e MEDIDAS, não estimadas.

## 1. "a legenda que ela usa é a mesma que a minha, quero a legenda desse jeito"

**Ela está certa, e dá pra provar.** A legenda da referência tem o **"a" de um
andar** — a letra que só existe em Futura/Jost e derivadas. A família dela É
derivada da Jost*. Conferido no arquivo: as três faces do kit
(Light, LightAlt e Medium) saem com o "a" de um andar por padrão, então a
palavra em destaque pode ir no peso 500 **sem trocar o desenho da letra**.

Medido na referência, quadro a quadro:

| o que | medida na referência | o que a peça passou a usar |
|---|---|---|
| altura de x | 17 px num quadro de 720 → 25,5 px em 1080 | corpo **56 px** (altura de x da família = 0,460 em → 55,4 px) |
| largura de "de nutrição de pequi." | 541 px em 1080 | a mesma frase mede 539 px a 58 px na fonte dela |
| razão altura-de-x / ascendente | 0,654 | Jost dá 0,63 · Poppins daria 0,747 → **é Jost** |
| alinhamento | centralizado, eixo em 49,7% | centralizado |
| altura na tela | linha de base a 53% | bloco de 4 linhas em 1100→1444 px |
| cor | branco, sem cor na ênfase | **branco**, ênfase só pelo peso 500 |
| sombra | nenhuma (medido o entorno dos glifos) | nenhuma; véu leve no lugar |

O champagne saiu da ênfase. Ele é a cor da marca sobre fundo escuro, mas aqui
a referência marca a palavra **só pelo peso** — e isso resolve de quebra o
contraste, que com champagne exigia véu pesado.

## 2. "essa edição de imagem, mas sem deixar a pele pesada" / "a pele dela bonita e viva sem manchas"

O grade da referência, medido: `p5=7,4 · p50=111 · p95=166`, sombras quentes
(R−B +11,8), altas **frias** (R−B −3,7). As fitas dela vinham com `p5≈33 ·
p50≈140 · p95≈202` e meio-tom muito quente (R−B de +25 a +42).

**Copiar a referência ao pé da letra é justamente o erro que ela avisou.**
`p50=111` sobre pele parda escurece a pessoa. Então a curva **protege o
meio-tom**: preto fechado só no preto de verdade (0,08→0,05), a faixa onde a
pele mora praticamente intocada (0,45→0,455), e o clima vindo do alto puxado
(0,87→0,795) e da divisão de cor. Testei três curvas lado a lado num close do
rosto antes de escolher.

**Pele sem manchas, sem plástico:** `smartblur` com limiar **negativo**
(`lr=3:ls=0.5:lt=-22`). Limiar negativo alisa só área lisa e preserva borda —
some com mancha e mantém cílio, sobrancelha, fio de cabelo e a armação do
óculos. Comparei três forças num close da testa: `lt=-30:ls=0.8` já deixa
plástico; `-22:0.5` é o ponto.

Resultado medido nos quatro cortes graduados: altas em R−B de −3 a −9 (a
referência dá −3,7) e emendas com salto de luma de 1,0 · 7,5 · 8,7.

## 3. "foque em MIM ou no cabelo, não mostre o fundo nem meu corpo"

Todos os quatro planos foram **reenquadrados**, e isso só é de graça porque a
fita é 4K: 2160×3840 contra 1080×1920 de entrega. Recortando ANTES de reduzir,
um enquadramento bem fechado ainda chega em 1080 de largura com pixel de
sobra — nenhum dos quatro amplia.

| corte | recorte (espaço 1080×1920) | px da fita | o que saiu do quadro |
|---|---|---|---|
| 1 cachos | 788×1400 em (0, 110) | 1576×2800 | barriga, saia branca, cesto de roupa |
| 2 volume | 788×1400 em (76, 90) | 1576×2800 | barriga, saia branca, cadeira |
| 3 massagem | 540×960 em (370, 960) | 1080×1920 | prateleira do chuveiro, ombro, fundo |
| 4 couro limpo | 540×960 em (350, 960) | 1080×1920 | prateleira do chuveiro, braço, fundo |

O corte 4 passou a entrar em **0,70 s** (antes 0,90) pra pegar a risca aberta
antes de a mão cobrir.

Ferramenta nova: `projeto-remotion/scripts/cortar-fabricia.sh` — faz recorte,
redução, grade e pele num passo só, e as coordenadas entram no espaço 1080×1920
(o mesmo das pranchas de conferência), não no da fita.

## QA da v2

384 frames como no plano · 12,800 s · H264 High 1080×1920 30 fps constante ·
faixa limitada bt709 · AAC 48 kHz · decodificação limpa · nenhum frame preto ·
pior contraste da legenda **5,3:1** (piso 4,5:1) · emendas com luma
106,3→105,3 · 104,4→96,9 · 102,1→93,4.

Trilha, fecho e duração não mudaram. **Não aprovada** — falta ela avaliar.

---

# v3 (16/09/2026) — recentrar o assunto

Ordem dela: *"Quero que o foco/couro cabeludo fique no meio da tela, a imagem
está muito pra esquerda, deixe no meio."*

**O centro do assunto se MEDE.** Não dá pra reenquadrar no olho quando quatro
planos têm assuntos diferentes (rosto em dois, couro cabeludo em dois). O que
foi medido, quadro a quadro, no espaço do QUADRO CHEIO (1080×1920):

| plano | como o assunto foi achado | centro medido | centro do recorte v2 | erro |
|---|---|---|---|---|
| 1 cachos | mediana da máscara de pele na metade de cima (o rosto) | x=380 | 394 | quase certo, mas o recorte começava em x=0 e não dava pra deslocar |
| 2 volume | idem | x=580 | 470 | rosto 110 px à esquerda |
| 3 massagem | mediana da ESPUMA (claro + pouco saturado, fora do topo) | x=576 | 640 | ação 64 px à esquerda |
| 4 couro limpo | mediana da massa de cabelo abaixo do topo | x=452 | 620 | cabeça **168 px** à esquerda — o pior, e o que ela viu |

**O recorte do plano 1 não podia só deslizar.** O rosto dela mora a x=380 no
quadro cheio e o recorte já encostava na borda esquerda (CX=0), então empurrar
pra direita era impossível. A saída foi **estreitar**: com largura 756, metade
é 378 — o rosto cai no centro com CX=2. Só dá porque a fita é 4K: 756 no espaço
da entrega são 1512 px na fita, ainda acima dos 1080 nativos.

**De quebra, os recortes da v2 não eram 9:16 exatos.** 788×1400 dá 0,5629
contra 0,5625 de 9:16 — meio pixel de esticada. Os quatro passaram a usar pares
exatos: 756×1344, 792×1408, 540×960, 540×960.

Recortes da v3 (espaço 1080×1920):

| plano | recorte | px na fita |
|---|---|---|
| 1 cachos | 756×1344 em (2, 110) | 1512×2688 |
| 2 volume | 792×1408 em (184, 86) | 1584×2816 |
| 3 massagem | 540×960 em (306, 960) | 1080×1920 |
| 4 couro limpo | 540×960 em (182, 960) | 1080×1920 |

Conferido com uma linha vermelha desenhada no eixo central: nos dois primeiros
ela cai no rosto, no terceiro na espuma sob os dedos, no quarto **em cima da
risca**.

**QA da v3:** 384 frames · 12,800 s · faixa limitada bt709 · decodificação
limpa · nenhum frame preto · pior contraste da legenda 5,4:1 · emendas com luma
106,6→103,0 · 103,2→96,9 · 102,1→88,8. Legenda, grade, trilha, fecho e duração
não mudaram. Não aprovada.

---

# v4 (16/09/2026) — a fonte que ela mandou

Ela enviou `Fabricia-Light_idêntica_a_futura_PT.otf` e disse "use para o vídeo".

**Não é a mesma fonte do ZIP de 13/09, e a diferença tem consequência.**

| | kit de 13/09 ("Fabricia Satza") | a de 16/09 ("Fabrícia") |
|---|---|---|
| origem | derivada da **Jost\*** | **Futura PT** |
| famílias | 3 faces (Light 300, Light Alt 300, Medium 500) | **1 face** (Light 300) |
| altura de x | 0,460 em | **0,433 em** |
| altura de maiúscula | 0,700 em | 0,715 em |
| formato | TTF / woff2 | **OTF (CFF)**, convertida aqui pra woff2 |
| acentos do texto da peça | completos | **completos** (conferido ç ã ú á é ê í ó) |

**O corpo teve que mudar junto com a fonte.** A legenda da referência tem
altura de x de 25,5 px num quadro de 1080. Com altura de x de 0,433 em isso
pede corpo **58,9 px** — contra os 55,4 que a família antiga pedia. Ficou
**58 px**: dá 25,1 px de altura de x e deixa a linha mais longa em 806 px numa
caixa de 840. A 59 caberia, mas com 20 px de folga só.

**Conferido que é ela mesma no arquivo entregue**, não um fallback: a largura
da TINTA da linha "Mas não deixo o couro cabeludo" no frame renderizado mede
**807 px** contra **806,3 px** de avanço previsto pela `.otf`. Fonte errada
daria dezenas de px de diferença.

## A palavra em negrito saiu — e por quê

A referência marca "o couro cabeludo" pelo **peso**. Esta família veio com
**um peso só**. As três saídas possíveis:

1. pedir peso 500 → o navegador **engorda a forma sozinho** (negrito
   sintético), que é o que o manual dela proíbe em letra maiúscula;
2. usar a Medium do kit antigo → dois desenhos de letra na mesma linha, e
   renderizadas lado a lado a Futura PT e a Jost são **visivelmente
   diferentes** (largura da letra e altura de x);
3. tirar a marcação.

Ficou a 3. **Basta mandar a face de ênfase desta mesma família** (Medium,
Book, Demi ou Bold da "Fabrícia") que a palavra volta a ser marcada — é uma
linha no plano.

## Onde a fonte foi instalada

- original: `marcas/fabricia-satza/fontes/instalar/Fabricia-Light.otf`
- para o render: `projeto-remotion/public/marcas/fabricia/fontes/Fabricia-Light.woff2`
- carregador: `src/lib/fabriciaFonts.ts` → `loadFabriciaFutura()`
- o portão de fonte (`fabriciaFontesProntas.ts`) espera por ela antes de pintar
  o primeiro frame, como pelas outras

**Ela NÃO entrou no perfil da marca** (`src/lib/marcas.ts`), de propósito: o
perfil é compartilhado com as peças faladas, que ela não pediu pra mudar. A
peça escolhe a família pelo campo `texto.familia` do plano.

**QA da v4:** 384 frames · 12,800 s · faixa limitada bt709 · decodificação
limpa · nenhum frame preto · pior contraste da legenda 5,5:1 · emendas com luma
106,5→102,9 · 103,1→96,7 · 101,9→88,6. Enquadramento, grade, trilha, fecho e
duração não mudaram. Não aprovada.

---

# v5 (17/09/2026) — abertura trocada: o cabelo finalizado, de costas

Pedido dela: *"Troque esse do início para um vídeo onde estou mostrando o
cabelo bonito finalizado de costas."*

**Entrou:** `Mostrando cabelo bonito finalizado repartindo ao meio o couro
cabeludo` (`1f3khS0vJfGb4O4nw10Z1zh_XJGyOq-T6`), trecho **17,00 → 19,80 s**,
recorte 648×1152 em (126, 768).

Dessa fita, o trecho de 17 a 20 s é o único em que ela está **de costas com o
cabelo inteiro na tela, cheio e em movimento de verdade** (ela levanta e sacode
o cabelo). Os outros trechos bons da mesma fita — 8 a 11 s e 22 a 27 s — são
ela **abrindo a risca**, e isso é o assunto do corte 4; repetir abriria e
fecharia a peça com a mesma imagem.

**Saiu:** `passando protetor térmico` (F, 3,70→6,50). Bom gesto e rosto na
lente, mas é o **processo**; ela pediu o **resultado**. Fica registrado: essa
fita continua boa e pode voltar em outra peça.

**Por que não a outra fita de "cabelo finalizado":** a `M` (`17Te-o8Krs...`)
também é de costas, mas é gravada contra o espelho — o tripé e o celular lilás
entram no quadro. Mesma razão que já tinha barrado ela na v1.

## Duas medidas que o corte novo obrigou

**1. Enquadramento: mais aberto ganhou do mais fechado.** Testei 576×1024 e
648×1152 lado a lado. O fechado vira textura de cabelo e o espectador leva um
tempo pra entender o que está vendo; o aberto mostra a **silhueta** do cabelo e
o ombro, e lê na hora como "ela mostrando o cabelo de costas". Numa abertura de
Reel, o que segura o dedo é reconhecer a imagem no primeiro frame.

**2. A emenda pediu compensação de exposição.** Um quadro cheio de cabelo é
naturalmente mais escuro que um plano de rosto: no primeiro render a emenda do
frame 84 dava **80,0 → 102,9** (salto de 23). Não é defeito de grade, é
conteúdo — mas 23 se vê. Ajustado com brilho +0,045 no corte 1 e −0,075 no
corte 2, o salto caiu pra **6,6**, e conferido num close que o cabelo **não**
lavou.

Emendas da v5: 89,3→95,9 · 96,2→96,7 · 101,9→88,6.

**QA:** 384 frames · 12,800 s (a duração não mudou: o corte novo tem os mesmos
84 frames) · faixa limitada bt709 · decodificação limpa · nenhum frame preto ·
pior contraste da legenda **5,9:1** · nenhum dos quatro cortes com frame parado
(movimento médio 14,7 · 5,6 · 13,2 · 5,5). Legenda, fonte, trilha e fecho não
mudaram. Não aprovada.

---

# v6 (17/09/2026) — a abertura afastou

*"No primeiro vídeo está muito perto, não tá dando pra ver o cabelo todo,
afasta mais um pouco."* Ela está certa: na v5 o recorte era 648 de largura e o
cabelo mede **~800 px** de largura na fita. Faltavam 150 px de cabelo dos dois
lados; o que se via era textura, não a silhueta.

**Recorte novo: 810×1440 em (0, 480)** — antes 648×1152 em (126, 768).

**A largura é o número que manda, e 9:16 amarra o resto.** Medido nos quadros
do trecho: o cabelo ocupa x≈0→800 e y≈735→1570. Pra caber a largura de 800 o
recorte precisa de 810; e como a proporção é fixa, 810 de largura obriga
**1440 de altura**. Só existe 1920 de altura na fita, então o alto do recorte
tem que começar em 480 — acima da barra do boxe, que mora em y 690→770.

**Ou seja: não dá pra ver o cabelo inteiro E tirar a barra.** O cabelo é quase
quadrado (800×835) e o quadro é 9:16; qualquer recorte que contenha a largura
dele sobra altura, e a fita não tem céu suficiente abaixo da barra pra
preencher. Testei três larguras lado a lado em três instantes do trecho:
o de 864 ainda deixa entrar o braço dela à direita; o de 810 mostra o cabelo
inteiro com a barra reduzida a uma diagonal discreta no alto. Ficou o 810.

**A compensação de exposição da v5 teve que ser desfeita.** O recorte mais
aberto pega mais parede branca, e o corte 1 passou de 89 pra 118 de luma média
com o mesmo +0,045 de brilho. Tirado o reforço (corte 1 sem ajuste, corte 2 de
volta a −0,065), as emendas ficaram **melhores do que nunca**:

| emenda | v5 | v6 |
|---|---|---|
| corte 1 → 2 | 89,3 → 95,9 (6,6) | **98,9 → 97,9 (1,0)** |
| corte 2 → 3 | 96,2 → 96,7 (0,5) | **98,2 → 96,7 (1,5)** |
| corte 3 → 4 | 101,9 → 88,6 (13,3) | 101,9 → 88,6 (13,3) |

Lição: **compensação de emenda é refém do enquadramento.** Mudou o recorte,
remede o brilho — herdar o número de antes empurra o plano pro lado errado.

**QA:** 384 frames · 12,800 s · faixa limitada bt709 · decodificação limpa ·
nenhum frame preto · pior contraste da legenda **5,7:1** · nenhum corte com
frame parado (movimento médio 11,6 · 5,6 · 13,2 · 5,5). Legenda, fonte, grade,
trilha e fecho não mudaram. Não aprovada.

---

# v7 (17/09/2026) — legenda "alinhadinha"

*"Quero que a legenda fique bonita alinhadinha minimalista aesthetic desse
jeito aqui"*, apontando a rotina no chuveiro (o mesmo arquivo da referência 3
da primeira conversa — md5 idêntico).

**O que faz aquela legenda parecer "alinhadinha" não é a quebra em unidade de
sentido — é a FORMA DO BLOCO.** Medidas as linhas dela em 1080 de largura:
**618 · 566 · 567 · 596 px**. Variação de 9%. E para conseguir isso ela quebra
em cima de palavra pequena de propósito: as linhas terminam em *"but"* e em
*"to"*.

A legenda da v6 tinha **661 · 420 · 806 · 255** — variação de **48%**. Daí a
sensação de bagunça, mesmo com cada linha sendo uma unidade de sentido.

**Quebra nova, escolhida medindo todas as divisões possíveis contra o arquivo
da fonte:**

```
Eu cuido muito da            413 px
definição dos meus cachos.   625 px
Mas não deixo o couro        525 px
cabeludo por último.         473 px
```

Variação **212 px** contra 386 da v6. O preço é a linha 1 acabar em "da" — que
é exatamente o que a referência faz. Testei também a versão de 6 linhas (a mais
equilibrada de todas, variação 132) e a de quebras "limpas": a de 6 fica
picotada e alta, a "limpa" volta a ser ragged. A de 4 acima é a que o olho lê
como bloco.

**Outras duas medidas copiadas da referência:**

| | referência | v6 | v7 |
|---|---|---|---|
| passo entre linhas | 51 px (razão 1,06) | 82 px (1,42) | **66 px (1,22)** |
| linha mais larga | 618 px | 806 px | **625 px** |
| respiro entre frases | nenhum (bloco corrido) | 26 px | **nenhum** |

**1,22 e não 1,06 porque o português tem acento.** Medido a 54 px: com 1,22
sobram 17 px entre o descendente de uma linha e o til de "definição" na
seguinte. Mais apertado que isso e eles se encostam — a referência é em inglês
e não tem esse problema.

Bloco: 264 px de altura, em 1134→1398 px. Véu estreitado junto (1100→1420).

## O que NÃO foi copiado, e por quê

**A letra da referência é uma SERIFADA** — uma serifada de livro, tipo Times,
com serifa marcada e aspa curva. Não é a "Fabrícia Light / Futura PT" que ela
mandou ontem e mandou usar. **Mantive a fonte dela.** O §01 do pedido original
é explícito: *"Não deduza a fonte pelo nome da marca. Não substitua por uma
fonte visualmente semelhante."* Trocar a identidade tipográfica dela pela de
uma referência é decisão da dona, não do editor.

Se ela quiser a letra serifada também, **basta mandar uma serifada para a
marca** — é o mesmo caminho da OTF de ontem e sai num render.

**A cor também não:** a referência é texto ESCURO sobre azulejo claro. As
quatro cenas daqui são cabelo escuro e espuma; texto escuro sumiria. Fica
branco.

**QA:** 384 frames · 12,800 s · faixa limitada bt709 · decodificação limpa ·
nenhum frame preto · pior contraste da legenda **5,4:1** · emendas 99,4→98,8 ·
99,0→97,1 · 102,5→88,3. Fonte reconferida no arquivo entregue: tinta da linha 2
mede **623 px** contra **625,0** previstos pela `.otf`. Enquadramento, grade,
trilha e fecho não mudaram. Não aprovada.
