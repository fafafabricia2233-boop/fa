#!/usr/bin/env python3
"""Gera um POST DE NOTA — o cartao com o cursor, sobre uma foto dela.

Uso:
    python3 nota.py "a frase" foto.jpg [pasta-de-saida]
    python3 nota.py --arquivo frases.txt foto.jpg [pasta]   (uma frase por linha)

Entrega o .html e a imagem ja exportada, em 3:4 e sem metadados.

O padrao esta fechado:
  cartao   branco suave, cantos arredondados, sobre a foto
  cursor   ambar do iPhone no fim da frase — e ele que faz o formato
  enfase   UMA palavra em <b>, no maximo; a frase e um fato, nao um anuncio
  rodape   so o arroba, sem seta: post avulso nao tem para onde arrastar

A frase entra como HTML, entao <b>trinta dias</b> marca a palavra.
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
    t = unicodedata.normalize("NFKD", re.sub(r"<[^>]+>", "", texto).lower())
    t = "".join(c for c in t if not unicodedata.combining(c))
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return "-".join(t.split("-")[:6]) or "nota"


def montar(frase: str, foto: pathlib.Path, destino: pathlib.Path) -> pathlib.Path:
    modelo = (SKILL / "assets" / "carrossel.html").read_text(encoding="utf-8")
    cabeca, _, resto = modelo.partition('<div class="dl"')
    barra, _, resto2 = resto.partition("\n")
    blocos = dict(
        (n.split("—")[0].strip(), h)
        for n, h in re.findall(
            r"<!-- ▸ (.*?) -->\n(<section class=\"slide.*?</section>)", modelo, re.S
        )
    )
    # A foto vai embutida: o .html precisa abrir sozinho em qualquer pasta.
    tipo = "jpeg" if foto.suffix.lower() in (".jpg", ".jpeg") else foto.suffix.lstrip(".")
    dados = "data:image/%s;base64,%s" % (
        tipo, base64.b64encode(foto.read_bytes()).decode()
    )
    bloco = (
        blocos["NOTA"]
        .replace("{{EIXO}}", "Queda capilar")
        .replace("{{FOTO}}", dados)
        .replace("{{NOTA}}", frase)
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
    if len(args) < 2:
        print(__doc__)
        sys.exit(1)
    if args[0] == "--arquivo":
        frases = [
            l.strip()
            for l in pathlib.Path(args[1]).read_text(encoding="utf-8").splitlines()
            if l.strip()
        ]
        foto, resto = pathlib.Path(args[2]), args[3:]
    else:
        frases, foto, resto = [args[0]], pathlib.Path(args[1]), args[2:]

    if not foto.is_file():
        sys.exit(f"foto nao encontrada: {foto}")
    saida = pathlib.Path(resto[0]).resolve() if resto else pathlib.Path("posts-de-nota").resolve()

    for frase in frases:
        marcas = frase.count("<b>")
        if marcas > 1:
            print(f"  aviso: {marcas} palavras marcadas. O formato pede uma so.")
        arq = montar(frase, foto.resolve(), saida / f"nota-{apelido(frase)}.html")
        print(f"  {arq.name}")
        subprocess.run(
            [sys.executable, str(AQUI / "exportar.py"), str(arq), str(saida)], check=True
        )


if __name__ == "__main__":
    main()
