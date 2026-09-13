# -*- coding: utf-8 -*-
"""
TRANSCRITOR — fala em português com tempo POR PALAVRA

O manual (§02) pede transcrição com palavras e tempos, e avisa que ASR contínuo
já omitiu retomada e esticou palavra. Por isso este script:

  · usa faster-whisper (CTranslate2), modelo medium em int8 no CPU, que foi o
    que o fluxo de referência usou;
  · liga word_timestamps, senão não dá pra cortar na consoante certa;
  · NÃO usa condition_on_previous_text — é justamente o que faz o modelo
    "consertar" a fala e engolir a tentativa repetida que a gente precisa ver;
  · guarda a probabilidade de cada palavra, pra dar pra desconfiar do trecho
    fraco em vez de acreditar cego.

Uso:
    python3 scripts/transcrever.py <arquivo> [--saida nome.json] [--modelo medium]

Saída: JSON com segmentos e palavras {texto, inicio, fim, prob}, mais um TXT
de leitura rápida ao lado.

LIMITE QUE NÃO SE ESQUECE: isto é máquina lendo som. Não substitui conferir a
mídia. Trecho duvidoso (prob baixa, palavra colada na outra, corte suspeito) se
reanalisa ouvindo/olhando o pedaço, como o manual manda.
"""

import argparse
import json
import os
import subprocess
import sys
import tempfile

def extrair_audio(entrada: str) -> str:
    """16 kHz mono é o que o modelo quer; converter antes evita surpresa."""
    saida = os.path.join(tempfile.mkdtemp(), "audio.wav")
    cmd = ["ffmpeg", "-nostdin", "-y", "-v", "error", "-i", entrada,
           "-vn", "-ac", "1", "-ar", "16000", "-f", "wav", saida]
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode != 0 or not os.path.exists(saida):
        sys.exit("ffmpeg nao extraiu audio: %s" % r.stderr.decode("utf-8", "ignore")[:400])
    return saida

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("entrada")
    ap.add_argument("--saida", default=None)
    ap.add_argument("--modelo", default="medium")
    ap.add_argument("--idioma", default="pt")
    ap.add_argument("--threads", type=int, default=4)
    ap.add_argument("--prompt", default=None,
                    help="vocabulario do assunto; o padrao ja traz o do capilar")
    a = ap.parse_args()

    from faster_whisper import WhisperModel

    # Vocabulario do assunto. O manual (§02) manda conferir termos como
    # foliculo, instrumentacao, implanter e pinca — e o teste de 13/09 mostrou
    # por que: sem isto o modelo escreveu "testerizada" no lugar de
    # "terceirizada" e "Mético" no lugar de "Médico", logo no gancho.
    VOCABULARIO = (
        "Transcrição de vídeo sobre tricologia e transplante capilar. "
        "Termos: New Hair, Fabrícia Satza, folículo, folicular, graft, enxerto, "
        "instrumentação, implanter, pinça, extração, FUE, receptora, doadora, "
        "tricoscopia, alopecia, anágena, telógena, minoxidil, terceirizada, "
        "equipe terceirizada, médico, cirurgia, protocolo, queda capilar."
    )

    wav = extrair_audio(a.entrada)
    modelo = WhisperModel(a.modelo, device="cpu", compute_type="int8",
                          cpu_threads=a.threads)

    segmentos, info = modelo.transcribe(
        wav,
        language=a.idioma,
        word_timestamps=True,
        condition_on_previous_text=False,  # ver cabecalho
        vad_filter=False,                  # o silencio tambem e informacao aqui
        beam_size=5,
        initial_prompt=a.prompt or VOCABULARIO,
    )

    saida = a.saida or (os.path.splitext(a.entrada)[0] + ".transcricao.json")
    dados = {"arquivo": a.entrada, "modelo": a.modelo,
             "duracao": round(info.duration, 3), "segmentos": []}
    linhas = []
    for s in segmentos:
        seg = {"inicio": round(s.start, 3), "fim": round(s.end, 3),
               "texto": s.text.strip(), "palavras": []}
        for w in (s.words or []):
            seg["palavras"].append({
                "texto": w.word.strip(),
                "inicio": round(w.start, 3),
                "fim": round(w.end, 3),
                "prob": round(w.probability, 3),
            })
        dados["segmentos"].append(seg)
        linhas.append("[%7.3f -> %7.3f] %s" % (seg["inicio"], seg["fim"], seg["texto"]))
        print(linhas[-1])

    with open(saida, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=1)
    txt = os.path.splitext(saida)[0] + ".txt"
    with open(txt, "w", encoding="utf-8") as f:
        f.write("\n".join(linhas) + "\n")

    n = sum(len(s["palavras"]) for s in dados["segmentos"])
    fracas = [w for s in dados["segmentos"] for w in s["palavras"] if w["prob"] < 0.5]
    print("\n%d segmentos, %d palavras. %d palavra(s) com prob < 0,5 — conferir na midia."
          % (len(dados["segmentos"]), n, len(fracas)))
    for w in fracas[:15]:
        print("   %.3f  %-20s prob %.2f" % (w["inicio"], w["texto"], w["prob"]))
    print("\njson: %s\ntxt : %s" % (saida, txt))

if __name__ == "__main__":
    main()
