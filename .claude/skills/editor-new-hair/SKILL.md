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
