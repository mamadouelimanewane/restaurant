# 🎯 GUIDE RAPIDE DE TEST - TerangaReserve

## 🚀 DÉMARRAGE RAPIDE (5 minutes)

### Étape 1: Ouvrir l'Application
👉 **https://restaurant-lilac-rho.vercel.app**

### Étape 2: Test du Bug Corrigé (PRIORITAIRE)
1. Faire défiler jusqu'aux cartes de restaurants
2. Cliquer sur **"Découvrir l'établissement"** (n'importe quelle carte)
3. ✅ **SUCCÈS:** Modal s'ouvre avec les infos du restaurant
4. ❌ **ÉCHEC:** Rien ne se passe → Ouvrir console (F12) et me contacter

### Étape 3: Test de Réservation
1. Dans la modal, cliquer sur l'onglet **"Réservation"**
2. Remplir:
   - Date: Demain
   - Heure: 19:00
   - Convives: 2
   - Téléphone: 77 123 45 67
3. Cliquer **"Continuer vers l'Acompte →"**
4. Vérifier calcul: **12 000 FCFA** (2 × 30000 × 20%)
5. Cliquer **"Orange Money"**
6. ✅ **SUCCÈS:** Vue succès avec récapitulatif

### Étape 4: Test Mobile
1. Ouvrir DevTools (F12)
2. Activer mode responsive (Ctrl+Shift+M)
3. Sélectionner "iPhone 12 Pro"
4. ✅ **SUCCÈS:** Bottom navigation visible en bas
5. Ouvrir un restaurant → Modal en "bottom sheet"

### Étape 5: Test Carte Interactive
1. Cliquer **"🗺️ Cartographie"** (header)
2. Cliquer bouton **"🎯 Locate Me"** (en bas à droite)
3. Accepter la géolocalisation
4. ✅ **SUCCÈS:** Carte centrée sur votre position

---

## 📊 RÉSULTATS ATTENDUS

### ✅ Tous les Tests Passent
**Félicitations !** L'application est prête pour la production.

### ⚠️ Quelques Avertissements
**Action:** Noter les problèmes mineurs et continuer.

### ❌ Échecs Critiques
**Action:** 
1. Ouvrir console (F12)
2. Copier les erreurs
3. Prendre une capture d'écran
4. Me contacter immédiatement

---

## 🔧 COMMANDES CONSOLE UTILES

Ouvrir la console (F12) et tester:

```javascript
// Tester l'ouverture de modal directement
window.openBooking(1)

// Vérifier que les fonctions sont disponibles
console.log(typeof window.openBooking) // doit afficher "function"

// Compter les restaurants affichés
document.querySelectorAll('.booking-card').length // doit afficher 26

// Vérifier la modal
document.getElementById('bookingModal') // doit exister
```

---

## 📁 FICHIERS DE RÉFÉRENCE

### Documentation
- `TEST_SUMMARY.md` - Résumé complet des tests
- `TESTING_CHECKLIST.md` - Checklist exhaustive (80+ éléments)
- `BUGFIX_MODAL.md` - Documentation du bug corrigé

### Outils
- `test-dashboard.html` - Dashboard de test interactif
- `app.js` - Code source principal
- `responsive.css` - Styles mobile

---

## 🎯 ÉLÉMENTS CRITIQUES À TESTER

### 1. Navigation (5 éléments)
- [ ] Lien Cartographie
- [ ] Bouton Mon Dashboard
- [ ] Bouton Mon Passeport
- [ ] Bouton Espace Restaurateur
- [ ] Mobile menu toggle

### 2. Recherche (5 éléments)
- [ ] Input destination
- [ ] Input date
- [ ] Select heure
- [ ] Input nombre de personnes
- [ ] Bouton Rechercher

### 3. Filtres (7 éléments)
- [ ] Checkbox Dakar
- [ ] Checkbox Saly
- [ ] Checkbox Saint-Louis
- [ ] Checkbox Cap Skirring
- [ ] Checkbox Africaine
- [ ] Checkbox Fruits de Mer
- [ ] Checkbox Chic

### 4. Cartes Restaurants (2 éléments)
- [ ] **Bouton "Découvrir l'établissement"** ⭐ CRITIQUE
- [ ] Lien "Voir sur la carte"

### 5. Modal (10 éléments)
- [ ] Bouton fermer (×)
- [ ] Onglet Le Restaurant
- [ ] Onglet La Carte
- [ ] Onglet Avis
- [ ] Onglet Réservation
- [ ] Galerie prev (‹)
- [ ] Galerie next (›)
- [ ] Input date réservation
- [ ] Input heure réservation
- [ ] Input nombre de convives

### 6. Paiement (3 éléments)
- [ ] Bouton Orange Money
- [ ] Bouton Wave
- [ ] Bouton Retour

### 7. Mobile (5 éléments)
- [ ] Bottom nav Explorer
- [ ] Bottom nav Carte
- [ ] Bottom nav Concierge
- [ ] Bottom nav Passeport
- [ ] Bottom nav Profil

### 8. Carte Interactive (2 éléments)
- [ ] Bouton Locate Me
- [ ] Marqueurs restaurants cliquables

---

## ⏱️ TEMPS ESTIMÉ

- **Test Rapide:** 5 minutes
- **Test Complet:** 30 minutes
- **Test Exhaustif:** 2 heures

---

## 🆘 EN CAS DE PROBLÈME

### Problème: Modal ne s'ouvre pas
**Solution:**
1. Ouvrir console (F12)
2. Chercher des erreurs rouges
3. Vérifier que `window.openBooking` existe
4. Rafraîchir la page (Ctrl+F5)

### Problème: Géolocalisation ne fonctionne pas
**Solution:**
1. Vérifier que le site est en HTTPS
2. Vérifier les permissions du navigateur
3. Essayer un autre navigateur

### Problème: Bottom nav ne s'affiche pas
**Solution:**
1. Vérifier la largeur de fenêtre (< 768px)
2. Activer mode responsive dans DevTools
3. Rafraîchir la page

---

## ✅ CHECKLIST FINALE

Avant de déclarer l'application prête:

- [ ] Bouton "Découvrir l'établissement" fonctionne (5 restaurants testés)
- [ ] Processus de réservation complet fonctionne
- [ ] Expérience mobile optimale
- [ ] Carte interactive avec géolocalisation fonctionne
- [ ] Aucune erreur console critique
- [ ] Performance acceptable (< 3s chargement)

---

## 🎉 FÉLICITATIONS !

Si tous les tests passent, l'application **TerangaReserve** est prête pour la production ! 🚀

**URL Production:** https://restaurant-lilac-rho.vercel.app

---

**Version:** 2.1.1  
**Date:** 12 février 2026  
**Statut:** ✅ Prêt pour tests
