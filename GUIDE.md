# 📖 Guide d'utilisation – Site TCI Bâtiment

## 📁 Structure du projet

```
tci_web/
├── index.html              ← Page principale (ne pas renommer)
├── styles.css              ← Feuille de style
├── script.js               ← Comportements interactifs
└── assets/
    ├── logo.svg            ← Logo provisoire (à remplacer)
    ├── projects/           ← Photos de chantiers
    │   ├── project1.jpg
    │   ├── project2.jpg
    │   └── ...
    └── partners/           ← Logos des partenaires
        ├── partner1.jpg
        └── ...
```

---

## 🖼️ Remplacer le logo

1. Copiez votre fichier logo dans `assets/`
2. Nommez-le **`logo.png`** (ou `logo.svg`)
3. Dans `index.html`, cherchez `assets/logo.svg` (2 occurrences) et remplacez par `assets/logo.png`
4. Rafraîchissez le navigateur → le vrai logo s'affiche automatiquement

---

## ➕ Ajouter une nouvelle photo de projet

### Étape 1 – Déposer la photo
Copiez votre image dans `assets/projects/` — ex : `project7.jpg`

### Étape 2 – Ajouter la carte dans index.html

Dans `index.html`, repérez le commentaire `<!-- ══ GALERIE -->` (ligne ~197),
puis copiez-collez ce bloc **avant** `<!-- ══ FIN GALERIE -->` :

```html
<article class="project-card" data-title="Titre du projet" id="project-card-7">
  <img src="assets/projects/project7.jpg" alt="Description courte" loading="lazy" />
  <div class="project-overlay">
    <div class="project-info">
      <span class="project-tag">Résidentiel</span>   <!-- ou Industriel, Commercial... -->
      <h3>Nom du projet</h3>
      <p>Courte description</p>
    </div>
  </div>
</article>
```

**C'est tout !** Pas besoin de toucher au CSS.

> **Tip :** Pour la première carte (project1), elle est plus grande (2 colonnes).  
> Les suivantes sont en grille automatique 3 colonnes.

---

## 🤝 Ajouter un partenaire

### Étape 1 – Déposer le logo
Copiez le logo dans `assets/partners/` — ex : `partenaire-dupont.jpg`

### Étape 2 – Ajouter la carte dans index.html

Dans `index.html`, repérez `<!-- ══ PARTENAIRES -->` (ligne ~293).

**Remplacez un bloc placeholder** (ex: `id="partner-card-1"`) par votre vrai logo :

```html
<div class="partner-card" id="partner-card-1" title="Nom du partenaire">
  <div class="partner-logo-placeholder">
    <img src="assets/partners/partenaire-dupont.jpg" alt="Dupont Construction" />
  </div>
</div>
```

> ⚠️ Copiez le bloc dans les **deux** sections (la liste principale ET les doublons pour l'animation infinie).

---

## 📞 Modifier les informations de contact

Dans `index.html`, cherchez `À renseigner` pour :
- **Téléphone** → remplacez par votre numéro
- **Adresse** → remplacez par votre adresse

```html
<!-- Téléphone (ligne ~406) -->
<div class="contact-detail">
  ...
  +33 1 23 45 67 89   ← remplacez ici
</div>

<!-- Adresse (ligne ~411) -->
<div class="contact-detail">
  ...
  12 rue de la Construction, 69000 Lyon   ← remplacez ici
</div>
```

---

## 📊 Modifier les chiffres clés (Hero)

Dans `index.html`, cherchez `data-count` :

```html
<span data-count="15" data-suffix="+">0+</span>   ← Années d'expérience
<span data-count="280" data-suffix="+">0+</span>  ← Projets réalisés
<span data-count="98" data-suffix="%">0%</span>   ← Clients satisfaits
<span data-count="40" data-suffix="+">0+</span>   ← Partenaires
```

Modifiez simplement la valeur de `data-count`.

---

## 🌐 Mettre en ligne (hébergement)

Ce site est **100% statique** : aucun serveur requis.

### Options recommandées :
| Service | Prix | URL |
|---------|------|-----|
| **OVH Web Hosting** | ~3€/mois | ovhcloud.com |
| **Infomaniak** | ~3€/mois | infomaniak.com |
| **Netlify** | Gratuit | netlify.com |
| **GitHub Pages** | Gratuit | github.com |

Pour OVH/Infomaniak : uploadez tout le dossier `tci_web/` via FTP.

---

## ✉️ Formulaire de contact

Le formulaire ouvre le client email de l'utilisateur (Outlook, etc.)  
avec le message pré-rempli à envoyer à **contact@tci-batiment.fr**.

> Pour un envoi automatique sans client email, il faudrait un service tiers
> comme **Formspree** (gratuit) ou **EmailJS** — demandez si vous souhaitez cette évolution.

---

*Site créé avec HTML/CSS/JS vanilla — compatible tous navigateurs modernes.*
