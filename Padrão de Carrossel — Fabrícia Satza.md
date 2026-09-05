# Fabrícia Satza — Padrão de Carrossel

> Marca pessoal de Fabrícia Satza: técnica de enfermagem, tricologista
> (cursando Biomedicina) e CEO da New Hair. Duas frentes de conteúdo, um
> sistema visual só. O template `Carrossel Template Base — Fabrícia Satza.html`
> já sai com tudo isto aplicado — quem gerar carrossel novo parte dele.

---

## Sobre o título profissional — regra que não muda

**Fabrícia não é médica.** É técnica de enfermagem, tricologista e está
cursando Biomedicina (ainda não formada/registrada). Isso significa:

- **Nunca usar "Dra."** ou qualquer prefixo que sugira formação médica — em
  nenhuma tag, bio, CTA ou legenda, nas duas frentes.
- **Nunca usar "Biomédica"** enquanto não formada e registrada no CRBM
  (Conselho Regional de Biomedicina) — se quiser citar a formação em
  andamento, é sempre "cursando Biomedicina" ou "acadêmica de Biomedicina",
  nunca como título já conquistado.
- O nome que aparece na tag do carrossel é só **"Fabrícia Satza"**, sem
  prefixo. Quando o conteúdo exige credencial por extenso (bio do CTA, por
  exemplo), o texto correto é **"Técnica de Enfermagem e Tricologista"**.

---

## As duas frentes

| | Frente Paciente | Frente Médico/Clínica |
|---|---|---|
| **Assunto** | Tricologia, queda capilar, cuidado com o couro cabeludo | Autoridade da Fabrícia como CEO, cirurgia de transplante capilar, gestão de centro cirúrgico |
| **Perfil no carrossel** | `@fabriciasatza` | `@newhair_fue` — creditado "Fabrícia Satza, CEO" |
| **Quem fala** | Fabrícia Satza, técnica de enfermagem e tricologista | Fabrícia Satza, CEO da New Hair |
| **Tom** | Acolhedor, didático, fala direto com quem sofre com a queda | Técnico, direto, autoridade de quem lidera equipe em centro cirúrgico |
| **Tag de categoria (canto direito)** | Ex.: `TRICOLOGIA E SAÚDE CAPILAR` | Ex.: `TRANSPLANTE CAPILAR`, `GESTÃO DE CENTRO CIRÚRGICO` |
| **Regras de compliance** | Escopo de atuação (ver seção Compliance) | Padrão New Hair já aprovado (POP + Padrão de Carrossel New Hair) |

O nome **"Fabrícia Satza"** (sem título) aparece na tag do canto esquerdo em
**toda peça, das duas frentes** — é o mesmo rosto por trás dos dois
conteúdos. O que muda é a tag da direita (categoria) e o handle usado no
CTA final.

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

**Decidido.** Título da capa em **Marcellus** (Google Fonts, licença SIL
OFL — gratuita e livre para uso comercial). Foi a opção do teste comparativo
mais próxima do estilo da foto de referência sem depender de fonte
comercial. Futura Light e Futura PT Light ficaram de fora: são fontes pagas
e o único arquivo oferecido para elas veio de um agregador que redistribui
fonte sem licença — não entra em peça da marca. Se um dia a dona comprar a
licença oficial (MyFonts/Fontspring/ParaType) ou tiver acesso via Adobe
Fonts, é só embutir o arquivo legítimo e trocar a variável `--titulo`.

| Onde | Fonte | Peso |
|---|---|---|
| Título da capa (`.hero-title`) | **Marcellus** | 400 |
| Tags de topo (nome + categoria) | Montserrat | 500, tracking `.14em` |
| Subtítulo da capa / legendas sobre foto | Montserrat | 300, itálico |
| Corpo em slide escuro (sem foto) | Montserrat | 300 |
| Destaques, CTA, nome do perfil | Montserrat | 500 |
| Frases de impacto | Cormorant Garamond | 500 |

Variáveis CSS:
```css
--titulo: 'Marcellus NH','Cormorant NH','Montserrat',serif;   /* SÓ no título da capa */
--font:   'Montserrat NH','Montserrat',sans-serif;
--serif:  'Cormorant NH',Georgia,serif;
```

