/**
 * Teranga Chatbot & AI Assistant
 * 
 * Une IA locale optimisée pour l'expérience client au Sénégal.
 * Capable de comprendre le contexte, suggérer des restaurants,
 * et guider l'utilisateur vers la réservation.
 */

const TERANGA_BOT_NAME = "Awa"; // Prénom local accueillant
const API_DELAY = 600; // Simulation de réflexion

// Base de connaissances locale (Patterns de questions)
const KNOWLEDGE_BASE = [
    {
        patterns: ['bonjour', 'salut', 'hello', 'coucou', 'salam'],
        responses: [
            "Salam ! Je suis Awa, votre guide Teranga. Comment puis-je vous aider à trouver la table parfaite aujourd'hui ?",
            "Bonjour ! Prêt à découvrir les meilleures saveurs du Sénégal ? Dites-moi ce qui vous ferait plaisir.",
            "Bienvenue sur TerangaReserve ! Je suis là pour vous conseiller. Une envie particulière ?"
        ]
    },
    {
        patterns: ['réserver', 'reservation', 'table', 'place'],
        action: 'show_booking_help',
        responses: ["Excellent choix ! Pour quel restaurant souhaitez-vous réserver ?", "Je peux vous aider à sécuriser une table. Avez-vous déjà un lieu en tête ?"]
    },
    {
        patterns: ['menu', 'carte', 'plat', 'manger'],
        responses: ["La plupart de nos restaurants partenaires affichent leur menu directement sur leur fiche. Quel type de cuisine vous tente ? (Sénégalaise, Française, Asiatique...)", "Nos chefs ont du talent ! Dites-moi ce que vous aimez manger, je vous dirigerai vers les bonnes adresses."]
    },
    {
        patterns: ['prix', 'coût', 'cher', 'budget', 'tarif'],
        responses: ["Nous avons des options pour tous les budgets. Vous cherchez plutôt : 'Abordable' (environ 5-10k), 'Moyen' (10-25k) ou 'Gastronomique' (25k+) ?"]
    },
    {
        patterns: ['romantique', 'couple', 'amoureux', 'date', 'diner'],
        action: 'recommend_romantic',
        responses: ["Pour une soirée romantique, je vous recommande le Lagon 1 ou La Fourchette. Voulez-vous voir les options avec vue mer ?", "C'est mignon ! ❤️ J'ai quelques adresses parfaites pour les couples. Préférez-vous une ambiance intime ou une vue spectaculaire ?"]
    },
    {
        patterns: ['famille', 'enfant', 'groupe', 'amis'],
        action: 'recommend_family',
        responses: ["Pour les groupes et familles, La Calebasse ou Le Djoloff sont superbes. Il y a de l'espace et une ambiance conviviale.", "Sortie en famille ? Génial ! Je peux filtrer les restaurants avec espace enfants ou grandes tables."]
    },
    {
        patterns: ['poisson', 'fruit de mer', 'mer', 'ocean'],
        action: 'recommend_seafood',
        responses: ["Ah, les produits de notre mer ! 🐟 Le Lagon 1 est incontournable, mais La Cabane du Pêcheur est aussi excellente. Une préférence pour le cadre ?"]
    },
    {
        patterns: ['dakar', 'saly', 'saint-louis', 'cap', 'ville'],
        action: 'filter_city',
        responses: ["Nous couvrons Dakar, Saly, Saint-Louis et Cap Skirring. Où vous trouvez-vous actuellement ?"]
    },
    {
        patterns: ['merci', 'top', 'super', 'cool', 'génial'],
        responses: ["C'est un plaisir ! N'hésitez pas si vous avez d'autres questions. 😊", "Je suis ravie de pouvoir aider ! Bon appétit d'avance ! 🍽️", "Avec plaisir ! Teranga, c'est l'hospitalité avant tout."]
    },
    {
        patterns: ['transport', 'taxi', 'yango', 'voiture'],
        action: 'show_transport_help',
        responses: ["Besoin d'un transport ? Vous pouvez commander un Yango ou Heetch directement depuis la fiche du restaurant ! Pratique non ?"]
    }
];

// État de la conversation
let conversationContext = {
    lastIntent: null,
    userPreferences: {}
};

// Initialisation du chat
function initChatbot() {
    console.log('🤖 Awa (Teranga Bot) initialisée.');

    // Message d'accueil si vide
    const chatBody = document.querySelector('.chat-body');
    if (chatBody && chatBody.children.length <= 1) { // Just options
        setTimeout(() => {
            addBotMessage("Salam ! 👋 Je suis Awa. Je peux vous aider à réserver, trouver un restaurant ou organiser un événement. Que puis-je faire pour vous ?");
        }, 1000);
    }
}

// Fonction principale de traitement du message utilisateur
async function handleUserMessage(message) {
    const lowerMsg = message.toLowerCase();

    // 1. Analyse de l'intention (Intent Recognition)
    let matchedIntent = null;

    for (const entry of KNOWLEDGE_BASE) {
        if (entry.patterns.some(pattern => lowerMsg.includes(pattern))) {
            matchedIntent = entry;
            break;
        }
    }

    // 2. Réponse contextuelle (si nom de restaurant détecté)
    const restaurantMatch = window.restaurants ? window.restaurants.find(r => lowerMsg.includes(r.name.toLowerCase())) : null;
    if (restaurantMatch) {
        return respondWithRestaurantDetails(restaurantMatch);
    }

    // 3. Génération de la réponse
    simulateTyping();

    setTimeout(() => {
        removeTypingIndicator();

        if (matchedIntent) {
            const response = matchedIntent.responses[Math.floor(Math.random() * matchedIntent.responses.length)];
            conversationContext.lastIntent = matchedIntent.action;
            addBotMessage(response);

            // Exécuter l'action associée
            if (matchedIntent.action) executeBotAction(matchedIntent.action, lowerMsg);

        } else {
            // Fallback (Réponse par défaut)
            addBotMessage("Je ne suis pas sûre d'avoir tout compris, mais je peux vous aider à trouver un restaurant ! Essayez de me dire ce que vous aimez (ex: 'poisson', 'vue mer', 'pas cher').");
            showQuickActions();
        }
    }, API_DELAY);
}

