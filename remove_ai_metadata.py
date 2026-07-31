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

# Chunks PNG essenciais que devem ser mantidos.
# iCCP (perfil de cor) fica aqui: não carrega informação de IA e removê-lo
# altera as cores na exibição. Use --strip-icc para removê-lo mesmo assim.
PNG_KEEP_CHUNKS = {"IHDR", "IDAT", "IEND", "PLTE", "tRNS", "gAMA", "sRGB", "cHRM", "bKGD", "pHYs", "sBIT", "sPLT", "hIST", "tIME", "iCCP"}

# Chunks PNG que sempre contêm metadados e devem ser removidos
PNG_REMOVE_CHUNKS = {"tEXt", "iTXt", "zTXt", "eXIf", "caBX", "XMP "}

EXIF_ORIENTATION_TAG = 0x0112


def read_orientation(filepath):
    """Lê a tag EXIF de orientação (1-8). Retorna None se ausente ou normal."""
    try:
        from PIL import Image
        with Image.open(filepath) as img:
            value = img.getexif().get(EXIF_ORIENTATION_TAG)
    except Exception:
        return None
    return value if value and 2 <= value <= 8 else None


def build_minimal_exif(orientation):
    """Monta um bloco EXIF/TIFF contendo apenas a tag de orientação.

    Preserva como a imagem deve ser exibida sem carregar nenhum outro dado
    (câmera, GPS, data, software). Retorna os bytes começando em "Exif\\x00\\x00".
    """
    tiff = b"MM\x00\x2a" + struct.pack(">I", 8)          # big-endian, IFD0 em offset 8
    tiff += struct.pack(">H", 1)                          # 1 entrada
    tiff += struct.pack(">HHI", EXIF_ORIENTATION_TAG, 3, 1)  # tag, tipo SHORT, count 1
    tiff += struct.pack(">HH", orientation, 0)            # valor + padding do campo de 4 bytes
    tiff += struct.pack(">I", 0)                          # sem próximo IFD
    return b"Exif\x00\x00" + tiff


def strip_png(input_path, output_path, strip_icc=False):
    """Remove todos os metadados de um PNG, mantendo apenas chunks essenciais de imagem."""
    keep = PNG_KEEP_CHUNKS - {"iCCP"} if strip_icc else PNG_KEEP_CHUNKS
    orientation = read_orientation(input_path)

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

    def write_chunk(f, chunk_type, payload):
        raw = chunk_type.encode("ascii") + payload
        f.write(struct.pack(">I", len(payload)))
        f.write(raw)
        f.write(struct.pack(">I", zlib.crc32(raw) & 0xFFFFFFFF))

    removed = []
    with open(output_path, "wb") as f:
        f.write(sig)

        # eXIf mínimo só com a orientação, senão a imagem aparece girada
        if orientation:
            write_chunk(f, "eXIf", build_minimal_exif(orientation)[6:])

        for chunk_type, data, crc in chunks:
            if chunk_type in PNG_REMOVE_CHUNKS:
                removed.append(chunk_type)
                continue
            # Remove chunks não-padrão (minúscula no 1º char = ancillary; maiúscula = critical)
            # Mantém apenas os conhecidos e seguros
            if chunk_type not in keep:
                removed.append(chunk_type)
                continue
            f.write(struct.pack(">I", len(data)))
            f.write(chunk_type.encode("ascii"))
            f.write(data)
            f.write(crc)

    return removed


# Marcadores JPEG de metadados a remover (APPn), com rótulo legível
JPEG_REMOVE_MARKERS = {
    0xE1: "APP1 (EXIF/XMP)",
    0xE3: "APP3",
    0xE5: "APP5",
    0xE6: "APP6",
    0xE9: "APP9",
    0xEA: "APP10 (Apple)",
    0xEB: "APP11 (C2PA/JUMBF)",
    0xEC: "APP12",
    0xED: "APP13 (IPTC/Photoshop)",
    0xEE: "APP14 (Adobe)",
    0xEF: "APP15",
    0xFE: "COM (comentário)",
}


