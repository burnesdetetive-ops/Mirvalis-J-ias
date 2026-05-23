export function getProductStock(product) {
  const stock = Number(product?.stock);
  return Number.isFinite(stock) ?Math.max(0, stock) : 0;
}

export function isProductUnavailable(product) {
  return Boolean(product?.soldOut) || getProductStock(product) <= 0;
}

export function getStockLabel(product) {
  const stock = getProductStock(product);
  if (isProductUnavailable(product)) return "Esgotado";
  return stock === 1 ?"1 disponível" : `${stock} disponíveis`;
}
