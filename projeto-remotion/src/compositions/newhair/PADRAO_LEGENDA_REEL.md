---
classe: REGRA
frente: new-hair
frescor: "atualizado 24/08/2026 · FRESH · atualiza: quem produzir peça nova da frente"
para_o_codex: ler
---

# New Hair — Padrão de Legenda de Reel (Kit Remotion)

> **Para o Claude que está lendo isto:** este arquivo é o padrão COMPLETO de legendagem de vídeo
> da New Hair. Ele foi construído medindo três peças reais e cada detalhe aqui custou uma
> medição ou uma ordem do dono. Siga na ordem. **Não improvise geometria, não invente palavra
> que a pessoa não falou, e não altere cor, fonte ou selo.** Quando este arquivo disser MEDIR,
> medir é obrigatório: as três peças produzidas até hoje divergiram em tudo que se costuma
> herdar por preguiça.
>
> Se algo aqui conflitar com o que você acha melhor: o padrão está **aprovado pelos sócios**
> ("ficou PERFEITO, esse é o modelo que eu quero", 13/08/2026). Proponha a mudança, não a execute.

---

## 0. O que este padrão faz e o que ele NUNCA faz

O motor **queima overlay por cima do corte já pronto**. Ele:

- ❌ nunca recorta o vídeo
- ❌ nunca mexe no áudio original da pessoa falando
- ❌ nunca regenera imagem, nunca põe música, nunca acelera
- ✅ só coloca: título, legenda de rodapé, selo de compliance e o SFX da digitação

Quem edita e corta é quem filmou. O motor entra depois.

---

## 1. Requisitos (instalar uma vez)

| O quê | Para quê | Como conferir |
|---|---|---|
| **Node.js 18+** | rodar o Remotion | `node -v` |
| **Este projeto Remotion** (`projeto-remotion/`) | o motor | `npm install` |
| **ffmpeg + ffprobe** | converter e medir a fita | `ffmpeg -version` |
| **Python 3** | rodar o `scripts/medir-fita.py` | `python --version` |
| **Transcrição** | legenda colada na fala | ver passo 3 (duas vias) |

Estrutura que o kit usa neste repo:

```
projeto-remotion/
  public/
    newhair/
      digitando.mp3            <- vem no kit, já commitado
      NOME_DA_FITA_h264.mp4    <- a fita já convertida (não versionar peças grandes fora do kit)
  scripts/
    medir-fita.py              <- medidor de fita (passo 2)
  src/
    compositions/
      newhair/
        NewHairLegendaTemplate.tsx   <- template-fonte, NÃO renderizar direto
        PADRAO_LEGENDA_REEL.md       <- este arquivo
        NewHairGelox.tsx             <- exemplo: cópia do template, uma por peça
    Root.tsx
```

---

## 2. Identidade visual (não se mexe)

| Elemento | Valor |
|---|---|
| Dourado | `#C9A24A` |
| Marinho (fundo e sombra) | `#0B2436` |
| Off-white (texto) | `#F7F3EA` |
| Fonte de corpo | **Montserrat**, peso 300 (fino) |
| Fonte de impacto | **Cormorant Garamond**, peso 500 |
| Formato | 1080x1920 vertical |

**Geometria de partida** (confirmar contra a fita, ver passo 2): título `top 118` · legenda
`bottom 430` · selo `bottom 300`. Use `top 150` quando o topo do quadro for imagem parada e não
houver prova visual competindo com o texto.

> Nota: existe outra paleta New Hair no projeto (`src/components/NewHairMotions.tsx`, dourado
> `#C9A96E` sobre preto/azul) usada em motion graphics de outras peças (`EquipeCapacitada`, `PRP`).
> Ela é de outra frente/peça e **não substitui** a paleta deste padrão de legenda de reel.

---

## 3. As 8 regras do padrão

1. **GANCHO = TÍTULO.** A primeira fala do vídeo vira headline no topo. **Enquanto essa fala está
   sendo dita, o rodapé fica VAZIO** — o título já é a legenda dela, e repetir vira parede de texto.
2. **Legenda de rodapé frase a frase**, colada na fala, com **a palavra que carrega o sentido em
   dourado e caixa alta** (VIABILIDADE FOLICULAR · ISQUEMIA · MAIS IMPORTANTE). Uma palavra por
   frase, não três.
3. **Título entra DATILOGRAFADO**, letra a letra, com cursor dourado piscando, e a última linha
   sai em dourado com um filete crescendo embaixo.
4. **Todo título digitado leva o `digitando.mp3`** [ordem permanente do dono, 13/08]. O som começa
   na primeira letra e **morre quando a última letra entrou**. Nem antes, nem sobrando depois.
5. **Teto de 2 segundos para a digitação inteira.** O número só andou numa direção (6,13s → 3s →
   2s) e a razão vale mais que ele: **som chato custa mais que sincronia**. Na dúvida entre colar
   na fala e acabar rápido, acabar rápido vence. O template calcula as janelas sozinho.