def strip_jpeg(input_path, output_path, strip_icc=False):
    """Remove EXIF, XMP, IPTC e C2PA de JPEG sem reencodificar (sem perda de qualidade).

    O perfil de cor ICC (APP2) é preservado por padrão: não carrega informação de
    IA e removê-lo altera as cores na exibição. Use strip_icc=True para removê-lo.

    A orientação EXIF também é preservada (reescrita como um EXIF mínimo), senão
    a foto aparece girada no visualizador.
    """
    remove_markers = dict(JPEG_REMOVE_MARKERS)
    if strip_icc:
        remove_markers[0xE2] = "APP2 (ICC/perfil de cor)"

    orientation = read_orientation(input_path)

    with open(input_path, "rb") as f:
        data = f.read()

    if data[:2] != b"\xff\xd8":
        raise ValueError("Não é um arquivo JPEG válido.")

    out = bytearray(b"\xff\xd8")

    # EXIF mínimo só com a orientação, logo após o SOI
    if orientation:
        exif = build_minimal_exif(orientation)
        out.extend(b"\xff\xe1")
        out.extend(struct.pack(">H", len(exif) + 2))
        out.extend(exif)

    removed = []
    i = 2

    while i < len(data) - 1:
        if data[i] != 0xFF:
            # Fora de sincronia: copia o resto como está
            out.extend(data[i:])
            break

        marker = data[i + 1]

        if marker == 0xDA:  # SOS: daqui em diante são os dados da imagem
            out.extend(data[i:])
            break

        seg_len = int.from_bytes(data[i + 2:i + 4], "big")
        if seg_len < 2:
            out.extend(data[i:])
            break

        segment = data[i:i + 2 + seg_len]

        if marker in remove_markers:
            removed.append(remove_markers[marker])
        else:
            out.extend(segment)

        i += 2 + seg_len

    with open(output_path, "wb") as f:
        f.write(out)

    return removed


def strip_webp(input_path, output_path, strip_icc=False):
    """Remove EXIF, XMP e C2PA de WebP sem reencodificar (sem perda de qualidade)."""
    with open(input_path, "rb") as f:
        data = f.read()

    if data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        raise ValueError("Não é um arquivo WebP válido.")

    remove = {b"EXIF", b"XMP ", b"C2PA"}
    if strip_icc:
        remove.add(b"ICCP")

    orientation = read_orientation(input_path)
    kept = bytearray()
    removed = []
    i = 12

    while i + 8 <= len(data):
        fourcc = data[i:i + 4]
        size = int.from_bytes(data[i + 4:i + 8], "little")
        padded = size + (size & 1)  # chunks RIFF têm padding para tamanho par
        chunk = data[i:i + 8 + padded]

        if fourcc in remove:
            removed.append(fourcc.decode("ascii", errors="replace").strip())
        else:
            if fourcc == b"VP8X" and len(chunk) >= 9:
                # VP8X carrega flags de presença de ICC/EXIF/XMP; limpa as removidas
                chunk = bytearray(chunk)
                flags = chunk[8]
                if strip_icc:
                    flags &= ~0x20      # ICC
                if orientation:
                    flags |= 0x08       # mantém EXIF: reescrito só com a orientação
                else:
                    flags &= ~0x08
                flags &= ~0x04          # XMP
                chunk[8] = flags
                chunk = bytes(chunk)
            kept.extend(chunk)

        i += 8 + padded

    # EXIF mínimo só com a orientação, senão a imagem aparece girada
    if orientation:
        payload = build_minimal_exif(orientation)[6:]
        kept.extend(b"EXIF" + len(payload).to_bytes(4, "little") + payload)
        if len(payload) & 1:
            kept.extend(b"\x00")

    out = bytearray(b"RIFF")
    out.extend((len(kept) + 4).to_bytes(4, "little"))
    out.extend(b"WEBP")
    out.extend(kept)

    with open(output_path, "wb") as f:
        f.write(out)

    return removed


def remove_ai_metadata(input_path, output_path=None, overwrite=False, strip_icc=False):
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

    # Lido antes de escrever, pois com --overwrite entrada e saída são o mesmo arquivo
    size_before = path.stat().st_size

    try:
        if suffix == ".png":
            removed = strip_png(path, out, strip_icc)
        elif suffix in (".jpg", ".jpeg"):
            removed = strip_jpeg(path, out, strip_icc)
        elif suffix == ".webp":
            removed = strip_webp(path, out, strip_icc)
        else:
            return {"error": f"Formato não suportado: {suffix}"}

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
    parser.add_argument("--strip-icc", action="store_true",
                        help="Remove também o perfil de cor ICC "
                             "(não contém dado de IA e altera as cores)")
    args = parser.parse_args()

    if args.output and len(args.images) > 1:
        print("Erro: -o só pode ser usado com uma imagem por vez.", file=sys.stderr)
        sys.exit(1)

    for img_path in args.images:
        result = remove_ai_metadata(img_path, args.output, args.overwrite, args.strip_icc)

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
