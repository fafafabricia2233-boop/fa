# Kit — o que chegou e o que falta

Conferido em 12/09/2026 com `python3 kit-new-hair/conferir-kit.py`.
**20 dos 35 arquivos do MANIFEST chegaram, todos com SHA-256 batendo.**
Nenhum arquivo corrompido. A prancha `referencias/quadros-Stephanie.jpg`
chegou no segundo lote.

## Verificação de equivalência (12/09/2026)

O manual (§09) exige conferir a equivalência do ambiente novo pela referência
renderizada. **Feito, no que os arquivos permitem:** a composição do kit foi
registrada em `projeto-remotion` como `KitNewHairPilotGancho` e o trecho do
gancho (frames 0–141, o único que roda com `clip0.mp4`) renderizou aqui com
Remotion 4.0.434 / React 18 — o kit pede 4.0.410 / React 19 e rodou assim
mesmo. Resultado em `kit-new-hair/verificacao/`:

- `gancho-frame042.jpg` — título "SUA EQUIPE É / DEIXADA DE FORA?" no topo,
  dourado na segunda linha, filete, selo no rodapé, base deslocada 90 px.
  Bate com os quadros de 1,80 s e 3,68 s da prancha.
- `filme-frame136.jpg` — a transição de filme (§06) nos 7 frames antes da
  virada do gancho.

Não verificado: som, cortes 2–5, apoio e logo (arquivos ausentes).

## Falta (15)

Em ordem de importância para o trabalho:

| Arquivo | Para que serve | Sem ele |
|---|---|---|
| `referencias/NH_Stephanie_integracao_equipe_v1.mp4` | resultado aprovado, referência de ritmo e som | não dá pra comparar a entrega nova com o padrão aprovado, que é o que o manual §08 pede |
| `referencias/NH_indicacao_acolhimento_piloto_v5.mp4` | segunda referência aprovada | idem |
| `exemplo-aprovado/public/logo_h264.mp4` | animação final da marca | o fluxo A não fecha. O motor B usa a marca d'água que já está em `projeto-remotion/public/newhair/marca_dagua.mov` — conferir se é o mesmo asset |
| `exemplo-aprovado/public/digitando.mp3` | SFX do título digitado | já existe cópia em `projeto-remotion/public/newhair/digitando.mp3`, mas o hash do kit não pôde ser conferido |
| `exemplo-aprovado/public/zoom.mp3` | SFX do zoom | sem ele o zoom sonoro do fluxo A não existe |
| `exemplo-aprovado/public/apoio.mp4` | apoio da referência | o exemplo não reproduz igual |
| `exemplo-aprovado/public/clip1.mp4`, `clip3.mp4`, `clip4.mp4` | cortes 2, 4 e 5 da referência | o exemplo não renderiza (chegaram só clip0 e clip2) |
| `exemplo-aprovado/master_normalized.wav` | master de áudio da referência | não dá pra conferir o mix aprovado |
| `exemplo-aprovado/music.mp3` | trilha da referência (bittersweet, ataque 9,05 s) | não dá pra reproduzir o alinhamento do beat do exemplo |
| `exemplo-aprovado/remotion.config.ts` | config de render do exemplo | reproduzir exige recriar a config |
| `exemplo-aprovado/plan_v1.json` | mapa de tempos (mesmo hash de `src/plan.json`, que chegou) | sem impacto prático |
| `LEIA-ME.md`, `DRIVE-LEIA-PRIMEIRO.md` | instruções de reprodução do kit e do Drive | o GUIA-INTEGRAL cobre o essencial |

## O que dá pra fazer com o que chegou

- Ler o manual inteiro (chegou íntegro) e seguir os critérios.
- Ler o **código aprovado** (`src/video.tsx`, `src/index.tsx`, `fonts.ts`) e o
  **plano de tempos** (`src/plan.json`, `src/cues.json`, `spec.json`) — é a
  referência executável do padrão, e é o mais importante depois do manual.
- Usar os SFX que chegaram: `tencao.mp3`, `trocat-transicao.mp3`, `click.mp3`.
- Conferir a curadoria de músicas por hash antes de reutilizar qualquer ataque.

## O que NÃO dá

- Renderizar o exemplo aprovado inteiro (faltam 3 dos 5 cortes, o apoio e a logo).
- Comparar entrega nova contra referência aprovada em imagem, ritmo e som.
