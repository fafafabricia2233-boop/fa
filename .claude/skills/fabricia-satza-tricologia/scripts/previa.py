#!/usr/bin/env python3
"""Renderiza os slides de um template e monta uma folha de contato.

Serve para OLHAR a peça antes de entregar. Boa parte dos defeitos — texto
vazando, fio de 1px que sumiu, marcador fora do lugar, placeholder esquecido —
so aparece renderizado.

Uso:  python3 previa.py carrossel-tema.html previa.png [colunas]
"""
import asyncio
import pathlib
import sys

CHROMIUM_CANDIDATOS = [
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
]


def achar_chromium() -> str | None:
    for c in CHROMIUM_CANDIDATOS:
        if pathlib.Path(c).exists():
            return c
    for base in pathlib.Path("/opt/pw-browsers").glob("chromium-*/chrome-linux/chrome"):
        return str(base)
    return None


async def capturar(html: pathlib.Path, destino: pathlib.Path) -> list[pathlib.Path]:
    from playwright.async_api import async_playwright

    saidas: list[pathlib.Path] = []
    async with async_playwright() as pw:
        exe = achar_chromium()
        navegador = await pw.chromium.launch(executable_path=exe) if exe \
            else await pw.chromium.launch()
        pagina = await navegador.new_page(viewport={"width": 1200, "height": 1400})
        await pagina.goto(html.as_uri())
        # A fonte esta embutida, mas ainda precisa decodificar e aplicar. Sem a
        # espera, o print sai medido com a fonte de fallback.
        await pagina.wait_for_timeout(1800)
        for i, el in enumerate(await pagina.query_selector_all(".slide")):
            arq = destino.parent / f".slide-{i:02d}.png"
            await el.screenshot(path=str(arq))
            saidas.append(arq)
        await navegador.close()
    return saidas


def folha(slides: list[pathlib.Path], destino: pathlib.Path, colunas: int) -> None:
    from PIL import Image

    larg, alt = 330, 412
    imagens = [Image.open(s).resize((larg, alt)) for s in slides]
    linhas = (len(imagens) + colunas - 1) // colunas
    folha = Image.new("RGB", (colunas * (larg + 10) + 10,
                              linhas * (alt + 10) + 10), (22, 22, 24))
    for i, im in enumerate(imagens):
        folha.paste(im, ((i % colunas) * (larg + 10) + 5,
                         (i // colunas) * (alt + 10) + 5))
    folha.save(destino)


def main() -> None:
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    html = pathlib.Path(sys.argv[1]).resolve()
    destino = pathlib.Path(sys.argv[2]).resolve()
    colunas = int(sys.argv[3]) if len(sys.argv) > 3 else 4

    texto = html.read_text(encoding="utf-8")
    esquecidos = sorted(set(p for p in texto.split("{{")[1:] if "}}" in p))
    if esquecidos:
        nomes = ", ".join("{{" + p.split("}}")[0] + "}}" for p in esquecidos[:8])
        print(f"aviso: placeholder nao preenchido -> {nomes}")

    slides = asyncio.run(capturar(html, destino))
    if not slides:
        print("nenhum .slide encontrado no arquivo")
        sys.exit(1)
    folha(slides, destino, colunas)
    for s in slides:
        s.unlink()
    print(f"{destino}  ({len(slides)} slides)")


if __name__ == "__main__":
    main()
