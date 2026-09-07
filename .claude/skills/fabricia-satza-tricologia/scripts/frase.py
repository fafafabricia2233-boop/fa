#!/usr/bin/env python3
"""Gera um POST DE FRASE — o formato de fala dela, com foto de perfil.

Uso:
    python3 frase.py "a frase" [pasta-de-saida]
    python3 frase.py --arquivo frases.txt [pasta-de-saida]   (uma frase por linha)

Entrega o .html e as imagens já exportadas, em 3:4 e sem metadados.

O padrao esta fechado e nao se discute a cada peca:
  nome     Fabrícia Satza | Tricologia Capilar, com o selo de verificado
  texto    peso unico, sem negrito — fala nao tem enfase
  rodape   so o arroba, sem seta: post avulso nao tem para onde arrastar
  limite   ate 4 linhas; acima disso deixa de parecer fala e vira paragrafo
"""
import base64
import pathlib
import re
import subprocess
import sys
import unicodedata

AQUI = pathlib.Path(__file__).resolve().parent
SKILL = AQUI.parent


def apelido(texto: str) -> str:
    t = unicodedata.normalize("NFKD", texto.lower())
    t = "".join(c for c in t if not unicodedata.combining(c))
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return "-".join(t.split("-")[:6]) or "frase"


def montar(frase: str, destino: pathlib.Path) -> pathlib.Path:
    modelo = (SKILL / "assets" / "carrossel.html").read_text(encoding="utf-8")
    cabeca, _, resto = modelo.partition('<div class="dl"')
    barra, _, resto2 = resto.partition("\n")
    blocos = dict(
        (n.split("—")[0].strip(), h)
        for n, h in re.findall(
            r"<!-- ▸ (.*?) -->\n(<section class=\"slide.*?</section>)", modelo, re.S
        )
    )
    avatar = "data:image/png;base64," + base64.b64encode(
        (SKILL / "assets" / "avatar.png").read_bytes()
    ).decode()
    bloco = (
        blocos["CITACAO"]
        .replace("{{EIXO}}", "Queda capilar")
        .replace("{{AVATAR}}", avatar)
        .replace("{{SELO}}", (SKILL / "assets" / "selo.svg").read_text(encoding="utf-8"))
        .replace("{{FALA}}", frase)
    )
    html = (
        cabeca + '<div class="dl"' + barra + "\n" + bloco
        + resto2[resto2.rfind("<script>"):]
    ).replace("{{TEMA}}", apelido(frase))
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(html, encoding="utf-8")
    return destino


def main() -> None:
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(1)
    if args[0] == "--arquivo":
        frases = [l.strip() for l in pathlib.Path(args[1]).read_text(encoding="utf-8").splitlines() if l.strip()]
        resto = args[2:]
    else:
        frases = [args[0]]
        resto = args[1:]
    saida = pathlib.Path(resto[0]).resolve() if resto else pathlib.Path("posts-de-frase").resolve()

    for frase in frases:
        # A frase entra como HTML para aceitar <em> num destaque pontual, mas
        # negrito e barrado no CSS do bloco: fala nao tem enfase de peso.
        arq = montar(frase, saida / f"frase-{apelido(frase)}.html")
        print(f"  {arq.name}")
        subprocess.run(
            [sys.executable, str(AQUI / "exportar.py"), str(arq), str(saida)],
            check=True,
        )


if __name__ == "__main__":
    main()
