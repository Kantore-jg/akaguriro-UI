/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const INITIAL_MARKETS = [
  {
    id: 'm1',
    name: 'Marché Siyoni de Bujumbura',
    city: 'Bujumbura',
    location: 'Quartier Jabe, Avenue du Peuple Murundi',
    description: 'Le plus grand centre commercial populaire de Bujumbura, pivot de l\'activité socio-économique avec une immense variété de denrées alimentaires, textiles, et produits manufacturés.',
    totalPlaces: 120,
    occupiedPlaces: 84,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
    categoryTags: ['Poissons', 'Vivres', 'Textiles', 'Épices', 'Artisanat']
  },
  {
    id: 'm2',
    name: 'Marché Central de Gitega',
    city: 'Gitega',
    location: 'Centre-ville, Boulevard de la Nation',
    description: 'Situé dans la capitale politique, ce marché est réputé pour ses légumes de montagne de grande qualité, ses poteries artisanales et le célèbre café rouge de Gitega.',
    totalPlaces: 80,
    occupiedPlaces: 52,
    image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=600',
    coverImage: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&q=80&w=1200',
    categoryTags: ['Céréales', 'Fruits', 'Café', 'Élevage', 'Poterie']
  },
  {
    id: 'm3',
    name: 'Marché Moderne de Ngozi',
    city: 'Ngozi',
    location: 'Avenue de la Paix, Quartier Central',
    description: 'Marché moderne récemment reconfiguré avec des allées couvertes, un éclairage public LED intelligent et un système d\'évacuation des déchets de dernière génération.',
    totalPlaces: 60,
    occupiedPlaces: 41,
    image: 'https://images.unsplash.com/photo-1488459718432-01055e67e1f5?auto=format&fit=crop&q=80&w=600',
    coverImage: 'https://images.unsplash.com/photo-1488459718432-01055e67e1f5?auto=format&fit=crop&q=80&w=1200',
    categoryTags: ['Légumes', 'Électronique', 'Avocats', 'Vêtements']
  },
  {
    id: 'm4',
    name: 'Marché Lacustre de Rumonge',
    city: 'Rumonge',
    location: 'Route du Lac Tanganyika, Rumonge',
    description: 'Le cœur de la filière poissonnière du Burundi, célèbre pour le poisson Mukeke frais et séché, capturé aux premières lueurs du jour sur le lac Tanganyika.',
    totalPlaces: 50,
    occupiedPlaces: 35,
    image: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&q=80&w=600',
    coverImage: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&q=80&w=1200',
    categoryTags: ['Poissons', 'Huile de Palme', 'Fruits Exotiques']
  }
];

