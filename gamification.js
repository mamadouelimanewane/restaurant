// Advanced Gamification - Badges & Challenges System

const BADGES = {
    // Badges de base
    first_step: {
        id: 'first_step',
        name: 'Premier Pas',
        icon: '🎯',
        description: 'Première réservation effectuée',
        condition: (stats) => stats.totalVisits >= 1,
        points: 10
    },
    explorer: {
        id: 'explorer',
        name: 'Explorateur',
        icon: '🗺️',
        description: '5 réservations effectuées',
        condition: (stats) => stats.totalVisits >= 5,
        points: 25
    },
    gourmet: {
        id: 'gourmet',
        name: 'Gourmet',
        icon: '👨‍🍳',
        description: '10 réservations effectuées',
        condition: (stats) => stats.totalVisits >= 10,
        points: 50
    },
    critic: {
        id: 'critic',
        name: 'Critique',
        icon: '✍️',
        description: '5 avis écrits',
        condition: (stats) => stats.reviewsWritten >= 5,
        points: 30
    },
    loyal: {
        id: 'loyal',
        name: 'Fidèle',
        icon: '🏆',
        description: '200+ points accumulés',
        condition: (stats) => stats.totalPoints >= 200,
        points: 50
    },

    // Nouveaux badges avancés
    ambassador: {
        id: 'ambassador',
        name: 'Ambassadeur Teranga',
        icon: '🌟',
        description: '20 réservations effectuées',
        condition: (stats) => stats.totalVisits >= 20,
        points: 100,
        rare: true
    },
    five_cities: {
        id: 'five_cities',
        name: 'Explorateur des 5 Villes',
        icon: '🗺️',
        description: 'Visiter un restaurant dans chaque ville',
        condition: (stats) => stats.citiesVisited >= 5,
        points: 75,
        rare: true
    },
    gastronome: {
        id: 'gastronome',
        name: 'Gastronome',
        icon: '🍽️',
        description: 'Essayer 10 cuisines différentes',
        condition: (stats) => stats.cuisinesExplored >= 10,
        points: 60,
        rare: true
    },
    vip_platinum: {
        id: 'vip_platinum',
        name: 'VIP Platinum',
        icon: '💎',
        description: '1000 points accumulés',
        condition: (stats) => stats.totalPoints >= 1000,
        points: 200,
        rare: true,
        legendary: true
    },
    photographer: {
        id: 'photographer',
        name: 'Photographe',
        icon: '📸',
        description: 'Ajouter 10 photos dans les avis',
        condition: (stats) => stats.photosUploaded >= 10,
        points: 40
    },
    one_year: {
        id: 'one_year',
        name: 'Fidèle 1 An',
        icon: '🎂',
        description: 'Utiliser l\'app pendant 1 an',
        condition: (stats) => stats.accountAgeDays >= 365,
        points: 150,
        rare: true,
        legendary: true
    },
    early_bird: {
        id: 'early_bird',
        name: 'Lève-tôt',
        icon: '🌅',
        description: '5 réservations pour le déjeuner',
        condition: (stats) => stats.lunchReservations >= 5,
        points: 25
    },
    night_owl: {
        id: 'night_owl',
        name: 'Oiseau de Nuit',
        icon: '🌙',
        description: '5 réservations pour le dîner',
        condition: (stats) => stats.dinnerReservations >= 5,
        points: 25
    },
    social_butterfly: {
        id: 'social_butterfly',
        name: 'Papillon Social',
        icon: '🦋',
        description: 'Parrainer 5 amis',
        condition: (stats) => stats.referrals >= 5,
        points: 100
    },
    big_spender: {
        id: 'big_spender',
        name: 'Grand Dépensier',
        icon: '💰',
        description: 'Dépenser plus de 100.000 FCFA',
        condition: (stats) => stats.totalSpent >= 100000,
        points: 80
    }
};

