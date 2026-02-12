# 🧪 Guide de Test - TerangaReserve

**URL de Test** : https://restaurant-lilac-rho.vercel.app  
**Version** : 2.2.0 (Ultra-Optimisée)  
**Date** : 12 février 2026

---

## 📋 Checklist de Test Complète

### ✅ 1. Chargement Initial & Performance

#### Tests de Base
- [ ] La page se charge en moins de 2 secondes (4G)
- [ ] Le contenu principal s'affiche en moins de 1 seconde
- [ ] Aucune erreur dans la console du navigateur
- [ ] Tous les styles CSS sont appliqués correctement
- [ ] Les polices Google Fonts se chargent correctement

#### Tests de Performance
- [ ] Ouvrir DevTools → Network
- [ ] Vérifier que `main.js` fait ~30 KB (pas 835 KB)
- [ ] Vérifier le chargement progressif des chunks
- [ ] Vérifier que les images sont en WebP
- [ ] Vérifier les preload hints dans le HTML

**Comment tester** :
1. Ouvrir https://restaurant-lilac-rho.vercel.app
2. F12 → Network → Recharger (Ctrl+R)
3. Vérifier la taille des fichiers
4. Vérifier le waterfall de chargement

---

### ✅ 2. Affichage des Restaurants

#### Liste des Restaurants
- [ ] Au moins 10 restaurants s'affichent
- [ ] Chaque carte restaurant contient :
  - [ ] Image (format WebP)
  - [ ] Nom du restaurant
  - [ ] Note (étoiles)
  - [ ] Prix moyen
  - [ ] Cuisine
  - [ ] Localisation
  - [ ] Bouton "Découvrir l'établissement"

#### Images
- [ ] Les images se chargent rapidement
- [ ] Les images sont nettes et de bonne qualité
- [ ] Pas d'images cassées (404)
- [ ] Format WebP confirmé (DevTools → Network → Type)

**Comment tester** :
1. Scroller dans la liste
2. Vérifier chaque carte
3. Inspecter une image → Network → Vérifier l'URL contient `fm=webp`

---

### ✅ 3. Filtres Avancés

#### Ouverture du Modal
- [ ] Cliquer sur "Filtres Avancés" dans la sidebar
- [ ] Le modal s'ouvre avec une animation fluide
- [ ] Tous les filtres sont visibles

#### Filtres Disponibles
- [ ] **Prix** : Slider min/max fonctionne
- [ ] **Note minimale** : Boutons 1-4.5 étoiles
- [ ] **Distance** : Slider 1-100 km
- [ ] **Cuisine** : Checkboxes multiples
- [ ] **Ambiance** : Checkboxes (Calme, Festif, etc.)
- [ ] **Caractéristiques** :
  - [ ] Ouvert maintenant
  - [ ] Parking
  - [ ] Accessible PMR
  - [ ] WiFi
  - [ ] Terrasse

#### Application des Filtres
- [ ] Sélectionner plusieurs filtres
- [ ] Cliquer "Appliquer les filtres"
- [ ] Les restaurants sont filtrés correctement
- [ ] Le compteur de résultats est mis à jour
- [ ] Toast de confirmation s'affiche

#### Réinitialisation
- [ ] Cliquer "Réinitialiser les filtres"
- [ ] Tous les restaurants réapparaissent
- [ ] Les filtres sont remis à zéro

**Comment tester** :
1. Sidebar → "Filtres Avancés"
2. Tester chaque type de filtre
3. Appliquer et vérifier les résultats
4. Réinitialiser

---

### ✅ 4. Réservation de Restaurant

#### Ouverture du Modal
- [ ] Cliquer "Découvrir l'établissement" sur un restaurant
- [ ] Le modal de réservation s'ouvre
- [ ] Onglets visibles : Aperçu, Menu, Avis, Réserver

#### Onglet Aperçu
- [ ] Description du restaurant
- [ ] Images
- [ ] Caractéristiques
- [ ] Localisation

#### Onglet Menu
- [ ] Catégories (Entrées, Plats, etc.)
- [ ] Items avec prix
- [ ] Images des plats

