# CONTINUIDADE — edição de vídeo New Hair

Arquivo exigido pelo manual (§09). Anexar numa conversa nova junto com
`kit-new-hair/GUIA-INTEGRAL.md`. Regra geral fica na seção "Regras gerais";
ajuste que vale só para uma peça fica na linha daquela peça.

Última atualização: 14/09/2026.

## Regras gerais refinadas (valem para as próximas peças)

- **Fronteira de palavra do ASR não é fronteira de corte** (14/09/2026, erro
  pego de ouvido pela dona na NH_velocidade). O transcritor ancora na sílaba
  TÔNICA: marcou "agilidade" em 1,30 s porque ali está o "gi", mas a vogal átona
  que abre a palavra começa em 1,13. Cortar em 1,22 — 80 ms "antes" da palavra
  segundo o JSON — caiu no meio da vogal. Corte que encosta em palavra se
  confirma no envelope de 10 ms e mora no VALE entre as duas; sem vale, a
  palavra anterior entra inteira ou se troca de take.

- **Música: a folga é fixa, o ganho não** (14/09/2026, quando a pasta `lofi`
  chegou). O ganho 0,1 do §05 nunca tinha sido conferido contra arquivo e põe a
  música a 1,0–2,6 dB da voz. O que se padroniza é `abaixo_da_voz_dB`, hoje em
  **3** (15 → 9 → 3, todas correções da dona no mesmo dia; a última foi
  "aumente o lofi em 100%", que é o dobro da amplitude = +6 dB). O
  ganho sai por peça de `scripts/ganho-musica.py`. A 3 dB a voz ainda fica
  13 dB acima da música **na banda da fala** (300 Hz–3,4 kHz), porque lofi é
  grave-pesado — medir essa banda antes de entregar se trocar de gênero. Faixa só entra se o SHA-256
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

**v7 (14/09):** a dona ouviu que **"agilidade" estava cortada no gancho** e
pediu a fala sem cortar a palavra. Estava mesmo: o corte começava em 1,220 s e o
"a" da palavra vai de 1,13 a 1,28 — caía no meio da vogal. O transcritor dizia
1,30 porque ancora na sílaba tônica ("gi"), não no início do som. Corte refeito
em **1,100 s**, o vale entre "que" e "agilidade" (não há silêncio ali: ela diz
as duas emendadas). O gancho passou de 121 pra **124 frames** e a peça inteira
andou 3 frames: endCard 509→512, duração 700→703, apoios 135→138 e 380→383,
legendas todas +0,1 s, e os pontos da mixagem junto (filme 3,900 · sting 17,067 ·
recorte da música 16,137). Conferido: legenda entra com voz no ar nas cinco,
fala acaba em 17,05 s e a última legenda sai em 16,95, antes do end card. Drop do
beat na virada nova: **+13,6 dB**. Zero faixa de fundo nos 703 frames.

Achado de quebra: o `durationInFrames` da composição estava **cravado em 700** no
`Root.tsx` enquanto o plano dizia 703 — o primeiro render saiu truncado. Os dois
números viraram um só: a composição agora lê `PLANO.duration` e `PLANO.fps`. A
NewHairAgilidade tinha o mesmo problema latente (730 cravado) e foi ligada
também.

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

## Lote de três pelo FLUXO A (15/09/2026) — comunicação, padrão, isquemia

Três fitas de uma vez (IMG_1603, IMG_1611, IMG_1610), 4K vertical nativa, HEVC,
60 fps, ~42 s cada, mesma pessoa e mesmo set das peças NH_saque e NH_antecipa.

| Peça | Título | Duração | Música |
|---|---|---|---|
| NH_comunicacao | PRECISA ORIENTAR A EQUIPE / VÁRIAS VEZES? | 34,2 s | bittersweet (+18,0) |
| NH_padrao | DE QUALQUER JEITO / OU NO PADRÃO? | 26,4 s | imperfect (+33,0) |
| NH_isquemia | QUANTO TEMPO O FOLÍCULO FICA / FORA DA SOLUÇÃO? | 31,7 s | cosy (+13,6) |

**O Drive fechou a porta — e o conserto virou `scripts/baixar-drive.sh`.** As três
chegaram com o endpoint público já em "Quota exceeded": nem download inteiro nem
leitura por faixa. Duas descobertas resolveram:
1. A cota é **por arquivo** e deixa passar ~128 MB antes de cortar. Leitura por
   faixa segue funcionando quando o download inteiro já não funciona.
