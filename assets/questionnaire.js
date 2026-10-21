// QUESTIONNAIRE — commun à l'accueil et à /mrr.
//
// Pas de serveur, et c'est un choix : les réponses composent un message que
// la personne envoie elle-même à Matteo sur Instagram. Rien n'est stocké,
// rien ne transite par un tiers. La contrepartie : une réponse n'arrive que
// si la personne envoie vraiment le message — d'où le bouton « copier ».
(function () {
  var form = document.getElementById("qualif");
  if (!form) return;
  var etat = document.getElementById("etat");
  var copier = document.getElementById("copier");
  var INSTA = "@oth.matteo";

  // CE QUE LE QUESTIONNAIRE PEUT CONSEILLER. Noms, prix et liens sont
  // RECOPIÉS de /mrr : changer un prix là-bas, c'est le changer ici aussi.
  // Les raisons reprennent les descriptions données par Matteo, rien de plus.
  var OFFRES = {
    cfs: { nom: "CFS", page: "/mrr#cfs",
      raison: "Des modules vidéo pour commencer un business en ligne avec un petit budget.",
      une: { prix: "35 €", achat: "https://mtodigit.store/shop/3e719a63-a5ea-4c37-821d-4d779d9768d3" } },
    jds: { nom: "JDS", page: "/mrr#jds",
      raison: "Des modules vidéo pour développer un business en ligne avec un budget moyen. Accompagnement offert.",
      // Consigne de Matteo : la JDS conseillée s'accompagne de la CFS offerte.
      offert: "+ CFS offerte",
      une:  { prix: "127 €", achat: "https://mtodigit.store/shop/c63ba0fb-502d-476b-ab03-996b086ca634" },
      deux: { prix: "2 × 64 €", achat: "https://mtodigit.store/shop/8eb7f9db-8e79-43b5-b6c3-3114b1f535b3" } },
    clm: { nom: "CLM", page: "/mrr#clm",
      raison: "Des modules vidéo pour développer ton business en ligne et scale, avec un budget plus haut. Accompagnement offert.",
      une:  { prix: "300 €", achat: "https://mtodigit.store/shop/95ce8405-564e-4250-8bbf-a395b533d876" },
      deux: { prix: "2 × 150 €", achat: "https://mtodigit.store/shop/93f2d0aa-79a2-4eda-8ba8-99dbb790da8d" } }
  };
  var MODES = { une: "En une fois", deux: "En deux fois" };
  // Un prix ne se coupe jamais : « 2 × / 150 € » sur deux lignes se lit mal.
  function insecable(t) { return t.replace(/ /g, "\u00a0"); }

  // ---- DÉVOILEMENT PAS À PAS ----
  //
  // Une étape répondue ouvre la suivante, et UNE SEULE : tout ouvrir d'un
  // coup ferait réapparaître six questions à qui revient avec un formulaire
  // pré-rempli par son navigateur. Une étape ouverte NE SE REFERME JAMAIS :
  // replier ce qu'on corrige ferait bouger la page sous les doigts.
  var etapes = [].slice.call(form.querySelectorAll("[data-etape]"));
  var compteur = document.getElementById("progres");
  var TOTAL = etapes.filter(function (e) { return e.classList.contains("champ"); }).length;

  function repondue(etape) {
    var radios = etape.querySelectorAll('input[type="radio"]');
    if (radios.length) return [].slice.call(radios).some(function (r) { return r.checked; });
    var saisie = etape.querySelector(".saisie");
    return !!(saisie && saisie.value.trim());
  }

  function avancer() {
    for (var i = 0; i < etapes.length; i++) {
      if (!etapes[i].classList.contains("ouverte")) return;
      if (!repondue(etapes[i])) return;
      var suivante = etapes[i + 1];
      if (!suivante || suivante.classList.contains("ouverte")) continue;
      suivante.classList.add("ouverte");
      // La dernière question (l'objectif) se laisse vide : elle ne peut donc
      // pas commander l'envoi, et ouvre les boutons en même temps qu'elle.
      if (suivante.classList.contains("champ") && etapes[i + 2]
          && !etapes[i + 2].classList.contains("champ")) {
        etapes[i + 2].classList.add("ouverte");
      }
    }
  }

  function compter() {
    var ouvertes = etapes.filter(function (e) {
      return e.classList.contains("champ") && e.classList.contains("ouverte");
    }).length;
    compteur.textContent = "Question " + Math.min(ouvertes, TOTAL) + " sur " + TOTAL;
  }

  // ---- ORIENTATION ----
  // La règle est dans les tranches de budget : data-offre liste les
  // formations conseillées, dans l'ordre où on les montre.
  var orientation = document.getElementById("orientation");

  function conseil() {
    var coche = form.querySelector('[name="budget"]:checked');
    if (!coche) return [];
    return (coche.getAttribute("data-offre") || "").split(" ")
      .filter(function (k) { return OFFRES[k]; });
  }

  function el(balise, classe, texte) {
    var e = document.createElement(balise);
    if (classe) e.className = classe;
    if (texte) e.textContent = texte;
    return e;
  }

  function lien(href, texte, classe, dehors) {
    var a = el("a", classe, texte);
    a.href = href;
    if (dehors) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }

  // Une carte par formation conseillée, avec TOUTES ses façons de payer :
  // les bornes des tranches sont les prix entiers, donc chaque prix proposé
  // tient dans le budget coché.
  function carte(cle, premiere) {
    var o = OFFRES[cle], c = el("div", "o-offre");
    var modes = ["une", "deux"].filter(function (m) { return o[m]; });
    c.appendChild(el("p", "orientation-titre", o.nom));
    c.appendChild(el("p", "orientation-prix",
      modes.map(function (m) { return insecable(o[m].prix); }).join(" ou ")));
    if (o.offert) c.appendChild(el("p", "orientation-offert", o.offert));
    c.appendChild(el("p", "orientation-raison", o.raison));
    var liens = el("div", "orientation-liens");
    modes.forEach(function (m, i) {
      liens.appendChild(lien(o[m].achat, MODES[m] + " · " + insecable(o[m].prix),
        premiere && i === 0 ? "acheter" : "cta-sobre", true));
    });
    liens.appendChild(lien(o.page, "Voir le détail", "orientation-detail"));
    c.appendChild(liens);
    return c;
  }

  // Même condition que les boutons d'envoi : aucun des deux sans l'autre.
  function orienter() {
    var fin = form.querySelector(".envoi[data-etape]");
    if (!fin || !fin.classList.contains("ouverte")) return;
    var cles = conseil(), boite = document.getElementById("o-offres");
    boite.textContent = "";
    if (cles.length) {
      cles.forEach(function (k, i) { boite.appendChild(carte(k, i === 0)); });
    } else {
      boite.appendChild(el("p", "orientation-titre", "Il me manque une réponse"));
      boite.appendChild(el("p", "orientation-raison", "Choisis ton budget plus haut : je te dis quelles formations prendre."));
    }
    orientation.hidden = false;
  }

  function maj() { avancer(); compter(); orienter(); }
  // input couvre la frappe ET le remplissage automatique ; change couvre les
  // boutons radio, qui n'émettent pas input partout.
  form.addEventListener("input", maj);
  form.addEventListener("change", maj);
  // Un formulaire restitué par le bouton Précédent arrive déjà rempli.
  maj();

  var QUESTIONS = [
    ["prenom", "Prénom"], ["budget", "Budget"], ["situation", "Situation"],
    ["besoin", "Besoin"], ["age", "Âge"], ["revenus", "Revenus actuels"],
    ["deja", "Déjà essayé"], ["objectif", "Objectif"]
  ];

  function reponses() {
    var d = new FormData(form);
    var lignes = QUESTIONS.map(function (q) {
      var v = (d.get(q[0]) || "").toString().trim();
      return v ? q[1] + " : " + v : null;
    }).filter(Boolean);
    // Matteo lit ce que le site a conseillé : sans cette ligne, il répondrait
    // sans savoir vers quelle formation la personne vient d'être envoyée.
    var cles = conseil();
    lignes.push("Conseil du site : " + (cles.length
      ? cles.map(function (k) { return OFFRES[k].nom; }).join(" et ")
      : "aucun"));
    return lignes;
  }

  // Deux champs seulement sont exigés : un questionnaire qui bloque sur sept
  // cases perd plus de monde qu'il n'en qualifie.
  function manquant() {
    var d = new FormData(form);
    if (!(d.get("prenom") || "").toString().trim()) return "ton prénom";
    if (!d.get("situation")) return "ta situation";
    return null;
  }

  function dire(texte) { etat.textContent = texte; }

  // Le presse-papier, avec son repli : l'API échoue dans les navigateurs
  // embarqués des applications sociales, d'où viennent ces visiteurs.
  // L'écriture est LANCÉE dans le geste, sans quoi le navigateur la refuse.
  function copierTexte(texte, fini) {
    var replier = function () {
      var z = document.createElement("textarea");
      z.value = texte;
      z.setAttribute("readonly", "");
      z.style.position = "fixed";
      z.style.opacity = "0";
      document.body.appendChild(z);
      z.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      document.body.removeChild(z);
      fini(ok);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texte).then(function () { fini(true); }).catch(replier);
    } else {
      replier();
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var quoi = manquant();
    if (quoi) {
      dire("Il me manque " + quoi + " pour savoir à qui je réponds.");
      (quoi === "ton prénom" ? document.getElementById("q-prenom") : document.getElementById("s1")).focus();
      return;
    }
    copierTexte("Voici où j'en suis :\n\n" + reponses().join("\n"), function (ok) {
      dire(ok
        ? "Tes réponses sont copiées. Colle-les en message à " + INSTA + " sur Instagram."
        : "Instagram s'ouvre. Je n'ai pas pu copier : recopie tes réponses en message.");
    });
    // Ouvert DANS le geste, sans attendre la copie : Safari bloque une
    // ouverture lancée depuis la promesse.
    document.getElementById("envoi-insta").click();
  });

  copier.addEventListener("click", function () {
    var quoi = manquant();
    if (quoi) { dire("Il me manque " + quoi + "."); return; }
    copierTexte(reponses().join("\n"), function (ok) {
      dire(ok
        ? "Copié. Colle-le en message à " + INSTA + " sur Instagram."
        : "Je n'ai pas pu copier : sélectionne tes réponses à la main.");
    });
  });
})();
