/**
 * Teranga Concierge AI v2.0 - Moteur de Recommandation Avancé
 * Remplace la version basique de app.js
 */

console.log("🧠 Chargement de Teranga Concierge AI v2.0...");

// Fonction principale (écrase la version précédente)
window.runConcierge = function () {
    const input = document.getElementById('conciergeInput').value.toLowerCase();
    const resultsDiv = document.getElementById('conciergeResults');

    if (!input.trim()) {
        resultsDiv.style.display = 'none';
        return;
    }

    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = '<div style="padding:10px; text-align:center; color: #666;">🤔 Analyse de vos envies en cours...</div>';

    // Simulation de délai de réflexion pour effet "IA"
    setTimeout(() => {
        // 1. Analyse Sémantique (NLP Léger)
        const analysis = analyzeRequest(input);
        console.log("🔍 Analyse Concierge :", analysis);

        // 2. Scoring des Restaurants
        const scoredRestaurants = (window.restaurants || []).map(r => {
            const score = calculateRelevanceScore(r, analysis);
            return { ...r, relevance: score };
        }).filter(r => r.relevance > 0);

        // 3. Tri par pertinence
        scoredRestaurants.sort((a, b) => b.relevance - a.relevance);

        // 4. Affichage des résultats
        if (scoredRestaurants.length > 0) {
            const topMatches = scoredRestaurants.slice(0, 3);
            const bestMatch = topMatches[0];

            // Générer explications personnalisées
            const reason = generateExplanation(bestMatch, analysis);

            let html = `
                <div style="background: linear-gradient(135deg, #f0f7ff 0%, #e3f2fd 100%); padding: 15px; border-radius: 12px; margin-bottom: 15px; border: 1px solid #cce5ff;">
                    <div style="color: #003580; font-weight: 700; margin-bottom: 8px; font-family: 'Playfair Display', serif; display: flex; align-items: center; gap: 8px;">
                        <span>✨</span> Recommandation de l'IA
                    </div>
                    <div style="font-size: 0.9rem; line-height: 1.5; color: #333;">
                        ${reason}
                    </div>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 10px;">
            `;

            topMatches.forEach(r => {
                html += `
                    <div class="concierge-card-item" onclick="window.openBooking(${r.id}); highlightRestaurant(${r.id})" style="cursor: pointer; display: flex; align-items: center; gap: 10px; background: white; padding: 10px; border-radius: 8px; border: 1px solid #eee; transition: transform 0.2s;">
                        <img src="${r.image}" style="width: 60px; height: 60px; border-radius: 6px; object-fit: cover;">
                        <div style="flex: 1;">
                            <div style="font-weight: 700; color: #1a1a1a; font-size: 0.95rem;">${r.name}</div>
                            <div style="font-size: 0.8rem; color: #666;">${r.cuisine} • <span style="color: #febb02;">★</span> ${r.rating}</div>
                        </div>
                        <button style="background: #003580; color: white; border: none; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; cursor: pointer;">Réserver</button>
                    </div>
                `;
            });

            html += `</div>
                <div style="margin-top: 12px; font-size: 0.8rem; text-align: center; color: #666;">
                    🎯 ${scoredRestaurants.length} résultats trouvés pour "${input}"
                </div>`;

            resultsDiv.innerHTML = html;
            window.conciergeMatches = scoredRestaurants;

        } else {
            // Suggestion intelligente en cas d'échec
            const suggestions = getSmartSuggestions(analysis);

            resultsDiv.innerHTML = `
                <div style="text-align: center; padding: 15px;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">🤷‍♂️</div>
                    <p style="font-size: 0.9rem; color: #555;">Je n'ai pas trouvé de match exact pour "${input}".</p>
                    <div style="margin-top: 15px; background: #fff8e1; padding: 10px; border-radius: 8px; border: 1px solid #ffe082;">
                        <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 5px;">Essayez plutôt :</div>
                        <div style="display: flex; gap: 5px; justify-content: center; flex-wrap: wrap;">
                            ${suggestions.map(s => `<span class="suggestion-chip" onclick="document.getElementById('conciergeInput').value='${s}'; runConcierge()" style="background: white; border: 1px solid #ddd; padding: 4px 10px; border-radius: 15px; font-size: 0.8rem; cursor: pointer;">${s}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        }
    }, 600);
};

