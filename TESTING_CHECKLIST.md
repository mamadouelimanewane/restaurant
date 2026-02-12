# 🧪 Guide de Test Complet - TerangaReserve

**Date:** 12 février 2026  
**Version:** 2.1.1  
**URL de Test:** https://restaurant-lilac-rho.vercel.app

---

## 📋 CHECKLIST DE TEST COMPLÈTE

### ✅ = Testé et Fonctionne | ❌ = Échec | ⚠️ = Attention Requise | ⏳ = À Tester

---

## 1️⃣ HEADER & NAVIGATION (Desktop)

### Navigation Principale
- [ ] **Logo "TerangaReserve.sn"** - Cliquable, retour à l'accueil
- [ ] **Bouton "☰" (Mobile Menu Toggle)** - Affiche/masque le menu mobile
- [ ] **Lien "🗺️ Cartographie"** → Redirige vers `/carte.html`
- [ ] **Bouton "📊 Mon Dashboard"** → Appelle `openUserDashboard()`
- [ ] **Bouton "🛂 Mon Passeport"** → Appelle `openPassport()`
- [ ] **Bouton "Espace Restaurateur"** → Appelle `toggleOwnerDashboard()`
- [ ] **Bouton "Carte"** → Appelle `toggleMapView()`

**Comment tester:**
1. Cliquer sur chaque bouton/lien
2. Vérifier que l'action attendue se produit
3. Vérifier qu'il n'y a pas d'erreur dans la console (F12)

---

## 2️⃣ BARRE DE RECHERCHE

### Champ "Où allez-vous ?"
- [ ] **Input "Où allez-vous ?"** - Focus affiche le dropdown
- [ ] **Dropdown Dakar** - Sélection filtre les restaurants
- [ ] **Dropdown Saly** - Sélection filtre les restaurants
- [ ] **Dropdown Saint-Louis** - Sélection filtre les restaurants
- [ ] **Dropdown Cap Skirring** - Sélection filtre les restaurants
- [ ] **Fermeture dropdown** - Clic extérieur ferme le dropdown

### Autres Champs de Recherche
- [ ] **Input Date** (`#searchDate`) - Sélection de date fonctionne
- [ ] **Select Heure** (`#searchTime`) - Changement d'heure fonctionne
- [ ] **Input Nombre de personnes** (`#searchPax`) - Modification fonctionne
- [ ] **Bouton "Rechercher"** → Appelle `filterRestaurants()`

**Comment tester:**
1. Cliquer dans le champ "Où allez-vous ?"
2. Vérifier que le dropdown s'affiche avec 4 destinations
3. Sélectionner chaque destination et vérifier le filtrage
4. Modifier date, heure, nombre de personnes
5. Cliquer sur "Rechercher"
6. Vérifier que les résultats se mettent à jour

---

## 3️⃣ FILTRES LATÉRAUX

### Filtres Ville
- [ ] **Checkbox "Dakar"** - Filtre les restaurants de Dakar
- [ ] **Checkbox "Saly"** - Filtre les restaurants de Saly
- [ ] **Checkbox "Saint-Louis"** - Filtre les restaurants de Saint-Louis
- [ ] **Checkbox "Cap Skirring"** - Filtre les restaurants de Cap Skirring

### Filtres Type de Cuisine
- [ ] **Checkbox "Africaine"** - Filtre cuisine africaine
- [ ] **Checkbox "Fruits de Mer"** - Filtre fruits de mer
- [ ] **Checkbox "Chic"** - Filtre restaurants chic

### Boutons d'Action
- [ ] **Bouton "🔍 Filtres Avancés"** - Ouvre le panel de filtres avancés
- [ ] **Bouton "Réinitialiser"** - Réinitialise tous les filtres

**Comment tester:**
1. Cocher/décocher chaque checkbox
2. Vérifier que le nombre de restaurants affichés change
3. Vérifier le texte "X établissements trouvés"
4. Tester les combinaisons de filtres
5. Cliquer sur "Réinitialiser" et vérifier que tout se réinitialise

---

## 4️⃣ CARTES DE RESTAURANTS (26 restaurants à tester)

### Pour CHAQUE Restaurant (tester au moins 5 différents):

#### Liens sur la Carte
- [ ] **Lien "📍 Voir sur la carte"** - Ouvre Google Maps avec coordonnées

