# -*- coding: utf-8 -*-
"""CONFERENCIA FINAL do corte, antes de montar.

Passa o mapa de olhar por CIMA de tudo que vai entrar na peca. E o passo que
faltava: a versao anterior so consultava o olhar no buraco ENTRE trechos,
entao desvio na ponta passava batido e chegava na peca.

So acusa desvio onde NAO tem voz. Desvio no meio da frase existe e e normal
(ela gesticula, pisca, olha de lado meio segundo enquanto fala) — cortar ali
comeria palavra. O que da pra tirar sem perder fala e desvio em ponta e em
buraco, e e isso que aqui se cobra.

Acusa tambem rabo curto demais na ultima fala (palavra saindo estalada).
"""
import json, sys
from planejar import APROVADOS, FALA_REAL, JAN, RUIDO, Olhar, energia, nivel

MIN_RABO = 0.20

for tag in sys.argv[1:]:
    plano = json.load(open("plano.json"))[tag]
    db = energia("audio/%s.wav" % tag)
    pontos = json.load(open("olhar/IMG_%s_olhar.json" % tag))
    olhar = Olhar(pontos, db)

    print("═══ %s ═══" % tag)
    problemas = 0
    for n, (a, b) in enumerate(plano):
        ruins = [x["t"] for x in pontos if a <= x["t"] <= b
                 and nivel(db, x["t"]) <= FALA_REAL and olhar.fora(x)]
        if ruins:
            problemas += 1
            print("  trecho %d (%.2f-%.2f): olhando pro lado SEM FALAR em %s"
                  % (n+1, a, b, ", ".join("%.2f" % t for t in ruins)))
    ua, ub = plano[-1]
    som = [t*JAN for t in range(int(ua/JAN), int(ub/JAN)) if nivel(db, t*JAN) > RUIDO]
    rabo = ub - (som[-1] if som else ua)
    if rabo < MIN_RABO:
        problemas += 1
        print("  RABO CURTO no fim da peca: %.2fs depois do ultimo som (minimo %.2f)"
              % (rabo, MIN_RABO))
    print("  %s\n" % ("nada a acusar" if not problemas else "%d ponto(s) pra rever" % problemas))