export const INITIAL_MERCHANTS = [
  {
    id: 'mer1',
    name: 'Anésie Ndayishimiye',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200',
    phone: '+257 79 384 102',
    category: 'Poissonnerie',
    activePlaceId: 'A-01',
    activeMarketId: 'm1',
    joinedDate: '2023-01-12',
    verified: true,
    bio: 'Pêcheuse et revendeuse de Mukeke de père en fille depuis 15 ans au port de Bujumbura.'
  },
  {
    id: 'mer2',
    name: 'Jean-Pierre Bukuru',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    phone: '+257 61 229 448',
    category: 'Spécialités Nationales',
    activePlaceId: 'B-03',
    activeMarketId: 'm1',
    joinedDate: '2024-03-05',
    verified: true,
    bio: 'Promoteur exclusif du café de spécialité arabica lavé des collines de Kayanza et Gitega.'
  },
  {
    id: 'mer3',
    name: 'Chantal Nshimirimana',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    phone: '+257 75 990 120',
    category: 'Fruits & Légumes',
    activePlaceId: 'C-05',
    activeMarketId: 'm3',
    joinedDate: '2022-11-20',
    verified: true,
    bio: 'Grossiste spécialisée dans l\'approvisionnement en avocats géants et bananes plantains biologiques de Ngozi.'
  },
  {
    id: 'mer4',
    name: 'Thierry Gahungu',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    phone: '+257 71 504 332',
    category: 'Textiles & Modes',
    activePlaceId: 'A-12',
    activeMarketId: 'm1',
    joinedDate: '2023-08-30',
    verified: false,
    bio: 'Importateur de pagnes Super-Wax de haute qualité et créateur de coupes modernes traditionnels.'
  },
  {
    id: 'mer5',
    name: 'Fiona Irakoze',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200',
    phone: '+257 76 432 998',
    category: 'Poissonnerie',
    activePlaceId: 'A-02',
    activeMarketId: 'm4',
    joinedDate: '2025-02-14',
    verified: true,
    bio: 'Spécialiste de la transformation et du fumage de poissons Mukeke séchés du Lac Tanganyika.'
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    name: 'Mukeke du Lac Tanganyika (Frais)',
    price: 25000,
    category: 'Poissons',
    image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&q=80&w=400',
    marketId: 'm1',
    merchantId: 'mer1',
    placeNumber: 'A-01',
    available: true,
    description: 'Le roi des poissons du Burundi, péché de manière artisanale pendant la nuit et vendu frais chaque matin. Une chair tendre, parfumée et d\'excellence.',
    unit: 'kg',
    isTrending: true,
    stock: 45
  },
  {
    id: 'p2',
    name: 'Café Arabica de Spécialité (Sogestal Kayanza)',
    price: 12000,
    category: 'Café & Thé',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400',
    marketId: 'm1',
    merchantId: 'mer2',
    placeNumber: 'B-03',
    available: true,
    description: 'Café 100% Arabica de haute altitude (1900m), lavé, séché sur lits africains. Notes florales et sucrées de citron vert et de jasmin.',
    unit: 'packet 250g',
    isTrending: true,
    stock: 200
  },
  {
    id: 'p3',
    name: 'Avocats Beurre de Ngozi (Géants)',
    price: 1800,
    category: 'Fruits & Légumes',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=400',
    marketId: 'm3',
    merchantId: 'mer3',
    placeNumber: 'C-05',
    available: true,
    description: 'Avocats beurre extrêmement crémeux, cueillis à maturité parfaite sur les collines du nord. Sans pesticides, calibre géant.',
    unit: 'pièce',
    isTrending: false,
    stock: 120
  },
  {
    id: 'p4',
    name: 'Pagne Africain Wax Véritable',
    price: 45000,
    category: 'Textiles',
    image: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80&w=400',
    marketId: 'm1',
    merchantId: 'mer4',
    placeNumber: 'A-12',
    available: true,
    description: 'Tissu pagne wax de catégorie premium, coton 100% avec des motifs éclatants qui résistent aux lavages intensifs. Idéal pour des tenues modernes.',
    unit: 'pagne (6 yards)',
    isTrending: true,
    stock: 35
  },
  {
    id: 'p5',
    name: 'Thé Vert de Teza de Montagne',
    price: 8500,
    category: 'Café & Thé',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400',
    marketId: 'm2',
    merchantId: 'mer2',
    placeNumber: 'P-09',
    available: true,
    description: 'Le célèbre thé de Teza, cultivé sur la crête Congo-Nil sous un climat tempéré unique. Arôme puissant, revitalisant.',
    unit: 'paquet 250g',
    isTrending: false,
    stock: 80
  },
  {
    id: 'p6',
    name: 'Manioc Moulu Supérieur (Gitega)',
    price: 3500,
    category: 'Vivres',
    image: 'https://images.unsplash.com/photo-1590005354167-6da97870c913?auto=format&fit=crop&q=80&w=400',
    marketId: 'm2',
    merchantId: 'mer3',
    placeNumber: 'D-02',
    available: true,
    description: 'Farine de manioc purifiée de manière traditionnelle, parfaite pour préparer le classique Ubugali national burundais.',
    unit: 'kg',
    isTrending: false,
    stock: 150
  },
  {
    id: 'p7',
    name: 'Mukeke Séché & Fumé Traditionnellement',
    price: 28000,
    category: 'Poissons',
    image: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&q=80&w=400',
    marketId: 'm4',
    merchantId: 'mer5',
    placeNumber: 'A-02',
    available: true,
    description: 'Mukeke séché et fumé sur bois de fuste local au bord du lac, offrant une saveur fumée subtile et un excellent niveau de conservation.',
    unit: 'kg',
    isTrending: true,
    stock: 90
  },
  {
    id: 'p8',
    name: 'Miel Naturel de Forêt (Kayanza)',
    price: 9000,
    category: 'Fruits & Légumes',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400',
    marketId: 'm1',
    merchantId: 'mer2',
    placeNumber: 'B-03',
    available: true,
    description: 'Miel sauvage ambré extrait des ruches suspendues des forêts naturelles de Kayanza. 100% brut, non filtré à chaud.',
    unit: 'pot 500g',
    isTrending: false,
    stock: 65
  }
];

