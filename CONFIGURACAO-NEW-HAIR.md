# CONFIGURAÇÃO — banco de apoios da New Hair

Arquivo exigido pelo manual (§12). Atualizado em 12/09/2026.

Estado: **pasta mapeada e acesso de listagem confirmado; acesso ao BINÁRIO da
mídia ainda não provado.** Pelo critério do manual ("só declarar banco
configurado depois de verificar a mídia"), **o banco ainda não está
configurado**.

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

## O bloqueio, descrito como o manual (§11) manda

O que funciona: listar pastas, ler nome, tamanho, tipo, data e ID de cada
arquivo. Isso é acesso real à pasta, mas **não é acesso à mídia** — nome de
pasta não prova o que o vídeo mostra.

O que não funciona hoje:

1. **Download público por URL.** Testado em 12/09 com a menor mídia do banco
   (`c4283c49…MP4`, 3,3 MB): o Drive devolveu página de login, não o arquivo.
   A pasta está compartilhada com a conta, não com "qualquer pessoa com o
   link".
2. **Download pelo conector.** A ferramenta devolve o conteúdo como base64
   dentro da própria conversa. Os vídeos do banco vão de 3,3 MB a 96 MB — um
   único download desses estoura a conversa antes de virar arquivo em disco.

**Destrave mais simples:** marcar a pasta como *"Qualquer pessoa com o link —
leitor"*. Aí o download vai direto pro disco do ambiente, sem passar pela
conversa, e o banco inteiro fica disponível automaticamente. Enquanto isso não
acontecer, o caminho que já funciona é o que temos usado: mandar o apoio como
anexo na conversa, igual às fitas.

## Regras deste registro

- Nome de pasta ajuda a buscar, **não prova** o que o vídeo mostra: inspecionar
  o candidato antes de usar.
- Nunca gravar credenciais aqui.
- Só declarar "banco configurado" depois de verificar a mídia, não a listagem.
- O bruto a editar é indicado em cada pedido — não se confunde com o banco.
