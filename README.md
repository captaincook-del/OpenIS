[![Netlify Status](https://api.netlify.com/api/v1/badges/7a7881d2-51e4-410c-89d5-b3c4a0953845/deploy-status)](https://app.netlify.com/projects/openis/deploys)

![GitHub License](https://img.shields.io/github/license/captaincook-del/OpenIS)

# Mon SI Libre

Site vitrine qui présente un système d'information complet fondé sur des logiciels libres ou ouverts, de la virtualisation jusqu'au poste de l'utilisateur. Il s'adresse aux startups, PME, grandes entreprises, associations et collectivités. Il est disponible en français et en anglais.

Le visiteur choisit une **taille** d'organisation et un **niveau d'exigence** ; le site affiche la pile correspondante. Chaque solution citée renvoie à sa fiche (« pourquoi celle-ci et pas une autre ») ou à son site, avec un badge de licence. Une page **Budget** calcule le coût sur 3 ans à partir du catalogue et le compare à un équivalent propriétaire.

Le catalogue couvre 29 domaines, 108 composants, 176 solutions et 104 fiches détaillées.

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

## Démarrage rapide

Prérequis : Node.js 20 ou plus.

```bash
npm install
npm run dev       # serveur de développement
npm run build     # génère dist/
```

Site statique (Vue 3, Vite, UnoCSS, données en YAML) : pas de serveur, pas de base de données, aucun cookie ni script tiers.

## Documentation

Toute la documentation développeur est dans [doc/](doc/README.md) : architecture, format des données, modèle de budget, traduction, interface, déploiement. Pour contribuer, voir [CONTRIBUTING.md](CONTRIBUTING.md).

## Licence

Voir [LICENSE](./LICENSE).
