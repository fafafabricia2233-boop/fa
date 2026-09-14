---
name: editor-fabricia-satza
description: Editar vídeos FALADOS da Fabrícia Satza (tricologista) — leitura do bruto, escolha das falas, cortes, gancho virando título, legendas coladas na fala, apoio, filme na virada, música no beat e assinatura final. Usar quando chegar fita com ela falando na câmera. Marca própria, separada da New Hair.
---

# Editor Fabrícia Satza — vídeo falado

Irmã da skill `editor-new-hair`, não filha dela. A **gramática de montagem** é a
mesma e está provada no exemplo aprovado; a **identidade** é outra e não se
empresta. O manual da New Hair diz isso em §01: *"Não misture recursos de outras
marcas."*

Fonte da gramática: `kit-new-hair/GUIA-INTEGRAL.md`, seções 02 a 09. Leia antes
de editar. O que muda pra ela está aqui.

## A identidade (recebida em 13/09/2026, instalada)

Kit oficial em `marcas/fabricia-satza/` — paleta com tabela de contraste, três
faces de fonte, logo em cinco cores, manual e tom de voz. O perfil executável
está em `projeto-remotion/src/lib/marcas.ts` sob `fabricia`.

O manual dela foi escrito pra **carrossel 1080×1440 sobre fundo claro**. Vídeo é
outro suporte: o texto mora sobre imagem. A tradução já está feita no perfil, e
cada escolha sai de uma regra escrita no manual dela:

| No vídeo | Valor | Por quê |
|---|---|---|
| Véu / fundo | café profundo `#28201F` | o manual dá a ele o papel de "fundo escuro neutro"; o vinho ameixa é o escuro de virada, forte demais pra ficar a peça inteira no ar |
| Destaque | champagne `#C9B39B` | **a regra que ela mais insiste**: taupe e champagne se invertem conforme o fundo. Sobre escuro, champagne dá 7,9:1; marrom terracota cai pra 2,8:1 e terracota suave pra 4,0:1, que só passa de 45px pra cima |
| Texto | branco suave `#FCFAF7` | 15,3:1 sobre café |
| Título | face **Alt** (o `a` de um andar), 52 e 88px | a Alt é a face de display dela |
| Legenda | face Light, 45 e 52px | o piso dela é 37px em texto corrido — a legenda da New Hair (34/42) fica **abaixo** desse piso e não serve aqui |
| Ênfase | peso 500 real (face Medium) | negrito sintético destrói o desenho da letra; é proibido no manual dela |
| Margem | 80px | a grade dela |
| Cabeçalho | `FABRÍCIA SATZA TRICOLOGIA` + eixo do tema, 22px, tracking .30em | "todo slide, sem exceção" — é o que mantém a peça identificada quando é printada e recompartilhada sem o perfil |
| Fecho | lockup marfim sobre café, 90 frames | ela não tem animação de logo, tem lockup parado |
| Selo | **não tem** | peça de tricologia dela não é ato cirúrgico da clínica |

O campo `cabecalho.direita` muda por peça: `Queda capilar`, `Alopecia`,
`Tricoscopia`, `Saúde capilar`.

## O tom de voz manda no texto da tela

`marcas/fabricia-satza/manual/Tom de voz.md`. O que muda a edição:

- **Frase curta, ponto final. Sem exclamação, sem emoji, sem "arrasta pra ver".**
- **Sem promessa de resultado** — é conteúdo clínico, não anúncio.
- O gancho promete **virada de entendimento**, não solução: *"Seu cabelo não
  caiu de uma vez"*, não *"3 dicas para parar a queda"*.
- O fim **convida**, não empurra: *"vale investigar"*, não *"AGENDE JÁ"*.
- **Nunca atacar outro profissional** — critica-se a conduta, não quem aplica.
- Se o texto não coube, **encurta o texto**; diminuir a fonte é a decisão que
  estraga a peça.

## O que a peça dela NÃO leva

- **Selo de instrumentação da New Hair.** Aquele texto separa ato médico de
  instrumentação numa peça da clínica. Numa peça de tricologia dela, ou não
  entra, ou entra outro — decisão da dona, não do editor.
- **Logo da New Hair no fim.** A assinatura do fim é dela.
- **Paleta e fontes da clínica.**

Se um apoio do banco da New Hair mostrar procedimento cirúrgico, ele carrega a
clínica junto. Usar só quando a fala dela justificar e com a dona ciente.

## O caminho, em ordem

