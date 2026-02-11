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

// Link to global data
const restaurants = window.restaurantsData || [];

// Dropdown Toggle (Ultra Robust)
window.showDestinations = function (e) {
    if (e) e.stopPropagation();
    var dropdown = document.getElementById('destinationDropdown');
    if (dropdown) {
        dropdown.style.display = 'block';
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        console.log("Teranga: Dropdown forced OPEN");
    }
};

window.selectDestination = function (city) {
    var input = document.getElementById('searchInput');
    if (input) input.value = city;
    var dropdown = document.getElementById('destinationDropdown');
    if (dropdown) dropdown.style.display = 'none';
    window.filterRestaurants();
};

window.filterDestinations = function () {
    var val = (document.getElementById('searchInput')?.value || '').toLowerCase();
    var items = document.querySelectorAll('.dropdown-item');
    items.forEach(function (item) {
        var text = item.innerText.toLowerCase();
        item.style.display = text.includes(val) ? 'flex' : 'none';
    });
};

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
    updateMarkers(window.restaurantsData || []);
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

window.toggleMapView = () => {
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
};

function getRatingText(rating) {
    if (rating >= 4.7) return "Exceptionnel";
    if (rating >= 4.5) return "Superbe";
    if (rating >= 4.0) return "Très bien";
    return "Bien";
}

function renderRestaurants(items) {
    const mainGrid = document.getElementById('restaurantGrid');
    const countLabel = document.getElementById('resultsCount');
    if (!mainGrid) return;

    if (countLabel) countLabel.innerText = `${items.length} établissements trouvés`;

    if (!items.length) {
        mainGrid.innerHTML = '<p style="padding: 2rem; text-align: center; width: 100%;">Aucun résultat ne correspond à vos critères.</p>';
        return;
    }
    mainGrid.innerHTML = items.map(resto => {
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
                    <button class="see-availability" onclick="openBooking(${resto.id})">Voir les disponibilités</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

window.filterRestaurants = () => {
    const restaurants = window.restaurantsData || [];
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
};

window.openBooking = (id) => {
    const data = window.restaurantsData || [];
    currentResto = data.find(r => r.id === id);
    if (!currentResto) {
        console.error("Teranga: Restaurant not found with ID", id);
        return;
    }

    document.getElementById('modalRestoName').innerText = `Chez ${currentResto.name}`;
    document.getElementById('tablePreview').src = currentResto.tableImage;
    document.getElementById('tablePreview').style.display = 'block';
    document.getElementById('bookingFlowWrapper').style.display = 'block';
    document.getElementById('successView').style.display = 'none';
    document.getElementById('modalTabs').style.display = 'flex';
    switchModalTab('booking');
    renderMenu(currentResto.menu);
    renderReviews(currentResto.reviews);
    renderFloorPlan();

    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex'; // Explicitly set for insurance
    }
};

window.switchModalTab = (tabId) => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.getAttribute('onclick')?.includes(`'${tabId}'`)));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === `tab-${tabId}`));
    if (tabId === 'tables') renderFloorPlan();
};

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

window.selectTable = (id, name) => {
    if (selectedTable && selectedTable.id === id) {
        selectedTable = null;
    } else {
        selectedTable = { id, name };
    }
    renderFloorPlan();
};

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

window.processPayment = (method) => {
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
        btn.innerHTML = oldText;
        if (typeof renderOwnerBookings === 'function') renderOwnerBookings(); // Refresh if open
    }, 1500);
};

// Owner Dashboard Logic
let currentOwnerRestoId = 1; // Default to Le Lagon 1 for demo

window.toggleOwnerDashboard = () => {
    const dash = document.getElementById('ownerDashboard');
    const isVisible = dash.style.display === 'block';
    dash.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
        switchOwnerTab('reservations');
        renderOwnerBookings();
    }
};

