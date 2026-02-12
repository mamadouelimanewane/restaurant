// Transport Integration - Yango, Heetch, Yassir
// Module pour réserver un transport vers un restaurant

const TRANSPORT_SERVICES = {
    yango: {
        name: 'Yango',
        color: '#FFD700',
        icon: '🚕',
        deeplink: 'yango://route',
        webUrl: 'https://3.redirect.appmetrica.yandex.com/route',
        available: true
    },
    heetch: {
        name: 'Heetch',
        color: '#FF6B6B',
        icon: '🚗',
        deeplink: 'heetch://',
        webUrl: 'https://www.heetch.com',
        available: true
    },
    yassir: {
        name: 'Yassir',
        color: '#00D9A5',
        icon: '🚖',
        deeplink: 'yassir://',
        webUrl: 'https://yassir.com',
        available: true
    }
};

// Ouvrir le modal de transport
function openTransportModal(restaurantId) {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;

    const modal = document.getElementById('transportModal') || createTransportModal();

    // Update modal content
    document.getElementById('transportRestaurantName').textContent = restaurant.name;
    document.getElementById('transportRestaurantAddress').textContent = `${restaurant.district}, ${restaurant.city}`;

    // Store restaurant data
    modal.dataset.lat = restaurant.lat;
    modal.dataset.lng = restaurant.lng;
    modal.dataset.name = restaurant.name;
    modal.dataset.address = `${restaurant.district}, ${restaurant.city}`;

    modal.style.display = 'flex';
}
window.openTransportModal = openTransportModal;

// Créer le modal de transport
function createTransportModal() {
    const modal = document.createElement('div');
    modal.id = 'transportModal';
    modal.className = 'transport-modal';
    modal.innerHTML = `
        <div class="transport-modal-content">
            <div class="transport-modal-header">
                <h2>🚗 Réserver un Transport</h2>
                <button onclick="closeTransportModal()" class="close-btn">×</button>
            </div>
            
            <div class="transport-modal-body">
                <div class="transport-destination">
                    <h3 id="transportRestaurantName"></h3>
                    <p id="transportRestaurantAddress"></p>
                </div>
                
                <div class="transport-services">
                    ${Object.entries(TRANSPORT_SERVICES).map(([key, service]) => `
                        <div class="transport-service-card" onclick="bookTransport('${key}')" style="border-color: ${service.color};">
                            <div class="service-icon" style="background: ${service.color};">${service.icon}</div>
                            <div class="service-info">
                                <h4>${service.name}</h4>
                                <p>Réserver maintenant</p>
                            </div>
                            <div class="service-arrow">→</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="transport-info">
                    <p>💡 <strong>Astuce :</strong> Réservez votre transport à l'avance pour arriver à l'heure !</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    return modal;
}

