# Déploiement

`npm run build` produit un site statique dans `dist/`, à servir sur n'importe quel hébergement statique.

## Netlify

`netlify.toml` contient :

- la commande de build et le dossier publié (`dist`), avec Node 20 ;
- les variables `VITE_CONTACT_EMAIL`, `VITE_CLAIMS_EMAIL` et `VITE_REPO_URL` (voir [Démarrage](demarrage.md#variables-denvironnement)) ; les aperçus de déploiement utilisent une adresse de test ;
- des en-têtes de sécurité (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`) et un cache long pour `/assets/*`.

Pour ne pas inscrire les adresses dans le dépôt, retirez-les de `netlify.toml` et définissez les mêmes variables dans l'interface Netlify (Site configuration › Environment variables).

Le routeur est en mode hash : aucune règle de réécriture n'est nécessaire. Si vous passez en mode historique, ajoutez une redirection `/* → /index.html` (exemple commenté dans `netlify.toml`).

## Autre hébergement

Pour un hébergement dans un sous-dossier, ajoutez `base: '/mon-dossier/'` dans `vite.config.js`. Les mentions légales supposent Netlify pour l'hébergement et OVH pour le nom de domaine : adaptez-les.

## À faire avant publication

- [ ] Définir les vraies adresses de contact (variables d'environnement), à la place des valeurs de secours de `fr/pages.yaml`
- [ ] Vérifier que l'hébergeur (Netlify) et le registraire (OVH) des mentions légales sont bien les vôtres, que l'éditeur est réellement non professionnel et anonyme, puis faire relire le texte par un juriste
- [ ] Confirmer par des devis les prix du budget, en priorité ceux sans `src` (voir [Budget](budget.md))
- [ ] Vérifier les licences de `shared/solutions.yaml` et les labels SILL et CSPN à la source
- [ ] Relire les 104 fiches (rédigées sans vérification en ligne, sans sources pour la plupart) et écrire celles qui manquent
- [ ] Faire relire les choix techniques de chaque niveau par un expert du domaine
- [ ] Compléter les variantes par taille (seuls l'annuaire LDAP, l'orchestration, la collecte des journaux et le SIEM en ont)
- [ ] Tester le rendu sur mobile et la navigation au clavier
