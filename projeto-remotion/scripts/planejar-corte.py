# -*- coding: utf-8 -*-
"""Planeja o corte FINO de uma fita crua de camera.

Entra: os trechos aprovados a mao (sem blooper, sem releitura inteira) + o
audio + o mapa de olhar. Sai: a lista de trechos que vai pro montar-fita.sh.

═══ AS TRES REGRAS QUE ESTA VERSAO PASSOU A CUMPRIR ═══
Escritas depois de a dona apontar, uma a uma, as sobras da versao anterior
(16/09/2026). Sao o resumo do que deu errado — nao apagar:

  1. OLHAR TAMBEM VALE NA PONTA DO TRECHO, NAO SO NO BURACO.
     A versao anterior so consultava o olhar no silencio ENTRE dois trechos.
     Mas o desvio quase sempre mora na PONTA: ela termina a frase e ja olha
     pro texto, ou olha pro texto e so depois comeca a falar. Entao agora
     toda cabeca e todo rabo de trecho recuam ate o ultimo quadro em que ela
     ainda esta na camera — sem nunca comer fala de verdade.

  2. O RABO DA ULTIMA FALA DA PECA PRECISA DE FOLGA.
     Cortar o fim no mesmo aperto dos cortes internos deixa a ultima palavra
     sem cauda: soa cortada. A ultima fala de cada peca leva RABO_FIM de
     sobra, a menos que ela desvie o olhar antes — ai manda o olhar.

  3. LIMIAR MAIS APERTADO, E BASE MEDIDA POR TRECHO.
     Os casos que ela apontou ficam entre 0.15 e 0.24 de desvio. Com o limiar
     velho (0.15/0.11) eles so eram pegos ja no meio do movimento. Com
     0.10/0.07 o corte cai ANTES de a cabeca comecar a virar, que e o unico
     lugar onde o corte fica invisivel.
     Mas limiar apertado so funciona com base honesta. A cabeca dela NAO fica
     parada: ao longo de uma frase de 5s ela gira devagar uns 0.13 sem nunca
     sair da camera. Com uma base fixa (da fita ou ate do trecho), essa deriva
     lenta aparece como "olhando pro lado" — falso, e cortar ali comeria fala.
     Entao a base e LOCAL E MOVEL: a mediana dos quadros numa janela de +-JANELA_BASE
     em volta do instante, contando SO os quadros em que ela esta FALANDO. Esse
     "so falando" e o que faz a coisa funcionar: quando ela para pra ler o texto
     ela fica virada 2s seguidos, e uma mediana crua de janela de 4s tomaria a
     virada como base. Falando ela esta na camera — entao a base e sempre "a
     cabeca dela entregando pra camera", por mais que essa cabeca derive devagar.
     Ou seja, o que se mede e "ela SAIU de onde estava agora", que e exatamente
     o que se ve na tela.

E a regra que ja valia e continua valendo: releitura, gaguejada e repeticao
de palavra NAO entram. Elas saem na escolha dos trechos aprovados, e essa
escolha se confere retranscrevendo a PECA montada e lendo o texto corrido.
"""
import array, json, math, subprocess, sys

JAN       = 0.02
RUIDO     = -48.0   # abaixo disto e silencio (fita crua; a montagem sobe ~15 dB)
FALA_REAL = -38.0   # acima disto e voz mesmo. Entre isto e RUIDO e respiro,
                    # estalo de boca, roupa: pode cortar. Era -45 e por isso o
                    # respiro antes de "e saber comunicar" segurava o corte no
                    # lugar errado, com ela ainda olhando pro texto.
PONTE     = 0.14    # parada dentro da palavra (p, t, k) chega a 0.15s
SIL_MIN   = 0.28    # menos que isto e espaco entre palavras, nao pausa
SIL_FICA  = 0.05
SIL_TRAVA = 0.03
RABO_FIM  = 0.45    # regra 2
RABO_MIN  = 0.15    # ... mas se ela desviar antes, pelo menos isto
DESVIO    = 0.10    # regra 3
DESVIO_O  = 0.07
MIN_TRECHO= 0.35
JANELA_BASE = 2.0   # meia-janela da base movel (ver regra 3)


