#!/usr/bin/env python3
"""
Extrai metadados de IA de imagens geradas por ferramentas como
Stable Diffusion (A1111/Forge), ComfyUI, Midjourney, DALL-E, etc.
"""

import sys
import json
import argparse
import struct
import zlib
from pathlib import Path


def read_png_chunks(filepath):
    """Lê todos os chunks de texto de um arquivo PNG."""
    chunks = {}
    try:
        with open(filepath, "rb") as f:
            sig = f.read(8)
            if sig != b"\x89PNG\r\n\x1a\n":
                return chunks

            while True:
                header = f.read(8)
                if len(header) < 8:
                    break
                length = struct.unpack(">I", header[:4])[0]
                chunk_type = header[4:8].decode("ascii", errors="ignore")
                data = f.read(length)
                f.read(4)  # CRC

                if chunk_type == "tEXt":
                    try:
                        null_idx = data.index(b"\x00")
                        key = data[:null_idx].decode("latin-1")
                        value = data[null_idx + 1:].decode("latin-1")
                        chunks[key] = value
                    except (ValueError, UnicodeDecodeError):
                        pass

                elif chunk_type == "iTXt":
                    try:
                        null_idx = data.index(b"\x00")
                        key = data[:null_idx].decode("utf-8")
                        rest = data[null_idx + 1:]
                        compressed = rest[0]
                        rest = rest[2:]  # skip compression method
                        lang_end = rest.index(b"\x00")
                        rest = rest[lang_end + 1:]
                        translated_end = rest.index(b"\x00")
                        value_bytes = rest[translated_end + 1:]
                        if compressed:
                            value_bytes = zlib.decompress(value_bytes)
                        chunks[key] = value_bytes.decode("utf-8", errors="replace")
                    except Exception:
                        pass

                elif chunk_type == "zTXt":
                    try:
                        null_idx = data.index(b"\x00")
                        key = data[:null_idx].decode("latin-1")
                        value_bytes = zlib.decompress(data[null_idx + 2:])
                        chunks[key] = value_bytes.decode("latin-1")
                    except Exception:
                        pass

                elif chunk_type == "IEND":
                    break
    except (OSError, struct.error):
        pass
    return chunks


def parse_a1111_parameters(params_str):
    """Faz parse do formato de parâmetros do Stable Diffusion A1111/Forge."""
    result = {}
    lines = params_str.strip().split("\n")

    # Prompt positivo: tudo antes de "Negative prompt:"
    prompt_lines = []
    negative_lines = []
    settings_line = ""
    mode = "positive"

    for line in lines:
        if line.startswith("Negative prompt:"):
            mode = "negative"
            neg_part = line[len("Negative prompt:"):].strip()
            if neg_part:
                negative_lines.append(neg_part)
        elif mode == "negative" and (
            "Steps:" in line or "Sampler:" in line or "CFG scale:" in line
            or "Seed:" in line or "Size:" in line or "Model:" in line
        ):
            mode = "settings"
            settings_line = line
        elif mode == "negative":
            negative_lines.append(line)
        elif mode == "settings":
            settings_line += " " + line
        else:
            prompt_lines.append(line)

    if prompt_lines:
        result["prompt"] = "\n".join(prompt_lines).strip()
    if negative_lines:
        result["negative_prompt"] = "\n".join(negative_lines).strip()

    # Parse settings linha
    if settings_line:
        import re
        pairs = re.findall(r'([\w\s]+):\s*([^,]+)', settings_line)
        for key, value in pairs:
            result[key.strip()] = value.strip()

    return result


def extract_exif_metadata(filepath):
    """Extrai metadados EXIF da imagem."""
    try:
        import piexif
        exif_dict = piexif.load(str(filepath))
        result = {}

        tag_names = {
            piexif.ImageIFD.Make: "Camera Make",
            piexif.ImageIFD.Model: "Camera Model",
            piexif.ImageIFD.Software: "Software",
            piexif.ImageIFD.DateTime: "DateTime",
            piexif.ImageIFD.ImageDescription: "Description",
            piexif.ImageIFD.Artist: "Artist",
            piexif.ImageIFD.Copyright: "Copyright",
            piexif.ImageIFD.XPComment: "Comment",
            piexif.ImageIFD.XPKeywords: "Keywords",
        }

        ifd_map = {
            "0th": exif_dict.get("0th", {}),
            "1st": exif_dict.get("1st", {}),
        }
        exif_ifd = exif_dict.get("Exif", {})
        if 37510 in exif_ifd:  # UserComment
            try:
                uc = exif_ifd[37510]
                if uc[:8] == b"UNICODE\x00":
                    result["UserComment"] = uc[8:].decode("utf-16-be", errors="replace").strip("\x00")
                elif uc[:8] == b"ASCII\x00\x00\x00":
                    result["UserComment"] = uc[8:].decode("ascii", errors="replace").strip("\x00")
                else:
                    result["UserComment"] = uc.decode("utf-8", errors="replace").strip("\x00")
            except Exception:
                pass

        for ifd in ifd_map.values():
            for tag_id, name in tag_names.items():
                if tag_id in ifd:
                    val = ifd[tag_id]
                    if isinstance(val, bytes):
                        try:
                            val = val.decode("utf-8", errors="replace").strip("\x00")
                        except Exception:
                            val = repr(val)
                    if val:
                        result[name] = val

        return result
    except Exception:
        return {}


