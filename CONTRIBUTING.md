# Contribuer à Mon SI Libre

Merci de votre aide. Ce site vitrine vaut surtout par la **fiabilité de son contenu** : une licence fausse, un lien mort ou un avis partial coûtent plus cher qu'une page en moins.

Pour installer le projet, voir [Démarrage](doc/demarrage.md) ; pour savoir quel fichier modifier, le tableau « Où modifier quoi » de la [documentation](doc/README.md#où-modifier-quoi).

## Principes

1. **Logiciels libres ou ouverts uniquement** dans le catalogue. Une solution dont la licence n'est pas libre peut figurer comme alternative dans une fiche, avec une mention claire.
2. **Tout est vérifiable.** Une licence, un label, un prix ou une affirmation sur un concurrent doit pouvoir être contrôlé à la source. Ajoutez la source dans la fiche, ou dans `src` pour un prix.
3. **Ton factuel et équitable.** Dites pourquoi une solution est retenue et dans quels cas une autre est meilleure. Pas d'argument commercial, pas de dénigrement.
4. **Prudence sur ce qui change vite** (licences, offres payantes, prix, versions). Écrivez « à vérifier » plutôt qu'une certitude que vous n'avez pas contrôlée.
5. **Pas de suivi ni de dépendance externe** ajoutés au site : pas de cookie, pas de script tiers, pas d'appel réseau à l'exécution.

## Contenu

- Format des domaines, solutions, fiches et pages, et règles YAML : [Données du catalogue](doc/donnees.md).
- Coûts et prix de référence : [Budget](doc/budget.md). Tout prix modifié cite sa source dans `src` et dans le message de commit, avec la date.
- Traduction : [Traduction](doc/traduction.md). Une modification en français se reporte dans le fichier anglais de même nom.

## Code et interface

- Vue 3 avec `<script setup>`, UnoCSS pour les styles, aucune bibliothèque d'interface. Pages dans `src/views/`, éléments réutilisables dans `src/components/`, code sans affichage dans `src/lib/` (voir [Architecture](doc/architecture.md)).
- Pas de contenu en dur dans les composants : il va dans `src/data/`, les phrases d'interface dans `ui.yaml`.
- Gardez le design existant : fond clair, vert d'accent, couleurs des niveaux comme seul code couleur, pas d'emoji. Respectez les règles d'accessibilité (voir [Interface](doc/interface.md)).

## Avant d'envoyer

- [ ] `npm run build` passe sans erreur
- [ ] La console de développement n'affiche aucun avertissement `[catalogue]` ou `[fiches]`
- [ ] Les nouveaux composants ont exactement 5 valeurs et un bloc `cost:` complet, dont le produit propriétaire de référence `ref`
- [ ] Chaque licence, label et prix ajouté a été vérifié à la source
- [ ] Les liens ont été ouverts un par un
- [ ] Le fichier anglais suit les modifications du fichier français
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

La licence du projet est [MIT](LICENSE). En contribuant, vous acceptez que vos modifications soient publiées sous cette licence.