2. Uma **cópia é um arquivo novo, com cota nova**. Copiar → baixar em pedaços →
   mandar a cópia pro lixo resolve sem esperar 24 h. Feito um arquivo por vez
   (pico de 450 MB na conta dela) e **as três cópias foram apagadas**.

**`scripts/ler-fita.py`** junta num passo só a disciplina que as peças anteriores
ensinaram: varre as regiões de fala, cruza com a cobertura do JSON, e transcreve
**sozinha** cada região quando um segmento do ASR cobre mais de uma. O vão de
união é parâmetro: fala corrida devolve uma região só, e isso é sinal de baixar
o vão, não de que a fita é uma frase só.

**O que a leitura pegou:**
- **IMG_1603**: *"você VOCÊ precisa estar atento"*. E aqui a primeira correção não
  bastou: cortar no vale entre os dois "você" (27,53) abriu o plano **no meio da
  vogal** do segundo — a energia já entrava subindo, sem o ataque do "v". Palavras
  coladas não têm corte limpo entre elas: ou entra a gagueira inteira, ou se
  começa **depois** dela. O fecho passou a abrir em "precisa" (27,71), com o /p/
  inteiro. Regra nova, registrada nas skills.
- **IMG_1611**: *"Padrão é uma forma de proteger o folículo"* dito **duas vezes**,
  e as duas **depois do CTA** na fita. Fica a segunda (a primeira abre com um
  conector solto) e ela vira o fecho da peça.
- **IMG_1610**: "sofre" sem vocabulário, **"sofra"** com — o subjuntivo é o que a
  regência pede depois de "para que", e é o que vai na legenda.

**Só a isquemia leva tensão e click:** é a única das três com bloco de problema
("o folículo não pode ficar fora da solução", terminando em 12,00 s) seguido de
solução ("por isso a equipe tem que ser organizada e ágil", 12,27 s). Nas outras
o gancho já é a pergunta e a virada está marcada pelo filme.

**Condensação registrada (NH_padrao):** ela diz "implantação" três vezes na mesma
frase; a legenda condensa para "para que na hora da implantação / SEJA MAIS
RÁPIDA." O §03 autoriza condensar fielmente, e o áudio continua inteiro.

**Os CTAs "siga o meu perfil" ficaram de fora nas três**, mesmo critério das peças
anteriores: é perfil pessoal, não da clínica.

**Medido nas três:** 30 fps constante, frames previstos, decodificação inteira sem
erro, **0 frames** com faixa de fundo no topo em nenhuma das três, offset entrega
× master 0,0 ms nas três janelas, masters a −16,0/−16,1 LUFS. Folga na banda da
fala: +9,0 / +9,9 / +11,3 dB. Entregas de 14, 13 e 12 MB.

## Quinta peça pelo FLUXO A (14/09/2026) — NH_antecipa_v1

Fita `IMG_1606.MOV`: 4K vertical nativa, HEVC, 60 fps, 57,1 s, **762 MB**. Mesma
pessoa e mesmo set da NH_saque. Tema: equipe que antecipa o próximo passo em vez
de esperar o médico pedir.

**Aqui nenhuma REGIÃO de fala se perdeu** — conferido varrendo o envelope da fita
inteira contra a cobertura do ASR, região por região, o que virou passo padrão.
O que se perdeu foi **texto dentro de trechos anotados**, três vezes:

| O ASR escreveu | O que é |
|---|---|
| "adiantar a" e nada por 3,4 s | "adiantar a **mesa organizada**, adiantar a **próxima etapa**" |
| "separar os folhinhos / folíquios" | "separar os **folículos**" |
| "para que a cirurgia **fua / fuja**" | "para que a cirurgia **flua**" |

Todas resolvidas recortando o trecho e transcrevendo de novo, com e sem
vocabulário. Terceira peça seguida em que isso acontece: **o JSON da fita
inteira não é a transcrição, é um rascunho dela.**

**⚠ O que não se resolveu:** entre "pedir tudo" e "a sua equipe", no gancho, pode
haver um "ou" — a frase só fecha sentido como pergunta de contraste. As duas
passadas não confirmam e a fala ali é corrida. Por isso o título **não** usa o
contraste: condensa só a parte certa (`SUA EQUIPE ANTECIPA / O PRÓXIMO PASSO?`).
Confirmado o "ou", vira `VOCÊ PRECISA PEDIR TUDO / OU A EQUIPE ANTECIPA?`.

**Quatro cortes, zero corte interno.** Ficaram de fora "Uma equipe organizada
consegue" (repete o clip1), "sem que o médico peça tudo…" (reafirma a premissa
que o gancho já estabelece) e o CTA de perfil pessoal. **Sem tensão e sem
click**, como na NH_velocidade: não há bloco de problema, o gancho é a pergunta
e a virada está marcada pelo filme.