// 🧠 Moteur d'Analyse Sémantique
function analyzeRequest(input) {
    const analysis = {
        keywords: input.split(' '),
        budget: null, // low, medium, high
        mood: [], // romantic, business, festive, family
        cuisine: [], // local, seafood, international
        location: null, // dakar, saly...
        features: [] // view, wifi, terrasse
    };

    // Détection Budget
    if (/(pas cher|économique|petit budget|abordable|moins de 10000)/i.test(input)) analysis.budget = 'low';
    if (/(luxe|gastronomique|chick|cher|prestige|haut de gamme)/i.test(input)) analysis.budget = 'high';

    // Détection Ambiance
    if (/(romantique|amour|couple|date|diner|intime)/i.test(input)) analysis.mood.push('romantic');
    if (/(fête|anniversaire|ambiance|musique|danser|live|show)/i.test(input)) analysis.mood.push('festive');
    if (/(calme|discuter|affaires|business|pro|bruit)/i.test(input)) analysis.mood.push('business');
    if (/(famille|enfant|groupe|amis|nombreux)/i.test(input)) analysis.mood.push('family');

    // Détection Cuisine
    if (/(poisson|mer|fruit|crevette|gambas|lotte|thiof)/i.test(input)) analysis.cuisine.push('fruit de mer');
    if (/(viande|grillade|steak|bbq|mouton|poulet)/i.test(input)) analysis.cuisine.push('viande');
    if (/(local|sénégal|tien|tiep|mafé|yassa)/i.test(input)) analysis.cuisine.push('local');
    if (/(italien|pizza|pate|risotto)/i.test(input)) analysis.cuisine.push('italien');
    if (/(asie|chinois|japonais|sushi)/i.test(input)) analysis.cuisine.push('asiatique');

    // Détection Caractéristiques
    if (/(vue|panorama|mer|océan|plage|bord)/i.test(input)) analysis.features.push('view');
    if (/(terrasse|dehors|plein air|jardin)/i.test(input)) analysis.features.push('terrace');
    if (/(clim|climatisation|frais)/i.test(input)) analysis.features.push('ac');

    // Détection Lieu
    if (/(dakar|plateau|almadies)/i.test(input)) analysis.location = 'Dakar';
    if (/(saly|petite côte|somone)/i.test(input)) analysis.location = 'Saly';
    if (/(saint-louis|ndar)/i.test(input)) analysis.location = 'Saint-Louis';

    return analysis;
}

// 🧮 Algorithme de Scoring
function calculateRelevanceScore(restaurant, analysis) {
    let score = 0;
    const rText = (restaurant.name + ' ' + (restaurant.features || []).join(' ') + ' ' + restaurant.cuisine + ' ' + restaurant.district).toLowerCase();

    // 1. Keyword Match (Base)
    analysis.keywords.forEach(word => {
        if (word.length > 3 && rText.includes(word)) score += 10;
    });

    // 2. Location Match (Critique)
    if (analysis.location && restaurant.city !== analysis.location) return 0; // Masquer si mauvaise ville

    // 3. Budget Match
    if (analysis.budget === 'low') {
        if (restaurant.avgPrice <= 10000) score += 20;
        else if (restaurant.avgPrice > 20000) score -= 10;
    }
    if (analysis.budget === 'high') {
        if (restaurant.avgPrice > 20000) score += 20;
        else if (restaurant.avgPrice < 10000) score -= 5;
    }

    // 4. Mood Match
    if (analysis.mood.includes('romantic') && (rText.includes('romantique') || rText.includes('vue') || rText.includes('mer'))) score += 25;
    if (analysis.mood.includes('business') && (rText.includes('calme') || (restaurant.features && restaurant.features.includes('Wifi')))) score += 15;
    if (analysis.mood.includes('festive') && (rText.includes('musique') || restaurant.event)) score += 25;
    if (analysis.mood.includes('family') && (rText.includes('familial') || rText.includes('groupe'))) score += 20;

    // 5. Feature Bonus
    if (analysis.features.includes('view') && (rText.includes('vue') || rText.includes('mer'))) score += 30;
    if (analysis.features.includes('terrace') && (rText.includes('terrasse'))) score += 15;

    // 6. Cuisine Match
    analysis.cuisine.forEach(c => {
        if (rText.includes(c)) score += 30;
    });

    // 7. Rating Bonus
    score += (restaurant.rating * 3);

    return score;
}

// 💬 Générateur d'Explications
function generateExplanation(restaurant, analysis) {
    let reasons = [];

    if (analysis.mood.includes('romantic')) reasons.push("l'ambiance parfaite pour un rendez-vous");
    if (analysis.features.includes('view')) reasons.push("sa vue imprenable");
    if (analysis.budget === 'low') reasons.push("son excellent rapport qualité-prix");
    if (analysis.cuisine.length > 0) reasons.push(`sa cuisine ${restaurant.cuisine.toLowerCase()} authentique`);

    // Fallback reasons
    if (reasons.length === 0) {
        if (restaurant.rating >= 4.5) reasons.push("la qualité exceptionnelle de ses plats");
        if (restaurant.features && restaurant.features.includes('Vue Mer')) reasons.push("son cadre magnifique");
    }

    const intro = `Je vous recommande vivement le <strong>${restaurant.name}</strong>.`;

    if (reasons.length > 0) {
        // Prendre max 2 raisons pour ne pas être trop long
        const selectedReasons = reasons.slice(0, 2);
        return `${intro} C'est le choix idéal pour ${selectedReasons.join(' et pour ')}.`;
    } else {
        return `${intro} C'est une des meilleures tables de ${restaurant.city} avec une note de ${restaurant.rating}/5.`;
    }
}

// Suggestions intelligentes
function getSmartSuggestions(analysis) {
    const suggestions = [];
    if (analysis.location) suggestions.push(`Meilleurs restaurants à ${analysis.location}`);
    if (analysis.cuisine.length > 0) suggestions.push(`Autre resto ${analysis.cuisine[0]}`);
    suggestions.push("Restaurants romantiques");
    suggestions.push("Vue mer");
    return suggestions;
}

// Exposer globalement
window.analyzeRequest = analyzeRequest; // Pour debug
console.log('✅ Teranga Concierge AI v2.0 chargé');
