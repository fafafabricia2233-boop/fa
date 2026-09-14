# CONTINUIDADE — edição de vídeo New Hair

Arquivo exigido pelo manual (§09). Anexar numa conversa nova junto com
`kit-new-hair/GUIA-INTEGRAL.md`. Regra geral fica na seção "Regras gerais";
ajuste que vale só para uma peça fica na linha daquela peça.

Última atualização: 14/09/2026.

## Regras gerais refinadas (valem para as próximas peças)

- **Música: a folga é fixa, o ganho não** (14/09/2026, quando a pasta `lofi`
  chegou). O ganho 0,1 do §05 nunca tinha sido conferido contra arquivo e põe a
  música a 1,0–2,6 dB da voz. O que se padroniza é `abaixo_da_voz_dB: 15`; o
  ganho sai por peça de `scripts/ganho-musica.py`. Faixa só entra se o SHA-256
  bater com a curadoria de ataques — `scripts/conferir-musica.py` barra o resto.

- **Vídeo ocupa a tela toda** (ordem da dona, 14/09/2026: *"esse negócio azul em
  cima… prefiro que o vídeo fique na tela toda"*). Vale contra o exemplo
  aprovado, que empurrava o plano pra baixo e usava apoio em faixa. Na prática:
  **o mascaramento continua** (ela confirmou: *"quero que continue mascarando a
  imagem junto com minha fala"*) — o que muda é que a ALTURA da faixa se mede
  em vez de herdar 760: `altura = topo_da_cabeça ÷ 0,85`. Mais `titleShift: 0`,
  `bandShift: 0` e a escala de cobertura no motor como rede de segurança.
  Junto, o véu do título passou de 520 px com queda seca pra 900 px com cauda
  longa — sem a faixa de fundo por trás, a borda dele aparecia na parede lisa.

- **Fita com muita fala rende mais de uma peça** (ordem da dona, 14/09/2026):
  *"Sempre que eu te enviar um vídeo e tiver muitas falas e você identificar que
  dá pra gerar mais de 1 vídeo com sentido em cada fala, faça assim."* O
  inventário da fala passa a vir antes do plano de montagem, com **duas
  perguntas**: "qual é o melhor trecho desta fita?" (continua valendo, e vem
  primeiro — decide o que abre, o que vira título e qual peça sai na frente) e
  "quantas peças inteiras existem aqui?" (decide quantas). A segunda não
  substitui a primeira; ela só impede que o resto da fita seja descartado
  depois que a primeira já escolheu o melhor. Ordem de entrega: a melhor
  primeiro. Entregar
  todas, uma de cada vez, sem perguntar antes. Critério do que vira peça
  (gancho próprio, desenvolvimento, fecho, nada repetido, imagem que sustente)
  está nas duas skills. Bloco que não fecha sentido **não** vira peça forçada:
  registra-se o que sobrou e a dona decide.

- **Ganho da tensão padronizado em 0,319** (ordem da dona, 13/09/2026, depois de
  dois cortes de 30% na peça NH_agilidade). Substitui os 0,65 do §05 do manual.
  Junto com os outros ganhos de stem, mora em `projeto-remotion/padroes-audio.json`
  e vale para as duas marcas. Piso conhecido: 0,11 foi reprovado por inaudível.

- **Marca d'água no fim de toda peça**, com a trilha da fita continuando por
  baixo (ordem da dona, 25/08/2026). Script: `projeto-remotion/scripts/fechar-peca.sh`.
- **Offset do render medido, não herdado.** O manual proíbe o −40 ms fixo. A
  medição neste ambiente deu **42 ms** de atraso do áudio, cinco peças
  seguidas. Conserto: remux com `-itsoffset -0.042`; conferir volta a 0,0 ms.
- **Número de `medir-fita.py` é suspeito até olhar o frame.** Já acusou end
  card que era plano escuro (NewHairEnxertos, NewHairMudaRumo) e split screen
  que era parede branca (NewHairConfiar).
- **Fita curta manda no texto.** Se o roteiro pede mais leitura que a fita
  comporta, corta-se o texto e avisa-se o que saiu (decisão da dona,
  11/09/2026, peça NewHairCuidaPaciente).
- **Título centralizado no meio do quadro** no motor de legenda (desde
  NewHairCusta2). Sai preferencialmente em cima de um corte ou dentro de uma
  passagem pelo preto.
- **Digitação do título nunca passa de 2 s**, com o SFX morrendo na última
  letra (igual ao manual §04).

## Fila / peças entregues nesta frente

Todas pelo motor B (fita já cortada + roteiro escrito), branch
`claude/remotion-editing-8hmpig`. Nenhuma recebeu aprovação por escrito ainda.

| Peça | Fita | Duração | Observação |
|---|---|---|---|
| NewHairEnxertos | enxertos_h264 | 17,533 s | fade a preto em 16,45 s |
| NewHairMudaRumo | mudarumo_h264 | 13,814 s | cortes 5,25 / 8,45 / 10,40 s |
| NewHairCuidaPaciente | cuidapaciente_h264 | 6,133 s | **texto cortado**: ficaram de fora "técnica sem atenção também pesa na experiência" e o fechamento da New Hair. Fita é mosaico 3×3 → campo `mosaico` |
| NewHairConfiar | confiar_h264 | 14,813 s | primeira com `fitaClara`; falso positivo de split screen |
| NewHairPreparo | preparo_h264 | 17,033 s | título sai na virada de 2,65 s |
| NewHairFuncoes | funcoes_h264 | 11,433 s | **texto cortado**: ficou de fora "Porque você não deveria gastar atenção organizando quem deveria estar te dando suporte" |
| NewHairConferencia | conferencia_h264 | 14,600 s | roteiro coube inteiro |
| NewHairEficiencia | eficiencia_h264 | 16,067 s | gancho de 112 caracteres em 5 linhas |

Trilha (motor B): nenhuma trilha nova foi introduzida — todas usam o áudio que já vinha
na fita, mais o SFX de digitação. A curadoria de músicas
(`kit-new-hair/musicas-ataques-por-hash.json`) ainda não foi usada aqui.

## Primeira peça pelo FLUXO A (13/09/2026) — NH_agilidade_v1

Primeira vez que o caminho completo do manual rodou aqui: transcrever, escolher
as falas, cortar, montar, apoio, render mudo, mix dos stems, mux e medição.

**Fitas.** Duas, e elas não são equivalentes:
- `IMG_9335.mov` — 15,7 s, **1080×1920 nativo**. Deu o gancho e a solução.
- `copy_A479…mov` — 52,2 s, **480×854**. É uma cópia comprimida (o nome começa
  com "copy_"). Deu o problema e o fecho, ampliada 2,25× com lanczos. **Se o
  original aparecer, vale refazer: metade da peça ganha nitidez.**

**Ordem.** A fala não veio em ordem de peça. O gancho mais forte estava no meio
da fita B; o §02 autoriza abrir por ele. Montagem: gancho (B) → problema (A) →
solução (B) → fecho (A).

**Título.** A primeira versão ("SEPARAR RÁPIDO / NÃO É SEPARAR BEM.") estourava
a caixa — 18 caracteres a 72 px não cabem em 900 px úteis. Redistribuí as
linhas em vez de reduzir o corpo (§09: headline rebaixada ao tamanho de legenda
é erro catalogado), e de quebra ficou literal.

**Apoio.** Banda de folículos na placa (`contagem-foliculo/contando_foliculo`,
6,0→9,6 s) sobre o corte do problema — que é justamente o de menor resolução.
Resolve duas coisas: prova a fala ("machucar o folículo") e tira o corte mais
fraco da tela cheia.

**Som.** Voz equilibrada corte a corte (estavam entre −32,3 e −35,2 dBFS RMS),
SFX de digitação, filme na virada, tensão terminando na última palavra do
problema (6,35 s) e click na entrada da solução. Master a −16,3 LUFS / −1,5
dBTP em loudnorm de duas passadas.

**O offset de 42 ms não apareceu — e não era pra aparecer.** Neste fluxo o
Remotion renderiza imagem MUDA e o áudio entra no mux. Medido: 0 ms nas três
janelas. É exatamente por isso que o §07 manda montar nessa ordem.

**v3 (13/09):** mais 30% no grave. Ganho 0,455 → 0,319 — o stem sozinho caiu
6,2 dB desde a v1. Só o áudio refeito de novo. Ainda está 3× acima do ganho
0,11 que o §05 registra como reprovado por inaudível.

**v2 (13/09):** a dona pediu o SFX de tensão 30% mais baixo. Ganho 0,65 → 0,455,
só o áudio refeito — a imagem aprovada foi reaproveitada, como o §02 manda
("revisão pequena continua pequena"). Master a −16,2 LUFS / −1,5 dBTP, offset 0
ms nas três janelas. A receita da mixagem virou `scripts/mix-agilidade.sh`, pra
peça ser reprodutível em vez de viver num comando solto.

**Faltou e está registrado:** música (a curadoria não chegou, só a lista de
hashes) e o `zoom.mp3` (não veio no kit), então o zoom ficou só visual.

## Segunda peça pelo FLUXO A (14/09/2026) — NH_velocidade_v1

Pedido da dona: *"o vídeo que te mandei tem mais falas do que as que você editou
… gere outro vídeo com as falas que você não colocou nesse"*. Peça inteira
montada com o que sobrou — **nenhuma frase se repete entre as duas**.

**Fonte.** Só a fita A (`copy_A479…`, 480×854), três cortes ampliados 2,25× com
lanczos + unsharp:

| Corte | Fonte na fita | Fala |
|---|---|---|
| gancho (121 f) | 1,22 → 5,25 s | "Agilidade não é pegar o folículo de qualquer jeito…" |
| definição (159 f) | 6,74 → 12,04 s | "Agilidade vem de treinamento, constância e cuidado com o folículo." |
| solução (229 f) | 34,42 → 42,05 s | "É a velocidade que não cobra o preço do enxerto… sem danificar nenhuma estrutura." |

**O que foi deixado de fora, de propósito.** "Porque" inicial (conector de uma
pergunta que o espectador não ouviu) e "Isso não é agilidade" (5,36→6,30 s: diz
o que o título já diz — §02 manda tirar redundância). E **"Sabe qual é a
velocidade de voo?"** (32,80→34,42 s): o transcritor bateu "de voo" em três
passadas com 0,93–0,98 de confiança, mas a expressão não fecha sentido e aqui
não há escuta perceptual. Não se põe na tela palavra que não se confirmou —
**isso continua pendente de conferência por ouvido da dona**.

**Apoio.** Dois, e mais longos do que na NH_agilidade de propósito: a peça
inteira é ampliada (a outra tinha metade em resolução nativa). Ambos cortados
direto da URL do Drive, sem baixar o arquivo: `implanter em maos treinadas`
(132 f, sobre "treinamento e constância") e `implantando_pinca` (120 f, sobre
"sem danificar nenhuma estrutura").

**Som — e por que NÃO tem tensão nem click.** Esta peça não tem "problema"
narrativo separado: o gancho JÁ é o problema, e a virada é marcada pelo filme
nos 7 frames antes do frame 121. O §05 posiciona a tensão na última palavra do
problema; sem problema delimitado, forçá-la seria inventar estrutura. O click
marca entrada de solução que o filme já marcou. Stems usados: voz equilibrada
corte a corte, digitação, filme (3,800 s) e sting da marca (16,967 s).

**Medido na entrega:** H264 1080×1920, 30 fps constante (todo frame a 0,033333),
700 frames, 23,333 s, AAC 48 kHz mono, 27,5 MB. Decodificação inteira sem erro.
Offset entrega × master: **0,0 ms nas três janelas** (2 / 8 / 20 ms) — de novo o
fluxo A não sofre os 42 ms, porque a imagem sai muda e o áudio entra no mux.
Master a −16,3 LUFS. **True peak −1,44 dBTP**, 0,06 dB acima do teto nominal de
−1,5: é o mesmo comportamento do master já entregue da NH_agilidade v3 (−1,49) e
vem da segunda passada do loudnorm em `linear=true`. Não foi "corrigido" por
fora pra não quebrar a reprodutibilidade provada do script.

**Sem escuta perceptual**, como sempre: o que está acima é medição, não audição.

**v4 (14/09):** a v3 tinha jogado fora o mascaramento junto com o problema. A
dona: *"por que você removeu o mascaramento? quero que continue mascarando a
imagem junto com minha fala"*. Estava certa — apoio em tela cheia resolve a
faixa azul mas perde a fusão, que é justamente o que faz o apoio nascer dentro
da imagem dela. As duas exigências não brigam: o que a máscara precisa é
dissolver no topo da cabeça, não ter 760 px de altura. Medida a touca (430 px
no clip1, 440 no clip2) e mantida a proporção do exemplo aprovado (cabeça a
~85% da faixa), a faixa fica em **500 px** — dissolve no mesmo lugar relativo,
rosto livre, zero fundo à mostra, zero ampliação. A altura virou campo do
apoio (`altura`) e o empurrão virou campo do plano (`bandShift`, padrão 0,
mantido em 240 só na NH_agilidade pra não alterar peça entregue).

**v3 (14/09, substituída):** a dona viu a faixa azul no topo e pediu o vídeo na
tela toda. Os dois apoios passaram de `"band"` pra `"full"` e o `titleShift` de 140 pra 0 —
ou seja, ninguém mais é empurrado, então não sobra fundo. **Nada de ampliar**:
a fita é 9:16 exata e preencher com deslocamento custaria 15 a 17% de recorte
num material já ampliado 2,25×. O véu do título foi alongado junto (520→900 px),
porque sem a faixa por trás a borda dele aparecia na parede lisa. Só a imagem
foi refeita; o áudio é o mesmo master. Conferido: **0 dos 700 frames** têm faixa
chapada da cor do fundo no topo, offset segue 0,0 ms nas três janelas, 26,8 MB.

### `scripts/mix-falado.sh` — a mixagem virou receita genérica

A `mix-agilidade.sh` tinha as posições cravadas no filtergraph. A versão
genérica recebe as posições por flag (`--voz --sting --saida --dur --filme
--sting-em`, e `--tensao-fim` / `--click` opcionais) e continua lendo os ganhos
de `padroes-audio.json`.

**Prova de que não mudou nada:** rodando o script genérico com os parâmetros da
NH_agilidade v3, a saída é **bit a bit idêntica** ao `master_v3.wav` já
entregue (mesmo md5, `af2bf390…86bb`). O primeiro teste tinha dado diferente
por erro do teste, não do script: passei `--dur 24.333` onde a peça usa `24.34`,
e o `--dur` decide também o início do fade (`dur − 1,0`).

A flag `--tensao-fim` ser opcional é o ponto: peça sem problema narrativo sai
sem tensão em vez de ganhar um grave que o manual não autoriza.

## Música entrou nas duas peças faladas (14/09/2026)

A pasta `lofi` do banco chegou com 9 faixas e a pasta `sfx` com os SFX do kit —
entre eles o **`zoom.mp3` que faltava desde o começo**. 8 das 9 faixas batem
SHA-256 exato com a curadoria de ataques do kit; a nona (`Soulful - L'indécis`)
não está na lista e ficou de fora, porque sem ataque conferido não dá pra pôr o
beat na virada.

| Peça | Faixa | Ataque | Recorte começa | Entrada no ataque |
|---|---|---|---|---|
| NH_agilidade_v5 | bittersweet | 9,05 s | 6,583 s | +18,0 dB |
| NH_velocidade_v6 | imperfect | 20,27 s | 16,237 s | +33,0 dB |

**Duas correções da dona no mesmo dia, e as duas apontavam pro mesmo lugar.**
Primeiro *"achei a música baixa demais"* — a folga passou de 15 pra 9 dB abaixo
da voz. Junto ela lembrou que **a virada do beat entra no take pós-gancho**, e
foi isso que expôs o erro de fundo: eu tinha escolhido as faixas por
estabilidade de nível (`wander` e `cosy`), quando o critério que importa é a
**força da entrada no ataque**. A `wander` entra com só +5,9 dB — medido no
master, ela somava +1,4 dB na virada, ou seja, o drop não existia.

Medidas as oito da curadoria (energia 300 ms depois do ataque menos 300 ms
antes): imperfect +33,0 · lostmemories +26,7 · bittersweet +18,0 · floating
+13,7 · cosy +13,6 · harmony +10,2 · wander +5,9 · kickback +1,8.

`imperfect` foi pra NH_velocidade porque essa peça **não tem tensão nem click**:
o filme e a música são os únicos marcadores da virada, então ela leva o drop
mais forte. `bittersweet` ficou na NH_agilidade, que já tem tensão e click
marcando, e ainda é a segunda mais estável das fortes.

**O ganho da música virou conta, não número.** Ver a regra nova em
`padroes-audio.json` e nas duas skills: 0,1 punha a música a 1,0 dB da voz. A
folga padronizada é **9 dB** (15 foi reprovado por baixo demais).

**O formato que ficou:** música quase inaudível debaixo do gancho e o beat
entrando no take pós-gancho. Conferido no master, na banda grave (<200 Hz), onde
a música manda e a voz não: degrau de **+13,7 dB** na NH_agilidade e **+12,8 dB**
na NH_velocidade, com a música saindo de ~−53 pra ~−43 dBFS contra voz a −33.
Conferido também que a tensão da NH_agilidade não foi mascarada: −15,2 dB com e
sem música, idêntico.

**Medido nas duas entregas:** 30 fps constante, frames previstos, AAC 48 kHz,
decodificação inteira sem erro, offset entrega × master 0,0 ms nas três janelas,
masters a −16,2 e −16,1 LUFS. A NH_agilidade passou de 30 MB com a trilha nova e
foi reencodada em CRF 21 a partir do render mudo (15,6 MB), como já tinha sido
feito na v3.

**O `zoom.mp3` está instalado mas NÃO foi usado** em nenhuma das duas: as peças
foram fechadas sem ele e a dona pediu música, não SFX de zoom. Fica disponível.

## Divergências medidas contra a referência aprovada (12/09/2026)

Comparação de composição entre a prancha `quadros-Stephanie.jpg` e as pranchas
das nossas peças, geradas com `projeto-remotion/scripts/prancha.sh`. São
divergências levantadas, **não decisões tomadas** — dependem da dona.

1. **Tamanho do título.** A referência usa 48 px na linha de cima e 72 px na
   dourada, com a legenda em 34/42: a headline é ~1,7× a legenda. As nossas
   peças usam 36/44 com legenda até 46 — ou seja, a headline ficou do tamanho
   da legenda, ou menor. O manual §09 lista exatamente isso como erro a manter
   corrigido ("Título ficou pequeno para caber | Preservar headline... não
   rebaixar ao tamanho de legenda").
2. **Forma do gancho.** A referência CONDENSA a fala num gancho de duas linhas
   curtas ("SUA EQUIPE É / DEIXADA DE FORA?") e o escreve grande. Nós viemos
   transcrevendo a frase inteira do roteiro em 4 ou 5 linhas pequenas. O §03
   autoriza a condensação fiel e proíbe só inventar fato, promessa ou vocativo.
3. **Tamanhos de legenda.** A referência recente é rígida: 34 off-white + 42
   dourada, duas linhas, sempre. Nós usamos 26 a 46, às vezes linha solta,
   uma vez três linhas. O §03 diz que o exemplo recente prevalece.

## Duas marcas, dois perfis (13/09/2026)

A identidade saiu do código das peças e virou dado em
`projeto-remotion/src/lib/marcas.ts`. Cada peça declara de quem ela é.

- `newhair` — completa, com os números do exemplo aprovado.
- `fabricia` — **completa desde 13/09/2026**. Kit oficial em
  `marcas/fabricia-satza/`. Café profundo de véu, champagne de destaque (não
  terracota: sobre escuro ele cai pra 4,0:1 e o manual dela documenta esse erro),
  branco suave de texto, fonte própria em três faces, cabeçalho permanente,
  lockup parado no fim e sem selo.

Skill nova: `.claude/skills/editor-fabricia-satza/SKILL.md`, irmã da
`editor-new-hair` — mesma gramática de montagem, identidade separada.

Motor novo: `ReelFalado` (fluxo A, vídeo falado), portado do exemplo aprovado.
Conferido em 13/09 contra o quadro aprovado: reproduz o gancho da Stephanie
igual, e a mesma peça declarada como `fabricia` se recusa a sair.

## Pendências

- Kit incompleto: faltam 16 dos 35 arquivos do MANIFEST (ver
  `kit-new-hair/FALTANDO.md`). Sem as duas referências MP4 não dá pra comparar
  ritmo e som com o resultado aprovado.
- Banco de apoios no Drive: **configurado** em 13/09 (22 vídeos sondados, 66
  quadros lidos). Ver `CONFIGURACAO-NEW-HAIR.md` e `banco-apoios/CATALOGO.md`.
- Fabrícia Satza: identidade instalada e conferida em render. Falta só uma
  **referência aprovada em vídeo** dela — a primeira peça vai servir de piloto.
- **Fita de 13/09 está esgotada** (conferido em 14/09, já pela regra nova): o
  vão de 16 s que a transcrição da fita A deixa entre 16,02 e 32,80 s foi medido
  janela a janela e é **ruído de sala a ~−52 dBFS** — a fala desta gravação vive
  entre −32 e −35 dBFS. Não é fala que o ASR perdeu, é pausa mesmo. Somando as
  duas peças, sobrou só "Por que o folículo importa?" (42,20→43,78 s, pergunta
  sem resposta própria: a resposta já foi o fecho da NH_agilidade) e a frase
  não confirmada abaixo. **Não dá uma terceira peça.**

- **Conferir por ouvido**: na fita A, 32,80→34,42 s, o transcritor insiste em
  "Sabe qual é a velocidade de voo?" com 0,93–0,98 de confiança. A expressão não
  fecha sentido. Ficou fora da NH_velocidade; se a dona confirmar o que é, vira
  material pra uma terceira peça.
- Transcritor: **instalado** em 13/09. faster-whisper medium int8/CPU com tempo
  por palavra, `scripts/instalar-transcritor.sh` + `scripts/transcrever.py`.
  Precisa reinstalar a cada sessão (container efêmero, modelo de 1,5 GB).
  Validado contra a voz do exemplo aprovado: com o vocabulário do assunto
  acerta o texto; sem ele escreveu "testerizada" e "Mético" no gancho. E mesmo
  acertando, ainda junta frase e troca "deixa" por "deixe" — ou seja, o §02
  continua valendo: transcrição não prova ausência de engasgo.