**Apoio literal ao texto:** pinças sendo dispostas em ordem sobre "antecipar o
próximo passo", e a mesa sendo montada sobre "adiantar a mesa organizada". Faixa
de 680 px (cabeça em 580 ÷ 0,85), cortada já em 1080×680 da fonte — recorte
puro, sem nenhuma escala.

**Música:** `lostmemories` (quinta faixa, alternando), entrada de **+26,7 dB** na
virada, a mais dramática das oito.

**E a ressalva que eu tinha escrito virou fato na primeira oportunidade:** a
folga de 3 dB é medida em banda larga, e o que ela deixa na **banda da fala**
depende do gênero. Com `cosy` sobrou 13 dB; com `lostmemories`, que tem mais
médio, sobram **8,6 dB**. Continua legível e é o padrão que a dona pediu, mas
esta peça tem a música mais presente de todas. Registrado pra ela decidir.

**v2 (15/09) — ela repetiu "sem interromper" e eu deixei as duas.** A dona
ouviu. Na fita são três regiões separadas: `13,40→15,00` "sem interromper."
(tentativa que ela abandona), pausa, `15,26→18,35` "sem interromper o médico,
sem ultrapassar os limites." (inteira). Transcritas separadas, as duas passadas
mostram as duas tentativas; transcrito o trecho inteiro, **o modelo funde tudo
numa frase só** e a repetição some do texto — o mesmo modo de falha do gancho da
NH_saque, agora no meio da peça.

O erro foi meu de leitura: a varredura de regiões, que eu já fazia, mostrou as
três regiões; eu li o texto costurado e tratei como uma frase. **Regra nova: se
o texto de um segmento do ASR cobre mais de uma região separada, transcrever
cada região sozinha.**

Corte da tentativa 1 removido: o princípio virou dois cortes (118 + 95 frames) e
a peça encolheu 55 frames — endCard 930→875, duração 1121→1066, apoio da mesa
440→385, legendas do meio e do fecho adiantadas 1,83 s. A faixa de apoio das
pinças foi mantida **atravessando o frame 230**, que é onde a emenda ficou:
apoio por cima de emenda é o que a suaviza.

**Percalço registrado:** ao refazer o corte, o Drive respondeu **"Quota
exceeded"** — as leituras por faixa estouraram o limite de download do arquivo, e
nem ffmpeg nem curl conseguiam mais abrir a fita. Não foi preciso esperar: o
corte anterior, que cobria o trecho, **estava commitado no git**, e os dois novos
saíram dele (`git show HEAD:...clip1.mp4`). Vale como lembrete de que versionar a
mídia recortada não é só rastreabilidade — é o backup da fonte quando o Drive
fecha a porta.

**v3 (15/09) — "adiantar um processo" saiu, ela gagueja ali.** A dona ouviu.
Dentro da própria palavra "adiantar" (21,18→22,08) há uma quebra em 21,60→21,66,
e outra antes de "um processo" (22,20→22,92): a anáfora começava tropeçando
justamente onde devia embalar. Cortado em **22,98**, o silêncio limpo entre
"processo," e o segundo "adiantar" (23,04). Restam duas batidas de "adiantar"
(mesa, próxima etapa) fechando em "separar os folículos" — a figura continua de
pé e agora embala desde a primeira palavra.

A anáfora foi de 302 pra 245 frames e a peça encolheu mais 57: endCard 875→818,
duração 1066→1009, apoio da mesa 385→340, legendas do meio e do fecho adiantadas
mais 1,90 s, e a legenda "Adiantar / UM PROCESSO," saiu junto. Material cortado
do `clip2.mp4` local — o Drive segue com a cota estourada, e de novo a mídia
versionada resolveu.

**Medido na v3:** 30 fps constante, 1009 frames, 33,63 s, decodificação inteira
sem erro, **0 dos 1009 frames** com faixa de fundo no topo, offset entrega ×
master 0,0 ms nas três janelas. Transcrita a voz montada: "processo" **0×**,
"adiantar" 2×, "interromper" 1×. Entrega 18 MB.

**Medido na v2:** 30 fps constante, 1066 frames, 35,53 s, decodificação inteira
sem erro, **0 dos 1066 frames** com faixa de fundo no topo, offset entrega ×
master 0,0 ms nas três janelas, e a transcrição da voz montada traz
"interromper" **uma única vez**. Entrega 19 MB.

