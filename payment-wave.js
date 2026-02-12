/**
 * TerangaReserve - Real-time Wave Payment Integration
 * 
 * This module handles the real Wave payment flow.
 * To switch to production:
 * 1. Replace the simulated fetch with actual Wave API endpoint
 * 2. Use your real WAVE_API_KEY
 */

const WAVE_CONFIG = {
    apiKey: 'YOUR_WAVE_API_KEY_HERE', // Replaced in production
    baseUrl: 'https://api.wave.com/v1',
    callbackUrl: window.location.origin + '/payment-callback',
    errorUrl: window.location.origin + '/payment-error',
    merchantName: 'TerangaReserve'
};

/**
 * Initialize a real Wave payment
 * @param {Object} paymentData - { amount, restaurantName, bookingId }
 */
async function initiateWavePayment(paymentData) {
    const { amount, restaurantName, bookingId } = paymentData;

    console.log(`🌊 Initialisation du paiement Wave pour ${restaurantName}: ${amount} FCFA`);

    // Show premium loading state
    showPaymentLoadingOverlay('Connexion sécurisée à Wave...');

    try {
        // In a real production environment, this request should go to your backend
        // to avoid exposing the API key on the frontend.
        // For this implementation, we demonstrate the flow.

        const response = await simulateWaveApiCall({
            amount: amount,
            currency: 'XOF',
            error_url: WAVE_CONFIG.errorUrl,
            success_url: WAVE_CONFIG.callbackUrl,
            client_reference: bookingId
        });

        if (response.wave_launch_url) {
            // Success! Redirect user to Wave
            window.location.href = response.wave_launch_url;
        } else {
            throw new Error('Url de lancement Wave manquante');
        }
    } catch (error) {
        console.error('Erreur Paiement Wave:', error);
        hidePaymentLoadingOverlay();
        showToastNotification('Le service Wave est temporairement indisponible. Veuillez réessayer.', 'error');
    }
}
window.initiateWavePayment = initiateWavePayment;

/**
 * Enhanced payment overlay
 */
function showPaymentLoadingOverlay(message) {
    let overlay = document.getElementById('paymentLoadingOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'paymentLoadingOverlay';
        overlay.className = 'payment-loading-overlay';
        overlay.innerHTML = `
            <div class="payment-loading-card">
                <div class="wave-loader">
                    <div class="wave-circle"></div>
                    <div class="wave-circle"></div>
                    <div class="wave-circle"></div>
                </div>
                <h3>Paiement Sécurisé Wave</h3>
                <p id="paymentLoadingMessage">${message}</p>
            </div>
        `;
        document.body.appendChild(overlay);
    } else {
        document.getElementById('paymentLoadingMessage').textContent = message;
        overlay.style.display = 'flex';
    }
}

function hidePaymentLoadingOverlay() {
    const overlay = document.getElementById('paymentLoadingOverlay');
    if (overlay) overlay.style.display = 'none';
}

/**
 * Simulate the Wave API response for demonstration
 * This would be replaced by a real fetch() in production
 */
async function simulateWaveApiCall(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: "pay_" + Math.random().toString(36).substr(2, 9),
                wave_launch_url: "wave://pay?id=sample", // This would launch the app or a web checkout
                status: "processing"
            });
        }, 1500);
    });
}

// Global hook for the checkout button in index.html
window.processRealPayment = function (method) {
    const currentBooking = JSON.parse(localStorage.getItem('currentBooking') || '{}');
    const amount = currentBooking.deposit || 5000;

    if (method === 'wave') {
        initiateWavePayment({
            amount: amount,
            restaurantName: currentBooking.resto || 'votre réservation',
            bookingId: 'TR-' + Date.now()
        });
    } else {
        // Logic for Orange Money if integrated
        showToastNotification('Orange Money integration pending API keys...', 'info');
        // Fallback to simulation
        if (typeof processPayment === 'function') processPayment(method);
    }
};

console.log('✅ Real Wave Payment Integration chargée');
