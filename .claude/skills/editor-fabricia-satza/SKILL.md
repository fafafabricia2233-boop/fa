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

## Antes de tudo: a identidade dela ainda não existe no projeto

`src/lib/marcas.ts` tem o perfil `fabricia` com a lista de pendências, e o motor
`ReelFalado` **se recusa a renderizar** enquanto elas existirem — mostra um
cartão preto listando o que falta. Isso é de propósito. Peça dela saindo com
azul-marinho e dourado da clínica é peça da clínica com o rosto errado, e
ninguém percebe até publicar.

Falta: cores, fontes (família + arquivos), se tem selo e qual o texto, logo do
fim, e pelo menos uma referência aprovada dela pra comparar. Basta um carrossel
dela — arquivo, print ou link — que eu extraio e preencho.

**Nunca** preencher esses campos por semelhança nem por hipótese. Em 12/09 apareceu
uma paleta candidata em dois carrosséis deste repositório (preto `#0a0a0a`,
dourado `#C9A96E`, azul `#1a2a6c`, display *Catchy Mager*), mas os arquivos
estão assinados `@newhair_fue` — não prova nada sobre a marca dela.

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
   *Não há Whisper instalado neste ambiente.* Ou a transcrição vem pronta, ou
   instalo o transcritor — o que não se faz é dizer que transcreveu.
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
   sentido em caixa alta no destaque. O exemplo recente usa 34 e 42 px e é o que
   prevalece. Máximo duas linhas por cue.
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
