var restaurants = [
    {
        id: 1,
        name: "Le Lagon 1",
        district: "Plateau",
        city: "Dakar",
        cuisine: "Fruits de Mer / Gastronomique",
        rating: 4.8,
        priceRange: "€€€€",
        avgPrice: 60000,
        image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=1200", // Main restaurant
        tableImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200", // Table view
        description: "Une institution dakaroise sur pilotis. Vue imprenable sur l'île de Gorée et l'océan Atlantique.",
        lat: 14.6669,
        lng: -17.4302,
        features: ["Vue Mer", "Sommelier", "Parking"],
        promo: "Offre St-Valentin : Un cocktail de bienvenue offert pour toute réservation.",
        tables: [
            { id: 1, type: 'round', name: 'Terrasse Mer' }, { id: 2, type: 'round', name: 'Terrasse Mer' }, { id: 3, type: 'round', name: 'Terrasse Mer', occupied: true },
            { id: 4, type: 'square', name: 'Bordure' }, { id: 5, type: 'square', name: 'Bordure' }, { id: 6, type: 'square', name: 'Bordure' },
            { id: 10, type: 'large', name: 'VIP Salon' }, { id: 11, type: 'large', name: 'VIP Salon' }
        ],
        menu: [
            {
                category: "Entrées",
                items: [
                    { name: "Carpaccio de Lotte", price: "12.000 FCFA", desc: "Fines tranches de lotte marinées au citron vert", img: "https://images.unsplash.com/photo-1534604973900-c41ab46d1334?auto=format&fit=crop&q=80&w=800" },
                    { name: "Gambas Grillées", price: "15.000 FCFA", desc: "Gambas sauvages au sel de Guérande", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=800" }
                ]
            },
            {
                category: "Plats",
                items: [
                    { name: "Langouste Thermidor", price: "35.000 FCFA", desc: "Langouste entière gratinée à la crème de cognac", img: "https://images.unsplash.com/photo-1551326844-4df70f78d0e9?auto=format&fit=crop&q=80&w=800" },
                    { name: "Filet de Mérou", price: "22.500 FCFA", desc: "Sauce vierge et purée de patate douce", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800" }
                ]
            }
        ],
        reviews: [
            { author: "Marc D.", rating: 5, comment: "Cadre exceptionnel au-dessus de l'eau. Service impeccable." },
            { author: "Awa S.", rating: 4, comment: "La cuisine est divine, surtout la langouste. Un peu cher mais ça vaut le coup." }
        ]
    },
    {
        id: 2,
        name: "Chez Fatou",
        district: "Almadies",
        city: "Dakar",
        cuisine: "Bord de mer / Grillades",
        rating: 4.6,
        priceRange: "€€€",
        avgPrice: 25000,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
        tableImage: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=1200",
        description: "Le lieu incontournable des Almadies pour un brunch ou un dîner face au coucher de soleil.",
        lat: 14.7482,
        lng: -17.5147,
        features: ["Coucher de Soleil", "Live Music", "Terrasse"],
        event: "Live Jazz Night : Ce samedi soir à partir de 20h30.",
        tables: [
            { id: 1, type: 'square', name: 'Sable' }, { id: 2, type: 'square', name: 'Sable' }, { id: 3, type: 'square', name: 'Sable' },
            { id: 4, type: 'large', name: 'Famille' }, { id: 5, type: 'large', name: 'Famille', occupied: true },
            { id: 6, type: 'round', name: 'Sunset Lounge' }, { id: 7, type: 'round', name: 'Sunset Lounge' }
        ],
        menu: [
            {
                category: "Spécialités",
                items: [
                    { name: "Brochettes de Lotte", price: "9.500 FCFA", desc: "Accompagnées de riz d'or", img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800" },
                    { name: "Burger Fatou", price: "7.500 FCFA", desc: "Bœuf local et fromage de chèvre", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800" }
                ]
            }
        ],
        reviews: [
            { author: "Jean L.", rating: 5, comment: "Le meilleur spot pour le coucher de soleil à Dakar !" }
        ]
    },
    {
        id: 3,
        name: "Le Bideew",
        district: "Plateau",
        city: "Dakar",
        cuisine: "Afro-Fusion",
        rating: 4.5,
        priceRange: "€€",
        avgPrice: 15000,
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200",
        tableImage: "https://images.unsplash.com/photo-1521017432531-fbd92d7313d4?auto=format&fit=crop&q=80&w=1200",
        description: "Situé dans le jardin de l'Institut Français, une oasis de calme et de culture.",
        lat: 14.6685,
        lng: -17.4350,
        features: ["Jardin", "Culture", "Calme"],
        tables: [
            { id: 1, type: 'round', name: 'Sous le Fromager' }, { id: 2, type: 'round', name: 'Ombre' }, { id: 3, type: 'round', name: 'Ombre' },
            { id: 4, type: 'square' }, { id: 5, type: 'square', occupied: true }
        ],
        menu: [
            {
                category: "Plats du Jour",
                items: [
                    { name: "Yassa au Poulet", price: "5.500 FCFA", desc: "Le classique sénégalais Revisité", img: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&q=80&w=800" },
                    { name: "Mafé Bœuf", price: "6.000 FCFA", desc: "Sauce arachide onctueuse", img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800" }
                ]
            }
        ],
        reviews: [
            { author: "Sophie T.", rating: 4, comment: "Jardin magnifique, parfait pour un déjeuner au calme." }
        ]
    },
    {
        id: 11,
        name: "La Maison Rose",
        district: "Île Nord",
        city: "Saint-Louis",
        cuisine: "Gastronomie Sénégalaise & Euro",
        rating: 4.8,
        priceRange: "€€€€",
        avgPrice: 40000,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
        tableImage: "https://images.unsplash.com/photo-1550966842-28c460d3d579?auto=format&fit=crop&q=80&w=1200",
        description: "Un patio colonial magnifique pour déguster le meilleur Thiéboudienne de l'ancienne capitale.",
        lat: 16.0238,
        lng: -16.5032,
        features: ["Patio Colonial", "Authentique", "Historique"],
        tables: [
            { id: 1, type: 'round', name: 'Patio' }, { id: 2, type: 'round', name: 'Patio' },
            { id: 3, type: 'square', name: 'Balcon' }, { id: 4, type: 'square', name: 'Balcon' }
        ],
        menu: [
            {
                category: "Sénégalais",
                items: [
                    { name: "Thiéboudienne ROYAL", price: "8.500 FCFA", desc: "Le plat national, servi avec riz rouge et légumes variés", img: "https://images.unsplash.com/photo-1589302168068-9643d2f928a6?auto=format&fit=crop&q=80&w=800" }
                ]
            }
        ],
        reviews: [
            { author: "Oumar N.", rating: 5, comment: "Le riz est parfait, l'ambiance coloniale nous transporte dans le temps." }
        ]
    },
    {
        id: 12,
        name: "Le Petit Jardin",
        district: "Saly Portudal",
        city: "Saly",
        cuisine: "Française / Grillades",
        rating: 4.7,
        priceRange: "€€€",
        avgPrice: 30000,
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=1200",
        tableImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200",
        description: "Un havre de paix au coeur de Saly, cuisine raffinée et cadre verdoyant.",
        lat: 14.4442,
        lng: -16.9850,
        features: ["Jardin Botanique", "Piscine", "Pétanque"],
        tables: [
            { id: 1, type: 'round', name: 'Jardin' }, { id: 2, type: 'round', name: 'Jardin' },
            { id: 3, type: 'square', name: 'Piscine' }, { id: 4, type: 'square', name: 'Piscine', occupied: true }
        ],
        menu: [
            {
                category: "Entrées",
                items: [
                    { name: "Foie Gras Maison", price: "12.500 FCFA", desc: "Foie gras de canard mi-cuit, chutney de mangue", img: "https://images.unsplash.com/photo-1628191010210-a59de33e5941?auto=format&fit=crop&q=80&w=800" }
                ]
            },
            {
                category: "Plats",
                items: [
                    { name: "Tournedos Rossini", price: "18.000 FCFA", desc: "Filet de bœuf, foie gras poêlé et truffes", img: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=800" }
                ]
            }
        ],
        reviews: [
            { author: "Chantal R.", rating: 5, comment: "Un cadre idyllique et une cuisine d'une grande finesse." }
        ]
    },
    {
        id: 14,
        name: "Le Katakalousse",
        district: "Bord de Mer",
        city: "Cap Skirring",
        cuisine: "Fruits de mer / Français",
        rating: 4.9,
        priceRange: "€€€€",
        avgPrice: 55000,
        image: "https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?auto=format&fit=crop&q=80&w=1200",
        tableImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200",
        description: "Spécialités de poissons grillés et langoustes avec vue panoramique sur les bolongs.",
        lat: 12.3850,
        lng: -16.7450,
        features: ["Vue Bolongs", "Langoustes", "Luxe"],
        tables: [
            { id: 1, type: 'large', name: 'Bolong View' }, { id: 2, type: 'large', name: 'Bolong View' },
            { id: 3, type: 'round', name: 'Ponton' }, { id: 4, type: 'round', name: 'Ponton' }
        ],
        menu: [
            {
                category: "Dégustation",
                items: [
                    { name: "Plateau Casamance", price: "25.000 FCFA", desc: "Langouste, huîtres de palétuvier, crevettes et mérou grillé", img: "https://images.unsplash.com/photo-1534081333815-ae5019106622?auto=format&fit=crop&q=80&w=800" }
                ]
            }
        ],
        reviews: [
            { author: "Elena R.", rating: 5, comment: "Une vue à couper le souffle et des produits d'une fraîcheur incroyable." }
        ]
    }
];

window.restaurantsData = restaurants;
