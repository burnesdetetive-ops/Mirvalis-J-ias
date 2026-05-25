const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const PRODUCT_TABLE_CANDIDATES = ["produtos_mirvalis", "mirvalis_products"];
const PROMOTIONS_TABLE = "mirvalis_promotions";
const REQUEST_TIMEOUT_MS = 12000;
const IMAGE_REQUEST_TIMEOUT_MS = 18000;
const IMAGE_HYDRATION_BATCH_SIZE = 6;

const LEGACY_PRODUCTS_KEY = "mirvalis-products";
const LEGACY_PROMOTIONS_KEY = "mirvalis-promotions";
const LEGACY_MIGRATION_KEY = "mirvalis-supabase-migration-v1";
const FALLBACK_PRODUCT_IMAGE = "";

export const sharedCatalogEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let writableProductsTable = "";

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeImages(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value) return [value];
  return [FALLBACK_PRODUCT_IMAGE];
}

function normalizeCategory(row) {
  if (row.id === "piercing-prata-delicado" || /piercing/i.test(row.name || "")) {
    return "piercings";
  }
  return row.category || "aneis";
}

function normalizeProduct(product) {
  return {
    id: product.id || `mirvalis-${Date.now()}`,
    name: product.name || "Produto MIRVALIS",
    category: normalizeCategory(product),
    price: normalizeNumber(product.price),
    promotionalPrice:
      product.promotionalPrice ?? product.promotional_price
        ? normalizeNumber(product.promotionalPrice ?? product.promotional_price)
        : "",
    promotionActive: Boolean(product.promotionActive ?? product.promotion_active),
    stock: normalizeNumber(product.stock ?? product.available_quantity),
    featured: Boolean(product.featured),
    soldOut: Boolean(product.soldOut ?? product.sold_out),
    description: product.description || "",
    images: normalizeImages(product.images)
  };
}

function productFromRow(row) {
  return normalizeProduct({
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    promotional_price: row.promotional_price,
    promotion_active: row.promotion_active,
    stock: row.available_quantity,
    featured: row.featured,
    sold_out: row.sold_out,
    description: row.description,
    images: row.images
  });
}

function productToRow(product) {
  const normalized = normalizeProduct(product);

  return {
    id: normalized.id,
    name: normalized.name,
    category: normalized.category,
    price: normalized.price,
    promotional_price: normalized.promotionalPrice ? normalized.promotionalPrice : null,
    promotion_active: Boolean(normalized.promotionActive),
    featured: Boolean(normalized.featured),
    description: normalized.description,
    images: normalized.images,
    available_quantity: normalizeNumber(normalized.stock),
    sold_out: Boolean(normalized.soldOut),
    updated_at: new Date().toISOString()
  };
}

function normalizePromotion(promotion) {
  return {
    id: promotion.id || `promocao-mirvalis-${Date.now()}`,
    name: promotion.name || "Promocao MIRVALIS",
    active: Boolean(promotion.active),
    productIds: Array.isArray(promotion.productIds || promotion.product_ids)
      ? promotion.productIds || promotion.product_ids
      : [],
    promotionalPrice:
      promotion.promotionalPrice ?? promotion.promotional_price
        ? normalizeNumber(promotion.promotionalPrice ?? promotion.promotional_price)
        : "",
    discountPercent:
      promotion.discountPercent ?? promotion.discount_percent
        ? normalizeNumber(promotion.discountPercent ?? promotion.discount_percent)
        : "",
    startDate: promotion.startDate || promotion.start_date || "",
    endDate: promotion.endDate || promotion.end_date || ""
  };
}

function promotionFromRow(row) {
  return normalizePromotion({
    id: row.id,
    name: row.name,
    active: row.active,
    product_ids: row.product_ids,
    promotional_price: row.promotional_price,
    discount_percent: row.discount_percent,
    start_date: row.start_date,
    end_date: row.end_date
  });
}

function promotionToRow(promotion) {
  const normalized = normalizePromotion(promotion);

  return {
    id: normalized.id,
    name: normalized.name,
    active: Boolean(normalized.active),
    product_ids: normalized.productIds,
    promotional_price: normalized.promotionalPrice ? normalized.promotionalPrice : null,
    discount_percent: normalized.discountPercent ? normalized.discountPercent : null,
    start_date: normalized.startDate || null,
    end_date: normalized.endDate || null,
    updated_at: new Date().toISOString()
  };
}

function getSupabaseError(status, detail, path) {
  try {
    const parsed = JSON.parse(detail);
    return new Error(parsed.message || parsed.details || `Erro Supabase ${status} em ${path}`);
  } catch {
    return new Error(detail || `Erro Supabase ${status} em ${path}`);
  }
}

async function supabaseRequest(path, options = {}) {
  if (!sharedCatalogEnabled) {
    throw new Error("Supabase nao configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
  }

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs || REQUEST_TIMEOUT_MS;
  const { timeoutMs: _timeoutMs, ...requestOptions } = options;
  const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      ...requestOptions,
      signal: controller.signal,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        ...(requestOptions.headers || {})
      }
    });

    const text = await response.text();

    if (!response.ok) {
      throw getSupabaseError(response.status, text, path);
    }

    return text ? JSON.parse(text) : null;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Tempo esgotado ao conectar no Supabase. Tente novamente em instantes.");
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

async function fetchProductsFromTable(tableName) {
  const rows = await supabaseRequest(
    `${tableName}?select=id,name,category,price,promotional_price,promotion_active,featured,description,available_quantity,sold_out,created_at&order=created_at.desc`
  );
  return (rows || []).map(productFromRow);
}

