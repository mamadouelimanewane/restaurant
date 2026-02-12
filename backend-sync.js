/**
 * TerangaReserve - Backend & Firebase Cloud Synchronization
 * 
 * This module simulates the backend logic for user data sync,
 * supporting multi-device experience. In a real app, this would
 * connect to Firebase Firestore or a NodeJS API.
 */

// Simulated cloud database
const cloudDB = {
    users: {},
    bookings: [],
    reviews: []
};

// Current user session (simulated)
let currentUser = {
    uid: localStorage.getItem('user_uid') || generateUID(),
    email: localStorage.getItem('user_email') || null,
    displayName: localStorage.getItem('user_name') || 'Invité',
    photoURL: localStorage.getItem('user_photo') || null,
    lastSync: null
};

// Generate a unique ID if not exists
function generateUID() {
    const uid = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('user_uid', uid);
    return uid;
}

/**
 * Initialize Cloud Sync
 */
function initCloudSync() {
    console.log('☁️ Initialisation de la synchro Cloud...');

    // Check if online
    if (navigator.onLine) {
        syncUserData();
        subscribeToRealtimeUpdates();
    }

    // Listen for online status
    window.addEventListener('online', () => {
        showToastNotification('Connexion rétablie. Synchronisation...', 'info');
        syncUserData();
    });
}
window.initCloudSync = initCloudSync;

/**
 * Sync local data with "cloud"
 */
async function syncUserData() {
    try {
        // simulate API latency
        await new Promise(r => setTimeout(r, 800));

        // 1. Upload local changes (if any)
        const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const localReviews = JSON.parse(localStorage.getItem('terangaReviews') || '[]');
        const stats = JSON.parse(localStorage.getItem('userStats') || '{}');

        // In reality: await api.post('/sync', { bookings, reviews, stats })
        console.log('⬆️ Envoi des données locales vers le cloud:', {
            bookings: localBookings.length,
            reviews: localReviews.length
        });

        // 2. Download remote updates
        // In reality: const remoteData = await api.get('/user/data')
        const remoteData = {
            points: 150, // Simulated validation from server
            messages: []
        };

        // Update conflict resolution (Server wins policy for points in this demo)
        // localStorage.setItem('terangaPoints', Math.max(localPoints, remoteData.points));

        currentUser.lastSync = new Date().toISOString();
        console.log('✅ Synchronisation Cloud terminée');

        updateSyncStatusUI('Synchronisé');

    } catch (error) {
        console.error('❌ Erreur de synchro:', error);
        updateSyncStatusUI('Erreur Synchro');
    }
}
window.syncUserData = syncUserData;

/**
 * Simulate Real-time updates (like Firestore snapshot)
 */
function subscribeToRealtimeUpdates() {
    // In reality: firestore.collection('notifications').onSnapshot(...)
    setInterval(() => {
        // Randomly simulate a server notification
        if (Math.random() > 0.95) {
            handleServerNotification({
                type: 'promo',
                message: '🔥 Flash Promo: -20% au Lagon 1 ce soir !',
                action: 'open_restaurant',
                targetId: 1
            });
        }
    }, 60000); // Check every minute
}

function handleServerNotification(notification) {
    if (Notification.permission === 'granted') {
        new Notification('TerangaReserve', {
            body: notification.message,
            icon: '/icons/icon-192x192.png'
        });
    } else {
        showToastNotification(notification.message, 'info');
    }
}

function updateSyncStatusUI(status) {
    // If we had a status indicator in the UI, update it here
    const indicator = document.getElementById('syncStatus');
    if (indicator) indicator.textContent = status;
}

// Auto-start
if (document.readyState === 'complete') {
    initCloudSync();
} else {
    window.addEventListener('load', initCloudSync);
}

console.log('✅ Backend & Cloud Sync chargé');
