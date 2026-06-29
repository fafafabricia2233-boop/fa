#!/usr/bin/env python3
"""
Remove toda informação de IA de imagens PNG, JPEG e WebP.
Elimina: C2PA (caBX), chunks tEXt/iTXt/zTXt, EXIF, XMP, IPTC.
"""

import sys
import struct
import zlib
import argparse
from pathlib import Path

# Chunks PNG essenciais que devem ser mantidos
PNG_KEEP_CHUNKS = {"IHDR", "IDAT", "IEND", "PLTE", "tRNS", "gAMA", "sRGB", "cHRM", "bKGD", "pHYs", "sBIT", "sPLT", "hIST", "tIME"}

# Chunks PNG que sempre contêm metadados e devem ser removidos
PNG_REMOVE_CHUNKS = {"tEXt", "iTXt", "zTXt", "eXIf", "caBX", "iCCP", "XMP "}


def strip_png(input_path, output_path):
    """Remove todos os metadados de um PNG, mantendo apenas chunks essenciais de imagem."""
    with open(input_path, "rb") as f:
        sig = f.read(8)
        if sig != b"\x89PNG\r\n\x1a\n":
            raise ValueError("Não é um arquivo PNG válido.")

        chunks = []
        while True:
            header = f.read(8)
            if len(header) < 8:
                break
            length = struct.unpack(">I", header[:4])[0]
            chunk_type = header[4:8].decode("ascii", errors="replace")
            data = f.read(length)
            crc = f.read(4)
            chunks.append((chunk_type, data, crc))
            if chunk_type == "IEND":
                break

    removed = []
    with open(output_path, "wb") as f:
        f.write(sig)
        for chunk_type, data, crc in chunks:
            if chunk_type in PNG_REMOVE_CHUNKS:
                removed.append(chunk_type)
                continue
            # Remove chunks não-padrão (minúscula no 1º char = ancillary; maiúscula = critical)
            # Mantém apenas os conhecidos e seguros
            if chunk_type not in PNG_KEEP_CHUNKS:
                removed.append(chunk_type)
                continue
            f.write(struct.pack(">I", len(data)))
            f.write(chunk_type.encode("ascii"))
            f.write(data)
            f.write(crc)

    return removed


def strip_jpeg(input_path, output_path):
    """Remove EXIF, XMP e IPTC de JPEG mantendo a imagem intacta."""
    from PIL import Image
    import io

    with Image.open(input_path) as img:
        # Converte para RGB se necessário (remove canal alpha que pode carregar dados)
        if img.mode in ("RGBA", "P", "LA"):
            img = img.convert("RGB")

        # Salva sem nenhum metadado
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=95, optimize=True)
        buf.seek(0)

    with open(output_path, "wb") as f:
        f.write(buf.read())

    return ["EXIF", "XMP", "IPTC", "APP1", "APP13"]


def strip_webp(input_path, output_path):
    """Remove metadados de WebP."""
    from PIL import Image
    import io

    with Image.open(input_path) as img:
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")

        buf = io.BytesIO()
        img.save(buf, format="WEBP", quality=90)
        buf.seek(0)

    with open(output_path, "wb") as f:
        f.write(buf.read())

    return ["EXIF", "XMP", "IPTC"]


def remove_ai_metadata(input_path, output_path=None, overwrite=False):
    path = Path(input_path)
    if not path.exists():
        return {"error": f"Arquivo não encontrado: {input_path}"}

    suffix = path.suffix.lower()

    if output_path:
        out = Path(output_path)
    elif overwrite:
        out = path
    else:
        out = path.with_stem(path.stem + "_clean")

    try:
        if suffix == ".png":
            removed = strip_png(path, out)
        elif suffix in (".jpg", ".jpeg"):
            removed = strip_jpeg(path, out)
        elif suffix == ".webp":
            removed = strip_webp(path, out)
        else:
            return {"error": f"Formato não suportado: {suffix}"}

        size_before = path.stat().st_size
        size_after = out.stat().st_size
        saved = size_before - size_after

        return {
            "input": str(path),
            "output": str(out),
            "removed_chunks": removed,
            "size_before": size_before,
            "size_after": size_after,
            "bytes_removed": saved,
            "ok": True,
        }
    except Exception as e:
        return {"error": str(e)}


def main():
    parser = argparse.ArgumentParser(
        description="Remove metadados de IA de imagens (C2PA, EXIF, tEXt, XMP, etc.)"
    )
    parser.add_argument("images", nargs="+", metavar="IMAGEM")
    parser.add_argument("-o", "--output", metavar="SAIDA",
                        help="Arquivo de saída (só funciona com uma imagem)")
    parser.add_argument("--overwrite", action="store_true",
                        help="Sobrescreve o arquivo original (CUIDADO)")
    args = parser.parse_args()

    if args.output and len(args.images) > 1:
        print("Erro: -o só pode ser usado com uma imagem por vez.", file=sys.stderr)
        sys.exit(1)

    for img_path in args.images:
        result = remove_ai_metadata(img_path, args.output, args.overwrite)

        if "error" in result:
            print(f"ERRO: {result['error']}")
            continue

        print(f"\n{'='*55}")
        print(f"  Entrada : {Path(result['input']).name}")
        print(f"  Saída   : {Path(result['output']).name}")
        print(f"  Removido: {', '.join(dict.fromkeys(result['removed_chunks'])) or 'nenhum'}")
        print(f"  Tamanho : {result['size_before']:,} → {result['size_after']:,} bytes"
              f"  ({result['bytes_removed']:+,} bytes)")
        print(f"  Status  : OK - limpa de metadados de IA")

    print()


if __name__ == "__main__":
    main()
