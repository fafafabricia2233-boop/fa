# CONTINUIDADE — edição de vídeo New Hair

Arquivo exigido pelo manual (§09). Anexar numa conversa nova junto com
`kit-new-hair/GUIA-INTEGRAL.md`. Regra geral fica na seção "Regras gerais";
ajuste que vale só para uma peça fica na linha daquela peça.

Última atualização: 16/09/2026.

## FS_couro_cachos v5 (17/09/2026) — abertura: o resultado, não o processo

*"Troque esse do início para um vídeo onde estou mostrando o cabelo bonito
finalizado de costas."* Entrou a fita `Mostrando cabelo bonito finalizado`
(17,00→19,80), saiu o `passando protetor térmico`.

**A regra que isso deixa: peça de rotina abre pelo RESULTADO.** O corte que
saiu tinha rosto na lente e gesto bom, mas era o processo. O que entra primeiro
é a prova do que a frase vai afirmar.

**Dentro da mesma fita, escolher o trecho é escolher o que NÃO repete.** Os
três trechos bons dela são 8–11 s, 17–20 s e 22–27 s. Dois deles são ela
abrindo a risca — que é exatamente o assunto do corte 4. Ficou o de 17–20 s,
o único em que o cabelo inteiro está na tela com movimento. Abrir e fechar a
peça com a mesma imagem é o defeito que isso evita.

**Abertura se escolhe pelo PRIMEIRO FRAME, e mais aberto ganhou.** Testei
576×1024 contra 648×1152. O fechado vira textura de cabelo e leva um tempo pra
ser entendido; o aberto mostra a silhueta e o ombro e lê na hora. Numa abertura
de Reel, reconhecer a imagem no primeiro frame é o que segura o dedo.

**Quadro cheio de cabelo é mais escuro que plano de rosto — e a emenda acusa.**
No primeiro render a emenda do frame 84 dava 80,0 → 102,9, salto de 23. Não é
defeito de grade, é conteúdo; mas 23 se vê. Brilho +0,045 no corte 1 e −0,075
no corte 2 derrubou pra 6,6, com o cabelo conferido num close pra garantir que
não lavou. **Compensar emenda é ajuste de plano, não de curva** — a curva
continua a mesma dos quatro.

**QA:** 384 frames (a duração não mudou — o corte novo tem os mesmos 84),
12,800 s, decodificação limpa, nenhum frame preto, pior contraste da legenda
5,9:1, nenhum corte com frame parado.

## FS_couro_cachos v4 (16/09/2026) — chegou OUTRA fonte, e ela não é a do kit

Ela mandou `Fabricia-Light_idêntica_a_futura_PT.otf` com "use para o vídeo".
**Não é a mesma família do ZIP de 13/09.** O kit é derivado da **Jost\***, três
faces, altura de x 0,460 em. Esta é **Futura PT**, UMA face (Light 300), altura
de x **0,433 em**, e vem em OTF/CFF — convertida aqui pra woff2.

**Trocar de fonte obriga a recalcular o corpo.** A altura de x da legenda da
referência é 25,5 px em 1080. Com 0,460 em isso dava corpo 55,4; com 0,433 dá
**58,9**. Ficou 58. Quem trocar fonte e mantiver o corpo muda o tamanho
aparente da letra sem perceber — **o corpo é consequência da altura de x, não
um número herdado.**

**Conferência de que a fonte certa saiu no arquivo, agora contra a .otf nova:**
largura da tinta da linha mais longa no frame renderizado = 807 px contra
806,3 px de avanço previsto. Passo que já pegou fallback antes e continua
valendo a cada troca.

**Família de um peso só derruba a ênfase por peso.** A referência marca a
palavra pelo peso; aqui não existe Medium. As três saídas eram: peso 500
sintético (proibido pelo manual dela), Medium do kit antigo na mesma linha
(Futura PT e Jost lado a lado são visivelmente diferentes — largura de letra e
altura de x), ou tirar a marcação. Ficou a terceira, com o registro de que
basta a face de ênfase DESTA família pra ela voltar.

**A fonte nova NÃO entrou no perfil da marca**, de propósito: `marcas.ts` é
compartilhado com as peças faladas, que ninguém pediu pra mudar. O motor ganhou
`texto.familia` no plano, e só a peça que pediu usa a família nova.

**QA:** 384 frames, 12,800 s, decodificação limpa, nenhum frame preto, pior
contraste da legenda 5,5:1, emendas 106,5→102,9 · 103,1→96,7 · 101,9→88,6.

## FS_couro_cachos v3 (16/09/2026) — centro de assunto se mede, não se olha

