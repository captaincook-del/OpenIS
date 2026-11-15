# Architecture

## Arborescence

```
doc/                        documentation développeur (ce dossier)
public/favicon.svg
index.html                  titre, icône
uno.config.js               couleurs, polices, raccourcis de style
vite.config.js              plugins, contrôle des variables d'environnement au build
netlify.toml                build et en-têtes de sécurité
src/
├── main.js                 point d'entrée : styles, polices @fontsource, application
├── App.vue                 en-tête vert, avancement, pied de page, barre d'onglets sur téléphone
├── assets/base.css         styles globaux hors UnoCSS (boutons, fieldset, ancres)
├── router/index.js         routes (mode hash)
├── lib/                    code non visuel
│   ├── store.js            taille, niveau et langue choisis, partagés entre les pages
│   ├── catalog.js          charge les YAML, fusionne les langues, résout les valeurs, calcule la couverture
│   ├── budget.js           calcul du budget (page Budget et résumé du catalogue)
│   └── i18n.js             traduction de l'interface : t(), tg(), setLang()
├── views/                  une vue par route
│   ├── Home.vue            accueil : choix de la taille et du niveau
│   ├── Catalog.vue         catalogue
│   ├── Solutions.vue       liste des solutions
│   ├── SolutionPage.vue    fiche d'une solution
│   ├── Budget.vue          budget calculé depuis le catalogue
│   ├── About.vue           À propos : projet, échelle des niveaux, avancement par groupe
│   ├── Page.vue            Mentions légales (sections de texte)
│   └── Contact.vue         formulaire qui ouvre la messagerie (mailto)
├── components/             éléments réutilisés par les vues
│   ├── SolutionText.vue    texte avec liens automatiques vers les fiches
│   ├── SolutionChip.vue    badge cliquable « nom · licence »
│   ├── SolutionBadges.vue  badge de licence et labels
│   ├── BadgeLegend.vue     légende des badges
│   ├── RichText.vue        texte avec liens [texte](adresse) et jetons {email}
│   └── Icon.vue            icônes au trait
└── data/
    ├── shared/             commun aux langues
    │   ├── roadmap.yaml    domaines prévus, noms et groupes
    │   ├── solutions.yaml  registre des solutions : noms, lien, licence, labels
    │   └── pricing.yaml    volumes, multiplicateurs et formules du budget
    ├── fr/                 référence
    │   ├── site.yaml       niveaux et tailles
    │   ├── licences.yaml   familles de licences et labels
    │   ├── pricing.yaml    avertissement du budget
    │   ├── pages.yaml      À propos, Contact, Mentions légales
    │   ├── ui.yaml         phrases de l'interface
    │   ├── domains/        un fichier par domaine (01-virtualisation.yaml, …)
    │   └── solutions/      une fiche par solution (facultative)
    └── en/                 traduction anglaise, mêmes noms de fichiers que fr/
```

Le catalogue est réparti en plusieurs fichiers : ses parties n'évoluent pas au même rythme, et un fichier par domaine limite les conflits Git.

## Principe

**Le contenu vit dans `src/data/`, jamais en dur dans les composants.** `src/lib/catalog.js` est le seul module qui lit et interprète les YAML ; les vues ne font qu'afficher. Les phrases de l'interface passent par `t()` (voir [Traduction](traduction.md)).

Convention Vue : `src/views/` ne contient que les pages routées, `src/components/` les éléments réutilisables, `src/lib/` le code sans affichage.

## `src/lib/catalog.js`

- **Chargement** : `import.meta.glob` sur `data/fr/domains/*.yaml` ; l'ordre des domaines vient du préfixe numérique du nom de fichier. Un fichier dont l'extension n'est pas `.yaml` (ex. `25-bi.yaml.disable`) est ignoré : c'est la façon de désactiver un domaine.
- **Langues** : `apply(lang)` fusionne `en/` sur `fr/` avec `merge()` à chaque changement de `state.lang`, et remplit des objets `reactive` exportés (`tabs`, `levels`, `sizes`, `pages`, `details`, `pricing`, `coverage`…).
- **Avancement** : la présence d'un fichier de domaine fait foi. `shared/roadmap.yaml` ne sert qu'à nommer et grouper les domaines prévus (son champ `status` n'est pas lu) ; un domaine absent de la feuille de route va dans « Autres ». `status: partial` dans le fichier de domaine le marque « en cours ». `coverage` alimente l'avancement de l'en-tête et la page À propos.
- **`annotate(text)`** : transforme en liens tous les `names` de `shared/solutions.yaml` trouvés dans un texte (mot entier, sensible à la casse, nom le plus long prioritaire). Les domaines ne contiennent donc aucun lien explicite.
- **`resolve(item, sizeId, levelIdx)`** : valeur affichée = exception `by_size[taille][niveau]` si elle existe, sinon `v[niveau]`.
- **`usedIn(sol)`** : où une solution apparaît dans le catalogue, toutes tailles et tous niveaux confondus (section de la fiche).
- **Contrôles** en développement : voir [Démarrage](demarrage.md#contrôles-en-développement).

## Autres modules

- `src/lib/store.js` : état réactif `{ sizeId, levelIdx, lang }` partagé entre les pages. Langue initiale : `?lang=en`, sinon dernier choix mémorisé (`localStorage`), sinon langue du navigateur.
- `src/lib/i18n.js` : `t('clé', vars)` pour les phrases d'interface, `tg(groupe)` pour les noms de groupes de domaines, `setLang()`.
- `src/lib/budget.js` : `sum()`, `byLevel`, `current`, `eur()` ; voir [Budget](budget.md).
- `src/router/index.js` : routeur en **mode hash** (`/#/budget`), donc aucune règle de réécriture côté serveur. `About.vue` sert l'À propos ; `Page.vue` sert les Mentions légales via la prop `pageKey`. Un lien `?s=N` fait défiler jusqu'à la section N (option `scrollBehavior`).

## Pages du site

| Adresse | Vue | Contenu |
|---|---|---|
| `/` | `Home.vue` | Accueil : taille, niveau, accès au catalogue |
| `/catalogue` | `Catalog.vue` | Catalogue : barre de choix compacte, domaines, composants, résumé du budget |
| `/solutions` | `Solutions.vue` | Les solutions, avec recherche, filtre de licence et filtre « avec fiche » |
| `/solutions/<id>` | `SolutionPage.vue` | Fiche d'une solution, seulement si son fichier existe |
| `/budget` | `Budget.vue` | Coût sur 3 ans par niveau et détail par domaine |
| `/a-propos` | `About.vue` | Présentation, échelle des niveaux, avancement par groupe |
| `/contact` | `Contact.vue` | Réclamations et débats (formulaire mailto) |
| `/mentions-legales` | `Page.vue` | Mentions légales |