6. **O título pode ser permanente ou temporário — quem decide é a fita.**
   - *Permanente*: quando o topo do quadro é imagem morta. O título fica até o fim.
   - *Temporário*: quando o topo é B-roll que **é a prova** (cirurgia acontecendo). O título sai
     junto com o gancho **e o véu escuro de cima sai com ele**, deixando a prova limpa.
7. **END CARD INTOCADO.** Se a fita termina com a logo/animação da marca, **tudo** do overlay sai
   antes dela. Achar por MEDIÇÃO, nunca de olho.
8. **Selo de compliance permanente**, texto exato:
   `Procedimento realizado por médico · a New Hair realiza a instrumentação`
   A imagem mostra cirurgia acontecendo; o selo é o que separa instrumentação de ato médico na
   tela. **Não reescrever** — é linha aprovada.

---

## 4. O pipeline, passo a passo

### Passo 1 — Normalizar a fonte

Vídeo gravado em celular costuma vir em **HEVC/H265, e o Remotion não lê**. Converta sempre:

```
ffmpeg -y -i "fita_original.mp4" -c:v libx264 -crf 18 -preset slow -c:a aac -b:a 192k "fita_h264.mp4"
```

Medido: a conversão é limpa (lag de áudio 0 ms, correlação de envelope 1,0000 contra o original).
Coloque o resultado em `public/newhair/`.

### Passo 2 — MEDIR a fita (nunca pular)

```
python scripts/medir-fita.py "public/newhair/fita_h264.mp4"
```

Ele devolve as 3 coisas que **não se herda da peça anterior**:

- **End card** (o segundo em que a logo entra) → vai em `endCard` no CONFIG
- **Split screen** (dois planos no mesmo quadro) → vai em `splitScreen`
- **Cortes / viradas de plano** → se um corte cair perto do fim do gancho, **faça o título sair em
  cima dele**: a virada entrega a tela limpa de graça

*Por que isso é regra:* das três peças já feitas, uma tinha end card aos 31,05s, a outra **não
tinha nenhum** e era split screen, a terceira tinha end card aos 24,10s e não era split. Herdar
geometria é o erro que mais custa retrabalho nesta frente.

Depois disso, confira num still onde as faixas de texto caem: a do título (y 118 a 420) e a da
legenda (y 1330 a 1490) precisam cair em fundo legível e **fora da área cirúrgica, que é a prova**.

```
ffmpeg -y -ss 12 -i "public/newhair/fita_h264.mp4" -frames:v 1 still_12s.png
```

### Passo 3 — Transcrever, e conferir a transcrição

Duas vias, a régua é a mesma:

**(a) Whisper local** (preferida, dá os tempos prontos):

```
whisper "fita_h264.mp4" --model large-v3 --language pt --word_timestamps True --initial_prompt "gelox, implanter, folículo, viabilidade folicular, área doadora, instrumentação"
```

O `initial_prompt` com os termos da casa não é enfeite: é o que impede o modelo de inventar
palavra técnica.

**(b) Ouvir e escrever à mão**, marcando o segundo de início e fim de cada frase. Para vídeo de
30 a 45 segundos isso leva poucos minutos e é 100% confiável.

**⚠️ Conferência obrigatória, qualquer que seja a via:**

- **Nome próprio e termo técnico NUNCA saem do Whisper cru.** Já aconteceu: "isquionia" (palavra
  que não existe), "de sanção" no lugar de "descansar", "foliculo" sem acento. Confira cada termo
  técnico e cada nome contra o material da New Hair antes de queimar na tela.
- **Energia de áudio NÃO é prova de fala.** Numa fita, o Whisper "perdeu" 5 segundos que nunca
  existiram: o que havia ali era **música** do end card. Se o modelo devolver *"Tchau, tchau"* ou
  *"Legenda por [nome]"*, isso é alucinação clássica em áudio **sem** fala. Cruze com o end card
  medido no passo 2 antes de sair caçando transcrição faltando.

### Passo 4 — Escrever o título e as cues

**Título (o gancho):**

- 2 ou 3 linhas, últimas palavras em dourado
- **Fidelidade:** a única coisa que se pode cortar é palavra repetida. Exemplo real: *"de uma
  cirurgia mediana"* virou *"DE UMA MEDIANA"* porque "cirurgia" já estava na linha de cima. Isso é
  condensação de legenda. **Inventar palavra que a pessoa não disse, não.**
- **Kicker (vocativo tipo "MÉDICO DE TRANSPLANTE CAPILAR") só existe se a fala tiver vocativo.**
  Se ela não chamou ninguém, não invente.
- Sem travessão. Nunca.

**Cues (rodapé):**

- A primeira cue começa **depois** do gancho (regra 1)
- Uma frase por cue, no máximo duas linhas
- `gold: true` na palavra de sentido, já escrita em caixa alta
- `font: "serif"` na frase de impacto (Cormorant), com moderação
- tamanhos: 34 a 38 no corpo, 46 a 48 na palavra dourada

