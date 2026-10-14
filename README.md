# matteoth.com

Site d'une page, servi en statique par Vercel sur `matteoth.com` (`www`
redirige en 308). Aucun cadre, aucune dépendance, aucune étape de build :
les fichiers du dépôt sont ce que le navigateur reçoit. Base reprise de
simonbsns.com.

```
index.html          l'accueil
assets/style.css    la feuille de style (reprise de simonbsns, + ajouts en fin)
assets/fonts.css    General Sans et Satoshi, servies par le site
assets/favicon.svg  monogramme provisoire, en attendant une photo
vercel.json         URL propres + en-têtes de sécurité et de cache
```

## Ce qui reste à remplir

Chaque emplacement est repéré par `[À COMPLÉTER]` dans `index.html` :

| Bloc | Ce qu'il manque |
| --- | --- |
| Titre, description, aperçu de lien | ce que fait Matteo, en une phrase |
| Pastille de marque | la photo de profil (`assets/profil.jpg`) |
| Accroche | la vraie phrase d'accroche |
| Ce que je propose | les offres / services |
| FAQ | les vraies questions |
| Contact | Instagram ou autre lien — **aucun n'est en ligne** |
| Mentions légales | l'identité de l'éditeur (obligatoire, LCEN) |

## Travailler en local

```bash
python3 -m http.server 4000   # puis http://localhost:4000
```

## Déployer

Vercel construit `main` et sert le résultat sur `matteoth.com`. Vérifier ce
qui est réellement servi :

```bash
curl -sI https://matteoth.com/ | grep -i '^x-vercel-id'
```
