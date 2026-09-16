# Padrão — peça de câmera (fita crua de celular)

Este arquivo existe porque a dona teve que apontar, uma a uma, as sobras de um
corte meu. Ele é o conserto: as regras abaixo não são preferência, são o que
deu errado. **Ler antes de cortar qualquer fita de câmera.**

Peça de câmera = a pessoa falando direto pra lente, fita crua, sem passar por
CapCut. É diferente das peças antigas de B-roll cirúrgico, que chegavam já
cortadas e com música.

---

## O que NUNCA pode chegar na peça

1. **Releitura.** Ela lê a frase, erra, e lê de novo. Só a última leitura
   inteira entra.
2. **Gaguejada.** Rabo de uma leitura colado na cabeça da seguinte
   ("...faz parte do nosso, porque o acolhimento faz parte do nosso...").
3. **Repetição de palavra ou frase**, de qualquer tamanho.
4. **Ela olhando pro lado.** Principalmente na PONTA das frases: ela termina e
   já olha pro texto, ou olha pro texto e só depois começa a falar.
5. **Silêncio.** Buraco a partir de 0,28s é cortado. Abaixo disso é espaço
   entre palavras — cortar ali troca 0,1s de ar por um pulo de imagem visível.
6. **Sobra de gravação**: "não, tá errado", "amor, como que é", contagem.

E uma coisa que **sempre** tem que estar lá:

7. **Cauda na última fala da peça.** Pelo menos 0,20s depois do último som,
   de preferência 0,45s. Sem isso a última palavra sai estalada.

---

## A ordem dos passos

```bash
# 1. medir o olhar (uma vez por fita crua)
python3 scripts/olhar.py mov/IMG_XXXX.MOV

# 2. transcrever com timestamp por palavra e escolher à mão os trechos
#    aprovados — é aqui que saem releitura, gaguejada e sobra de gravação.
#    Desconfie de todo buraco: o whisper estica UMA palavra por cima de 2s que
#    ele não transcreveu, e é justamente aí que mora a repetição. Meça a
#    energia do áudio no buraco e passe o modelo grande só naquele pedaço.

# 3. planejar o corte fino (silêncio + olhar + pontas)
python3 scripts/planejar-corte.py 9789 9788 9787 9786

# 4. CONFERIR antes de montar — este passo não é opcional
python3 scripts/conferir-corte.py 9789 9788 9787 9786

# 5. montar
bash scripts/montar-fita.sh mov/IMG_XXXX.MOV public/newhair/peca_h264.mp4 ini,fim ...

# 6. retranscrever a PEÇA MONTADA e LER o texto corrido.
#    Se o texto não fecha, o corte está errado. É a única prova que vale.

# 7. medir a cabeça pra ancorar o gancho
python3 scripts/altura-cabeca.py public/newhair/peca_h264.mp4 <seg do gancho>

# 8. composição Remotion (template §10.1) + registro no Root.tsx, render

# 9. fechar com a marca d'água
bash scripts/fechar-peca-camera.sh out/Peca.mp4 out/Peca_marca.mp4
```

---

## As três regras do detector de olhar

Estão implementadas em `planejar-corte.py` e explicadas no cabeçalho dele.
Resumo do porquê:

1. **Olhar vale na ponta do trecho, não só no buraco entre trechos.** A versão
   que errou só consultava o olhar no silêncio entre dois trechos. O desvio
   quase sempre mora na ponta.

2. **A última fala da peça precisa de folga.** Cortar o fim no mesmo aperto dos
   cortes internos deixa a última palavra sem cauda.

3. **Base do olhar é local, móvel e medida só nos quadros em que ela fala.**
   A cabeça dela deriva devagar uns 0,13 ao longo de uma frase sem nunca sair
   da câmera; base fixa toma isso como desvio e come fala. E a base tem que
   ignorar os quadros parados, senão, quando ela fica 2s virada lendo o texto,
   a própria virada vira base.

---

## O que ainda é decisão humana

- **Escolher os trechos aprovados.** Nenhum script decide qual leitura é a boa.
- **Palavra ambígua.** Quando os modelos divergem ou o sentido não fecha,
  perguntar — nunca escrever na tela palavra que ela não disse.
- **Fita que acaba sem fecho.** Se a gravação termina sem a frase de
  encerramento, isso não se inventa: avisar que falta gravar.