### Passo 5 — Montar a composição

1. Copie `src/compositions/newhair/NewHairLegendaTemplate.tsx` para `src/compositions/newhair/`
   com o nome da peça (ex.: `NewHairGelox.tsx`)
2. Troque `NewHairLegenda` pelo nome novo nas 3 ocorrências do fim do arquivo
3. Preencha **só o bloco CONFIG**
4. Registre no `Root.tsx`:

```tsx
import { NewHairGelox, NewHairLegendaProps } from "./compositions/newhair/NewHairGelox";

// dentro do <Folder name="REELS">, num <Folder name="NewHair-Gelox">:
<Composition
  id="NewHairGelox"
  component={NewHairGelox as React.FC<NewHairLegendaProps>}
  width={1080}
  height={1920}
  fps={30}
  durationInFrames={Math.round(28.867 * 30)}
  defaultProps={{ durationSeconds: 28.867, video: "newhair/fita_h264.mp4" }}
/>
```

`durationInFrames` = duração da fita (o `ffprobe` do passo 2 imprime) × fps.

5. Confira no Studio antes de renderizar:

```
npm run studio
```

### Passo 6 — Renderizar

```
npx remotion render src/index.ts NewHairGelox out/NH_gelox_legendado.mp4
```

### Passo 7 — Corrigir os 40 ms e verificar

**O encoder do Remotion atrasa o áudio em 40 ms (1,2 frame).** Nasce no render, não na conversão
(provado por cadeia de 3 arquivos). Sem lipsync é imperceptível, mas o conserto é de graça e **não
re-encoda nada**:

```
ffmpeg -y -i out/NH_gelox_legendado.mp4 -itsoffset -0.040 -i out/NH_gelox_legendado.mp4 -map 0:v -map 1:a -c copy -movflags +faststart NH_gelox_final.mp4
```

O arquivo `final` é o que se publica.

---

## 5. Compliance — o que NUNCA entra numa peça pública

Herdado das regras da frente. Vale para o vídeo e para a legenda do post:

- ❌ promessa de resultado clínico
- ❌ antes/depois
- ❌ citar concorrente
- ❌ preço
- ❌ a palavra **bisturi** (o vocabulário da casa é punch, implanter, pinça)
- ❌ dizer ou sugerir que a equipe faz o que é privativo do médico (indicação, incisão, extração)
- ✅ o selo do item 8 é obrigatório em toda peça que mostra cirurgia

**O padrão está aprovado. A veiculação de cada peça não.** Criativo falado com chamada para ação
passa pelos sócios antes de ir ao ar.

---

## 6. Checklist antes de entregar

- [ ] fonte convertida para H264 e o Remotion abriu sem erro
- [ ] `scripts/medir-fita.py` rodado **nesta** fita, e `endCard` / `splitScreen` vieram da medição
- [ ] tudo do overlay some antes do end card
- [ ] rodapé vazio enquanto o gancho é falado
- [ ] digitação inteira dentro de 2 segundos
- [ ] `digitando.mp3` presente, começando na 1ª letra e morrendo na última
- [ ] todo termo técnico e nome próprio conferido contra o material da casa
- [ ] nenhuma palavra na tela que a pessoa não falou
- [ ] selo de compliance presente e com o texto exato
- [ ] zero travessão em qualquer texto
- [ ] conserto dos 40 ms aplicado no arquivo final
- [ ] assistido inteiro, do começo ao fim, antes de mandar

---

## 7. Erros já pagos (não redescobrir)

| Sintoma | Causa | Conserto |
|---|---|---|
| Remotion não abre o vídeo | fonte em HEVC | converter para H264 crf 18 (passo 1) |
| O título **treme** enquanto é escrito | texto centralizado se recentra a cada letra | o template já resolve com um texto fantasma que reserva a largura |
| O SFX faz fade no meio e nunca termina | `<Loop>` reinicia o frame que chega na função de volume | o template ladrilha com `<Sequence>` por pedaço |
| Texto dourado some no fundo claro | falta de véu (scrim) | os dois scrims do template; peso maior quando é split screen |
| Detector de cortes devolve zero em qualquer vídeo | `-v error` silencia o `showinfo` do ffmpeg | o `medir-fita.py` lê frames por pipe raw, não por showinfo |
| Áudio parece fora de sincronia por um triz | os 40 ms do encoder do Remotion | passo 7 |
| "Sumiram 5 segundos de fala no fim" | era música do end card; Whisper alucina em áudio sem fala | cruzar com o end card medido |

---

*Padrão construído sobre três peças medidas: `foliculo_gelox` (36,6s, título permanente, end card
31,05s), `fabricia_x1` (43,03s, split screen, sem end card, título temporário) e `implantacao_fa`
(28,87s, voz-off, end card 24,10s, corte aproveitado em 6,90s).*
