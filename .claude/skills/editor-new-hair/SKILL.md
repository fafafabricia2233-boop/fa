---
name: editor-new-hair
description: Editar reels da New Hair (e peças da Fabrícia Satza) no padrão aprovado — seleção de fala, cortes, apoios, título digitado, legendas, SFX, música e logo. Usar sempre que chegar fita bruta ou fita já cortada com roteiro pra legendar. Não abrange publicação nem outras marcas.
---

# Editor New Hair — instalado neste repositório

Este arquivo é a porta de entrada. Ele NÃO substitui o manual: o manual
completo, que é a fonte de verdade, está em `kit-new-hair/GUIA-INTEGRAL.md`
(mesmo conteúdo do PDF, hash conferido contra o MANIFEST). **Leia as seções
02–09 e 11–12 antes de editar.** O que está aqui embaixo é só o que o manual
não sabia: o que este ambiente tem, e as decisões que a dona já tomou depois
que o manual foi escrito.

## Os dois fluxos (não confundir)

A New Hair hoje tem DOIS tipos de trabalho, e cada um tem um motor:

**A. Fita bruta com alguém falando** → fluxo completo do manual.
Transcrever, escolher a última tentativa completa de cada fala, cortar,
montar, buscar apoio no banco, título, legendas, SFX (digitando, zoom,
tenção, filme/transição, click), música com o ataque caindo na virada do
gancho, logo no fim. Referência executável: `kit-new-hair/exemplo-aprovado/`.
Renderizar imagem sem áudio, misturar os stems e fazer o mux — nessa ordem.

**B. Fita já cortada, sem fala, com roteiro escrito** → motor de legenda deste
repositório, `projeto-remotion/src/compositions/NewHairLegendaTemplate.tsx`.
Ele só queima overlay por cima do corte pronto: título digitado, legendas de
rodapé, selo. Nunca recorta imagem nem mexe no áudio original. Foi assim que
saíram as peças NewHairEnxertos → NewHairEficiencia. O passo final é
`scripts/fechar-peca.sh`, que emenda a marca d'água e continua a trilha por
baixo dela.

Se a fita tem alguém falando e você vai escolher takes, é o fluxo A.
Se a fita já chegou cortada e o texto veio digitado na conversa, é o B.

## O que este ambiente realmente faz

Node + Remotion 4.0.434 (em `projeto-remotion/`), FFmpeg/ffprobe instalados
via apt (`apt-get update && apt-get install -y ffmpeg` — some quando o
container reinicia), Chromium do Remotion funcionando, render e still
conferidos. Não há escuta perceptual: dá pra medir waveform, offset,
loudness e ler frames, não dá pra dizer "ouvi". Registrar essa limitação na
entrega, como o manual manda (§08).

Fontes: o kit traz as fontes embutidas em `fonts.ts` (base64). O motor B usa
`projeto-remotion/src/lib/newhairFonts.ts`, que lê do disco — o Chromium do
Remotion aqui não confia na CA do proxy e o download do Google Fonts mata o
render. Não trocar por `@remotion/google-fonts`.

Transcrição: instalada. `bash scripts/instalar-transcritor.sh` uma vez por
sessão (container efêmero, modelo de 1,5 GB), depois
`python3 scripts/transcrever.py <fita>` — faster-whisper medium int8/CPU com
tempo por palavra e o vocabulário do assunto, como o §02 pede. Custa mais ou
menos tempo real: 27 s pra 24 s de áudio.

E vale o que o §02 já dizia: **transcrição não prova ausência de engasgo**. No
teste de 13/09, contra a voz do próprio exemplo aprovado, o modelo acertou o
corpo inteiro e errou o gancho ("Mético", "testerizada") — e sem vocabulário do
assunto. Com vocabulário acertou, mas ainda juntou frase e trocou "deixa" por
"deixe". Trecho suspeito se reanalisa na mídia.

## Decisões da dona posteriores ao manual

Estas prevalecem sobre o exemplo do manual quando conflitarem (§01,
"correção explícita mais recente da responsável prevalece"):

1. **Marca d'água em toda peça** (ordem de 25/08/2026): `fechar-peca.sh`
   emenda `marca_dagua.mov` no fim e continua a MESMA trilha da fita por
   baixo, com crossfade e fade de 1s. Nenhuma música nova entra aí.