async function fetchProductImage(tableName, id) {
  const rows = await supabaseRequest(
    `${tableName}?select=id,main_image:images->>0&id=eq.${encodeURIComponent(id)}&limit=1`,
    { timeoutMs: IMAGE_REQUEST_TIMEOUT_MS }
  );
  return {
    id,
    images: normalizeImages(rows?.[0]?.main_image)
  };
}

async function hydrateProductImageQueue(tableName, products, imagesById, onProductImages) {
  let nextIndex = 0;

  async function hydrateNextProduct() {
    const product = products[nextIndex];
    nextIndex += 1;

    if (!product) return;

    try {
      const imageResult = await fetchProductImage(tableName, product.id);
      if (imageResult.images[0]) {
        imagesById.set(imageResult.id, imageResult.images);
        onProductImages?.(imageResult.id, imageResult.images);
      }
    } catch {
      // Keep the placeholder if a legacy oversized image times out.
    }

    await hydrateNextProduct();
  }

  await Promise.all(
    Array.from({ length: Math.min(IMAGE_HYDRATION_BATCH_SIZE, products.length) }, () =>
      hydrateNextProduct()
    )
  );
}

async function findWritableProductsTable() {
  if (writableProductsTable) return writableProductsTable;

  for (const tableName of PRODUCT_TABLE_CANDIDATES) {
    try {
      await supabaseRequest(`${tableName}?select=id&limit=1`);
      writableProductsTable = tableName;
      return tableName;
    } catch (error) {
      const message = String(error.message || "");
      if (!message.includes("Could not find") && !message.includes("404")) {
        throw error;
      }
    }
  }

  throw new Error(
    "Nenhuma tabela de produtos foi encontrada no Supabase. Verifique se existe produtos_mirvalis ou mirvalis_products com acesso anon."
  );
}

async function saveProductsToWritableTable(products) {
  if (!products.length) return [];
  const tableName = await findWritableProductsTable();
  const rows = await supabaseRequest(`${tableName}?on_conflict=id`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(products.map(productToRow))
  });
  return (rows || []).map(productFromRow);
}

function dedupeById(items) {
  const map = new Map();

  items.forEach((item) => {
    if (item?.id && !map.has(item.id)) {
      map.set(item.id, item);
    }
  });

  return Array.from(map.values());
}

function readLegacyJson(key, fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function readLegacyCatalogSnapshot() {
  return {
    products: readLegacyJson(LEGACY_PRODUCTS_KEY, []).map(normalizeProduct),
    promotions: readLegacyJson(LEGACY_PROMOTIONS_KEY, []).map(normalizePromotion)
  };
}

export async function migrateLegacyCatalogToSupabase() {
  if (
    !sharedCatalogEnabled ||
    typeof window === "undefined" ||
    window.localStorage.getItem(LEGACY_MIGRATION_KEY) === "done"
  ) {
    return { products: 0, promotions: 0, skipped: true };
  }

  const legacy = readLegacyCatalogSnapshot();
  const products = dedupeById(legacy.products.filter((product) => product.id && product.name));
  const promotions = dedupeById(legacy.promotions.filter((promotion) => promotion.id));

  if (products.length) {
    await saveProductsToWritableTable(products);
  }

  if (promotions.length) {
    await saveSharedPromotions(promotions);
  }

  window.localStorage.setItem(LEGACY_MIGRATION_KEY, "done");

  return {
    products: products.length,
    promotions: promotions.length,
    skipped: false
  };
}

export async function fetchSharedProducts() {
  const results = [];
  const errors = [];

  for (const tableName of PRODUCT_TABLE_CANDIDATES) {
    try {
      const tableProducts = await fetchProductsFromTable(tableName);
      if (!writableProductsTable) writableProductsTable = tableName;
      results.push(...tableProducts);
    } catch (error) {
      errors.push(error.message);
    }
  }

  if (!results.length && errors.length === PRODUCT_TABLE_CANDIDATES.length) {
    throw new Error(`Nao foi possivel ler produtos no Supabase: ${errors.join(" | ")}`);
  }

  return dedupeById(results);
}

export async function hydrateSharedProductImages(products, onProductImages) {
  if (!products.length) return products;

  const tableName = writableProductsTable || (await findWritableProductsTable());
  const imagesById = new Map();
  await hydrateProductImageQueue(tableName, products, imagesById, onProductImages);

  return products.map((product) => ({
    ...product,
    images: imagesById.get(product.id) || product.images
  }));
}

export async function fetchSharedPromotions() {
  const rows = await supabaseRequest(`${PROMOTIONS_TABLE}?select=*&order=created_at.desc`);
  return (rows || []).map(promotionFromRow);
}

export async function saveSharedProduct(product) {
  const rows = await saveProductsToWritableTable([product]);
  return rows[0] || normalizeProduct(product);
}

export async function deleteSharedProduct(id) {
  const errors = [];

  for (const tableName of PRODUCT_TABLE_CANDIDATES) {
    try {
      await supabaseRequest(`${tableName}?id=eq.${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
    } catch (error) {
      errors.push(error.message);
    }
  }

  if (errors.length === PRODUCT_TABLE_CANDIDATES.length) {
    throw new Error(`Nao foi possivel remover produto no Supabase: ${errors.join(" | ")}`);
  }
}

export async function saveSharedPromotion(promotion) {
  const rows = await saveSharedPromotions([promotion]);
  return rows[0] || normalizePromotion(promotion);
}

export async function saveSharedPromotions(promotions) {
  if (!promotions.length) return [];
  const rows = await supabaseRequest(`${PROMOTIONS_TABLE}?on_conflict=id`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(promotions.map(promotionToRow))
  });
  return (rows || []).map(promotionFromRow);
}

export async function deleteSharedPromotion(id) {
  await supabaseRequest(`${PROMOTIONS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
}
