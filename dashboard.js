import { restaurants } from './data.js';

// Dashboard Utilisateur - TerangaReserve
let userStats = {
  totalVisits: 0,
  totalSpent: 0,
  favoriteRestaurant: null,
  favoriteCuisine: null,
  totalPoints: parseInt(localStorage.getItem('terangaPoints') || 0),
  level: 'Bronze',
  badges: []
};

// Ouvrir le dashboard
function openUserDashboard() {
  calculateUserStats();
  const modal = document.getElementById('dashboardModal') || createDashboardModal();
  modal.style.display = 'flex';
  renderDashboard();
}
window.openUserDashboard = openUserDashboard;

// Créer le modal dashboard
function createDashboardModal() {
  const modal = document.createElement('div');
  modal.id = 'dashboardModal';
  modal.className = 'dashboard-modal';
  modal.innerHTML = `
    <div class="dashboard-content">
      <div class="dashboard-header">
        <h2>📊 Mon Dashboard Teranga</h2>
        <button onclick="closeDashboard()" class="close-btn">×</button>
      </div>
      
      <div class="dashboard-body" id="dashboardBody"></div>
    </div>
  `;

  document.body.appendChild(modal);
  return modal;
}

// Calculer les statistiques utilisateur
function calculateUserStats() {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const reviews = JSON.parse(localStorage.getItem('terangaReviews') || '[]');

  userStats.totalVisits = bookings.length;
  userStats.totalSpent = bookings.reduce((sum, b) => sum + (b.deposit || 5000), 0);
  userStats.totalPoints = parseInt(localStorage.getItem('terangaPoints') || 0);

  // Restaurant favori
  const restaurantCounts = {};
  bookings.forEach(b => {
    restaurantCounts[b.resto] = (restaurantCounts[b.resto] || 0) + 1;
  });
  userStats.favoriteRestaurant = Object.keys(restaurantCounts).reduce((a, b) =>
    restaurantCounts[a] > restaurantCounts[b] ? a : b, null);

  // Niveau VIP
  if (userStats.totalPoints >= 500) userStats.level = 'Platinum';
  else if (userStats.totalPoints >= 300) userStats.level = 'Gold';
  else if (userStats.totalPoints >= 150) userStats.level = 'Silver';
  else userStats.level = 'Bronze';

  // Badges
  userStats.badges = [];
  if (bookings.length >= 1) userStats.badges.push({ name: 'Premier Pas', icon: '🎯', desc: 'Première réservation' });
  if (bookings.length >= 5) userStats.badges.push({ name: 'Explorateur', icon: '🗺️', desc: '5 réservations' });
  if (bookings.length >= 10) userStats.badges.push({ name: 'Gourmet', icon: '👨‍🍳', desc: '10 réservations' });
  if (reviews.length >= 5) userStats.badges.push({ name: 'Critique', icon: '✍️', desc: '5 avis écrits' });
  if (userStats.totalPoints >= 200) userStats.badges.push({ name: 'Fidèle', icon: '🏆', desc: '200+ points' });
}

// Rendre le dashboard
function renderDashboard() {
  const container = document.getElementById('dashboardBody');
  if (!container) return;

  const levelColors = {
    'Bronze': '#cd7f32',
    'Silver': '#c0c0c0',
    'Gold': '#ffd700',
    'Platinum': '#e5e4e2'
  };

  container.innerHTML = `
    <!-- Niveau VIP -->
    <div class="vip-section" style="background: linear-gradient(135deg, ${levelColors[userStats.level]} 0%, ${levelColors[userStats.level]}dd 100%);">
      <div class="vip-badge">
        <div class="vip-icon">${userStats.level === 'Platinum' ? '💎' : userStats.level === 'Gold' ? '👑' : userStats.level === 'Silver' ? '⭐' : '🥉'}</div>
        <div class="vip-info">
          <h3>Membre ${userStats.level}</h3>
          <div class="points-display">${userStats.totalPoints} points</div>
        </div>
      </div>
      <div class="level-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${(userStats.totalPoints % 100)}%"></div>
        </div>
        <span>${100 - (userStats.totalPoints % 100)} points jusqu'au prochain niveau</span>
      </div>
    </div>
    
    <!-- Statistiques principales -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🍽️</div>
        <div class="stat-number">${userStats.totalVisits}</div>
        <div class="stat-label">Visites</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-number">${(userStats.totalSpent).toLocaleString()}</div>
        <div class="stat-label">FCFA dépensés</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⭐</div>
        <div class="stat-number">${userStats.totalPoints}</div>
        <div class="stat-label">Points</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🎖️</div>
        <div class="stat-number">${userStats.badges.length}</div>
        <div class="stat-label">Badges</div>
      </div>
    </div>
    
    <!-- Badges -->
    <div class="badges-section">
      <h3>🏆 Mes Badges</h3>
      <div class="badges-grid">
        ${userStats.badges.map(b => `
          <div class="badge-card">
            <div class="badge-icon">${b.icon}</div>
            <div class="badge-name">${b.name}</div>
            <div class="badge-desc">${b.desc}</div>
          </div>
        `).join('')}
        ${userStats.badges.length === 0 ? '<p style="color: #666;">Aucun badge pour le moment. Continuez à explorer !</p>' : ''}
      </div>
    </div>
    
    <!-- Graphique -->
    <div class="chart-section">
      <h3>📈 Activité mensuelle</h3>
      <canvas id="activityChart" width="400" height="200"></canvas>
    </div>
    
    <!-- Restaurant favori -->
    ${userStats.favoriteRestaurant ? `
      <div class="favorite-section">
        <h3>❤️ Votre restaurant préféré</h3>
        <div class="favorite-card">
          <strong>${userStats.favoriteRestaurant}</strong>
        </div>
      </div>
    ` : ''}
    
    <!-- Actions rapides -->
    <div class="quick-actions">
      <button class="action-card" onclick="displayAllBadges()">
        <span class="action-icon">🏆</span>
        <span>Mes Badges</span>
      </button>
      <button class="action-card" onclick="openReferralModal()">
        <span class="action-icon">🎁</span>
        <span>Parrainage</span>
      </button>
      <button class="action-card" onclick="openPassport()">
        <span class="action-icon">🛂</span>
        <span>Passeport Teranga</span>
      </button>
      <button class="action-card" onclick="openUserDashboard(); renderPointsHistory();">
        <span class="action-icon">📊</span>
        <span>Points</span>
      </button>
    </div>
  `;

  // Render chart
  setTimeout(() => renderActivityChart(), 100);
}

// Rendre le graphique d'activité
function renderActivityChart() {
  const canvas = document.getElementById('activityChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

  // Simple bar chart
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
  const data = months.map(() => Math.floor(Math.random() * 5) + bookings.length / 6);

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / months.length - 20;
  const maxValue = Math.max(...data);

  data.forEach((value, i) => {
    const barHeight = (value / maxValue) * (canvas.height - 40);
    const x = i * (barWidth + 20) + 10;
    const y = canvas.height - barHeight - 20;

    // Draw bar
    ctx.fillStyle = '#003580';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Draw label
    ctx.fillStyle = '#333';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(months[i], x + barWidth / 2, canvas.height - 5);
    ctx.fillText(Math.round(value), x + barWidth / 2, y - 5);
  });
}

// Fermer le dashboard
function closeDashboard() {
  const modal = document.getElementById('dashboardModal');
  if (modal) modal.style.display = 'none';
}
window.closeDashboard = closeDashboard;

console.log('✅ Dashboard utilisateur chargé');
