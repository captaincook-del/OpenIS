# Interface

## Mise en page responsive

- **Accueil** (`/`) : on choisit la taille puis le niveau, puis « Voir mon catalogue ». Le logo y ramène depuis toutes les pages ; l'accueil n'a pas d'onglet.
- **Ordinateur** : en-tête vert avec la navigation, l'avancement du catalogue, le choix de langue et le lien GitHub ; catalogue (`/catalogue`) avec une barre de choix compacte puis trois colonnes (domaines, composants, résumé du budget).
- **Téléphone** (sous 768 px, `md:`) : barre d'onglets fixe en bas de l'écran (`md:hidden` dans `App.vue`), choix du domaine par liste et flèches, composants en cartes.
- Conteneur pleine largeur `wrap` : 16 px de marge sur téléphone, 48 px sur ordinateur, 1 680 px au plus.

## Couleurs et polices

Dans `uno.config.js` : `ink`, `paper`, `mute`, `line`, `edge`, `brand` (vert d'accent), `brandsoft`, `rule`, `soft`, `gain`, `propbar`. Les couleurs des niveaux sont dans `src/data/fr/site.yaml` : c'est le seul code couleur du site (teinte du niveau choisi, bande du domaine actif, barres du budget).

Polices Bricolage Grotesque (titres) et Instrument Sans (texte), chargées depuis Google Fonts dans `index.html`. Pour un site sans aucun appel externe, hébergez-les dans le projet et retirez la mention correspondante des mentions légales.

## Raccourcis UnoCSS

Définis dans `uno.config.js` : `wrap` (conteneur), `card` (carte blanche bordée), `eyebrow` (sur-titre en capitales), `h-page` (titre de page), `h-sec` (titre de section), `field` (champ de formulaire), `chip` (pastille), `focusable` (anneau de focus), `radio-card` (bouton radio stylé, focus visible).

Les icônes sont des traits SVG dans `src/components/Icon.vue` ; pas d'emoji dans l'interface.

## Accessibilité

- Les choix de taille, de niveau, de famille de licence et d'objet de contact sont de vrais boutons radio, utilisables au clavier.
- L'état sélectionné ne repose pas que sur la couleur : coche et gras.
- Les liens externes annoncent « nouvel onglet » aux lecteurs d'écran.
- Contraste élevé des textes secondaires ; l'anneau de focus reste visible sur fond vert.
- Cibles tactiles d'au moins 44 px sur téléphone.

## Pièges connus

- **Débordement sur téléphone** : une grille à une seule colonne doit déclarer `grid-cols-[minmax(0,1fr)]`, et `fieldset` a `min-width: 0` (`src/assets/base.css`). Sinon une rangée défilante (pastilles de niveau, filtres) élargit toute la page.
- **Ancres** : le routeur est en mode hash, une ancre `#id` changerait de route. Pour faire défiler vers une section, utilisez `scrollIntoView` (voir `Solutions.vue` et `SolutionPage.vue`), ou un paramètre `?s=N` traité par `scrollBehavior` dans `router/index.js`.
- **Lien actif** : la navigation compare la route courante (`useRoute()`), pas la cible du `RouterLink`.
