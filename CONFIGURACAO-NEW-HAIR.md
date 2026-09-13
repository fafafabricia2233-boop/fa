# CONFIGURAÇÃO — banco de apoios da New Hair

Arquivo exigido pelo manual (§12). Atualizado em 12/09/2026.

Estado: **BANCO CONFIGURADO** em 13/09/2026. A pasta foi aberta como "qualquer
pessoa com o link" e a mídia foi verificada de verdade: 22 vídeos sondados
(duração, resolução, fps, codec e áudio) e 3 quadros lidos de cada um, em
pontos diferentes. Catálogo em `banco-apoios/CATALOGO.md`, quadros em
`banco-apoios/quadros/` e folhas de contato em `banco-apoios/folha-*.jpg`.

## Pasta principal

| Item | Valor |
|---|---|
| Link | https://drive.google.com/drive/folders/1-izpf-Fn4mik8GfyfIBw06Wd_jy-6e6o |
| ID | `1-izpf-Fn4mik8GfyfIBw06Wd_jy-6e6o` |
| Dono | alexandro.barbosa.1999@gmail.com (compartilhada) |
| Data do teste | 12/09/2026 |

## Subpastas encontradas

| Categoria | ID |
|---|---|
| Contagem foliculo | `1v8Gkabya2BkXLLnMAfA_IgbNy8vzOTer` |
| implantacao | `15N9vYBlA_muIAv5nAsRI19UlwxTp-Ing` |
| organizando | `12WR08a2two9hyuTkaqO1af-gYj3A_4nd` |
| Sobrancelha_DrOpera | `1AwTRrB6rV6YqrCTZ8q1CCWPy5CQSU3qN` |

Na raiz também há mídia solta: `carregando implante e implantando.MOV`,
`carregamento_implanter.MOV`, `hidratando_foliculo.MOV`, `prp.mov`,
`emxerto em campo esteril.HEIC`, `classificacao das unidades.JPG`.

**Confirmação de que é o banco certo:** dentro de `organizando` está
`Organizando_mesa.mov`, que é exatamente o apoio usado na referência aprovada
(`spec.json` → `broll.source: "organizando/Organizando_mesa.mov"`).

## Como a mídia é acessada (funciona desde 13/09)

A pasta está como "qualquer pessoa com o link", então o binário vem direto pro
disco do ambiente, sem passar pela conversa:

    https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t

O `confirm=t` importa: arquivo acima de 100 MB cai na tela de aviso de
antivírus do Drive e, sem ele, o que chega é HTML em vez de vídeo — foi o que
aconteceu com `implantacao_fabricia_stephanie.MOV` (106 MB) na primeira
passada.

O ffprobe e o ffmpeg leem essa URL direto, por range, sem baixar o arquivo
inteiro. É assim que o catálogo foi feito: 22 vídeos sondados e 66 quadros
extraídos sem ocupar disco com a mídia.

**Não usar o download do conector** para vídeo: ele devolve base64 dentro da
conversa, e os arquivos aqui vão de 2,7 MB a 106 MB.

## O que cada categoria realmente mostra (conferido nos quadros)

| Categoria | Vídeos | O que a imagem mostra |
|---|---|---|
| `raiz` | 4 | carregamento do implanter, carregar e implantar, hidratação de folículos na cuba de 4 divisões, aplicação de PRP na área implantada |
| `contagem-foliculo` | 5 | grafts alinhados na placa sendo contados com pinça; um clipe é vertical 464×832 a 60 fps |
| `organizando` | 3 | montagem e organização da mesa cirúrgica, instrumentos sendo dispostos no campo |
| `implantacao` | 10 | implante com pinça e com implanter, dupla trabalhando, implante de sobrancelha, planos de sala com foco cirúrgico |

Nome de pasta continua não provando conteúdo — por isso os quadros ficaram
guardados no repositório. Antes de usar um apoio numa peça, conferir o quadro.

## Cuidado técnico ao usar o banco

O material é heterogêneo: tem 4K (3840×2160) horizontal, 1080×1920 vertical,
720×1280, 1024×576 e um 464×832 a 60 fps. Dois clipes não têm áudio. O manual
(§07) proíbe esticar fonte horizontal para 1080×1920 — o 4K horizontal precisa
de recorte pensado, não de esticão.

## Regras deste registro

- Nome de pasta ajuda a buscar, **não prova** o que o vídeo mostra: inspecionar
  o candidato antes de usar.
- Nunca gravar credenciais aqui.
- Só declarar "banco configurado" depois de verificar a mídia, não a listagem.
- O bruto a editar é indicado em cada pedido — não se confunde com o banco.
