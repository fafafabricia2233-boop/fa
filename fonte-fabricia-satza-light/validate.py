# -*- coding: utf-8 -*-
from fontTools.ttLib import TTFont
import unicodedata, sys

SRC = TTFont('jost-350.ttf')          # instanciada, antes do rename
FILES = ['out/FabriciaSatzaLight-Regular.ttf', 'out/FabriciaSatzaLightAlt-Regular.ttf']

NEEDED = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ"
          "abcdefghijklmnopqrstuvwxyz"
          "0123456789"
          "ÁÀÂÃÄÉÊËÍÓÔÕÚÜÇÑ áàâãäéêëíóôõúüçñ"
          "!?.,;:'\"“”‘’()[]{}/&@#$%+-=_*ºªº«»…–—€£¥¢§¶†‡•<>|\\~^`")

fail = 0
for path in FILES:
    f = TTFont(path)
    print("=" * 70)
    print(path)
    n = f['name']
    for nid in (0, 1, 2, 3, 4, 5, 6, 9, 11, 13, 14, 16, 17):
        v = n.getDebugName(nid)
        if v: print(f"  name[{nid}] = {v}")

    cm = f.getBestCmap()
    missing = sorted({c for c in NEEDED if c != ' ' and ord(c) not in cm})
    print("  cmap: %d codepoints | faltando: %s" % (len(cm), missing or "nenhum"))
    if missing: fail += 1

    print("  tabelas:", " ".join(sorted(t for t in f.keys() if t != 'GlyphOrder')))
    print("  glifos:", f['maxp'].numGlyphs, "| upem:", f['head'].unitsPerEm)
    o2, hh = f['OS/2'], f['hhea']
    print("  cap %d  x-height %d  typoAsc %d  typoDesc %d  typoGap %d"
          % (o2.sCapHeight, o2.sxHeight, o2.sTypoAscender, o2.sTypoDescender, o2.sTypoLineGap))
    print("  winAsc %d  winDesc %d  hheaAsc %d  hheaDesc %d  lineGap %d"
          % (o2.usWinAscent, o2.usWinDescent, hh.ascent, hh.descent, hh.lineGap))
    print("  usWeightClass", o2.usWeightClass, "| vendor", o2.achVendID)

    # métricas idênticas à fonte-base (nenhum glifo mexido)
    diffs = [g for g in SRC.getGlyphOrder()
             if g in f['hmtx'].metrics and SRC['hmtx'][g] != f['hmtx'][g]]
    print("  hmtx diferentes da base:", len(diffs), diffs[:10])
    if diffs: fail += 1

    # contornos byte-idênticos
    sg, dg = SRC['glyf'], f['glyf']
    changed = [g for g in SRC.getGlyphOrder()
               if g in dg.keys() and sg[g].compile(sg) != dg[g].compile(dg)]
    print("  contornos alterados:", len(changed), changed[:10])
    if changed: fail += 1

    # kerning
    kp = 0
    for lk in f['GPOS'].table.LookupList.Lookup:
        if lk.LookupType == 2:
            for st in lk.SubTable:
                if st.Format == 1:
                    kp += sum(len(s.PairValueRecord) for s in st.PairSet)
                elif st.Format == 2:
                    kp += st.Class1Count * st.Class2Count
    print("  pares de kerning (GPOS):", kp)
    if kp == 0: fail += 1

    # acentos compostos
    for ch in "ÁÊÕÇíãô":
        g = cm[ord(ch)]
        gl = f['glyf'][g]
        kind = "composto(%s)" % ",".join(c.glyphName for c in gl.components) if gl.isComposite() else "simples"
        print("  %s -> %-14s %s  width=%d" % (ch, g, kind, f['hmtx'][g][0]))

print("=" * 70)
print("FALHAS:", fail)
sys.exit(1 if fail else 0)
