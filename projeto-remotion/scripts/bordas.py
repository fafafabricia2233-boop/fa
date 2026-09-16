#!/usr/bin/env python3
"""Confere pontos de corte no ENVELOPE do áudio, não no JSON do transcritor.

Existe por causa de um erro real (NH_velocidade, 14/09/2026): o ASR marcava
"agilidade" começando em 1,30 s, o corte foi em 1,22 achando que sobrava folga,
e a palavra entrou mastigada — porque o modelo ancora na SÍLABA TÔNICA e a vogal
átona que abre a palavra tinha começado em 1,13.

Pra cada tempo candidato mostra o perfil de energia em volta e aponta o VALE mais
próximo, que é onde o corte deve morar. Fala emendada pode não ter vale nenhum:
aí o script diz isso, e a decisão é incluir a palavra anterior inteira ou trocar
de take — nunca cortar no meio da vogal.

Uso: bordas.py <audio> <tempo> [tempo ...] [--janela 0.5]
"""
import array, math, subprocess, sys

audio = sys.argv[1]
janela = 0.5
args = sys.argv[2:]
if "--janela" in args:
    i = args.index("--janela"); janela = float(args[i+1]); args = args[:i] + args[i+2:]
tempos = [float(a) for a in args]

PASSO = 0.01

def envelope(ini, dur, agudo=False):
    """Envelope em banda larga ou só acima de 3,5 kHz.

    O agudo existe porque FRICATIVA SOME NA BANDA LARGA. O /z/ de "frieza", o
    /s/ de "mais", o /ʃ/ de "chega" têm pouca energia grave e muita aguda: na
    banda larga eles parecem VALE e o detector manda cortar no meio da palavra.
    Silêncio de verdade é quieto nas duas bandas."""
    filtro = ["-af", "highpass=f=3500"] if agudo else []
    raw = subprocess.run(
        ["ffmpeg", "-nostdin", "-v", "error", "-ss", str(max(0, ini)), "-t", str(dur),
         "-i", audio] + filtro + ["-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
        capture_output=True).stdout
    x = array.array("h"); x.frombytes(raw)
    w = int(16000 * PASSO)
    return [math.sqrt(sum(v*v for v in x[i*w:(i+1)*w]) / w) for i in range(len(x)//w)]


def piso_do_arquivo(agudo=False):
    """Piso de ruído do ARQUIVO INTEIRO — nunca uma fração do pico da janela.

    Corrigido em 16/09/2026, depois de duas palavras comidas em peças entregues.
    O piso em `max(janela) * 0,18` mente nos dois sentidos: numa janela toda de
    fala ele fica ACIMA do ruído e acha "vale" dentro da palavra (foi o que
    apontou 49,62 no meio de "frieza"); numa janela com um pico alto ele fica
    acima de uma consoante fraca e marca vale onde a palavra continua.
    Janela de 1 s não tem silêncio suficiente pra estimar piso — o arquivo tem.
    """
    filtro = ["-af", "highpass=f=3500"] if agudo else []
    raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", audio] + filtro +
                         ["-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                         capture_output=True).stdout
    x = array.array("h"); x.frombytes(raw)
    w = int(16000 * PASSO)
    env = [math.sqrt(sum(v*v for v in x[i*w:(i+1)*w]) / w) for i in range(len(x)//w)]
    if not env: return 1.0
    ordenado = sorted(env)
    return ordenado[max(0, len(ordenado) // 10)]

PISO_ARQ = piso_do_arquivo()
LIMIAR = PISO_ARQ * 2.0
PISO_AG = piso_do_arquivo(agudo=True)
LIMIAR_AG = PISO_AG * 2.0
print(f"piso do arquivo: larga {PISO_ARQ:.0f} (limiar {LIMIAR:.0f}) | "
      f"agudo>3,5kHz {PISO_AG:.0f} (limiar {LIMIAR_AG:.0f})")

for t in tempos:
    ini = t - janela
    e = envelope(ini, janela * 2)
    ea = envelope(ini, janela * 2, agudo=True)
    if not e:
        print(f"\n{t:.3f} s — sem áudio aqui"); continue
    mx = max(e) or 1
    # vale = mínimo local mais próximo de t que esteja ABAIXO DO PISO DO ARQUIVO.
    # Não vale mínimo local dentro da fala: "frieza" tem vale entre o /z/ e o /a/
    # e cortar ali come a palavra.
    i_alvo = int(janela / PASSO)
    # Vale não é um mínimo local: é SILÊNCIO SUSTENTADO. Dentro de uma palavra
    # há dips de um quadro o tempo todo (entre o /z/ e o /a/ de "frieza", por
    # exemplo) e cortar num deles come a palavra. Exige-se uma corrida de pelo
    # menos MIN_VALE quadros abaixo do piso; o candidato é o meio da corrida.
    MIN_VALE = 4  # 40 ms
    def quieto(i):
        # quieto NAS DUAS BANDAS: fricativa é alta no agudo e some na larga
        return e[i] < LIMIAR and (i >= len(ea) or ea[i] < LIMIAR_AG)
    candidatos, i = [], 0
    while i < len(e):
        if quieto(i):
            j = i
            while j < len(e) and quieto(j): j += 1
            if j - i >= MIN_VALE: candidatos.append((i + j - 1) // 2)
            i = j
        else:
            i += 1
    print(f"\n=== candidato {t:.3f} s " + "=" * 40)
    for i, v in enumerate(e):
        tt = ini + i * PASSO
        marca = ""
        if abs(tt - t) < PASSO / 2: marca += "  <<< o corte pedido"
        if candidatos and i == min(candidatos, key=lambda c: abs(c - i_alvo)): marca += "  <<< VALE"
        print(f"  {tt:7.3f}  {'#' * int(36 * v / mx):36s}{marca}")
    if candidatos:
        melhor = ini + min(candidatos, key=lambda c: abs(c - i_alvo)) * PASSO
        print(f"  -> vale mais proximo: {melhor:.3f} s  (pedido {t:.3f}, diferenca {abs(melhor-t)*1000:.0f} ms)")
    else:
        print("  -> SEM VALE nesta janela: fala emendada. Nao cortar aqui no meio —")
        print("     incluir a palavra anterior inteira ou procurar outro ponto.")