*"Quero que o foco/couro cabeludo fique no meio da tela, a imagem está muito
pra esquerda."* Ela está certa, e o erro era grande: no plano do couro
cabeludo limpo a cabeça estava **168 px à esquerda** do centro do recorte.

**Cada plano precisa de um detector diferente, porque o assunto é diferente.**
Rosto = mediana da máscara de pele na metade de cima (R>G>B, R−B entre 18 e 95,
luma entre 55 e 210). Ação no couro com espuma = mediana dos pixels claros e
POUCO SATURADOS, ignorando o topo (a parede do chuveiro também é clara, mas
está no topo). Cabeça no plano de cima = mediana da massa escura abaixo do
topo. Medir "o escuro" em todos teria errado três dos quatro: no plano dos
cachos a massa de cabelo tem mediana 568 enquanto o ROSTO está em 380.

**Recorte encostado na borda não desliza — estreita.** O rosto dela mora a
x=380 e o recorte já começava em x=0: empurrar era impossível. Com largura 756
a metade é 378 e o rosto cai no centro com CX=2. Só é de graça porque a fita é
4K: 756 no espaço da entrega são 1512 px na fita.

**E os recortes da v2 não eram 9:16 exatos.** 788×1400 dá 0,5629 contra 0,5625
— meio pixel de esticada em que ninguém tinha reparado. Passou a valer par
exato: 756×1344, 792×1408, 540×960. **Conferir a razão do recorte é passo.**

Conferência: linha vermelha desenhada no eixo central do corte pronto. Nos dois
planos de rosto ela cai no rosto; no da massagem, na espuma sob os dedos; no do
couro limpo, em cima da risca.

**QA:** 384 frames, 12,800 s, decodificação limpa, nenhum frame preto, pior
contraste da legenda 5,4:1, emendas 106,6→103,0 · 103,2→96,9 · 102,1→88,8.

## FS_couro_cachos v2 (16/09/2026) — a referência da legenda, o grade e o enquadramento

Três correções da dona depois de ver a v1, com uma quarta referência em vídeo.
Relatório em `entregas/FS_couro_cachos.md`.

**A FONTE DA REFERÊNCIA É A DELA — e isso se prova, não se acredita.** Ela disse
"a legenda que ela usa é a mesma que a minha". Confere: a legenda da referência
tem o **"a" de um andar**, que só existe em Futura/Jost e derivadas, e a família
dela é derivada da Jost*. A razão altura-de-x / ascendente medida na referência
dá **0,654**; Jost dá 0,63 e Poppins daria 0,747. É Jost.

**E o LEIA.txt do kit está errado sobre as faces.** Ele diz que a Light tem o
"a" de dois andares e só a LightAlt tem o de um andar. Renderizadas, **as três
faces saem com o "a" de um andar**. Consequência prática grande: a ênfase pode
ir na Medium 500 **sem trocar o desenho da letra no meio da frase** — era o que
me tinha feito descartar a face Alt na v1.

**Tamanho de legenda se mede por ALTURA DE X, não por palpite.** Altura de x da
referência: 17 px num quadro de 720 → 25,5 px em 1080. A família tem altura de x
de 0,460 em, logo corpo ≈ 55 px. Conferido por largura também. Ficou **56 px**.

**O champagne saiu da ênfase.** A referência marca a palavra só pelo PESO, em
branco. Some a briga de contraste do champagne sobre imagem (que na v1 exigia
véu a 0,66) e o véu caiu pra 0,40 — mais perto da referência, que não tem véu.

**"Sem deixar a pele pesada" é um aviso contra copiar o grade ao pé da letra.**
A referência tem p50=111 e p5=7,4; as fitas dela vinham com p50≈140 e p5≈33.
Aplicar a curva da referência em pele parda escurece a pessoa. A curva que ficou
**protege o meio-tom** (0,45→0,455, praticamente identidade) e tira o clima do
alto puxado (0,87→0,795) mais a divisão de cor: sombra quente, meio menos
vermelho, alta fria. Três curvas testadas lado a lado num close do rosto.

**"Pele viva sem manchas" sem plástico: `smartblur` com limiar NEGATIVO.**
`lr=3:ls=0.5:lt=-22`. Limiar negativo alisa só área lisa e preserva borda — some
com mancha e mantém cílio, sobrancelha, fio e armação de óculos. `-30:0.8` já
deixa plástico. Comparado num close da testa antes de escolher.

**Reenquadrar é de graça porque a fita é 4K, e só se o recorte vier ANTES da
redução.** 2160×3840 contra 1080×1920 de entrega dá 2x de folga: um recorte de
540×960 no espaço da entrega são 1080×1920 px na fita, exatamente nativo. Os
quatro planos foram fechados no rosto/cabelo e saíram do quadro a barriga, a
saia, a prateleira do chuveiro e o fundo. Ordem da dona: *"foque sempre em MIM
ou no cabelo... não gosto que mostre o fundo ou mostre meu corpo"*.

