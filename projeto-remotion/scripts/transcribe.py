import argparse
import json
import os
import subprocess
import sys
from pathlib import Path


def to_caption(word, index):
    text = word.get("text") or word.get("word") or ""
    start = word.get("startMs", word.get("start", index * 0.25))
    end = word.get("endMs", word.get("end", start + 0.25))

    def to_ms(value):
        value = float(value)
        return int(round(value if value > 1000 else value * 1000))

    start_ms = to_ms(start)
    end_ms = max(to_ms(end), start_ms + 1)

    return {
        "text": text if text.startswith(" ") else f" {text}",
        "startMs": start_ms,
        "endMs": end_ms,
        "timestampMs": start_ms,
        "confidence": word.get("confidence"),
    }


def convert_words_json(input_path, output_path):
    data = json.loads(Path(input_path).read_text(encoding="utf-8"))
    if isinstance(data, list):
        words = data
    else:
        words = data.get("captions") or data.get("words") or []
        if not words and data.get("segments"):
            words = [
                word
                for segment in data["segments"]
                for word in segment.get("words", [])
            ]

    captions = [
        to_caption(word, index)
        for index, word in enumerate(words)
        if (word.get("text") or word.get("word") or "").strip()
    ]
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    Path(output_path).write_text(
        json.dumps(captions, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return len(captions)


def run_whisper(video_path, output_path, model, language):
    temp_dir = Path(output_path).parent / "_whisper_raw"
    temp_dir.mkdir(parents=True, exist_ok=True)
    command = [
        sys.executable,
        "-m",
        "whisper",
        str(video_path),
        "--model",
        model,
        "--language",
        language,
        "--word_timestamps",
        "True",
        "--output_format",
        "json",
        "--output_dir",
        str(temp_dir),
    ]
    subprocess.run(command, check=True)
    raw_json = temp_dir / f"{Path(video_path).stem}.json"
    if not raw_json.exists():
        raise FileNotFoundError(f"Whisper did not create {raw_json}")
    return convert_words_json(raw_json, output_path)


def main():
    parser = argparse.ArgumentParser(
        description="Generate Remotion captions JSON from Whisper or an existing words.json."
    )
    parser.add_argument("input", help="Video/audio file or existing words.json")
    parser.add_argument(
        "--output",
        default=str(Path("public") / "captions.json"),
        help="Output captions JSON path",
    )
    parser.add_argument("--model", default="base", help="OpenAI Whisper model")
    parser.add_argument("--language", default="Portuguese", help="Whisper language")
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    if input_path.suffix.lower() == ".json":
        count = convert_words_json(input_path, output_path)
    else:
        count = run_whisper(input_path, output_path, args.model, args.language)

    print(f"Wrote {count} captions to {output_path}")


if __name__ == "__main__":
    os.chdir(Path(__file__).resolve().parents[1])
    main()