Fontes embutidas em base64: Montserrat e Cormorant Garamond vêm de
`projeto-remotion/public/newhair/fontes/`; Marcellus vem de
`projeto-remotion/public/fabriciasatza/fontes/Marcellus-Regular.ttf`
(baixada direto do CDN oficial do Google Fonts). O arquivo final abre
offline.

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
- Título: **80px** · Marcellus 400 · CAIXA ALTA · entrelinha `1.02`
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
- **Handle muda por frente:** `@fabriciasatza` (paciente, bio "Fabrícia Satza ·
  Técnica de Enfermagem e Tricologista") ou `@newhair_fue` (médico, bio
  "Fabrícia Satza · CEO New Hair")

---

## Marcadores do template

`{{FRENTE}}` (`paciente` | `medico`) `{{CATEGORIA}}` `{{HANDLE}}` `{{COVER_BASE64}}`
`{{HOOK}}` `{{SUBTITULO}}` `{{SLIDE_2..5_TIPO}}` (`foto` | `escura`)
`{{SLIDE_BASE64}}` `{{FRASE_CENTRAL}}` `{{CONTEUDO_ESCURO}}` `{{CTA_TEXTO}}`
`{{CTA_BIO}}`

---

## Regras invioláveis

1. **Tag esquerda sempre "FABRÍCIA SATZA"** — sem título, nas duas frentes,
   é o mesmo rosto.
2. **Nunca usar "Dra." ou "Biomédica"** em qualquer peça — ver seção acima.
3. **Tag direita muda por post**, nunca fica genérica — nomeia a categoria real do
   conteúdo daquele carrossel.
4. Marcellus e Cormorant Garamond só onde a tabela de fontes indica — nunca peso
   900 nelas (nenhuma das duas aguenta).
5. Avatar sem `width:100%` na imagem interna quando houver foto real — quebra o
   alinhamento (mesma regra da New Hair).
6. Handle do CTA final tem que bater com a frente do conteúdo — nunca cruzar
   `@fabriciasatza` com bio de CEO da New Hair ou vice-versa.
7. Assets **embutidos em base64**, sempre de origem com licença livre ou
   licenciada de verdade — nunca fonte baixada de agregador tipo
   "maisfontes" — o HTML tem que abrir offline.
8. **6 slides fixos**, salvo pedido explícito de esticar para uma sequência maior.

---

## Compliance

### Frente Médico/Clínica
Vale o Padrão de Carrossel e o POP já aprovados da New Hair:
- ❌ promessa de resultado clínico · antes/depois · citar concorrente · preço
- ❌ a palavra **bisturi** (vocabulário da casa é punch, implanter, pinça)
- ❌ sugerir que a equipe faz o que é privativo do médico (indicação, incisão, extração)
- ✅ selo obrigatório em peça que mostra cirurgia:
  `Procedimento realizado por médico · a New Hair realiza a instrumentação`

### Frente Paciente (escopo de atuação — não é publicidade médica)
Fabrícia fala como técnica de enfermagem e tricologista, não como médica —
o conteúdo tem que respeitar esse limite:
- ❌ **nunca diagnosticar ou prescrever** à distância (comentário/DM/slide) —
  toda queda com causa incerta é direcionada para avaliação com profissional
  habilitado (dermatologista/médico)
- ❌ nunca usar "Dra." ou "Biomédica" — ver seção "Sobre o título profissional"
- ❌ prometer cura, resultado ou percentual de sucesso de qualquer cuidado
- ❌ antes/depois de paciente
- ❌ comparar com outro profissional/clínica ou usar linguagem de superioridade
- ❌ divulgar preço, parcelamento ou condição comercial no carrossel
- ✅ apresentar-se sempre pelo título real: Técnica de Enfermagem e
  Tricologista (mencionar "cursando Biomedicina" é opcional e só como
  formação em andamento)
- ✅ tom educativo: explicar causas, mitos, sinais de alerta, cuidados com o
  couro cabeludo — sempre recomendando avaliação profissional para
  diagnóstico, nunca "resolvendo" a distância

Criativo com chamada para ação de qualquer frente passa pela Fabrícia antes de ir ao ar.