1. **Ler o bruto inteiro.** Inventário (duração, resolução, rotação, fps,
   áudio) e transcrição com tempos por palavra. Separar tentativas da mesma
   frase. A última tentativa completa costuma ser a boa — confirmar na imagem,
   sem pegar o último take de outro assunto. ASR já omitiu retomada: reanalisar
   os trechos curtos ao redor de corte suspeito.
   **Transcritor instalado:** `bash scripts/instalar-transcritor.sh` uma vez
   por sessão (o container é efêmero e o modelo tem 1,5 GB, não dá pra
   versionar), depois `python3 scripts/transcrever.py <fita>`. É
   faster-whisper medium int8/CPU com tempo por palavra, como o §02 pede.
   Ele já entra com o vocabulário do assunto — sem isso, no teste de 13/09 ele
   escreveu "testerizada" no lugar de "terceirizada" logo no gancho.
   O JSON traz a probabilidade de cada palavra: prob baixa é sinal de conferir
   na mídia, **não** é garantia de que o resto está certo. No mesmo teste o
   erro do gancho passou com probabilidade alta.
2. **Montar o plano editorial.** Gancho, contexto/problema, solução, convite —
   quando existirem na fala. Não inventar CTA nem promessa pra fechar estrutura.
   A duração sai do conteúdo útil, não de uma meta de 30 s.
3. **Contrato das bordas.** Entrada com o rosto já dirigido à câmera e a
   primeira consoante inteira; saída com a última sílaba preservada. Conferir a
   emenda montada, não só as duas pontas isoladas.
4. **Gancho vira título**, duas linhas, condensação fiel da fala — a referência
   aprovada condensou uma frase longa em `SUA EQUIPE É / DEIXADA DE FORA?`.
   Digitação com teto de 2 s, SFX morrendo na última letra, filete crescendo até
   64 px. Enquanto o gancho é falado, **rodapé vazio**.
5. **Legendas** frase a frase, coladas na fala: uma linha de contexto e uma de
   sentido em caixa alta no champagne. **45 e 52 px** — os 34/42 do padrão da
   New Hair ficam abaixo do piso de 37 px dela. Máximo duas linhas por cue.
6. **Apoio** que prova ou esclarece o que ela está dizendo. Conferir o quadro
   antes de usar — nome de pasta não prova conteúdo. O catálogo do banco está em
   `banco-apoios/CATALOGO.md` com os quadros lidos em `banco-apoios/quadros/`.
   Conferir que o trecho tem frames suficientes: apoio que congela no último
   quadro já passou batido uma vez.
7. **Som.** Voz primeiro, sem acelerar. O beat cai na virada do gancho: se H é a
   virada e B é o ataque escolhido na música, o recorte começa em B−H. A tensão
   termina perceptivelmente na última palavra do problema, antes da pausa e da
   solução. O SFX de zoom acompanha movimento perceptível, não cada troca de
   plano.
8. **Render e mux.** Imagem sem áudio → mistura dos stems por fora → mux. Nessa
   ordem, que foi o que resolveu a defasagem do motor antigo.
9. **Medir o offset da saída, sempre.** O manual proíbe o deslocamento fixo de
   −40 ms. Medido neste ambiente com janelas de 2 ms: **42 ms** de atraso do
   áudio no render do Remotion, repetido em cinco peças. Conserto: remux com
   `-itsoffset -0.042` e conferir que a correlação volta a 0,0 ms. Medir de novo
   a cada peça — o número é do ambiente, não da física.

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

## Ferramentas deste repositório

| O quê | Onde |
|---|---|
| Motor de vídeo falado (multimarca) | `projeto-remotion/src/compositions/ReelFalado.tsx` |
| Perfis de marca | `projeto-remotion/src/lib/marcas.ts` |
| Medir a fita antes de legendar | `projeto-remotion/scripts/medir-fita.py` |
| Folha de contato pra conferir composição | `projeto-remotion/scripts/prancha.sh` |
| Catálogo do banco de apoios | `banco-apoios/CATALOGO.md` |
| Baixar apoio do Drive | `drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t` |
| Gramática completa | `kit-new-hair/GUIA-INTEGRAL.md` |

O `ReelFalado` recebe o plano pronto e executa; ele não escolhe corte por você.
O trabalho de leitura do bruto é onde o tempo deve ser gasto.

## Antes de entregar

Rever o MP4 inteiro, não a transcrição: abertura compreensível, sem retomada
escondida, sílabas inteiras nas emendas, legenda acompanhando a fala, apoio com
movimento do começo ao fim, tudo saindo antes da assinatura. Medir com ffprobe
(H264, 1080×1920, 30 fps constante, frames previstos, áudio AAC 48 kHz),
decodificar inteiro sem erro e comparar o áudio da entrega com o master.

Não existe escuta perceptual aqui: registrar essa limitação em vez de dizer
"ouvi". Entregar `FS_assunto_vN.mp4`, anotar em `CONTINUIDADE.md` o que mudou e
o que foi conferido, e **não marcar como aprovado** antes de a dona avaliar.
Não publicar.
