# Mon SI Libre

Site vitrine qui présente un système d'information complet fondé sur des logiciels libres ou ouverts, de la virtualisation jusqu'au poste de l'utilisateur. Il s'adresse aux startups, PME, grandes entreprises, associations et collectivités.

Le visiteur choisit une **taille** d'organisation et un **niveau d'exigence** ; le site affiche la pile correspondante. Chaque solution citée renvoie à sa fiche (« pourquoi celle-ci et pas une autre ») ou à son site, avec un badge de licence. Une page **Budget** calcule le coût sur 3 ans à partir du catalogue et le compare à un équivalent propriétaire.

## Les choix proposés

| Taille | Utilisateurs | Parc |
|---|---|---|
| Startup | 1 à 25 | 1 à 2 serveurs |
| PME | 25 à 500 | 3 à 6 serveurs |
| Grande entreprise | 500 et plus | 10 serveurs et plus, multi-sites |

| Niveau | Idée |
|---|---|
| Essentielle (vert) | Le strict nécessaire, simple à opérer |
| Standard (bleu) | Redondance de base, sauvegardes testées |
| Entreprise (violet) | Annuaire central, SSO, journalisation, conformité |
| Haute disponibilité (orange) | Aucun point unique de défaillance, multi-sites |
| Souveraine (jaune) | Hébergement et chiffrement maîtrisés, SecNumCloud |

## Pages du site

| Adresse | Contenu |
|---|---|
| `/` | Catalogue : choix de la taille et du niveau, domaines, composants |
| `/solutions` | Les 145 solutions, avec recherche, filtre de licence et filtre « avec fiche » |
| `/solutions/<id>` | Fiche d'une solution, seulement si son fichier YAML existe |
| `/budget` | Coût sur 3 ans par niveau et détail par domaine |
| `/a-propos` | Présentation et feuille de route des domaines |
| `/contact` | Réclamations et débats (pas de demande professionnelle) |
| `/mentions-legales` | Mentions légales |

Le routeur est en mode hash (`/#/budget`) : aucun réglage serveur n'est nécessaire.

## Démarrage

Prérequis : Node.js 20 ou plus.

```bash
npm install
npm run dev       # serveur de développement
npm run build     # génère dist/
npm run preview   # prévisualise le build
```

En développement, la console du navigateur affiche des avertissements `[catalogue]` et `[fiches]` quand une donnée est mal formée. Relancez `npm run dev` après avoir ajouté un nouveau fichier dans `src/data/`.

## Technologies

- Vue 3 (Composition API, `<script setup>`) et Vue Router
- Vite 6
- UnoCSS (preset Wind3, transformer variant group)
- Données en YAML, importées via `@modyfi/vite-plugin-yaml`

Site statique : pas de serveur, pas de base de données, aucun cookie ni script tiers.

## Structure

```
public/favicon.svg
index.html
uno.config.js               couleurs, polices, raccourcis
vite.config.js
src/
├── main.js
├── App.vue                 bandeau d'avancement, en-tête vert, pied de page
├── router.js
├── store.js                taille et niveau choisis, partagés entre les pages
├── catalog.js              charge les YAML, résout les valeurs, calcule la couverture
├── views/
│   ├── Home.vue            catalogue
│   ├── Solutions.vue       liste des solutions
│   ├── SolutionPage.vue    fiche d'une solution
│   ├── Budget.vue          budget calculé depuis le catalogue
│   ├── Page.vue            À propos et Mentions légales
│   ├── Contact.vue         formulaire qui ouvre la messagerie (mailto)
│   ├── SolutionText.vue    texte avec liens automatiques et badges
│   ├── SolutionBadges.vue  badge de licence et labels
│   ├── BadgeLegend.vue     légende des badges
│   └── RichText.vue        texte avec liens [texte](adresse) et jeton {email}
└── data/
    ├── site.yaml           niveaux et tailles
    ├── roadmap.yaml        domaines prévus, noms et groupes
    ├── solutions.yaml      registre des solutions : lien, licence, labels
    ├── pricing.yaml        coûts unitaires et hypothèses du budget
    ├── pages.yaml          À propos, Contact, Mentions légales
    ├── domains/            un fichier par domaine (01-virtualisation.yaml, …)
    └── solutions/          une fiche détaillée par solution (facultative)
```