export const INITIAL_PLACES = [
  { id: 'A-01', blockName: 'Bloc A', rowName: 'Allée 1', status: 'occupée', merchantId: 'mer1', category: 'Poissonnerie', marketId: 'm1' },
  { id: 'A-02', blockName: 'Bloc A', rowName: 'Allée 1', status: 'libre', category: 'Poissonnerie', marketId: 'm1' },
  { id: 'A-03', blockName: 'Bloc A', rowName: 'Allée 1', status: 'maintenance', marketId: 'm1' },
  { id: 'B-01', blockName: 'Bloc B', rowName: 'Allée 2', status: 'libre', category: 'Céréales & Café', marketId: 'm1' },
  { id: 'B-02', blockName: 'Bloc B', rowName: 'Allée 2', status: 'libre', category: 'Céréales & Café', marketId: 'm1' },
  { id: 'B-03', blockName: 'Bloc B', rowName: 'Allée 2', status: 'occupée', merchantId: 'mer2', category: 'Céréales & Café', marketId: 'm1' },
  { id: 'A-12', blockName: 'Bloc A', rowName: 'Allée 4', status: 'occupée', merchantId: 'mer4', category: 'Textiles', marketId: 'm1' },
  { id: 'C-01', blockName: 'Bloc C', rowName: 'Allée 3', status: 'libre', category: 'Vivres', marketId: 'm1' },
  { id: 'C-02', blockName: 'Bloc C', rowName: 'Allée 3', status: 'libre', category: 'Vivres', marketId: 'm1' },
  { id: 'P-09', blockName: 'Bloc A (Agro)', rowName: 'Allée Nord', status: 'libre', category: 'Café & Thé', marketId: 'm2' },
  { id: 'D-02', blockName: 'Bloc B (Fécule)', rowName: 'Allée Ouest', status: 'libre', category: 'Vivres', marketId: 'm2' },
  { id: 'E-01', blockName: 'Bloc C (Artisanat)', rowName: 'Allée Est', status: 'libre', category: 'Poterie', marketId: 'm2' },
  { id: 'E-02', blockName: 'Bloc C (Artisanat)', rowName: 'Allée Est', status: 'libre', category: 'Poterie', marketId: 'm2' },
  { id: 'C-05', blockName: 'Bloc Agro-Frais', rowName: 'Allée Centrale 1', status: 'occupée', merchantId: 'mer3', category: 'Fruits & Légumes', marketId: 'm3' },
  { id: 'C-06', blockName: 'Bloc Agro-Frais', rowName: 'Allée Centrale 1', status: 'libre', category: 'Fruits & Légumes', marketId: 'm3' },
  { id: 'E-10', blockName: 'Bloc Électronique', rowName: 'Allée Tech', status: 'libre', category: 'Électronique', marketId: 'm3' },
  { id: 'A-02', blockName: 'Bloc Pêche', rowName: 'Allée Embarcadère', status: 'occupée', merchantId: 'mer5', category: 'Poissonnerie', marketId: 'm4' },
  { id: 'A-03', blockName: 'Bloc Pêche', rowName: 'Allée Embarcadère', status: 'libre', category: 'Poissonnerie', marketId: 'm4' }
];

export const INITIAL_REQUESTS = [
  {
    id: 'req1',
    merchantName: 'Emery Ndayiragije',
    merchantPhone: '+257 71 884 902',
    activityType: 'Vente de viandes de chèvre locales',
    category: 'Moucherie / Boucherie',
    requestedMarketId: 'm1',
    description: 'Demande d\'octroi d\'une place ventilée près de l\'allée Boucherie pour vendre la viande fraiche saine.',
    submittedDate: '2026-06-10',
    status: 'pending'
  },
  {
    id: 'req2',
    merchantName: 'Bella Irakoze',
    merchantPhone: '+257 69 403 118',
    activityType: 'Vannerie et vêtement tressé en raphia',
    category: 'Artisanat',
    requestedMarketId: 'm2',
    description: 'Créatrice artisanale de paniers Agaseke burundais typiques recherche un espace d\'exposition.',
    submittedDate: '2026-06-12',
    status: 'approved'
  },
  {
    id: 'req3',
    merchantName: 'Fiston Kwizera',
    merchantPhone: '+257 75 009 432',
    activityType: 'Réparation rapide téléphones & Chargeurs',
    category: 'Électronique',
    requestedMarketId: 'm3',
    description: 'Ancien diplômé d\'école technique désire obtenir un petit emplacement de comptoir pour réparer les appareils.',
    submittedDate: '2026-06-14',
    status: 'pending'
  }
];

