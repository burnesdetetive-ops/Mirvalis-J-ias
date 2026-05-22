import { formatCurrency } from "./format";

export const MIRVALIS_WHATSAPP = "32998107950";

export function sanitizeWhatsAppNumber(value) {
  return String(value || MIRVALIS_WHATSAPP).replace(/\D/g, "") || MIRVALIS_WHATSAPP;
}

function getProductLines(product) {
  const lines = [
    "Ola, MIRVALIS. Tenho interesse nesta joia:",
    "",
    `Produto: ${product.name}`
  ];

  if (product.promotion) {
    lines.push(`Preco promocional: ${formatCurrency(product.price)}`);
    lines.push(`Preco original: ${formatCurrency(product.originalPrice)}`);
  } else {
    lines.push(`Preco: ${formatCurrency(product.price)}`);
  }

  return lines;
}

function getCartLines(items, total) {
  return [
    "Ola, MIRVALIS. Gostaria de finalizar meu pedido:",
    "",
    ...items.map((item) => {
      const priceLabel = item.promotion
        ? `${formatCurrency(item.price * item.quantity)} promocional`
        : formatCurrency(item.price * item.quantity);
      return `- ${item.name} | qtd. ${item.quantity} | ${priceLabel}`;
    }),
    "",
    `Total: ${formatCurrency(total)}`
  ];
}

export function buildWhatsAppUrl({ items, total, product, phone }) {
  const safeItems = items || [];
  const lines = product
    ? getProductLines(product)
    : safeItems.length
      ? getCartLines(safeItems, total)
      : ["Ola, MIRVALIS. Gostaria de atendimento para conhecer as joias disponiveis."];

  return `https://api.whatsapp.com/send?phone=${sanitizeWhatsAppNumber(phone)}&text=${encodeURIComponent(lines.join("\n"))}`;
}

export function openWhatsAppUrl(url) {
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.location.href = url;
  }
}