#### Onglet Avis
- [ ] Liste des avis
- [ ] Notes par catégorie
- [ ] Bouton "Écrire un avis"

#### Onglet Réserver
- [ ] Formulaire de réservation :
  - [ ] Date
  - [ ] Heure
  - [ ] Nombre de personnes
  - [ ] Téléphone
  - [ ] Email
- [ ] Plan des tables
- [ ] Sélection de table fonctionne
- [ ] Bouton "Confirmer la réservation"

#### Processus de Réservation
- [ ] Remplir le formulaire
- [ ] Sélectionner une table
- [ ] Confirmer
- [ ] Modal de paiement s'ouvre
- [ ] Options : Wave, Orange Money, Free Money
- [ ] Payer
- [ ] **Écran de succès s'affiche avec 4 boutons** :
  - [ ] Facture PDF
  - [ ] Réserver Transport
  - [ ] Parrainer
  - [ ] Fermer

**Comment tester** :
1. Choisir un restaurant
2. Parcourir tous les onglets
3. Faire une réservation complète
4. Vérifier l'écran de succès

---

### ✅ 5. Transport (Yango/Heetch/Yassir)

#### Depuis l'Écran de Succès
- [ ] Cliquer "Réserver Transport"
- [ ] Modal de transport s'ouvre
- [ ] 3 services affichés :
  - [ ] Yango (🚕 jaune)
  - [ ] Heetch (🚗 rouge)
  - [ ] Yassir (🚖 vert)

#### Réservation Transport
- [ ] Cliquer sur un service
- [ ] Demande de géolocalisation (autoriser)
- [ ] Redirection vers l'app ou fallback
- [ ] Toast "+5 points" s'affiche

**Comment tester** :
1. Après une réservation réussie
2. Cliquer "Réserver Transport"
3. Tester chaque service
4. Autoriser la géolocalisation

---

### ✅ 6. Système de Parrainage

#### Ouverture du Modal
- [ ] Dashboard → "Parrainage" OU
- [ ] Écran de succès → "Parrainer"
- [ ] Modal de parrainage s'ouvre
- [ ] Code de parrainage affiché

#### Partage
- [ ] Bouton "Copier le code" fonctionne
- [ ] Toast de confirmation
- [ ] Bouton WhatsApp ouvre WhatsApp
- [ ] Bouton Twitter ouvre Twitter
- [ ] Bouton Partager (API native si disponible)

**Comment tester** :
1. Ouvrir le dashboard (icône utilisateur)
2. Cliquer "Parrainage"
3. Tester chaque option de partage

---

### ✅ 7. Gamification (Badges & Défis)

#### Dashboard
- [ ] Cliquer sur l'icône utilisateur (header)
- [ ] Dashboard s'ouvre
- [ ] Section VIP visible (si applicable)
- [ ] Statistiques affichées :
  - [ ] Visites totales
  - [ ] Dépenses totales
  - [ ] Points totaux
  - [ ] Avis écrits

#### Badges
- [ ] Section "Mes Badges" visible
- [ ] Top 3 badges affichés
- [ ] Cliquer "Voir tous les badges"
- [ ] Modal avec tous les badges
- [ ] Badges débloqués en couleur
- [ ] Badges verrouillés en gris

#### Déblocage de Badge
- [ ] Faire une action (réservation, avis, etc.)
- [ ] Notification de badge débloqué
- [ ] Badge ajouté à la collection
- [ ] Points ajoutés

**Comment tester** :
1. Ouvrir le dashboard
2. Vérifier les stats
3. Voir tous les badges
4. Faire des actions pour débloquer

---

### ✅ 8. Système d'Avis

#### Écrire un Avis
- [ ] Modal restaurant → Onglet "Avis"
- [ ] Cliquer "Écrire un avis"
- [ ] Modal d'avis s'ouvre
- [ ] **4 notes détaillées** :
  - [ ] Nourriture (🍽️)
  - [ ] Service (👨‍🍳)
  - [ ] Ambiance (🎵)
  - [ ] Rapport qualité/prix (💰)
- [ ] Note globale calculée automatiquement
- [ ] Zone de texte (500 caractères max)
- [ ] Compteur de caractères
- [ ] Upload de photos (optionnel)

