---
classe: REGRA
frescor: FRESH
confianca: fato
---

# Fabrícia Satza — Reel de texto fixo, legenda minimalista

> Destilado em 22/09/2026 do que foi MEDIDO nas peças FS_couro_cachos (v1→v7) e
> FS_tricoscopia (v1→v7), editadas em Remotion entre 16 e 21/09/2026. É a marca
> DELA, não a New Hair: a gramática de montagem é a mesma casa, a identidade não
> se empresta (`kit-new-hair/GUIA-INTEGRAL.md` §01). Íntegra técnica em
> `CONTINUIDADE.md` e `entregas/FS_*.md`; a fonte do padrão de legenda mora em
> código, em `projeto-remotion/src/lib/legendaFabricia.ts`.
> **Nenhuma peça deste formato foi aprovada ainda.**

## 1. O que é este formato

Rotina filmada, **sem ninguém falando**, com **uma frase fixa na tela do começo
ao fim**. Não é legenda que acompanha fala: é texto que fica. Motor
`ReelTextoFixo.tsx`, irmão do motor falado.

- A frase é **dela, palavra por palavra**. Não se reescreve, não se resume.
- **Nada de fala inventada, nada de voz clonada, nada de imagem gerada.**
- Só cenas dela. Rosto, pele, cabelo, textura, volume e proporção preservados.
- 1080×1920, 30 fps.

## 2. A legenda alinhada — o padrão salvo

O que o olho lê como "alinhadinha" é a **variação de largura entre as linhas**,
não a quebra em unidade de sentido. A referência que ela mandou quebra em cima
de palavra pequena de propósito.

| elemento | valor | de onde vem |
|---|---|---|
| corpo | **54 px** | medido na referência, convertido para 1080×1920 |
| entrelinha | **1,22** | **piso**, não gosto: a 54 px sobram 17 px entre o descendente de uma linha e o til da seguinte. Abaixo disso encostam. A referência usa 1,06, mas é texto em inglês |
| margem esquerda | 90 px | |
| margem direita | 150 px | os controles do Reels moram ali |
| caixa útil | 840 px | 1080 − 90 − 150 |
| alinhamento | centro | |
| cor | branco suave `#FCFAF7` | 15,3:1 sobre o café do véu |
| caixa, sombra, respiro entre frases | **nenhum** | é um bloco corrido só |

**A quebra se calcula, não se escolhe no olho:**
`python3 scripts/quebrar-legenda.py "<a frase inteira>" --corpo 54 --caixa 840`
mede todas as divisões possíveis contra o ARQUIVO da fonte e devolve a mais
equilibrada de cada contagem de linhas.

- Escolher a de **menor variação** que ainda cabe na caixa.
- Abaixo de ~25% já lê como bloco; acima de ~40% lê como bagunça.
- Referência: 9%. FS_tricoscopia: 7% (e, de brinde, cada linha caiu numa unidade
  de sentido inteira — nem sempre dá as duas coisas).
- Linha que estoura a caixa: recusada. Frase que começa no meio de uma linha:
  recusada. Viúva: penalizada.

**`bottom` é o único número que muda por peça**, porque depende de onde o rosto
e o assunto caem no enquadramento. Área segura: o bloco começa **abaixo de
220 px** e termina **acima de 1560 px** (os últimos 360 px do Reels são da
interface).

## 3. A letra

| | |
|---|---|
| família | **"Fabricia"** — a Futura PT do arquivo `Fabricia-Light_idêntica_a_futura_PT.otf` [16/09/2026: *"use para o vídeo"*] |
| peso | 300, e é o único que existe nesse arquivo |
| altura de x | **0,4330 em** (medida com fontTools) |
| ênfase | face **Medium da "Fabricia Satza"** (a do ZIP de 13/09, derivada da Jost*), peso 500 **real**, tamanho **×0,9413** |

**Negrito sintético é proibido** — pedir peso 500 de uma família que só tem 300
faz o navegador engordar a forma e destrói o desenho da letra. Por isso a ênfase
sai numa família que TEM a Medium desenhada. Prima geométrica: mesmo esqueleto,
mesmo "a" de um andar. Some no dia em que chegar a Medium/Bold da própria Futura.

**Trocar de família obriga a recalcular tamanho pela altura de x.** A escala do
manual dela (37 de piso · 45 "texto" · 52 "subtítulo" · 88 "título") foi escrita
para a família do ZIP, que tem x de 0,4600 em. O mesmo px na Futura desenha letra
6% menor. Fator **×1,0624**. Caixa alta (cabeçalho, selo) não muda: ali governa a
altura de maiúscula, onde a diferença é 2%.

**O render espera a fonte carregar.** `delayRender` até `document.fonts.load()`
resolver para todas as faces. Sem isso o Chromium mede o texto com a fonte de
fallback e a peça sai com a tipografia errada **sem erro nenhum**.

## 4. O véu, e como se prova que o texto está legível

Gradiente de **café profundo `#28201F`** com cauda longa dos dois lados, nunca
placa. Cauda de 190 px: véu que acaba seco em cima de parede lisa vira **linha
horizontal visível**.

