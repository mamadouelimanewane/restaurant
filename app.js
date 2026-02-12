import { restaurants } from './data.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Chart from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import './style.css';
import './admin.css';

// Safe state management
let bookings = [];
try { bookings = JSON.parse(localStorage.getItem('teranga_bookings')) || []; } catch (e) { }
let passport = {};
try { passport = JSON.parse(localStorage.getItem('teranga_passport')) || {}; } catch (e) { }

// UI State
window.map = null;
window.markers = L.layerGroup();
let isMapVisible = false;
let currentResto = null;
let currentBookingData = null;

// Dropdown Toggle (Ultra Robust)
function showDestinations(e) {
    if (e) e.stopPropagation();
    var dropdown = document.getElementById('destinationDropdown');
    if (dropdown) {
        dropdown.style.display = 'block';
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
    }
}
window.showDestinations = showDestinations;

function selectDestination(city) {
    var input = document.getElementById('searchInput');
    if (input) input.value = city;
    var dropdown = document.getElementById('destinationDropdown');
    if (dropdown) dropdown.style.display = 'none';
    filterRestaurants();
}
window.selectDestination = selectDestination;

function filterDestinations() {
    var val = (document.getElementById('searchInput')?.value || '').toLowerCase();
    var items = document.querySelectorAll('.dropdown-item');
    items.forEach(function (item) {
        var text = item.innerText.toLowerCase();
        item.style.display = text.includes(val) ? 'flex' : 'none';
    });
}
window.filterDestinations = filterDestinations;

