# 🔍 SCRIPT DE DIAGNOSTIC - À copier dans la console

## Instructions

1. Ouvrir https://restaurant-lilac-rho.vercel.app **EN MODE NAVIGATION PRIVÉE**
2. Appuyer sur **F12** pour ouvrir la console
3. **Copier-coller** le script ci-dessous dans la console
4. Appuyer sur **Entrée**
5. **Copier TOUT le résultat** et me l'envoyer

---

## Script de Diagnostic Complet

```javascript
console.clear();
console.log('%c═══════════════════════════════════════════════', 'color: #3498db; font-weight: bold');
console.log('%c🔍 DIAGNOSTIC TERANGARESERVE v2.3.0', 'color: #3498db; font-size: 18px; font-weight: bold');
console.log('%c═══════════════════════════════════════════════', 'color: #3498db; font-weight: bold');
console.log('');

// Test 1: Version du fichier app.js
console.log('%c📦 TEST 1: Version du fichier app.js', 'color: #f39c12; font-weight: bold');
const appFiles = performance.getEntriesByType('resource')
    .filter(r => r.name.includes('app') && r.name.includes('.js'))
    .map(r => r.name);
console.log('Fichiers app.js chargés:', appFiles);
const hasCorrectVersion = appFiles.some(f => f.includes('app-Cd-Hx2V6.js'));
console.log(hasCorrectVersion ? '✅ Version correcte (app-Cd-Hx2V6.js)' : '❌ MAUVAISE VERSION - Cache pas vidé!');
console.log('');

// Test 2: window.openBooking existe?
console.log('%c🔧 TEST 2: window.openBooking existe?', 'color: #f39c12; font-weight: bold');
console.log('typeof window.openBooking:', typeof window.openBooking);
console.log(typeof window.openBooking === 'function' ? '✅ window.openBooking existe' : '❌ window.openBooking N\'EXISTE PAS!');
console.log('');

// Test 3: Nombre de cartes restaurants
console.log('%c🍽️ TEST 3: Cartes restaurants', 'color: #f39c12; font-weight: bold');
const cards = document.querySelectorAll('.booking-card');
console.log('Nombre de cartes:', cards.length);
console.log(cards.length > 0 ? '✅ Cartes trouvées' : '❌ AUCUNE CARTE!');
console.log('');

// Test 4: Nombre de boutons
console.log('%c🔘 TEST 4: Boutons "Découvrir l\'établissement"', 'color: #f39c12; font-weight: bold');
const buttons = document.querySelectorAll('.see-availability');
console.log('Nombre de boutons:', buttons.length);
console.log(buttons.length > 0 ? '✅ Boutons trouvés' : '❌ AUCUN BOUTON!');
console.log('');

// Test 5: Inspection du premier bouton
console.log('%c🔬 TEST 5: Inspection du premier bouton', 'color: #f39c12; font-weight: bold');
const firstButton = document.querySelector('.see-availability');
if (firstButton) {
    console.log('Bouton trouvé:', firstButton);
    console.log('- onclick:', firstButton.getAttribute('onclick'));
    console.log('- data-restaurant-id:', firstButton.getAttribute('data-restaurant-id'));
    console.log('- class:', firstButton.className);
    console.log('- text:', firstButton.textContent);
    
    const hasOnclick = firstButton.hasAttribute('onclick');
    const hasDataId = firstButton.hasAttribute('data-restaurant-id');
    console.log(hasOnclick ? '✅ onclick existe' : '❌ onclick MANQUANT!');
    console.log(hasDataId ? '✅ data-restaurant-id existe' : '❌ data-restaurant-id MANQUANT!');
} else {
    console.log('❌ AUCUN BOUTON TROUVÉ!');
}
console.log('');

// Test 6: Modal existe?
console.log('%c📋 TEST 6: Modal existe?', 'color: #f39c12; font-weight: bold');
const modal = document.getElementById('bookingModal');
console.log('Modal trouvée:', modal !== null);
console.log(modal ? '✅ Modal existe' : '❌ Modal N\'EXISTE PAS!');
console.log('');

// Test 7: Erreurs JavaScript
console.log('%c⚠️ TEST 7: Erreurs JavaScript', 'color: #f39c12; font-weight: bold');
console.log('Vérifiez ci-dessus s\'il y a des erreurs en ROUGE');
console.log('');

// Test 8: Test manuel de openBooking
console.log('%c🧪 TEST 8: Test manuel de openBooking', 'color: #f39c12; font-weight: bold');
if (typeof window.openBooking === 'function') {
    console.log('Tentative d\'appel de window.openBooking(1)...');
    try {
        window.openBooking(1);
        console.log('✅ openBooking(1) appelé sans erreur');
        console.log('Vérifiez si la modal s\'est ouverte sur la page');
    } catch (error) {
        console.error('❌ ERREUR lors de l\'appel:', error);
    }
} else {
    console.log('❌ Impossible de tester - window.openBooking n\'existe pas');
}
console.log('');

// Test 9: Simulation de clic
console.log('%c🖱️ TEST 9: Simulation de clic sur bouton', 'color: #f39c12; font-weight: bold');
if (firstButton) {
    console.log('Tentative de clic sur le premier bouton...');
    try {
        firstButton.click();
        console.log('✅ Clic simulé sans erreur');
        console.log('Vérifiez si la modal s\'est ouverte sur la page');
    } catch (error) {
        console.error('❌ ERREUR lors du clic:', error);
    }
} else {
    console.log('❌ Impossible de tester - aucun bouton trouvé');
}
console.log('');

// Résumé
console.log('%c═══════════════════════════════════════════════', 'color: #27ae60; font-weight: bold');
console.log('%c📊 RÉSUMÉ DU DIAGNOSTIC', 'color: #27ae60; font-size: 18px; font-weight: bold');
console.log('%c═══════════════════════════════════════════════', 'color: #27ae60; font-weight: bold');
console.log('');
console.log('Version correcte?', hasCorrectVersion ? '✅' : '❌ VIDER LE CACHE!');
console.log('window.openBooking?', typeof window.openBooking === 'function' ? '✅' : '❌');
console.log('Cartes restaurants?', cards.length > 0 ? `✅ (${cards.length})` : '❌');
console.log('Boutons?', buttons.length > 0 ? `✅ (${buttons.length})` : '❌');
console.log('onclick sur bouton?', firstButton && firstButton.hasAttribute('onclick') ? '✅' : '❌');
console.log('Modal existe?', modal !== null ? '✅' : '❌');
console.log('');
console.log('%c📋 COPIEZ TOUT CE RÉSULTAT ET ENVOYEZ-LE MOI', 'color: #e74c3c; font-size: 16px; font-weight: bold; background: yellow; padding: 5px');
console.log('');
```

