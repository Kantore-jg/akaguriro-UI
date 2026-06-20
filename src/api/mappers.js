import { resolveStorageUrl } from './client.js';

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

export function mapProductCategory(c) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon || null,
    description: c.description || '',
    isActive: c.is_active ?? true,
  };
}

export function mapMarket(m) {
  const categories = m.product_categories?.length
    ? m.product_categories.map(mapProductCategory)
    : [];

  return {
    id: m.id,
    name: m.name,
    slug: m.slug,
    city: m.city,
    location: m.location || '',
    description: m.description || '',
    totalPlaces: m.total_places ?? 0,
    occupiedPlaces: m.occupied_places ?? 0,
    image: resolveStorageUrl(m.image),
    coverImage: resolveStorageUrl(m.cover_image || m.image),
    productCategories: categories.map((c) => c.name),
    productCategoryIds: m.product_category_ids?.length
      ? m.product_category_ids
      : categories.map((c) => c.id).filter(Boolean),
    latitude: m.latitude,
    longitude: m.longitude,
    isActive: m.is_active ?? true,
    visitCount: m.visit_count ?? 0,
  };
}

export function mapBlock(b) {
  return {
    id: b.id,
    marketId: b.market_id,
    name: b.name,
    code: b.code || '',
    description: b.description || '',
    totalPlaces: b.total_places ?? b.places_count ?? 0,
    placesCount: b.places_count ?? b.total_places ?? 0,
    isActive: b.is_active ?? true,
  };
}

export function mapPlace(p) {
  const status = PLACE_STATUS_TO_UI[p.status] || p.status;
  return {
    id: p.number || String(p.id),
    placeId: p.id,
    number: p.number,
    blockId: p.market_block_id || p.block?.id || null,
    blockName: p.block?.name || '—',
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
    activePlaceId: m.active_place_id || null,
    activePlaceNumber: m.active_place_number || '',
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
    image: resolveStorageUrl(primaryImage?.path) || null,
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

const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Administrateur',
  ADMIN_MARCHE: 'Admin Marché',
  COMMERCANT: 'Commerçant',
  USER: 'Utilisateur',
};

export function mapUser(u) {
  const role = u.roles?.[0] || 'USER';
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    avatar: resolveStorageUrl(u.avatar),
    role,
    roleLabel: ROLE_LABELS[role] || role,
    isActive: u.is_active ?? true,
    marketId: u.managed_market_id || u.active_market_id || null,
    marketName: u.managed_market?.name || u.active_market?.name || '',
    merchantId: role === 'COMMERCANT' ? u.id : null,
    permissions: u.permissions || [],
    createdAt: u.created_at?.split('T')[0] || '',
  };
}

export function userToApi(data) {
  const payload = {
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    role: data.role,
    is_active: data.isActive ?? true,
    managed_market_id: data.role === 'ADMIN_MARCHE' ? (data.marketId || null) : null,
  };

  if (data.password) {
    payload.password = data.password;
  }

  return payload;
}

export function marketToApi(data) {
  return {
    name: data.name,
    city: data.city,
    location: data.location,
    description: data.description,
    total_places: data.totalPlaces,
    product_category_ids: data.productCategoryIds || [],
  };
}

export function blockToApi(data) {
  return {
    name: data.name,
    code: data.code || null,
    description: data.description || null,
    is_active: data.isActive ?? true,
  };
}

export function placeToApi(data) {
  return {
    market_id: data.marketId,
    market_block_id: data.blockId || null,
    number: data.id || data.number,
    status: PLACE_STATUS_TO_API[data.status] || data.status || 'available',
    category: data.category,
  };
}

export function productToApi(data) {
  const payload = {
    market_id: data.marketId,
    place_id: data.placeId || null,
    category_id: data.categoryId || null,
    name: data.name,
    description: data.description,
    price: data.price,
    unit: data.unit || 'unit',
    stock: data.stock ?? 0,
    available: data.available ?? true,
    is_trending: data.isTrending ?? false,
  };

  if (data.merchantId) {
    payload.user_id = data.merchantId;
  }

  return payload;
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