#### Soumission
- [ ] Remplir toutes les notes
- [ ] Écrire un commentaire
- [ ] Soumettre
- [ ] Toast "+10 points"
- [ ] Avis ajouté à la liste

#### Affichage des Avis
- [ ] Avis affichés avec :
  - [ ] Avatar
  - [ ] Nom
  - [ ] Note globale
  - [ ] 4 notes détaillées
  - [ ] Commentaire
  - [ ] Photos (si présentes)
  - [ ] Badge "Réservation vérifiée"
  - [ ] Bouton "Utile"

**Comment tester** :
1. Ouvrir un restaurant
2. Onglet "Avis"
3. Écrire un avis complet
4. Vérifier l'affichage

---

### ✅ 9. Chat Widget

#### Ouverture
- [ ] Bulle de chat visible (bas-droite)
- [ ] Couleur verte (WhatsApp style)
- [ ] Cliquer sur la bulle
- [ ] Fenêtre de chat s'ouvre

#### Fonctionnalités
- [ ] Message de bienvenue affiché
- [ ] 4 boutons d'action rapide :
  - [ ] Informations sur un restaurant
  - [ ] Aide à la réservation
  - [ ] Modifier une réservation
  - [ ] Parler avec un conseiller (WhatsApp)
- [ ] Zone de saisie de message
- [ ] Bouton d'envoi

#### Interaction
- [ ] Cliquer sur un bouton d'action
- [ ] Réponse automatique
- [ ] Taper un message
- [ ] Envoyer
- [ ] Message affiché

**Comment tester** :
1. Chercher la bulle verte en bas à droite
2. Ouvrir le chat
3. Tester les boutons d'action
4. Envoyer un message

---

### ✅ 10. PWA (Progressive Web App)

#### Installation
- [ ] Bannière d'installation apparaît (après 2s)
- [ ] Cliquer "Installer"
- [ ] App s'installe
- [ ] Icône ajoutée à l'écran d'accueil

#### Fonctionnement Offline
- [ ] Installer l'app
- [ ] Couper la connexion internet
- [ ] Ouvrir l'app
- [ ] Contenu de base accessible
- [ ] Message "Hors ligne" si applicable

#### Notifications
- [ ] Demande de permission pour notifications
- [ ] Autoriser
- [ ] Notifications fonctionnent (si implémenté)

**Comment tester** :
1. Attendre la bannière d'installation
2. Installer l'app
3. Tester offline
4. Tester les notifications

---

### ✅ 11. Carte Interactive

#### Accès
- [ ] Cliquer "Carte Gastronomique" (navigation)
- [ ] Page carte s'ouvre
- [ ] Carte Leaflet chargée
- [ ] Marqueurs restaurants visibles

#### Interaction
- [ ] Cliquer sur un marqueur
- [ ] Popup avec infos restaurant
- [ ] Zoom in/out fonctionne
- [ ] Déplacement de la carte fluide
- [ ] Filtres de la sidebar fonctionnent

**Comment tester** :
1. Navigation → "Carte"
2. Interagir avec la carte
3. Cliquer sur les marqueurs
4. Tester les filtres

---

### ✅ 12. Dashboard Propriétaire (Admin)

#### Accès
- [ ] Bouton "Espace Propriétaire" visible
- [ ] Cliquer
- [ ] Dashboard propriétaire s'ouvre

#### Fonctionnalités
- [ ] Statistiques affichées
- [ ] Graphiques (Chart.js)
- [ ] Liste des réservations
- [ ] Gestion des tables
- [ ] Ajout de restaurant (si admin)

**Comment tester** :
1. Chercher "Espace Propriétaire"
2. Explorer le dashboard
3. Vérifier les graphiques

---

### ✅ 13. Passeport Gastronomique

#### Ouverture
- [ ] Dashboard → "Passeport" OU
- [ ] Navigation → "Passeport"
- [ ] Modal passeport s'ouvre

#### Contenu
- [ ] Grille de villes du Sénégal
- [ ] Villes visitées avec tampon et date
- [ ] Villes non visitées en gris
- [ ] Récompense si toutes visitées