| alfa | quando |
|---|---|
| 0,40 | padrão — o mínimo medido sobre a camiseta verde-clara |
| 0,44 → 0,56 | plano claro (couro branco em macro), e mais ainda se houver zoom |

**Contraste se mede DEBAIXO DO GLIFO, não na faixa inteira.** O método:
renderizar a peça **duas vezes**, uma com legenda e outra sem, subtrair as duas
para saber quais pixels são letra (~9,5% da caixa), e medir o fundo só ali.
Piso: **4,5:1**.

Medir a faixa inteira mente nos dois sentidos — o percentil alto pega a própria
letra branca. Foi assim que a FS_tricoscopia v6 declarou 5,0:1 onde o valor real
era **4,12:1** [21/09/2026].

**Quem sobe é o véu, nunca o plano.** Escurecer a imagem estraga a prova — o
assunto é justamente o couro limpo.

## 5. A imagem

**Enquadramento — ordem dela [16/09/2026]:** *"quero que foque sempre em MIM ou
no cabelo, no que o vídeo está falando; não gosto que mostre o fundo ou mostre
meu corpo."* Nada de fundo, nada de corpo, nada de roupa íntima no quadro.

- **Recortar da fita 4K ANTES de reduzir.** A fita é 2160×3840 e a entrega
  1080×1920: sobra exatamente 2×. Enquadramento fechado ainda chega em 1080 com
  pixel de sobra, em vez de ampliar um arquivo já reduzido.
- **Pares 9:16 exatos**, sempre pares: 756×1344 · 792×1408 · 810×1440 · 882×1568 ·
  576×1024 · 562×1000 · 540×960 · 387×688. 788×1400 dá 0,5629 contra 0,5625 —
  meio pixel de esticada.
- **Centrar o assunto se MEDE**: máscara de pele para rosto, brilho da espuma
  para massagem, massa escura para cabeça.
- **Janela longa: o pior quadro decide, não a média.** Para os 9,5 s do final da
  FS_tricoscopia o critério foi "nenhum quadro sem fio", não "maior espessura
  média" — foi isso que separou a janela limpa da que tinha dois quadros quase
  pretos.
- **A maior espessura medida pode estar FORA DE FOCO** — o desfoque engorda o
  traço. A folha de contato decide, não o número.

**Grade — ordem dela [16/09/2026]:** *"com essa edição de imagem, mas sem deixar
a pele pesada"* e *"a pele dela bonita e viva sem manchas"*.

```
curves=m='0/0 0.08/0.05 0.25/0.245 0.45/0.455 0.70/0.665 0.87/0.795 1/0.95'
colorbalance=rs=0.03:bs=-0.015:rm=-0.055:gm=-0.008:bm=0.035:rh=-0.035:bh=0.05
eq=saturation=0.98
smartblur=lr=3:ls=0.5:lt=-22
```

- A curva **protege o meio-tom da pele de propósito** (0,45→0,455, intocado).
  Copiar a referência ao pé da letra (p50=111, p5=7) escurece a pele dela: é
  exatamente o "não deixe a pele pesada". **O clima vem da COR, não de apagar a
  pessoa.**
- O `smartblur` com **limiar NEGATIVO** só alisa área lisa e preserva borda: some
  com mancha e mantém cílio, sobrancelha, fio e armação de óculos. `-30/0.8` já
  deixa plástico; `-22/0.5` é o ponto medido.
- `fps=30` no meio da cadeia. Fita de 60 fps sem isso entrega o dobro de frames.

## 6. A gramática que veio da New Hair [20/09/2026]

Ordem dela: *"vamos usar a edição Remotion da New Hair para editar os vídeos da
Fabrícia Satza"*, e depois a escolha: **texto alinhado + o resto da gramática**.
Ou seja, **não** entram o título digitado nem a legenda de rodapé — os dois
exigiriam partir a frase em duas.

| elemento | regra |
|---|---|
| **a virada** | numa peça sem fala é a **troca de assunto da montagem**, não o fim de um gancho falado. Peça sem virada marcada: `hookEnd: null`, e **não se inventa uma** |
| **filme** | 7 frames de clarão quente, branco, escuro, preto, imediatamente antes da virada. Componente copiado **sem alterar** — não se troca por transição genérica |
| **zoom** | 1,02 → 1,12 em 15 frames, easing u²(3−2u). Poucas alternâncias: um por peça |
| **música** | escolhida pela **FORÇA DA ENTRADA**, não pelo nível médio. Abaixo de ~+13 dB a faixa não marca a virada. Recorte começa em **(ataque − virada)**. Ataque conferido por SHA-256 contra a curadoria; faixa sem hash conferido não entra |
| **tensão** | só existe se houver **problema delimitado**. Frase afirmativa do começo ao fim não leva tensão — forçar é inventar estrutura |
| **fecho** | lockup parado em marfim sobre café profundo. Ela não tem animação de logo. Nada de texto, véu ou selo por cima |
| **selo** | **não tem.** Peça de tricologia dela não é ato cirúrgico da clínica |

