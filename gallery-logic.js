/**
 * TerangaReserve - User Photo Gallery & Uploads
 * 
 * Logic for displaying restaurant photo galleries and
 * handling user photo uploads for reviews.
 */

// Global state for galleries
let currentGallery = [];
let currentPhotoIndex = 0;

/**
 * Open photo gallery for a restaurant
 * @param {number} restaurantId 
 */
function openGallery(restaurantId) {
    const resto = restaurants.find(r => r.id === restaurantId);
    if (!resto) return;

    // Combine default and user photos (if any)
    const userReviews = JSON.parse(localStorage.getItem('terangaReviews') || '[]');
    const userPhotos = userReviews
        .filter(r => r.restaurantId === restaurantId && r.photos)
        .flatMap(r => r.photos);

    // In demo, we add some high quality placeholders if none exist
    const defaultPhotos = [
        `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80`,
        `https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80`,
        `https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80`
    ];

    currentGallery = [...userPhotos, ...defaultPhotos];
    currentPhotoIndex = 0;

    const modal = document.getElementById('galleryOverlay') || createGalleryOverlay();
    modal.style.display = 'flex';
    updateGalleryDisplay();
}
window.openGallery = openGallery;

function createGalleryOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'galleryOverlay';
    overlay.className = 'gallery-overlay';
    overlay.innerHTML = `
        <div class="gallery-close" onclick="closeGallery()">×</div>
        <div class="gallery-nav prev" onclick="prevPhoto()">‹</div>
        <div class="gallery-main">
            <img id="galleryImage" src="" alt="Restaurant photo">
            <div id="photoCounter" class="photo-counter"></div>
        </div>
        <div class="gallery-nav next" onclick="nextPhoto()">›</div>
    `;
    document.body.appendChild(overlay);
    return overlay;
}

function updateGalleryDisplay() {
    const img = document.getElementById('galleryImage');
    const counter = document.getElementById('photoCounter');

    img.src = currentGallery[currentPhotoIndex];
    counter.textContent = `${currentPhotoIndex + 1} / ${currentGallery.length}`;
}

function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % currentGallery.length;
    updateGalleryDisplay();
}
window.nextPhoto = nextPhoto;

function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + currentGallery.length) % currentGallery.length;
    updateGalleryDisplay();
}
window.prevPhoto = prevPhoto;

function closeGallery() {
    document.getElementById('galleryOverlay').style.display = 'none';
}
window.closeGallery = closeGallery;

/**
 * Handle image file selection for reviews
 */
function handlePhotoUpload(input) {
    const previewContainer = document.getElementById('photoPreview');
    if (!previewContainer) return;

    previewContainer.innerHTML = ''; // Clear previous
    const files = input.files;

    if (files.length > 5) {
        showToastNotification('Limite de 5 photos par avis', 'warning');
    }

    Array.from(files).slice(0, 5).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <span class="remove-p-btn">×</span>
            `;
            // Simplified: we don't handle remove in this demo to save space
            previewContainer.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}
window.handlePhotoUpload = handlePhotoUpload;

console.log('✅ Galerie Photos chargé');
