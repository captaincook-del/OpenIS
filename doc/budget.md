# Budget

La page Budget et le résumé du catalogue sont **calculés à partir du catalogue** : somme des composants visibles pour la taille choisie, comparée à l'équivalent propriétaire. Le calcul est dans `src/lib/budget.js`, les paramètres dans `src/data/shared/pricing.yaml` (formules en commentaire en tête du fichier), l'avertissement affiché dans `src/data/fr/pricing.yaml`.

## Le coût d'un composant

Chaque composant porte un bloc `cost:` exprimé **au niveau Standard** :

```yaml
cost: { unit: core, price: 315, min: 5000, support: 34, setup: [2000, 8000, 40000], etp: [0.05, 0.2, 1.0],
        ref: "VMware Cloud Foundation (vCenter, vSAN, NSX), 350 $/cœur/an", src: "https://…" }
```

| Champ | Sens |
|---|---|
| `unit` | ce qui se compte : `user`, `server`, `core`, `site`, ou `flat` (une seule fois) |
| `price` | prix annuel de l'équivalent propriétaire, en € par unité (prix public ou constaté, avant remise) |
| `min` | contrat minimal annuel côté propriétaire (facultatif) |
| `from` | niveau à partir duquel l'équivalent propriétaire est réellement acheté (facultatif) |
| `support` | souscription de support du logiciel libre, en € par unité et par an (facultatif) |
| `setup` | mise en place, une fois, pour `[startup, pme, grande]` |
| `etp` | temps d'administration pour `[startup, pme, grande]`, en équivalents temps plein |
| `ref` | produit propriétaire de référence et prix retenu : c'est ce qu'il faut vérifier |
| `src` | pages consultées pour vérifier le prix ; absent = estimation, faute de prix publié |

Un exemple commenté avec son calcul détaillé est dans [exemples/cout-composant.yaml](exemples/cout-composant.yaml).

## Paramètres globaux (`shared/pricing.yaml`)

- `sizes` : volumes par taille (utilisateurs, serveurs, cœurs, sites), `min_factor` et `price_factor` (éditions PME « Essentials » pour une startup, remise de volume pour une grande entreprise).
- `levels` : multiplicateurs par niveau pour la mise en place, le support, l'administration et les licences propriétaires.
- `share` : part de la mise en place et du temps d'administration aussi comptée côté propriétaire (un logiciel propriétaire s'installe et s'administre aussi).
- `etp_cost` : coût annuel chargé d'un équivalent temps plein ; `horizon_years` : durée de la comparaison.

## Formules (niveau n)

```
libre        = setup × levels.setup[n]
             + années × (unités × support × levels.support[n] + etp × levels.etp[n] × etp_cost)
propriétaire = setup × levels.setup[n] × share.setup
             + années × ( max(min × min_factor, unités × price × price_factor) × levels.proprietary[n]
                        + etp × levels.etp[n] × share.etp × etp_cost )
```

La licence propriétaire vaut 0 en dessous du niveau `from`.

## Règles de chiffrage

- **Ne jamais compter deux fois la même licence.** Microsoft 365 E3 est réparti entre les composants qu'il couvre (bureautique, Exchange, SharePoint, Windows Enterprise, Intune, Entra ID) ; un produit inclus dans une offre déjà comptée vaut `price: 0` avec une `ref` qui le dit (vSAN dans VMware Cloud Foundation, agents de bases de données dans Veeam…). De même, un outil libre déjà compté dans un autre domaine (OPNsense, NetBox, BookStack…) n'est pas repayé.
- **Citer ses sources** : tout prix modifié porte l'URL consultée dans `src`, et le message de commit dit d'où vient le chiffre (devis, grille tarifaire publique, retour d'expérience) et sa date.
- Les prix publics ont été vérifiés le 2026-11-07 (1 $ ≈ 0,90 €) sur les pages des éditeurs ou de revendeurs. Les composants sans `src` gardent une estimation : l'éditeur ne publie pas ses prix (Splunk, Darktrace, Recorded Future, ServiceNow, Infoblox…).
- Repères du mainteneur : TheHive coûte environ 50 k€/an dans son offre Cloud ; VMware (vCenter) se chiffre autour de 100 k€/an pour une PME bien équipée.

Ces chiffres restent des **ordres de grandeur** : à confirmer par des devis avant publication.
