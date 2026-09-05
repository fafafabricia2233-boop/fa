---
name: fabricia-satza-tricologista
description: Gera carrosséis (HTML, 6 slides, 1080x1350) e roteiros de vídeo Remotion para a marca pessoal da Dra. Fabrícia Satza — tricologista e CEO da New Hair. Cobre duas frentes de conteúdo — pacientes com queda capilar (@fabriciasatza) e autoridade para médicos/clínicas de transplante capilar (@newhair_fue) — no layout de referência com foto de fundo + tags de topo. Ativar quando o usuário pedir carrossel, reel ou post para a Fabrícia Satza, tricologia, queda capilar, ou conteúdo de autoridade da New Hair para médicos.
---

# Fabrícia Satza — Máquina de Conteúdo (Tricologista + CEO New Hair)

Você gera carrosséis e roteiros de vídeo para a marca pessoal da Dra. Fabrícia
Satza. Ela tem **duas frentes de conteúdo simultâneas, uma identidade visual só**:

1. **Frente Paciente** — tricologia e queda capilar, para quem sofre com o problema.
   Publica em `@fabriciasatza`.
2. **Frente Médico/Clínica** — autoridade da Fabrícia como líder e CEO da New Hair,
   conteúdo sobre cirurgia de transplante capilar para médicos e clínicas.
   Publica em `@newhair_fue`, creditado "Fabrícia Satza · CEO".

A regra de design completa (fontes, cores, medidas, marcadores, compliance) está em
`Padrão de Carrossel — Fabrícia Satza.md` na raiz do repo — leia esse arquivo antes
de gerar qualquer peça nova, ele é a fonte da verdade. Este SKILL.md é o fluxo de
trabalho; aquele arquivo é a especificação visual.

## Primeiro passo em qualquer pedido: identificar a frente

Pergunte-se (ou pergunte à dona, se não for óbvio pelo pedido):
- É conteúdo **para quem sofre com queda capilar**? → Frente Paciente.
- É conteúdo **para médico/clínica**, sobre transplante, gestão de centro cirúrgico,
  ou construção de autoridade da Fabrícia como CEO? → Frente Médico.

Isso decide: handle do CTA, tag de categoria do canto direito, tom de voz e qual
bloco de compliance vale (ver `Padrão de Carrossel — Fabrícia Satza.md`, seção
Compliance).

## Carrossel — inputs mínimos

- **tema** — do que é o post, em uma frase
- **frente** — paciente ou médico (ver acima)
- **categoria** — a tag do canto superior direito (ex.: "TRICOLOGIA E SAÚDE CAPILAR",
  "TRANSPLANTE CAPILAR", "GESTÃO DE CENTRO CIRÚRGICO")
- **fotos** — se a dona já tiver fotos de capa/slides, pedir o caminho de cada uma.
  **Enquanto não houver foto real, o template mantém o placeholder `.ph-bg`**
  (degradê dourado/marrom com aviso visual "FOTO AQUI") — nunca inventar ou buscar
  foto de terceiros para preencher isso.
- **roteiro** — se a dona já trouxer copy pronto, usar; senão, gerar seguindo o tom
  da frente (ver abaixo)

## Fluxo de geração do carrossel

1. Ler `Padrão de Carrossel — Fabrícia Satza.md` para confirmar medidas/cores atuais
   (o documento pode ter sido atualizado, por exemplo quando a fonte do título for
   aprovada).
2. Copiar `Carrossel Template Base — Fabrícia Satza.html` para um novo arquivo
   nomeado pelo tema (`carrossel-<slug-do-tema>.html`).
3. Preencher os marcadores `{{...}}` (tags, título, frases, CTA) com o conteúdo do
   post — ver estrutura de 6 slides completa no Padrão.
4. Escolher, para cada slide S02–S05, a variante `foto` (frase central sobre imagem
   — bom para depoimento, quote de impacto) ou `escura` (fundo marinho sólido —
   bom para lista, explicação técnica, checklist). Não precisa ser sempre a mesma
   variante dentro do mesmo carrossel.
5. Se houver foto real fornecida pela dona, embutir em base64 no lugar do
   `.ph-bg`/`{{COVER_BASE64}}` daquele slide (mesmo processo usado para as fontes:
   ler o arquivo local, converter para base64, injetar no `background-image` via
   `data:image/...;base64,`). **Nunca deixar path de arquivo local (`file://`,
   `C:\...`) no HTML final** — tem que abrir offline em qualquer máquina.
6. Handle do CTA (S06) tem que bater com a frente escolhida no passo 1 — nunca
   misturar.
7. Rodar a validação rápida abaixo antes de entregar.

## Tom de voz por frente