**Medido na v1:** 30 fps constante, 1121 frames, 37,37 s, decodificação inteira sem
erro, **0 dos 1121 frames** com faixa de fundo no topo, offset entrega × master
0,0 ms nas três janelas, master −16,1 LUFS. Entrega 20 MB.

## Quarta peça pelo FLUXO A (14/09/2026) — NH_saque_v1

Fita `IMG_1607.MOV`: 4K vertical nativa, HEVC, 60 fps, 75,3 s, **789 MB**. Mesma
pessoa da NH_medo, enquadramento bem mais aberto. Tema: o cuidado com o folículo
desde o saque.

**Método mais barato que o da peça anterior:** em vez do proxy completo (~6 min),
os três cortes foram puxados **direto da URL** com busca em dois estágios —
39 s por corte, contagem de frames exata. O proxy só compensa pra garimpar a
fita inteira.

**O achado da peça: o transcritor fundiu duas tentativas e apagou a boa.** Ele
devolveu um segmento de 13,22→22,82 com o gancho inteiro. O envelope mostrou
**fala** onde o JSON marcava silêncio (17,2→19,9). Reanalisado o trecho isolado,
com e sem vocabulário, as duas passadas deram o mesmo: **a segunda tentativa,
inteira e fluida, de 17,15 a 21,93**, com 0,99 de confiança. Ela tinha parado
depois de "tratado" e recomeçado. Montar pelo JSON daria um gancho com buraco de
3 s. Regra nova nas skills: **pausa longa dentro de um segmento do ASR é
suspeita, não silêncio** — e ao reanalisar, rodar com e sem `initial_prompt`,
porque o vocabulário faz o modelo completar a frase esperada.

**Zero corte interno.** As três tomadas correm sem hesitação. Por isso o bloco
escolhido foi o de 31,15 (versão completa e última) e não o resumo de 24,16 — a
redundância aqui é o resumo. Ficaram de fora também o trecho 46,5→57,6 (mesma
tese, mas com buracos de 2 a 3 s entre palavras), "para se revivir" (0,40 de
confiança, palavra que não existe) e o CTA "segue o meu perfil", que é de perfil
pessoal e não da clínica.

**⚠ Uma palavra por confirmar:** em "não pode haver ___" o modelo escreve
"compreensão" e **mantém mesmo com "compressão" no vocabulário**. Na lista
(desidratado / ___ / queda), logo depois de "não pode apertar o folículo", só
"compressão" fecha sentido — é o que está na legenda. Precisa de ouvido.

**Faixa de apoio de 800 px**, o dobro das peças anteriores, porque o
enquadramento é mais aberto e a cabeça dela só começa em 690 px. Os dois apoios
foram cortados já em 1080×800, com recorte 27:20 da fonte vertical: nada
esticado, nada desperdiçado fora da faixa. Apoios: folículos na cuba de
hidratação sobre "não pode ser desidratado" e carregamento do implanter sobre
"cuidado com o enxerto até a implantação".

**Música:** `cosy` (quarta faixa, alternando), entrada de **+13,6 dB** na virada.

**v2 (14/09) — eu tinha cortado o fim da frase.** A dona ouviu: *"você cortou ela
falando não ser viável mais"*. A frase acaba em **"não ser viável mais PARA A
CIRURGIA"**. O transcritor da fita inteira escreveu ali "para se revivir" com 0,40
de confiança — palavra que nem existe em português — e eu tratei como lixo em vez
de reanalisar. Recortado o trecho e transcrito de novo, as duas passadas devolvem
"para a cirurgia" com 0,82 e 0,87. **A regra que eu tinha acabado de criar pra
entrada vale igual pra saída, e eu só apliquei numa ponta.**

Junto: o /s/ de "mais" ia até 44,86 e o corte em 44,85 ainda comia a sibilante.
Sibilante quase não aparece em medição de banda larga — quem mostra é a banda
acima de 3,5 kHz. Borda terminada em S, X, Z ou R se confere no agudo.

Bloco refeito até 45,85 (441 frames, +30), peça andou 30 frames: endCard 769→799,
duração 960→990, apoio da tese 600→630, legenda do fecho virou "e não ser viável
mais / PARA A CIRURGIA" e as da tese andaram 1,0 s.

**v3 (14/09) — lofi +100%.** Ordem da dona. Cem por cento é o dobro da
amplitude, +6,02 dB: a folga padrão passa de 9 pra **3 dB abaixo da voz** e o
ganho desta peça de 0,0410 pra 0,0817 (×1,993). Conferido que não come a fala:
na banda de inteligibilidade (300 Hz–3,4 kHz) a voz continua **13 dB acima** da
música, porque o lofi concentra energia no grave. Só o áudio refeito; a imagem
aprovada foi reaproveitada. As peças NH_agilidade, NH_velocidade e NH_medo
continuam no padrão antigo de 9 dB — refazer é só remixar, a imagem não muda.

