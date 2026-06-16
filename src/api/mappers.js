const PLACE_STATUS_TO_UI = {
  available: 'libre',
  occupied: 'occupée',
  maintenance: 'maintenance',
  reserved: 'réservée',
};

const PLACE_STATUS_TO_API = {
  libre: 'available',
  occupée: 'occupied',
  maintenance: 'maintenance',
  réservée: 'reserved',
};

const REQUEST_STATUS_TO_UI = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
  assigned: 'approved',
};

export function mapMarket(m) {
  return {
    id: m.id,
    name: m.name,
    slug: m.slug,
    city: m.city,
    location: m.location || '',
    description: m.description || '',
    totalPlaces: m.total_places ?? 0,
    occupiedPlaces: m.occupied_places ?? 0,
    image: m.image,
    coverImage: m.cover_image || m.image,
    categoryTags: m.category_tags || [],
    latitude: m.latitude,
    longitude: m.longitude,
    isActive: m.is_active ?? true,
    visitCount: m.visit_count ?? 0,
  };
}

export function mapPlace(p) {
  const status = PLACE_STATUS_TO_UI[p.status] || p.status;
  return {
    id: p.number || String(p.id),
    placeId: p.id,
    number: p.number,
    blockName: p.block?.name || 'Bloc',
    rowName: p.number || '',
    status,
    merchantId: p.chief?.id || null,
    category: p.category || '',
    marketId: p.market_id,
    qrCode: p.qr_code,
    latitude: p.latitude,
    longitude: p.longitude,
  };
}

export function mapMerchant(m) {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone || '',
    image: m.image || null,
    category: m.category || 'Commerce Général',
    rating: m.rating ?? 4.8,
    activePlaceId: m.active_place_number || m.active_place_id,
    activeMarketId: m.active_market_id,
    joinedDate: m.joined_date,
    verified: m.verified ?? false,
    bio: m.bio || '',
    productsCount: m.products_count ?? 0,
  };
}

export function mapProduct(p) {
  const primaryImage = p.images?.find((i) => i.is_primary) || p.images?.[0];
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    category: p.category?.name || 'Général',
    categoryId: p.category?.id || p.category_id,
    image: primaryImage?.path || null,
    marketId: p.market?.id || p.market_id,
    merchantId: p.merchant?.id || p.user_id,
    placeNumber: p.place?.number || '',
    placeId: p.place?.id || p.place_id,
    available: p.available ?? true,
    description: p.description || '',
    unit: p.unit || 'unit',
    isTrending: p.is_trending ?? false,
    stock: p.stock ?? 0,
    viewCount: p.view_count ?? 0,
  };
}

export function mapPlaceRequest(r) {
  return {
    id: r.id,
    merchantName: r.merchant_name,
    merchantPhone: r.merchant_phone,
    activityType: r.category || r.description?.slice(0, 60) || '',
    category: r.category || '',
    requestedMarketId: r.market_id,
    marketName: r.market?.name,
    description: r.description || '',
    submittedDate: r.created_at?.split('T')[0] || '',
    status: REQUEST_STATUS_TO_UI[r.status] || r.status,
    rejectionReason: r.rejection_reason,
    placeId: r.place_id,
  };
}

export function mapReceipt(r) {
  return {
    id: r.id,
    merchantId: r.user_id,
    merchantName: r.user?.name || '',
    marketId: r.market_id,
    marketName: r.market?.name || '',
    month: r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '',
    amount: Number(r.amount || 0),
    receiptImage: r.file_url,
    submittedDate: r.created_at?.split('T')[0] || '',
    status: r.status,
    reference: r.reference,
  };
}

export function mapUser(u) {
  const role = u.roles?.[0] || 'USER';
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    avatar: u.avatar,
    role: role === 'USER' ? 'VISITOR' : role,
    marketId: u.managed_market_id || null,
    merchantId: role === 'COMMERCANT' ? u.id : null,
    permissions: u.permissions || [],
  };
}

export function marketToApi(data) {
  return {
    name: data.name,
    city: data.city,
    location: data.location,
    description: data.description,
    total_places: data.totalPlaces,
    category_tags: data.categoryTags,
    image: data.image,
    cover_image: data.coverImage || data.image,
  };
}

export function placeToApi(data) {
  return {
    market_id: data.marketId,
    number: data.id || data.number,
    status: PLACE_STATUS_TO_API[data.status] || data.status || 'available',
    category: data.category,
  };
}

export function productToApi(data) {
  return {
    market_id: data.marketId,
    place_id: data.placeId || null,
    category_id: data.categoryId || null,
    name: data.name,
    description: data.description,
    price: data.price,
    unit: data.unit || 'unit',
    stock: data.stock ?? 0,
    available: data.available ?? true,
  };
}

export function placeRequestToApi(data) {
  return {
    market_id: data.requestedMarketId,
    merchant_name: data.merchantName,
    merchant_phone: data.merchantPhone,
    category: data.category || data.activityType,
    description: data.description,
  };
}