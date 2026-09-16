#!/usr/bin/env python3
"""VARRE O CORTE PRONTO atrás de falso começo e gagueira.

ORDEM PERMANENTE DA DONA (15/09/2026): *"lembre que a última fala geralmente é a
fala definitiva, ajuste no vídeo, não pode ter fala repetida e gaguejando"* e,
logo depois: **"sempre refaça essa varredura nos próximos vídeos."**

POR QUE EXISTE. Na NH_medico v1 foi entregue "O paciente… O paciente escolheu o
seu trabalho…". Dentro de UMA região de fala da fita havia um falso começo de
0,82 s e, 250 ms depois, a tomada definitiva; o corte entrou no primeiro ataque.

E por que os passos que já existiam não pegaram:
  · TRANSCREVER o corte não pega — o modelo funde as duas tentativas e devolve a
    frase uma vez só. É o mesmo defeito documentado desde a NH_saque, e ele vale
    também para o corte já feito, não só para a fita bruta.
  · VARRER A FITA não pega — com vão de 0,18 s as duas tentativas viram uma
    região só, porque o falso começo é curto e a pausa entre eles também.

O que pega é varrer o CORTE, com vão curto, e transcrever cada região sozinha.

DOIS SINAIS, porque o primeiro sozinho deixou passar um caso real:

  (A) REGIÃO SEPARADA — a tentativa abandonada vira região própria e a seguinte
      repete a abertura dela. Pega o falso começo com pausa de verdade.
      Rodar em dois vãos: 0,12 acha, 0,07 confirma que o resto é respiro.

  (B) PALAVRA LONGA DEMAIS — quando o vale entre as duas tentativas não desce
      até o piso (respiração, sala viva), (A) funde as duas numa região só e não
      vê nada. Mas o transcritor deixa a digital: ele estica UMA palavra por
      cima do buraco. Na NH_medico v2 a fita abria com "Porque pra nós… porque
      pra nós" e o JSON deu **"para" de 0,40 a 1,54 s** — 1,14 s numa preposição.
      Mesma assinatura do "a" de 14,66→19,72 na fita 9332.
      Então: toda palavra curta que dura mais que o razoável é recortada e
      retranscrita sozinha, SEM vocabulário — é aí que a repetição aparece.

COMO SE LÊ, três casos e só um é defeito:
  GAGUEIRA  — a região abandonada é um PEDAÇO da boa ("o paciente" → "O paciente
              escolheu…"): texto contido na seguinte, ou bem mais curta. Refaz.
  ANÁFORA   — as duas abrem igual e SEGUEM DIFERENTE ("…estar de olho em qualquer
              coisa" / "…estar de olho no paciente"). É recurso de fala dela e
              FICA — foi a estrutura da NH_comunicacao. O script marca "anáfora?"
              e não reprova.
  RESPIRO   — a região seguinte CONTINUA a frase ("…pode dominar"). Fica.

Uso:  python3 scripts/varrer-corte.py <corte.wav|corte.mp4> [...] [--vao 0.12]
      python3 scripts/varrer-corte.py public/newhair/falado13/*.wav

Sai com código 1 se suspeitar de falso começo em algum arquivo — serve de
portão no QA antes de renderizar.
"""
import array, math, os, subprocess, sys, tempfile, unicodedata