**Medido na v2:** 30 fps constante, 990 frames, 33,0 s, decodificação inteira sem
erro, **0 dos 990 frames** com faixa de fundo no topo, offset entrega × master
0,0 ms nas três janelas, master −16,1 LUFS, e ~150 ms de ar depois de "cirurgia"
antes do corte. Entrega 17 MB.

## Terceira peça pelo FLUXO A (14/09/2026) — NH_medo_v1

Fita nova, pasta nova, pessoa diferente na câmera (jaleco vinho, parede lisa) —
não é a mesma das duas primeiras. Tema: *"Médico, seu paciente precisa ficar com
medo de falar durante uma cirurgia de horas?"*

**A fita é a melhor que já chegou:** 4K **vertical nativa** (2160×3840 com
`rotation=90`), HEVC, 60 fps, 57 s, **597 MB**. As duas peças anteriores vinham
de uma cópia comprimida de 480×854. Aqui não há ampliação nenhuma: a fita já é
9:16 e sobra resolução.

**Como o tamanho foi resolvido** (a dona pediu "reduza o MB pra conseguir
editar"): nada foi baixado inteiro. Áudio puxado sozinho por leitura de faixa
(57 s em 7 segundos), transcrição feita em cima dele, e um proxy 1080×1920 a
30 fps gerado direto da URL — 597 MB → 153 MB. Os cortes saem do proxy.

**Uma peça só, e isso é conclusão.** Pela regra de 14/09, a pergunta era quantas
peças inteiras existem. Existe **um** gancho, e concessão, virada, marca e fecho
são todos resposta dele. Separar qualquer bloco o deixaria sem pergunta.

**Gancho é a segunda tentativa.** A primeira (2,74→8,60) sai gaguejada — "Médico,
médico, ..." — e diz "medo de falar EM uma cirurgia". A segunda sai limpa e diz
"DURANTE uma cirurgia". §02: última tentativa completa.

**As bordas, de novo, estavam todas erradas no JSON.** Medidas no envelope com
`scripts/bordas.py`, as seis entradas de corte estavam de **70 a 320 ms
atrasadas** no transcritor ("Médico" marcado em 8,98 começa em 8,72; "Orientar"
marcado em 42,92 começa em 42,60). Cortar pelo JSON teria mastigado todos os
seis cortes.

**Ficou de fora, de propósito, e um item é decisão de editor:**
- "se ele quiser ir ao banheiro, ele vai poder ir ao banheiro" — repete o que o
  bloco da marca já diz melhor.
- **O CTA** ("clique no link da bio", 48,94→55,38). Vem depois de uma gaguejada
  ("Médico, se você / Se você") e é dito com hesitação: 1,5 s de buraco antes de
  "preza" e outro antes de "clique". E a peça fecha mais forte em *"Orientar é
  diferente de intimidar"*, que é a melhor frase da fita. **Isto não sai de
  nenhuma regra do manual — é escolha de edição, e volta se a dona quiser.**

**Apoio:** `implantacao.MOV` sobre "momentos delicados" e **`CONVERSANDO COM A
PACIENTE`** sobre "falar / conversar / perguntar" — paciente na cadeira falando
e gesticulando com a técnica, que é a prova literal da fala. Faixa mascarada com
altura medida: o cabelo dela começa em 419 px, faixa em **490**.

**Voz equilibrada corte a corte de verdade desta vez:** o espalhamento era de
4,4 dB (ela vai ficando mais alta ao longo das tomadas). Igualados em −32,1
dBFS, com o fecho deixado 1 dB acima de propósito por ser a frase de impacto.

**Música:** `floating` (terceira faixa, alternando), ataque 20,705 → recorte em
16,072. Entrada medida no stem: **+13,7 dB** na virada, de −53,7 pra −40,0 dBFS.

**Medido na entrega:** 1080×1920, 30 fps constante, 1082 frames, 36,07 s, AAC
48 kHz, decodificação inteira sem erro, **0 dos 1082 frames** com faixa de fundo
no topo, offset entrega × master 0,0 ms nas três janelas, master −16,1 LUFS.
Tensão termina na última palavra do problema (10,01 s) e o click entra na virada
(10,10 s), conferidos por energia. Entrega reencodada em CRF 24 pra caber no
limite de 30 MB (20 MB).

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
