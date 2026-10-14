# matteoth.com

Site servi en statique par Vercel sur `matteoth.com` (`www`
redirige en 308). Aucun cadre, aucune dépendance, aucune étape de build :
les fichiers du dépôt sont ce que le navigateur reçoit. Gamme bleu et noir
reprise de simonbsns.com.

```
index.html          la page d'attente « Le site arrive. » (style inclus)
assets/fonts.css    General Sans et Satoshi, servies par le site
assets/profil.jpg   la photo de profil de l'accueil
assets/favicon-*.png  favicons ronds (32, 192, 512)
apple-touch-icon.png  icône d'écran d'accueil iOS — SERVIE À LA RACINE :
                      Safari la demande sans lire le HTML
assets/_source-profil.png  la photo envoyée, source de TOUTE la marque
scripts/marque.py   en dérive la photo et les favicons
vercel.json         URL propres + en-têtes de sécurité et de cache
```

Pour l'instant le site est **volontairement vide** (consigne du
propriétaire) : la photo, une ligne, sur fond noir et horizon bleu.

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
