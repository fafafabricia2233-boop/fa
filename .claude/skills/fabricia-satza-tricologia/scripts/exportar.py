#!/usr/bin/env python3
"""Exporta cada slide como uma imagem separada, pronta para o Instagram.

Por que existe, se o template ja tem o botao de ZIP: no celular o navegador
nao descompacta o ZIP e acaba salvando a peca inteira como um PDF unico. O
Instagram precisa de um arquivo por slide. Este script entrega isso — nomeados
em ordem, para postar sem se perder na sequencia.

Uso:  python3 exportar.py <arquivo.html> [pasta-de-saida] [--png]

Todo metadado sai antes da entrega — nenhuma imagem vai para fora com EXIF,
perfil de cor, comentario ou marca de ferramenta.

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


def limpar_metadados(arq: pathlib.Path) -> int:
    """Remove todo segmento de metadado do arquivo, sem reencodar.

    Cortar os marcadores byte a byte preserva o fluxo comprimido intacto — abrir
    e salvar de novo custaria uma geracao de qualidade a toa.

    JPEG: sai todo APPn menos o APP0/JFIF, e todo COM. O APP0 fica porque e
    estrutura do formato e nao carrega informacao (versao, densidade 1x1,
    miniatura 0x0). O que sai de fato: APP1 (EXIF e XMP), APP2 (perfil de cor),
    APP13 (IPTC) e APP14 (Adobe). Sem perfil, o conteudo e lido como sRGB, que
    e o que ele ja e.

    PNG: saem os blocos de texto e de tempo (tEXt, iTXt, zTXt, tIME, eXIf).
    """
    b = arq.read_bytes()

    if b[:2] == b"\xff\xd8":                       # JPEG
        saida = bytearray(b[:2])
        i = 2
        while i < len(b) - 1 and b[i] == 0xFF:
            m = b[i + 1]
            if m == 0xDA:                            # daqui pra frente e imagem
                saida += b[i:]
                break
            tam = int.from_bytes(b[i + 2:i + 4], "big")
            descartar = (0xE1 <= m <= 0xEF) or m == 0xFE
            if not descartar:
                saida += b[i:i + 2 + tam]
            i += 2 + tam
        else:
            saida += b[i:]
    elif b[:8] == b"\x89PNG\r\n\x1a\n":              # PNG
        saida = bytearray(b[:8]); i = 8
        while i < len(b):
            tam = int.from_bytes(b[i:i + 4], "big")
            tipo = b[i + 4:i + 8]
            if tipo not in (b"tEXt", b"iTXt", b"zTXt", b"tIME", b"eXIf"):
                saida += b[i:i + 12 + tam]
            i += 12 + tam
    else:
        return 0

    removido = len(b) - len(saida)
    if removido:
        arq.write_bytes(bytes(saida))
    return removido


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
            limpar_metadados(arq)
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
