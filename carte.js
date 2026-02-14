import { restaurants } from './data.js';

let map = null;
let markers = L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true
});
let selectedRestaurants = [];
let routePolylines = [];
let currentFilter = 'all';

// Initialize Map
function initMap() {
    map = L.map('map').setView([14.7167, -17.4677], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.addLayer(markers);
    renderAllRestaurants();
    updateStats();
}

// Render all restaurants on map
function renderAllRestaurants() {
    markers.clearLayers();

    const filteredRestos = currentFilter === 'all'
        ? restaurants
        : restaurants.filter(r => r.city.includes(currentFilter));

    filteredRestos.forEach(resto => {
        if (!resto.lat || !resto.lng) return;

        const isSelected = selectedRestaurants.some(s => s.id === resto.id);
        const icon = L.divIcon({
            className: 'custom-marker' + (isSelected ? ' selected' : ''),
            html: `${resto.name.substring(0, 15)}...`,
            iconSize: [120, 30]
        });

        const marker = L.marker([resto.lat, resto.lng], { icon })
            .bindPopup(`
                <div style="padding: 10px; min-width: 200px;">
                    <h4 style="margin: 0 0 8px 0; color: #003580;">${resto.name}</h4>
                    <p style="margin: 4px 0; font-size: 0.85rem; color: #666;">
                        📍 ${resto.district}, ${resto.city}
                    </p>
                    <p style="margin: 4px 0; font-size: 0.85rem;">
                        🍽️ ${resto.cuisine}
                    </p>
                    <p style="margin: 8px 0 0 0; font-weight: bold; color: #febb02;">
                        ⭐ ${resto.rating} / 5.0
                    </p>
                    <button onclick="window.addToItinerary(${resto.id})" 
                        style="margin-top: 10px; width: 100%; padding: 8px; background: #006ce4; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                        ${isSelected ? '✓ Dans l\'itinéraire' : '+ Ajouter à l\'itinéraire'}
                    </button>
                </div>
            `);

        marker.restoId = resto.id;
        marker.on('click', () => highlightRestaurant(resto.id));
        markers.addLayer(marker);
    });

    renderRestoList(filteredRestos);
}

// Render sidebar restaurant list
function renderRestoList(restos) {
    const list = document.getElementById('restoList');
    document.getElementById('restoCount').innerText = restos.length;

    list.innerHTML = restos.map(r => {
        const isSelected = selectedRestaurants.some(s => s.id === r.id);
        return `
            <div class="resto-list-item ${isSelected ? 'selected' : ''}" onclick="highlightRestaurant(${r.id})">
                <div class="resto-item-header">
                    <div class="resto-item-name">${r.name}</div>
                    <div class="resto-item-rating">${r.rating}</div>
                </div>
                <div class="resto-item-city">📍 ${r.district}, ${r.city}</div>
            </div>
        `;
    }).join('');
}

// Highlight restaurant on map
function highlightRestaurant(id) {
    const resto = restaurants.find(r => r.id === id);
    if (!resto) return;

    console.log('📍 Navigation vers:', resto.name);

    // Visual feedback on list item
    const listItems = document.querySelectorAll('.resto-list-item');
    listItems.forEach(item => {
        item.classList.remove('active-navigation');
    });

    // Find and highlight the clicked item
    const clickedItem = Array.from(listItems).find(item =>
        item.querySelector('.resto-item-name')?.textContent === resto.name
    );

    if (clickedItem) {
        clickedItem.classList.add('active-navigation');
        // Remove class after animation
        setTimeout(() => {
            clickedItem.classList.remove('active-navigation');
        }, 1500);
    }

    // Smooth animation to restaurant location with very close zoom
    map.flyTo([resto.lat, resto.lng], 16, {
        animate: true,
        duration: 1.8,
        easeLinearity: 0.25
    });

    // Open popup after animation starts
    setTimeout(() => {
        markers.eachLayer(layer => {
            if (layer.restoId === id) {
                layer.openPopup();

                // Add strong temporary highlight effect
                const element = layer.getElement();
                if (element) {
                    element.style.animation = 'pulse 0.6s ease-in-out 3';
                    element.style.zIndex = '9999';

                    // Reset z-index after animation
                    setTimeout(() => {
                        element.style.zIndex = '';
                    }, 2000);
                }
            }
        });
    }, 1000);
}

// Expose globally
window.highlightRestaurant = highlightRestaurant;

// Add pulse animation for marker highlight
if (!document.getElementById('marker-pulse-style')) {
    const style = document.createElement('style');
    style.id = 'marker-pulse-style';
    style.textContent = `
        @keyframes pulse {
            0%, 100% { 
                transform: scale(1); 
                filter: drop-shadow(0 0 0px rgba(254, 187, 2, 0));
            }
            50% { 
                transform: scale(1.4); 
                filter: drop-shadow(0 0 30px rgba(254, 187, 2, 1));
            }
        }
    `;
    document.head.appendChild(style);
}

// Add to itinerary
window.addToItinerary = (id) => {
    const resto = restaurants.find(r => r.id === id);
    if (!resto) return;

    const exists = selectedRestaurants.some(s => s.id === id);
    if (exists) {
        selectedRestaurants = selectedRestaurants.filter(s => s.id !== id);
    } else {
        selectedRestaurants.push(resto);
    }

    updateItinerary();
    renderAllRestaurants();
};

// Update itinerary display
function updateItinerary() {
    const list = document.getElementById('itineraryList');
    document.getElementById('itineraryCount').innerText = selectedRestaurants.length;

    list.innerHTML = selectedRestaurants.map((r, idx) => `
        <li class="itinerary-item">
            <div>
                <strong>${idx + 1}. ${r.name}</strong><br>
                <small style="color: #666;">${r.city}</small>
            </div>
            <button class="itinerary-remove" onclick="removeFromItinerary(${r.id})">×</button>
        </li>
    `).join('');
}

// Remove from itinerary
window.removeFromItinerary = (id) => {
    selectedRestaurants = selectedRestaurants.filter(r => r.id !== id);
    updateItinerary();
    renderAllRestaurants();
};

// Clear itinerary
window.clearItinerary = () => {
    selectedRestaurants = [];
    updateItinerary();
    clearRoute();
    renderAllRestaurants();
};

// Calculate route
window.calculateRoute = () => {
    if (selectedRestaurants.length < 2) {
        alert('Sélectionnez au moins 2 restaurants pour calculer un itinéraire');
        return;
    }

    clearRoute();

    const routeInfo = document.getElementById('routeInfo');
    const stepsDiv = document.getElementById('routeSteps');
    routeInfo.classList.add('active');

    let totalDistance = 0;
    let steps = '';

    for (let i = 0; i < selectedRestaurants.length - 1; i++) {
        const from = selectedRestaurants[i];
        const to = selectedRestaurants[i + 1];

        const line = L.polyline(
            [[from.lat, from.lng], [to.lat, to.lng]],
            { color: '#febb02', weight: 4, opacity: 0.8 }
        ).addTo(map);

        routePolylines.push(line);

        const distance = calculateDistance(from.lat, from.lng, to.lat, to.lng);
        totalDistance += distance;

        steps += `
            <div class="route-step">
                <strong>${i + 1}. ${from.name}</strong> → ${to.name}<br>
                <small style="color: #666;">📏 ${distance.toFixed(1)} km</small>
            </div>
        `;
    }

    steps += `
        <div class="route-step" style="background: #fff8e1; border-color: #006ce4;">
            <strong>Arrivée: ${selectedRestaurants[selectedRestaurants.length - 1].name}</strong>
        </div>
    `;

    stepsDiv.innerHTML = steps;
    document.getElementById('totalDistance').innerText = `${totalDistance.toFixed(1)} km`;

    // Fit map to route
    const bounds = L.latLngBounds(selectedRestaurants.map(r => [r.lat, r.lng]));
    map.fitBounds(bounds, { padding: [50, 50] });
};

// Clear route from map
function clearRoute() {
    routePolylines.forEach(line => map.removeLayer(line));
    routePolylines = [];
    document.getElementById('routeInfo').classList.remove('active');
    document.getElementById('totalDistance').innerText = '0 km';
}

// Locate User
let userMarker = null;
window.locateUser = () => {
    if (!navigator.geolocation) {
        alert('La géolocalisation n\'est pas supportée par votre navigateur');
        return;
    }

    const btn = document.querySelector('.locate-me-btn');
    btn.innerHTML = '⌛';

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            if (userMarker) map.removeLayer(userMarker);

            userMarker = L.marker([latitude, longitude], {
                icon: L.divIcon({
                    className: 'user-location-marker',
                    html: '<div class="pulse-marker"></div>',
                    iconSize: [20, 20]
                })
            }).addTo(map);

            map.flyTo([latitude, longitude], 15);
            btn.innerHTML = '🎯';
        },
        (error) => {
            console.error('Erreur de localisation:', error);
            alert('Impossible de vous localiser. Vérifiez vos permissions.');
            btn.innerHTML = '🎯';
        }
    );
};

