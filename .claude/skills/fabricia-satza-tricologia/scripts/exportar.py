#!/usr/bin/env python3
"""Exporta cada slide como uma imagem separada, pronta para o Instagram.

Por que existe, se o template ja tem o botao de ZIP: no celular o navegador
nao descompacta o ZIP e acaba salvando a peca inteira como um PDF unico. O
Instagram precisa de um arquivo por slide. Este script entrega isso — nomeados
em ordem, para postar sem se perder na sequencia.

Uso:  python3 exportar.py <arquivo.html> [pasta-de-saida] [--png]

Sai em 2160x2700 (o dobro de 1080x1350), que e o que o Instagram aceita sem
reamostrar para baixo. JPEG de qualidade 95 por padrao: num slide com foto o
PNG passa de 4 MB e trava o envio pelo celular, e a 95 a diferenca visual e
nula. Use --png se for imprimir.
"""
import asyncio
import pathlib
import sys

CHROMIUM = [
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome",
]


def achar_chromium() -> str | None:
    for c in CHROMIUM:
        if pathlib.Path(c).exists():
            return c
    for p in pathlib.Path("/opt/pw-browsers").glob("chromium-*/chrome-linux/chrome"):
        return str(p)
    return None


async def exportar(html: pathlib.Path, saida: pathlib.Path, png: bool) -> list[pathlib.Path]:
    from playwright.async_api import async_playwright

    feitos: list[pathlib.Path] = []
    async with async_playwright() as pw:
        exe = achar_chromium()
        nav = await pw.chromium.launch(executable_path=exe) if exe else await pw.chromium.launch()
        # device_scale_factor=2 rasteriza em 2160x2700 sem reamostrar depois:
        # o texto sai nitido de verdade, nao ampliado.
        pg = await nav.new_page(viewport={"width": 1200, "height": 1400},
                                device_scale_factor=2)
        await pg.goto(html.as_uri())
        await pg.wait_for_timeout(2000)
        await pg.eval_on_selector_all(".dl", "els => els.forEach(e => e.remove())")
        base = html.stem.replace("carrossel-", "")
        for i, el in enumerate(await pg.query_selector_all(".slide"), 1):
            arq = saida / f"{base}-{i:02d}.{'png' if png else 'jpg'}"
            if png:
                await el.screenshot(path=str(arq))
            else:
                await el.screenshot(path=str(arq), type="jpeg", quality=95)
            feitos.append(arq)
        await nav.close()
    return feitos


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    html = pathlib.Path(sys.argv[1]).resolve()
    resto = [a for a in sys.argv[2:] if not a.startswith("--")]
    saida = pathlib.Path(resto[0]).resolve() if resto else html.parent / f"{html.stem}-slides"
    saida.mkdir(parents=True, exist_ok=True)

    texto = html.read_text(encoding="utf-8")
    if "{{" in texto:
        sobrou = {p.split("}}")[0] for p in texto.split("{{")[1:] if "}}" in p}
        print("aviso: placeholder nao preenchido ->", ", ".join(sorted(sobrou))[:120])

    feitos = asyncio.run(exportar(html, saida, "--png" in sys.argv))
    total = sum(a.stat().st_size for a in feitos)
    for a in feitos:
        print(f"  {a.name}  {a.stat().st_size // 1024} KB")
    print(f"{len(feitos)} slides em {saida}  ({total // 1024 // 1024} MB no total)")


if __name__ == "__main__":
    main()
