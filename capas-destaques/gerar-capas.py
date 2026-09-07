# -*- coding: utf-8 -*-
"""Capas de destaque do Instagram — Fabricia Satza | Tricologia e Queda Capilar.
1080x1920 (story). Tudo dentro do circulo seguro que o Instagram recorta
(diametro ~900px, centro em y=960).
Paleta: marfim #F4EFE8 · vinho ameixa #4A2634 · terracota #B06F53
        champagne #C9B39B · taupe #A99B91 · cafe #28201F"""
import base64, os, shutil, subprocess, tempfile

from PIL import Image

BASE = os.path.dirname(os.path.abspath(__file__))
UP   = os.path.join(BASE, "fotos")
FT   = os.path.join(BASE, "..", "projeto-remotion", "public", "newhair", "fontes")
OUT  = BASE

b64 = lambda p: base64.b64encode(open(p, "rb").read()).decode()
MONT_L = b64(os.path.join(FT, "Montserrat-Light.ttf"))
MONT_M = b64(os.path.join(FT, "Montserrat-Medium.ttf"))

# Fonte de display (ano e palavra). Para usar a fonte propria da marca, e so
# deixar o arquivo em capas-destaques/fontes/ e apontar DISPLAY_FONT para ele:
#   DISPLAY_FONT=capas-destaques/fontes/FabriciaSatza-Light.otf python3 ...
# Aceita varios arquivos separados por virgula (subsets latin/latin-ext).
FMT = {".woff2": "woff2", ".woff": "woff", ".otf": "opentype", ".ttf": "truetype"}
_df = os.environ.get("DISPLAY_FONT") or os.path.join(FT, "CormorantGaramond-Medium.woff2")
DISPLAY_FACES = "".join(
    "@font-face{font-family:'Display FS';src:url('data:font/%s;base64,%s') format('%s');font-weight:100 900}"
    % (FMT[os.path.splitext(f)[1].lower()].replace("opentype", "otf"), b64(f.strip()),
       FMT[os.path.splitext(f)[1].lower()])
    for f in _df.split(","))
SUF = os.environ.get("SUFIXO", "")

FOTOS = {   # fx, fy = centro do rosto em fracao da imagem; ar = altura/largura
    "f1": dict(f="f1-em-pe.jpg", fx=.470, fy=.190, ar=1448/1086),
    "f2": dict(f="f2-corpo-inteiro.jpg", fx=.485, fy=.205, ar=1448/1086),
    "f3": dict(f="f3-implanter.jpg", fx=.475, fy=.300, ar=1448/1086),
    "f4": dict(f="f4-pincas.jpg", fx=.470, fy=.295, ar=1448/1086),
    "f5": dict(f="f5-blazer.jpg", fx=.465, fy=.265, ar=1402/1122),
}
IMG = {k: "data:image/jpeg;base64," + b64(os.path.join(UP, v["f"])) for k, v in FOTOS.items()}

GRAIN = "data:image/svg+xml;base64," + base64.b64encode(
    b'<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">'
    b'<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>'
    b'<feColorMatrix type="saturate" values="0"/></filter>'
    b'<rect width="300" height="300" filter="url(#n)" opacity="0.5"/></svg>').decode()


def place(key, W, tx, ty, mirror=False):
    d = FOTOS[key]; H = W * d["ar"]
    fx = (1 - d["fx"]) if mirror else d["fx"]
    return dict(w=round(W), l=round(tx - fx * W), t=round(ty - d["fy"] * H),
                mir="transform:scaleX(-1);" if mirror else "")


CSS = """<style>
%s
@font-face{font-family:'Montserrat FS';src:url('data:font/ttf;base64,%s') format('truetype');font-weight:300}
@font-face{font-family:'Montserrat FS';src:url('data:font/ttf;base64,%s') format('truetype');font-weight:500}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;background:#F4EFE8;overflow:hidden}
.cap{position:relative;width:1080px;height:1920px;overflow:hidden;
  background:radial-gradient(126%% 80%% at 50%% 46%%,#FCFAF7 0%%,#F4EFE8 44%%,#EBE3D8 78%%,#E2D8CB 100%%)}
/* foto em marca d'agua nas capas de ano */
.ghost{position:absolute;inset:0;overflow:hidden;opacity:.22}
.ghost img{position:absolute;display:block;
  filter:grayscale(.60) sepia(.45) saturate(1.1) contrast(.82) brightness(1.18) blur(3px)}
.ghost.soft{opacity:.16}
.ghost.soft img{filter:grayscale(.7) sepia(.5) contrast(.8) brightness(1.2) blur(10px)}
.veil{position:absolute;inset:0;background:radial-gradient(60%% 38%% at 50%% 47%%,
  rgba(244,239,232,.30) 0%%,rgba(244,239,232,.78) 50%%,rgba(238,231,221,.98) 80%%,#EDE5DA 100%%)}
.veil2{position:absolute;inset:0;background:linear-gradient(180deg,
  rgba(240,233,224,.55) 0%%,rgba(244,239,232,0) 26%%,rgba(244,239,232,0) 62%%,rgba(238,230,220,.72) 88%%,#EAE1D5 100%%)}
.grain{position:absolute;inset:0;background:url('%s') repeat;background-size:300px 300px;
  mix-blend-mode:multiply;opacity:.09;pointer-events:none}
.stack{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.sec{font-family:'Display FS',Georgia,serif;font-weight:500;color:#B06F53}
.rule{height:1px;background:#B06F53;opacity:.55}
.lbl{font-family:'Montserrat FS',sans-serif;font-weight:300;letter-spacing:.40em;text-indent:.40em;
  color:#A99B91;text-transform:uppercase;font-size:25px}
.yr{font-family:'Display FS',Georgia,serif;font-weight:500;color:#4A2634;
  font-size:376px;line-height:.78;letter-spacing:-.005em}
.word{font-family:'Display FS',Georgia,serif;font-weight:500;color:#4A2634;
  text-transform:uppercase;line-height:.98}
.med{position:absolute;left:50%%;transform:translateX(-50%%);border-radius:50%%;overflow:hidden;
  box-shadow:0 0 0 1px rgba(176,111,83,.60),0 0 0 18px rgba(201,179,155,.22),
             0 26px 70px rgba(74,38,52,.16)}
.med img{position:absolute;display:block;filter:saturate(.92) contrast(1.02) brightness(1.02) sepia(.06)}
</style>""" % (DISPLAY_FACES, MONT_L, MONT_M, GRAIN)


