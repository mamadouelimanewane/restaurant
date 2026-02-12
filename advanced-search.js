// Advanced Search & Filters System

let currentFilters = {
    priceMin: 0,
    priceMax: 50000,
    minRating: 0,
    maxDistance: 100,
    cuisines: [],
    atmosphere: [],
    features: [],
    openNow: false,
    hasParking: false,
    accessible: false
};

// Ouvrir le panneau de filtres avancés
function openAdvancedFilters() {
    const panel = document.getElementById('advancedFiltersPanel') || createAdvancedFiltersPanel();
    panel.style.display = 'block';
    panel.classList.add('show');
}
window.openAdvancedFilters = openAdvancedFilters;

// Créer le panneau de filtres
function createAdvancedFiltersPanel() {
    const panel = document.createElement('div');
    panel.id = 'advancedFiltersPanel';
    panel.className = 'advanced-filters-panel';
    panel.innerHTML = `
        <div class="filters-panel-header">
            <h3>🔍 Filtres Avancés</h3>
            <button onclick="closeAdvancedFilters()" class="close-btn">×</button>
        </div>
        
        <div class="filters-panel-body">
            <!-- Prix -->
            <div class="filter-section">
                <h4>💰 Budget (FCFA)</h4>
                <div class="price-range">
                    <input type="range" id="priceMin" min="0" max="50000" step="1000" value="0" oninput="updatePriceRange()">
                    <input type="range" id="priceMax" min="0" max="50000" step="1000" value="50000" oninput="updatePriceRange()">
                </div>
                <div class="price-labels">
                    <span id="priceMinLabel">0</span>
                    <span id="priceMaxLabel">50.000</span>
                </div>
            </div>
            
            <!-- Note minimale -->
            <div class="filter-section">
                <h4>⭐ Note minimale</h4>
                <div class="rating-filter">
                    ${[1, 2, 3, 4, 4.5].map(rating => `
                        <button class="rating-btn" onclick="setMinRating(${rating})" data-rating="${rating}">
                            ${rating}+ ⭐
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <!-- Distance -->
            <div class="filter-section">
                <h4>📍 Distance maximale</h4>
                <input type="range" id="maxDistance" min="1" max="100" value="100" oninput="updateDistanceLabel()">
                <div class="distance-label">
                    <span id="distanceValue">100</span> km
                </div>
            </div>
            
            <!-- Type de cuisine -->
            <div class="filter-section">
                <h4>🍽️ Type de cuisine</h4>
                <div class="cuisine-checkboxes">
                    ${getUniqueCuisines().map(cuisine => `
                        <label class="checkbox-label">
                            <input type="checkbox" value="${cuisine}" onchange="toggleCuisineFilter('${cuisine}')">
                            <span>${cuisine}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
            
            <!-- Ambiance -->
            <div class="filter-section">
                <h4>🎵 Ambiance</h4>
                <div class="atmosphere-buttons">
                    <button class="atmosphere-btn" onclick="toggleAtmosphere('calme')">😌 Calme</button>
                    <button class="atmosphere-btn" onclick="toggleAtmosphere('festif')">🎉 Festif</button>
                    <button class="atmosphere-btn" onclick="toggleAtmosphere('romantique')">💕 Romantique</button>
                    <button class="atmosphere-btn" onclick="toggleAtmosphere('familial')">👨‍👩‍👧‍👦 Familial</button>
                </div>
            </div>
            
            <!-- Caractéristiques -->
            <div class="filter-section">
                <h4>✨ Caractéristiques</h4>
                <div class="features-checkboxes">
                    <label class="checkbox-label">
                        <input type="checkbox" id="openNowFilter" onchange="toggleOpenNow()">
                        <span>🕐 Ouvert maintenant</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="parkingFilter" onchange="toggleParking()">
                        <span>🅿️ Parking disponible</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="accessibleFilter" onchange="toggleAccessible()">
                        <span>♿ Accessible PMR</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="wifiFilter" onchange="toggleFeature('Wifi')">
                        <span>📶 Wifi</span>
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="terraceFilter" onchange="toggleFeature('Terrasse')">
                        <span>🌿 Terrasse</span>
                    </label>
                </div>
            </div>
        </div>
        
        <div class="filters-panel-footer">
            <button class="reset-filters-btn" onclick="resetFilters()">🔄 Réinitialiser</button>
            <button class="apply-filters-btn" onclick="applyFilters()">✅ Appliquer</button>
        </div>
    `;

    document.body.appendChild(panel);
    return panel;
}

// Obtenir les cuisines uniques
function getUniqueCuisines() {
    const cuisines = new Set(restaurants.map(r => r.cuisine));
    return Array.from(cuisines).sort();
}

// Mettre à jour le range de prix
function updatePriceRange() {
    const min = parseInt(document.getElementById('priceMin').value);
    const max = parseInt(document.getElementById('priceMax').value);

    document.getElementById('priceMinLabel').textContent = min.toLocaleString();
    document.getElementById('priceMaxLabel').textContent = max.toLocaleString();

    currentFilters.priceMin = min;
    currentFilters.priceMax = max;
}
window.updatePriceRange = updatePriceRange;

// Définir la note minimale
function setMinRating(rating) {
    currentFilters.minRating = rating;

    // Update UI
    document.querySelectorAll('.rating-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseFloat(btn.dataset.rating) === rating) {
            btn.classList.add('active');
        }
    });
}
window.setMinRating = setMinRating;

