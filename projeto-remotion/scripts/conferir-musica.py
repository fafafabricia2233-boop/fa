#!/usr/bin/env python3
"""Confere a faixa de música contra a curadoria do kit e devolve o ataque.

O manual trata ataque como número MEDIDO para um arquivo, não como propriedade
da música: mesmo critério do SHA-256 usado nos ganhos de SFX. Faixa que não
está na curadoria não entra — sem ataque conferido não dá pra fazer o beat cair
na virada do gancho, e inventar o ponto é pior que ficar sem música.

Uso:  python3 scripts/conferir-musica.py <faixa.mp3> [--virada 4.033]
Com --virada, imprime também onde o recorte deve começar (ataque − virada).
"""
import hashlib, json, sys, pathlib

faixa = pathlib.Path(sys.argv[1])
virada = None
if "--virada" in sys.argv:
    virada = float(sys.argv[sys.argv.index("--virada") + 1])

aqui = pathlib.Path(__file__).resolve().parent.parent
cur = json.load(open(aqui.parent / "kit-new-hair" / "musicas-ataques-por-hash.json"))
h = hashlib.sha256(faixa.read_bytes()).hexdigest()
achou = next((e for e in cur if e["sha256"] == h), None)

if achou is None:
    sys.exit(
        f"ERRO: {faixa.name} nao esta na curadoria (sha256 {h[:16]}...).\n"
        "Ataque nao conferido — nao entra. Medir e registrar no JSON primeiro."
    )

print(f"faixa:  {achou['file']}")
print(f"ataque: {achou['attack']} s")
if virada is not None:
    print(f"recorte comeca em: {round(achou['attack'] - virada, 3)} s")
