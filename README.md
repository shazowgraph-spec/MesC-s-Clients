# MesC's Clients

Site vitrine one-page pour le hub **MesC's Clients** : les meilleurs clients DonutSMP,
classés, comparés et **100 % gratuits**.

Trois clients au programme :

| # | Client | Note | Prix |
|---|--------|------|------|
| 1 | Anubis Client | 9,9 / 10 | Gratuit |
| 2 | Krypton | 9,6 / 10 | Gratuit |
| 3 | 67Client | 9,3 / 10 | Gratuit |

## Structure

```
mescs-clients/
├─ index.html              → tout le contenu de la page
├─ README.md
├─ style.css              → design system + responsive
├─ main.js                → animations, menu, pétales, FAQ, chapitre actif
├─ bg.jpg                 → décor de fond (placeholder fourni)
├─ grove.svg              → source vectorielle du décor de secours
├─ anubis.png             → logo Anubis (image fournie)
├─ anubis.svg             → logo Anubis (version vectorielle provisoire)
└─ anubis-client-1.21.11.jar → client Anubis téléchargeable
```

Aucune dépendance, aucun build : le HTML, le CSS et le JS se suffisent à
eux-mêmes. Les polices (Chakra Petch, Inter, Silkscreen) viennent de Google
Fonts.

## Lancer le site

Double-clique sur `index.html`, ou lance un petit serveur local :

```bash
cd mescs-clients
python -m http.server 4321
```

Puis ouvre <http://127.0.0.1:4321/>.

## Personnaliser

### Fond du site

Le site utilise `assets/img/bg.jpg` en plein écran, fixe derrière le contenu.
Un décor provisoire est déjà en place. Pour mettre le tien :

1. prépare une image paysage, idéalement **1920 × 1080** ou plus ;
2. remplace `assets/img/bg.jpg` par ton fichier (garde exactement ce nom) ;
3. recharge la page, c'est tout.

Le cadrage est géré par `background-position: center 42%` dans `style.css`
(section `.stage__bg`). Si ton image est plus haute ou plus basse, ajuste cette
valeur pour choisir la zone visible.

### Lien Discord

Tous les boutons Discord pointent vers `https://discord.gg/` (placeholder).
Remplace cette valeur par ton invitation réelle dans `index.html`
(chercher `discord.gg`).

### Logo Anubis

Le fichier `assets/img/anubis.svg` est une version vectorielle dorée provisoire.
Pour utiliser ton image d'origine :

1. place ton fichier dans `assets/img/anubis.png` ;
2. dans `index.html`, remplace
   `<img src="assets/img/anubis.svg" ...>` par
   `<img src="assets/img/anubis.png" ...>`.

L'image est automatiquement calée dans la tuile noire du logo.

### Ajouter un 4e client

Copie un bloc `<article class="client ...">` de la section `#clients`, puis :

- change le nom, la note, les tags, les features et la classe de ruban
  (`client__ribbon--gold`, `--silver`, `--bronze`) ;
- ajoute une colonne dans le tableau du comparateur (`#compare`) ;
- mets à jour les liens du pied de page si besoin.

La grille passe automatiquement sur 3 colonnes, puis 1 colonne sur mobile.

### Changer les couleurs

Tout est centralisé dans `:root`, en haut de `assets/css/style.css` :
`--pink`, `--blossom`, `--gold`, `--grad`, etc. Chaque carte client a aussi ses
deux couleurs locales (`--c1` / `--c2` en style inline).

## Détails techniques

- 100 % statique, responsive, sans framework.
- Décor fixe plein écran + pétales animés (désactivés si
  `prefers-reduced-motion: reduce`).
- Animations au scroll via `IntersectionObserver`.
- Menu mobile accessible (Échap, clic extérieur, `aria-expanded`).
- Rail de chapitres avec section active, panneau client en 3D, compteurs,
  accordéon FAQ exclusif, toast sur les fiches à venir.
- Aucune donnée envoyée nulle part.

## Avertissement

Site communautaire de démonstration, non affilié à Mojang, Microsoft, DonutSMP
ou aux créateurs des clients cités. Les marques appartiennent à leurs
propriétaires respectifs.