#### Bouton Principal
- [ ] **Bouton "Découvrir l'établissement"** → Appelle `openBooking(id)`
  - ✅ **CRITIQUE:** Vérifier que la modal s'ouvre
  - ✅ Vérifier que le nom du restaurant s'affiche
  - ✅ Vérifier que l'image s'affiche

**Restaurants à tester en priorité:**
1. Le Lagon 1 (ID: 1)
2. Chez Fatou (ID: 2)
3. Le Bideew (ID: 3)
4. La Maison Rose (ID: 11)
5. Le Petit Jardin (ID: 12)

---

## 5️⃣ MODAL DE RÉSERVATION

### Onglets de Navigation
- [ ] **Onglet "Le Restaurant"** → Appelle `switchModalTab('presentation')`
- [ ] **Onglet "La Carte"** → Appelle `switchModalTab('menu')`
- [ ] **Onglet "Avis"** → Appelle `switchModalTab('reviews')`
- [ ] **Onglet "Réservation"** → Appelle `switchModalTab('booking')`
- [ ] **Onglet "Plan"** (caché) → Appelle `switchModalTab('tables')`

### Bouton de Fermeture
- [ ] **Bouton "×" (close-btn)** → Appelle `closeModal()`

### Galerie d'Images
- [ ] **Bouton "‹" (gallery-prev)** → Appelle `scrollGallery(-1)`
- [ ] **Bouton "›" (gallery-next)** → Appelle `scrollGallery(1)`

### Formulaire de Réservation (`#bookingForm`)
- [ ] **Input Date** (`#bookingDate`) - Sélection fonctionne
- [ ] **Input Heure** (`#bookingTime`) - Sélection fonctionne
- [ ] **Input Nombre de convives** (`#guestCount`) - Modification fonctionne
- [ ] **Input Téléphone** (`#phoneInput`) - Saisie fonctionne
- [ ] **Checkbox SMS** (`#smsNotification`) - Activation/désactivation
- [ ] **Checkbox Email** (`#emailNotification`) - Activation/désactivation
- [ ] **Bouton "Continuer vers l'Acompte →"** - Soumet le formulaire

**Validation du formulaire:**
- Vérifier que tous les champs requis sont remplis
- Vérifier le calcul de l'acompte (20% du prix moyen × nombre de convives)
- Vérifier le passage à l'onglet "payment"

### Sélection de Table
- [ ] **Tables disponibles** - Clic sélectionne la table
- [ ] **Tables occupées** - Clic désactivé (cursor: not-allowed)
- [ ] **Table sélectionnée** - Affichage visuel de la sélection

### Paiement
- [ ] **Bouton "Orange Money"** → Appelle `processPayment('Orange Money')`
- [ ] **Bouton "Wave"** → Appelle `processPayment('Wave')`
- [ ] **Bouton "← Retour"** - Retour à l'onglet réservation

### Vue Succès
- [ ] **Bouton "📄 Facture PDF"** → Appelle `generatePDF()`
- [ ] **Bouton "🚕 Yango/Wave"** → Appelle `openTransportModal()`
- [ ] **Bouton "🎁 Parrainer"** → Appelle `openReferralModal()`
- [ ] **Bouton "Fermer"** → Appelle `closeModal()`

---

## 6️⃣ CONCIERGE IA

### Interface Concierge
- [ ] **Input "Dites-moi votre envie..."** - Saisie fonctionne
- [ ] **Bouton "Inspirer moi"** - Génère des suggestions
- [ ] **Fonction `runConcierge()`** - Analyse et filtre les restaurants

**Comment tester:**
1. Taper "dîner romantique" dans le champ
2. Vérifier que des suggestions apparaissent
3. Tester différentes requêtes:
   - "vue mer"
   - "budget petit"
   - "cuisine française"
   - "Saint-Louis"

---

## 7️⃣ CARTES DE DESTINATION

### 4 Destinations Cliquables
- [ ] **Carte "Dakar"** - Filtre restaurants de Dakar
- [ ] **Carte "Saly"** - Filtre restaurants de Saly
- [ ] **Carte "Saint-Louis"** - Filtre restaurants de Saint-Louis
- [ ] **Carte "Cap Skirring"** - Filtre restaurants de Cap Skirring

**Comment tester:**
1. Cliquer sur chaque carte de destination
2. Vérifier que les restaurants se filtrent
3. Vérifier que le champ de recherche se met à jour

---