// Add User Marker CSS
const userMarkerStyle = document.createElement('style');
userMarkerStyle.textContent = `
    .pulse-marker {
        width: 15px;
        height: 15px;
        background: #006ce4;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0, 108, 228, 0.5);
        animation: user-pulse 2s infinite;
    }
    @keyframes user-pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 108, 228, 0.7); }
        70% { box-shadow: 0 0 0 15px rgba(0, 108, 228, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 108, 228, 0); }
    }
`;
document.head.appendChild(userMarkerStyle);

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Update statistics
function updateStats() {
    document.getElementById('totalRestos').innerText = restaurants.length;
    const cities = [...new Set(restaurants.map(r => r.city))];
    document.getElementById('totalCities').innerText = cities.length;
}

// City filter
document.querySelectorAll('.city-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('.city-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentFilter = chip.dataset.city;
        renderAllRestaurants();
    });
});

// Export itinerary
window.exportItinerary = () => {
    if (selectedRestaurants.length === 0) {
        alert('Aucun restaurant sélectionné pour l\'export');
        return;
    }

    let content = '🗺️ MON CIRCUIT GASTRONOMIQUE TERANGA\n\n';
    content += `Date: ${new Date().toLocaleDateString('fr-FR')}\n\n`;

    selectedRestaurants.forEach((r, idx) => {
        content += `${idx + 1}. ${r.name}\n`;
        content += `   📍 ${r.district}, ${r.city}\n`;
        content += `   🍽️ ${r.cuisine}\n`;
        content += `   ⭐ ${r.rating}/5.0\n`;
        content += `   🔗 https://google.com/maps?q=${r.lat},${r.lng}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Circuit_Gastronomique_${new Date().getTime()}.txt`;
    a.click();
};

// Initialize on load
initMap();
