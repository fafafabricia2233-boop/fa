# -*- coding: utf-8 -*-
"""
CONFERE O KIT CONTRA O MANIFEST-SHA256.json

Uso:  python3 kit-new-hair/conferir-kit.py

Diz o que chegou com hash batendo, o que chegou corrompido e o que falta.
O manual manda conferir integridade antes de usar o kit como referencia.
"""
import hashlib, json, os, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
man = json.load(open(os.path.join(AQUI, "MANIFEST-SHA256.json"), encoding="utf-8"))

ok, ruim, falta = [], [], []
for rel, h in sorted(man.items()):
    p = os.path.join(AQUI, rel)
    if not os.path.isfile(p):
        falta.append(rel); continue
    real = hashlib.sha256(open(p, "rb").read()).hexdigest()
    (ok if real == h else ruim).append(rel)

print("integros : %d/%d" % (len(ok), len(man)))
for r in ok:
    print("    ok   %s" % r)
if ruim:
    print("\nCORROMPIDOS (hash nao bate) — nao usar como referencia:")
    for r in ruim:
        print("    XX   %s" % r)
print("\nfaltando : %d" % len(falta))
for r in falta:
    print("    --   %s" % r)
sys.exit(1 if ruim else 0)