// Actions spécifiques du Bot
function executeBotAction(action, context) {
    switch (action) {
        case 'recommend_romantic':
            showRestaurantCards(window.restaurants.filter(r => r.features.includes('Romantique') || r.features.includes('Vue Mer')).slice(0, 2));
            break;
        case 'recommend_family':
            showRestaurantCards(window.restaurants.filter(r => r.features.includes('Familial') || r.features.includes('Groupe')).slice(0, 2));
            break;
        case 'recommend_seafood':
            showRestaurantCards(window.restaurants.filter(r => r.cuisine.includes('Fruits de Mer')).slice(0, 2));
            break;
        case 'show_booking_help':
            addBotMessage("Vous pouvez utiliser le bouton 'Réserver' sur la fiche de n'importe quel restaurant. C'est simple et rapide !");
            break;
        case 'show_transport_help':
            addBotMessage("Astuce : Cliquez sur l'icône 🚗 sur une carte restaurant pour voir les options de transport.");
            break;
    }
}

// Afficher les détails d'un restaurant spécifique
function respondWithRestaurantDetails(restaurant) {
    simulateTyping();
    setTimeout(() => {
        removeTypingIndicator();
        addBotMessage(`Ah, **${restaurant.name}** ! Excellent choix à ${restaurant.district}.`);
        addBotMessage(`C'est un établissement **${restaurant.cuisine}** avec une note de ${restaurant.rating}/5 ⭐.`);

        // Créer une mini-carte dans le chat
        const cardHtml = `
            <div class="chat-restaurant-card">
                <img src="${restaurant.image}" alt="${restaurant.name}">
                <div class="chat-card-info">
                    <h4>${restaurant.name}</h4>
                    <p>${restaurant.priceRange} • ${restaurant.city}</p>
                    <button onclick="window.location.href='/#restaurantGrid'; highlightRestaurant(${restaurant.id}); toggleChatWidget()">Voir détails</button>
                </div>
            </div>
        `;
        appendHtmlMessage(cardHtml);

    }, API_DELAY);
}

// UI Helpers
function appendHtmlMessage(html) {
    const chatBody = document.querySelector('.chat-body');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message bot';
    msgDiv.innerHTML = `<div class="message-content">${html}</div>`;
    chatBody.insertBefore(msgDiv, document.querySelector('.typing-indicator') || chatBody.lastElementChild);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function showQuickActions() {
    const actionsHtml = `
        <div class="chat-quick-actions">
            <button onclick="addUserMessage('Suggère-moi un endroit romantique'); handleUserMessage('romantique')">❤️ Romantique</button>
            <button onclick="addUserMessage('Restaurants pas chers'); handleUserMessage('budget')">💰 Petit Budget</button>
            <button onclick="addUserMessage('Spécialités locales'); handleUserMessage('local')">🇸🇳 Local</button>
        </div>
    `;
    appendHtmlMessage(actionsHtml);
}

function showRestaurantCards(restaurants) {
    if (!restaurants || restaurants.length === 0) return;

    let cardsHtml = '<div class="chat-cards-container">';
    restaurants.forEach(r => {
        cardsHtml += `
            <div class="chat-mini-card" onclick="highlightRestaurant(${r.id}); toggleChatWidget()">
                <div class="mini-card-img" style="background-image: url('${r.image}')"></div>
                <div class="mini-card-text">
                    <strong>${r.name}</strong>
                    <span>${r.rating}⭐</span>
                </div>
            </div>
        `;
    });
    cardsHtml += '</div>';
    appendHtmlMessage(cardsHtml);
}

function simulateTyping() {
    const chatBody = document.querySelector('.chat-body');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="typing-dots">
            <span>.</span><span>.</span><span>.</span>
        </div>
    `;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.querySelector('.typing-indicator');
    if (indicator) indicator.remove();
}

function addBotMessage(text) {
    const chatBody = document.querySelector('.chat-body');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot';
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content"><p>${formatMessage(text)}</p></div>
    `;
    chatBody.insertBefore(messageDiv, document.querySelector('.chat-options')); // Insert before options if exist
    chatBody.scrollTop = chatBody.scrollHeight;
}

function addUserMessage(text) {
    const chatBody = document.querySelector('.chat-body');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user';
    messageDiv.innerHTML = `<div class="message-content"><p>${text}</p></div>`;
    chatBody.insertBefore(messageDiv, document.querySelector('.chat-options'));
    chatBody.scrollTop = chatBody.scrollHeight;
}

function formatMessage(text) {
    // Basic Markdown support
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

// Override existing functions to connect new logic
window.sendChatMessage = function () {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    addUserMessage(message);
    input.value = '';
    handleUserMessage(message);
};

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', initChatbot);
window.initChatbot = initChatbot;

console.log('✅ Chat IA Teranga chargé (Version Améliorée)');
