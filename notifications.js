// Notifications & Loyalty System

// User loyalty points storage
let userLoyaltyPoints = parseInt(localStorage.getItem('terangaPoints')) || 0;

// Process payment with notifications
function processPayment(method) {
    const phoneInput = document.getElementById('phoneInput').value;
    const emailInput = document.getElementById('emailInput')?.value;
    const smsEnabled = document.getElementById('smsNotification')?.checked;
    const emailEnabled = document.getElementById('emailNotification')?.checked;

    if (!phoneInput) {
        alert('Veuillez entrer votre numéro de téléphone');
        return;
    }

    // Simulate payment processing
    document.getElementById('paymentView').style.display = 'none';

    // Show loading animation
    const modal = document.getElementById('bookingModal');
    modal.innerHTML += `
        <div id="paymentProcessing" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 99999;">
            <div style="background: white; padding: 3rem; border-radius: 16px; text-align: center; max-width: 400px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
                <h3 style="margin-bottom: 1rem; color: #003580;">Traitement du paiement ${method}...</h3>
                <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #003580; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
        </div>
    `;

    setTimeout(() => {
        document.getElementById('paymentProcessing')?.remove();

        // Award loyalty points
        const pointsEarned = 50;
        userLoyaltyPoints += pointsEarned;
        localStorage.setItem('terangaPoints', userLoyaltyPoints);

        // Show success with notifications status
        document.getElementById('successView').style.display = 'block';

        // Update notification status
        const smsStatus = document.getElementById('smsStatus');
        const emailStatus = document.getElementById('emailStatus');

        if (smsEnabled && phoneInput) {
            smsStatus.style.display = 'block';
            // Simulate SMS sending
            sendSMSNotification(phoneInput);
        }

        if (emailEnabled && emailInput) {
            emailStatus.style.display = 'block';
            // Simulate email sending
            sendEmailNotification(emailInput);
        }

        // If no notifications selected
        if (!smsEnabled && !emailEnabled) {
            document.getElementById('notificationStatus').style.display = 'none';
        }

        // Update booking summary
        updateBookingSummary();

    }, 2500);
}
window.processPayment = processPayment;

// Simulate SMS sending
function sendSMSNotification(phone) {
    console.log(`📱 SMS envoyé à ${phone}`);
    // In production, this would call a Twilio/SMS API
    showToastNotification('SMS de confirmation envoyé !', 'success');
}

// Simulate Email sending
function sendEmailNotification(email) {
    console.log(`📧 Email envoyé à ${email}`);
    // In production, this would call SendGrid/Email API
    showToastNotification('Email récapitulatif envoyé !', 'success');
}

// Toast notification system
function showToastNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 999999;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animations for toast
if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Update booking summary with loyalty info
function updateBookingSummary() {
    const summaryDiv = document.getElementById('bookingSummary');
    if (!summaryDiv) return;

    const currentBooking = JSON.parse(localStorage.getItem('currentBooking') || '{}');

    summaryDiv.innerHTML = `
        <h4 style="margin-bottom: 1rem; color: #003580;">📋 Récapitulatif</h4>
        <div style="margin-bottom: 0.5rem;"><strong>Restaurant:</strong> ${currentBooking.resto || 'N/A'}</div>
        <div style="margin-bottom: 0.5rem;"><strong>Date:</strong> ${currentBooking.date || 'N/A'}</div>
        <div style="margin-bottom: 0.5rem;"><strong>Heure:</strong> ${currentBooking.time || 'N/A'}</div>
        <div style="margin-bottom: 0.5rem;"><strong>Convives:</strong> ${currentBooking.guests || 2} personnes</div>
        <div style="margin-bottom: 0.5rem;"><strong>Table:</strong> ${currentBooking.table || 'N/A'}</div>
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 2px solid #ddd;">
            <strong>Total Points Teranga:</strong> <span style="color: #ffd700; font-size: 1.2rem; font-weight: 700;">${userLoyaltyPoints} points</span>
        </div>
    `;
}

// Get user loyalty points
function getUserPoints() {
    return userLoyaltyPoints;
}
window.getUserPoints = getUserPoints;

// Redeem points
function redeemPoints(points) {
    if (points > userLoyaltyPoints) {
        showToastNotification('Points insuffisants !', 'error');
        return false;
    }

    userLoyaltyPoints -= points;
    localStorage.setItem('terangaPoints', userLoyaltyPoints);
    showToastNotification(`${points} points utilisés !`, 'success');
    return true;
}
window.redeemPoints = redeemPoints;

// Calculate discount from points
function calculateDiscount(points) {
    // 100 points = 5000 FCFA
    return (points / 100) * 5000;
}
window.calculateDiscount = calculateDiscount;

// WhatsApp Contact Function
function contactRestaurant(restaurantName, phone = '+221 77 123 45 67') {
    const message = encodeURIComponent(`Bonjour, je souhaite des informations sur ${restaurantName}. Je suis intéressé(e) par une réservation.`);
    const whatsappURL = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappURL, '_blank');
}
window.contactRestaurant = contactRestaurant;

console.log('✅ Notifications & Loyalty System chargé');
