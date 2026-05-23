export const emptyPromotion = {
  name: "",
  active: true,
  productIds: [],
  promotionalPrice: "",
  discountPercent: "",
  startDate: "",
  endDate: ""
};

function toDateOnly(value, fallback) {
  if (!value) return fallback;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ?fallback : date;
}

export function isPromotionLive(promotion, now = new Date()) {
  if (!promotion?.active) return false;
  const start = toDateOnly(promotion.startDate, new Date("2000-01-01T12:00:00"));
  const end = toDateOnly(promotion.endDate, new Date("2999-12-31T12:00:00"));
  return now >= start && now <= end;
}

export function getPromotionPrice(product, promotion) {
  const basePrice = Number(product?.price || 0);
  const directPrice = Number(promotion?.promotionalPrice);
  const discountPercent = Number(promotion?.discountPercent);

  if (Number.isFinite(directPrice) && directPrice > 0) {
    return Math.max(0, directPrice);
  }

  if (Number.isFinite(discountPercent) && discountPercent > 0) {
    return Math.max(0, basePrice * (1 - Math.min(discountPercent, 95) / 100));
  }

  return basePrice;
}

export function getPromotionDiscount(product, promoPrice, promotion) {
  const basePrice = Number(product?.price || 0);
  if (!basePrice) return 0;
  const informedDiscount = Number(promotion?.discountPercent);
  if (Number.isFinite(informedDiscount) && informedDiscount > 0) {
    return Math.min(95, Math.round(informedDiscount));
  }
  return Math.max(0, Math.round(((basePrice - promoPrice) / basePrice) * 100));
}

export function resolveProductPromotion(product, promotions) {
  const matches = (promotions || [])
    .filter((promotion) => {
      const productIds = Array.isArray(promotion.productIds) ?promotion.productIds : [];
      return productIds.includes(product.id) && isPromotionLive(promotion);
    })
    .map((promotion) => {
      const price = getPromotionPrice(product, promotion);
      return {
        ...promotion,
        price,
        originalPrice: Number(product.price || 0),
        discountPercent: getPromotionDiscount(product, price, promotion)
      };
    })
    .filter((promotion) => promotion.price < Number(product.price || 0));

  return matches.sort((a, b) => a.price - b.price)[0] || null;
}

export function applyPromotionsToProducts(products, promotions) {
  return products.map((product) => {
    const promotion = resolveProductPromotion(product, promotions);
    if (!promotion) return { ...product, originalPrice: Number(product.price || 0), promotion: null };
    return {
      ...product,
      originalPrice: Number(product.price || 0),
      price: promotion.price,
      promotion
    };
  });
}