Le contenu se modifie dans `src/data/`, sans toucher au code. Il y a plusieurs fichiers plutôt qu'un seul : le catalogue est grand, ses parties n'évoluent pas au même rythme, et un fichier par domaine limite les conflits Git.

## Les données

### Un domaine : `domains/NN-id.yaml`

```yaml
id: virtualisation          # même id que dans roadmap.yaml
name: Virtualisation
intro: "La fondation : héberger machines virtuelles et stockage."
sizing:                     # une phrase par taille
  startup: "Un hôte, quelques VM."
  pme: "Cluster de 3 nœuds."
  grande: "Plusieurs clusters par site."
items:
  - name: Hyperviseur
    role: Exécute les machines virtuelles
    v:                      # exactement 5 valeurs, dans l'ordre des niveaux
      - "Proxmox VE, 1 nœud"
      - "Proxmox VE, 2 nœuds + témoin"
      - "Proxmox VE, cluster 3 à 7 nœuds"
      - "Proxmox VE multi-clusters"
      - "OpenNebula sur infrastructure qualifiée"
    sizes: [pme, grande]    # facultatif : n'afficher que pour ces tailles
    by_size: { … }          # facultatif : variantes par taille (voir ci-dessous)
    cost: { … }             # facultatif : coût propre au composant (voir Budget)
```

Le préfixe numérique du nom de fichier fixe l'ordre des onglets. Le groupe (Infrastructure, Sécurité, etc.) vient de `roadmap.yaml`.

### Variantes par taille

`v` donne la valeur **par défaut** de chaque niveau. Quand la bonne réponse change avec la taille, on ajoute seulement les exceptions dans `by_size` : tout ce qui n'est pas précisé retombe sur `v`.

```yaml
- name: Annuaire LDAP
  v: [LLDAP, OpenLDAP, FreeIPA, 389 Directory Server multi-maître, FreeIPA multi-sites]
  by_size:
    startup:
      essentielle: { text: "LLDAP, attributs POSIX saisis à la main", why: "Quelques comptes : la saisie manuelle reste raisonnable." }
    pme:
      essentielle: { text: "FreeIPA", why: "Pas de POSIX natif dans LLDAP : trop d'erreurs à plusieurs centaines de comptes." }
```

Une exception est un texte ou `{ text, why }` ; le `why` s'affiche sous la valeur avec une étiquette « Variante <taille> ». Les clés de niveau sont `essentielle`, `standard`, `entreprise`, `ha`, `souveraine`. Une liste de 5 valeurs avec `null` pour « par défaut » est aussi acceptée. Si plus de la moitié des cases d'un composant sont des exceptions, scindez-le en deux composants.

### Ajouter un domaine

1. Créer `src/data/domains/NN-id.yaml` sur le modèle ci-dessus.
2. Ajouter (ou conserver) une ligne pour le même `id` dans `roadmap.yaml`, avec un `group` : sinon le domaine est classé dans « Autres ».
3. Un domaine est « livré » dès que son fichier existe : le bandeau et la page À propos se mettent à jour seuls. Le champ `status` de `roadmap.yaml` n'est plus lu.

### Ajouter une solution

Dans `solutions.yaml` :

```yaml
- { id: proxmox-ve, names: [Proxmox VE], url: "https://…", license: AGPL-3.0, labels: [] }
```

Tout texte du catalogue qui contient l'un des `names` devient automatiquement un lien. La recherche respecte la casse, exige un mot entier et privilégie le nom le plus long (« Docker Compose » avant « Docker »).

### Badges

