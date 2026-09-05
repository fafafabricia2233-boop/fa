# Fabrícia Satza — Padrão de Carrossel

> Marca pessoal da Dra. Fabrícia Satza: tricologista e CEO da New Hair.
> Duas frentes de conteúdo, um sistema visual só. O template
> `Carrossel Template Base — Fabrícia Satza.html` já sai com tudo isto
> aplicado — quem gerar carrossel novo parte dele.

---

## As duas frentes

| | Frente Paciente | Frente Médico/Clínica |
|---|---|---|
| **Assunto** | Tricologia, queda capilar, cuidado com o couro cabeludo | Autoridade da Fabrícia como CEO, cirurgia de transplante capilar, gestão de centro cirúrgico |
| **Perfil no carrossel** | `@fabriciasatza` | `@newhair_fue` — creditado "Fabrícia Satza, CEO" |
| **Quem fala** | Dra. Fabrícia Satza, tricologista | Fabrícia Satza, CEO da New Hair |
| **Tom** | Acolhedor, didático, fala direto com quem sofre com a queda | Técnico, direto, autoridade de quem lidera equipe em centro cirúrgico |
| **Tag de categoria (canto direito)** | Ex.: `TRICOLOGIA E SAÚDE CAPILAR` | Ex.: `TRANSPLANTE CAPILAR`, `GESTÃO DE CENTRO CIRÚRGICO` |
| **Regras de compliance** | CFM (publicidade médica) — ver seção Compliance | Padrão New Hair já aprovado (POP + Padrão de Carrossel New Hair) |

O nome "Dra. Fabrícia Satza" aparece na tag do canto esquerdo em **toda peça, das duas
frentes** — é o mesmo rosto por trás dos dois conteúdos. O que muda é a tag da direita
(categoria) e o handle usado no CTA final.

---

## A decisão que originou este padrão

O modelo de referência trazido pela dona (carrossel `@rhanynevitemberg`, formato
tricoscopia) é bem diferente do carrossel atual da New Hair: lá o fundo dos slides de
texto é sólido (marinho/preto) com o avatar no topo; aqui **toda peça é foto** — capa e
slides internos —, com duas tags no topo (nome à esquerda, categoria à direita) e o
texto sobreposto à imagem com vinheta. É esse layout que a Fabrícia Satza carrega.

A paleta, porém, é a mesma paleta já aprovada da New Hair — dourado e marinho —
usada nas duas frentes, para manter uma identidade só entre o conteúdo pessoal da
Fabrícia e o conteúdo institucional da New Hair.

---

## Fontes

**Pendente de aprovação final.** A dona pediu teste comparativo entre a fonte mais
próxima da referência, Cormorant Garamond, Futura Light e Futura PT Light antes de
travar — teste em `font-test.html` (artifact enviado no chat). Até a decisão, o
template sai com **Cormorant Garamond** no título (já embutida em base64 no projeto,
mesma fonte usada pela New Hair em frases de impacto) — é a opção mais segura para
não travar o trabalho, e a troca depois é uma linha só (`--titulo` no CSS).

> **Nota sobre Futura:** Futura e Futura PT são fontes comerciais, não distribuíveis.
> Se a dona decidir por uma delas, precisa enviar o arquivo licenciado (`.ttf`/`.otf`)
> para embutir de verdade — no teste comparativo usei substitutas gratuitas (Jost e
> Poppins) só para dar a sensação visual.

| Onde | Fonte | Peso |
|---|---|---|
| Título da capa (`.hero-title`) | **Cormorant Garamond** (pendente) | 500 |
| Tags de topo (nome + categoria) | Montserrat | 500, tracking `.14em` |
| Subtítulo da capa / legendas sobre foto | Montserrat | 300, itálico |
| Corpo em slide escuro (sem foto) | Montserrat | 300 |
| Destaques, CTA, nome do perfil | Montserrat | 500 |
| Frases de impacto | Cormorant Garamond | 500 |

Variáveis CSS:
```css
--titulo: 'Cormorant NH','Montserrat',serif;   /* SÓ no título da capa — trocar aqui quando a fonte final for aprovada */
--font:   'Montserrat NH','Montserrat',sans-serif;
--serif:  'Cormorant NH',Georgia,serif;
```

Fontes embutidas em base64, das mesmas origens da New Hair
(`projeto-remotion/public/newhair/fontes/`) — o arquivo abre offline.

---

## Cores

Mesma paleta aprovada da New Hair, única para as duas frentes:

| Uso | Hex |
|---|---|
| Dourado — tags, destaques, ícones, filetes, bordas | `#C9A24A` |
| Marinho — fundo do CTA e slides sem foto | `#0B2436` |
| Off-white — texto sobre foto | `#F7F3EA` |
| Preto — vinheta, fundo dos slides sem foto | `#0A0A0A` |

Equivalentes em rgba: dourado `201,162,74` · off-white `247,243,234`.

---

## Formato e layout

Slide **1080 × 1350 px**. Duas variantes de slide de conteúdo (S02–S05), escolhidas
por post conforme o material disponível:

### S01 — Capa (sempre foto)
- Imagem de fundo cobrindo o slide, vinheta por cima
  (preto 70% no topo → 15% aos 40% → 30% aos 70% → 90% na base)
