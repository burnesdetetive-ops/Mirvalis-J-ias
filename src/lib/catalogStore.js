const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const PRODUCTS_TABLE = "mirvalis_products";
const PROMOTIONS_TABLE = "mirvalis_promotions";

export const sharedCatalogEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ?number : fallback;
}

function normalizeImages(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value) return [value];
  return [];
}

function normalizeCategory(row) {
  if (row.id === "piercing-prata-delicado" || /piercing/i.test(row.name || "")) {
    return "piercings";
  }
  return row.category;
}

async function supabaseRequest(path, options = {}) {
  if (!sharedCatalogEnabled) {
    throw new Error("Supabase não configurado");
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Erro Supabase ${response.status}`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ?JSON.parse(text) : null;
}

function productFromRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: normalizeCategory(row),
    price: normalizeNumber(row.price),
    promotionalPrice: row.promotional_price ?normalizeNumber(row.promotional_price) : "",
    promotionActive: Boolean(row.promotion_active),
    stock: normalizeNumber(row.available_quantity),
    featured: Boolean(row.featured),
    soldOut: Boolean(row.sold_out),
    description: row.description || "",
    images: normalizeImages(row.images)
  };
}

function productToRow(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: normalizeNumber(product.price),
    promotional_price: product.promotionalPrice ?normalizeNumber(product.promotionalPrice) : null,
    promotion_active: Boolean(product.promotionActive),
    featured: Boolean(product.featured),
    description: product.description || "",
    images: normalizeImages(product.images),
    available_quantity: normalizeNumber(product.stock),
    sold_out: Boolean(product.soldOut),
    updated_at: new Date().toISOString()
  };
}

function promotionFromRow(row) {
  return {
    id: row.id,
    name: row.name || "Promoção MIRVALIS",
    active: Boolean(row.active),
    productIds: Array.isArray(row.product_ids) ?row.product_ids : [],
    promotionalPrice: row.promotional_price ?normalizeNumber(row.promotional_price) : "",
    discountPercent: row.discount_percent ?normalizeNumber(row.discount_percent) : "",
    startDate: row.start_date || "",
    endDate: row.end_date || ""
  };
}

function promotionToRow(promotion) {
  return {
    id: promotion.id,
    name: promotion.name || "Promoção MIRVALIS",
    active: Boolean(promotion.active),
    product_ids: Array.isArray(promotion.productIds) ?promotion.productIds : [],
    promotional_price: promotion.promotionalPrice ?normalizeNumber(promotion.promotionalPrice) : null,
    discount_percent: promotion.discountPercent ?normalizeNumber(promotion.discountPercent) : null,
    start_date: promotion.startDate || null,
    end_date: promotion.endDate || null,
    updated_at: new Date().toISOString()
  };
}

export async function fetchSharedProducts() {
  const rows = await supabaseRequest(`${PRODUCTS_TABLE}?select=*&order=created_at.asc`);
  return (rows || []).map(productFromRow);
}

export async function fetchSharedPromotions() {
  const rows = await supabaseRequest(`${PROMOTIONS_TABLE}?select=*&order=created_at.desc`);
  return (rows || []).map(promotionFromRow);
}

export async function saveSharedProduct(product) {
  const rows = await supabaseRequest(`${PRODUCTS_TABLE}?on_conflict=id`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(productToRow(product))
  });
  return productFromRow(rows?.[0] || productToRow(product));
}

export async function deleteSharedProduct(id) {
  await supabaseRequest(`${PRODUCTS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
}

export async function saveSharedPromotion(promotion) {
  const rows = await supabaseRequest(`${PROMOTIONS_TABLE}?on_conflict=id`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(promotionToRow(promotion))
  });
  return promotionFromRow(rows?.[0] || promotionToRow(promotion));
}

export async function deleteSharedPromotion(id) {
  await supabaseRequest(`${PROMOTIONS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
}

export async function seedSharedProducts(products) {
  if (!products.length) return [];
  const rows = await supabaseRequest(`${PRODUCTS_TABLE}?on_conflict=id`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(products.map(productToRow))
  });
  return (rows || []).map(productFromRow);
}