2. **Título centralizado no meio exato do quadro** no motor B (a partir da
   peça NewHairCusta2), não no topo. O manual descreve `top 270` com 48/72 px
   — isso vale para o fluxo A, que tem rosto no quadro. No B, que é B-roll
   puro, o título mora no meio, 36 px nas linhas de cima e 44 px na dourada.
3. **Texto que não cabe na fita, corta** (decisão de 11/09 na peça
   NewHairCuidaPaciente): quando o roteiro pede mais leitura do que a fita
   tem de duração, mantém-se o gancho e as palavras-chave e avisa-se o que
   ficou de fora. Não se espreme legenda ilegível.
4. **Selo permanente**, texto exato, em toda peça que mostra procedimento:
   `Procedimento realizado por médico · a New Hair realiza a instrumentação`.

## Os 40 ms que não são 40 ms

O manual (§07) é explícito: **não aplicar deslocamento fixo de −40 ms; medir a
saída atual.** Medido neste ambiente, com correlação de envelope em janelas de
2 ms, o render do Remotion sai com o áudio **42 ms atrasado**, repetido em
cinco peças seguidas. O conserto é remuxar com `-itsoffset -0.042` no áudio e
conferir que a correlação volta a 0,0 ms. Medir sempre; o número pode mudar
com a versão do Remotion.

## Vídeo ocupa a tela toda — ordem da dona (14/09/2026)

*"Sabe esse negócio azul em cima? Não gostei, prefiro que o vídeo fique na tela
toda."* Vale pelo §01 (correção explícita mais recente da responsável
prevalece), **inclusive contra o exemplo aprovado**, que usava apoio em faixa
com o plano empurrado pra baixo.

**De onde vinha a faixa azul.** O `objectFit: cover` preenche exatamente
1080×1920. O motor empurrava o plano dela pra baixo — 240 px nos cortes com
apoio em faixa, `titleShift` no gancho — pra cabeça não ficar atrás do apoio e
pro título ter céu. Empurrar 1920 px de imagem dentro de 1920 px de quadro
descobre o fundo da marca em cima. Medido na NH_velocidade v1: **209 px**.

**Não dá pra empurrar e preencher ao mesmo tempo de graça.** A fita é 9:16
exata, igual ao quadro: não existe imagem sobrando. Preencher com deslocamento
exige ampliar em `1 + deslocamento/(origem_y × 1920)` — 15 a 17% de recorte, num
material que já vinha ampliado 2,25×. Então o conserto **não** é ampliar: é
parar de empurrar.