- Tag esquerda: topo `60px`, esquerda `72px` · Tag direita: topo `60px`, direita `72px`
  · ambas **26px** · dourado · CAIXA ALTA · tracking `.14em` · peso 500
- Bloco do título: alinhado à direita, base `16%` da altura, laterais `72px`
- Título: **80px** · Cormorant Garamond 500 · CAIXA ALTA · entrelinha `1.02`
  · sombra `0 4px 30px rgba(0,0,0,.55)`
- Subtítulo (ex.: "Parte I"): **32px** · Montserrat 300 · itálico · off-white 75%
  · margem superior `18px`

### S02–S05 variante FOTO — depoimento/quote sobre imagem
- Foto de fundo diferente por slide (procedimento, tricoscopia, paciente, rosto)
  + vinheta igual à capa
- Mesmas duas tags do topo, repetidas em toda peça
- Frase central: bloco `bottom: 18%`, laterais `88px`, texto centralizado
  · **52px** · Cormorant Garamond 500 · itálico · entrelinha `1.25`
- Filete dourado `72×3px` centralizado, acima da frase

### S02–S05 variante ESCURA — lista/explicação técnica
- Fundo sólido marinho `#0B2436` (ou preto `#0A0A0A`)
- Mesmas duas tags do topo
- Avatar (placeholder "FS" até ter foto real): círculo **108px**, borda dourada `2px`,
  centralizado, `120px` do topo
- Corpo `.t-main`: **56px** peso 300 · entrelinha `1.28` · centralizado
- Checklist/bullets alinhados à esquerda dentro do bloco centralizado, mesmas
  regras de espaçamento da New Hair (ver Padrão de Carrossel New Hair)

### S06 — CTA
- Fundo: degradê 155° `#0a0a0a → #0f1f50 (60%) → #0a0a0a` · vinheta por cima
- Avatar "FS" **140px**, opacidade 92%
- Texto: **44px** peso 300 — Montserrat, nunca a fonte de título
- Link (handle da frente): **44px** peso 500 · dourado · filete dourado 40% em cima
  e embaixo · padding `18px 56px`
- Bio: **32px** peso 300 · itálico · off-white 55%
- **Handle muda por frente:** `@fabriciasatza` (paciente) ou `@newhair_fue` (médico,
  com bio "Fabrícia Satza · CEO New Hair")

---

## Marcadores do template

`{{FRENTE}}` (`paciente` | `medico`) `{{CATEGORIA}}` `{{HANDLE}}` `{{COVER_BASE64}}`
`{{HOOK}}` `{{SUBTITULO}}` `{{SLIDE_2..5_TIPO}}` (`foto` | `escura`)
`{{SLIDE_BASE64}}` `{{FRASE_CENTRAL}}` `{{CONTEUDO_ESCURO}}` `{{CTA_TEXTO}}`
`{{CTA_BIO}}`

---

## Regras invioláveis

1. **Tag esquerda sempre "DRA. FABRÍCIA SATZA"** — nas duas frentes, é o mesmo rosto.
2. **Tag direita muda por post**, nunca fica genérica — nomeia a categoria real do
   conteúdo daquele carrossel.
3. Cormorant Garamond só no título da capa e nas frases de impacto — nunca peso
   900 nelas (a família não aguenta).
4. Avatar sem `width:100%` na imagem interna quando houver foto real — quebra o
   alinhamento (mesma regra da New Hair).
5. Handle do CTA final tem que bater com a frente do conteúdo — nunca cruzar
   `@fabriciasatza` com bio de CEO da New Hair ou vice-versa.
6. Assets **embutidos em base64** — o HTML tem que abrir offline.
7. **6 slides fixos**, salvo pedido explícito de esticar para uma sequência maior.

---

## Compliance

### Frente Médico/Clínica
Vale o Padrão de Carrossel e o POP já aprovados da New Hair:
- ❌ promessa de resultado clínico · antes/depois · citar concorrente · preço
- ❌ a palavra **bisturi** (vocabulário da casa é punch, implanter, pinça)
- ❌ sugerir que a equipe faz o que é privativo do médico (indicação, incisão, extração)
- ✅ selo obrigatório em peça que mostra cirurgia:
  `Procedimento realizado por médico · a New Hair realiza a instrumentação`

### Frente Paciente (publicidade médica — CFM)
Conteúdo assinado por uma médica tricologista segue a Resolução CFM de publicidade
médica:
- ❌ prometer cura, resultado ou percentual de sucesso de tratamento
- ❌ antes/depois de paciente (mesmo com autorização, é vedado em publicidade)
- ❌ comparar com outro profissional/clínica ou usar linguagem de superioridade
- ❌ divulgar preço, parcelamento ou condição comercial no carrossel
- ❌ diagnosticar ou prescrever à distância no comentário/DM — direcionar sempre
  para consulta
- ✅ CRM da Dra. Fabrícia Satza visível na bio do perfil (não precisa repetir em
  todo slide, mas tem que constar no perfil)
- ✅ tom educativo: explicar causas, mitos, quando procurar avaliação — nunca
  "prometer" solução

Criativo com chamada para ação de qualquer frente passa pela Fabrícia antes de ir ao ar.
