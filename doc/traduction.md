# Traduction

Le site est bilingue, sans serveur. La langue vient de `?lang=en` dans l'adresse, sinon du dernier choix (mémorisé dans le navigateur), sinon de la langue du navigateur. Le sélecteur FR / EN est dans l'en-tête.

## Interface

Les phrases de l'interface sont dans `src/data/fr/ui.yaml` et `src/data/en/ui.yaml`. Dans les composants, `t('clé', { variables })` (de `src/lib/i18n.js`) renvoie la phrase ; `{nom}` est remplacé par `vars.nom`. Repli : français, puis la clé elle-même. `tg(groupe)` traduit les noms de groupes de domaines (clés `g.<nom français>`).

Dans un template, ne nommez jamais une variable de boucle `t` : elle masquerait `t()` et ferait planter la page.

## Contenu

- Le français (`src/data/fr/`) est la **référence**. Une traduction est un fichier **de même nom** dans `src/data/en/` qui ne contient **que les textes traduits**.
- Les listes se fusionnent **par position** : l'anglais doit suivre l'ordre du français. Ajouter, retirer ou réordonner un composant, une alternative ou une section en français impose la même modification dans le fichier anglais, sinon les traductions se décalent.
- `~` (null) ou une entrée absente : on garde le français.
- Ne se traduisent pas : les `id`, les liens, les licences, les noms de solutions, les blocs `cost`.
- Un domaine, une fiche ou une page sans fichier anglais s'affiche en français avec la mention « pas encore traduit ».
- `src/data/shared/` contient ce qui ne dépend pas de la langue : `roadmap.yaml`, `solutions.yaml`, paramètres de `pricing.yaml`.
