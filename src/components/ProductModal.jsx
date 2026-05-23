import { Minus, Plus, Send, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getCategoryLabel } from "../data/initialProducts";
import { formatCurrency } from "../lib/format";
import { getStockLabel, isProductUnavailable } from "../lib/product";
import { buildWhatsAppUrl, openWhatsAppUrl } from "../lib/whatsapp";

export function ProductModal({ product, whatsappNumber, onClose, onAdd }) {
  const [imageIndex, setImageIndex] = useState(0);
  const unavailable = product ?isProductUnavailable(product) : false;
  const promotion = product?.promotion;
  const whatsappUrl =
    product && !unavailable ?buildWhatsAppUrl({ product, phone: whatsappNumber }) : undefined;

  useEffect(() => {
    setImageIndex(0);
  }, [product?.id]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-mir-black/82 p-4 backdrop-blur-md"
          onMouseDown={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.24 }}
            onMouseDown={(event) => event.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-sm surface shadow-gold scrollbar-soft"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-sm border border-white/10 bg-mir-black/75 text-mir-silver transition hover:border-mir-gold/55 hover:text-mir-gold"
              aria-label="Fechar produto"
              title="Fechar"
            >
              <X size={18} />
            </button>

            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-4 sm:p-6">
                <div className="aspect-[4/5] overflow-hidden rounded-sm product-image">
                  <img
                    src={product.images?.[imageIndex]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {product.images?.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setImageIndex(index)}
                      className={`aspect-square overflow-hidden rounded-sm border transition ${
                        index === imageIndex ?"border-mir-gold" : "border-white/10"
                      }`}
                    >
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center p-6 sm:p-10">
                <p className="text-xs uppercase tracking-[0.36em] text-mir-gold">
                  {getCategoryLabel(product.category)}
                </p>
                <h2 className="mt-4 font-display text-5xl font-semibold leading-tight text-white">
                  {product.name}
                </h2>
                <div className="mt-5">
                  {promotion && (
                    <div className="mb-3 inline-flex border border-mir-gold/25 bg-mir-gold/[0.08] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-mir-gold">
                      Promoção {promotion.discountPercent > 0 ?`${promotion.discountPercent}% OFF` : ""}
                    </div>
                  )}
                  {promotion && (
                    <p className="text-base text-mir-silver/42 line-through">
                      {formatCurrency(product.originalPrice)}
                    </p>
                  )}
                  <p className={`text-3xl font-semibold ${promotion ?"text-mir-gold" : "text-mir-silver"}`}>
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.24em] text-mir-gold/75">
                  {getStockLabel(product)}
                </p>
                <p className="mt-7 text-base leading-8 text-mir-silver/68">{product.description}</p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => onAdd(product)}
                    disabled={unavailable}
                    className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-mir-gold px-5 text-sm font-semibold uppercase tracking-[0.18em] text-mir-black transition hover:bg-[#dfbd6a] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-mir-silver/35"
                  >
                    {unavailable ?<Minus size={17} /> : <ShoppingBag size={17} />}
                    {unavailable ?"Esgotado" : "Adicionar"}
                  </button>
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
                    className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-sm border px-5 text-sm font-semibold uppercase tracking-[0.18em] transition ${
                      unavailable
                        ?"pointer-events-none border-white/10 text-mir-silver/32"
                        : "border-mir-gold/40 text-mir-gold hover:bg-mir-gold hover:text-mir-black"
                    }`}
                  >
                    <Send size={17} />
                    WhatsApp
                  </a>
                </div>

                <div className="mt-8 border-l border-mir-gold/45 pl-5 text-sm leading-7 text-mir-silver/60">
                  Compra finalizada por atendimento humano no WhatsApp, com confirmação de estoque e
                  envio antes do pagamento.
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
