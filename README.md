# matteoth.com

Site servi en statique par Vercel sur `matteoth.com` (`www`
redirige en 308). Aucun cadre, aucune dépendance, aucune étape de build :
les fichiers du dépôt sont ce que le navigateur reçoit. Gamme bleu et noir
reprise de simonbsns.com.

```
index.html          l'accueil : la photo et « Le site arrive. »
mrr/index.html      LE MRR : les trois formations, CFS, JDS et CLM
aulne/index.html    AULNE : l'offre d'accompagnement en branding, reprise
                    de la plateforme de marque d'Aulne, DANS LA CHARTE D'AULNE
aulne/aulne.css     la charte d'Aulne : Crème, Marine, Bleu ; Unbounded, Figtree
aulne/fonts/        Unbounded et Figtree, servies par le site
aulne/assets/       le motif des cernes, tiré du livre de marque
assets/site.css     la feuille commune à l'accueil et à /mrr
assets/fonts.css    General Sans et Satoshi, servies par le site
assets/profil.jpg   la photo de profil de l'accueil
assets/favicon-*.png  favicons ronds (32, 192, 512)
apple-touch-icon.png  icône d'écran d'accueil iOS — SERVIE À LA RACINE :
                      Safari la demande sans lire le HTML
assets/_source-profil.png  la photo envoyée, source de TOUTE la marque
scripts/marque.py   en dérive la photo (scène) et les favicons (visage serré)
vercel.json         URL propres + en-têtes de sécurité et de cache
```

Trois pages, reliées par la même barre : **Accueil · MRR · Aulne**.

- **Accueil** reste volontairement vide (consigne du propriétaire) : la photo
  et une ligne.
- **MRR** : trois formations, telles que Matteo les a données.

  | Formation | Pour qui | En une fois | En deux fois |
  | --- | --- | --- | --- |
  | CFS | commencer, petit budget | 35 € | — |
  | JDS | développer, budget moyen | 127 € | 2 × 64 € (128 €, voulu) |
  | CLM | développer et scale, budget plus haut | 300 € | 2 × 150 € |

  Le paiement en deux fois vit sur la carte de sa formation, pas dans une
  carte à part. Les liens d'achat sont coupés à l'adresse du produit (sans
  fbclid ni utm d'Instagram). **Ils n'ont pas pu être vérifiés depuis le
  conteneur** : mtodigit.store y répond 404 à tout, page d'accueil
  comprise. À cliquer une fois chacun sur le site en ligne.
- **Aulne** est dans la DA d'Aulne, pas dans celle du site : c'est une
  marque à part, avec son livre de marque. Le logo (emblème + mot) est
  recopié tel quel de la « Charte Aulne », jamais recomposé. Le texte reprend
  la plateforme de marque : ce qu'est Aulne, pour
  qui, les cinq offres, la différence, les valeurs, le nom. Ni prix ni
  contact, que la plateforme ne fixe pas encore. Promesse et signature y
  sont « à valider » : les changer ici aussi si elles bougent.

En local, `/mrr` s'ouvre par `/mrr/` (pas de `cleanUrls` dans le serveur
Python) ; en ligne les deux fonctionnent.

## La marque

Tout vient de `assets/_source-profil.png`. Après l'avoir remplacée :

```bash
python3 scripts/marque.py
```

puis incrémenter le `?v=` des icônes et de la photo dans `index.html` : les
fichiers changent sous la même adresse, et sans ça un onglet garde l'icône
qu'il connaît déjà.


## Travailler en local

```bash
python3 -m http.server 4000   # puis http://localhost:4000
```

## Déployer

Vercel construit la branche par défaut du dépôt et sert le résultat sur `matteoth.com`. Vérifier ce
qui est réellement servi :

```bash
curl -sI https://matteoth.com/ | grep -i '^x-vercel-id'
```
