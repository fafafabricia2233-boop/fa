# -*- coding: utf-8 -*-
"""Gera o mesmo carrossel em varias combinacoes da paleta.

Cada esquema e so um bloco :root que repontua os tokens — todo o CSS da marca
le token, entao trocar quatro linhas troca a peca inteira. Antes de escrever,
cada par texto/fundo passa por conferencia de contraste; um esquema ilegivel
nao chega a ser gerado.
"""
import pathlib

P = {"branco": "#FCFAF7", "marfim": "#F4EFE8", "cafe": "#28201F", "vinho": "#4A2634",
     "taupe": "#A99B91", "champagne": "#C9B39B", "terracota": "#B06F53",
     "terra_esc": "#8A5A44"}


def _lin(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def _lum(h):
    h = h.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return .2126 * _lin(r) + .7152 * _lin(g) + .0722 * _lin(b)


def contraste(a, b):
    la, lb = _lum(a), _lum(b)
    return (max(la, lb) + .05) / (min(la, lb) + .05)


def rgba(hexa, alfa):
    h = hexa.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return f"rgba({r},{g},{b},{alfa})"


# fundo   = slide padrao        fundo2 = slide alternado
# escuro  = slide de virada     texto  = cor do texto sobre fundo/fundo2
# acento  = numeros, rotulos, palavra destacada sobre fundo/fundo2
# fio     = filete de 1px sobre fundo/fundo2
ESQUEMAS = {
 "1-clara-cafe": dict(
    nome="Clara · Café", fundo="branco", fundo2="marfim", escuro="cafe",
    texto="cafe", acento="terra_esc", fio="taupe",
    obs="O padrão. Café profundo fecha o carrossel com sobriedade."),
 "2-clara-vinho": dict(
    nome="Clara · Vinho", fundo="branco", fundo2="marfim", escuro="vinho",
    texto="cafe", acento="terra_esc", fio="taupe",
    obs="Mesma base, virada em vinho ameixa. Mais assinatura, mais memória."),
 "3-champagne": dict(
    nome="Champagne", fundo="marfim", fundo2="champagne", escuro="cafe",
    texto="cafe", acento="vinho", fio="vinho",
    obs="Slides alternados em champagne. Mais quente, mais 'beleza'."),
 "4-taupe": dict(
    nome="Taupe", fundo="marfim", fundo2="taupe", escuro="cafe",
    texto="cafe", acento="vinho", fio="vinho",
    obs="Alternados em taupe. Mais sóbrio e mais neutro que o champagne."),
 "5-cafe-integral": dict(
    nome="Café integral", fundo="cafe", fundo2="cafe", escuro="vinho",
    texto="branco", acento="champagne", fio="champagne",
    obs="Tudo em café, virada em vinho. Editorial e noturno."),
 "6-vinho-integral": dict(
    nome="Vinho integral", fundo="vinho", fundo2="vinho", escuro="cafe",
    texto="branco", acento="champagne", fio="champagne",
    obs="Tudo em vinho, virada em café. O mais marcante da paleta."),
 "7-terra": dict(
    nome="Terra", fundo="branco", fundo2="marfim", escuro="terra_esc",
    texto="cafe", acento="terra_esc", fio="taupe",
    obs="Virada em marrom terracota. Mais calor, menos peso que os escuros."),
}

MIN_TEXTO, MIN_GRANDE = 4.5, 3.0


def conferir(e):
    """Devolve os problemas de contraste do esquema, se houver."""
    falhas = []
    for sup in (e["fundo"], e["fundo2"]):
        r = contraste(P[e["texto"]], P[sup])
        if r < MIN_TEXTO:
            falhas.append(f"texto {e['texto']} sobre {sup}: {r:.1f}")
    r = contraste(texto_da_virada(e), P[e["escuro"]])
    if r < MIN_TEXTO:
        falhas.append(f"texto da virada sobre {e['escuro']}: {r:.1f}")
    if e["escuro"] == e["fundo"]:
        falhas.append("o slide de virada tem o mesmo fundo dos demais")
    for sup in (e["fundo"], e["fundo2"]):
        r = contraste(P[e["acento"]], P[sup])
        if r < MIN_TEXTO:
            falhas.append(f"acento {e['acento']} sobre {sup}: {r:.1f}")
        r = contraste(P[e["fio"]], P[sup])
        if r < 1.6:                      # fio de 1px so precisa ser perceptivel
            falhas.append(f"fio {e['fio']} sobre {sup}: {r:.1f}")
    return falhas


def texto_da_virada(e):
    """Cor legivel sobre o slide de virada.

    Tem de sair da luminancia da propria superficie: derivar de "o texto normal
    e escuro?" funciona nos esquemas claros e quebra nos integrais, onde o slide
    de virada e escuro igual aos outros — foi assim que sairam dois esquemas com
    texto sobre fundo da mesma cor."""
    return P["branco"] if _lum(P[e["escuro"]]) < .35 else P["cafe"]


def css(e):
    claro = e["texto"] == "cafe"
    txt, txt_esc = P[e["texto"]], texto_da_virada(e)
    return f"""
<style>
/* {e['nome']} — {e['obs']} */
:root{{
  --branco:{P[e['fundo']]};
  --marfim:{P[e['fundo2']]};
  --cafe:{P[e['escuro']]};
  --forte:{txt};
  --suave:{rgba(txt, .66)};
  --claro:{txt_esc};
  --claro-suave:{rgba(txt_esc, .66)};
  --taupe:{P[e['fio']]};
  --terracota-esc:{P[e['acento']]};
  --terracota:{P['terracota'] if claro else P['champagne']};
  --champagne:{P['champagne'] if claro else P['champagne']};
}}
</style>"""


def main():
    aqui = pathlib.Path(__file__).parent
    cabeca = (aqui / "_cabeca.html").read_text(encoding="utf-8")
    corpo = (aqui / "_corpo.html").read_text(encoding="utf-8")
    for chave, e in ESQUEMAS.items():
        falhas = conferir(e)
        if falhas:
            print(f"  X {e['nome']:<18} descartado -> " + "; ".join(falhas))
            continue
        html = cabeca + css(e) + "\n" + corpo + "\n</body>\n</html>\n"
        html = html.replace("{{TEMA}}", f"eflúvio telógeno {e['nome']}")
        (aqui / f"{chave}.html").write_text(html, encoding="utf-8")
        print(f"  ok {e['nome']:<18} {chave}.html")


if __name__ == "__main__":
    main()