def energia(wav):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", wav, "-ac", "1", "-ar", "16000",
                          "-f", "s16le", "-"], capture_output=True).stdout
    s = array.array("h"); s.frombytes(raw)
    n = int(16000 * JAN)
    return [20 * math.log10((math.sqrt(sum(x * x for x in s[i:i+n]) / n) or 1) / 32768.0)
            for i in range(0, len(s) - n + 1, n)]


def nivel(db, t):
    i = int(t / JAN)
    return db[i] if 0 <= i < len(db) else -99.0


def fala(db, a, b):
    i0, i1 = int(a / JAN), min(len(db), int(b / JAN))
    runs, ini = [], None
    for i in range(i0, i1):
        if db[i] > RUIDO and ini is None:
            ini = i
        elif db[i] <= RUIDO and ini is not None:
            runs.append([ini * JAN, i * JAN]); ini = None
    if ini is not None:
        runs.append([ini * JAN, i1 * JAN])
    junto = []
    for r in runs:
        if junto and r[0] - junto[-1][1] < PONTE:
            junto[-1][1] = r[1]
        else:
            junto.append(r)
    return [r for r in junto if r[1] - r[0] >= 0.06]


class Olhar(object):
    """o mapa de olhar, lido contra uma base LOCAL E MOVEL (ver regra 3)"""

    def __init__(self, pontos, db):
        self.p = [x for x in pontos]
        self.falando = [x for x in pontos
                        if x["rosto"] and nivel(db, x["t"]) > FALA_REAL]

    def base(self, t):
        perto = [x for x in self.falando if abs(x["t"] - t) <= JANELA_BASE]
        if len(perto) < 6:
            perto = [x for x in self.falando if abs(x["t"] - t) <= 3 * JANELA_BASE]
        if len(perto) < 6:
            perto = self.falando
        if not perto:
            return 0.0, 0.0
        g = sorted(x["giro"] for x in perto)
        o = sorted(x["olho"] for x in perto)
        return g[len(g) // 2], o[len(o) // 2]

    def fora(self, x):
        bg, bo = self.base(x["t"])
        return ((not x["rosto"]) or abs(x["giro"] - bg) > DESVIO
                or abs(x["olho"] - bo) > DESVIO_O)

    def desviado(self, t, folga=0.06):
        perto = [x for x in self.p if abs(x["t"] - t) <= folga]
        return any(self.fora(x) for x in perto) if perto else False

    def frac(self, a, b):
        pts = [x for x in self.p if a <= x["t"] <= b]
        if not pts:
            return 0.0
        return sum(1 for x in pts if self.fora(x)) / float(len(pts))


def aperta_pontas(db, olhar, ini, fim, teto, ultimo_da_peca):
    """REGRA 1 (e 2 no ultimo trecho): puxa cabeca e rabo pra dentro ate ela
    estar na camera.

    Dois ancoras diferentes, de proposito:
      FALA_REAL marca onde tem VOZ — nunca se corta pra dentro disso;
      RUIDO marca onde o som acaba de verdade (a cauda da palavra).
    O rabo mira na cauda e recua ate ela estar na camera; se o olhar mandar
    entrar um pouco na cauda, tudo bem — o que ele nao pode e comer voz.
    """
    janela = range(int(ini / JAN), int(fim / JAN))
    voz = [t * JAN for t in janela if nivel(db, t * JAN) > FALA_REAL]
    som = [t * JAN for t in janela if nivel(db, t * JAN) > RUIDO]
    if not voz or not som:
        return round(ini, 2), round(fim, 2)

    # cabeca: avanca enquanto estiver desviada e ainda nao for voz
    t = ini
    while t < voz[0] - 0.08 and olhar.desviado(t):
        t += JAN
    # mais um quadro de folga: o mapa de olhar vem a 10 fps e o corte e a 30,
    # entao o instante em que ela volta pra camera cai entre duas amostras.
    ini = min(t + 0.04, max(ini, voz[0] - 0.08))

    # rabo: mira na cauda do som e recua ate ela estar na camera, sem comer voz
    alvo = som[-1] + (RABO_FIM if ultimo_da_peca else SIL_FICA)
    piso = voz[-1] + 0.06
    t = min(teto, alvo)
    while t > piso and olhar.desviado(t, folga=0.06):
        t -= JAN
    return round(ini, 2), round(min(teto, max(t, piso)), 2)


def planejar(tag, aprovados):
    wav = "audio/%s.wav" % tag
    db = energia(wav)
    pontos = json.load(open("olhar/IMG_%s_olhar.json" % tag))

    olhar = Olhar(pontos, db)

    final = []
    for n_ap, (a, b) in enumerate(aprovados):
        runs = fala(db, a, b)
        if not runs:
            continue
        cur = [max(a, runs[0][0] - SIL_FICA), min(b, runs[0][1] + SIL_FICA)]
        for r in runs[1:]:
            buraco = r[0] - (cur[1] - SIL_FICA)
            if buraco <= SIL_MIN:
                cur[1] = min(b, r[1] + SIL_FICA)
                continue
            sobra = SIL_TRAVA if olhar.frac(cur[1] - SIL_FICA, r[0]) > 0.5 else SIL_FICA
            final.append((cur[0], min(b, cur[1] - SIL_FICA + sobra), b, False, olhar))
            cur = [max(a, r[0] - sobra), min(b, r[1] + SIL_FICA)]
        final.append((cur[0], cur[1], b, n_ap == len(aprovados) - 1, olhar))

    apertado = []
    for ini, fim, teto, ultimo, olhar_do_trecho in final:
        i, f = aperta_pontas(db, olhar_do_trecho, ini, fim, teto, ultimo)
        if f - i > 0.1:
            apertado.append([i, f])

    junto = []
    for r in apertado:
        if junto and r[0] - junto[-1][1] < 0.03:
            junto[-1][1] = r[1]
        else:
            junto.append(r)
    colado = []
    for r in junto:
        if colado and (r[1] - r[0] < MIN_TRECHO or colado[-1][1] - colado[-1][0] < MIN_TRECHO) \
           and r[0] - colado[-1][1] < 0.45:
            colado[-1][1] = r[1]
        else:
            colado.append(r)

    total = sum(b - a for a, b in colado)
    print("%s  %.2fs -> %.2fs · %d trechos"
          % (tag, sum(b - a for a, b in aprovados), total, len(colado)))
    print("   " + " ".join("%.2f,%.2f" % (a, b) for a, b in colado))
    return colado


# Trechos aprovados a mao. As mudancas de 16/09/2026 estao marcadas:
APROVADOS = {
    "9789": [(0.54,6.36),(14.74,18.70),(26.14,28.38),(30.30,33.70),(48.28,53.38),
             (55.98,60.14),(63.12,68.84),(77.18,84.00)],
    "9788": [(26.14,33.08),(38.24,41.58),(43.06,46.64),(55.50,60.02),
             (64.92,69.00),   # era 69.90: o que vem depois de "pessoas" e so ela olhando pro texto
             (80.58,86.15),  # era 86.38: ela aponta desvio no fim de "da sua clinica"
             (93.10,95.61)],
    "9787": [(0.10,5.74),(10.54,17.86),(40.66,47.72),(81.04,87.52),(95.10,99.22),
             (111.54,118.60)],  # era 118.20: faltava cauda no "bio"
    "9786": [(0.20,5.64),(31.30,36.45),(40.16,44.44),(53.54,56.98),(58.92,65.58),
             (84.38,91.84),
             (97.05,101.94),   # era 96.80: pegava "do nosso," da 1a leitura antes do "porque"
             (117.78,125.00)], # era 124.40: faltava cauda no "bio"
}

if __name__ == "__main__":
    saida = {tag: planejar(tag, APROVADOS[tag]) for tag in sys.argv[1:]}
    json.dump(saida, open("plano.json", "w"), indent=1)
