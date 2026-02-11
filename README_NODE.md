# TerangaReserve - Node.js Architecture

Cette application a été réorganisée en projet Node.js moderne pour une robustesse maximale.

## 🚀 Installation & Lancement

1. **Entrez dans le dossier** :
   ```powershell
   cd dakar-booking
   ```

2. **Lancez l'environnement de développement (Vite)** :
   ```powershell
   npm run dev
   ```
   L'application sera disponible sur `http://localhost:3000`.

3. **Lancement du serveur Backend (Express)** :
   ```powershell
   npm start
   ```

## 🏗️ Structure Technologique
- **Module Bundler** : Vite (pour un rechargement instantané)
- **Framework Front** : Vanilla JS (ES Modules)
- **Backend** : Express.js
- **Gestionnaire de Paquets** : NPM
- **Dépendances installées** :
  - `leaflet` (Cartographie)
  - `chart.js` (Statistiques restaurateurs)
  - `jspdf` (Génération de factures PDF)

## 🛠️ Migrations effectuées
- Conversion des scripts CDN en dépendances locales NPM.
- Modularisation de `app.js` et `data.js` (Utilisation de `import/export`).
- Nettoyage de `index.html` (Suppression des scripts redondants).
- Ajout de `vite.config.js` et `package.json`.
