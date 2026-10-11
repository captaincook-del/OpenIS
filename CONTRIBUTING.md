# Contribuer à Mon SI Libre

Merci de votre aide. Ce site vitrine vaut surtout par la **fiabilité de son contenu** : une licence fausse, un lien mort ou un avis partial coûtent plus cher qu'une page en moins. Ce guide explique comment ajouter ou corriger du contenu sans casser le site.

## Principes

1. **Logiciels libres ou ouverts uniquement** dans le catalogue. Une solution dont la licence n'est pas libre peut figurer comme alternative dans une fiche, avec une mention claire.
2. **Tout est vérifiable.** Une licence, un label ou une affirmation sur un concurrent doit pouvoir être contrôlé à la source. Ajoutez la source dans la fiche.
3. **Ton factuel et équitable.** Dites pourquoi une solution est retenue et dans quels cas une autre est meilleure. Pas d'argument commercial, pas de dénigrement.
4. **Prudence sur ce qui change vite** (licences, offres payantes, versions). Écrivez « à vérifier » plutôt qu'une certitude que vous n'avez pas contrôlée.
5. **Pas de suivi ni de dépendance externe** ajoutés au site : pas de cookie, pas de script tiers, pas d'appel réseau à l'exécution.

## Installer le projet

Prérequis : Node.js 20 ou plus.

```bash
npm install
npm run dev       # serveur de développement
npm run build     # vérifie que tout compile
```

En développement, ouvrez la console du navigateur : des avertissements `[catalogue]` et `[fiches]` signalent les erreurs de données (valeurs manquantes, identifiants inconnus). Relancez `npm run dev` après avoir ajouté un nouveau fichier dans `src/data/`, le serveur ne le détecte pas toujours.

## Où modifier quoi

| Je veux… | Fichier |
|---|---|
| Ajouter ou modifier un composant d'un domaine | `src/data/domains/NN-id.yaml` |
| Ajouter un domaine | nouveau `src/data/domains/NN-id.yaml` + ligne dans `src/data/roadmap.yaml` |
| Déclarer une solution (lien, licence, label) | `src/data/solutions.yaml` |
| Écrire la page dédiée d'une solution | `src/data/solutions/<id>.yaml` |
| Ajuster les coûts | `src/data/pricing.yaml` ou bloc `cost:` dans un composant |
| Modifier À propos, Contact, Mentions légales | `src/data/pages.yaml` |
| Changer les couleurs ou polices | `uno.config.js` |

Le contenu se modifie dans `src/data/`, sans toucher au code.

## Règles YAML

- **Entourez de guillemets tout texte contenant `:`** ou commençant par un caractère spécial. `"Proxmox VE : cluster"`, et non `Proxmox VE : cluster`, qui casse le fichier.
- **Identifiants** (`id`) : minuscules, chiffres et tirets (`proxmox-ve`, `step-ca`). Un identifiant ne change jamais une fois publié, car des liens en dépendent.
- **Indentation** : deux espaces, pas de tabulations.
- **Un composant = 5 valeurs** dans `v`, dans l'ordre : essentielle, standard, entreprise, haute disponibilité, souveraine.
- **Tailles** : `startup`, `pme`, `grande` (les identifiants de `site.yaml`).

## Ajouter un composant

Dans le fichier du domaine, sous `items` :

```yaml
- name: Hyperviseur
  role: Exécute les machines virtuelles
  v:
    - "Proxmox VE, 1 nœud"
    - "Proxmox VE, 2 nœuds + témoin"
    - "Proxmox VE, cluster 3 à 7 nœuds"
    - "Proxmox VE multi-clusters"
    - "OpenNebula sur infrastructure qualifiée"
  sizes: [pme, grande]        # facultatif : n'afficher que pour ces tailles
  cost: { capex: [1, 2, 3, 4, 5] }   # facultatif : remplace le coût unitaire par défaut
```

Chaque valeur doit rester une **proposition réaliste** pour le niveau : le niveau Haute disponibilité suppose l'absence de point unique de défaillance, le niveau Souveraine une maîtrise de l'hébergement et des clés. Ajouter un composant modifie le budget de la page Budget.

## Ajouter un domaine

