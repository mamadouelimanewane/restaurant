# Script d'Optimisation d'Images

## Objectif
Convertir les images en WebP pour réduire la taille et améliorer les performances.

## Installation des Outils

### Option 1: Utiliser un service en ligne
- **Squoosh** : https://squoosh.app/
- **TinyPNG** : https://tinypng.com/
- **Cloudinary** : https://cloudinary.com/

### Option 2: Utiliser des outils CLI

#### Installation de sharp (Node.js)
```bash
npm install --save-dev sharp
```

#### Script de conversion
```javascript
// optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './images';
const outputDir = './images/optimized';

// Créer le dossier de sortie
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Fonction de conversion
async function convertToWebP(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .webp({ quality: 85 })
            .toFile(outputPath);
        
        const inputSize = fs.statSync(inputPath).size;
        const outputSize = fs.statSync(outputPath).size;
        const reduction = ((1 - outputSize / inputSize) * 100).toFixed(2);
        
        console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
        console.log(`   Réduction: ${reduction}% (${(inputSize / 1024).toFixed(2)}KB → ${(outputSize / 1024).toFixed(2)}KB)`);
    } catch (error) {
        console.error(`❌ Erreur: ${inputPath}`, error.message);
    }
}

// Traiter tous les fichiers
async function processImages() {
    const files = fs.readdirSync(inputDir);
    
    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
            const inputPath = path.join(inputDir, file);
            const outputPath = path.join(outputDir, file.replace(ext, '.webp'));
            
            await convertToWebP(inputPath, outputPath);
        }
    }
    
    console.log('\\n🎉 Optimisation terminée !');
}

processImages();
```

#### Utilisation
```bash
node optimize-images.js
```

## Optimisations Recommandées

### 1. Images Unsplash
Les images actuelles proviennent d'Unsplash. Optimisations possibles :

#### Paramètres d'URL Unsplash
```javascript
// Au lieu de :
https://images.unsplash.com/photo-xxx?auto=format&fit=crop&q=80&w=1200

// Utiliser :
https://images.unsplash.com/photo-xxx?auto=format&fit=crop&q=75&w=800&fm=webp
```

**Paramètres optimisés** :
- `q=75` : Qualité réduite de 80 à 75 (-10% de taille)
- `w=800` : Largeur réduite de 1200 à 800 (-40% de taille)
- `fm=webp` : Format WebP (-25% de taille)

**Gain total estimé** : ~60% de réduction

### 2. Responsive Images
Utiliser `srcset` pour charger la bonne taille :

```html
<img 
    src="image-800.webp"
    srcset="
        image-400.webp 400w,
        image-800.webp 800w,
        image-1200.webp 1200w
    "
    sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
    alt="Restaurant"
    loading="lazy"
>
```

### 3. Lazy Loading Natif
Ajouter `loading="lazy"` à toutes les images :

```html
<img src="image.webp" alt="Restaurant" loading="lazy">
```

## Implémentation dans data.js

### Avant
```javascript
image: "https://images.unsplash.com/photo-xxx?auto=format&fit=crop&q=80&w=1200"
```

### Après
```javascript
image: "https://images.unsplash.com/photo-xxx?auto=format&fit=crop&q=75&w=800&fm=webp",
imageSrcset: {
    small: "https://images.unsplash.com/photo-xxx?auto=format&fit=crop&q=75&w=400&fm=webp",
    medium: "https://images.unsplash.com/photo-xxx?auto=format&fit=crop&q=75&w=800&fm=webp",
    large: "https://images.unsplash.com/photo-xxx?auto=format&fit=crop&q=75&w=1200&fm=webp"
}
```

## Script de Mise à Jour Automatique

```javascript
// update-image-urls.js
const fs = require('fs');

const dataFile = './data.js';
let content = fs.readFileSync(dataFile, 'utf8');

// Remplacer les URLs
content = content.replace(
    /q=80&w=1200/g,
    'q=75&w=800&fm=webp'
);

content = content.replace(
    /q=80&w=800/g,
    'q=75&w=600&fm=webp'
);

fs.writeFileSync(dataFile, content);
console.log('✅ URLs d\'images optimisées !');
```

## Résultats Attendus

### Avant Optimisation
- Image moyenne : ~150 KB
- 20 images : ~3 MB
- Temps de chargement : ~5-8s (3G)

### Après Optimisation
- Image moyenne : ~60 KB (-60%)
- 20 images : ~1.2 MB (-60%)
- Temps de chargement : ~2-3s (3G) (-60%)

## Checklist

- [ ] Installer sharp ou utiliser un service en ligne
- [ ] Convertir les images locales en WebP
- [ ] Mettre à jour les URLs Unsplash avec les paramètres optimisés
- [ ] Ajouter `loading="lazy"` à toutes les images
- [ ] Implémenter `srcset` pour les images critiques
- [ ] Tester sur différentes tailles d'écran
- [ ] Mesurer avec Lighthouse

## Commandes Rapides

```bash
# Installer sharp
npm install --save-dev sharp

# Créer le script d'optimisation
# (Copier le code ci-dessus dans optimize-images.js)

# Exécuter
node optimize-images.js

# Mettre à jour les URLs
node update-image-urls.js
```

---

**Note** : Les images Unsplash sont déjà optimisées côté serveur. L'ajout de `fm=webp` et la réduction de la qualité/taille sont les optimisations les plus efficaces.