// Réserver un transport
async function bookTransport(service) {
    const modal = document.getElementById('transportModal');
    const destLat = modal.dataset.lat;
    const destLng = modal.dataset.lng;
    const destName = modal.dataset.name;
    const destAddress = modal.dataset.address;

    const transportService = TRANSPORT_SERVICES[service];

    if (!transportService) {
        showToastNotification('Service non disponible', 'error');
        return;
    }

    // Get user location
    try {
        const userLocation = await getUserLocation();

        let url;

        switch (service) {
            case 'yango':
                // Yango deep link format
                url = `${transportService.deeplink}?start-lat=${userLocation.latitude}&start-lon=${userLocation.longitude}&end-lat=${destLat}&end-lon=${destLng}&end-name=${encodeURIComponent(destName)}`;

                // Fallback to web
                const yangoWebUrl = `${transportService.webUrl}?start-lat=${userLocation.latitude}&start-lon=${userLocation.longitude}&end-lat=${destLat}&end-lon=${destLng}`;

                // Try deep link first, fallback to web
                window.location.href = url;
                setTimeout(() => {
                    window.open(yangoWebUrl, '_blank');
                }, 1000);
                break;

            case 'heetch':
                // Heetch doesn't have public API, redirect to app store or web
                url = `${transportService.deeplink}ride?pickup_latitude=${userLocation.latitude}&pickup_longitude=${userLocation.longitude}&dropoff_latitude=${destLat}&dropoff_longitude=${destLng}`;

                window.location.href = url;
                setTimeout(() => {
                    // Fallback to app store
                    if (confirm('Heetch n\'est pas installé. Voulez-vous le télécharger ?')) {
                        window.open('https://play.google.com/store/apps/details?id=com.heetch', '_blank');
                    }
                }, 1000);
                break;

            case 'yassir':
                // Yassir deep link
                url = `${transportService.deeplink}ride?pickup_lat=${userLocation.latitude}&pickup_lng=${userLocation.longitude}&dropoff_lat=${destLat}&dropoff_lng=${destLng}&dropoff_name=${encodeURIComponent(destName)}`;

                window.location.href = url;
                setTimeout(() => {
                    if (confirm('Yassir n\'est pas installé. Voulez-vous le télécharger ?')) {
                        window.open('https://play.google.com/store/apps/details?id=com.yassir.rider', '_blank');
                    }
                }, 1000);
                break;
        }

        showToastNotification(`Ouverture de ${transportService.name}...`, 'success');

        // Track event
        trackTransportBooking(service, destName);

    } catch (error) {
        console.error('Erreur géolocalisation:', error);

        // Fallback: use Google Maps
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&destination_place_id=${encodeURIComponent(destName)}`;

        if (confirm('Impossible d\'obtenir votre position. Ouvrir dans Google Maps ?')) {
            window.open(googleMapsUrl, '_blank');
        }
    }
}
window.bookTransport = bookTransport;

// Track transport booking
function trackTransportBooking(service, restaurant) {
    console.log('📊 Transport booking:', service, restaurant);

    // Save to analytics
    const bookings = JSON.parse(localStorage.getItem('transportBookings') || '[]');
    bookings.push({
        service,
        restaurant,
        date: new Date().toISOString()
    });
    localStorage.setItem('transportBookings', JSON.stringify(bookings));

    // Award points
    const currentPoints = parseInt(localStorage.getItem('terangaPoints') || 0);
    localStorage.setItem('terangaPoints', currentPoints + 5);

    showToastNotification('+5 points pour avoir réservé un transport !', 'success');
}

// Fermer le modal
function closeTransportModal() {
    const modal = document.getElementById('transportModal');
    if (modal) modal.style.display = 'none';
}
window.closeTransportModal = closeTransportModal;

// Alternative: Ouvrir directement Google Maps
function openGoogleMaps(restaurantId) {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}&destination_place_id=${encodeURIComponent(restaurant.name)}`;
    window.open(url, '_blank');
}
window.openGoogleMaps = openGoogleMaps;

// Ajouter les styles
if (!document.getElementById('transport-styles')) {
    const style = document.createElement('style');
    style.id = 'transport-styles';
    style.textContent = `
        .transport-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            padding: 1rem;
        }
        
        .transport-modal-content {
            background: white;
            border-radius: 16px;
            max-width: 500px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .transport-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid #e0e0e0;
            background: linear-gradient(135deg, #003580 0%, #0071c2 100%);
            color: white;
            border-radius: 16px 16px 0 0;
        }
        
        .transport-modal-header h2 {
            margin: 0;
        }
        
        .transport-modal-body {
            padding: 1.5rem;
        }
        
        .transport-destination {
            background: #f0f7ff;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
        }
        
        .transport-destination h3 {
            margin: 0 0 0.5rem 0;
            color: #003580;
        }
        
        .transport-destination p {
            margin: 0;
            color: #666;
        }
        
        .transport-services {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        
        .transport-service-card {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border: 2px solid;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s;
            background: white;
        }
        
        .transport-service-card:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .service-icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            flex-shrink: 0;
        }
        
        .service-info {
            flex: 1;
        }
        
        .service-info h4 {
            margin: 0 0 0.25rem 0;
            color: #333;
        }
        
        .service-info p {
            margin: 0;
            font-size: 0.85rem;
            color: #666;
        }
        
        .service-arrow {
            font-size: 1.5rem;
            color: #666;
        }
        
        .transport-info {
            background: #fff8e1;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #febb02;
        }
        
        .transport-info p {
            margin: 0;
            font-size: 0.9rem;
            color: #666;
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ Transport Integration chargé (Yango, Heetch, Yassir)');