---

## Résultat Attendu (si tout fonctionne)

```
✅ Version correcte (app-Cd-Hx2V6.js)
✅ window.openBooking existe
✅ Cartes trouvées (26)
✅ Boutons trouvés (26)
✅ onclick existe
✅ data-restaurant-id existe
✅ Modal existe
✅ openBooking(1) appelé sans erreur
✅ Clic simulé sans erreur
```

---

## Si la Version est Incorrecte

**Vous verrez:** `❌ MAUVAISE VERSION - Cache pas vidé!`

**Solution:**
1. Fermer complètement le navigateur
2. Rouvrir en mode navigation privée (Ctrl + Shift + N)
3. Aller sur https://restaurant-lilac-rho.vercel.app
4. Relancer le diagnostic

---

## Si window.openBooking n'existe pas

**Vous verrez:** `❌ window.openBooking N'EXISTE PAS!`

**Cela signifie:**
- Le fichier app.js n'est pas chargé correctement
- Ou il y a une erreur JavaScript qui empêche le chargement

**Solution:**
- Vérifier les erreurs en ROUGE dans la console
- Me les envoyer toutes

---

## Si les Boutons n'ont pas onclick

**Vous verrez:** `❌ onclick MANQUANT!`

**Cela signifie:**
- L'ancienne version est en cache
- Vider le cache et réessayer

---

## Après le Diagnostic

**Envoyez-moi:**
1. ✅ TOUT le résultat du script (copier-coller)
2. ✅ Capture d'écran de la console
3. ✅ Toutes les erreurs en ROUGE (s'il y en a)
4. ✅ Dites-moi si la modal s'est ouverte après les tests 8 et 9

**Avec ces informations, je pourrai identifier le problème exact!**