### Paciente (@fabriciasatza)
- Fala em primeira pessoa, "você" direto — quem lê está sofrendo com a queda e
  quer ser entendido antes de ser instruído.
- Sempre educa antes de vender: explica o "porquê" (causa, mito, sinal de alerta)
  antes de qualquer chamada para consulta.
- Nunca promete cura, percentual de resultado, nem usa antes/depois — ver
  compliance CFM no Padrão.
- CTA sempre direciona para avaliação/consulta, nunca para "comprar" um produto
  ou procedimento.

### Médico/Clínica (@newhair_fue, credito Fabrícia Satza CEO)
- Técnico, direto, fala de líder para líder — reconhece a dor operacional do
  cirurgião (agenda, equipe, centro cirúrgico) antes de falar da New Hair.
- Reaproveita o vocabulário e as regras já validadas no POP e no Padrão de
  Carrossel New Hair (punch, implanter, pinça — nunca "bisturi"; nunca sugerir que
  a equipe faz o que é privativo do médico).
- Constrói autoridade da Fabrícia como CEO: bastidor de gestão, diferenciais da
  equipe, dado operacional (UF/hora, organização de equipe) — não é conteúdo de
  venda direta de procedimento a paciente.

## Vídeo — Remotion

Reaproveite a camada de templates parametrizados já existente em
`projeto-remotion/src/compositions/templates/` (ver `README.md` lá dentro) —
não crie uma composition nova do zero para cada vídeo. Ela já resolve captions,
title cards, SFX e música; o que muda por vídeo é o `props.<nome>.json`.

| Template existente | Quando usar para Fabrícia Satza |
|---|---|
| `DadoCientifico` | Vídeo com dado/estatística sobre queda capilar ou eficácia de tratamento (frente paciente) |
| `MitoVerdade` | Desmistificação — "mito vs verdade" sobre queda, tricoscopia, procedimentos (as duas frentes) |
| `HistoriaPessoal` | Trajetória da Fabrícia, bastidor de procedimento, prova de autoridade (frente médico, ou storytelling pessoal na frente paciente) |

Fluxo (igual ao documentado no README do template):
1. `cp props.example.<tipo>.json projeto-remotion/props.<nome-do-video>.json`
2. Editar `videoSrc`, `captionsJson`, `titleCards`, `sfxCues` conforme o roteiro.
3. Registrar a `Composition` em `Root.tsx` apontando para o template certo.
4. `npm run studio` (dentro de `projeto-remotion/`) para conferir e ajustar overlays.
5. Render: `npx remotion render <Id> out/<nome>.mp4`.

Vídeo segue a mesma regra de tom por frente da seção acima. Título/legenda que
citar transplante segue o vocabulário e compliance da New Hair; título/legenda de
tricologia para paciente segue a compliance CFM.

## ⚠️ Regras críticas (checar sempre antes de entregar)

1. Tag esquerda do carrossel é **sempre** "DRA. FABRÍCIA SATZA" — nas duas frentes.
2. Tag direita (categoria) **nunca genérica** — nomeia o assunto real do post.
3. Handle do CTA bate com a frente (`@fabriciasatza` × `@newhair_fue`).
4. Sem foto real ainda → mantém o placeholder `.ph-bg`, nunca substitui por uma
   imagem "de banco" ou gerada sem a dona ter mandado.
5. Compliance da frente correta aplicada (CFM para paciente, POP New Hair para
   médico) — ver `Padrão de Carrossel — Fabrícia Satza.md`.
6. Fonte do título: **Cormorant Garamond é provisória.** Se a dona já tiver
   aprovado uma fonte diferente no teste comparativo, usar a decisão dela e
   atualizar o Padrão — não perguntar de novo a cada carrossel.
7. Assets embutidos em base64 — arquivo final tem que abrir offline, sem
   depender de nenhum caminho local.
8. Peça com chamada para ação (qualquer frente) passa pela Fabrícia antes de ir
   ao ar — isso é aviso ao usuário, não um bloqueio técnico seu.

## Onde as coisas ficam

```
Padrão de Carrossel — Fabrícia Satza.md      ← especificação visual (fonte da verdade)
Carrossel Template Base — Fabrícia Satza.html ← template pronto, fontes já embutidas
.claude/skills/fabricia-satza-tricologista/   ← este SKILL.md
projeto-remotion/                             ← pipeline de vídeo (Remotion)
  src/compositions/templates/                 ← DadoCientifico, MitoVerdade, HistoriaPessoal
  public/newhair/fontes/                      ← fontes-fonte (Montserrat, Cormorant) já usadas aqui
```

Para referência do padrão institucional já validado da New Hair (frente médico
herda essas regras): `Padrão de Carrossel — New Hair.md` e
`POP Manual Operacional — New Hair.md`, ambos na raiz do repo.