window.switchOwnerTab = (tabId) => {
    document.querySelectorAll('.owner-tab-content').forEach(c => c.style.display = 'none');
    document.getElementById(`owner-tab-${tabId}`).style.display = 'block';

    document.querySelectorAll('#ownerDashboard .tab-btn').forEach(b => {
        b.classList.toggle('active', b.id.toLowerCase().includes(tabId));
    });

    if (tabId === 'menu') renderMenuEditor();
    if (tabId === 'stats') renderStatsChart();
};

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

window.closeModal = () => {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
    }
};

function renderMenu(menu) {
    const target = document.getElementById('digitalMenuContent');
    target.innerHTML = menu ? menu.map(c => `
        <div class="menu-category">
            <h4 style="margin: 20px 0 10px 0; color: var(--booking-blue); border-bottom: 2px solid var(--primary); display: inline-block;">${c.category}</h4>
            ${c.items.map(i => `
                <div class="menu-item">
                    <img src="${i.img || 'https://via.placeholder.com/80'}" class="menu-item-img" alt="${i.name}">
                    <div class="menu-item-info">
                        <h5 style="margin: 0; font-size: 1rem;">${i.name}</h5>
                        <p style="margin: 4px 0; font-size: 0.85rem; color: #666;">${i.desc}</p>
                        <span class="menu-item-price" style="font-weight: bold; color: var(--booking-blue-light);">${i.price}</span>
                    </div>
                </div>`).join('')}
        </div>`).join('') : '<p>Menu non disponible.</p>';
}

function renderReviews(reviews) {
    const target = document.getElementById('reviewsContent');
    target.innerHTML = reviews ? reviews.map(r => `
        <div class="review-item"><div class="review-header"><strong>${r.author}</strong><span style="color:#febb02">${'★'.repeat(r.rating)}</span></div><p class="review-comment">"${r.comment}"</p></div>`).join('') : '<p>Pas d\'avis.</p>';
}

window.generatePDF = () => {
    const { jsPDF } = window.jspdf;
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
    const stampResto = currentBookingData.restaurant;
    if (stampResto && stampResto.city) {
        if (!passport[stampResto.city]) {
            passport[stampResto.city] = new Date().toLocaleDateString('fr-FR');
            localStorage.setItem('teranga_passport', JSON.stringify(passport));
            console.log(`Stamp awarded for ${stampResto.city}`);
        }
    }

    doc.save(`Facture_TerangaReserve_${booking.id}.pdf`);
};

// Admin Backoffice / Master Portal Logic
window.toggleAdminPortal = () => {
    const portal = document.getElementById('adminPortal');
    const isVisible = portal.style.display === 'flex';
    portal.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) {
        switchAdminTab('dashboard');
        refreshAdminStats();
    }
};

window.closeAdminPortal = () => document.getElementById('adminPortal').style.display = 'none';

window.switchAdminTab = (tabId) => {
    document.querySelectorAll('.admin-content').forEach(c => c.style.display = 'none');
    document.getElementById(`admin-tab-${tabId}`).style.display = 'block';

    document.querySelectorAll('.admin-nav-item').forEach(i => {
        i.classList.toggle('active', i.innerText.toLowerCase().includes(tabId));
    });

    document.getElementById('adminTitle').innerText = tabId.charAt(0).toUpperCase() + tabId.slice(1);
};

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

window.updateCommission = () => {
    const rate = document.getElementById('commissionRate').value;
    localStorage.setItem('teranga_commission_rate', rate);
    alert(`Taux de commission mis à jour : ${rate}%`);
    refreshAdminStats();
};

window.toggleAddRestoModal = () => {
    const modal = document.getElementById('admin-modal-resto');
    modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
};

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

window.exportData = (format) => {
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
};

