# FS_couro_cachos_v1 — relatório de entrega

Peça: Reel de **texto fixo** da marca pessoal **Fabrícia Satza | Tricologia e
Terapia Capilar**. Montada em 16/09/2026. **Não aprovada** — falta a dona
avaliar. Não publicada.

Arquivo: `projeto-remotion/out/fabricia/FS_couro_cachos_v1.mp4`

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
