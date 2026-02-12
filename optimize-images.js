// Script d'optimisation automatique des URLs d'images Unsplash
// Réduit la qualité, la taille et convertit en WebP

const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'data.js');

console.log('🔧 Optimisation des URLs d\'images...\n');

// Lire le fichier
let content = fs.readFileSync(dataFile, 'utf8');

// Compteurs
let replacements = 0;

// Fonction de remplacement avec logging
function replaceAndCount(pattern, replacement, description) {
    const matches = content.match(pattern);
    if (matches) {
        content = content.replace(pattern, replacement);
        replacements += matches.length;
        console.log(`✅ ${description}: ${matches.length} remplacements`);
    }
}

// Optimisations des URLs Unsplash
// 1. Réduire qualité de 80 à 75 et ajouter WebP pour images 1200px
replaceAndCount(
    /q=80&w=1200/g,
    'q=75&w=800&fm=webp',
    'Images 1200px → 800px WebP'
);

// 2. Optimiser les images 800px
replaceAndCount(
    /q=80&w=800/g,
    'q=75&w=600&fm=webp',
    'Images 800px → 600px WebP'
);

// 3. Optimiser les images 600px
replaceAndCount(
    /q=80&w=600/g,
    'q=75&w=500&fm=webp',
    'Images 600px → 500px WebP'
);

// 4. Ajouter WebP aux images sans format spécifié
replaceAndCount(
    /auto=format&fit=crop&q=80(?!&fm=webp)/g,
    'auto=format&fit=crop&q=75&fm=webp',
    'Ajout format WebP'
);

// Sauvegarder le fichier
fs.writeFileSync(dataFile, content);

console.log(`\n🎉 Optimisation terminée !`);
console.log(`📊 Total: ${replacements} URLs optimisées`);
console.log(`💾 Fichier sauvegardé: ${dataFile}`);
console.log(`\n📈 Gain estimé: ~60% de réduction de taille d'images`);
