# Documentation développeur

Tout ce qu'il faut pour faire évoluer Mon SI Libre. Le contenu du site se modifie dans `src/data/`, sans toucher au code ; le code ne fait que charger ces fichiers et les afficher.

| Document | Contenu |
|---|---|
| [Démarrage](demarrage.md) | Installation, commandes, variables d'environnement, contrôles en développement |
| [Architecture](architecture.md) | Arborescence, rôle de chaque module, vues et composants, routeur |
| [Données du catalogue](donnees.md) | Domaines, composants, variantes par taille, solutions, badges, fiches, pages, règles YAML |
| [Budget](budget.md) | Modèle de coût des composants, formules, prix de référence et leurs sources |
| [Traduction](traduction.md) | Site bilingue : fichiers `fr/` et `en/`, fusion par position, interface |
| [Interface](interface.md) | Design responsive, couleurs, raccourcis UnoCSS, accessibilité, pièges connus |
| [Déploiement](deploiement.md) | Build, Netlify, hébergement statique, liste avant publication |
| [Contribuer](../CONTRIBUTING.md) | Principes de contenu, proposer un changement, relecture, vérifications avant envoi |
| [Exemple de coût](exemples/cout-composant.yaml) | Bloc `cost:` commenté et calcul détaillé |

## Où modifier quoi

| Je veux… | Fichier | Voir |
|---|---|---|
| Modifier un composant d'un domaine | `src/data/fr/domains/NN-id.yaml` (+ `src/data/en/domains/NN-id.yaml`) | [Données](donnees.md#un-domaine) |
| Ajouter un domaine | nouveau `src/data/fr/domains/NN-id.yaml` + ligne dans `src/data/shared/roadmap.yaml` | [Données](donnees.md#ajouter-un-domaine) |
| Déclarer une solution (lien, licence, label) | `src/data/shared/solutions.yaml` | [Données](donnees.md#déclarer-une-solution) |
| Écrire la fiche d'une solution | `src/data/fr/solutions/<id>.yaml` | [Données](donnees.md#fiches-de-solution) |
| Ajuster un coût | bloc `cost:` du composant, ou `src/data/shared/pricing.yaml` | [Budget](budget.md) |
| Modifier À propos, Contact, Mentions légales | `src/data/fr/pages.yaml` | [Données](donnees.md#pages) |
| Traduire | `src/data/en/…` | [Traduction](traduction.md) |
| Changer couleurs, polices, raccourcis de style | `uno.config.js` | [Interface](interface.md) |