Ferramenta nova: `projeto-remotion/scripts/cortar-fabricia.sh` — recorte,
redução, grade e pele num passo só, com as coordenadas no espaço 1080×1920 (o
mesmo das pranchas), não no da fita.

**Armadilha que custou um render:** o script novo perdeu o `fps=30` da cadeia e
os dois cortes de 60 fps saíram com 156 frames em vez de 78. Contar frame do
corte pronto pegou na hora — é por isso que a contagem é passo.

**QA:** 384 frames como no plano, 12,800 s, faixa limitada bt709, decodificação
limpa, nenhum frame preto, pior contraste da legenda 5,3:1, emendas com luma
106,3→105,3 · 104,4→96,9 · 102,1→93,4. Não aprovada.

## FS_couro_cachos (16/09/2026) — primeira peça de TEXTO FIXO, e motor novo

Marca **Fabrícia Satza**, formato que não existia aqui: **rotina com texto
fixo**. Não há fala. Uma frase só fica parada na tela do frame 0 ao 321 e a
imagem troca por baixo dela. Relatório completo em
`entregas/FS_couro_cachos_v1.md`.

**Motor novo: `ReelTextoFixo.tsx`.** O `ReelFalado` não serve e não é preguiça:
ele nasce de fita falada — gancho virando título digitado, legenda por cue,
beat caindo na virada. Aqui não há fala nem virada, e forçá-lo significaria
digitação e legenda por cue, que é exatamente o que este formato proíbe.

**O bloco de texto mora FORA das Sequences de vídeo.** Dentro, ele seria
remontado a cada corte e piscaria na troca. Vale como regra do formato.

**Portão de fonte, novo e permanente: `src/lib/fabriciaFontesProntas.ts`.**
O `fabriciaFonts.ts` injetava o @font-face e aquecia as faces, mas **não
segurava o render** — o Chromium podia pintar o frame 0 com a fonte de fallback
e a quebra de linha sairia diferente, sem erro nenhum. Agora `delayRender()`
espera `document.fonts.load()` das três faces e `document.fonts.ready`.
E a conferência de que a fonte oficial saiu no arquivo virou medida: largura da
TINTA no frame renderizado contra a métrica do `.ttf` (previsto 770,7 px,
medido 765 px na linha mais longa). Fallback daria dezenas de px de diferença.

**O tamanho do corpo sai da área útil, não do gosto.** Margem esquerda 90 +
margem direita 180 (controles do Reels) deixam 810 px. A linha mais longa mede
770,7 px a 54 px e **827,3 px a 58 px** — 58 estoura. Medir a linha contra o
arquivo da fonte ANTES de escolher o corpo é passo.

**O cabeçalho da marca foi DESLIGADO nesta peça, e é decisão medida.** O perfil
põe o rótulo a 64 px do topo, que é onde o Instagram desenha o próprio "Reels".
Sobre o azulejo branco do corte 4 ele caía a **2,5:1** mesmo com o véu
reforçado (subiu pra 3,2:1, ainda baixo pra 22 px). Descê-lo pra dentro da área
segura (abaixo de 220 px) o joga em cima do cabelo dela, que é o assunto.
Virou chave no plano (`cabecalho: false`), não remoção do perfil.

**Corte que obriga o texto a se mexer não entra.** A melhor fita do assunto
"couro cabeludo" (o óleo pingado na risca, câmera direta) ficou fora porque o
vidro fica na mão na altura do peito, exatamente onde o bloco mora. Texto fixo
é fixo: ou o corte deixa a faixa livre, ou se escolhe outro corte.

**Fita gravada contra espelho custa caro numa peça premium.** Duas fitas boas
de "definição" saíram porque o tripé e o celular aparecem no quadro e a
camiseta sai com o texto invertido. Espelhar consertaria a camiseta e
inverteria todo o resto — alteração de imagem não se faz sem a dona mandar.

**Cor: medir antes de corrigir.** Luma média dos quatro cortes: 128,5 / 140,8 /
126,7 / 128,4. Só o segundo saltava, e levou brilho 0,95. Os outros três não
foram tocados — a diferença entre o quarto e o chuveiro é luz de banheiro de
verdade, não defeito.

**Faixa de cor: o render do Remotion sai FULL RANGE de verdade.** Medido com
`-pix_fmt yuvj420p` (sem conversão): YMIN 0, YMAX 255. Medir com `yuv420p`
mente — o próprio ffmpeg converte e devolve 16/235 sempre. Então o
`in_range=pc:out_range=tv` foi legítimo aqui, e a entrega saiu `tv`, igual às
anteriores.