**Comment tester** :
1. Ouvrir le passeport
2. Vérifier les tampons
3. Visiter des restaurants de différentes villes

---

### ✅ 14. Lazy Loading & Performance

#### Chargement Progressif
- [ ] Ouvrir DevTools → Network
- [ ] Recharger la page
- [ ] Vérifier que seulement les scripts critiques se chargent
- [ ] Attendre 2 secondes
- [ ] Vérifier que `reviews.js` et `dashboard.js` se chargent
- [ ] Attendre 4 secondes
- [ ] Vérifier que les autres modules se chargent

#### Chunks
- [ ] `main.js` : ~30 KB ✅
- [ ] `vendor-pdf.js` : chargé à la demande
- [ ] `vendor-charts.js` : chargé à la demande
- [ ] `features-*.js` : chargés progressivement

**Comment tester** :
1. F12 → Network
2. Recharger
3. Observer le waterfall
4. Vérifier le timing de chargement

---

## 🧪 Tests Lighthouse

### Comment Tester
1. Ouvrir https://restaurant-lilac-rho.vercel.app
2. F12 → Lighthouse
3. Sélectionner :
   - [ ] Performance
   - [ ] Accessibility
   - [ ] Best Practices
   - [ ] SEO
   - [ ] PWA
4. Mode : Mobile
5. Cliquer "Generate report"

### Scores Attendus
- **Performance** : 90-95/100
- **Accessibility** : 95+/100
- **Best Practices** : 90+/100
- **SEO** : 95+/100
- **PWA** : 100/100

### Métriques Clés
- **First Contentful Paint** : < 1s
- **Largest Contentful Paint** : < 2.5s
- **Time to Interactive** : < 2s
- **Speed Index** : < 2s
- **Total Blocking Time** : < 300ms
- **Cumulative Layout Shift** : < 0.1

---

## 📱 Tests Mobile

### Responsive Design
- [ ] Tester sur mobile (< 768px)
- [ ] Tester sur tablette (768-1024px)
- [ ] Tester sur desktop (> 1024px)
- [ ] Tous les éléments s'adaptent
- [ ] Pas de scroll horizontal
- [ ] Boutons assez grands pour le touch

### Fonctionnalités Mobile
- [ ] Géolocalisation fonctionne
- [ ] Transport apps s'ouvrent
- [ ] Chat widget responsive
- [ ] Modals adaptés
- [ ] Formulaires utilisables

**Comment tester** :
1. F12 → Toggle device toolbar
2. Tester différentes tailles
3. Ou tester sur un vrai mobile

---

## 🐛 Tests de Bugs Connus

### Vérifications
- [ ] Pas d'erreurs 404 dans la console
- [ ] Pas d'erreurs JavaScript
- [ ] Toutes les images se chargent
- [ ] Tous les liens fonctionnent
- [ ] Pas de texte manquant
- [ ] Pas de styles cassés

---

## ✅ Checklist Finale

### Fonctionnalités Critiques
- [ ] Affichage des restaurants
- [ ] Réservation complète
- [ ] Paiement
- [ ] Génération PDF
- [ ] Transport booking
- [ ] Parrainage
- [ ] Avis

### Fonctionnalités Secondaires
- [ ] Gamification
- [ ] Dashboard
- [ ] Chat widget
- [ ] Filtres avancés
- [ ] Carte interactive
- [ ] Passeport
- [ ] PWA

### Performance
- [ ] Chargement < 2s
- [ ] Lazy loading fonctionne
- [ ] Images WebP
- [ ] Chunks optimisés
- [ ] Lighthouse > 90

---

## 📊 Rapport de Test

### Template
```
Date: __/__/____
Testeur: ____________
Navigateur: ____________
Appareil: ____________

Fonctionnalités testées: __/14
Bugs trouvés: ___
Bugs critiques: ___

Score Lighthouse:
- Performance: ___/100
- Accessibility: ___/100
- Best Practices: ___/100
- SEO: ___/100
- PWA: ___/100

Commentaires:
_______________________
_______________________
```

---

**🎯 Objectif** : Toutes les cases cochées ✅  
**🚀 Status** : Prêt pour les tests !
