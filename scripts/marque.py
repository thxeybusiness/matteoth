"""Dérive la photo de profil et les favicons d'UN seul fichier source.

La source (assets/_source-profil.png) est la photo envoyée par Matteo : un
disque photo posé sur un halo bleu. Le halo est retiré — gardé, il ferait une
bague bleue autour de l'icône, puis une seconde autour de la pastille que le
CSS dessine déjà. On ne garde que l'intérieur du disque, un peu en retrait du
bord pour ne pas emporter le liseré flou du halo.

    python3 scripts/marque.py
"""
from pathlib import Path
from PIL import Image, ImageDraw

RACINE = Path(__file__).resolve().parent.parent
SOURCE = RACINE / "assets" / "_source-profil.png"
FOND = (2, 3, 10)  # --bg : les icônes opaques se posent sur le noir du site


def bleu(p):
    r, g, b = p[:3]
    return b > r + 40 and b > g + 30 and r < 60


def disque(im):
    """Repère le disque photo : il commence où le bleu dominant s'arrête.
    Mesuré et non saisi à la main, pour qu'une nouvelle photo de même
    facture passe sans retoucher ce fichier."""
    w, h = im.size
    milieu_y, milieu_x = h // 2, w // 2
    xs = [x for x in range(w) if not bleu(im.getpixel((x, milieu_y)))]
    ys = [y for y in range(h) if not bleu(im.getpixel((milieu_x, y)))]
    cx, cy = (xs[0] + xs[-1]) / 2, (ys[0] + ys[-1]) / 2
    r = min(xs[-1] - xs[0], ys[-1] - ys[0]) / 2
    return cx, cy, r * 0.97  # 3 % de retrait : le bord du halo est flou


def carre(im, cx, cy, r):
    return im.crop((round(cx - r), round(cy - r), round(cx + r), round(cy + r)))


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
    cx, cy, r = disque(im)
    photo = carre(im, cx, cy, r)

    photo.resize((240, 240), Image.LANCZOS).save(RACINE / "assets" / "profil.jpg", quality=86, optimize=True, progressive=True)
    for t in (32, 192, 512):
        rond(photo, t).save(RACINE / "assets" / f"favicon-{t}.png", optimize=True)
    # iOS remplit la transparence en NOIR et arrondit lui-même les angles :
    # l'icône d'écran d'accueil est donc carrée et opaque, photo pleine.
    photo.resize((180, 180), Image.LANCZOS).save(RACINE / "apple-touch-icon.png", optimize=True)
    print(f"disque : centre ({cx:.0f}, {cy:.0f}), rayon {r:.0f}")


if __name__ == "__main__":
    main()
