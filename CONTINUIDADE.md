# CONTINUIDADE — edição de vídeo New Hair

Arquivo exigido pelo manual (§09). Anexar numa conversa nova junto com
`kit-new-hair/GUIA-INTEGRAL.md`. Regra geral fica na seção "Regras gerais";
ajuste que vale só para uma peça fica na linha daquela peça.

Última atualização: 12/09/2026.

## Regras gerais refinadas (valem para as próximas peças)

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

## Pendências

- Kit incompleto: faltam 16 dos 35 arquivos do MANIFEST (ver
  `kit-new-hair/FALTANDO.md`). Sem as duas referências MP4 não dá pra comparar
  ritmo e som com o resultado aprovado.
- Banco de apoios no Drive ainda não configurado (§12) — falta o link.
- Identidade da Fabrícia Satza não definida: o motor está cravado na New Hair.
- Sem Whisper neste ambiente: fluxo A depende de transcrição fornecida ou de
  instalar o transcritor.