**Trilha escolhida por ESTABILIDADE, não por força de entrada.** Peça sem fala
e sem virada não precisa de beat caindo em lugar nenhum; precisa de cama que
não chame atenção. Medido o desvio do nível em janelas de 12,8 s: cosy 2,04 dB,
harmony 3,08, kickback 4,85. Ficou cosy, recortada em **97,616 s**, que é tempo
forte de compasso (75 BPM, ataques de 1,6 em 1,6 s) — 12,8 s dá 4 compassos
exatos. Entrega a −15,98 LUFS, pico real −3,42 dBTP.

**Mix por fora e mux depois, como sempre**: correlação 1,0000 com o master,
deslocamento **0,00 ms**. O atraso de 42 ms do render não entra por esse
caminho.

**QA:** 384 frames como no plano, 12,800 s, H264 High 1080×1920 30 fps
constante, faixa limitada bt709, AAC 48 kHz, decodificação limpa, nenhum frame
preto, nenhum corte com frame parado, pior contraste do texto 7,5:1 (branco) e
3,9:1 (champagne). Conferido em prévia com a interface do Reels sobreposta.

**Não aprovada** — falta a dona avaliar. Não publicada.

## NH_correndo (16/09/2026) — "edite com máximo cuidado"

Pasta com dois arquivos, "1" e "2": as duas partes de UMA peça roteirizada
(problema na parte 1, solução e CTA na parte 2). Outra pessoa, outro cenário,
parede clara. **Uma peça só** — o gancho e a solução são metades do mesmo
argumento, não há bloco que se sustente sozinho.

Pedido: *"não quero take olhando pro lado e nem gaguejando, geralmente a última
fala é a melhor"*. As três viraram passo:

1. **Última tentativa** em cada frase. O gancho é dito duas vezes (0,64 "refazer
   o trabalho" / 9,39 "corrigir esse trabalho") e o par pergunta+CTA também
   (12,70 / 21,15) — ficaram os segundos. Como pergunta e CTA são contíguos na
   fita, entraram num corte só, sem emenda entre eles.
2. **Sem gaguejar.** "A mesa ficou desorganizada" está dita DUAS VEZES e quase
   passou: as tentativas se emendam num vale de 240 ms que não chega ao piso, e
   a varredura por região via uma região só. Quem denunciou foi a palavra
   esticada — "desorganizada" durando 2,16 s com **88% do vão em FALA**. Essa
   medida de fração de fala entrou no `varrer-corte.py` e agora reprova o corte
   antigo sozinha.
3. **Sem olhar pro lado.** Folhas de contato a 2 quadros/s em todas as regiões,
   e quadro a quadro nas entradas. Achou-se uma: em 17,90–18,00 ela está com a
   cabeça virada, frontal só a partir de 18,10. Resolveu-se sozinho ao pegar a
   segunda tentativa da frase.

**Emenda de cláusula de propósito.** A frase "A comunicação se perde e o tempo
que era para ser economizado acaba sendo gasto…" nunca sai inteira: na primeira
vez ela trava 2,16 s antes de "economizado"; na segunda retoma já de "e o
tempo…". Montada, sai inteira de dois cortes, sem repetir nada, com a faixa de
apoio atravessando a emenda pra suavizar.

**A faixa mascarada VOLTOU** — aqui cabe. O cabelo dela começa entre 512 e 564
px, então há céu de verdade; altura = 512 ÷ 0,85 ≈ 610. E o título voltou pro
alto (270): a ordem "deixa o texto embaixo" era daquela fita ("NESSE deixa…"),
onde o rosto ia de 110 a 1290 px.

**QA:** 1112 frames como no plano, H264 1080×1920 30 fps faixa limitada, AAC
48 kHz, decodificação limpa, offset 0,0 ms nas três janelas, 0 quadros com topo
liso, beat na virada em **+18,5 dB**. Música: floating (quarta da rotação).

## NH_padraoseguir (16/09/2026)

Fita de 61,4 s, **4K vertical nativo HEVC a 60 fps** — a melhor fonte que passou
por aqui. Terceira pessoa da série, sentada, enquadramento aberto. Uma peça só:
roteiro fechado, problema → padrão → prova → CTA.

**A frase-tese está dita TRÊS vezes e só a terceira sai limpa.** "Organização
traz previsibilidade para a cirurgia": em 34,40 ela tropeça ("traz pré-vip… mas
previsibilidade") e em 39,80 de novo ("traz previs… previsibilidade"). A terceira
(43,92) é a boa. O transcritor da fita inteira devolvia as três como frases
limpas — as tropeçadas só apareceram recortando janelas curtas, porque ele
estica uma palavra por cima delas ("presibilidade" de 36,68 a 38,90).

**Descartada de propósito a primeira enumeração** ("Organização, contagem,
manipulação de folículo, implantação", 10,58→18,53): lista as MESMAS quatro
tarefas que o clip3 lista como "um padrão de contagem, um padrão de manipulação,
um padrão de implantação". Ter as duas é redundância, e a segunda fica do lado
da solução. Saiu também "Cada um faz de uma forma", que repete o gancho.

**Olhar conferido nos nove cortes** (folha a 2 quadros/s): nenhuma consulta
lateral, ela fica na lente a fita inteira. **Portão de gagueira: código 0.**

**Faixa mascarada** com altura 615 (cabelo em 524 px) e título no alto, o padrão.

**O portão foi calibrado nesta fita.** O sinal de "palavra esticada sobre fala"
estava reprovando a 1ª palavra de vários cortes — ela sempre sai longa porque
carrega a folga de entrada. Passou a exigir **vão de pelo menos 1,2 s** pra
contar como fala engolida: abaixo disso não cabe uma tentativa inteira, e o que
sobra é alarme falso. Conferido que os dois defeitos reais conhecidos continuam
reprovando.

**QA:** 1097 frames como no plano, offset 0,0 ms, 0 quadros com topo liso, beat
na virada em **+14,0 dB**. Música: lostmemories (quinta da rotação).

## NH_somar (16/09/2026)

Fita de 62,1 s, 4K vertical HEVC 60 fps, mesma pessoa e cenário da
NH_padraoseguir. Uma peça: pergunta → resposta → convite → CTA.

**Entrada do gancho quase abriu com um suspiro.** A varredura de regiões marcava
fala a partir de 13,65, mas ali é respiração — a voz só ataca em **14,37**. Mais
um caso de região que começa antes da fala; o `ataque.py` é que resolve.

**Descartado de propósito um fecho COMPLETO e bom** (44,60 → 50,44: "Então se
você quer uma equipe que some com a sua clínica, a New Hair está aqui para
isso."). Ele repete a construção do clip4 — "se você quer/procura uma equipe
que…" — e é o clip4 que carrega o CTA. Pelo §02 assunto parecido pode, frase
igual não, e aqui a FORMA é a mesma; ter os dois seria dizer a mesma coisa duas
vezes seguidas.

**A tensão saiu depois de medida.** Com ela, o degrau do beat na virada deu só
**+6,9 dB** contra os +13 a +18 das outras peças: o grave da tensão termina no
mesmo instante da virada e enche a banda justamente nos 300 ms que a medida
compara. Tirada, o degrau voltou pra **+13,3 dB**. É o caso do §05 — o gancho já
É o problema e a virada está no filme, então não havia problema separado pra
tensão delimitar. Vale como regra: **quando `tensao-fim` cai em cima de
`hookEnd`, a tensão está competindo com a entrada do beat, não somando.**

**Colisão de id no Root.tsx.** Já existia uma peça de motor B chamada
`NewHairSomar`; registrar a nova com o mesmo id derruba o render inteiro com
"Multiple composition with id … are registered". A minha virou
`NewHairSomarClinica`. Conferir ids duplicados antes de renderizar agora é
passo.

**v2 (16/09): "CIRURGIA" ESTAVA CORTADA NO MEIO — e a culpa era da ferramenta.**
A dona ouviu. O clip1 fechava em 33,75 e a palavra vai até **34,26**. O detector
de cauda tirava o piso de ruído da própria janela de 1,6 s, que ali era quase
toda fala: o limiar subiu ACIMA da palavra e ele declarou "fim da fala" 800 ms
antes do fim. É o mesmo mecanismo que tinha comido "número" na NH_medico, e eu
tinha tratado aquilo como caso isolado em vez de consertar a medida.

**Conserto de verdade:** `varrer-corte.py` ganhou um TERCEIRO sinal — *toda ponta
de corte tem que abrir e fechar no silêncio*. E o piso dele não é fração do pico
(numa sala viva o ruído ambiente fica justo em 8% do pico e todo corte bom seria
reprovado): é o **decil mais baixo do próprio corte, vezes 2**. Calibrado contra
quatro cortes conhecidos — o comido tinha fala a 700 na ponta, os bons tinham
ruído a 200–280.

Passado nos cortes das três últimas peças (falado14, 15 e 16): **só o clip1
reprovou**. O clip3, com 30 ms de ar, ganhou folga na mesma leva. Peça foi a 953
frames.

**QA v2:** 953 frames como no plano, offset 0,0 ms, 0 quadros com topo liso, beat
+13,3 dB. Música: bittersweet (a rotação reiniciou). Faixa mascarada de 600
(cabelo em 512 px). Olhar conferido nos cinco cortes; portão de gagueira: 0.

## Auditoria do catálogo pelas pontas (16/09/2026) — e NH_comunicacao v2

Depois que a dona pegou "cirurgia" comida, passei o sinal novo de borda nos
**53 cortes das 16 peças faladas**. Duas reprovações, ambas de ENTRADA:

**NH_comunicacao (falado6/clip3) — defeito real, corrigido.** O fecho abria em
27,71, e "precisa" começa em **27,54**: o corte caía dentro da palavra. Pior, era
uma correção minha: a v1 tinha tentado escapar da gagueira "você VOCÊ precisa"
cortando *depois* dela, confiando num vale que o `bordas.py` da época apontava
com piso medido dentro da janela. Existe silêncio de verdade em 26,76 → 27,31,
antes de tudo. Corte foi pra **27,14** e o fecho passou a abrir em "Você precisa
estar atento", inteiro — e de quebra a anáfora dela fica com os quatro tempos
completos. Peça de 1026 → 1043 frames.

**NH_isquemia (falado8/clip3) — falso positivo.** Aquela fita tem piso de ruído
alto (o próprio plano registra isso): o decil mais baixo dá 257 contra 22 na
fita da NH_comunicacao. Os primeiros 200 ms oscilam entre 238 e 698 sem ataque
nenhum — é sala, não fala. **O limiar de borda fica marginal em fita
barulhenta; ali a leitura é no ataque, não no valor absoluto.**

As outras 51 passaram, com 8 avisos de "borda apertada" (30–50 ms de ar) que
foram conferidos um a um: palavra inteira nos oito.

**Outro falso positivo, do teste de topo liso:** ele acusou 1 quadro na
NH_comunicacao. É o **frame 112, o último da transição de filme**, que vai a
preto (RGB 0,0,0) — não a faixa da marca (#0B2436). O teste deveria ignorar
preto puro.

## ORDEM PERMANENTE (15/09/2026): varrer o corte pronto em toda peça falada

*"Sempre refaça essa varredura nos próximos vídeos."*

Ferramenta: `projeto-remotion/scripts/varrer-corte.py`, rodada nos cortes antes
de renderizar, nos dois vãos (0,12 e 0,07). **Sai com código 1 quando suspeita
de fala repetida e diz em que segundo o corte deveria entrar — código 1 é
portão: refaz o corte, não renderiza.**

Testada contra o defeito que a originou: alimentada com o corte da NH_medico v1,
ela acusa o falso começo e aponta 1,17 s (= 26,59 na fita), que é exatamente
onde a v2 entrou.

**NH_medico_v3 (15/09):** a dona pegou o SEGUNDO falso começo da mesma peça —
*"o início 'porque pra nós' também está repetindo"*. A fita abre com a frase dita
duas vezes e a v2 entrava na primeira. Corte foi pra **0,94**; a definitiva ataca
em 1,08. A peça caiu pra 632 frames de conteúdo (823 no total).

**E este escapou da varredura que eu tinha acabado de instalar.** O vale entre as
duas tentativas não desce até o piso, então elas caem numa região só e o sinal de
"região repetida" não vê nada. Quem denuncia é o transcritor **esticando uma
palavra por cima do buraco**: "para" de 0,42 a 1,52 — 1,10 s numa preposição. O
`varrer-corte.py` ganhou esse segundo sinal, e passou a distinguir **anáfora** de
gagueira (sem isso ele reprovava a NH_comunicacao, que é construída em cima da
anáfora). Passado em todos os cortes das três peças: só aquele defeito.

**Catálogo inteiro varrido (15/09/2026).** Passado o portão nos **33 cortes** de
todas as peças faladas já entregues: **nenhum falso começo e nenhuma repetição
colada.** O único aviso foi a anáfora da NH_comunicacao ("você precisa estar de
olho em qualquer coisa… no paciente… no monitor"), que é recurso dela e fica —
e foi justamente esse caso que ensinou o script a não reprovar anáfora. Os
avisos de "palavra longa" que sobraram são a 1ª palavra de cada corte, que sai
esticada porque o modelo a ancora em 0,00 e a folga de entrada entra na conta;
todos se resolvem no trecho isolado.

Três passos sobre o corte pronto, nenhum substitui o outro: **transcrever** (pega
palavra comida na borda), **varrer em 0,12** (pega falso começo) e **varrer em
0,07** (confirma que o resto é respiro). Gagueira é a região seguinte REPETIR a
abertura da anterior; região que CONTINUA a frase é respiro e fica.

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

## A fita de três rolos que era uma fala só (15/09/2026) — NH_maltratado, NH_frieza, NH_medico

A dona mandou uma PASTA com três arquivos e a frase *"são 3 mas são 1 só, se der
mais ok"*. Confirmado antes de cortar: mesmo enquadramento, mesma sala, mesma
roupa, fala contínua. 358 s de bruto (IMG_9332 73,5 s · IMG_9333 183,6 s ·
IMG_9334 101,0 s), 4K vertical nativo (3840×2160 com rotação 90), 30 fps.

**Rendeu três peças**, na ordem do §02 (melhor trecho primeiro, depois "quantas
peças inteiras existem"):

| peça | gancho | conteúdo | música |
|---|---|---|---|
| NH_maltratado | NÃO FOI A CIRURGIA / QUE MARCOU ELE. | 27,2 s | bittersweet (+18,0) |
| NH_frieza | ELE CHEGA COM MEDO. / ENCONTRA FRIEZA? | 29,1 s | cosy (+13,6) |
| NH_medico | MÉDICO, A SUA EQUIPE / FAZ PARTE. | 23,0 s | imperfect (+33,0) |

A NH_maltratado saiu na frente porque é a única com CASO: um paciente real,
operado por outra equipe, e o que ficou nele não foi a cirurgia. O resto da fita
é tese. As três não repetem nenhuma frase.

**ORDEM NOVA DA DONA, no meio do trabalho: "nesse deixa o texto embaixo, na
altura do peito e mão".** Está certa, e a fita explica por quê: medida quadro a
quadro, a touca dela começa entre **72 e 400 px** e a máscara cirúrgica
pendurada vai até **1290 px**. O título do padrão (topo 270) caía em cima do
rosto. Motor ganhou o campo `Plano.tituloTop`; nestas três vale **1330**, na
faixa do peito, e a legenda (rodapé 430) já morava ali — o texto todo passou a
viver numa faixa só. O véu acompanhou: título baixo não encosta em borda
nenhuma, então virou faixa de 470 px com cauda dos dois lados, senão vira duas
linhas visíveis na parede lisa (mesmo defeito de 14/09).

**E A FAIXA MASCARADA NÃO COUBE.** Pela regra de 14/09 (`altura = topo_da_cabeça
÷ 0,85`) a faixa daria 85 a 470 px — sliver inútil. Ancorar embaixo também não
resolve: a máscara pendurada desce até 1290 e a legenda mora a partir de 1380.
Então nestas três o apoio é **corte seco de tela cheia, 72 frames**, nos pontos
em que a imagem prova a fala. É exceção medida, não preguiça: se a fita vier com
um palmo de céu, a faixa volta.

**Três bordas salvas pela medição** (todas teriam entregado palavra mastigada):
1. NH_frieza, saída do gancho: o `bordas.py` apontou vale em 49,62 e o
   transcritor fecha "frieza" em 49,48 — mas o /za/ vai até **49,88** e o vale
   real tem 60 ms, antes da tentativa abandonada de 49,96.
2. NH_medico, entrada do fecho: o ASR marca 43,62 e a varredura de regiões acusa
   fala em 43,05; tudo até 44,47 é piso de ruído e a voz só ataca em **44,51**.
3. NH_medico, clip1: o primeiro corte **comeu "número"** — o detector de cauda
   parou em 4,55 e a palavra vai até 5,24. **Só apareceu porque transcrevi o
   CORTE PRONTO, não a fita.** Virou passo obrigatório.

**"Cuidamos", não "codamos".** O transcritor devolve "codamos" nas duas passadas
do trecho isolado (0,65 e 0,84) — palavra que não existe. No stem montado ele
escreve "cuidamos", e é o que o sentido pede. Vale um ouvido dela.

**Faixa de cor.** Estas saíram do render em **faixa cheia** (luma 0–255, tag
`pc`), ao contrário das entregas anteriores (11–245, tag `tv`). Medido antes de
mexer: o dado é mesmo full range, então a conversão `pc→tv` é legítima. Feita no
transcode final, que de quebra derrubou os arquivos de 64 MB pra 32.

**QA:** H264 1080×1920, 30 fps, 1007/1063/880 frames como no plano, AAC 48 kHz,
decodificação inteira sem erro, **offset 0,0 ms** nas três janelas (2/8/20 ms,
r = 1,000) contra o master, **0 quadros com topo liso**, e o degrau do beat na
virada do gancho em **+15,2 / +11,2 / +16,7 dB**.

**NH_medico_v2 (15/09):** a dona ouviu **"O paciente… O paciente escolheu"** e
mandou a regra de volta: *"a última fala geralmente é a fala definitiva, não pode
ter fala repetida e gaguejando."* Estava certa. Dentro de uma única região da
fita (25,52 → 32,87) havia um falso começo de 0,82 s e, 250 ms depois, a tomada
boa; cortei no primeiro ataque. Corte foi pra **26,42**, a peça encolheu 30
frames (689 → 659 de conteúdo, 880 → 850 de duração), o apoio andou de 453 pra
423 e as legendas do clip2 em diante adiantaram ~0,9 s.

Passo novo, e agora obrigatório: **varrer o CORTE PRONTO**, não só transcrevê-lo.
Transcrição funde as duas tentativas e devolve a frase uma vez só — foi o que me
enganou. Varridas as outras duas peças nos mesmos dois vãos (0,12 e 0,07), as
quebras que aparecem são respiro de vírgula: a região seguinte CONTINUA a frase
em vez de repetir a abertura. As duas ficam como estão.

**Sem escuta perceptual**, como sempre: dá pra medir, não pra ouvir.

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

## Uma fita, duas peças (15/09/2026) — NH_iguais e NH_adapta

Fita "Nos atendemos vários médicos e não atendemos da mesma forma": **196 s**,
quase 5× as outras, e **h264 1080×1920 nativo** (rotação 90), não 4K. É da OUTRA
pessoa — touca, máscara e lupa, a mesma das peças NH_agilidade e NH_velocidade.

**É um caderno de tomadas, não uma fala corrida.** O gancho aparece **oito
vezes** entre 0 e 65 s, em versões diferentes ("não atende todos iguais" / "não
trabalhamos com todos iguais" / "não trabalha com todos igual" / duas
interrompidas). §02: vale a última completa, em 59,78 — que é também a mais bem
dita. O fecho também é dito duas vezes seguidas; fica o segundo.

**Duas peças, e isso é conclusão.** Existem dois ganchos de verdade:

| Peça | Gancho | Duração | Música |
|---|---|---|---|
| NH_iguais | "não trabalhamos iguais com todos" | 24,6 s | floating (+13,7) |
| NH_adapta | "não é o médico que tem que se adaptar à equipe?" | 25,6 s | lostmemories (+26,7) |

Cada um tem desenvolvimento e fecho próprios e nenhuma frase se repete. Na
NH_adapta a **ordem foi invertida de propósito**: na fita a pergunta vem no fim
(183 s) e o "não engessar" vem antes (156 s); montada, a pergunta abre.

**v2 das duas (15/09) — eu tinha descartado dois blocos por engano.** A dona
pediu mais vídeos; fui varrer a fita bloco a bloco e não havia terceira peça,
mas havia **dois trechos que eu dei por imprestáveis e não eram**. Os dois
voltaram, cada um no lugar exato:

1. **A terceira batida da anáfora** (NH_iguais). Na v1 li no JSON "cada@88,76"
   seguido de "médico@94,02" — 5,3 s de buraco no meio da frase — e descartei.
   **O JSON estava desalinhado**: medido no envelope, 88,10→90,30 é o fim da
   batida ANTERIOR, e a terceira começa limpa e inteira em **93,74** ("Cada
   médico tem a sua forma de trabalhar com a nossa equipe"), com o /k/ no ataque.
   A anáfora tem três batidas de novo e a menção à equipe voltou.
2. **O bloco dos protocolos** (NH_adapta). O transcritor da fita inteira escreveu
   "viabilidade CURRICULAR" e "tomamos CUIDAR", e eu li isso como fala embolada.
   Reanalisado isolado, as duas passadas devolvem **"viabilidade FOLICULAR"** e
   **"tomamos CUIDADOS"** — era erro do ASR, não dela. E o lugar é exatamente
   antes do "MAS nós não tentamos engessar a cirurgia no médico", que na v1 não
   tinha com o que contrastar. Agora a peça faz o movimento inteiro: temos
   padrão, **mas** não engessamos.

**Lição:** trecho descartado por "estar embolado" merece a mesma reanálise
isolada que um vão suspeito. Duas vezes seguidas o que parecia fala ruim era
leitura ruim.

Durações novas: NH_iguais 24,6 → **27,8 s**; NH_adapta 25,6 → **32,9 s**.

**Medido nas duas:** 30 fps constante, frames previstos, decodificação inteira
sem erro, **0 frames** com faixa de fundo no topo, offset entrega × master 0,0 ms
nas três janelas, masters a −16,0 LUFS. Transcritas as vozes montadas: nenhuma
repetição e nenhum engasgo sobraram. Entregas de 12 e 13 MB.

**Pendência antiga que segue:** a imagem desta fita continua espelhada (a logo do
jaleco lê ao contrário), como nas duas primeiras peças faladas.

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
