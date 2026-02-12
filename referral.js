/**
 * TerangaReserve - Referral & Social Sharing System
 * 
 * Logic for generating referral codes, sharing them,
 * and tracking successful referrals for points.
 */

// Generate or retrieve personal referral code
function getReferralCode() {
    let code = localStorage.getItem('userReferralCode');
    if (!code) {
        // Generate a fun code: TERANGA + random chars
        code = 'TERANGA' + Math.random().toString(36).substring(2, 6).toUpperCase();
        localStorage.setItem('userReferralCode', code);
    }
    return code;
}
window.getReferralCode = getReferralCode;

/**
 * Open the Referral & Share Modal
 */
function openReferralModal() {
    const code = getReferralCode();
    const modal = document.getElementById('referralModal') || createReferralModal();

    document.getElementById('displayReferralCode').textContent = code;
    modal.style.display = 'flex';
}
window.openReferralModal = openReferralModal;

/**
 * Create the Referral Modal UI
 */
function createReferralModal() {
    const modal = document.createElement('div');
    modal.id = 'referralModal';
    modal.className = 'referral-modal';
    modal.innerHTML = `
        <div class="referral-content">
            <div class="referral-header">
                <h2>🎁 Parrainez un Ami</h2>
                <button onclick="closeReferralModal()" class="close-btn">×</button>
            </div>
            
            <div class="referral-body">
                <p>Offrez la meilleure table à vos amis et gagnez des récompenses !</p>
                
                <div class="referral-box">
                    <div class="referral-code-label">VOTRE CODE :</div>
                    <div id="displayReferralCode" class="referral-code">-------</div>
                    <button class="copy-btn" onclick="copyReferralCode()">Copier</button>
                </div>
                
                <div class="rewards-info">
                    <div class="reward-item">
                        <span class="icon">👤</span>
                        <div><strong>L'ami :</strong> +25 points à l'inscription</div>
                    </div>
                    <div class="reward-item">
                        <span class="icon">🏆</span>
                        <div><strong>Vous :</strong> +50 points par ami parrainé</div>
                    </div>
                </div>
                
                <div class="share-options">
                    <h4>Partager via :</h4>
                    <div class="share-buttons">
                        <button class="share-btn whatsapp" onclick="shareOnWhatsApp()">WhatsApp</button>
                        <button class="share-btn twitter" onclick="shareOnTwitter()">Twitter</button>
                        <button class="share-btn general" onclick="shareGeneral()">Partager...</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

function closeReferralModal() {
    document.getElementById('referralModal').style.display = 'none';
}
window.closeReferralModal = closeReferralModal;

/**
 * Copy code to clipboard
 */
async function copyReferralCode() {
    const code = getReferralCode();
    try {
        await navigator.clipboard.writeText(code);
        showToastNotification('Code copié ! Partagez-le avec vos amis.', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToastNotification('Code copié !', 'success');
    }
}
window.copyReferralCode = copyReferralCode;

/**
 * Sharing Logic
 */
function shareOnWhatsApp() {
    const code = getReferralCode();
    const text = encodeURIComponent(`Rejouis-toi des meilleures tables du Sénégal ! Utilise mon code ${code} sur TerangaReserve pour gagner 25 points bonus. Inscrits-toi ici : ${window.location.origin}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function shareOnTwitter() {
    const code = getReferralCode();
    const text = encodeURIComponent(`Découvre TerangaReserve, le meilleur app pour les restaurants au Sénégal ! Mon code : ${code} 🍽️🇸🇳`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${window.location.origin}`, '_blank');
}

function shareGeneral() {
    const code = getReferralCode();
    if (navigator.share) {
        navigator.share({
            title: 'TerangaReserve - Invitation',
            text: `Utilise mon code ${code} pour obtenir des points bonus sur TerangaReserve !`,
            url: window.location.origin,
        }).catch(console.error);
    } else {
        copyReferralCode();
    }
}

// Global hooks
window.shareOnWhatsApp = shareOnWhatsApp;
window.shareOnTwitter = shareOnTwitter;
window.shareGeneral = shareGeneral;

console.log('✅ Système de Parrainage chargé');
