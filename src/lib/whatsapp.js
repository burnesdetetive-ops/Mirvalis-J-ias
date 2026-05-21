import { formatCurrency } from "./format";

export const MIRVALIS_WHATSAPP = "32998107950";

export function sanitizeWhatsAppNumber(value) {
  return String(value || MIRVALIS_WHATSAPP).replace(/\D/g, "") || MIRVALIS_WHATSAPP;
}

export function buildWhatsAppUrl({ items, total, product, phone }) {
  const safeItems = items || [];
  const lines = product
    ? [
        "Olá, MIRVALIS. Tenho interesse nesta joia:",
        "",
        `Produto: ${product.name}`,
        `Preço: ${formatCurrency(product.price)}`
      ]
    : safeItems.length
      ? [
        "Olá, MIRVALIS. Gostaria de finalizar meu pedido:",
        "",
        ...safeItems.map(
          (item) =>
            `- ${item.name} | qtd. ${item.quantity} | ${formatCurrency(item.price * item.quantity)}`
        ),
        "",
        `Total: ${formatCurrency(total)}`
      ]
      : [
        "Olá, MIRVALIS. Gostaria de atendimento para conhecer as joias disponíveis."
      ];

  return `https://api.whatsapp.com/send?phone=${sanitizeWhatsAppNumber(phone)}&text=${encodeURIComponent(lines.join("\n"))}`;
}

export function openWhatsAppUrl(url) {
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.location.href = url;
  }
}
