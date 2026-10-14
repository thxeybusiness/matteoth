"""Dérive la photo de profil et les favicons d'UN seul fichier source.

La source (assets/_source-profil.png) est la photo envoyée par Matteo,
en portrait. Deux cadrages carrés en sortent, et pas un seul :

- la PHOTO DE PROFIL garde la scène — le visage éclairé par le téléphone,
  dans le bleu de la pièce. C'est elle qui donne l'ambiance de la page ;
- les FAVICONS serrent sur le visage. À 32 px dans un onglet, la scène
  entière ne rend qu'une tache bleue : seul un visage s'y reconnaît encore.

Les cadres sont en fractions de la largeur et de la hauteur de la source
(centre x, centre y, côté rapporté à la largeur), relevés sur cette photo.
Une autre photo demande de les reprendre.

    python3 scripts/marque.py
"""
from pathlib import Path
from PIL import Image, ImageDraw

RACINE = Path(__file__).resolve().parent.parent
SOURCE = RACINE / "assets" / "_source-profil.png"

CADRE_PROFIL = (0.50, 0.57, 0.62)   # visage, mains et téléphone
CADRE_ICONE = (0.53, 0.45, 0.36)    # le visage seul


def recadre(im, cadre):
    w, h = im.size
    cx, cy, cote = cadre[0] * w, cadre[1] * h, cadre[2] * w
    demi = cote / 2
    return im.crop((round(cx - demi), round(cy - demi), round(cx + demi), round(cy + demi)))


def rond(im, taille):
    """Icône ronde à fond transparent. Le masque est tracé à 4× puis réduit :
    tracé à la taille finale, le bord d'un disque de 32 px crénelle."""
    grand = im.resize((taille * 4, taille * 4), Image.LANCZOS)
    masque = Image.new("L", grand.size, 0)
    ImageDraw.Draw(masque).ellipse((0, 0, *grand.size), fill=255)
    grand.putalpha(masque)
    return grand.resize((taille, taille), Image.LANCZOS)


def main():
    im = Image.open(SOURCE).convert("RGB")
    profil = recadre(im, CADRE_PROFIL)
    icone = recadre(im, CADRE_ICONE)

    profil.resize((240, 240), Image.LANCZOS).save(RACINE / "assets" / "profil.jpg", quality=86, optimize=True, progressive=True)
    for t in (32, 192, 512):
        rond(icone, t).save(RACINE / "assets" / f"favicon-{t}.png", optimize=True)
    # iOS remplit la transparence en NOIR et arrondit lui-même les angles :
    # l'icône d'écran d'accueil est donc carrée et opaque.
    icone.resize((180, 180), Image.LANCZOS).save(RACINE / "apple-touch-icon.png", optimize=True)


if __name__ == "__main__":
    main()
