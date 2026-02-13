import { restaurants } from './data.js';

// Système d'Avis et Notes - TerangaReserve
let userReviews = JSON.parse(localStorage.getItem('terangaReviews')) || [];

// Structure d'un avis
/*
{
  id: unique_id,
  restaurantId: 1,
  restaurantName: "Le Lagon 1",
  userId: user_id,
  userName: "Jean Dupont",
  userAvatar: url,
  rating: 4.5,
  ratings: {
    food: 5,
    service: 4,
    ambiance: 4,
    valueForMoney: 5
  },
  comment: "Excellent restaurant...",
  photos: [url1, url2],
  date: "2024-02-12",
  verified: true, // Réservation vérifiée
  helpful: 12, // Nombre de votes "utile"
  response: null, // Réponse du restaurateur
  likes: []
}
*/

// Ouvrir le modal d'avis
function openReviewModal(restaurantId, restaurantName) {
  const modal = document.getElementById('reviewModal') || createReviewModal();
  const restaurant = restaurants.find(r => r.id === restaurantId);

  if (!restaurant) return;

  // Vérifier si l'utilisateur a une réservation vérifiée
  const hasBooking = checkVerifiedBooking(restaurantId);

  document.getElementById('reviewRestaurantName').textContent = restaurant.name;
  document.getElementById('reviewRestaurantId').value = restaurantId;
  document.getElementById('reviewVerified').style.display = hasBooking ? 'block' : 'none';

  modal.style.display = 'flex';
}
window.openReviewModal = openReviewModal;

