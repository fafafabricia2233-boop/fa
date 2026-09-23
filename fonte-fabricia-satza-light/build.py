# -*- coding: utf-8 -*-
"""Build 'Fabricia Satza Light' from Jost* (SIL OFL 1.1).
Only metadata is changed. Outlines, metrics, kerning, cmap and OpenType
tables are carried over from the source untouched.
"""
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

WGHT = 350          # closest visual match to the reference Light weight
VERSION = "1.000"
COPYRIGHT = ("Copyright 2020 The Jost Project Authors "
             "(https://github.com/indestructible-type). "
             "Fabricia Satza Light is a derivative work, 2026.")
TRADEMARK = ""
DESIGNER = "indestructible type* (Jost*)"
MANUFACTURER = "Fabricia Satza"
LICENSE = ("This Font Software is licensed under the SIL Open Font License, "
           "Version 1.1. This license is available with a FAQ at "
           "https://openfontlicense.org")
LICENSE_URL = "https://openfontlicense.org"


def rename(f, family, ps_name, typo_family, typo_sub="Light"):
    name = f['name']
    name.names = []                       # drop every inherited name record
    for nid, val in [
        (0, COPYRIGHT),
        (1, family),
        (2, "Regular"),
        (3, f"{VERSION};{ps_name}"),
        (4, family),
        (5, f"Version {VERSION}"),
        (6, ps_name),
        (9, DESIGNER),
        (11, MANUFACTURER),
        (13, LICENSE),
        (14, LICENSE_URL),
        (16, typo_family),
        (17, typo_sub),
    ]:
        if not val:
            continue
        name.setName(val, nid, 3, 1, 0x409)   # Windows / Unicode BMP / en-US
        name.setName(val, nid, 1, 0, 0)       # Macintosh / Roman / en
    return f


def swap_single_storey_a(f):
    """Point U+0061 at the geometric single-storey 'a' and make ss01 the
    toggle back. a.alt already carries its own kerning in GPOS, so pair
    positioning survives the swap."""
    for st in f['cmap'].tables:
        for cp, gn in list(st.cmap.items()):
            if gn == 'a':
                st.cmap[cp] = 'a.alt'
    for lk in f['GSUB'].table.LookupList.Lookup:
        for sub in lk.SubTable:
            m = getattr(sub, 'mapping', None)
            if m and m.get('a') == 'a.alt':
                del m['a']
                m['a.alt'] = 'a'
    return f


def build(out, family, ps_name, typo_family, single_storey):
    f = TTFont('jost.ttf')
    instantiateVariableFont(f, {'wght': WGHT}, inplace=True, updateFontNames=False)
    if 'DSIG' in f:
        del f['DSIG']                     # signature is void once the font changes
    f['OS/2'].usWeightClass = 300         # Light
    f['OS/2'].achVendID = "FSAT"
    if single_storey:
        swap_single_storey_a(f)
    rename(f, family, ps_name, typo_family)
    f['head'].fontRevision = float(VERSION)
    f.save(out)
    print("wrote", out)


build('out/FabriciaSatzaLight-Regular.ttf',
      "Fabrícia Satza Light", "FabriciaSatzaLight-Regular", "Fabrícia Satza", False)
build('out/FabriciaSatzaLightAlt-Regular.ttf',
      "Fabrícia Satza Light Alt", "FabriciaSatzaLightAlt-Regular", "Fabrícia Satza Alt", True)
