# -*- coding: utf-8 -*-
"""NEW HAIR - MEDIDOR DE OLHAR (pecas de camera)

Mede, quadro a quadro, se a pessoa esta OLHANDO PRA CAMERA.
Devolve duas medidas por instante:
  giro  = quanto a cabeca esta virada (nariz fora do meio dos olhos)
  olho  = quanto a iris esta deslocada dentro do olho (olhar de lado sem virar
          a cabeca, que e o que acontece quando ela le o texto)
Nao decide nada: so mede. O corte e decidido depois, olhando a distribuicao.
"""
import os, subprocess, sys, json
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python as mpp
from mediapipe.tasks.python import vision

# baixe uma vez:
#   curl -L -o face_landmarker.task https://storage.googleapis.com/mediapipe-models/\
# face_landmarker/face_landmarker/float16/1/face_landmarker.task
MODELO = os.environ.get("FACE_LANDMARKER", "face_landmarker.task")
L, A = 360, 640
FPS = 10

def medir(video):
    proc = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-i", video, "-vf", "fps=%d,scale=%d:%d" % (FPS, L, A),
         "-pix_fmt", "rgb24", "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
    opt = vision.FaceLandmarkerOptions(
        base_options=mpp.BaseOptions(model_asset_path=MODELO),
        running_mode=vision.RunningMode.VIDEO, num_faces=1)
    det = vision.FaceLandmarker.create_from_options(opt)
    n = L * A * 3
    saida = []
    k = 0
    while True:
        buf = proc.stdout.read(n)
        if len(buf) < n:
            break
        img = mp.Image(image_format=mp.ImageFormat.SRGB,
                       data=np.frombuffer(buf, np.uint8).reshape(A, L, 3).copy())
        r = det.detect_for_video(img, int(k * 1000 / FPS))
        t = k / float(FPS)
        k += 1
        if not r.face_landmarks:
            saida.append({"t": round(t, 2), "rosto": False})
            continue
        p = r.face_landmarks[0]
        def xy(i):
            return (p[i].x * L, p[i].y * A)
        ox, _ = xy(33)     # canto externo do olho esquerdo (na imagem)
        ix, _ = xy(133)    # canto interno
        ox2, _ = xy(263)   # canto externo do olho direito
        ix2, _ = xy(362)   # canto interno
        nx, ny = xy(1)     # ponta do nariz
        meio_olhos = (ox + ox2) / 2.0
        dist_olhos = abs(ox2 - ox) or 1.0
        giro = (nx - meio_olhos) / dist_olhos

        # iris: 468-472 (esq) e 473-477 (dir). O modelo base tem 478 pontos.
        if len(p) >= 478:
            irx, _ = xy(468)
            irx2, _ = xy(473)
            ce, ce2 = (ox + ix) / 2.0, (ox2 + ix2) / 2.0
            we, we2 = abs(ix - ox) or 1.0, abs(ox2 - ix2) or 1.0
            olho = ((irx - ce) / we + (irx2 - ce2) / we2) / 2.0
        else:
            olho = 0.0
        saida.append({"t": round(t, 2), "rosto": True,
                      "giro": round(giro, 4), "olho": round(olho, 4)})
    proc.stdout.close(); proc.wait()
    return saida

for v in sys.argv[1:]:
    d = medir(v)
    dest = v.rsplit("/", 1)[-1].rsplit(".", 1)[0] + "_olhar.json"
    os.path.isdir("olhar") or os.makedirs("olhar")
    json.dump(d, open("olhar/" + dest, "w"))
    com = [x for x in d if x["rosto"]]
    g = sorted(x["giro"] for x in com); o = sorted(x["olho"] for x in com)
    def pct(v, q): return v[int(len(v) * q)] if v else 0
    print("%-16s %d quadros, %d com rosto" % (v.rsplit('/',1)[-1], len(d), len(com)))
    print("   giro  p05 %.3f  p25 %.3f  mediana %.3f  p75 %.3f  p95 %.3f"
          % (pct(g,.05), pct(g,.25), pct(g,.5), pct(g,.75), pct(g,.95)))
    print("   olho  p05 %.3f  p25 %.3f  mediana %.3f  p75 %.3f  p95 %.3f"
          % (pct(o,.05), pct(o,.25), pct(o,.5), pct(o,.75), pct(o,.95)))
