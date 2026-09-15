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

## Vídeo ocupa a tela toda — ordem da dona (14/09/2026)

*"Sabe esse negócio azul em cima? Não gostei, prefiro que o vídeo fique na tela
toda."* Vale pelo §01 (correção explícita mais recente da responsável
prevalece), **inclusive contra o exemplo aprovado**, que usava apoio em faixa
com o plano empurrado pra baixo.

**De onde vinha a faixa azul.** O `objectFit: cover` preenche exatamente
1080×1920. O motor empurrava o plano dela pra baixo — 240 px nos cortes com
apoio em faixa, `titleShift` no gancho — pra cabeça não ficar atrás do apoio e
pro título ter céu. Empurrar 1920 px de imagem dentro de 1920 px de quadro
descobre o fundo da marca em cima. Medido na NH_velocidade v1: **209 px**.

**Não dá pra empurrar e preencher ao mesmo tempo de graça.** A fita é 9:16
exata, igual ao quadro: não existe imagem sobrando. Preencher com deslocamento
exige ampliar em `1 + deslocamento/(origem_y × 1920)` — 15 a 17% de recorte, num
material que já vinha ampliado 2,25×. Então o conserto **não** é ampliar: é
parar de empurrar.

**O MASCARAMENTO FICA** (ordem da dona, 14/09/2026: *"quero que continue
mascarando a imagem junto com minha fala"*). Apoio em `"full"` resolve a faixa
azul mas perde a fusão, e a fusão é o ponto: o apoio nasce dentro da imagem
dela, não é tarja colada por cima. Trocar `band` por `full` pra fugir do
problema é resposta errada.

**A altura da faixa se MEDE, não se herda.** É aqui que as duas exigências
deixam de brigar. O que a máscara precisa é dissolver no topo da cabeça — não
ter 760 px. No exemplo aprovado a cabeça caía a ~85% da altura da faixa, logo
abaixo do limite opaco de 82%; o 760 só fechava essa conta porque o plano ia
240 px pra baixo. Então:

1. **Medir onde começa a cabeça** no corte (a touca cirúrgica é fácil de achar
   por cor). Na NH_velocidade: 430 px no clip1, 440 no clip2.
2. **`altura = topo_da_cabeça ÷ 0,85`.** Deu 500 px. A faixa dissolve no mesmo
   lugar relativo de sempre, o rosto fica livre, e ninguém sai do lugar.
3. **`titleShift: 0`** — quem segura o título sobre a imagem é o véu do topo,
   que é pra isso que ele existe.
4. **`bandShift` é 0 por padrão** e só existe pra não alterar a peça já
   entregue. Plano novo não usa: o motor até amplia o quanto for preciso pra
   não sobrar fundo, mas isso custa recorte, e num material ampliado custa
   nitidez.

Vale a conta que mostra por que deslocar nunca compensa: com a cobertura no
mínimo, a cabeça acaba em `topo_original × escala`. Pra devolver a cabeça aos
617 px que o plano empurrado dava seria preciso ampliar **54%**. Faixa menor
sai de graça; empurrão, não.

**Efeito colateral que apareceu junto:** com a imagem ocupando tudo, o fim do
véu do título virou linha horizontal visível na parede lisa — o brilho saltava
de 87 pra 198 em 140 px. O véu passou de 520 px com queda seca pra 900 px com
cauda longa; o maior salto caiu de 19,4 pra 9,7 por 20 px, e a escuridão onde o
título mora (270→470 px) não mudou. Conferir isso faz parte do QA agora:
**véu que acaba em cima de fundo liso denuncia a borda.**

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

## Fita grande demais: proxy, não desistência (14/09/2026)

Chegou uma fita de **597 MB — 4K VERTICAL nativa (2160×3840, rotação 90 nos
metadados), HEVC, 60 fps**. É a melhor fonte que passou por aqui; as anteriores
eram cópias comprimidas de 480×854. O caminho que funcionou, sem baixar o
arquivo inteiro:

1. **Sondar por faixa.** `ffprobe` na URL do Drive lê o cabeçalho sem baixar.
   Conferir **rotação** sempre: 3840×2160 com `rotation=90` é vertical, não
   horizontal — o §07 proíbe esticar fonte horizontal, mas aqui não havia o que
   esticar.
2. **Áudio primeiro, e só o áudio.** `-map 0:a:0` na URL trouxe os 57 s em
   **7 segundos**. É o áudio que decide a edição inteira; o vídeo só é preciso
   depois que os cortes estão escolhidos.
3. **Transcrever o áudio**, não a fita.
4. **Proxy de trabalho**: a URL direto pra `scale=1080:1920,fps=30` em H.264.
   597 MB viraram 153 MB, e é desse proxy que saem os cortes. ~5 min.

Nada disso precisa de disco pro arquivo original. O conector do Drive continua
proibido pra vídeo (devolve base64 na conversa) — a URL
`drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t` é o
caminho.

## Fita grande: cortar direto da URL sai mais barato que o proxy

Atualização do método de 14/09. Gerar o proxy inteiro custou 4m42 numa fita de
57 s e ~6 min numa de 75 s. Se os cortes já estão escolhidos — e estão, porque
quem decide é o áudio — sai mais rápido puxar só eles, com busca em dois
estágios pra não perder precisão:

    ffmpeg -ss <inicio-3> -i "<URL>" -ss 3 -t <dur> -vf "scale=1080:1920,fps=30" ...

A busca rápida vai até 3 s antes (por keyframe, barata) e a fina completa por
decodificação. Deu **39 s por corte** e contagem de frames exata. O proxy
completo só compensa quando se vai garimpar a fita inteira no olho.

**Nunca rodar isso em segundo plano com `&`:** o wrapper volta na hora, o
processo é morto junto e o arquivo fica sem moov. Aconteceu duas vezes. Render
e transcode longos ficam em primeiro plano.

## O ASR funde tentativas e apaga a boa (14/09/2026)

Erro que quase passou na peça NH_saque. O transcritor devolveu **um** segmento
de 13,22 a 22,82 com a frase inteira do gancho. Era mentira em dois níveis:

- entre "tratado" (16,4) e "com cuidado" (19,7) ele marcou **silêncio**, e o
  envelope mostrava **fala** ali;
- reanalisado o trecho isolado, o que existe é a **segunda tentativa inteira**,
  de 17,15 a 21,93, fluida e com 0,99 de confiança em quase toda palavra.

Ou seja: ela parou depois de "tratado", recomeçou a frase, e o modelo **colou
as duas tentativas num segmento só e apagou o começo da segunda**. Montar pelo
JSON daria um gancho com buraco de 3 s ou um corte no meio da frase.

**Antes de tudo, varra a fita inteira.** Passo padrão desde 14/09: listar as
regiões com energia acima do piso e comparar com a cobertura do JSON, região por
região. Ou aparece região que o ASR ignorou (foi o caso da NH_saque), ou
aparecem buracos dentro de trechos anotados — e aí o que se perdeu foi TEXTO, não
região. Na NH_antecipa foram três palavras corrompidas dentro de trechos que ele
achava que tinha transcrito: "adiantar a" comendo duas frases inteiras,
"folhinhos" no lugar de "folículos" e "fuja" no lugar de "flua".


**Varredura de regiões não basta: transcreva cada região sozinha.** A varredura
diz ONDE há fala; ela não diz que duas regiões vizinhas são duas TENTATIVAS da
mesma frase. Quando o texto de um segmento do ASR cobre mais de uma região
separada, transcrever cada região isolada — é aí que a repetição aparece.
Aconteceu na NH_antecipa, pego de ouvido pela dona: três regiões
(13,40→15,00 "sem interromper." / pausa / 15,26→18,35 "sem interromper o médico,
sem ultrapassar os limites.") viraram uma frase só no JSON, e eu montei a peça
com a repetição dentro. Transcritas separadas, as duas tentativas aparecem nas
duas passadas.


**Palavras coladas não têm corte limpo entre elas.** Quando a gagueira é a
repetição imediata da mesma palavra ("você você precisa"), o vale entre as duas
pode ter um frame só — e cortar ali abre o plano no meio da vogal da segunda.
Aconteceu na NH_comunicacao: o corte no vale (27,53) entrou com a energia já
subindo, sem o ataque do "v", e o transcritor nem ouviu a palavra. **Ou entra a
gagueira inteira, ou se começa DEPOIS dela** — ali o fecho passou a abrir em
"precisa", com o /p/ inteiro, e a frase ficou "Precisa estar atento…", português
corrente com sujeito implícito. Conferir sempre a ABERTURA do corte feito: ela
tem que começar quieta e subir.

**Emenda de tentativa removida se esconde debaixo do apoio.** Tirar a tentativa
repetida deixa um corte no meio de um plano fixo. Fazer a faixa de apoio
atravessar esse frame é o que suaviza — foi o que a NH_antecipa v2 fez no frame
230.

**Regra:** pausa longa DENTRO de um segmento do ASR é suspeita, não silêncio.
Medir o envelope antes de aceitar. Achou energia onde o JSON diz que não há,
recortar só aquele trecho e transcrever de novo.

**Ao reanalisar, rodar as duas passadas — com e sem `initial_prompt`.** O
vocabulário do assunto faz o modelo COMPLETAR a frase esperada: em janelas de
2,5 e 3 s eu recebi a frase inteira como se estivesse toda ali. Só quando as
duas passadas dão o mesmo texto, com tempo por palavra coerente com a duração
do trecho, a leitura vale.


**Palavra de baixa confiança no FIM da frase também é trecho pra reanalisar, não
lixo.** Na mesma fita, o ASR fechou a frase com "para se revivir" a 0,40 — e
"revivir" nem existe em português. Descartei como ruído e cortei ali; a dona
ouviu que a fala estava cortada. Reanalisado o trecho isolado, as duas passadas
devolvem **"para a cirurgia"** com 0,82 e 0,87. Ou seja: a mesma regra que
resolveu a entrada vale pra saída, e eu não a apliquei nas duas pontas.

**Borda que termina em S, X, Z ou R se confere no AGUDO.** O /s/ de "mais" ia
até 44,86 e o corte em 44,85 ainda o comia. Numa medição de banda larga a
sibilante quase não aparece — quem a mostra é a banda acima de 3,5 kHz. O
`bordas.py` mede banda larga: pra final sibilante, olhar o agudo também.

E o contrário também aconteceu na mesma fita: em "não pode haver ___" o modelo
escreve "compreensão" e **mantém isso mesmo com "compressão" no vocabulário** —
prior de frequência da língua, não escuta. Quando o sentido da frase decide
(lista de danos ao folículo, logo depois de "não pode apertar"), vale escrever
o que faz sentido e **avisar a dona que aquela palavra precisa de ouvido**.

## `scripts/bordas.py` — a ferramenta do erro anterior

Depois do "agilidade" mastigado, conferir borda virou passo obrigatório e
ganhou ferramenta: `python3 scripts/bordas.py <audio> <tempo> [...]` desenha o
envelope em volta de cada candidato e aponta o vale.

Na fita de 14/09 ela pagou o investimento na primeira rodada: **as seis entradas
de corte estavam de 70 a 320 ms atrasadas no JSON do transcritor** — "Médico"
marcado em 8,98 começa em 8,72; "Orientar" marcado em 42,92 começa em 42,60.
Confiar no JSON teria mastigado *todos* os cortes da peça, não um.

## Fronteira de palavra do ASR não é fronteira de corte (14/09/2026)

Erro real, pego de ouvido pela dona na NH_velocidade: *"no gancho a palavra
'agilidade' está cortada"*.

O que tinha acontecido: o transcritor dava `Porque` = 0,78→1,30 e `agilidade` =
1,30→1,82, então cortar em 1,22 parecia seguro, 80 ms ANTES da palavra. Medida a
energia de 10 em 10 ms, a fita conta outra história: "que" termina em 1,09 e o
"a" de agilidade vai de 1,13 a 1,28. **O corte caiu no meio da vogal.**

**O ASR ancora na sílaba tônica, não no início do som.** Ele marcou "agilidade"
em 1,30 porque é ali que está o "gi", a sílaba forte. A vogal átona que abre a
palavra ficou do lado de fora, contada como parte da palavra anterior. Isso não
é bug do modelo, é como ele alinha — e vale pra toda palavra que começa em vogal
átona, que em português é meia língua.

**Regra:** corte que encosta em palavra se confirma no ENVELOPE, não no JSON.
Perfil de 10 ms em volta do ponto, e o corte mora no VALE entre as duas palavras.
Quando não há vale — fala emendada, "porqueagilidade", que é o caso normal — usa-se
o ponto mais baixo, e se nem isso existir a palavra anterior entra inteira ou se
procura outro take. Encurtar 120 ms não vale uma palavra mastigada.

E o de sempre: **transcrição não prova o corte**. O §02 já dizia que ela não prova
ausência de engasgo; agora se sabe que também não prova onde a palavra começa.

## Música: a folga é fixa, o ganho não (14/09/2026)

A pasta `lofi` do Drive chegou com 9 faixas; 8 batem **SHA-256 exato** com
`kit-new-hair/musicas-ataques-por-hash.json`, que traz o ataque medido de cada
uma. A nona (`Soulful - L'indécis`) não está na curadoria e por isso não entra:
sem ataque conferido não dá pra fazer o beat cair na virada, e chutar o ponto é
pior que ficar sem música. `scripts/conferir-musica.py` barra isso sozinho.

**O recorte começa em (ataque − virada do gancho)**, como o §05 manda. Confere-se
depois medindo a energia 300 ms antes e 300 ms depois da virada: tem que haver
entrada de beat ali. Não confundir com "o maior ataque do trecho" — o refrão
mais adiante quase sempre bate mais forte, e isso não invalida nada.

**A folga é 3 dB.** Três tentativas no mesmo dia (14/09/2026): 15 dB reprovado
na hora (*"achei a música baixa demais"*, lembrando que a virada do beat entra no
take pós-gancho e a 15 dB não chegava lá), 9 dB também baixo, e então *"AUMENTE
O LOFI EM 100%"* — cem por cento é o DOBRO da amplitude, +6,02 dB, logo 9 − 6 = 3.

**A 3 dB parece perigoso e não é, por causa do gênero.** Medido na banda onde a
inteligibilidade da fala mora (300 Hz a 3,4 kHz), a voz continua **13 dB acima**
da música — porque lofi é grave-pesado e quase toda a energia dela está abaixo
dessa banda. A folga global de 3 dB é presença, não mascaramento. Quem mexer no
número remede essa banda antes de entregar, porque com outro gênero a conta muda.

**O ganho 0,1 do §05 não serve, e agora se sabe por quê.** Aquela entrada do
JSON estava marcada AUSENTE: o número veio do manual e nunca tinha encostado num
arquivo. Medido contra as duas peças faladas, 0,1 põe a música a **1,0 dB** da
voz numa e **2,6 dB** na outra — isso não é fundo, é duelo.

O que é constante é a **folga**: `musica.abaixo_da_voz_dB` = 15. O ganho sai por
peça, de `scripts/ganho-musica.py`, porque o nível do stem de voz muda de peça
pra peça (ela é equilibrada corte a corte e a normalização só acontece no fim,
no mix inteiro). A mesma decisão de mixagem deu 0,0201 numa peça e 0,0241 na
outra. O cálculo ignora as pausas: silêncio entre frases não pode puxar a média
da voz pra baixo e fazer a música subir junto.

**A faixa se escolhe pela FORÇA DA ENTRADA, não pelo nível médio.** Foi o erro
da primeira tentativa: escolhi por estabilidade e caí na `wander`, que entra com
só +5,9 dB — a virada não chegava. Medindo as oito (energia 300 ms depois do
ataque menos 300 ms antes): imperfect +33,0 · lostmemories +26,7 · bittersweet
+18,0 · floating +13,7 · cosy +13,6 · harmony +10,2 · wander +5,9 · kickback
+1,8. Abaixo de ~+13 dB a faixa não marca a virada e não serve aqui.

O formato certo é esse: **música quase inaudível debaixo do gancho e o beat
entrando no take pós-gancho.** Confere-se no master, na banda grave (<200 Hz),
onde a música mora e a voz não — nas duas peças o degrau na virada ficou em
+13 dB, com a música saindo de ~−53 pra ~−43 dBFS.

**Alternar faixa entre vídeos e registrar qual foi** — fica em
`padroes-audio.json` → `musica.usadas`.

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
