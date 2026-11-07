# Démarrage

## Prérequis et commandes

Node.js 20 ou plus (Netlify construit avec Node 20).

```bash
npm install
npm run dev       # serveur de développement
npm run build     # génère dist/ et vérifie que tout compile
npm run preview   # prévisualise le build
```

Il n'y a ni tests ni linter : `npm run build` et la console du navigateur en développement sont les seules vérifications.

## Technologies

- Vue 3 (Composition API, `<script setup>`) et Vue Router, en mode hash
- Vite 6
- UnoCSS (preset Wind3, transformer variant group), aucune bibliothèque d'interface
- Données en YAML, importées via `@modyfi/vite-plugin-yaml`

Site statique : pas de serveur, pas de base de données, aucun cookie ni script tiers. Seule exception : les polices viennent de Google Fonts (voir [Interface](interface.md#couleurs-et-polices)).

## Contrôles en développement

Une donnée mal formée ne casse pas le build : elle s'affiche vide ou disparaît. En développement, la console du navigateur affiche donc des avertissements :

- `[catalogue]` : domaine absent de la feuille de route, composant sans 5 valeurs, taille ou niveau inconnu dans `by_size`, bloc `cost` incomplet…
- `[fiches]` : fiche dont l'`id` n'existe pas dans `shared/solutions.yaml`.

Ces contrôles sont dans `src/lib/catalog.js`. Relancez `npm run dev` après avoir ajouté un nouveau fichier dans `src/data/` : le serveur ne le détecte pas toujours.

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `VITE_CONTACT_EMAIL` | adresse de contact affichée sur le site |
| `VITE_CLAIMS_EMAIL` | adresse des réclamations (premier objet du formulaire de contact) |
| `VITE_REPO_URL` | dépôt Git du logo GitHub ; vide = logo masqué |

En développement, copiez `.env.example` en `.env.local` (jamais versionné). En production, elles sont dans `netlify.toml` ou dans l'interface Netlify. Elles remplacent les valeurs de secours de `src/data/fr/pages.yaml`. Au build de production, `vite.config.js` avertit quand l'une d'elles manque.