**O MASCARAMENTO FICA** (ordem da dona, 14/09/2026: *"quero que continue
mascarando a imagem junto com minha fala"*). Apoio em `"full"` resolve a faixa
azul mas perde a fusão, e a fusão é o ponto: o apoio nasce dentro da imagem
dela, não é tarja colada por cima. Trocar `band` por `full` pra fugir do
problema é resposta errada.

**A altura da faixa se MEDE, não se herda.** É aqui que as duas exigências
deixam de brigar. O que a máscara precisa é dissolver no topo da cabeça — não
ter 760 px. No exemplo aprovado a cabeça caía a ~85% da altura da faixa, logo
abaixo do limite opaco de 82%; o 760 só fechava essa conta porque o plano ia
240 px pra baixo. Então:

1. **Medir onde começa a cabeça** no corte (a touca cirúrgica é fácil de achar
   por cor). Na NH_velocidade: 430 px no clip1, 440 no clip2.
2. **`altura = topo_da_cabeça ÷ 0,85`.** Deu 500 px. A faixa dissolve no mesmo
   lugar relativo de sempre, o rosto fica livre, e ninguém sai do lugar.
3. **`titleShift: 0`** — quem segura o título sobre a imagem é o véu do topo,
   que é pra isso que ele existe.
4. **`bandShift` é 0 por padrão** e só existe pra não alterar a peça já
   entregue. Plano novo não usa: o motor até amplia o quanto for preciso pra
   não sobrar fundo, mas isso custa recorte, e num material ampliado custa
   nitidez.

Vale a conta que mostra por que deslocar nunca compensa: com a cobertura no
mínimo, a cabeça acaba em `topo_original × escala`. Pra devolver a cabeça aos
617 px que o plano empurrado dava seria preciso ampliar **54%**. Faixa menor
sai de graça; empurrão, não.

**Efeito colateral que apareceu junto:** com a imagem ocupando tudo, o fim do
véu do título virou linha horizontal visível na parede lisa — o brilho saltava
de 87 pra 198 em 140 px. O véu passou de 520 px com queda seca pra 900 px com
cauda longa; o maior salto caiu de 19,4 pra 9,7 por 20 px, e a escuridão onde o
título mora (270→470 px) não mudou. Conferir isso faz parte do QA agora:
**véu que acaba em cima de fundo liso denuncia a borda.**

## Fita com muita fala rende mais de uma peça — regra da dona (14/09/2026)

**Ordem explícita:** *"Sempre que eu te enviar um vídeo e tiver muitas falas e
você identificar que dá pra gerar mais de 1 vídeo com sentido em cada fala,
faça assim."*

Ou seja: **uma fita não é uma peça.** Depois de transcrever, o inventário da
fala vem antes do plano de montagem. E são **duas perguntas, não uma**:

- **"Qual é o melhor trecho desta fita?"** — continua valendo, e é a primeira.
  É ela que decide o que abre, o que vira título, qual corte ganha o zoom e o
  apoio melhor, e qual peça sai na frente.
- **"Quantas peças inteiras existem aqui?"** — a pergunta nova, que decide
  quantas.

A segunda não substitui a primeira: **ela impede que o resto da fita seja
jogado fora depois que a primeira já escolheu o melhor.** Responder só a
primeira desperdiça material; responder só a segunda nivela tudo por baixo e
entrega duas peças mornas no lugar de uma boa e uma boa.

Na prática: escolhe-se o melhor trecho, monta-se a melhor peça com ele, e
**então** se pergunta o que sobrou dá em pé sozinho. Foi literalmente o que
aconteceu aqui — a NH_agilidade levou o gancho mais forte e o único corte em
resolução nativa; a NH_velocidade veio do que sobrou, e por isso ganhou apoio
mais longo pra compensar. As duas são peças; elas não são gêmeas.

Não perguntar antes, não entregar uma e guardar o resto: entregar todas, uma
de cada vez, na mesma conversa, **a melhor primeiro**.

### Como decidir se um bloco que sobrou vira peça

Vira peça quando o bloco sustenta sozinho, **sem depender de ter visto a outra**:

1. **Gancho próprio.** Uma frase que abre sentido sem precisar da peça anterior.
   Conector de resposta ("Porque…", "Aí…", "Então…") não é gancho — ou se corta
   fora, ou o bloco não tem abertura.
2. **Desenvolvimento.** Pelo menos uma fala que explica, define ou prova o
   gancho. Gancho solto vira frase de efeito, não peça.
3. **Fechamento.** Alguma frase que encerra a ideia. Não se inventa CTA nem
   promessa pra fechar estrutura — se não existe fecho na fala, o bloco fecha
   na última frase boa.
4. **Não repete a outra.** Nenhuma frase que já foi ao ar na peça anterior.
   Assunto parecido pode; frase igual, não.
5. **Tem imagem pra sustentar.** Se o bloco todo vem do mesmo plano, o apoio do
   banco precisa cobrir mais tempo (foi o que a NH_velocidade fez: fita
   ampliada, então os dois apoios ficaram mais longos que os da NH_agilidade).

Se um bloco falha em 1, 2 ou 3, **ele não vira peça forçada**: registra-se o que
sobrou e por quê, e a dona decide. Encher tempo com fala que não fecha sentido é
pior que entregar uma peça a menos.

### Cada peça é peça inteira

Título próprio (o gancho daquela peça, não uma variação do outro), legendas
próprias, apoio escolhido pelo que aquela fala diz, e os SFX pela estrutura
**daquela** peça — a NH_velocidade saiu sem tensão e sem click porque o gancho
dela já era o problema. Copiar a receita de som da peça irmã é erro.

### O que registrar

No plano de cada peça (`planoXXX.ts`), em comentário: de onde veio cada corte na
fita, e **o que ficou de fora de propósito, com o motivo**. É isso que impede a
terceira peça de repetir a primeira, e é o que deixa a dona conferir a escolha.

## A mixagem tem receita: `scripts/mix-falado.sh`

Não montar filtergraph à mão. O script recebe as POSIÇÕES por flag e lê os
GANHOS do `padroes-audio.json`:

```
bash scripts/mix-falado.sh --voz VOZ.wav --sting STING.wav --saida MASTER.wav \
     --dur <duração+folga> --filme <s> --sting-em <s> [--tensao-fim <s>] [--click <s>]
```

`--dur` decide também o início do fade final (`dur − 1,0 s`) — é por isso que ele
não é a duração exata do vídeo, e sim ela com uma folga pequena.

**`--tensao-fim` e `--click` são opcionais, e omiti-los é decisão editorial.** Se
a peça não tem "problema" delimitado (o gancho já É o problema, e a virada está
marcada pelo filme), não entra tensão: o §05 posiciona o grave na última palavra
do problema, e forçá-lo sem problema é inventar estrutura. Foi o caso da
NH_velocidade (14/09/2026).

Conferido: rodando esse script com os parâmetros da NH_agilidade v3 ele
reproduz o master já entregue **bit a bit** (mesmo md5).

## Fita grande demais: proxy, não desistência (14/09/2026)

Chegou uma fita de **597 MB — 4K VERTICAL nativa (2160×3840, rotação 90 nos
metadados), HEVC, 60 fps**. É a melhor fonte que passou por aqui; as anteriores
eram cópias comprimidas de 480×854. O caminho que funcionou, sem baixar o
arquivo inteiro:

1. **Sondar por faixa.** `ffprobe` na URL do Drive lê o cabeçalho sem baixar.
   Conferir **rotação** sempre: 3840×2160 com `rotation=90` é vertical, não
   horizontal — o §07 proíbe esticar fonte horizontal, mas aqui não havia o que
   esticar.
2. **Áudio primeiro, e só o áudio.** `-map 0:a:0` na URL trouxe os 57 s em
   **7 segundos**. É o áudio que decide a edição inteira; o vídeo só é preciso
   depois que os cortes estão escolhidos.
3. **Transcrever o áudio**, não a fita.
4. **Proxy de trabalho**: a URL direto pra `scale=1080:1920,fps=30` em H.264.
   597 MB viraram 153 MB, e é desse proxy que saem os cortes. ~5 min.

Nada disso precisa de disco pro arquivo original. O conector do Drive continua
proibido pra vídeo (devolve base64 na conversa) — a URL
`drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t` é o
caminho.

## Fita grande: cortar direto da URL sai mais barato que o proxy

Atualização do método de 14/09. Gerar o proxy inteiro custou 4m42 numa fita de
57 s e ~6 min numa de 75 s. Se os cortes já estão escolhidos — e estão, porque
quem decide é o áudio — sai mais rápido puxar só eles, com busca em dois
estágios pra não perder precisão:

    ffmpeg -ss <inicio-3> -i "<URL>" -ss 3 -t <dur> -vf "scale=1080:1920,fps=30" ...

A busca rápida vai até 3 s antes (por keyframe, barata) e a fina completa por
decodificação. Deu **39 s por corte** e contagem de frames exata. O proxy
completo só compensa quando se vai garimpar a fita inteira no olho.

**Nunca rodar isso em segundo plano com `&`:** o wrapper volta na hora, o
processo é morto junto e o arquivo fica sem moov. Aconteceu duas vezes. Render
e transcode longos ficam em primeiro plano.

## O ASR funde tentativas e apaga a boa (14/09/2026)

Erro que quase passou na peça NH_saque. O transcritor devolveu **um** segmento
de 13,22 a 22,82 com a frase inteira do gancho. Era mentira em dois níveis:

- entre "tratado" (16,4) e "com cuidado" (19,7) ele marcou **silêncio**, e o
  envelope mostrava **fala** ali;
- reanalisado o trecho isolado, o que existe é a **segunda tentativa inteira**,
  de 17,15 a 21,93, fluida e com 0,99 de confiança em quase toda palavra.

Ou seja: ela parou depois de "tratado", recomeçou a frase, e o modelo **colou
as duas tentativas num segmento só e apagou o começo da segunda**. Montar pelo
JSON daria um gancho com buraco de 3 s ou um corte no meio da frase.

**Antes de tudo, varra a fita inteira.** Passo padrão desde 14/09: listar as
regiões com energia acima do piso e comparar com a cobertura do JSON, região por
região. Ou aparece região que o ASR ignorou (foi o caso da NH_saque), ou
aparecem buracos dentro de trechos anotados — e aí o que se perdeu foi TEXTO, não
região. Na NH_antecipa foram três palavras corrompidas dentro de trechos que ele
achava que tinha transcrito: "adiantar a" comendo duas frases inteiras,
"folhinhos" no lugar de "folículos" e "fuja" no lugar de "flua".


**Varredura de regiões não basta: transcreva cada região sozinha.** A varredura
diz ONDE há fala; ela não diz que duas regiões vizinhas são duas TENTATIVAS da
mesma frase. Quando o texto de um segmento do ASR cobre mais de uma região
separada, transcrever cada região isolada — é aí que a repetição aparece.
Aconteceu na NH_antecipa, pego de ouvido pela dona: três regiões
(13,40→15,00 "sem interromper." / pausa / 15,26→18,35 "sem interromper o médico,
sem ultrapassar os limites.") viraram uma frase só no JSON, e eu montei a peça
com a repetição dentro. Transcritas separadas, as duas tentativas aparecem nas
duas passadas.



**Trecho "embolado" merece a mesma reanálise que um vão suspeito.** Duas vezes
seguidas, na mesma fita, o que eu tinha descartado como fala ruim era leitura
ruim do ASR: "viabilidade curricular / tomamos cuidar" era "viabilidade
FOLICULAR / tomamos CUIDADOS", e um buraco de 5,3 s no meio de uma frase era
desalinhamento do JSON — a frase começava limpa 5 s depois. Antes de jogar fora
um bloco por estar mal dito, recortar e transcrever isolado, com e sem
vocabulário. Descartar sai mais caro que conferir.

**Palavras coladas não têm corte limpo entre elas.** Quando a gagueira é a
repetição imediata da mesma palavra ("você você precisa"), o vale entre as duas
pode ter um frame só — e cortar ali abre o plano no meio da vogal da segunda.
Aconteceu na NH_comunicacao: o corte no vale (27,53) entrou com a energia já
subindo, sem o ataque do "v", e o transcritor nem ouviu a palavra. **Ou entra a
gagueira inteira, ou se começa DEPOIS dela** — ali o fecho passou a abrir em
"precisa", com o /p/ inteiro, e a frase ficou "Precisa estar atento…", português
corrente com sujeito implícito. Conferir sempre a ABERTURA do corte feito: ela
tem que começar quieta e subir.

**Emenda de tentativa removida se esconde debaixo do apoio.** Tirar a tentativa
repetida deixa um corte no meio de um plano fixo. Fazer a faixa de apoio
atravessar esse frame é o que suaviza — foi o que a NH_antecipa v2 fez no frame
230.

**Regra:** pausa longa DENTRO de um segmento do ASR é suspeita, não silêncio.
Medir o envelope antes de aceitar. Achou energia onde o JSON diz que não há,
recortar só aquele trecho e transcrever de novo.

**Ao reanalisar, rodar as duas passadas — com e sem `initial_prompt`.** O
vocabulário do assunto faz o modelo COMPLETAR a frase esperada: em janelas de
2,5 e 3 s eu recebi a frase inteira como se estivesse toda ali. Só quando as
duas passadas dão o mesmo texto, com tempo por palavra coerente com a duração
do trecho, a leitura vale.


**Palavra de baixa confiança no FIM da frase também é trecho pra reanalisar, não
lixo.** Na mesma fita, o ASR fechou a frase com "para se revivir" a 0,40 — e
"revivir" nem existe em português. Descartei como ruído e cortei ali; a dona
ouviu que a fala estava cortada. Reanalisado o trecho isolado, as duas passadas
devolvem **"para a cirurgia"** com 0,82 e 0,87. Ou seja: a mesma regra que
resolveu a entrada vale pra saída, e eu não a apliquei nas duas pontas.

**Borda que termina em S, X, Z ou R se confere no AGUDO.** O /s/ de "mais" ia
até 44,86 e o corte em 44,85 ainda o comia. Numa medição de banda larga a
sibilante quase não aparece — quem a mostra é a banda acima de 3,5 kHz. O
`bordas.py` mede banda larga: pra final sibilante, olhar o agudo também.

E o contrário também aconteceu na mesma fita: em "não pode haver ___" o modelo
escreve "compreensão" e **mantém isso mesmo com "compressão" no vocabulário** —
prior de frequência da língua, não escuta. Quando o sentido da frase decide
(lista de danos ao folículo, logo depois de "não pode apertar"), vale escrever
o que faz sentido e **avisar a dona que aquela palavra precisa de ouvido**.

## `scripts/bordas.py` — a ferramenta do erro anterior

Depois do "agilidade" mastigado, conferir borda virou passo obrigatório e
ganhou ferramenta: `python3 scripts/bordas.py <audio> <tempo> [...]` desenha o
envelope em volta de cada candidato e aponta o vale.

Na fita de 14/09 ela pagou o investimento na primeira rodada: **as seis entradas
de corte estavam de 70 a 320 ms atrasadas no JSON do transcritor** — "Médico"
marcado em 8,98 começa em 8,72; "Orientar" marcado em 42,92 começa em 42,60.
Confiar no JSON teria mastigado *todos* os cortes da peça, não um.

## Fronteira de palavra do ASR não é fronteira de corte (14/09/2026)

Erro real, pego de ouvido pela dona na NH_velocidade: *"no gancho a palavra
'agilidade' está cortada"*.

O que tinha acontecido: o transcritor dava `Porque` = 0,78→1,30 e `agilidade` =
1,30→1,82, então cortar em 1,22 parecia seguro, 80 ms ANTES da palavra. Medida a
energia de 10 em 10 ms, a fita conta outra história: "que" termina em 1,09 e o
"a" de agilidade vai de 1,13 a 1,28. **O corte caiu no meio da vogal.**

**O ASR ancora na sílaba tônica, não no início do som.** Ele marcou "agilidade"
em 1,30 porque é ali que está o "gi", a sílaba forte. A vogal átona que abre a
palavra ficou do lado de fora, contada como parte da palavra anterior. Isso não
é bug do modelo, é como ele alinha — e vale pra toda palavra que começa em vogal
átona, que em português é meia língua.

**Regra:** corte que encosta em palavra se confirma no ENVELOPE, não no JSON.
Perfil de 10 ms em volta do ponto, e o corte mora no VALE entre as duas palavras.
Quando não há vale — fala emendada, "porqueagilidade", que é o caso normal — usa-se
o ponto mais baixo, e se nem isso existir a palavra anterior entra inteira ou se
procura outro take. Encurtar 120 ms não vale uma palavra mastigada.

E o de sempre: **transcrição não prova o corte**. O §02 já dizia que ela não prova
ausência de engasgo; agora se sabe que também não prova onde a palavra começa.

## Música: a folga é fixa, o ganho não (14/09/2026)

A pasta `lofi` do Drive chegou com 9 faixas; 8 batem **SHA-256 exato** com
`kit-new-hair/musicas-ataques-por-hash.json`, que traz o ataque medido de cada
uma. A nona (`Soulful - L'indécis`) não está na curadoria e por isso não entra:
sem ataque conferido não dá pra fazer o beat cair na virada, e chutar o ponto é
pior que ficar sem música. `scripts/conferir-musica.py` barra isso sozinho.

**O recorte começa em (ataque − virada do gancho)**, como o §05 manda. Confere-se
depois medindo a energia 300 ms antes e 300 ms depois da virada: tem que haver
entrada de beat ali. Não confundir com "o maior ataque do trecho" — o refrão
mais adiante quase sempre bate mais forte, e isso não invalida nada.

**A folga é 3 dB.** Três tentativas no mesmo dia (14/09/2026): 15 dB reprovado
na hora (*"achei a música baixa demais"*, lembrando que a virada do beat entra no
take pós-gancho e a 15 dB não chegava lá), 9 dB também baixo, e então *"AUMENTE
O LOFI EM 100%"* — cem por cento é o DOBRO da amplitude, +6,02 dB, logo 9 − 6 = 3.

**A 3 dB parece perigoso e não é, por causa do gênero.** Medido na banda onde a
inteligibilidade da fala mora (300 Hz a 3,4 kHz), a voz continua **13 dB acima**
da música — porque lofi é grave-pesado e quase toda a energia dela está abaixo
dessa banda. A folga global de 3 dB é presença, não mascaramento. Quem mexer no
número remede essa banda antes de entregar, porque com outro gênero a conta muda.

**O ganho 0,1 do §05 não serve, e agora se sabe por quê.** Aquela entrada do
JSON estava marcada AUSENTE: o número veio do manual e nunca tinha encostado num
arquivo. Medido contra as duas peças faladas, 0,1 põe a música a **1,0 dB** da
voz numa e **2,6 dB** na outra — isso não é fundo, é duelo.

O que é constante é a **folga**: `musica.abaixo_da_voz_dB` = 15. O ganho sai por
peça, de `scripts/ganho-musica.py`, porque o nível do stem de voz muda de peça
pra peça (ela é equilibrada corte a corte e a normalização só acontece no fim,
no mix inteiro). A mesma decisão de mixagem deu 0,0201 numa peça e 0,0241 na
outra. O cálculo ignora as pausas: silêncio entre frases não pode puxar a média
da voz pra baixo e fazer a música subir junto.

**A faixa se escolhe pela FORÇA DA ENTRADA, não pelo nível médio.** Foi o erro
da primeira tentativa: escolhi por estabilidade e caí na `wander`, que entra com
só +5,9 dB — a virada não chegava. Medindo as oito (energia 300 ms depois do
ataque menos 300 ms antes): imperfect +33,0 · lostmemories +26,7 · bittersweet
+18,0 · floating +13,7 · cosy +13,6 · harmony +10,2 · wander +5,9 · kickback
+1,8. Abaixo de ~+13 dB a faixa não marca a virada e não serve aqui.

O formato certo é esse: **música quase inaudível debaixo do gancho e o beat
entrando no take pós-gancho.** Confere-se no master, na banda grave (<200 Hz),
onde a música mora e a voz não — nas duas peças o degrau na virada ficou em
+13 dB, com a música saindo de ~−53 pra ~−43 dBFS.

**Alternar faixa entre vídeos e registrar qual foi** — fica em
`padroes-audio.json` → `musica.usadas`.

## Ganhos de SFX: um lugar só

`projeto-remotion/padroes-audio.json`. Vale para **toda peça nova das duas
marcas** — quem monta mix lê de lá em vez de repetir número no script.

O que mudou em relação ao manual: a **tensão é 0,319**, não os 0,65 do §05. A
dona pediu −30% e depois mais −30% na peça NH_agilidade, em 13/09/2026, e então
mandou padronizar. Pelo §01 ("correção explícita mais recente da responsável
prevalece"), 0,319 é o padrão e 0,65 virou histórico. O stem sozinho está 6,2 dB
abaixo do que o manual descreve.

Não descer mais sem pedido: 0,11 já foi reprovado por ficar inaudível, e um SFX
que não se ouve mas continua somando no mix é pior que SFX nenhum.

Cada ganho vale para o **arquivo de mesmo SHA-256**, igual ao critério do kit
para ataques de música. Trocou o arquivo, remede antes de reutilizar.

## Campos de CONFIG criados aqui (motor B)

- `mosaico: true` — a fita é um mosaico de vários clipes ao mesmo tempo; véu
  mais pesado (topo 0,88 / rodapé 0,78).
- `fitaClara: true` — a faixa da legenda passa de ~100 de brilho; véu de baixo
  a 0,92 subindo até 34% da tela e contorno de sombra no texto. Medir o brilho
  das faixas do título e da legenda antes de decidir.
- `endCard` e `splitScreen` vêm de `scripts/medir-fita.py`, **sempre conferidos
  a olho**: o detector já acusou end card que era só plano escuro e split
  screen que era só parede branca no topo.

## Antes de entregar

Checklist do manual §08, e mais o que este ambiente permite provar: ffprobe
(H264, 1080×1920, 30 fps, duração e frames previstos, áudio AAC 48 kHz),
decodificação inteira sem erro, stills nos pontos de texto, offset medido
entre fita e entrega. Entregar `NH_assunto_vN.mp4`, registrar o que mudou em
`CONTINUIDADE.md` e não declarar aprovação que a dona não deu. Não publicar.

## Banco de apoios no Drive

Ver §11 e §12 do manual e `CONFIGURACAO-NEW-HAIR.md` na raiz. Esta sessão tem
ferramentas de Google Drive disponíveis; o acesso à pasta só pode ser
declarado depois de abrir um vídeo de verdade, não pelo nome da pasta.

## Enquadramento sem céu: o texto desce e a faixa mascarada não cabe (15/09/2026)

**Ordem da dona, no meio do trabalho:** *"nesse deixa o texto embaixo, na altura
do peito e mão."* Vale pelo §01, e a fita explica por quê.

**Medir a cabeça é passo, não formalidade.** Naquela fita, quadro a quadro: a
touca começa entre **72 e 400 px** e a máscara cirúrgica pendurada vai até
**1290 px**. Sobra ~110 px de céu e nada de chão antes da legenda.

1. **O título desce.** `Plano.tituloTop` (sem valor, vale o da marca). Naquelas
   três peças: **1330**, na faixa do peito, e a legenda de rodapé 430 já morava
   ali — o texto todo passou a viver numa faixa só, com o rosto inteiro livre.
2. **O véu desce junto e muda de forma.** Véu de topo tem uma borda só, porque a
   outra é a borda do quadro. Título baixo não encosta em nada: precisa de
   **cauda dos dois lados** (lá: faixa de 470 px, transparente → 0,6 → transparente),
   senão viram duas linhas visíveis na parede lisa — o mesmo defeito de 14/09.
3. **E a faixa mascarada pode simplesmente NÃO CABER.** `altura = topo ÷ 0,85`
   deu 85 a 470 px: sliver inútil. Ancorar embaixo não salva — a máscara
   pendurada desce até 1290 e a legenda começa em ~1380. Nesse caso o apoio vira
   **corte seco de tela cheia, curto (72 frames)**, e isso se ANOTA como exceção
   medida. Não é o `full` preguiçoso que a dona reprovou em 14/09: lá a faixa
   existia e eu fugi dela; aqui ela não existe. Fita com um palmo de céu, a
   faixa volta.

**Regra geral:** antes de escolher apoio, medir topo da cabeça E base do rosto.
São os dois números que dizem se há faixa, onde ela vai, e onde o texto cabe.

## Transcreva o CORTE PRONTO, não só a fita (15/09/2026)

Passo novo, e pagou na primeira rodada. Depois de cortar os planos, transcrever
**cada arquivo cortado** e comparar com o texto pretendido.

Foi assim que apareceu que um corte tinha **comido a palavra "número"**: o
detector de cauda parou em 4,55 (limiar alto demais) e a palavra ia até 5,24.
Nenhuma medida na fita tinha acusado — a fita estava certa, o corte é que não.
Dois minutos de transcrição contra uma palavra mastigada na entrega.

## Faixa de cor: conferir contra o que já foi entregue (15/09/2026)

O render saiu em **faixa cheia** (luma 0–255, tag `pc`) numa fita de iPhone,
enquanto as entregas anteriores eram **faixa limitada** (11–245, tag `tv`).
Player que assume `tv` estoura o contraste de um arquivo `pc`.

**Medir antes de converter:** se YMIN/YMAX forem mesmo 0/255, o dado é full
range e o `scale=in_range=pc:out_range=tv` é legítimo; se já forem 16/235, o
arquivo só está mal etiquetado e converter lava a imagem. Conferido, feito no
transcode final — que de quebra derrubou 64 MB pra 32 sem perda visível
(crf 17 → 20, uma geração).

## Transcrever o corte não basta: VARRER o corte (15/09/2026)

Erro real, pego de ouvido pela dona: *"a última fala geralmente é a fala
definitiva, não pode ter fala repetida e gaguejando."* A NH_medico v1 entregou
**"O paciente… O paciente escolheu o seu trabalho…"**.

O que aconteceu: dentro de UMA região de fala da fita (25,52 → 32,87) havia um
falso começo de 0,82 s e, depois de uma pausa de 250 ms, a tomada definitiva. Eu
li o primeiro ataque como o início da boa e cortei ali.

**Por que a transcrição não pegou:** o transcritor funde as duas e devolve a
frase uma vez só — é o mesmo defeito documentado aqui desde a NH_saque, e ele
vale também para o corte já feito, não só para a fita.

**Por que a varredura da fita não pegou:** com vão de 0,18 s as duas tentativas
viram uma região só. O falso começo é curto e a pausa é curta.

**O passo que pega:** varrer o CORTE PRONTO com vão curto e transcrever cada
região isolada. Ali as duas aparecem separadas, e o falso começo se lê na hora.
Rodar em **dois vãos**: 0,12 acha o falso começo; 0,07 mostra a frase inteira
picada e serve pra confirmar que o que sobrou é pausa de vírgula, não gagueira.
Sinal de gagueira é a região seguinte **REPETIR a abertura** da anterior; região
que continua a frase ("…pode dominar", "…paciente não é um número") é respiro.

**Regra fechada, três passos sobre o corte pronto, nenhum substitui o outro:**
1. transcrever o corte — foi assim que apareceu a palavra "número" comida;
2. varrer o corte em 0,12 — foi assim que apareceu o falso começo;
3. varrer em 0,07 — confirma que o resto é respiro.