export const INITIAL_RECEIPTS = [
  {
    id: 'rec1',
    merchantId: 'mer1',
    merchantName: 'Anésie Ndayishimiye',
    marketName: 'Marché Siyoni de Bujumbura',
    month: 'Mai 2026',
    amount: 35000,
    receiptImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    submittedDate: '2026-06-02',
    status: 'approved'
  },
  {
    id: 'rec2',
    merchantId: 'mer2',
    merchantName: 'Jean-Pierre Bukuru',
    marketName: 'Marché Siyoni de Bujumbura',
    month: 'Mai 2026',
    amount: 35000,
    receiptImage: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400',
    submittedDate: '2026-06-04',
    status: 'pending'
  },
  {
    id: 'rec3',
    merchantId: 'mer3',
    merchantName: 'Chantal Nshimirimana',
    marketName: 'Marché Moderne de Ngozi',
    month: 'Mai 2026',
    amount: 28000,
    receiptImage: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=400',
    submittedDate: '2026-06-05',
    status: 'approved'
  },
  {
    id: 'rec4',
    merchantId: 'mer5',
    merchantName: 'Fiona Irakoze',
    marketName: 'Marché Lacustre de Rumonge',
    month: 'Mai 2026',
    amount: 22000,
    receiptImage: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&q=80&w=400',
    submittedDate: '2026-06-12',
    status: 'pending'
  }
];

export const CURRENT_USER_MOCK = {
  id: 'u1',
  name: 'Gilbert Nkurunziza',
  phone: '+257 79 000 111',
  role: 'SUPER_ADMIN'
};

const KEYS = {
  MARKETS: 'akaguriro_markets',
  MERCHANTS: 'akaguriro_merchants',
  PRODUCTS: 'akaguriro_products',
  PLACES: 'akaguriro_places',
  REQUESTS: 'akaguriro_requests',
  RECEIPTS: 'akaguriro_receipts',
  USER: 'akaguriro_current_user_obj'
};

export const getStoredData = () => {
  if (typeof window === 'undefined') {
    return {
      markets: INITIAL_MARKETS,
      merchants: INITIAL_MERCHANTS,
      products: INITIAL_PRODUCTS,
      places: INITIAL_PLACES,
      requests: INITIAL_REQUESTS,
      receipts: INITIAL_RECEIPTS,
      currentUser: CURRENT_USER_MOCK
    };
  }

  const getOrSet = (key, val) => {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(val));
      return val;
    }
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.setItem(key, JSON.stringify(val));
      return val;
    }
  };

  return {
    markets: getOrSet(KEYS.MARKETS, INITIAL_MARKETS),
    merchants: getOrSet(KEYS.MERCHANTS, INITIAL_MERCHANTS),
    products: getOrSet(KEYS.PRODUCTS, INITIAL_PRODUCTS),
    places: getOrSet(KEYS.PLACES, INITIAL_PLACES),
    requests: getOrSet(KEYS.REQUESTS, INITIAL_REQUESTS),
    receipts: getOrSet(KEYS.RECEIPTS, INITIAL_RECEIPTS),
    currentUser: getOrSet(KEYS.USER, CURRENT_USER_MOCK)
  };
};

export const saveStoredData = (data) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.MARKETS, JSON.stringify(data.markets));
  localStorage.setItem(KEYS.MERCHANTS, JSON.stringify(data.merchants));
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(data.products));
  localStorage.setItem(KEYS.PLACES, JSON.stringify(data.places));
  localStorage.setItem(KEYS.REQUESTS, JSON.stringify(data.requests));
  localStorage.setItem(KEYS.RECEIPTS, JSON.stringify(data.receipts));
  localStorage.setItem(KEYS.USER, JSON.stringify(data.currentUser));
};