def ghost(key, mirror=False, soft=False):
    p = place(key, 1620, 540, 640, mirror)
    return ('<div class="ghost%s"><img src="%s" style="left:%dpx;top:%dpx;width:%dpx;%s"></div>'
            % (" soft" if soft else "", IMG[key], p["l"], p["t"], p["w"], p["mir"]))


def cover_ano(ano, foto, mirror=False):
    """'20' em serifa leve e espacada em cima; os dois digitos do ano em display embaixo"""
    return """<div class="cap">%s<div class="veil"></div><div class="veil2"></div>
  <div class="stack">
    <div class="sec" style="font-size:110px;letter-spacing:.30em;text-indent:.30em;margin-bottom:-16px;opacity:.9">%s</div>
    <div class="yr">%s</div>
    <div class="rule" style="width:96px;margin-top:58px"></div>
    <div class="lbl" style="margin-top:36px">Transplante capilar</div>
  </div><div class="grain"></div></div>""" % (ghost(foto, mirror), ano[:2], ano[2:])


D, TOP = 560, 558
def cover_palavra(palavra, foto, size=100, track=.06):
    p = place(foto, 1104, D / 2, D * .455)
    return """<div class="cap">%s<div class="veil"></div><div class="veil2"></div>
  <div class="med" style="top:%dpx;width:%dpx;height:%dpx"><img src="%s" style="left:%dpx;top:%dpx;width:%dpx"></div>
  <div style="position:absolute;left:0;right:0;top:%dpx;display:flex;flex-direction:column;align-items:center">
    <div class="rule" style="width:60px"></div>
    <div class="word" style="font-size:%dpx;letter-spacing:%.2fem;text-indent:%.2fem;margin-top:44px">%s</div>
  </div><div class="grain"></div></div>""" % (
        ghost(foto, soft=True), TOP, D, D, IMG[foto], p["l"], p["t"], p["w"], TOP + D + 32, size, track, track, palavra)


CAPAS = [
    ("1-bastidores", cover_palavra("Bastidores", "f1", 100, .06)),
    ("2-ano-2026",   cover_ano("2026", "f3")),
    ("3-ano-2025",   cover_ano("2025", "f4")),
    ("4-lifestyle",  cover_palavra("Lifestyle",  "f5", 100, .16)),
    ("5-ano-2024",   cover_ano("2024", "f4", mirror=True)),
    ("6-viagens",    cover_palavra("Viagens",    "f2", 100, .24)),
    ("7-ano-2022",   cover_ano("2022", "f3", mirror=True)),
]

# renderiza cada capa em 1080x1920 com o Chromium headless
CHROME = os.environ.get("CHROME", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
tmp = tempfile.mkdtemp(prefix="capas-")
for nome, corpo in CAPAS:
    html = os.path.join(tmp, nome + ".html")
    open(html, "w", encoding="utf-8").write(
        "<!doctype html><html><head><meta charset='utf-8'>" + CSS + "</head><body>" + corpo + "</body></html>")
    shot = os.path.join(tmp, nome + SUF + ".png")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
                    "--force-device-scale-factor=1", "--window-size=1080,2200",
                    "--screenshot=" + shot, "file://" + html],
                   check=True, capture_output=True)
    # o viewport sai maior que o story; corta nos 1080x1920 exatos
    Image.open(shot).convert("RGB").crop((0, 0, 1080, 1920)).save(
        os.path.join(OUT, nome + SUF + ".png"), optimize=True)
    print("gerada:", nome + SUF + ".png")
shutil.rmtree(tmp, ignore_errors=True)
