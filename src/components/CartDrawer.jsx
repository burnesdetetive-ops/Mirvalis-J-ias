import { Minus, Plus, Send, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { formatCurrency } from "../lib/format";
import { getProductStock, isProductUnavailable } from "../lib/product";
import { buildWhatsAppUrl, openWhatsAppUrl } from "../lib/whatsapp";

export function CartDrawer({
  open,
  items,
  total,
  whatsappNumber,
  onClose,
  onIncrement,
  onDecrement,
  onRemove
}) {
  const checkoutUrl = items.length ? buildWhatsAppUrl({ items, total, phone: whatsappNumber }) : undefined;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-mir-black/78 backdrop-blur-sm"
          onMouseDown={onClose}
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            onMouseDown={(event) => event.stopPropagation()}
            className="ml-auto flex h-full w-full max-w-md flex-col surface"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-mir-gold">Carrinho</p>
                <h2 className="mt-1 font-display text-3xl text-white">Seu pedido</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-sm border border-white/10 text-mir-silver hover:border-mir-gold/55 hover:text-mir-gold"
                aria-label="Fechar carrinho"
                title="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 scrollbar-soft">
              {items.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <ShoppingBag className="mx-auto text-mir-gold" size={34} />
                    <p className="mt-4 font-display text-2xl text-white">Seu carrinho está vazio</p>
                    <p className="mt-2 text-sm leading-6 text-mir-silver/58">
                      Escolha uma joia no catálogo para iniciar o pedido.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {items.map((item) => {
                    const stock = getProductStock(item);
                    const unavailable = isProductUnavailable(item);

                    return (
                    <div key={item.id} className="grid grid-cols-[5rem_1fr] gap-4 rounded-sm border border-white/10 bg-white/[0.03] p-3">
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        className="aspect-square rounded-sm object-cover"
                      />
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-display text-xl text-white">{item.name}</h3>
                            <p className="mt-1 text-sm text-mir-silver/62">
                              {formatCurrency(item.price)}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-mir-silver/38">
                              {unavailable ? "Esgotado" : `${stock} em estoque`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemove(item.id)}
                            className="grid h-8 w-8 place-items-center rounded-sm text-mir-silver/55 hover:bg-white/[0.05] hover:text-mir-gold"
                            aria-label={`Remover ${item.name}`}
                            title="Remover"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center border border-white/10">
                            <button
                              type="button"
                              onClick={() => onDecrement(item.id)}
                              className="grid h-9 w-9 place-items-center text-mir-silver hover:text-mir-gold"
                              aria-label="Diminuir quantidade"
                            >
                              <Minus size={15} />
                            </button>
                            <span className="grid h-9 min-w-10 place-items-center border-x border-white/10 text-sm text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onIncrement(item.id)}
                              disabled={unavailable || item.quantity >= stock}
                              className="grid h-9 w-9 place-items-center text-mir-silver hover:text-mir-gold"
                              aria-label="Aumentar quantidade"
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-mir-silver">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.22em] text-mir-silver/62">Total</span>
                <strong className="font-display text-3xl text-white">{formatCurrency(total)}</strong>
              </div>
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => {
                  if (!checkoutUrl) return;
                  event.preventDefault();
                  openWhatsAppUrl(checkoutUrl);
                }}
                aria-disabled={!items.length}
                className={`mt-5 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-sm text-sm font-semibold uppercase tracking-[0.18em] transition ${
                  items.length
                    ? "bg-mir-gold text-mir-black hover:bg-[#dfbd6a]"
                    : "pointer-events-none bg-white/10 text-mir-silver/30"
                }`}
              >
                <Send size={17} />
                Finalizar pelo WhatsApp
              </a>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