**Os ganhos de SFX do padrão são de mix COM VOZ.** Sem voz a música é a cama e
sobe ao topo do mix: com os números do padrão o click ficava **25,3 dB abaixo
dela**, inaudível. Fator de peça sem voz, em `scripts/mix-texto-fixo.sh`:

| SFX | padrão | sem voz |
|---|---|---|
| filme | 0,36 | **0,36** (não precisou) |
| zoom | 0,38 | **0,60** |
| click | 0,30 | **1,00** |

**O número do padrão continua certo para peça falada.** O que muda é o contexto.

**O filme lava texto fixo.** Na New Hair o título SAI antes do clarão; aqui o
texto é fixo e atravessa: o contraste cai para ~3,7:1 durante 0,23 s. Medido e
declarado. A correção, se incomodar, é o texto sumir nos 7 frames — e aí ele
deixa de ser fixo.

## 7. Entrega

- Imagem renderizada **em silêncio** (`--muted`), stems misturados **por fora**,
  mux no fim. É o que evita a defasagem do motor.
- **Contar os frames da entrega** contra o plano. `-shortest` trunca o vídeo pelo
  áudio: `apad` + `-t` na duração exata antes do mux.
- **Faixa de cor:** o Remotion sai em faixa cheia (`pc`). Medir YMIN/YMAX com
  `-pix_fmt yuvj420p` (o `yuv420p` mente) e só então `in_range=pc:out_range=tv`.
  Se já forem 16/235, converter **lava** a imagem.
- Correlação entre o áudio da entrega e o master: esperado 0,9999 a 0,00 ms.
- Loudness alvo −16 LUFS, −1,5 dBTP, duas passadas.
- Arquivo `FS_assunto_vN.mp4`, relatório em `entregas/`, registro em
  `CONTINUIDADE.md`.
- **Não declarar aprovação que ela não deu. Não publicar.**

## 8. Checklist antes de mandar

- [ ] a frase na tela é **exatamente** a que ela escreveu
- [ ] quebra calculada, variação abaixo de 25%
- [ ] entrelinha 1,22; nada de til encostando em descendente
- [ ] bloco entre 220 px e 1560 px
- [ ] contraste medido **debaixo do glifo**, acima de 4,5:1 fora do filme
- [ ] fonte conferida por **largura de tinta** contra as métricas do arquivo
- [ ] nenhum plano mostrando fundo, corpo ou roupa íntima
- [ ] recorte 9:16 exato e par; brilho remedido **depois** de mexer no recorte
- [ ] frames da entrega = frames do plano
- [ ] SFX audíveis acima da cama (peça sem voz usa os ganhos ajustados)
- [ ] fecho limpo, sem nada por cima
- [ ] o que ficou de fora está escrito no plano, **com o motivo**

## 9. Erros já pagos (não redescobrir)

- **Copiar o grade da referência ao pé da letra** deixou a pele dela pesada. A
  referência é de outra pele [16/09/2026].
- **Assunto fora do centro** — *"a imagem está muito pra esquerda"*. Centrar se
  mede [16/09/2026].
- **Fechado demais** — *"não tá dando pra ver o cabelo todo"*. O recorte que
  isola o assunto pode cortar o assunto [17/09/2026].
- **Brilho refém do enquadramento:** o +0,045 existia para um recorte escuro;
  depois de abrir o plano ele empurrou a cena de 89 para 118 de luma.
  **Mexeu no recorte, remede o brilho** [17/09/2026].
- **`fps=30` perdido na cadeia de filtros:** os cortes de 60 fps saíram com 156
  frames em vez de 78. Pego contando frame, não olhando [17/09/2026].
- **Recorte 9:16 inexato** (788×1400 = 0,5629): meio pixel de esticada
  [17/09/2026].
- **Recortar a tela do tricoscópio tão fechado que ela deixa de ser tela.**
  *"As pessoas têm que ver um pouco da tela"* não era só tempo, era
  legibilidade: a moldura tinha que aparecer [18/09/2026].
- **`-shortest` comeu um frame:** master de 21,099979 s contra 21,100000 do
  vídeo. 632 frames em vez de 633 [20/09/2026].
- **Ganhos de SFX do padrão numa peça sem voz:** click 25,3 dB abaixo da música.
  SFX que não se ouve mas continua somando é pior que SFX nenhum [20/09/2026].
- **Contraste medido na faixa inteira em vez de debaixo do glifo:** a v6 declarou
  5,0:1 onde o real era 4,12:1 [21/09/2026].
- **Banda de medida achada no olho:** ao conferir a fonte, cortei a faixa em
  y 150..240 e peguei o topo das maiúsculas da linha de baixo — 539 px onde eram
  462, e quase desconfiei da fonte certa. **A banda se acha pelo perfil de
  tinta** [21/09/2026].
- **Ordem que tira lugar tira imagem.** Ao pôr a tricoscopia na posição 2,
  saíram da peça o cabelo finalizado e o plano do gesto. Ela não pediu isso — é
  efeito, e efeito se declara [21/09/2026].