// Créer le modal d'avis
function createReviewModal() {
  const modal = document.createElement('div');
  modal.id = 'reviewModal';
  modal.className = 'review-modal';
  modal.innerHTML = `
    <div class="review-modal-content">
      <div class="review-modal-header">
        <h2>✍️ Laisser un avis</h2>
        <button onclick="closeReviewModal()" class="close-btn">×</button>
      </div>
      
      <div class="review-modal-body">
        <h3 id="reviewRestaurantName"></h3>
        <input type="hidden" id="reviewRestaurantId">
        
        <div id="reviewVerified" class="verified-badge" style="display: none;">
          ✅ Réservation vérifiée - Votre avis aura plus de poids !
        </div>
        
        <div class="rating-section">
          <h4>Note globale</h4>
          <div class="star-rating" id="globalRating">
            ${[1, 2, 3, 4, 5].map(i => `<span class="star" data-rating="${i}">★</span>`).join('')}
          </div>
          <span class="rating-value" id="globalRatingValue">0/5</span>
        </div>
        
        <div class="detailed-ratings">
          <h4>Notes détaillées</h4>
          <div class="rating-row">
            <label>🍽️ Nourriture</label>
            <div class="star-rating small" data-type="food">
              ${[1, 2, 3, 4, 5].map(i => `<span class="star" data-rating="${i}">★</span>`).join('')}
            </div>
          </div>
          <div class="rating-row">
            <label>👨‍🍳 Service</label>
            <div class="star-rating small" data-type="service">
              ${[1, 2, 3, 4, 5].map(i => `<span class="star" data-rating="${i}">★</span>`).join('')}
            </div>
          </div>
          <div class="rating-row">
            <label>🎵 Ambiance</label>
            <div class="star-rating small" data-type="ambiance">
              ${[1, 2, 3, 4, 5].map(i => `<span class="star" data-rating="${i}">★</span>`).join('')}
            </div>
          </div>
          <div class="rating-row">
            <label>💰 Rapport Q/P</label>
            <div class="star-rating small" data-type="valueForMoney">
              ${[1, 2, 3, 4, 5].map(i => `<span class="star" data-rating="${i}">★</span>`).join('')}
            </div>
          </div>
        </div>
        
        <div class="comment-section">
          <h4>Votre expérience</h4>
          <textarea id="reviewComment" placeholder="Partagez votre expérience au restaurant..." rows="5"></textarea>
          <div class="char-count"><span id="charCount">0</span>/500</div>
        </div>
        
        <div class="photo-upload">
          <h4>📸 Photos (optionnel)</h4>
          <input type="file" id="reviewPhotos" multiple accept="image/*" style="display: none;">
          <button class="upload-btn" onclick="document.getElementById('reviewPhotos').click()">
            Ajouter des photos
          </button>
          <div id="photoPreview" class="photo-preview"></div>
        </div>
        
        <button class="submit-review-btn" onclick="submitReview()">Publier mon avis</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  initializeStarRatings();

  return modal;
}

// Initialiser les étoiles cliquables
function initializeStarRatings() {
  document.querySelectorAll('.star-rating').forEach(container => {
    const stars = container.querySelectorAll('.star');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.dataset.rating);
        const type = container.dataset.type || 'global';

        // Mise à jour visuelle
        stars.forEach((s, i) => {
          s.classList.toggle('active', i < rating);
        });

        // Mise à jour de la valeur
        if (type === 'global') {
          document.getElementById('globalRatingValue').textContent = `${rating}/5`;
        }

        star.parentElement.dataset.selectedRating = rating;
      });
    });
  });

  // Character counter
  const textarea = document.getElementById('reviewComment');
  if (textarea) {
    textarea.addEventListener('input', () => {
      const count = textarea.value.length;
      document.getElementById('charCount').textContent = count;
      if (count > 500) {
        textarea.value = textarea.value.substring(0, 500);
      }
    });
  }
}

// Vérifier si l'utilisateur a une réservation vérifiée
function checkVerifiedBooking(restaurantId) {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  return bookings.some(b => b.resto.includes(restaurants.find(r => r.id === restaurantId)?.name));
}

// Soumettre l'avis
function submitReview() {
  const restaurantId = parseInt(document.getElementById('reviewRestaurantId').value);
  const restaurant = restaurants.find(r => r.id === restaurantId);
  const globalRating = parseInt(document.querySelector('#globalRating').dataset.selectedRating || 0);
  const comment = document.getElementById('reviewComment').value.trim();

  if (globalRating === 0) {
    showToastNotification('Veuillez donner une note globale', 'error');
    return;
  }

  if (!comment || comment.length < 10) {
    showToastNotification('Votre commentaire doit faire au moins 10 caractères', 'error');
    return;
  }

  const review = {
    id: Date.now(),
    restaurantId: restaurantId,
    restaurantName: restaurant.name,
    userId: 'user_' + Date.now(),
    userName: 'Utilisateur Teranga',
    userAvatar: 'https://ui-avatars.com/api/?name=User&background=003580&color=fff',
    rating: globalRating,
    ratings: {
      food: parseInt(document.querySelector('[data-type="food"]').dataset.selectedRating || globalRating),
      service: parseInt(document.querySelector('[data-type="service"]').dataset.selectedRating || globalRating),
      ambiance: parseInt(document.querySelector('[data-type="ambiance"]').dataset.selectedRating || globalRating),
      valueForMoney: parseInt(document.querySelector('[data-type="valueForMoney"]').dataset.selectedRating || globalRating)
    },
    comment: comment,
    photos: [],
    date: new Date().toISOString(),
    verified: checkVerifiedBooking(restaurantId),
    helpful: 0,
    response: null,
    likes: []
  };

  userReviews.push(review);
  localStorage.setItem('terangaReviews', JSON.stringify(userReviews));

  showToastNotification('✅ Merci pour votre avis ! +10 points Teranga', 'success');

  // Award points
  const currentPoints = parseInt(localStorage.getItem('terangaPoints') || 0);
  localStorage.setItem('terangaPoints', currentPoints + 10);

  closeReviewModal();

  // Reload reviews if on restaurant page
  if (window.currentRestaurantId === restaurantId) {
    displayRestaurantReviews(restaurantId);
  }
}
window.submitReview = submitReview;

// Afficher les avis d'un restaurant
function displayRestaurantReviews(restaurantId) {
  const restaurant = restaurants.find(r => r.id === restaurantId);
  if (!restaurant) return;

  // Combiner les avis par défaut et les avis utilisateurs
  const defaultReviews = restaurant.reviews || [];
  const userRestaurantReviews = userReviews.filter(r => r.restaurantId === restaurantId);
  const allReviews = [...userRestaurantReviews, ...defaultReviews.map((r, i) => ({
    ...r,
    id: `default_${i}`,
    userName: r.author,
    verified: false,
    helpful: Math.floor(Math.random() * 20),
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
  }))];

  const reviewsContainer = document.getElementById('reviewsContent');
  if (!reviewsContainer) return;

  const avgRating = allReviews.length > 0
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : restaurant.rating;

  reviewsContainer.innerHTML = `
    <div class="reviews-summary">
      <div class="overall-rating">
        <div class="rating-number">${avgRating}</div>
        <div class="rating-stars">${'★'.repeat(Math.round(avgRating))}</div>
        <div class="rating-count">${allReviews.length} avis</div>
      </div>
      <button class="add-review-btn" onclick="openReviewModal(${restaurantId}, '${restaurant.name}')">
        ✍️ Laisser un avis
      </button>
    </div>
    
    <div class="reviews-list">
      ${allReviews.map(r => `
        <div class="review-card ${r.verified ? 'verified' : ''}">
          <div class="review-header">
            <img src="${r.userAvatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(r.userName)}" 
                 class="reviewer-avatar" alt="${r.userName}">
            <div class="reviewer-info">
              <div class="reviewer-name">
                ${r.userName}
                ${r.verified ? '<span class="verified-icon" title="Réservation vérifiée">✅</span>' : ''}
              </div>
              <div class="review-date">${new Date(r.date).toLocaleDateString('fr-FR')}</div>
            </div>
            <div class="review-rating">${r.rating} ★</div>
          </div>
          <div class="review-body">
            <p>${r.comment}</p>
            ${r.ratings ? `
              <div class="detailed-ratings-display">
                <span>🍽️ ${r.ratings.food}/5</span>
                <span>👨‍🍳 ${r.ratings.service}/5</span>
                <span>🎵 ${r.ratings.ambiance}/5</span>
                <span>💰 ${r.ratings.valueForMoney}/5</span>
              </div>
            ` : ''}
          </div>
          <div class="review-footer">
            <button class="helpful-btn" onclick="markHelpful('${r.id}')">
              👍 Utile (${r.helpful || 0})
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
window.displayRestaurantReviews = displayRestaurantReviews;

// Marquer un avis comme utile
function markHelpful(reviewId) {
  const review = userReviews.find(r => r.id == reviewId);
  if (review) {
    review.helpful = (review.helpful || 0) + 1;
    localStorage.setItem('terangaReviews', JSON.stringify(userReviews));
    showToastNotification('Merci pour votre feedback !', 'success');
  }
}
window.markHelpful = markHelpful;

// Fermer le modal
function closeReviewModal() {
  const modal = document.getElementById('reviewModal');
  if (modal) modal.style.display = 'none';
}
window.closeReviewModal = closeReviewModal;

console.log('✅ Système d\'avis chargé');