// Global click to close
document.addEventListener('click', function (e) {
    var wrapper = document.querySelector('.destination-wrapper');
    var dropdown = document.getElementById('destinationDropdown');
    if (dropdown && wrapper && !wrapper.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

// Hidden Admin Trigger: Press 'A' + 'D' + 'M' (simplified for demo: triple click on footer logo or a specific key)
window.addEventListener('keydown', (e) => {
    if (e.key === 'A' && e.shiftKey && e.ctrlKey) toggleAdminPortal();
});

// Initialize Map
function initMap() {
    if (window.map) return;
    window.map = L.map('map').setView([14.6, -17.2], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(window.map);
    window.markers.addTo(window.map);
    updateMarkers(restaurants);
}

function updateMarkers(items) {
    if (!window.markers) return;
    window.markers.clearLayers();
    items.forEach(resto => {
        if (!resto.lat || !resto.lng) return;
        const popup = `
            <div class="map-popup">
                <img src="${resto.image}" alt="${resto.name}">
                <div class="map-popup-info">
                    <span class="map-popup-name">${resto.name}</span>
                    <button onclick="openBooking(${resto.id})" style="background: #006ce4; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; float: right; cursor: pointer;">Réserver</button>
                </div>
            </div>`;
        L.marker([resto.lat, resto.lng]).bindPopup(popup).addTo(window.markers);
    });
    if (items.length > 0 && window.map) {
        const group = new L.featureGroup(items.map(r => L.marker([r.lat, r.lng])));
        window.map.fitBounds(group.getBounds().pad(0.1));
    }
}

function toggleMapView() {
    isMapVisible = !isMapVisible;
    const mapContainer = document.getElementById('mapContainer');
    const toggleBtn = document.getElementById('toggleMapBtn');
    if (isMapVisible) {
        mapContainer.style.display = 'block';
        toggleBtn.innerText = '📋 Voir la liste';
        initMap();
        setTimeout(() => { if (window.map) window.map.invalidateSize(); }, 150);
    } else {
        mapContainer.style.display = 'none';
        toggleBtn.innerText = '🗺️ Voir la carte';
    }
}
window.toggleMapView = toggleMapView;

function getRatingText(rating) {
    if (rating >= 4.7) return "Exceptionnel";
    if (rating >= 4.5) return "Superbe";
    if (rating >= 4.0) return "Très bien";
    return "Bien";
}

function renderRestaurants(items) {
    const listingGrid = document.getElementById('dynamicListingGrid');
    const countLabel = document.getElementById('resultsCount');
    if (!listingGrid) {
        console.warn("Teranga: dynamicListingGrid not found in DOM.");
        return;
    }

    if (countLabel) {
        countLabel.innerText = items.length > 0 ? `${items.length} établissements trouvés` : "Aucun établissement trouvé";
    }

    if (!items.length) {
        listingGrid.innerHTML = '<p style="padding: 2rem; text-align: center; width: 100%;">Aucun résultat ne correspond à vos critères. Essayez une autre ville ou destination.</p>';
        return;
    }
    listingGrid.innerHTML = items.map(resto => {
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${resto.lat},${resto.lng}`;
        const ratingText = getRatingText(resto.rating);
        return `
        <div class="booking-card">
            <div class="booking-card-img-container">
                <img src="${resto.image}" class="booking-card-img">
            </div>
            <div class="booking-card-content">
                <div class="card-details">
                    <h3>${resto.name}</h3>
                    <div class="card-location">
                        ${resto.district}, ${resto.city} • <a href="${mapsUrl}" target="_blank">📍 Voir sur la carte</a>
                    </div>
                    <div class="card-cuisine">${resto.cuisine} • ${resto.priceRange}</div>
                    
                    ${resto.promo ? `<div class="card-features" style="color: #008009;">✅ ${resto.promo}</div>` : ''}
                    ${resto.event ? `<div class="card-features" style="color: var(--event-purple);">✨ ${resto.event}</div>` : ''}
                    
                    <div class="card-features" style="margin-top: 10px;">
                        ${resto.features.slice(0, 3).map(f => `<span>• ${f} </span>`).join('')}
                    </div>

                    <div class="card-pricing" style="font-size: 0.8rem; color: #d4111e; font-weight: 700;">
                        Acompte: ${(resto.avgPrice * 0.2).toLocaleString()} FCFA / convive
                    </div>
                </div>
                <div class="card-right-panel">
                    <div class="rating-container">
                        <div class="rating-text">${ratingText}</div>
                        <div class="rating-score">${resto.rating}</div>
                    </div>
                    <button class="see-availability" data-restaurant-id="${resto.id}">Découvrir l'établissement</button>
                </div>
            </div>
        </div>`;
    }).join('');

    // ✨ Event delegation for all "Découvrir l'établissement" buttons
    // This eliminates scope issues with onclick attributes
    setTimeout(() => {
        attachRestaurantButtonListeners();
    }, 100);
}

// Event delegation for restaurant buttons
function attachRestaurantButtonListeners() {
    const listingGrid = document.getElementById('dynamicListingGrid');
    if (!listingGrid) {
        console.warn("Teranga: Cannot attach listeners, dynamicListingGrid not found");
        return;
    }

    // Remove old listeners if any
    const oldClone = listingGrid.cloneNode(true);
    listingGrid.parentNode.replaceChild(oldClone, listingGrid);

    // Add new listener with event delegation
    const newGrid = document.getElementById('dynamicListingGrid');
    newGrid.addEventListener('click', function (event) {
        const button = event.target.closest('.see-availability');
        if (button) {
            event.preventDefault();
            const restaurantId = parseInt(button.getAttribute('data-restaurant-id'), 10);
            console.log('🎯 Button clicked! Restaurant ID:', restaurantId);
            if (restaurantId) {
                openBooking(restaurantId);
            } else {
                console.error('❌ No restaurant ID found on button');
            }
        }
    });

    console.log('✅ Restaurant button listeners attached');
}

function filterRestaurants() {
    const searchInput = document.getElementById('searchInput');
    const term = (searchInput ? searchInput.value : '').toLowerCase();

    // Improved robust selection for checkboxes
    const locsChecked = Array.from(document.querySelectorAll('.filters-sidebar input[type="checkbox"]'))
        .filter(el => el.checked && ["Dakar", "Saly", "Saint-Louis", "Cap Skirring"].includes(el.value))
        .map(el => el.value);

    const cuisChecked = Array.from(document.querySelectorAll('.filters-sidebar input[type="checkbox"]'))
        .filter(el => el.checked && !["Dakar", "Saly", "Saint-Louis", "Cap Skirring"].includes(el.value))
        .map(el => el.value);

    const filtered = restaurants.filter(r => {
        const matchesTerm = r.name.toLowerCase().includes(term) || r.city.toLowerCase().includes(term);
        const matchesLoc = !locsChecked.length || locsChecked.some(l => r.city.includes(l));
        const matchesCui = !cuisChecked.length || cuisChecked.some(c => r.cuisine.includes(c));
        return matchesTerm && matchesLoc && matchesCui;
    });
    renderRestaurants(filtered);
    if (window.map) updateMarkers(filtered);
}
window.filterRestaurants = filterRestaurants;

function openBooking(id) {
    console.log('🎯 openBooking called with ID:', id);
    currentResto = restaurants.find(r => r.id === id);
    if (!currentResto) {
        console.error("Teranga: Restaurant not found with ID", id);
        alert(`Restaurant avec ID ${id} non trouvé. Veuillez rafraîchir la page.`);
        return;
    }

    console.log('✅ Restaurant found:', currentResto.name);

    const displayName = currentResto.name.toLowerCase().startsWith('chez') ? currentResto.name : `Chez ${currentResto.name}`;
    const modalRestoName = document.getElementById('modalRestoName');
    if (modalRestoName) {
        modalRestoName.innerText = displayName;
    }

    const tablePreview = document.getElementById('tablePreview');
    if (tablePreview) {
        tablePreview.src = currentResto.tableImage;
        tablePreview.style.display = 'block';
    }

    const bookingFlowWrapper = document.getElementById('bookingFlowWrapper');
    if (bookingFlowWrapper) {
        bookingFlowWrapper.style.display = 'block';
    }

    const successView = document.getElementById('successView');
    if (successView) {
        successView.style.display = 'none';
    }

    const modalTabs = document.getElementById('modalTabs');
    if (modalTabs) {
        modalTabs.style.display = 'flex';
    }

    renderPresentation(currentResto);
    renderMenu(currentResto.menu);
    renderReviews(currentResto.reviews);
    renderFloorPlan();

    switchModalTab('presentation');

    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        console.log('✅ Modal opened successfully');
    } else {
        console.error('❌ Modal element not found!');
    }
}
// Expose to global scope for inline onclick handlers
window.openBooking = openBooking;

function switchModalTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.getAttribute('onclick')?.includes(`'${tabId}'`)));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === `tab-${tabId}`));
    if (tabId === 'tables') renderFloorPlan();
}
window.switchModalTab = switchModalTab;

let selectedTable = null;
function renderFloorPlan() {
    const container = document.getElementById('floorPlan');
    if (!container) return;

    // Default table layout if restaurant doesn't have one
    const tables = currentResto.tables || [
        { id: 1, type: 'square' }, { id: 2, type: 'square' }, { id: 3, type: 'round', occupied: true },
        { id: 4, type: 'large' }, { id: 5, type: 'square' }, { id: 6, type: 'round' },
        { id: 7, type: 'square' }, { id: 8, type: 'square', occupied: true }, { id: 9, type: 'large' }
    ];

    container.innerHTML = tables.map(t => `
        <div class="table-node ${t.type} ${t.occupied ? 'occupied' : ''} ${(selectedTable && selectedTable.id === t.id) ? 'selected' : ''}" 
             onclick="${t.occupied ? '' : `selectTable(${t.id}, '${t.name || `Table ${t.id}`}')`}">
            ${t.name ? `<span style="font-size: 0.6rem; display: block; line-height: 1;">${t.name}</span>` : ''}
            T${t.id}
        </div>
    `).join('');
}

function selectTable(id, name) {
    if (selectedTable && selectedTable.id === id) {
        selectedTable = null;
    } else {
        selectedTable = { id, name };
    }
    renderFloorPlan();
}
window.selectTable = selectTable;

document.getElementById('bookingForm').onsubmit = (e) => {
    e.preventDefault();
    const guests = parseInt(document.getElementById('guestCount').value);
    const depositAmount = guests * currentResto.avgPrice * 0.2;

    currentBookingData = {
        resto: currentResto.name,
        date: document.getElementById('bookingDate').value,
        time: document.getElementById('bookingTime').value,
        guests: guests,
        phone: document.getElementById('phoneInput').value,
        depositAmount: depositAmount,
        table: selectedTable ? `${selectedTable.name} (T${selectedTable.id})` : "Attribuée à l'arrivée"
    };

    // Update payment text in UI
    document.getElementById('paymentDepositText').innerText = `Pour garantir votre table (${guests} pers.), un acompte de 20% soit ${depositAmount.toLocaleString()} FCFA est requis (déductible de l'addition).`;

    switchModalTab('payment');
};

function processPayment(method) {
    const btn = event.currentTarget;
    const oldText = btn.innerHTML;
    btn.innerHTML = 'Traitement...';

    setTimeout(() => {
        const newBooking = {
            ...currentBookingData,
            id: Date.now(),
            method,
            status: 'Payé',
            amount: `${currentBookingData.depositAmount.toLocaleString()} FCFA`
        };
        bookings.push(newBooking);
        localStorage.setItem('teranga_bookings', JSON.stringify(bookings));

        document.getElementById('bookingFlowWrapper').style.display = 'none';
        document.getElementById('successView').style.display = 'block';
        document.getElementById('bookingSummary').innerHTML = `
            <strong>${newBooking.resto}</strong> - ${newBooking.table}<br>
            Le ${newBooking.date} à ${newBooking.time}<br>
            Acompte (20%) via ${method}: ${newBooking.amount} reçu.
        `;

        // Setup transport button click handler
        const transportBtn = document.getElementById('btnBookTransportSuccess');
        if (transportBtn) {
            transportBtn.onclick = () => {
                if (typeof openTransportModal === 'function' && currentResto) {
                    openTransportModal(currentResto.id);
                } else {
                    alert("Module de transport en cours de chargement...");
                }
            };
        }

        btn.innerHTML = oldText;
        if (typeof renderOwnerBookings === 'function') renderOwnerBookings(); // Refresh if open

        // Trigger gamification check
        if (typeof checkAndUnlockBadges === 'function') checkAndUnlockBadges();
        if (typeof checkChallenges === 'function') checkChallenges();
    }, 1500);
}
window.processPayment = processPayment;

// Owner Dashboard Logic
let currentOwnerRestoId = 1; // Default to Le Lagon 1 for demo

function toggleOwnerDashboard() {
    const dash = document.getElementById('ownerDashboard');
    const isVisible = dash.style.display === 'block';
    dash.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
        switchOwnerTab('reservations');
        renderOwnerBookings();
    }
}
window.toggleOwnerDashboard = toggleOwnerDashboard;

function switchOwnerTab(tabId) {
    document.querySelectorAll('.owner-tab-content').forEach(c => c.style.display = 'none');
    document.getElementById(`owner-tab-${tabId}`).style.display = 'block';

    document.querySelectorAll('#ownerDashboard .tab-btn').forEach(b => {
        b.classList.toggle('active', b.id.toLowerCase().includes(tabId));
    });

    if (tabId === 'menu') renderMenuEditor();
    if (tabId === 'stats') renderStatsChart();
}
window.switchOwnerTab = switchOwnerTab;

let bookingsChart = null;
function renderStatsChart() {
    const canvas = document.getElementById('bookingsChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Generate dummy data based on real bookings + simulated past data
    const labels = ['Sept', 'Oct', 'Nov', 'Déc', 'Jan', 'Féb'];
    const realBookingsCount = bookings.length;
    const data = [12, 19, 15, 28, 22, 15 + realBookingsCount];

    if (bookingsChart) bookingsChart.destroy();

    bookingsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Nombre de Réservations',
                data: data,
                borderColor: '#006ce4',
                backgroundColor: 'rgba(0, 108, 228, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, grid: { display: false } },
                x: { grid: { display: false } }
            }
        }
    });
}

function renderOwnerBookings() {
    const tbody = document.getElementById('bookingsTableBody');
    if (!tbody) return;

    tbody.innerHTML = bookings.length ? bookings.slice().reverse().map(b => `
        <tr>
            <td><strong>${b.date}</strong> à ${b.time}</td>
            <td>${b.phone}<br><small>${b.resto}</small></td>
            <td>${b.guests}p</td>
            <td><span class="status-badge status-paid">${b.status}</span></td>
            <td><button class="partner-btn" style="background:#eee; color:#333; font-size:0.7rem;">Gérer</button></td>
        </tr>
    `).join('') : '<tr><td colspan="5" style="text-align:center">Aucune réservation pour le moment.</td></tr>';

    document.getElementById('statToday').innerText = bookings.length;
    const totalIncome = bookings.reduce((sum, b) => {
        const val = parseInt(b.amount.replace(/[^0-9]/g, '')) || 0;
        return sum + val;
    }, 0);
    document.getElementById('statIncome').innerText = `${totalIncome.toLocaleString()} FCFA`;
}

// Menu Management Functions
function renderMenuEditor() {
    const container = document.getElementById('menuEditorContainer');
    const resto = restaurants.find(r => r.id === currentOwnerRestoId);

    container.innerHTML = `<h3>Menu de : ${resto.name}</h3><br>`;

    resto.menu.forEach((cat, catIdx) => {
        cat.items.forEach((item, itemIdx) => {
            container.innerHTML += `
                <div class="menu-edit-row" data-cat="${catIdx}" data-item="${itemIdx}" style="display: grid; grid-template-columns: 2fr 3fr 1fr 50px; gap: 10px; margin-bottom: 10px; background: white; padding: 10px; border-radius: 4px; border: 1px solid #eee;">
                    <input type="text" value="${item.name}" placeholder="Nom du plat" class="edit-name">
                    <input type="text" value="${item.desc}" placeholder="Description" class="edit-desc">
                    <input type="text" value="${item.price}" placeholder="Prix" class="edit-price">
                    <button onclick="removeMenuItem(this)" style="background:#ff4757; color:white; border:none; border-radius:4px; cursor:pointer;">&times;</button>
                </div>
            `;
        });
    });
}

window.addMenuItem = () => {
    const container = document.getElementById('menuEditorContainer');
    const newRow = document.createElement('div');
    newRow.className = 'menu-edit-row';
    newRow.style = "display: grid; grid-template-columns: 2fr 3fr 1fr 50px; gap: 10px; margin-bottom: 10px; background: white; padding: 10px; border-radius: 4px; border: 1px solid #eee;";
    newRow.innerHTML = `
        <input type="text" placeholder="Nouveau plat..." class="edit-name">
        <input type="text" placeholder="Description..." class="edit-desc">
        <input type="text" placeholder="Prix (ex: 10.000 FCFA)" class="edit-price">
        <button onclick="removeMenuItem(this)" style="background:#ff4757; color:white; border:none; border-radius:4px; cursor:pointer;">&times;</button>
    `;
    container.appendChild(newRow);
};

window.removeMenuItem = (btn) => {
    btn.parentElement.remove();
};

window.saveMenuChanges = () => {
    const rows = document.querySelectorAll('.menu-edit-row');
    const resto = restaurants.find(r => r.id === currentOwnerRestoId);

    // Simplification for demo: Reconstruct first category
    const newItems = Array.from(rows).map(row => ({
        name: row.querySelector('.edit-name').value,
        desc: row.querySelector('.edit-desc').value,
        price: row.querySelector('.edit-price').value
    }));

    // Update global data
    resto.menu = [{ category: "Carte Dynamique", items: newItems }];

    alert('Menu mis à jour avec succès !');
    renderRestaurants(restaurants); // Refresh consumer view
};

function closeModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
}
window.closeModal = closeModal;

function renderPresentation(resto) {
    const target = document.getElementById('presentationContent');
    if (!target) return;

    // Populate gallery
    const galleryImages = [
        resto.image,
        resto.tableImage,
        resto.image, // Using existing images
        resto.tableImage
    ].filter(Boolean);

    const galleryContainer = document.getElementById('restoGallery');
    if (galleryContainer) {
        galleryContainer.innerHTML = galleryImages.map((img, idx) =>
            `<img src="${img}" class="gallery-image" alt="${resto.name} ${idx + 1}" />`
        ).join('');
    }

    // Show navigation buttons if more than 1 image
    const navButtons = document.querySelectorAll('.gallery-nav');
    navButtons.forEach(btn => btn.style.display = galleryImages.length > 1 ? 'flex' : 'none');

    target.innerHTML = `
        <div class="presentation-view">
            <div class="resto-info" style="margin: 1.5rem 0;">
                <h3 style="margin: 0 0 0.5rem 0; font-size: 1.8rem; color: #1a1a1a;">${resto.name}</h3>
                <p style="margin: 0; font-size: 1rem; color: #666;">
                    <span style="font-weight: 600;">${resto.district}, ${resto.city}</span>
                </p>
            </div>
            
            <div class="resto-description" style="margin-bottom: 1.5rem; padding: 1rem; background: #f8f9fa; border-left: 4px solid var(--booking-blue); border-radius: 4px;">
                <p style="color: #444; line-height: 1.7; font-size: 0.95rem; margin: 0;">${resto.description}</p>
            </div>
            
            <div class="resto-highlights" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 1.5rem;">
                ${resto.features.map(f => `
                    <div style="background: linear-gradient(135deg, #f0f6ff 0%, #e0e9f5 100%); border: 1px solid #d0ddef; border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 8px; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        <span style="font-size: 1.2rem;">✨</span>
                        <span style="font-size: 0.85rem; color: #003580; font-weight: 600;">${f}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}


function renderMenu(menu) {
    const target = document.getElementById('digitalMenuContent');
    if (!target) return;

    target.innerHTML = menu ? menu.map(c => `
        <div class="menu-category" style="margin-bottom: 2rem;">
            <h4 style="margin: 0 0 1.2rem 0; color: var(--booking-blue); font-size: 1.2rem; font-weight: 700; padding-bottom: 0.5rem; border-bottom: 3px solid var(--booking-yellow);">${c.category}</h4>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${c.items.map(i => `
                    <div class="menu-item-card">
                        <img src="${i.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200'}" class="menu-item-image" alt="${i.name}">
                        <div class="menu-item-content">
                            <div class="menu-item-name">${i.name}</div>
                            <div class="menu-item-desc">${i.desc}</div>
                            <div class="menu-item-price">${i.price}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('') : '<p style="padding: 2rem; text-align: center; color: #666;">Menu non disponible.</p>';
}

function renderReviews(reviews) {
    if (typeof displayRestaurantReviews === 'function' && currentResto) {
        displayRestaurantReviews(currentResto.id);
    } else {
        const target = document.getElementById('reviewsContent');
        target.innerHTML = reviews ? reviews.map(r => `
            <div class="review-item"><div class="review-header"><strong>${r.author}</strong><span style="color:#febb02">${'★'.repeat(r.rating)}</span></div><p class="review-comment">"${r.comment}"</p></div>`).join('') : '<p>Pas d\'avis.</p>';
    }
}

function generatePDF() {
    const doc = new jsPDF();
    const booking = bookings[bookings.length - 1]; // Get latest booking
    const pdfResto = restaurants.find(r => r.name === booking.resto);

    // --- Design Elements ---
    doc.setFillColor(0, 53, 128); // Teranga Reserve Blue
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('TERANGA RESERVE', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('RECU DE RÉSERVATION - DAKAR / SENEGAL', 105, 30, { align: 'center' });

    // --- Content ---
    doc.setTextColor(51, 51, 51);
    doc.setFontSize(14);
    doc.text(`Facture N°: TR-${booking.id}`, 20, 60);
    doc.text(`Date d'émission: ${new Date().toLocaleDateString('fr-FR')}`, 20, 67);

    // Restaurant details
    doc.setFontSize(16);
    doc.text(`Établissement: ${booking.resto}`, 20, 85);
    doc.setFontSize(11);
    doc.text(`${pdfResto.district}, ${pdfResto.city}`, 20, 92);

    // Reservation info
    doc.setDrawColor(238, 238, 238);
    doc.line(20, 100, 190, 100);

    doc.setFontSize(12);
    doc.text('Détails de la Réservation :', 20, 115);
    doc.setFontSize(11);
    doc.text(`• Date : ${booking.date}`, 30, 125);
    doc.text(`• Heure : ${booking.time}`, 30, 132);
    doc.text(`• Table : ${booking.table}`, 30, 139);
    doc.text(`• Nombre de Convives : ${booking.guests} personne(s)`, 30, 146);
    doc.text(`• Téléphone : ${booking.phone}`, 30, 153);

    // Financial Recap
    doc.setFillColor(254, 187, 2); // Gold accent
    doc.rect(20, 160, 170, 30, 'F');
    doc.setTextColor(33, 33, 33);
    doc.setFontSize(13);
    doc.text('TOTAL ACOMPTE PAYÉ (20%)', 30, 172);
    doc.setFontSize(16);
    doc.text(`${booking.amount}`, 180, 178, { align: 'right' });
    doc.setFontSize(9);
    doc.text(`Méthode de paiement : ${booking.method}`, 30, 184);

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(9);
    doc.text('Cet acompte sera déduit de votre facture finale au restaurant.', 105, 250, { align: 'center' });
    doc.text('Merci de présenter ce document ou le SMS de confirmation à votre arrivée.', 105, 257, { align: 'center' });
    doc.text('--- TerangaReserve.sn - Le luxe de la réservation ---', 105, 280, { align: 'center' });

    // Award Passport Stamp
    if (pdfResto && pdfResto.city) {
        if (!passport[pdfResto.city]) {
            passport[pdfResto.city] = new Date().toLocaleDateString('fr-FR');
            localStorage.setItem('teranga_passport', JSON.stringify(passport));
            console.log(`Stamp awarded for ${pdfResto.city}`);
        }
    }

    doc.save(`Facture_TerangaReserve_${booking.id}.pdf`);
}
window.generatePDF = generatePDF;

// Admin Backoffice / Master Portal Logic
function toggleAdminPortal() {
    const portal = document.getElementById('adminPortal');
    const isVisible = portal.style.display === 'flex';
    portal.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) {
        switchAdminTab('dashboard');
        refreshAdminStats();
    }
}
window.toggleAdminPortal = toggleAdminPortal;

function closeAdminPortal() {
    document.getElementById('adminPortal').style.display = 'none';
}
window.closeAdminPortal = closeAdminPortal;

function switchAdminTab(tabId) {
    document.querySelectorAll('.admin-content').forEach(c => c.style.display = 'none');
    document.getElementById(`admin-tab-${tabId}`).style.display = 'block';

    document.querySelectorAll('.admin-nav-item').forEach(i => {
        i.classList.toggle('active', i.innerText.toLowerCase().includes(tabId));
    });

    document.getElementById('adminTitle').innerText = tabId.charAt(0).toUpperCase() + tabId.slice(1);
}
window.switchAdminTab = switchAdminTab;

function refreshAdminStats() {
    const totalRevenue = bookings.reduce((sum, b) => sum + (parseInt(b.amount.replace(/[^0-9]/g, '')) || 0), 0);
    document.getElementById('totalRevenueAdmin').innerText = `${totalRevenue.toLocaleString()} FCFA`;
    document.getElementById('totalPartnersAdmin').innerText = restaurants.length;
    document.getElementById('totalBookingsAdmin').innerText = bookings.length;

    // Commission Stats
    const commissionRate = parseInt(localStorage.getItem('teranga_commission_rate')) || 15;
    const totalCommission = bookings.reduce((sum, b) => {
        const deposit = parseInt(b.amount.replace(/[^0-9]/g, '')) || 0;
        return sum + (deposit * (commissionRate / 100));
    }, 0);

    document.getElementById('platformCommissionTotal').innerText = `${Math.round(totalCommission).toLocaleString()} FCFA`;
    const avgComm = bookings.length > 0 ? totalCommission / bookings.length : 0;
    document.getElementById('avgCommissionPerRes').innerText = `${Math.round(avgComm).toLocaleString()} FCFA`;
    document.getElementById('commissionRate').value = commissionRate;

    const activityLog = document.getElementById('adminActivityLog');
    activityLog.innerHTML = bookings.slice().reverse().map(b => `
        <tr>
            <td><strong>${b.resto}</strong></td>
            <td>Réservation Table</td>
            <td>${b.date}</td>
            <td>${b.amount}</td>
            <td><span class="badge-res active">Terminé</span></td>
        </tr>
    `).join('');

    const restoList = document.getElementById('adminRestoList');
    restoList.innerHTML = restaurants.map(r => `
        <tr>
            <td><strong>${r.name}</strong></td>
            <td>${r.city}</td>
            <td>${r.cuisine}</td>
            <td>${r.rating} ★</td>
            <td>
                <button class="action-btn" onclick="alert('Modification de ${r.name.replace(/'/g, "\\'")}...')">⚙️</button>
            </td>
        </tr>
    `).join('');
}

function updateCommission() {
    const rate = document.getElementById('commissionRate').value;
    localStorage.setItem('teranga_commission_rate', rate);
    alert(`Taux de commission mis à jour : ${rate}%`);
    refreshAdminStats();
}
window.updateCommission = updateCommission;

function toggleAddRestoModal() {
    const modal = document.getElementById('admin-modal-resto');
    modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
}
window.toggleAddRestoModal = toggleAddRestoModal;

// Handle New Restaurant Registration
document.getElementById('addRestoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newResto = {
        id: restaurants.length + 1,
        name: document.getElementById('newRestoName').value,
        city: document.getElementById('newRestoCity').value,
        cuisine: document.getElementById('newRestoCuisine').value,
        avgPrice: parseInt(document.getElementById('newRestoAvgPrice').value),
        rating: 5.0,
        district: "Nouveau",
        images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"],
        features: ["Nouveau Partenaire"],
        tables: [{ id: 1, type: 'square', name: 'Table Standard' }],
        menu: [{ category: "Entrées", items: [{ name: "À définir", price: "0 FCFA", desc: "Configuration requise" }] }],
        reviews: []
    };

    restaurants.push(newResto);
    renderRestaurants(restaurants);
    refreshAdminStats();
    toggleAddRestoModal();
    alert(`Restaurant "${newResto.name}" inscrit avec succès !`);
});

function exportData(format) {
    const data = {
        restaurants: restaurants,
        bookings: bookings,
        exportDate: new Date().toISOString(),
        version: "1.0.0_Backup"
    };

    if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TerangaReserve_BACKUP_${new Date().getTime()}.json`;
        a.click();
    } else {
        alert('Exportation CSV générée (Simulation) - 48 lignes exportées vers cloud_backup.csv');
    }
}
window.exportData = exportData;

// Teranga Concierge Logic - Enhanced Version
function runConcierge() {
    const input = document.getElementById('conciergeInput').value.toLowerCase();
    const resultsDiv = document.getElementById('conciergeResults');

    if (!input.trim()) {
        resultsDiv.style.display = 'none';
        return;
    }

    // Advanced Intelligence Layer
    const currentHour = new Date().getHours();
    const analysis = {
        occasion: detectOccasion(input),
        budget: detectBudget(input),
        cuisine: detectCuisine(input),
        atmosphere: detectAtmosphere(input),
        time: currentHour
    };

    // Smart Keyword Analysis with Context
    let matches = restaurants.filter(r => {
        const keywords = [r.name, r.city, r.cuisine, r.district, ...r.features].map(k => k.toLowerCase());
        const baseMatch = keywords.some(k => input.includes(k));

        // Contextual matching
        const romanticMatch = (input.includes("romantique") || input.includes("amoureux") || input.includes("couple")) &&
            (r.features.includes("Coucher de Soleil") || r.features.includes("Vue Mer") || r.features.includes("Vue Océan"));

        const familyMatch = (input.includes("famille") || input.includes("enfants") || input.includes("groupe")) &&
            (r.tables.some(t => t.type === 'large') || r.features.includes("Aire de Jeux Enfants"));

        const businessMatch = (input.includes("business") || input.includes("affaires") || input.includes("professionnel")) &&
            (r.features.includes("Wifi") || r.features.includes("Parking") || r.rating >= 4.5);

        const viewMatch = (input.includes("vue") || input.includes("mer") || input.includes("océan") || input.includes("fleuve")) &&
            (r.features.includes("Vue Mer") || r.features.includes("Vue Océan") || r.features.includes("Vue Fleuve"));

        const veganMatch = (input.includes("végétarien") || input.includes("vegan") || input.includes("bio")) &&
            r.cuisine.toLowerCase().includes("végétarien");

        const luxeMatch = (input.includes("luxe") || input.includes("gastronomique") || input.includes("étoilé")) &&
            (r.rating >= 4.7 || r.priceRange.includes("€€€€") || r.features.includes("Chef Étoilé"));

        const budgetMatch = (input.includes("pas cher") || input.includes("économique") || input.includes("budget")) &&
            r.avgPrice <= 10000;

        const liveMatch = (input.includes("musique") || input.includes("live") || input.includes("ambiance festive")) &&
            (r.features.includes("Live Music") || r.event);

        return baseMatch || romanticMatch || familyMatch || businessMatch || viewMatch ||
            veganMatch || luxeMatch || budgetMatch || liveMatch;
    });

    // Budget filtering
    if (analysis.budget) {
        matches = matches.filter(r => {
            if (analysis.budget === 'low') return r.avgPrice <= 10000;
            if (analysis.budget === 'medium') return r.avgPrice > 10000 && r.avgPrice <= 20000;
            if (analysis.budget === 'high') return r.avgPrice > 20000;
            return true;
        });
    }

    // Time-based filtering
    if (analysis.time >= 11 && analysis.time < 15 && input.includes("déjeuner")) {
        // Lunch recommendations
        matches = matches.sort((a, b) => {
            const aHasLunch = a.cuisine.includes("Buffet") || a.features.includes("Rapide");
            const bHasLunch = b.cuisine.includes("Buffet") || b.features.includes("Rapide");
            return bHasLunch - aHasLunch;
        });
    }

    resultsDiv.style.display = 'block';

    if (matches.length > 0) {
        const top3 = matches.slice(0, 3);
        const recommendation = generatePersonalizedRecommendation(top3, analysis, input);

        resultsDiv.innerHTML = `
            <div style="color: var(--booking-blue); font-weight: 600; margin-bottom: 8px;">✨ Recommandation Personnalisée</div>
            ${recommendation}
            <div style="margin-top: 12px; padding: 10px; background: #f0f7ff; border-radius: 6px; font-size: 0.85rem;">
                <strong>🎯 ${matches.length} restaurant(s) trouvé(s)</strong><br>
                <span style="color: #666;">Budget moyen: ${Math.round(matches.reduce((sum, r) => sum + r.avgPrice, 0) / matches.length).toLocaleString()} FCFA</span>
            </div>
            <button class="action-btn" style="margin-top: 10px; font-size: 0.85rem; width: 100%;" onclick="filterByConcierge()">🔍 Voir toutes les recommandations</button>
        `;

        window.conciergeMatches = matches;
    } else {
        resultsDiv.innerHTML = `
            <div style="color: #666;">Je n'ai pas trouvé d'établissement correspondant exactement à vos critères.</div>
            <div style="margin-top: 10px; padding: 10px; background: #fff8e1; border-radius: 6px; font-size: 0.85rem;">
                💡 <strong>Suggestion</strong>: Essayez des mots-clés comme "romantique", "famille", "vue mer", "pas cher", ou le nom d'une ville.
            </div>
        `;
        window.conciergeMatches = restaurants.slice(0, 5);
    }
}

// Helper functions for Concierge AI
function detectOccasion(input) {
    if (input.includes("anniversaire") || input.includes("fête")) return "celebration";
    if (input.includes("romantique") || input.includes("amoureux") || input.includes("st-valentin")) return "romantic";
    if (input.includes("business") || input.includes("affaires") || input.includes("réunion")) return "business";
    if (input.includes("famille") || input.includes("enfants")) return "family";
    return null;
}

function detectBudget(input) {
    if (input.includes("pas cher") || input.includes("économique") || input.includes("petit budget")) return "low";
    if (input.includes("moyen") || input.includes("raisonnable")) return "medium";
    if (input.includes("luxe") || input.includes("haut de gamme") || input.includes("prestige")) return "high";
    return null;
}

function detectCuisine(input) {
    const cuisines = ["africaine", "fruits de mer", "italien", "français", "fusion", "végétarien", "marocaine"];
    return cuisines.find(c => input.includes(c)) || null;
}

function detectAtmosphere(input) {
    if (input.includes("calme") || input.includes("tranquille")) return "quiet";
    if (input.includes("animé") || input.includes("festif") || input.includes("musique")) return "lively";
    if (input.includes("vue") || input.includes("panoramique")) return "scenic";
    return null;
}

function generatePersonalizedRecommendation(restaurants, analysis, input) {
    const top1 = restaurants[0];
    const top2 = restaurants[1];

    let message = `<div style="margin-bottom: 10px;">`;

    // Occasion-based intro
    if (analysis.occasion === "romantic") {
        message += `💕 Pour un moment romantique, je vous recommande particulièrement <strong>${top1.name}</strong>. `;
        message += `${top1.features.includes("Coucher de Soleil") ? "Le coucher de soleil y est magique." : "L'ambiance est parfaite pour un tête-à-tête."}`;
    } else if (analysis.occasion === "business") {
        message += `🤝 Pour votre rendez-vous professionnel, <strong>${top1.name}</strong> est idéal. `;
        message += `Cadre professionnel, ${top1.features.includes("Wifi") ? "wifi disponible, " : ""}et service irréprochable.`;
    } else if (analysis.occasion === "family") {
        message += `👨👩👧👦 Parfait pour la famille ! <strong>${top1.name}</strong> offre `;
        message += `${top1.features.includes("Aire de Jeux Enfants") ? "une aire de jeux pour les enfants" : "un cadre accueillant pour tous"}.`;
    } else if (analysis.occasion === "celebration") {
        message += `🎉 Pour célébrer en beauté, <strong>${top1.name}</strong> (note ${top1.rating}/5) est mon premier choix !`;
    } else {
        message += `Je vous suggère <strong>${top1.name}</strong> (${top1.rating}⭐) à ${top1.district}.`;
    }

    if (top2) {
        message += ` Également excellent : <strong>${top2.name}</strong>.`;
    }

    message += `</div>`;

    // Budget info
    if (analysis.budget === "low") {
        message += `<div style="font-size: 0.85rem; color: #008009;">💰 Budget respecté : environ ${top1.avgPrice.toLocaleString()} FCFA/pers</div>`;
    } else if (analysis.budget === "high") {
        message += `<div style="font-size: 0.85rem; color: #d4111e;">✨ Expérience premium : ${top1.avgPrice.toLocaleString()} FCFA/pers</div>`;
    }

    // Special features highlight
    if (top1.promo) {
        message += `<div style="margin-top: 8px; padding: 8px; background: #e8f5e9; border-left: 3px solid #4caf50; font-size: 0.85rem;">✅ ${top1.promo}</div>`;
    }

    if (top1.event) {
        message += `<div style="margin-top: 8px; padding: 8px; background: #f3e5f5; border-left: 3px solid #9c27b0; font-size: 0.85rem;">🎵 ${top1.event}</div>`;
    }

    return message;
}
window.runConcierge = runConcierge;

function filterByConcierge() {
    if (window.conciergeMatches) {
        renderRestaurants(window.conciergeMatches);
        document.getElementById('conciergeResults').style.display = 'none';
        document.getElementById('resultsCount').innerText = `${window.conciergeMatches.length} pépites trouvées par votre Concierge`;
    }
}
window.filterByConcierge = filterByConcierge;

// Passport Gastronomique Logic
function openPassport() {
    renderPassport();
    document.getElementById('passportModal').style.display = 'flex';
}
window.openPassport = openPassport;

function closePassport() {
    document.getElementById('passportModal').style.display = 'none';
}
window.closePassport = closePassport;

function renderPassport() {
    const cities = ["Dakar", "Saly", "Saint-Louis", "Cap Skirring"];
    const grid = document.getElementById('passportGrid');

    grid.innerHTML = cities.map(city => {
        const date = passport[city];
        return `
            <div class="stamp-slot ${date ? 'active' : ''}">
                <span>${city}</span>
                <div class="official-stamp ${date ? 'show' : ''}">
                    <div class="city-name">${city.toUpperCase()}</div>
                    <div class="date">${date || 'En attente'}</div>
                    <div style="font-size: 0.5rem; margin-top: 5px;">APPROUVÉ</div>
                </div>
            </div>
        `;
    }).join('');

    const allUnlocked = cities.every(c => passport[c]);
    document.getElementById('passportReward').style.display = allUnlocked ? 'block' : 'none';
}

// Gallery Navigation
function scrollGallery(direction) {
    const container = document.getElementById('restoGallery');
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.5; // scroll half the width
    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}
window.scrollGallery = scrollGallery;

function initTeranga() {
    console.log("Teranga: Initializing plateforme...");
    try {
        renderRestaurants(restaurants);
    } catch (err) {
        console.error("Teranga: Error during init:", err);
    }
}

// Global execution on both DOM and Window load for maximum safety
document.addEventListener('DOMContentLoaded', initTeranga);
window.addEventListener('load', initTeranga);