## 8️⃣ NAVIGATION MOBILE (Bottom Nav)

**Visible uniquement sur mobile (< 768px)**

- [ ] **Bouton "🏠 Explorer"** → `location.href='/'`
- [ ] **Bouton "🗺️ Carte"** → `location.href='/carte.html'`
- [ ] **Bouton "🤖 Concierge"** → Appelle `toggleChat()`
- [ ] **Bouton "🛂 Passeport"** → Appelle `openPassport()`
- [ ] **Bouton "👤 Profil"** → Appelle `openUserDashboard()`

**Comment tester:**
1. Réduire la fenêtre à < 768px OU utiliser DevTools mode mobile
2. Vérifier que la barre de navigation apparaît en bas
3. Cliquer sur chaque bouton
4. Vérifier l'effet glassmorphism et l'animation

---

## 9️⃣ FOOTER

### Liens Footer
- [ ] **Lien "🔐 Accès Propriétaire"** → Appelle `toggleAdminPortal()`
- [ ] **Lien "👨‍🍳 Espace Restaurateur"** → Appelle `toggleOwnerDashboard()`

---

## 🔟 DASHBOARDS & PORTAILS

### Dashboard Propriétaire (`#ownerDashboard`)
- [ ] **Bouton "×" (fermeture)** → Appelle `toggleOwnerDashboard()`
- [ ] **Onglet "Réservations"** → Appelle `switchOwnerTab('reservations')`
- [ ] **Onglet "Modifier ma Carte"** → Appelle `switchOwnerTab('menu')`
- [ ] **Onglet "Statistiques"** → Appelle `switchOwnerTab('stats')`

### Portail Admin (`#adminPortal`)
- [ ] **Navigation "🏠 Dashboard Central"** → `switchAdminTab('dashboard')`
- [ ] **Navigation "🍽️ Gestion Restaurants"** → `switchAdminTab('restaurants')`
- [ ] **Navigation "👥 Gestion Utilisateurs"** → `switchAdminTab('users')`
- [ ] **Navigation "👁️ Visiteurs & Inscriptions"** → `switchAdminTab('visitors')`
- [ ] **Navigation "⚙️ Config & Commissions"** → `switchAdminTab('settings')`
- [ ] **Navigation "📊 Analytics Globaux"** → `switchAdminTab('analytics')`
- [ ] **Navigation "💾 Backups & Données"** → `switchAdminTab('backups')`
- [ ] **Navigation "🚪 Quitter"** → Appelle `closeAdminPortal()`

### Gestion Menu (Owner)
- [ ] **Bouton "+ Ajouter un Plat"** - Alerte fonctionnalité en cours
- [ ] **Boutons de suppression (×)** → Appelle `removeMenuItem(this)`

### Gestion Restaurants (Admin)
- [ ] **Bouton "+ Nouveau Restaurant"** → Appelle `toggleAddRestoModal()`
- [ ] **Formulaire d'ajout** (`#addRestoForm`) - Soumission fonctionne

### Paramètres (Admin)
- [ ] **Input "Taux de commission"** (`#commissionRate`)
- [ ] **Bouton "Mettre à jour"** → Appelle `updateCommission()`

### Export de Données
- [ ] **Bouton "Exporter JSON"** → Appelle `exportData('json')`
- [ ] **Bouton "Exporter CSV"** → Appelle `exportData('csv')`

---

## 1️⃣1️⃣ PASSEPORT GASTRONOMIQUE

- [ ] **Ouverture** → Fonction `openPassport()`
- [ ] **Affichage des tampons** - Villes visitées
- [ ] **Fermeture** - Bouton de fermeture fonctionne

---

## 1️⃣2️⃣ CHAT WIDGET

- [ ] **Bouton d'ouverture** → Appelle `toggleChatWidget()`
- [ ] **Bouton de fermeture "×"** → Appelle `toggleChatWidget()`
- [ ] **Input message** (`#chatInput`) - Saisie fonctionne
- [ ] **Bouton d'envoi** → Appelle `sendChatMessage()`
- [ ] **Options rapides:**
  - [ ] "ℹ️ Informations" → `selectChatOption('info')`
  - [ ] "📅 Aide réservation" → `selectChatOption('reservation')`
  - [ ] "✏️ Modifier" → `selectChatOption('modification')`
  - [ ] "💬 WhatsApp" → `selectChatOption('whatsapp')`

---