// Mettre à jour le label de distance
function updateDistanceLabel() {
    const distance = document.getElementById('maxDistance').value;
    document.getElementById('distanceValue').textContent = distance;
    currentFilters.maxDistance = parseInt(distance);
}
window.updateDistanceLabel = updateDistanceLabel;

// Toggle cuisine filter
function toggleCuisineFilter(cuisine) {
    const index = currentFilters.cuisines.indexOf(cuisine);
    if (index > -1) {
        currentFilters.cuisines.splice(index, 1);
    } else {
        currentFilters.cuisines.push(cuisine);
    }
}
window.toggleCuisineFilter = toggleCuisineFilter;

// Toggle atmosphere
function toggleAtmosphere(atmosphere) {
    const index = currentFilters.atmosphere.indexOf(atmosphere);
    const btn = event.target;

    if (index > -1) {
        currentFilters.atmosphere.splice(index, 1);
        btn.classList.remove('active');
    } else {
        currentFilters.atmosphere.push(atmosphere);
        btn.classList.add('active');
    }
}
window.toggleAtmosphere = toggleAtmosphere;

// Toggle feature
function toggleFeature(feature) {
    const index = currentFilters.features.indexOf(feature);
    if (index > -1) {
        currentFilters.features.splice(index, 1);
    } else {
        currentFilters.features.push(feature);
    }
}
window.toggleFeature = toggleFeature;

// Toggle open now
function toggleOpenNow() {
    currentFilters.openNow = document.getElementById('openNowFilter').checked;
}
window.toggleOpenNow = toggleOpenNow;

// Toggle parking
function toggleParking() {
    currentFilters.hasParking = document.getElementById('parkingFilter').checked;
}
window.toggleParking = toggleParking;

// Toggle accessible
function toggleAccessible() {
    currentFilters.accessible = document.getElementById('accessibleFilter').checked;
}
window.toggleAccessible = toggleAccessible;

// Appliquer les filtres
async function applyFilters() {
    let filtered = [...restaurants];

    // Filter by price
    filtered = filtered.filter(r =>
        r.avgPrice >= currentFilters.priceMin && r.avgPrice <= currentFilters.priceMax
    );

    // Filter by rating
    if (currentFilters.minRating > 0) {
        filtered = filtered.filter(r => r.rating >= currentFilters.minRating);
    }

    // Filter by cuisine
    if (currentFilters.cuisines.length > 0) {
        filtered = filtered.filter(r => currentFilters.cuisines.includes(r.cuisine));
    }

    // Filter by features
    if (currentFilters.features.length > 0) {
        filtered = filtered.filter(r =>
            currentFilters.features.every(f => r.features.includes(f))
        );
    }

    // Filter by parking
    if (currentFilters.hasParking) {
        filtered = filtered.filter(r => r.features.includes('Parking'));
    }

    // Filter by distance (if geolocation available)
    if (currentFilters.maxDistance < 100) {
        try {
            const userLocation = await getUserLocation();
            filtered = filtered.filter(r => {
                if (!r.lat || !r.lng) return false;
                const distance = calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    r.lat,
                    r.lng
                );
                return distance <= currentFilters.maxDistance;
            });
        } catch (error) {
            console.log('Géolocalisation non disponible');
        }
    }

    // Render filtered results
    if (typeof renderRestaurants === 'function') {
        renderRestaurants(filtered);
    }

    // Update count
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = `${filtered.length} restaurant(s) trouvé(s)`;
    }

    showToastNotification(`${filtered.length} restaurants correspondent à vos critères`, 'success');
    closeAdvancedFilters();
}
window.applyFilters = applyFilters;

// Réinitialiser les filtres
function resetFilters() {
    currentFilters = {
        priceMin: 0,
        priceMax: 50000,
        minRating: 0,
        maxDistance: 100,
        cuisines: [],
        atmosphere: [],
        features: [],
        openNow: false,
        hasParking: false,
        accessible: false
    };

    // Reset UI
    document.getElementById('priceMin').value = 0;
    document.getElementById('priceMax').value = 50000;
    document.getElementById('maxDistance').value = 100;
    updatePriceRange();
    updateDistanceLabel();

    document.querySelectorAll('.rating-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.atmosphere-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

    // Render all restaurants
    if (typeof renderRestaurants === 'function') {
        renderRestaurants(restaurants);
    }

    showToastNotification('Filtres réinitialisés', 'info');
}
window.resetFilters = resetFilters;

// Fermer le panneau
function closeAdvancedFilters() {
    const panel = document.getElementById('advancedFiltersPanel');
    if (panel) {
        panel.classList.remove('show');
        setTimeout(() => {
            panel.style.display = 'none';
        }, 300);
    }
}
window.closeAdvancedFilters = closeAdvancedFilters;

console.log('✅ Advanced Search & Filters chargé');
