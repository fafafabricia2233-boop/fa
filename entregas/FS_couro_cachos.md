# FS_couro_cachos — relatório de entrega

Peça: Reel de **texto fixo** da marca pessoal **Fabrícia Satza | Tricologia e
Terapia Capilar**. Montada em 16/09/2026. **Não aprovada** — falta a dona
avaliar. Não publicada.

Arquivo atual: `projeto-remotion/out/fabricia/FS_couro_cachos_v2.mp4`
A v1 continua em `..._v1.mp4` para comparação.

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