const CHALLENGES = {
    monthly_discovery: {
        id: 'monthly_discovery',
        name: 'Découverte du Mois',
        icon: '🎯',
        description: 'Visiter 3 nouveaux restaurants ce mois',
        target: 3,
        type: 'monthly',
        reward: 50,
        progress: (stats) => stats.newRestaurantsThisMonth || 0
    },
    monthly_critic: {
        id: 'monthly_critic',
        name: 'Critique du Mois',
        icon: '✍️',
        description: 'Écrire 5 avis détaillés ce mois',
        target: 5,
        type: 'monthly',
        reward: 40,
        progress: (stats) => stats.reviewsThisMonth || 0
    },
    weekend_gastro: {
        id: 'weekend_gastro',
        name: 'Weekend Gastronomique',
        icon: '🍽️',
        description: '2 réservations ce weekend',
        target: 2,
        type: 'weekly',
        reward: 30,
        progress: (stats) => stats.weekendReservations || 0
    },
    daily_explorer: {
        id: 'daily_explorer',
        name: 'Explorateur Quotidien',
        icon: '🔍',
        description: 'Consulter 5 restaurants aujourd\'hui',
        target: 5,
        type: 'daily',
        reward: 10,
        progress: (stats) => stats.restaurantsViewedToday || 0
    }
};

// Calculer les statistiques utilisateur
function calculateAdvancedStats() {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const reviews = JSON.parse(localStorage.getItem('terangaReviews') || '[]');
    const accountCreated = localStorage.getItem('accountCreatedDate') || new Date().toISOString();

    // Cities visited
    const citiesVisited = new Set(bookings.map(b => {
        const resto = restaurants.find(r => b.resto.includes(r.name));
        return resto?.city;
    }).filter(Boolean)).size;

    // Cuisines explored
    const cuisinesExplored = new Set(bookings.map(b => {
        const resto = restaurants.find(r => b.resto.includes(r.name));
        return resto?.cuisine;
    }).filter(Boolean)).size;

    // Account age
    const accountAgeDays = Math.floor((Date.now() - new Date(accountCreated).getTime()) / (1000 * 60 * 60 * 24));

    return {
        totalVisits: bookings.length,
        totalSpent: bookings.reduce((sum, b) => sum + (b.deposit || 5000), 0),
        totalPoints: parseInt(localStorage.getItem('terangaPoints') || 0),
        reviewsWritten: reviews.length,
        citiesVisited,
        cuisinesExplored,
        photosUploaded: reviews.filter(r => r.photos && r.photos.length > 0).reduce((sum, r) => sum + r.photos.length, 0),
        accountAgeDays,
        lunchReservations: bookings.filter(b => {
            const hour = parseInt(b.time?.split(':')[0] || 0);
            return hour >= 11 && hour < 15;
        }).length,
        dinnerReservations: bookings.filter(b => {
            const hour = parseInt(b.time?.split(':')[0] || 0);
            return hour >= 18;
        }).length,
        referrals: parseInt(localStorage.getItem('referralCount') || 0),
        newRestaurantsThisMonth: 0, // TODO: Calculate
        reviewsThisMonth: reviews.filter(r => {
            const reviewDate = new Date(r.date);
            const now = new Date();
            return reviewDate.getMonth() === now.getMonth() && reviewDate.getFullYear() === now.getFullYear();
        }).length,
        weekendReservations: 0, // TODO: Calculate
        restaurantsViewedToday: parseInt(sessionStorage.getItem('restaurantsViewedToday') || 0)
    };
}

// Vérifier et débloquer les badges
function checkAndUnlockBadges() {
    const stats = calculateAdvancedStats();
    const unlockedBadges = JSON.parse(localStorage.getItem('unlockedBadges') || '[]');
    const newBadges = [];

    Object.values(BADGES).forEach(badge => {
        if (!unlockedBadges.includes(badge.id) && badge.condition(stats)) {
            unlockedBadges.push(badge.id);
            newBadges.push(badge);

            // Award points
            const currentPoints = parseInt(localStorage.getItem('terangaPoints') || 0);
            localStorage.setItem('terangaPoints', currentPoints + badge.points);
        }
    });

    localStorage.setItem('unlockedBadges', JSON.stringify(unlockedBadges));

    // Show notifications for new badges
    newBadges.forEach(badge => {
        showBadgeUnlockNotification(badge);
    });

    return newBadges;
}
window.checkAndUnlockBadges = checkAndUnlockBadges;

