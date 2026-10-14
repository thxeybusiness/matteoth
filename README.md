# matteoth.com

Site servi en statique par Vercel sur `matteoth.com` (`www`
redirige en 308). Aucun cadre, aucune dépendance, aucune étape de build :
les fichiers du dépôt sont ce que le navigateur reçoit. Gamme bleu et noir
reprise de simonbsns.com.

```
index.html          la page d'attente « Le site arrive. » (style inclus)
assets/fonts.css    General Sans et Satoshi, servies par le site
assets/favicon.svg  monogramme provisoire
vercel.json         URL propres + en-têtes de sécurité et de cache
```

Pour l'instant le site est **volontairement vide** (consigne du
propriétaire) : une seule ligne, sur fond noir et horizon bleu.


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
