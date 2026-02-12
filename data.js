export const restaurants = [
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
        id: 13,
        name: "La Calebasse",
        district: "Ngor",
        city: "Dakar",
        cuisine: "Sénégalaise Authentique",
        rating: 4.7,
        priceRange: "€€",
        avgPrice: 18000,
        image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=1200",
        tableImage: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=1200",
        description: "Cuisine sénégalaise traditionnelle dans un cadre chaleureux face à l'île de Ngor.",
        lat: 14.7565,
        lng: -17.5185,
        features: ["Vue Mer", "Terrasse", "Cuisine locale"],
        tables: [
            { id: 1, type: 'round' }, { id: 2, type: 'round' }, { id: 3, type: 'square' }, { id: 4, type: 'square' }
        ],
        menu: [
            {
                category: "Spécialités",
                items: [
                    { name: "Thiéboudienne Rouge", price: "5.500 FCFA", desc: "Riz rouge au poisson frais du jour", img: "https://images.unsplash.com/photo-1589302168068-9643d2f928a6?auto=format&fit=crop&q=80&w=800" }
                ]
            }
        ],
        reviews: [{ author: "Mamadou D.", rating: 5, comment: "Le meilleur thiéboudienne de Dakar, sans hésitation !" }]
    },
    {
        id: 14,
        name: "Ocean & Savane",
        district: "Ouakam",
        city: "Dakar",
        cuisine: "Fusion Africaine",
        rating: 4.6,
        priceRange: "€€€",
        avgPrice: 32000,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
        tableImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200",
        description: "Établissement chic près des Mamelles, fusion entre cuisine africaine et internationale.",
        lat: 14.7145,
        lng: -17.4985,
        features: ["Terrasse Lounge", "DJ Weekend", "Parking"],
        tables: [
            { id: 1, type: 'large' }, { id: 2, type: 'round' }, { id: 3, type: 'square' }, { id: 4, type: 'square' }
        ],
        menu: [
            {
                category: "Signature",
                items: [
                    { name: "Magret de Canard au Miel de Bissap", price: "14.500 FCFA", desc: "Accompagné de fonio parfumé", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800" }
                ]
            }
        ],
        reviews: [{ author: "Claire B.", rating: 5, comment: "Cuisine inventive et délicieuse, cadre magnifique" }]
    },
    {
        id: 15,
        name: "Le Djoloff",
        district: "Point E",
        city: "Dakar",
        cuisine: "Restaurant Contemporain",
        rating: 4.5,
        priceRange: "€€€",
        avgPrice: 28000,
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1200",
        tableImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200",
        description: "Restaurant moderne au cœur de Point E, parfait pour déjeuners d'affaires.",
        lat: 14.7020,
        lng: -17.4580,
        features: ["Climatisé", "WiFi Gratuit", "Parking Sécurisé"],
        tables: [
            { id: 1, type: 'square' }, { id: 2, type: 'square' }, { id: 3, type: 'round' }, { id: 4, type: 'large' }
        ],
        menu: [
            {
                category: "Plats du Jour",
                items: [
                    { name: "Pavé de Saumon Grillé", price: "12.000 FCFA", desc: "Sauce citron-estragon, légumes vapeur", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800" }
                ]
            }
        ],
        reviews: [{ author: "Amadou F.", rating: 4, comment: "Idéal pour les repas professionnels" }]
    },
    {
        id: 16,
        name: "Chez Loutcha",
        district: "Mamelles",
        city: "Dakar",
        cuisine: "Libanaise / Méditerranéenne",
        rating: 4.8,
        priceRange: "€€€",
        avgPrice: 35000,
        image: "https://images.unsplash.com/photo-1541166440471-765c6db9ab3e?auto=format&fit=crop&q=80&w=1200",
        tableImage: "https://images.unsplash.com/photo-1550966842-28c460d3d579?auto=format&fit=crop&q=80&w=1200",
        description: "Mezze libanais authentiques et grillades dans un jardin fleuri sur la corniche.",
        lat: 14.7202,
        lng: -17.4872,
        features: ["Jardin", "Cuisine Halal", "Shisha Lounge"],
        tables: [
            { id: 1, type: 'round' }, { id: 2, type: 'round' }, { id: 3, type: 'large' }, { id: 4, type: 'square' }
        ],
        menu: [
            {
                category: "Mezze",
                items: [
                    { name: "Assiette de Mezze", price: "9.500 FCFA", desc: "Houmous, moutabal, taboulé, falafel", img: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&q=80&w=800" }
                ]
            }
        ],
        reviews: [{ author: "Fatima K.", rating: 5, comment: "Les meilleurs mezze de Dakar, ambiance très conviviale" }]
    },
    {
        id: 17,
        name: "La Fourchette",
        district: "Fann",
        city: "Dakar",
        cuisine: "Française Bistrot",
        rating: 4.4,
        priceRange: "€€",
        avgPrice: 22000,
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200",
        tableImage: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=1200",
        description: "Bistrot français classique, cuisine de qualité à prix raisonnables.",
        lat: 14.6925,
        lng: -17.4505,
        features: ["Cave à Vin", "Terrasse Ombragée", "Menu du Jour"],
        tables: [
            { id: 1, type: 'square' }, { id: 2, type: 'square' }, { id: 3, type: 'round' }, { id: 4, type: 'round' }
        ],
        menu: [
            {
                category: "Bistrot",
                items: [
                    { name: "Entrecôte Frites", price: "11.000 FCFA", desc: "Sauce au poivre ou béarnaise", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800" }
                ]
            }
        ],
        reviews: [{ author: "Pierre M.", rating: 4, comment: "Bonne cuisine française, rapport qualité/prix excellent" }]
    },
    {
        id: 18,
        name: "Le Ngor",
        district: "Ngor Village",
        city: "Dakar",
        cuisine: "Pizzeria / Italien",
        rating: 4.3,
        priceRange: "€€",
        avgPrice: 15000,
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200",
        tableImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200",
        description: "Pizzas au feu de bois et pâtes fraîches dans l'ambiance bohème de Ngor.",
        lat: 14.7590,
        lng: -17.5210,
        features: ["Four à Bois", "Terrasse", "Plage à 50m"],
        tables: [
            { id: 1, type: 'square' }, { id: 2, type: 'square' }, { id: 3, type: 'large' }, { id: 4, type: 'round' }
        ],
        menu: [
            {
                category: "Pizzas",
                items: [
                    { name: "Pizza Fruits de Mer", price: "8.500 FCFA", desc: "Crevettes, calamars, moules, ail", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800" }
                ]
            }
        ],
        reviews: [{ author: "Marco V.", rating: 4, comment: "Pizzas délicieuses, pâte parfaite !" }]
    },
    {
        id: 19,
        name: "Terrou-Bi Beach",
        district: "Route de la Corniche",
        city: "Dakar",
        cuisine: "Gastronomique / Beach Club",
        rating: 4.7,
        priceRange: "€€€€",
        avgPrice: 45000,
        image: "https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?auto=format&fit=crop&q=80&w=1200",
        tableImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200",
        description: "Restaurant gastronomique de l'hôtel Terrou-Bi avec piscine à débordement sur l'océan.",
        lat: 14.6890,
        lng: -17.4650,
        features: ["Piscine à débordement", "Beach Club", "Spa"],
        tables: [
            { id: 1, type: 'large' }, { id: 2, type: 'large' }, { id: 3, type: 'round' }, { id: 4, type: 'square' }
        ],
        menu: [
            {
                category: "Gastronomie",
                items: [
                    { name: "Turbot Rôti", price: "28.000 FCFA", desc: "Jus de crustacés, légumes du marché", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800" }
                ]
            }
        ],
        reviews: [{ author: "Sophie L.", rating: 5, comment: "Luxe, calme et volupté au bord de l'eau" }]
    },
    {
        id: 20,
        name: "Le Yoff",
        district: "Yoff",
        city: "Dakar",
        cuisine: "Poisson Grillé / Local",
        rating: 4.2,
        priceRange: "€",
        avgPrice: 12000,
        image: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=1200",
        tableImage: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=1200",
        description: "Poissons grillés ultra-frais dans un cadre simple et authentique près de la plage.",
        lat: 14.7485,
        lng: -17.4895,
        features: ["Poisson du jour", "Prix locaux", "Ambiance familiale"],
        tables: [
            { id: 1, type: 'square' }, { id: 2, type: 'square' }, { id: 3, type: 'large' }
        ],
        menu: [
            {
                category: "Du Jour",
                items: [
                    { name: "Dorade Grillée", price: "6.500 FCFA", desc: "Accompagnée de riz ou attiéké", img: "https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=800" }
                ]
            }
        ],
        reviews: [{ author: "Ibrahima S.", rating: 4, comment: "Simplicité et fraîcheur garanties" }]
    },
    {
        id: 21,
        name: "Le Patio",
        district: "Plateau (Centre-Ville)",
        city: "Dakar",
        cuisine: "Brasserie Moderne",
        rating: 4.5,
        priceRange: "€€€",
        avgPrice: 26000,
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
        tableImage: "https://images.unsplash.com/photo-1550966842-28c460d3d579?auto=format&fit=crop&q=80&w=1200",
        description: "Brasserie moderne en plein centre-ville, idéale pour déjeuners rapides et after-work.",
        lat: 14.6738,
        lng: -17.4330,
        features: ["Climatisé", "WiFi", "Happy Hour"],
        tables: [
            { id: 1, type: 'square' }, { id: 2, type: 'square' }, { id: 3, type: 'round' }, { id: 4, type: 'large' }
        ],
        menu: [
            {
                category: "Brasserie",
                items: [
                    { name: "Burger Gourmet", price: "9.500 FCFA", desc: "Pain maison, viande Black Angus", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800" }
                ]
            }
        ],
        reviews: [{ author: "Karim T.", rating: 4, comment: "Pratique et efficace en semaine" }]
    },
    {
        id: 22,
        name: "Villa Ndar",
        district: "Virage (Zone résidentielle)",
        city: "Dakar",
        cuisine: "Fusion Asiatique",
        rating: 4.6,
        priceRange: "€€€",
        avgPrice: 34000,
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1200",
        tableImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200",
        description: "Villa chic proposant une cuisine fusion asiatique raffinée.",
        lat: 14.7115,
        lng: -17.4720,
        features: ["Jardin Zen", "Sushis", "Cocktails"],
        tables: [
            { id: 1, type: 'round' }, { id: 2, type: 'square' }, { id: 3, type: 'large' }
        ],
        menu: [
            {
                category: "Asiatique",
                items: [
                    { name: "Assortiment Sushis & Makis", price: "15.500 FCFA", desc: "12 pièces variées, gingembre et wasabi", img: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&q=80&w=800" }
                ]
            }
        ],
        reviews: [{ author: "Linda N.", rating: 5, comment: "Les meilleurs sushis de Dakar, cadre enchanteur" }]
    },
    {
        id: 23,
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