def normaliza(t):
    t = unicodedata.normalize("NFD", t.lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return [p for p in "".join(c if c.isalnum() else " " for c in t).split() if p]

def regioes(arq, vao):
    raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", arq,
                          "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                         capture_output=True).stdout
    x = array.array("h"); x.frombytes(raw); w = 160
    env = [math.sqrt(sum(v * v for v in x[i*w:(i+1)*w]) / w) for i in range(len(x)//w)]
    if not env: return []
    piso = max(env) * 0.06
    fora = []; i = 0; lim = int(vao / 0.01)
    while i < len(env):
        if env[i] > piso:
            j = i; ult = i
            while j < len(env) and (j - ult) <= lim:
                if env[j] > piso: ult = j
                j += 1
            if ult - i >= 8: fora.append((i * 0.01, ult * 0.01))
            i = j
        else:
            i += 1
    return fora

SILABAS = "aeiouáéíóúâêôàãõy"

def piso_do_arquivo(arq):
    """Piso de ruído medido no ARQUIVO INTEIRO, não na janela.

    Existe por causa de um erro real (NH_somar, 16/09/2026): o detector de cauda
    tirava o piso da própria janela de 1,6 s, que era quase toda fala — o limiar
    subiu acima da palavra e ele declarou "fim da fala" 800 ms antes do fim.
    Resultado: a peça saiu com "cirurgia" cortada no meio, e a dona ouviu.
    Janela pequena não tem silêncio suficiente pra estimar piso.
    """
    raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", arq, "-ac", "1",
                          "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
    x = array.array("h"); x.frombytes(raw); w = 160
    env = [math.sqrt(sum(v * v for v in x[i*w:(i+1)*w]) / w) for i in range(len(x)//w)]
    if not env: return 1.0, env
    # O piso NÃO é uma fração do pico: numa fita com sala viva o ruído ambiente
    # fica justo em 8% do pico e todo corte bom seria reprovado. O piso é o
    # SILÊNCIO DO PRÓPRIO CORTE — decil mais baixo — e fala é o que passa bem
    # acima dele. Medido nesta fita: ruído ~200, fala na borda comida ~700.
    ordenado = sorted(env)
    p10 = ordenado[max(0, len(ordenado) // 10)]
    return max(p10 * 2.0, max(env) * 0.06), env

def bordas_do_corte(arq):
    """O corte ABRE e FECHA no silêncio? Devolve (folga_entrada, folga_saida) em ms.

    Um corte bom tem ar nas duas pontas. Se a energia na primeira ou na última
    fatia já está acima do piso, a borda pegou fala: consoante inicial comida ou
    palavra final cortada no meio.
    """
    piso, env = piso_do_arquivo(arq)
    if not env: return (0.0, 0.0)
    ini = 0
    while ini < len(env) and env[ini] <= piso: ini += 1
    fim = len(env) - 1
    while fim >= 0 and env[fim] <= piso: fim -= 1
    return (ini * 10.0, (len(env) - 1 - fim) * 10.0)

def fracao_de_fala(arq, a, b):
    """Quanto do intervalo tem ENERGIA de fala, de 0 a 1.

    É isto que separa a pausa legítima da fala engolida. Uma palavra esticada
    por cima de SILÊNCIO é só o modelo grudando a pausa nela ("Médico," antes do
    vocativo respirar). Esticada por cima de FALA significa que ele engoliu
    palavras — foi o caso do "desorganizada" de 2,16 s, que escondia a frase
    dita duas vezes.
    """
    raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-ss", str(max(0, a)),
                          "-t", str(b - max(0, a)), "-i", arq, "-ac", "1", "-ar", "16000",
                          "-f", "s16le", "-"], capture_output=True).stdout
    x = array.array("h"); x.frombytes(raw); w = 160
    env = [math.sqrt(sum(v * v for v in x[i*w:(i+1)*w]) / w) for i in range(len(x)//w)]
    if not env: return 0.0
    # piso do próprio arquivo, não do trecho: o trecho pode ser todo fala
    todo = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", arq, "-ac", "1",
                           "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
    y = array.array("h"); y.frombytes(todo)
    envt = [math.sqrt(sum(v * v for v in y[i*w:(i+1)*w]) / w) for i in range(len(y)//w)]
    piso = max(envt) * 0.08 if envt else 1
    return sum(1 for e in env if e > piso) / len(env)

def reinicia(pal):
    """Diz se a lista de palavras contém um RECOMEÇO.

    Não basta procurar palavra dobrada: "porque pra nó, porque pra nó" não tem
    nenhuma palavra repetida em seguida — o que se repete é o BLOCO de abertura.
    Então: existe k>=2 e j>=1 tal que pal[:k] == pal[j:j+k]?  Também vale a
    palavra imediatamente dobrada ("você você"), que é a gagueira curta.
    """
    if any(pal[i] == pal[i+1] for i in range(len(pal) - 1)):
        return True
    for k in range(2, len(pal) // 2 + 1):
        for j in range(1, len(pal) - k + 1):
            if pal[:k] == pal[j:j+k]:
                return True
    return False

def silabas(p):
    n = 0; ant = False
    for c in p:
        v = c in SILABAS
        if v and not ant: n += 1
        ant = v
    return max(1, n)

def main():
    args = sys.argv[1:]
    vao = 0.12
    if "--vao" in args:
        k = args.index("--vao"); vao = float(args[k+1]); args = args[:k] + args[k+2:]
    if not args: sys.exit(__doc__)

    from faster_whisper import WhisperModel
    modelo = WhisperModel("medium", device="cpu", compute_type="int8", cpu_threads=4)
    tmp = tempfile.mkdtemp()
    suspeitos = []

    def trecho(arq, a, b, voc=False):
        o = os.path.join(tmp, "r.wav")
        subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", str(max(0, a)),
                        "-t", str(b - max(0, a)), "-i", arq, "-ac", "1", "-ar", "16000", o],
                       check=True)
        segs, _ = modelo.transcribe(o, language="pt", condition_on_previous_text=False,
                                    vad_filter=False, beam_size=5,
                                    initial_prompt=("Transcrição sobre transplante capilar."
                                                    if voc else None))
        return " ".join(x.text.strip() for x in segs)

    for arq in args:
        # ---- sinal A: regiões separadas ----
        regs = regioes(arq, vao)
        print(f"\n--- {arq}: {len(regs)} região(ões), vão {vao:.2f} s ---")
        textos = [trecho(arq, a, b) for a, b in regs]
        for (a, b), t in zip(regs, textos):
            print(f"  {a:6.2f} → {b:6.2f} ({b-a:5.2f}s)  {t}")
        for k in range(len(regs) - 1):
            x, y = normaliza(textos[k]), normaliza(textos[k+1])
            if not x or not y: continue
            n = min(len(x), len(y), 3)
            if n < 1 or x[:n] != y[:n]:
                continue
            # abertura repetida. Agora: recomeço ou ANÁFORA?
            # Recomeço = a tentativa abandonada é um PEDAÇO da boa: texto inteiro
            #   contido nela, e bem mais curta.
            # Anáfora = as duas são frases inteiras que DIVERGEM depois da
            #   abertura comum ("estar de olho em qualquer coisa" / "estar de
            #   olho no paciente"). É recurso dela, e fica.
            dur_k = regs[k][1] - regs[k][0]; dur_s = regs[k+1][1] - regs[k+1][0]
            prefixo = y[:len(x)] == x
            curta = dur_k < 0.45 * dur_s
            if prefixo or curta:
                suspeitos.append(arq)
                print(f"  ⚠ FALSO COMEÇO: {regs[k][0]:.2f} ({dur_k:.2f}s) é começo "
                      f"abandonado de {regs[k+1][0]:.2f} — o corte entra em "
                      f"{regs[k+1][0]:.2f} s ou depois.")
            else:
                print(f"  · anáfora?: {regs[k][0]:.2f} e {regs[k+1][0]:.2f} abrem igual "
                      f"mas seguem diferente — provável recurso de fala, conferir.")

        # ---- sinal C: o corte abre e fecha no silêncio? ----
        fe, fs = bordas_do_corte(arq)
        for nome, folga in (("ENTRADA", fe), ("SAÍDA", fs)):
            if folga < 30:
                suspeitos.append(arq)
                print(f"  ⚠ BORDA {nome} SEM AR: só {folga:.0f} ms de silêncio na ponta "
                      f"— o corte pegou fala. Palavra comida.")
            elif folga < 60:
                print(f"  · borda {nome.lower()} apertada: {folga:.0f} ms de ar.")

        # ---- sinal B: palavra esticada por cima de um buraco ----
        segs, _ = modelo.transcribe(arq, language="pt", word_timestamps=True,
                                    condition_on_previous_text=False, vad_filter=False,
                                    beam_size=5)
        for sg in segs:
            for w in (sg.words or []):
                p = w.word.strip()
                dur = w.end - w.start
                limite = 0.22 + 0.22 * silabas(p)     # folga generosa por sílaba
                if dur > max(limite, 0.55):
                    # O que separa pausa legítima de fala engolida é O QUE HÁ NO VÃO.
                    # "Médico," esticado por uma pausa retórica: o vão é silêncio.
                    # "desorganizada" esticado porque o modelo engoliu a segunda
                    # tentativa: o vão é FALA. Mediu-se, não se adivinha.
                    fala = fracao_de_fala(arq, w.start, w.end)
                    bruto = trecho(arq, w.start - 0.05, w.end + 0.05, voc=False)
                    pal = normaliza(bruto)
                    # dentro do vão cabem palavras que o modelo não escreveu:
                    # se o vão é fala e o texto isolado é curto, sumiu conteúdo.
                    # só vale como "engoliu" se o vão for GRANDE o bastante pra
                    # caber uma tentativa inteira. Abaixo disso o sinal só produz
                    # alarme falso: a 1ª palavra de todo corte carrega a folga de
                    # entrada, e um trecho de 0,6 s transcrito sozinho volta vazio
                    # ou com bobagem sem que nada tenha sumido.
                    engoliu = fala > 0.5 and dur >= 1.2 and len(pal) < 1 + dur * 2.0
                    repete = reinicia(pal) or engoliu
                    # a PRIMEIRA palavra do corte sempre sai longa: o modelo
                    # a ancora em 0,00 e a folga de entrada entra na conta. Não
                    # é motivo pra suspeitar — quem decide é o isolado.
                    borda = " (1ª palavra: carrega a folga de entrada)" if w.start < 0.08 else ""
                    marca = "⚠ REPETIÇÃO" if repete else "· conferir"
                    print(f"  {marca}: \"{p}\" dura {dur:.2f}s ({w.start:.2f}→{w.end:.2f}), "
                          f"esperado ≤{limite:.2f}s{borda}, {fala*100:.0f}% do vão é fala. "
                          f"Isolado diz: \"{bruto}\"")
                    if repete: suspeitos.append(arq)

    if suspeitos:
        print(f"\n{len(suspeitos)} suspeita(s) de fala repetida. Refazer o corte "
              f"antes de renderizar.")
        return 1
    print("\nNada repetido. As quebras que sobraram são respiro — conferir que a "
          "região seguinte CONTINUA a frase.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