1. Créez `src/data/domains/NN-id.yaml` (le préfixe numérique fixe l'ordre) avec `id`, `name`, `intro`, `sizing` (une phrase par taille) et `items`.
2. Ajoutez le même `id`, un `name` et un `group` dans `roadmap.yaml`, sinon le domaine est classé dans « Autres ».
3. Un domaine est considéré livré dès que son fichier existe : le bandeau d'avancement se met à jour seul.

## Déclarer une solution

Dans `solutions.yaml` :

```yaml
- { id: forgejo, names: [Forgejo], url: "https://forgejo.org", license: GPL-3.0 }
```

- `names` : les noms exacts tels qu'ils apparaissent dans les textes. La recherche respecte la casse et exige un mot entier ; le nom le plus long l'emporte (« Docker Compose » avant « Docker »). Tout texte du catalogue qui contient ce nom devient un lien.
- `url` : le site officiel du projet.
- `license` : identifiant **SPDX** (`AGPL-3.0`, `Apache-2.0`, `MPL-2.0`…). Laissez vide si vous ne savez pas : le badge affichera « Licence à renseigner ».
- `labels` : voir ci-dessous.

### Licences et labels

- Vérifiez la licence **dans le dépôt du projet** (fichier `LICENSE`), pas dans un article. Plusieurs éditeurs ont changé de licence ces dernières années.
- Une licence qui n'est pas libre au sens de l'OSI (BUSL, SSPL, licence maison) doit apparaître comme telle : ne la déguisez pas.
- N'ajoutez un label (`sill`, `cspn`) **qu'après l'avoir vérifié à la source** : liste du SILL sur code.gouv.fr/sill, liste des produits certifiés de l'ANSSI pour la CSPN. Un label faux est pire que pas de label.

## Écrire une fiche de solution

Une page `/solutions/<id>` apparaît si `src/data/solutions/<id>.yaml` existe. Le `id` doit exister dans `solutions.yaml`.

```yaml
id: keycloak
updated: 2026-10
summary: "Une phrase qui dit ce que c'est."
why:
  - "Pourquoi cette solution."
alternatives:
  - { name: Authelia, id: authelia, verdict: "Dans quels cas c'est meilleur ou moins adapté." }
limits:
  - "Une limite réelle."
when_not: "Dans quels cas choisir autre chose."
sources:
  - { label: "Documentation", url: "https://…" }
```

Une bonne fiche :
- répond à **« pourquoi celle-ci et pas une autre ? »** en une page ;
- donne au moins deux alternatives, dont une propriétaire quand elle existe, et dit honnêtement ce qu'elles font mieux ;
- cite ses sources et sa date de mise à jour (`updated`) ;
- n'invente aucun chiffre : si vous ne pouvez pas sourcer, retirez ou écrivez « à vérifier ».

Une alternative devient cliquable avec `id` (une solution du registre) ou `url` (un site externe).

## Coûts

Les chiffres de `pricing.yaml` sont des **estimations de travail**. Si vous les modifiez, indiquez dans votre message de commit ou de pull request l'origine du chiffre (devis, grille tarifaire publique, retour d'expérience) et la date.

## Code et interface

- Vue 3 avec `<script setup>`, UnoCSS pour les styles, aucune bibliothèque d'interface.
- Gardez le design existant : fond clair, vert d'accent, couleurs des niveaux comme seul code couleur. Pas de pastilles emoji.
- **Accessibilité** : les contrôles se manipulent au clavier, l'état sélectionné ne repose pas que sur la couleur, les liens externes annoncent « nouvel onglet », le contraste du texte reste élevé.
- Ne mettez pas de contenu en dur dans les composants : il va dans `src/data/`.

## Avant d'envoyer

- [ ] `npm run build` passe sans erreur
- [ ] La console de développement n'affiche aucun avertissement `[catalogue]` ou `[fiches]`
- [ ] Les nouveaux composants ont exactement 5 valeurs
- [ ] Chaque licence et chaque label ajouté a été vérifié à la source
- [ ] Les liens ont été ouverts un par un
- [ ] Les textes sont relus (orthographe, ton factuel)
- [ ] Les fichiers YAML ne contiennent aucun `:` sans guillemets

## Proposer un changement

1. Ouvrez une issue pour un changement important (nouveau domaine, refonte, choix technique discuté).
2. Travaillez sur une branche dédiée, avec des modifications **petites et ciblées** : un domaine ou une fiche par proposition facilite la relecture.
3. Décrivez ce qui change et **pourquoi**, avec vos sources.
4. Messages de commit à l'impératif, en français : `Ajoute la fiche de Wazuh`, `Corrige la licence de Valkey`.

## Relecture

Une proposition est relue sur quatre critères : exactitude des faits, ton équitable, cohérence avec le reste du catalogue, absence de régression technique. Un désaccord sur un choix technique se règle par des arguments sourcés dans l'issue.

## Comportement

Soyez courtois et constructif. Critiquez les contenus, pas les personnes. Les remarques sur une solution sont les bienvenues si elles sont argumentées, les promotions déguisées ne le sont pas.

## Licence des contributions

La licence du projet est [MIT](./LICENSE). En contribuant vous acceptez que vos modifications soient publiées sous cette licence retenue par les mainteneurs.
