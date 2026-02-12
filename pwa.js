// PWA Installation & Management
let deferredPrompt;
let isInstalled = false;

// Vérifier si l'app est déjà installée
if (window.matchMedia('(display-mode: standalone)').matches) {
    isInstalled = true;
    console.log('✅ PWA: Application déjà installée');
}

// Enregistrer le Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('✅ Service Worker enregistré:', registration.scope);

                // Vérifier les mises à jour toutes les heures
                setInterval(() => {
                    registration.update();
                }, 3600000);
            })
            .catch((error) => {
                console.error('❌ Erreur Service Worker:', error);
            });
    });
}

// Capturer l'événement beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📱 PWA: Prompt d\'installation disponible');
    e.preventDefault();
    deferredPrompt = e;

    // Afficher le bouton d'installation
    showInstallButton();
});

// Afficher le bouton/bannière d'installation
function showInstallButton() {
    if (isInstalled) return;

    const installBanner = document.createElement('div');
    installBanner.id = 'pwaInstallBanner';
    installBanner.className = 'pwa-install-banner';
    installBanner.innerHTML = `
    <div class="install-banner-content">
      <div class="install-icon">📱</div>
      <div class="install-text">
        <h4>Installer TerangaReserve</h4>
        <p>Accédez rapidement à vos restaurants préférés</p>
      </div>
      <button class="install-btn" onclick="installPWA()">Installer</button>
      <button class="close-banner" onclick="closePWABanner()">×</button>
    </div>
  `;

    document.body.appendChild(installBanner);

    // Animation d'entrée
    setTimeout(() => {
        installBanner.classList.add('show');
    }, 2000);
}

// Installer la PWA
async function installPWA() {
    if (!deferredPrompt) {
        console.log('❌ PWA: Prompt d\'installation non disponible');
        return;
    }

    // Afficher le prompt d'installation
    deferredPrompt.prompt();

    // Attendre la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`👤 PWA: Choix utilisateur: ${outcome}`);

    if (outcome === 'accepted') {
        console.log('✅ PWA: Installation acceptée');
        showToastNotification('Application installée avec succès ! 🎉', 'success');
    } else {
        console.log('❌ PWA: Installation refusée');
    }

    // Réinitialiser le prompt
    deferredPrompt = null;
    closePWABanner();
}
window.installPWA = installPWA;

// Fermer la bannière d'installation
function closePWABanner() {
    const banner = document.getElementById('pwaInstallBanner');
    if (banner) {
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 300);
    }
}
window.closePWABanner = closePWABanner;

// Détecter l'installation réussie
window.addEventListener('appinstalled', () => {
    console.log('🎉 PWA: Application installée avec succès !');
    isInstalled = true;
    closePWABanner();

    // Analytics
    trackEvent('pwa_installed');
});

// Demander la permission pour les notifications
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('❌ Notifications non supportées');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
}
window.requestNotificationPermission = requestNotificationPermission;

// Envoyer une notification de test
async function sendTestNotification() {
    const hasPermission = await requestNotificationPermission();

    if (hasPermission) {
        const notification = new Notification('TerangaReserve', {
            body: 'Notifications activées ! Vous recevrez des confirmations de réservation.',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            vibrate: [200, 100, 200],
            tag: 'test-notification'
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    } else {
        showToastNotification('Notifications bloquées. Activez-les dans les paramètres.', 'error');
    }
}
window.sendTestNotification = sendTestNotification;

// Géolocalisation
async function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Géolocalisation non supportée'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });
}
window.getUserLocation = getUserLocation;

// Calculer la distance entre deux points (Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
window.calculateDistance = calculateDistance;

// Trouver les restaurants proches
async function findNearbyRestaurants(maxDistance = 10) {
    try {
        const location = await getUserLocation();
        const nearby = restaurants.filter(r => {
            if (!r.lat || !r.lng) return false;
            const distance = calculateDistance(
                location.latitude,
                location.longitude,
                r.lat,
                r.lng
            );
            return distance <= maxDistance;
        }).sort((a, b) => {
            const distA = calculateDistance(location.latitude, location.longitude, a.lat, a.lng);
            const distB = calculateDistance(location.latitude, location.longitude, b.lat, b.lng);
            return distA - distB;
        });

        return nearby;
    } catch (error) {
        console.error('Erreur géolocalisation:', error);
        showToastNotification('Impossible d\'accéder à votre position', 'error');
        return [];
    }
}
window.findNearbyRestaurants = findNearbyRestaurants;

// Analytics simple
function trackEvent(eventName, data = {}) {
    console.log('📊 Event:', eventName, data);
    // En production, envoyer à Google Analytics, Mixpanel, etc.
}

// Vérifier la connexion internet
window.addEventListener('online', () => {
    console.log('✅ Connexion rétablie');
    showToastNotification('Connexion rétablie !', 'success');
});

window.addEventListener('offline', () => {
    console.log('❌ Hors ligne');
    showToastNotification('Mode hors ligne - Certaines fonctionnalités limitées', 'info');
});

// Ajouter les styles pour la bannière
if (!document.getElementById('pwa-styles')) {
    const style = document.createElement('style');
    style.id = 'pwa-styles';
    style.textContent = `
    .pwa-install-banner {
      position: fixed;
      bottom: -100px;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #003580 0%, #0071c2 100%);
      color: white;
      padding: 1rem;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      transition: bottom 0.3s ease-out;
    }
    
    .pwa-install-banner.show {
      bottom: 0;
    }
    
    .install-banner-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .install-icon {
      font-size: 2.5rem;
    }
    
    .install-text {
      flex: 1;
    }
    
    .install-text h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1.1rem;
    }
    
    .install-text p {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }
    
    .install-btn {
      background: #febb02;
      color: #003580;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .install-btn:hover {
      background: #ffca28;
      transform: translateY(-2px);
    }
    
    .close-banner {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .close-banner:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    
    @media (max-width: 768px) {
      .install-banner-content {
        flex-wrap: wrap;
      }
      
      .install-text {
        flex-basis: 100%;
        order: -1;
      }
    }
  `;
    document.head.appendChild(style);
}

console.log('✅ PWA Management chargé');