// Teranga Concierge Logic
window.runConcierge = () => {
    const input = document.getElementById('conciergeInput').value.toLowerCase();
    const resultsDiv = document.getElementById('conciergeResults');

    if (!input.trim()) {
        resultsDiv.style.display = 'none';
        return;
    }

    // Smart Keyword Analysis
    let matches = restaurants.filter(r => {
        const keywords = [r.name, r.city, r.cuisine, r.district, ...r.features].map(k => k.toLowerCase());
        return keywords.some(k => input.includes(k)) ||
            (input.includes("romantique") && r.features.includes("Coucher de Soleil")) ||
            (input.includes("famille") && r.tables.some(t => t.type === 'large')) ||
            (input.includes("mer") && r.features.includes("Vue Mer"));
    });

    resultsDiv.style.display = 'block';

    if (matches.length > 0) {
        const best = matches[0];
        const recommendations = matches.slice(0, 2).map(m => `<strong>${m.name}</strong>`).join(' et ');

        resultsDiv.innerHTML = `
            <div style="color: var(--booking-blue); font-weight: 600; margin-bottom: 5px;">✨ Analyse Concierge terminée</div>
            Je vous suggère particulièrement ${recommendations}. 
            ${input.includes("romantique") ? "L'ambiance y est parfaite pour un moment à deux." : ""}
            ${input.includes("vue") ? "La vue y est exceptionnelle, je vous conseille de réserver une table en bordure." : ""}
            <br><button class="action-btn" style="margin-top: 10px; font-size: 0.8rem;" onclick="filterByConcierge()">Voir ces établissements</button>
        `;

        // Store matches for filtering
        window.conciergeMatches = matches;
    } else {
        resultsDiv.innerHTML = `Je n'ai pas trouvé d'établissement correspondant exactement à cette ambiance, mais voici nos meilleures tables du moment.`;
        window.conciergeMatches = restaurants;
    }
};

window.filterByConcierge = () => {
    if (window.conciergeMatches) {
        renderRestaurants(window.conciergeMatches);
        document.getElementById('conciergeResults').style.display = 'none';
        document.getElementById('resultsCount').innerText = `${window.conciergeMatches.length} pépites trouvées par votre Concierge`;
    }
};

// Passport Gastronomique Logic
window.openPassport = () => {
    renderPassport();
    document.getElementById('passportModal').style.display = 'flex';
};

window.closePassport = () => document.getElementById('passportModal').style.display = 'none';

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

function initTeranga() {
    console.log("Teranga: Initializing Listing...");
    try {
        const data = window.restaurantsData || [];
        const listingGrid = document.getElementById('dynamicListingGrid');
        const countLabel = document.getElementById('resultsCount');

        if (!listingGrid) {
            console.warn("Teranga: dynamicListingGrid not found yet.");
            return;
        }

        if (data.length > 0) {
            listingGrid.innerHTML = data.map(resto => {
                const ratingText = getRatingText(resto.rating);
                return `
                <div class="booking-card">
                    <div class="booking-card-img-container"><img src="${resto.image}" class="booking-card-img" onerror="this.src='https://via.placeholder.com/300?text=Resto'"></div>
                    <div class="booking-card-content">
                        <div class="card-details">
                            <h3 style="color:#006ce4;">${resto.name}</h3>
                            <div class="card-location" style="font-size:0.9rem;">${resto.city}, Sénégal • <span style="color:#008009;">✅ Dispo</span></div>
                            <div class="card-cuisine">${resto.cuisine}</div>
                            <div style="color: #008009; font-weight:700; font-size:0.85rem; margin-top:8px;">L'un de nos meilleurs choix à ${resto.city}</div>
                        </div>
                        <div class="card-right-panel">
                            <div class="rating-container"><div class="rating-text">${ratingText}</div><div class="rating-score">${resto.rating}</div></div>
                            <button class="see-availability" onclick="openBooking(${resto.id})">Voir les disponibilités</button>
                        </div>
                    </div>
                </div>`;
            }).join('');
            if (countLabel) countLabel.innerText = "Bienvenue sur TerangaReserve - Découvrez nos établissements";
        }
    } catch (err) {
        console.error("Teranga: Error during init:", err);
    }
}

// Global execution on both DOM and Window load for maximum safety
document.addEventListener('DOMContentLoaded', initTeranga);
window.addEventListener('load', initTeranga);
