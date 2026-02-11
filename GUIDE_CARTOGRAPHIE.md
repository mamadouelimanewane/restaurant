# 🗺️ Guide de la Cartographie Interactive TerangaReserve

## Vue d'ensemble

La **Carte Gastronomique du Sénégal** est un outil de planification d'itinéraires culinaires permettant de :
- Visualiser tous les restaurants partenaires sur une carte interactive
- Créer des circuits gastronomiques multi-destinations
- Calculer distances et itinéraires optimaux
- Exporter vos circuits pour référence

---

## 🎯 Fonctionnalités Principales

### 1. **Carte Interactive Complète**
- **Technologie** : Leaflet.js avec clustering de marqueurs
- **Couverture** : Dakar, Saly/Mbour, Saint-Louis, Cap Skirring
- **Marqueurs intelligents** : Regroupement automatique par zone géographique
- **Pop-ups détaillées** : Nom, localisation, cuisine, note, action rapide

### 2. **Filtrage Dynamique par Ville**
Chips cliquables dans la barre latérale :
- 🌍 **Tout le Sénégal** (vue complète)
- 📍 **Dakar** (capitale gastronomique)
- 🏖️ **Saly/Mbour** (stations balnéaires)
- 🏛️ **Saint-Louis** (patrimoine culturel)
- 🌴 **Cap Skirring** (Casamance)

### 3. **Planificateur d'Itinéraire Multi-Restaurants**

#### Comment créer un circuit :
1. Cliquez sur un restaurant dans la liste ou sur la carte
2. Sélectionnez "Ajouter à l'itinéraire"
3. Répétez pour tous les établissements souhaités
4. Cliquez sur "📊 Calculer l'Itinéraire"

#### Résultat :
- **Tracé visuel** : Lignes jaunes reliant les restaurants
- **Distances calculées** : Entre chaque étape (formule Haversine)
- **Distance totale** : Affichée dans la barre de stats
- **Ordre de visite** : Numéroté de 1 à N

### 4. **Système de Calcul de Distance**

**Formule Haversine** (précision géographique réelle) :
```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon terrestre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}
```

---

## 📊 Statistiques en Temps Réel

Barre de statistiques en bas de l'écran :
- **Total Restaurants** : Nombre d'établissements sur la carte
- **Destinations** : Nombre de villes couvertes
- **Circuit Total** : Distance cumulée de votre itinéraire

---

## 🚀 Cas d'Usage Pratiques

### 1. **Weekend Gastronomique Dakar → Saint-Louis**
```
1. Le Lagon 1 (Dakar - Plateau)
2. Chez Fatou (Dakar - Almadies)
3. Restaurant De La Résidence (Saint-Louis)
📏 Distance totale : ~270 km
⏱️ Temps estimé : 3h30 de route
```

### 2. **Circuit Côtier Mbour → Cap Skirring**
```
1. La Kora (Saly)
2. Le Katakalousse (Cap Skirring)
📏 Distance totale : ~350 km
⏱️ Temps estimé : 5h de route
```

### 3. **Tour Dakarois**
```
1. Le Lagon 1 (Plateau)
2. Le Bideew (Plateau)
3. Chez Fatou (Almadies)
📏 Distance totale : ~15 km
⏱️ Temps estimé : 30min de déplacements
```

---

## 📥 Exportation d'Itinéraires

### Format d'Export (TXT)
```
🗺️ MON CIRCUIT GASTRONOMIQUE TERANGA

Date: 11/02/2026

1. Le Lagon 1
   📍 Plateau, Dakar
   🍽️ Fruits de Mer / Gastronomique
   ⭐ 4.8/5.0
   🔗 https://google.com/maps?q=14.6669,-17.4302

2. Restaurant De La Résidence
   📍 Sud de l'Île, Saint-Louis
   🍽️ Gastronomie Sénégalaise & Euro
   ⭐ 4.8/5.0
   🔗 https://google.com/maps?q=16.0210,-16.5050
```

---

## 🎨 Interface Utilisateur

### Barre Latérale (380px)
- **Section Filtres** : Chips interactifs par ville
- **Liste Restaurants** : Scrollable, avec sélection visuelle
- **Panneau Itinéraire** : Fond jaune avec boutons d'action

### Carte Principale (Responsive)
- **Marqueurs personnalisés** : Design Teranga (bleu → jaune en sélection)
- **Clustering** : Regroupement automatique à 50m de rayon
- **Zoom adaptatif** : Se recadre sur l'itinéraire calculé

### Boîte d'Info Itinéraire (Flottante)
- Position : Top-right
- Affichage : Au calcul d'itinéraire
- Contenu : Étapes numérotées avec distances

---

## 🔧 Configuration Technique

### Dépendances
```json
{
  "leaflet": "^1.9.4",
  "leaflet.markercluster": "^1.5.3"
}
```

### Fichiers
- `carte.html` : Interface utilisateur
- `carte.js` : Logique métier (ES6 Modules)
- `data.js` : Base de données restaurants (partagée)

### Optimisations
- **Clustering** : Performance sur 100+ marqueurs
- **Lazy Loading** : Les pop-ups se génèrent à la demande
- **Debouncing** : Les filtres sont optimisés

---

## 📱 Responsive Design

### Breakpoints
- **Desktop** : Sidebar 380px + carte flexible
- **Tablet** : (À implémenter) Sidebar collapsible
- **Mobile** : (À implémenter) Full-screen avec drawer

---

## 🎯 Roadmap Future

### Phase 2 (à venir)
- [ ] Intégration Google Directions API (itinéraires routiers réels)
- [ ] Optimisation TSP (Travelling Salesman Problem) pour ordre optimal
- [ ] Export PDF avec carte intégrée
- [ ] Partage social du circuit (WhatsApp, Facebook)
- [ ] Mode hors-ligne avec Progressive Web App

### Phase 3 (vision)
- [ ] Réalité augmentée pour navigation
- [ ] Recommandations IA basées sur préférences
- [ ] Intégration Uber/Yango pour transport
- [ ] Calcul de budget estimé pour le circuit

---

## 🌟 Avantages Compétitifs

1. **Première plateforme** de cartographie gastronomique au Sénégal
2. **Calculs précis** via formule Haversine (erreur < 0.5%)
3. **Multi-destinations** : Couverture nationale unique
4. **Export facile** : Partage et référence instantanés
5. **UX Premium** : Design Booking.com appliqué à la restauration

---

## 📞 Support

Pour toute question ou suggestion d'amélioration :
- Email : contact@terangareserve.sn
- GitHub : https://github.com/mamadouelimanewane/restaurant
- Vercel : https://restaurant-lilac-rho.vercel.app/carte.html

---

**Créé avec ❤️ par l'équipe TerangaReserve**  
*La cartographie gastronomique réinventée pour le Sénégal*
