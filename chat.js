// Chat Widget Functionality
let chatVisible = false;
let chatMessages = [];

function toggleChatWidget() {
    const chatWindow = document.getElementById('chatWindow');
    const chatBadge = document.getElementById('chatBadge');
    chatVisible = !chatVisible;

    if (chatVisible) {
        chatWindow.style.display = 'flex';
        chatBadge.style.display = 'none';
    } else {
        chatWindow.style.display = 'none';
    }
}
window.toggleChatWidget = toggleChatWidget;

function selectChatOption(option) {
    const chatBody = document.querySelector('.chat-body');

    switch (option) {
        case 'info':
            addChatMessage('user', 'Je veux des informations sur un restaurant');
            setTimeout(() => {
                addChatMessage('bot', 'Avec plaisir ! Quel restaurant vous intéresse ? Vous pouvez me donner son nom ou sa ville.');
            }, 500);
            break;

        case 'reservation':
            addChatMessage('user', 'J\'ai besoin d\'aide pour réserver');
            setTimeout(() => {
                addChatMessage('bot', 'Je suis là pour vous aider ! Avez-vous déjà choisi un restaurant ? Si non, je peux vous suggérer des établissements selon vos préférences.');
            }, 500);
            break;

        case 'modification':
            addChatMessage('user', 'Je veux modifier ma réservation');
            setTimeout(() => {
                addChatMessage('bot', 'Pas de problème ! Pouvez-vous me donner le nom du restaurant et la date de votre réservation ?');
            }, 500);
            break;

        case 'whatsapp':
            const whatsappNumber = '+221771234567'; // Numéro du support
            const message = encodeURIComponent('Bonjour, j\'ai besoin d\'aide avec TerangaReserve');
            window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
            addChatMessage('bot', '✅ Redirection vers WhatsApp pour parler avec un conseiller en direct !');
            break;
    }

    // Hide options after selection
    document.querySelector('.chat-options').style.display = 'none';
}
window.selectChatOption = selectChatOption;

function addChatMessage(sender, text) {
    const chatBody = document.querySelector('.chat-body');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;

    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    messageDiv.innerHTML = `
        ${sender === 'bot' ? '<div class="message-avatar">🤖</div>' : ''}
        <div class="message-content">
            <p>${text}</p>
            <span class="message-time">${time}</span>
        </div>
    `;

    // Insert before options
    const options = document.querySelector('.chat-options');
    chatBody.insertBefore(messageDiv, options);

    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    addChatMessage('user', message);
    input.value = '';

    // Simulate bot response
    setTimeout(() => {
        const responses = [
            'Merci pour votre message ! Un conseiller va vous répondre sous peu. Pour une réponse immédiate, contactez-nous sur WhatsApp.',
            'Je note votre demande. Notre équipe vous contactera rapidement.',
            'Pour mieux vous aider, pourriez-vous préciser votre question ?'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage('bot', randomResponse);
    }, 1000);
}
window.sendChatMessage = sendChatMessage;

// Add enter key support
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
});

console.log('✅ Chat Widget chargé');
