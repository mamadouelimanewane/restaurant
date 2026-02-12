// Lazy Loading Manager - Chargement différé des fonctionnalités non critiques
// Ce fichier optimise le chargement initial en différant les modules lourds

class LazyLoader {
    constructor() {
        this.loadedModules = new Set();
        this.loading = new Map();
    }

    /**
     * Charge un module de manière asynchrone
     * @param {string} moduleName - Nom du module
     * @param {Function} loader - Fonction de chargement
     * @returns {Promise}
     */
    async loadModule(moduleName, loader) {
        // Si déjà chargé, retourner immédiatement
        if (this.loadedModules.has(moduleName)) {
            return Promise.resolve();
        }

        // Si en cours de chargement, attendre
        if (this.loading.has(moduleName)) {
            return this.loading.get(moduleName);
        }

        // Charger le module
        const loadPromise = loader()
            .then(() => {
                this.loadedModules.add(moduleName);
                this.loading.delete(moduleName);
                console.log(`✅ Module chargé: ${moduleName}`);
            })
            .catch(error => {
                this.loading.delete(moduleName);
                console.error(`❌ Erreur chargement ${moduleName}:`, error);
                throw error;
            });

        this.loading.set(moduleName, loadPromise);
        return loadPromise;
    }

    /**
     * Précharge un module en arrière-plan
     * @param {string} moduleName - Nom du module
     * @param {Function} loader - Fonction de chargement
     */
    preload(moduleName, loader) {
        // Utiliser requestIdleCallback si disponible
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => this.loadModule(moduleName, loader));
        } else {
            setTimeout(() => this.loadModule(moduleName, loader), 1000);
        }
    }
}

// Instance globale
const lazyLoader = new LazyLoader();

// Fonctions de chargement pour chaque module
const moduleLoaders = {
    gamification: () => import('./gamification.js'),
    referral: () => import('./referral.js'),
    transport: () => import('./transport.js'),
    advancedSearch: () => import('./advanced-search.js'),
    reviews: () => import('./reviews.js'),
    paymentWave: () => import('./payment-wave.js'),
    pwa: () => import('./pwa.js'),
    backendSync: () => import('./backend-sync.js'),
};

// Chargement intelligent basé sur les interactions utilisateur
export function initLazyLoading() {
    console.log('🚀 Lazy Loading initialisé');

    // Précharger les modules critiques après le chargement initial
    window.addEventListener('load', () => {
        // Attendre 2 secondes après le chargement
        setTimeout(() => {
            // Précharger PWA et backend sync (légers et utiles)
            lazyLoader.preload('pwa', moduleLoaders.pwa);
            lazyLoader.preload('backendSync', moduleLoaders.backendSync);
        }, 2000);

        // Précharger les autres modules après 5 secondes
        setTimeout(() => {
            lazyLoader.preload('gamification', moduleLoaders.gamification);
            lazyLoader.preload('reviews', moduleLoaders.reviews);
        }, 5000);
    });

    // Charger les modules à la demande lors des interactions
    setupLazyTriggers();
}

// Configuration des déclencheurs de chargement
function setupLazyTriggers() {
    // Charger gamification quand l'utilisateur ouvre le dashboard
    const dashboardTriggers = ['openUserDashboard', 'displayAllBadges'];
    dashboardTriggers.forEach(fnName => {
        const original = window[fnName];
        if (original) {
            window[fnName] = async function (...args) {
                await lazyLoader.loadModule('gamification', moduleLoaders.gamification);
                return original.apply(this, args);
            };
        }
    });

    // Charger referral quand nécessaire
    const originalOpenReferral = window.openReferralModal;
    if (originalOpenReferral) {
        window.openReferralModal = async function (...args) {
            await lazyLoader.loadModule('referral', moduleLoaders.referral);
            return originalOpenReferral.apply(this, args);
        };
    }

    // Charger transport quand nécessaire
    const originalOpenTransport = window.openTransportModal;
    if (originalOpenTransport) {
        window.openTransportModal = async function (...args) {
            await lazyLoader.loadModule('transport', moduleLoaders.transport);
            return originalOpenTransport.apply(this, args);
        };
    }

    // Charger advanced search quand le bouton est cliqué
    const originalOpenFilters = window.openAdvancedFilters;
    if (originalOpenFilters) {
        window.openAdvancedFilters = async function (...args) {
            await lazyLoader.loadModule('advancedSearch', moduleLoaders.advancedSearch);
            return originalOpenFilters.apply(this, args);
        };
    }

    // Charger reviews quand nécessaire
    const originalOpenReview = window.openReviewModal;
    if (originalOpenReview) {
        window.openReviewModal = async function (...args) {
            await lazyLoader.loadModule('reviews', moduleLoaders.reviews);
            return originalOpenReview.apply(this, args);
        };
    }

    // Charger payment Wave lors du paiement
    const originalProcessPayment = window.processPayment;
    if (originalProcessPayment) {
        window.processPayment = async function (method, ...args) {
            if (method === 'Wave') {
                await lazyLoader.loadModule('paymentWave', moduleLoaders.paymentWave);
            }
            return originalProcessPayment.apply(this, [method, ...args]);
        };
    }
}

// Exporter pour utilisation
export { lazyLoader, moduleLoaders };

console.log('✅ Lazy Loading Manager chargé');