def extract_ai_metadata(filepath):
    """Extrai todos os metadados de IA disponíveis na imagem."""
    path = Path(filepath)
    if not path.exists():
        return {"error": f"Arquivo não encontrado: {filepath}"}

    result = {
        "file": str(path.name),
        "format": path.suffix.upper().lstrip("."),
        "tool_detected": None,
        "metadata": {},
        "parsed": {},
    }

    suffix = path.suffix.lower()

    # --- PNG ---
    if suffix == ".png":
        chunks = read_png_chunks(filepath)

        # Stable Diffusion A1111 / Forge
        if "parameters" in chunks:
            result["tool_detected"] = "Stable Diffusion (A1111/Forge)"
            result["metadata"]["parameters"] = chunks["parameters"]
            result["parsed"] = parse_a1111_parameters(chunks["parameters"])

        # ComfyUI
        elif "workflow" in chunks or "prompt" in chunks:
            result["tool_detected"] = "ComfyUI"
            for key in ("workflow", "prompt"):
                if key in chunks:
                    try:
                        result["metadata"][key] = json.loads(chunks[key])
                    except json.JSONDecodeError:
                        result["metadata"][key] = chunks[key]

        # InvokeAI
        elif "invokeai_metadata" in chunks or "sd-metadata" in chunks:
            result["tool_detected"] = "InvokeAI"
            for key in ("invokeai_metadata", "sd-metadata"):
                if key in chunks:
                    try:
                        result["metadata"][key] = json.loads(chunks[key])
                    except json.JSONDecodeError:
                        result["metadata"][key] = chunks[key]

        # NovelAI
        elif "Title" in chunks and "Description" in chunks:
            result["tool_detected"] = "NovelAI"
            result["metadata"] = {k: chunks[k] for k in ("Title", "Description", "Software", "Comment") if k in chunks}
            if "Comment" in chunks:
                try:
                    result["parsed"] = json.loads(chunks["Comment"])
                except json.JSONDecodeError:
                    pass

        # Qualquer outro chunk de texto
        else:
            if chunks:
                result["metadata"] = chunks
                result["tool_detected"] = "Desconhecido (metadados encontrados)"
            else:
                result["tool_detected"] = "Nenhum metadado de IA encontrado"

    # --- JPEG / WEBP (EXIF) ---
    elif suffix in (".jpg", ".jpeg", ".webp"):
        exif = extract_exif_metadata(filepath)
        if exif:
            result["metadata"] = exif
            # Midjourney embeds prompt in Description ou UserComment
            for field in ("Description", "UserComment", "Comment"):
                if field in exif and exif[field]:
                    val = exif[field]
                    if any(kw in val.lower() for kw in ("--ar", "--v", "--style", "midjourney")):
                        result["tool_detected"] = "Midjourney"
                        result["parsed"]["prompt"] = val
                        break
            if not result["tool_detected"] and exif:
                result["tool_detected"] = "Metadados EXIF encontrados"
        else:
            result["tool_detected"] = "Nenhum metadado encontrado"

    # --- Formato não suportado ---
    else:
        result["tool_detected"] = f"Formato {suffix} não suportado"

    return result


def print_result(data, output_format="human"):
    if output_format == "json":
        print(json.dumps(data, ensure_ascii=False, indent=2))
        return

    print(f"\n{'='*60}")
    print(f"  Arquivo : {data['file']}")
    print(f"  Formato : {data['format']}")
    print(f"  Origem  : {data.get('tool_detected') or 'Desconhecida'}")
    print(f"{'='*60}")

    parsed = data.get("parsed", {})
    if parsed:
        print("\n--- Informações Extraídas ---")
        if "prompt" in parsed:
            print(f"\nPrompt:\n  {parsed['prompt'][:500]}{'...' if len(parsed.get('prompt',''))>500 else ''}")
        if "negative_prompt" in parsed:
            print(f"\nNegativo:\n  {parsed['negative_prompt'][:300]}{'...' if len(parsed.get('negative_prompt',''))>300 else ''}")
        settings = {k: v for k, v in parsed.items() if k not in ("prompt", "negative_prompt")}
        if settings:
            print("\nConfigurações:")
            for key, val in settings.items():
                print(f"  {key}: {val}")

    metadata = data.get("metadata", {})
    if metadata and not parsed:
        print("\n--- Metadados Brutos ---")
        if isinstance(metadata, dict):
            for key, val in metadata.items():
                val_str = json.dumps(val, ensure_ascii=False) if isinstance(val, (dict, list)) else str(val)
                if len(val_str) > 300:
                    val_str = val_str[:300] + "..."
                print(f"  {key}: {val_str}")
        else:
            print(f"  {str(metadata)[:500]}")

    if not parsed and not metadata:
        print("\n  Nenhum metadado de IA encontrado nesta imagem.")

    print()


def main():
    parser = argparse.ArgumentParser(
        description="Extrai metadados de IA de imagens (Stable Diffusion, ComfyUI, Midjourney, etc.)"
    )
    parser.add_argument("images", nargs="+", metavar="IMAGEM", help="Arquivos de imagem para analisar")
    parser.add_argument("--json", action="store_true", help="Saída em formato JSON")
    args = parser.parse_args()

    output_format = "json" if args.json else "human"

    if output_format == "json" and len(args.images) > 1:
        results = [extract_ai_metadata(img) for img in args.images]
        print(json.dumps(results, ensure_ascii=False, indent=2))
        return

    for img_path in args.images:
        data = extract_ai_metadata(img_path)
        print_result(data, output_format)


if __name__ == "__main__":
    main()
