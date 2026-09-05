#!/usr/bin/env python3
"""Monta os templates HTML da marca, com as fontes embutidas em base64.

Embutir deixa o arquivo com ~90KB a mais, mas o torna autossuficiente: ela abre
no navegador de qualquer maquina, sem instalar fonte e sem internet. Como o
arquivo circula por WhatsApp e Drive, isso vale muito mais que os KB.

Uso:  python3 montar.py [pasta-de-saida]
"""
import base64
import pathlib
import sys

AQUI = pathlib.Path(__file__).resolve().parent
SKILL = AQUI.parent
FONTES = SKILL / "assets" / "fontes"
SAIDA = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else SKILL / "assets"

FACES = [
    ("Fabricia Satza", 300, "FabriciaSatzaLight-Regular.woff2"),
    ("Fabricia Satza", 500, "FabriciaSatzaMedium-Regular.woff2"),
    ("Fabricia Satza Alt", 300, "FabriciaSatzaLightAlt-Regular.woff2"),
]


def css_fontes() -> str:
    """@font-face para as tres faces, com o arquivo embutido.

    'Fabricia Satza' carrega 300 e 500 sob o MESMO nome de familia — e por isso
    que <b> pega o peso 500 sozinho, sem o navegador falsear negrito (que
    engrossaria a letra e estragaria o desenho)."""
    partes = ["/* Fabricia Satza — SIL OFL 1.1, derivada da Jost*. Licenca em"
              " assets/fontes/OFL.txt */"]
    for familia, peso, arquivo in FACES:
        b64 = base64.b64encode((FONTES / arquivo).read_bytes()).decode()
        partes.append(
            f"@font-face{{font-family:'{familia}';"
            f"src:url('data:font/woff2;base64,{b64}') format('woff2');"
            f"font-weight:{peso};font-style:normal;font-display:block}}"
        )
    return "\n".join(partes)


def ler(nome: str) -> str:
    return (AQUI / nome).read_text(encoding="utf-8")


EXPORT_JS = """
async function baixar(){
  const bar=document.querySelector('.dl');
  const slides=document.querySelectorAll('.slide');
  const zip=new JSZip();
  const slug='satza-'+document.title.replace(/.*\\u2014 /,'').trim().toLowerCase()
              .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  bar.style.pointerEvents='none';
  // html2canvas mede o texto com a fonte que estiver valendo NA HORA. Sem esta
  // espera ele mede com a fonte de fallback e o layout sai deslocado.
  if(document.fonts&&document.fonts.ready) await document.fonts.ready;
  for(let i=0;i<slides.length;i++){
    bar.textContent='Renderizando '+(i+1)+' de '+slides.length+'...';
    bar.style.display='none';
    const canvas=await html2canvas(slides[i],{scale:2,useCORS:true,allowTaint:true,
      logging:false,backgroundColor:getComputedStyle(slides[i]).backgroundColor});
    bar.style.display='block';
    const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));
    zip.file(slug+'-'+String(i+1).padStart(2,'0')+'.png',blob);
  }
  bar.textContent='Empacotando...';
  const a=document.createElement('a');
  a.download=slug+'.zip';
  a.href=URL.createObjectURL(await zip.generateAsync({type:'blob'}));
  a.click();
  bar.textContent='\\u2713 ZIP baixado';
  setTimeout(()=>{bar.textContent='\\u2193 Baixar ZIP';bar.style.pointerEvents='auto'},3000);
}
"""

CDN = (
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/'
    'html2canvas.min.js"></script>\n'
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/'
    'jszip.min.js"></script>'
)


def pagina(titulo: str, css_extra: str, corpo: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>{titulo}</title>
{CDN}
<style>
{css_fontes()}
{ler('base.css')}{css_extra}
</style>
</head>
<body>
<div class="dl" onclick="baixar()">&#8595; Baixar ZIP</div>
{corpo}
<script>{EXPORT_JS}</script>
</body>
</html>
"""


def main() -> None:
    SAIDA.mkdir(parents=True, exist_ok=True)
    alvos = [
        ("carrossel.html", "@fabriciasatza — {{TEMA}}",
         ler("blocos.css"), ler("corpo-carrossel.html")),
        ("antes-depois.html", "@fabriciasatza — antes e depois {{CASO}}",
         ler("blocos.css") + ler("antes-depois.css"), ler("corpo-antes-depois.html")),
    ]
    for nome, titulo, css, corpo in alvos:
        destino = SAIDA / nome
        destino.write_text(pagina(titulo, css, corpo), encoding="utf-8")
        print(f"{destino}  ({destino.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
