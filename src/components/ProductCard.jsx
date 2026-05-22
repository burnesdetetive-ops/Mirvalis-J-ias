import { Eye, Send, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { getCategoryLabel } from "../data/initialProducts";
import { formatCurrency } from "../lib/format";
import { getStockLabel, isProductUnavailable } from "../lib/product";
import { buildWhatsAppUrl, openWhatsAppUrl } from "../lib/whatsapp";

export function ProductCard({ product, onView, whatsappNumber }) {
  const unavailable = isProductUnavailable(product);
  const promotion = product.promotion;
  const whatsappUrl = unavailable
    ? undefined
    : buildWhatsAppUrl({ product, phone: whatsappNumber });

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="group overflow-hidden rounded-sm surface shadow-soft transition duration-300 hover:-translate-y-1 hover:border-mir-gold/30 hover:shadow-gold"
    >
      <button
        type="button"
        onClick={() => onView(product)}
        className="relative block aspect-[4/5] w-full overflow-hidden product-image text-left"
      >
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mir-black/72 via-transparent to-transparent opacity-80" />
        {unavailable && (
          <div className="absolute left-4 top-4 border border-mir-silver/25 bg-mir-black/80 px-3 py-1 text-xs uppercase tracking-[0.22em] text-mir-silver">
            Esgotado
          </div>
        )}
        {promotion && !unavailable && (
          <div className="absolute left-4 top-4 inline-flex items-center gap-2 border border-mir-gold/45 bg-mir-black/78 px-3 py-1 text-xs uppercase tracking-[0.18em] text-mir-gold">
            <Tag size={13} />
            Promocao
          </div>
        )}
        {product.featured && !unavailable && !promotion && (
          <div className="absolute left-4 top-4 border border-mir-gold/35 bg-mir-black/70 px-3 py-1 text-xs uppercase tracking-[0.22em] text-mir-gold">
            Destaque
          </div>
        )}
        <div className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-sm bg-mir-black/78 text-mir-gold backdrop-blur transition group-hover:bg-mir-gold group-hover:text-mir-black">
          <Eye size={17} />
        </div>
      </button>

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-mir-gold/75">
              {getCategoryLabel(product.category)}
            </p>
            <h3 className="mt-2 line-clamp-2 font-display text-2xl font-semibold leading-tight text-white">
              {product.name}
            </h3>
          </div>
          <div className="shrink-0 pt-1 text-right">
            {promotion && (
              <p className="text-xs text-mir-silver/42 line-through">
                {formatCurrency(product.originalPrice)}
              </p>
            )}
            <p className={`whitespace-nowrap text-sm font-semibold ${promotion ? "text-mir-gold" : "text-mir-silver"}`}>
              {formatCurrency(product.price)}
            </p>
          </div>
        </div>
        {promotion && (
          <div className="mt-3 inline-flex items-center gap-2 border border-mir-gold/25 bg-mir-gold/[0.08] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-mir-gold">
            {promotion.discountPercent > 0 ? `${promotion.discountPercent}% OFF` : "Oferta especial"}
          </div>
        )}
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-mir-silver/42">
          {getStockLabel(product)}
        </p>
        <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-mir-silver/62">
          {product.description}
        </p>

        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => {
              if (!whatsappUrl) return;
              event.preventDefault();
              openWhatsAppUrl(whatsappUrl);
            }}
            aria-disabled={unavailable}
            className={`inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-sm px-3 text-center text-xs font-semibold uppercase tracking-[0.1em] transition sm:px-4 sm:tracking-[0.14em] ${
              unavailable
                ? "pointer-events-none border border-white/10 text-mir-silver/35"
                : "bg-mir-gold text-mir-black hover:bg-[#dfbd6a]"
            }`}
          >
            <Send size={16} />
            {unavailable ? "Esgotado" : "Comprar pelo WhatsApp"}
          </a>
          <button
            type="button"
            onClick={() => onView(product)}
            className="grid h-11 w-11 place-items-center rounded-sm border border-white/10 text-mir-silver transition hover:border-mir-gold/45 hover:text-mir-gold"
            aria-label={`Ver ${product.name}`}
            title="Ver produto"
          >
            <Eye size={17} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
