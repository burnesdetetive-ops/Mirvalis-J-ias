import { ArrowRight, Sparkles } from "lucide-react";
import { ProductCard } from "./ProductCard";

export function PromotionsSection({ products, onAdd, onView, whatsappNumber, onSeeAll }) {
  return (
    <section id="promocoes" className="relative overflow-hidden border-y border-mir-gold/10 bg-[#080808] py-20 sm:py-24">
      <div className="absolute inset-x-0 top-10 text-center font-display text-[16vw] font-semibold leading-none tracking-[0.1em] text-white/[0.016]">
        MIRVALIS
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 border border-mir-gold/20 bg-mir-gold/[0.08] px-3 py-2 text-xs uppercase tracking-[0.24em] text-mir-gold">
              <Sparkles size={14} />
              Promoções da Semana
            </div>
            <h2 className="mt-5 font-display text-4xl font-semibold text-white sm:text-6xl">
              Brilho especial por tempo limitado
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-mir-silver/62 sm:text-base">
              Peças selecionadas com condições especiais, mantendo a curadoria delicada da MIRVALIS.
            </p>
          </div>

          <button
            type="button"
            onClick={onSeeAll}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-mir-gold/35 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-mir-gold transition hover:bg-mir-gold hover:text-mir-black"
          >
            Ver catálogo
            <ArrowRight size={16} />
          </button>
        </div>

        {products.length > 0 ?(
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={onAdd}
                onView={onView}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-sm border border-white/10 bg-white/[0.03] p-6 text-sm leading-7 text-mir-silver/60 sm:p-8">
            As ofertas aparecem aqui assim que você ativar uma promoção no painel admin.
          </div>
        )}
      </div>
    </section>
  );
}