## 1️⃣3️⃣ CARTE INTERACTIVE (`carte.html`)

### Boutons de la Carte
- [ ] **Bouton "🎯 Locate Me"** → Appelle `locateUser()`
  - Demande permission géolocalisation
  - Centre la carte sur position utilisateur
  - Affiche marqueur avec animation pulse

### Fonctionnalités Carte
- [ ] **Marqueurs restaurants** - Clic affiche popup
- [ ] **Popup "Réserver"** → Appelle `openBooking(id)`
- [ ] **Zoom/Pan** - Navigation carte fonctionne
- [ ] **Itinéraire** - Calcul de route fonctionne

---

## 🎯 TESTS DE RÉGRESSION CRITIQUES

### Scénario 1: Réservation Complète
1. [ ] Ouvrir l'application
2. [ ] Cliquer sur "Découvrir l'établissement" (Le Lagon 1)
3. [ ] Vérifier que la modal s'ouvre
4. [ ] Naviguer entre tous les onglets
5. [ ] Aller à "Réservation"
6. [ ] Remplir le formulaire (date, heure, 2 personnes, téléphone)
7. [ ] Cliquer "Continuer vers l'Acompte"
8. [ ] Vérifier calcul: 2 × 30000 × 0.2 = 12000 FCFA
9. [ ] Cliquer "Orange Money"
10. [ ] Vérifier vue succès avec récapitulatif
11. [ ] Cliquer "Facture PDF"
12. [ ] Vérifier téléchargement PDF

### Scénario 2: Filtrage Multi-Critères
1. [ ] Cocher "Dakar" + "Fruits de Mer"
2. [ ] Vérifier que seuls les restaurants correspondants s'affichent
3. [ ] Ajouter "Chic"
4. [ ] Vérifier mise à jour
5. [ ] Cliquer "Réinitialiser"
6. [ ] Vérifier que tous les restaurants réapparaissent

### Scénario 3: Mobile Experience
1. [ ] Passer en mode mobile (< 768px)
2. [ ] Vérifier apparition bottom nav
3. [ ] Tester chaque bouton de la bottom nav
4. [ ] Ouvrir une modal
5. [ ] Vérifier affichage en "bottom sheet"
6. [ ] Vérifier animation slide-up

---

## 📊 RÉSULTATS ATTENDUS

### Éléments Interactifs Totaux
- **Boutons:** ~80+
- **Liens:** ~30+
- **Formulaires:** ~5
- **Inputs:** ~15+
- **Checkboxes:** ~7
- **Selects:** ~2

### Taux de Réussite Cible
- ✅ **95%+** des éléments fonctionnels
- ⚠️ **< 5%** avec avertissements mineurs
- ❌ **0%** d'échecs critiques

---

## 🐛 RAPPORT DE BUGS

### Template de Rapport
```
BUG #XXX: [Titre Court]
Sévérité: [Critique / Haute / Moyenne / Basse]
Élément: [Nom du bouton/lien/formulaire]
Action: [Ce qui a été fait]
Résultat Attendu: [Ce qui devrait se passer]
Résultat Obtenu: [Ce qui s'est passé]
Console Errors: [Copier les erreurs de la console]
Étapes de Reproduction:
1. ...
2. ...
3. ...
```

---

## ✅ VALIDATION FINALE

Avant de déclarer l'application prête:

- [ ] Tous les tests de la checklist complétés
- [ ] Aucun bug critique non résolu
- [ ] Console sans erreurs JavaScript
- [ ] Responsive testé (mobile, tablette, desktop)
- [ ] Performance acceptable (< 3s chargement)
- [ ] Accessibilité de base respectée

---

## 📝 NOTES

**Navigateurs à tester:**
- Chrome (Desktop & Mobile)
- Firefox (Desktop)
- Safari (iOS)
- Edge (Desktop)

**Résolutions à tester:**
- Mobile: 375px, 414px
- Tablette: 768px, 1024px
- Desktop: 1366px, 1920px

**Raccourcis Utiles:**
- `F12` - Ouvrir DevTools
- `Ctrl+Shift+M` - Mode responsive
- `Ctrl+Shift+C` - Inspecteur d'élément
- `Ctrl+Shift+J` - Console JavaScript

---

**Dernière mise à jour:** 12 février 2026  
**Testeur:** _____________________  
**Date du test:** _____________________  
**Résultat global:** ⏳ En attente