// Afficher notification de déblocage de badge
function showBadgeUnlockNotification(badge) {
    const notification = document.createElement('div');
    notification.className = 'badge-unlock-notification';
    notification.innerHTML = `
        <div class="badge-unlock-content ${badge.legendary ? 'legendary' : badge.rare ? 'rare' : ''}">
            <div class="badge-unlock-icon">${badge.icon}</div>
            <div class="badge-unlock-info">
                <h4>🎉 Nouveau Badge Débloqué !</h4>
                <h3>${badge.name}</h3>
                <p>${badge.description}</p>
                <div class="badge-points">+${badge.points} points</div>
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Vérifier les challenges
function checkChallenges() {
    const stats = calculateAdvancedStats();
    const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
    const newCompletions = [];

    Object.values(CHALLENGES).forEach(challenge => {
        const challengeKey = `${challenge.id}_${getCurrentPeriod(challenge.type)}`;

        if (!completedChallenges.includes(challengeKey)) {
            const progress = challenge.progress(stats);

            if (progress >= challenge.target) {
                completedChallenges.push(challengeKey);
                newCompletions.push(challenge);

                // Award points
                const currentPoints = parseInt(localStorage.getItem('terangaPoints') || 0);
                localStorage.setItem('terangaPoints', currentPoints + challenge.reward);

                showToastNotification(`🎯 Challenge "${challenge.name}" complété ! +${challenge.reward} points`, 'success');
            }
        }
    });

    localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));

    return newCompletions;
}
window.checkChallenges = checkChallenges;

// Obtenir la période actuelle
function getCurrentPeriod(type) {
    const now = new Date();

    switch (type) {
        case 'daily':
            return now.toISOString().split('T')[0];
        case 'weekly':
            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
            return weekStart.toISOString().split('T')[0];
        case 'monthly':
            return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        default:
            return '';
    }
}

// Afficher tous les badges
function displayAllBadges() {
    const stats = calculateAdvancedStats();
    const unlockedBadges = JSON.parse(localStorage.getItem('unlockedBadges') || '[]');

    const modal = document.getElementById('badgesModal') || createBadgesModal();
    const container = document.getElementById('allBadgesContainer');

    container.innerHTML = `
        <div class="badges-grid-full">
            ${Object.values(BADGES).map(badge => {
        const unlocked = unlockedBadges.includes(badge.id);
        const canUnlock = badge.condition(stats);

        return `
                    <div class="badge-card-full ${unlocked ? 'unlocked' : ''} ${badge.legendary ? 'legendary' : badge.rare ? 'rare' : ''}">
                        <div class="badge-icon-large ${!unlocked ? 'locked' : ''}">${unlocked ? badge.icon : '🔒'}</div>
                        <h4>${badge.name}</h4>
                        <p>${badge.description}</p>
                        <div class="badge-points-display">${badge.points} points</div>
                        ${!unlocked && canUnlock ? '<div class="badge-ready">✨ Prêt à débloquer !</div>' : ''}
                        ${!unlocked && !canUnlock ? '<div class="badge-locked">🔒 Verrouillé</div>' : ''}
                    </div>
                `;
    }).join('')}
        </div>
    `;

    modal.style.display = 'flex';
}
window.displayAllBadges = displayAllBadges;

// Créer le modal des badges
function createBadgesModal() {
    const modal = document.createElement('div');
    modal.id = 'badgesModal';
    modal.className = 'badges-modal';
    modal.innerHTML = `
        <div class="badges-modal-content">
            <div class="badges-modal-header">
                <h2>🏆 Collection de Badges</h2>
                <button onclick="closeBadgesModal()" class="close-btn">×</button>
            </div>
            <div class="badges-modal-body" id="allBadgesContainer"></div>
        </div>
    `;

    document.body.appendChild(modal);
    return modal;
}

function closeBadgesModal() {
    const modal = document.getElementById('badgesModal');
    if (modal) modal.style.display = 'none';
}
window.closeBadgesModal = closeBadgesModal;

// Auto-check badges and challenges on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAndUnlockBadges();
    checkChallenges();
});

console.log('✅ Advanced Gamification chargé');
