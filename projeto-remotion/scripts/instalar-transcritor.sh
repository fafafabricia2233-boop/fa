#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# INSTALAR O TRANSCRITOR
#
# Roda UMA VEZ POR SESSÃO. O container é efêmero: pacote instalado e modelo
# baixado somem quando a máquina é reciclada. Não dá pra versionar o modelo no
# repositório — são 1,5 GB.
#
# O que instala:
#   faster-whisper (CTranslate2) + modelo medium em int8 no CPU, que é o que o
#   fluxo de referência da New Hair usou (§02 do manual).
#
# Custo medido em 13/09/2026, 4 threads: ~27 s pra 24 s de áudio. Ou seja, mais
# ou menos tempo real — um bruto de 5 minutos leva uns 5 a 6 minutos.
#
# Uso:  bash scripts/instalar-transcritor.sh
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

MODELO="${1:-medium}"

echo "== ffmpeg"
if ! command -v ffmpeg >/dev/null; then
  apt-get update -qq && apt-get install -y -qq ffmpeg
fi
ffmpeg -version | head -1

echo "== faster-whisper"
pip install --quiet faster-whisper
python3 - <<PY
import faster_whisper, ctranslate2
print("faster-whisper", getattr(faster_whisper, "__version__", "ok"), "| ctranslate2", ctranslate2.__version__)
PY

echo "== baixando/aquecendo o modelo $MODELO (int8, cpu)"
python3 - <<PY
from faster_whisper import WhisperModel
WhisperModel("$MODELO", device="cpu", compute_type="int8", cpu_threads=4)
print("modelo pronto")
PY

echo
echo "pronto. transcrever com:"
echo "  python3 scripts/transcrever.py <arquivo.mov>"