- **Licence** : identifiant SPDX. La famille (copyleft fort, copyleft faible, permissive, code source disponible, à renseigner) se déduit du début de l'identifiant ; familles et couleurs sont définies en tête de `solutions.yaml`.
- **Labels** : `labels: [sill]` ou `[cspn]`, à renseigner uniquement après vérification à la source (SILL sur code.gouv.fr/sill, produits certifiés de l'ANSSI pour la CSPN).

### Fiches de solution

Une page `/solutions/<id>` existe **seulement si** `src/data/solutions/<id>.yaml` existe. Sans fichier, le nom de la solution mène à son site. Quand une fiche existe, le nom mène à la fiche et un lien « Site du projet » reste disponible.

```yaml
id: keycloak            # id du registre solutions.yaml
updated: 2026-10
summary: "Une phrase qui dit ce que c'est."
why: ["Raison 1", "Raison 2"]                 # pourquoi celle-ci
alternatives:                                  # pourquoi pas une autre
  - { name: Authelia, id: authelia, verdict: "…" }   # id ou url facultatifs : rendent le nom cliquable
limits: ["Limite 1"]
when_not: "Dans quels cas choisir autre chose."
sources: [{ label: "Documentation", url: "https://…" }]
```

La section « Où elle apparaît dans le catalogue » se calcule seule, variantes par taille comprises.

### Budget : `pricing.yaml`

Le budget est **calculé à partir du catalogue** : somme des composants visibles pour la taille choisie. Chaque composant coûte la valeur unitaire `per_item` de sa taille et de son niveau (cinq valeurs par indicateur : `capex`, `opex`, `etp`, `proprietary`). Un composant peut porter son propre coût :

```yaml
- name: Hyperviseur
  v: [ … ]
  cost: { capex: [1000, 2000, 4000, 8000, 12000], etp: [0.01, 0.02, 0.04, 0.08, 0.1] }   # clés facultatives
```

Calcul : `coût libre = capex + années × (opex + etp × etp_cost)` et `coût propriétaire = années × proprietary`. Ajouter ou retirer un composant fait varier les barres de la page Budget et le détail par domaine. Les valeurs unitaires de départ sont les anciens forfaits divisés par le nombre de composants : à remplacer par des devis réels.

### Pages : `pages.yaml`

Contient À propos, Contact (titre, introduction, avertissement, objets du formulaire, adresse) et Mentions légales. Les textes acceptent des liens `[texte](adresse)` et le jeton `{email}`, remplacé par l'adresse de contact ; un bloc `quote:` affiche un encadré, une ligne par entrée.

### Règles YAML

- Entourez de guillemets tout texte contenant `:`.
- Les `id` sont en minuscules avec tirets et ne changent jamais une fois publiés.
- Indentation de deux espaces, pas de tabulations.

## Apparence

Couleurs et polices dans `uno.config.js` : `ink`, `paper`, `mute`, `line`, `edge`, `brand` (vert d'accent) et `brandsoft`. Les couleurs des niveaux sont dans `site.yaml` ; elles servent de code couleur (teinte du niveau choisi, bande du domaine actif). Le bandeau d'avancement et l'en-tête forment un seul bloc vert (`brand`) à texte clair. Les polices (Bricolage Grotesque, Instrument Sans) sont chargées depuis Google Fonts dans `index.html` ; pour un site sans appel externe, hébergez-les vous-même.

## Déploiement

`npm run build` produit un site statique dans `dist/`, à servir sur n'importe quel hébergement statique (les mentions légales supposent Netlify pour l'hébergement et OVH pour le nom de domaine : adaptez-les si besoin). Pour un hébergement dans un sous-dossier, ajoutez `base: '/mon-dossier/'` dans `vite.config.js`.

## À faire avant publication

- [ ] Remplacer l'adresse fictive en utilisant un `.env.local` dans `pages.yaml`
- [ ] Vérifier que l'hébergeur (Netlify) et le registraire (OVH) des mentions légales sont bien les vôtres, que l'éditeur est réellement non professionnel et anonyme, puis faire relire le texte par un juriste
- [ ] Remplacer les chiffres de `pricing.yaml` par des devis réels
- [ ] Vérifier les licences de `solutions.yaml` et les labels SILL à la source
- [ ] Relire les 39 fiches (rédigées sans vérification en ligne, sans sources pour la plupart) et écrire les 106 manquantes
- [ ] Faire relire les choix techniques de chaque niveau par un expert du domaine
- [ ] Compléter les variantes par taille (seuls l'annuaire LDAP et l'orchestration en ont pour l'instant)
- [ ] Tester le rendu sur mobile et la navigation au clavier

## Accessibilité

Les choix de taille et de niveau sont de vrais boutons radio accessibles au clavier ; l'état sélectionné ne repose pas que sur la couleur (coche et gras) ; les liens externes annoncent « nouvel onglet » aux lecteurs d'écran ; le contraste des textes secondaires est d'environ 8:1 ; l'anneau de focus reste visible sur fond vert.

## Contribuer

Voir [CONTRIBUTING.md](CONTRIBUTING.md) : règles de contenu, format des fichiers, vérifications avant envoi.

## Licence

À définir.