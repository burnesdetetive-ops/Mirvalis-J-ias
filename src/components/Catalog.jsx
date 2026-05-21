import { Search, SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { categories } from "../data/initialProducts";
import { normalizeText } from "../lib/format";
import { ProductCard } from "./ProductCard";

export function Catalog({
  products,
  selectedCategory,
  setSelectedCategory,
  query,
  setQuery,
  maxPrice,
  setMaxPrice,
  onAdd,
  onView,
  whatsappNumber
}) {
  const filteredProducts = products.filter((product) => {
    const matchCategory = selectedCategory === "todos" || product.category === selectedCategory;
    const matchQuery = normalizeText(product.name).includes(normalizeText(query));
    const matchPrice = Number(product.price) <= Number(maxPrice);
    return matchCategory && matchQuery && matchPrice;
  });

  return (
    <section id="catalogo" className="relative overflow-hidden py-24 sm:py-28">
      <div className="absolute left-1/2 top-20 -translate-x-1/2 opacity-80">
        <div className="font-display text-[18vw] font-semibold leading-none tracking-[0.12em] text-white/[0.018]">
          MIRVALIS
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-mir-gold">Catálogo</p>
            <h2 className="mt-4 font-display text-5xl font-semibold text-white sm:text-6xl">
              Escolha sua joia
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-mir-silver/62 sm:text-base">
              Filtre por categoria, encontre a peça ideal e compre direto pelo WhatsApp com
              atendimento MIRVALIS.
            </p>
          </div>
          <div className="grid gap-3 rounded-sm border border-white/10 bg-white/[0.025] p-3 sm:grid-cols-[minmax(0,18rem)_minmax(0,16rem)] lg:p-4">
            <label className="relative block">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mir-gold"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar produto"
                className="h-12 w-full rounded-sm border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-mir-silver/40 focus:border-mir-gold/60"
              />
            </label>
            <label className="relative block">
              <SlidersHorizontal
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mir-gold"
              />
              <select
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                className="h-12 w-full appearance-none rounded-sm border border-white/10 bg-[#101010] pl-11 pr-4 text-sm text-white outline-none transition focus:border-mir-gold/60"
              >
                <option value="99999">Todos os preços</option>
                <option value="180">Até R$ 180</option>
                <option value="250">Até R$ 250</option>
                <option value="400">Até R$ 400</option>
              </select>
            </label>
          </div>
        </div>

        <div className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 hide-scrollbar sm:mx-0 sm:mt-10 sm:px-0">
          <button
            type="button"
            onClick={() => setSelectedCategory("todos")}
            className={`min-h-10 whitespace-nowrap rounded-sm border px-4 text-xs font-semibold uppercase tracking-[0.18em] transition ${
              selectedCategory === "todos"
                ? "border-mir-gold bg-mir-gold text-mir-black"
                : "border-white/10 text-mir-silver hover:border-mir-gold/50 hover:text-mir-gold"
            }`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className={`min-h-10 whitespace-nowrap rounded-sm border px-4 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                selectedCategory === category.id
                  ? "border-mir-gold bg-mir-gold text-mir-black"
                  : "border-white/10 text-mir-silver hover:border-mir-gold/50 hover:text-mir-gold"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={onAdd}
                onView={onView}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="mt-12 rounded-sm border border-white/10 bg-white/[0.03] p-10 text-center text-mir-silver/70">
            Nenhuma joia encontrada com os filtros atuais.
          </div>
        )}
      </div>
    </section>
  );
}
