# Données du catalogue

Tout le contenu est dans `src/data/`. Le français (`fr/`) est la référence ; `shared/` contient ce qui ne dépend pas de la langue ; `en/` la traduction (voir [Traduction](traduction.md)).

Les identifiants des tailles sont `startup`, `pme`, `grande` ; ceux des niveaux, dans l'ordre, `essentielle`, `standard`, `entreprise`, `ha`, `souveraine` (définis dans `fr/site.yaml`).

## Un domaine

Fichier `src/data/fr/domains/NN-id.yaml`. Le préfixe numérique fixe l'ordre ; le groupe (Infrastructure, Sécurité…) vient de `shared/roadmap.yaml`.

```yaml
id: virtualisation          # même id que dans roadmap.yaml
name: Virtualisation
status: complete            # partial = affiché « en cours d'enrichissement »
intro: "La fondation : héberger machines virtuelles et stockage."
sizing:                     # une phrase par taille
  startup: "Un hôte, quelques VM."
  pme: "Cluster de 3 nœuds."
  grande: "Plusieurs clusters par site."
items:
  - name: Hyperviseur
    role: Exécute les machines virtuelles
    cost: { … }             # coût et équivalent propriétaire, voir budget.md
    v:                      # exactement 5 valeurs, dans l'ordre des niveaux
      - "Proxmox VE, 1 nœud"
      - "Proxmox VE, 2 nœuds + témoin"
      - "Proxmox VE, cluster 3 à 7 nœuds"
      - "Proxmox VE multi-clusters"
      - "OpenNebula sur infrastructure qualifiée"
    sizes: [pme, grande]    # facultatif : n'afficher que pour ces tailles
    by_size: { … }          # facultatif : variantes par taille, voir ci-dessous
```

Chaque valeur doit rester une **proposition réaliste** pour son niveau : Haute disponibilité suppose l'absence de point unique de défaillance, Souveraine une maîtrise de l'hébergement et des clés. Ajouter ou retirer un composant modifie le budget.

## Variantes par taille

`v` donne la valeur **par défaut** de chaque niveau. Quand la bonne réponse change avec la taille, on n'ajoute que les exceptions dans `by_size` ; tout le reste retombe sur `v`.

```yaml
- name: Annuaire LDAP
  v: [LLDAP, OpenLDAP, FreeIPA, 389 Directory Server multi-maître, FreeIPA multi-sites]
  by_size:
    startup:
      essentielle: { text: "LLDAP, attributs POSIX saisis à la main", why: "Quelques comptes : la saisie manuelle reste raisonnable." }
    pme:
      essentielle: { text: "FreeIPA", why: "Pas de POSIX natif dans LLDAP : trop d'erreurs à plusieurs centaines de comptes." }
```

Une exception est un texte ou `{ text, why }` ; le `why` s'affiche sous la valeur avec une étiquette « Variante <taille> ». Une liste de 5 valeurs avec `null` pour « par défaut » est aussi acceptée. Si plus de la moitié des cases d'un composant sont des exceptions, scindez-le en deux composants.

## Ajouter un domaine

1. Créer `src/data/fr/domains/NN-id.yaml` sur le modèle ci-dessus, avec un bloc `cost:` par composant.
2. Ajouter (ou garder) une ligne avec le même `id`, un `name` et un `group` dans `shared/roadmap.yaml`, sinon le domaine est classé dans « Autres ». Le `name` doit être celui du fichier de domaine.
3. Le domaine est livré dès que son fichier existe : l'avancement de l'en-tête et la page À propos se mettent à jour seuls.
4. Pour le désactiver sans le supprimer, renommer le fichier en `.yaml.disable`.

## Déclarer une solution

Dans `shared/solutions.yaml` :

```yaml
- { id: forgejo, names: [Forgejo], url: "https://forgejo.org", license: GPL-3.0, labels: [] }
```

- `id` : minuscules, chiffres et tirets ; ne change jamais une fois publié, car des liens en dépendent.
- `names` : les noms exacts tels qu'ils apparaissent dans les textes. Tout texte du catalogue qui contient l'un d'eux devient un lien (mot entier, sensible à la casse, nom le plus long prioritaire : « Docker Compose » avant « Docker »).
- `url` : le site officiel du projet.
- `license` : identifiant **SPDX** (`AGPL-3.0`, `Apache-2.0`, `MPL-2.0`…). Laissez vide si vous ne savez pas : le badge affiche « Licence à renseigner ».
- `labels` : voir ci-dessous.

## Licences et labels

- **Famille de licence** (copyleft fort, copyleft faible, permissive, code source disponible, à renseigner) : déduite du début de l'identifiant SPDX. Familles, préfixes et couleurs sont dans `fr/licences.yaml`.
- Vérifiez la licence **dans le dépôt du projet** (fichier `LICENSE`), pas dans un article : plusieurs éditeurs ont changé de licence ces dernières années.
- Une licence qui n'est pas libre au sens de l'OSI (BUSL, SSPL, Sustainable Use…) doit apparaître comme telle.
- **Labels** `sill` ou `cspn` : seulement après vérification à la source (SILL sur code.gouv.fr/sill, produits certifiés de l'ANSSI pour la CSPN). Un label faux est pire que pas de label.

## Fiches de solution

Une page `/solutions/<id>` existe **seulement si** `src/data/fr/solutions/<id>.yaml` existe et que l'`id` figure dans `shared/solutions.yaml`. Sans fichier, le nom de la solution mène à son site ; avec, il mène à la fiche, qui garde un lien « Site du projet ».

```yaml
id: keycloak            # id du registre solutions.yaml
updated: 2026-10
summary: "Une phrase qui dit ce que c'est."
why: ["Raison 1", "Raison 2"]                        # pourquoi celle-ci
alternatives:                                         # pourquoi pas une autre
  - { name: Authelia, id: authelia, verdict: "…" }   # id ou url facultatifs : rendent le nom cliquable
limits: ["Limite 1"]
when_not: "Dans quels cas choisir autre chose."
sources: [{ label: "Documentation", url: "https://…" }]
```

Une bonne fiche répond à « pourquoi celle-ci et pas une autre ? » en une page, donne au moins deux alternatives (dont une propriétaire quand elle existe) en disant honnêtement ce qu'elles font mieux, cite ses sources et sa date, et n'invente aucun chiffre (« à vérifier » sinon). La section « Où elle apparaît dans le catalogue » se calcule seule.

## Pages

`fr/pages.yaml` contient À propos, Contact (titre, introduction, avertissement, objets du formulaire, adresses de secours) et Mentions légales.

- Les textes acceptent des liens `[texte](adresse)` et les jetons `{email}` et `{claims_email}`, remplacés par les adresses de contact.
- Un bloc `quote:` affiche un encadré, une ligne par entrée.
- Dans une section, `levels: true` affiche les cartes des niveaux sous le texte ; `roadmap: true` place la section en colonne avec l'avancement par domaine.
- Le premier objet de `contact.topics` (réclamation) part vers l'adresse des réclamations.

## Règles YAML

- **Guillemets obligatoires autour de tout texte contenant `:`** ou commençant par un caractère spécial : `"Proxmox VE : cluster"`, et non `Proxmox VE : cluster`, qui casse le fichier.
- Indentation de deux espaces, pas de tabulations.
- Un composant = exactement 5 valeurs dans `v`.
