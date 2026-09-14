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
