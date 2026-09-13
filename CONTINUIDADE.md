# CONTINUIDADE — edição de vídeo New Hair

Arquivo exigido pelo manual (§09). Anexar numa conversa nova junto com
`kit-new-hair/GUIA-INTEGRAL.md`. Regra geral fica na seção "Regras gerais";
ajuste que vale só para uma peça fica na linha daquela peça.

Última atualização: 12/09/2026.

## Regras gerais refinadas (valem para as próximas peças)

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

Trilha: nenhuma trilha nova foi introduzida — todas usam o áudio que já vinha
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
- Transcritor: **instalado** em 13/09. faster-whisper medium int8/CPU com tempo
  por palavra, `scripts/instalar-transcritor.sh` + `scripts/transcrever.py`.
  Precisa reinstalar a cada sessão (container efêmero, modelo de 1,5 GB).
  Validado contra a voz do exemplo aprovado: com o vocabulário do assunto
  acerta o texto; sem ele escreveu "testerizada" e "Mético" no gancho. E mesmo
  acertando, ainda junta frase e troca "deixa" por "deixe" — ou seja, o §02
  continua valendo: transcrição não prova ausência de engasgo.
