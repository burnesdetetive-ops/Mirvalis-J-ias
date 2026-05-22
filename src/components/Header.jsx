import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "./Logo";

const navItems = [
  { id: "inicio", label: "Inicio" },
  { id: "promocoes", label: "Promocoes" },
  { id: "destaques", label: "Destaques" },
  { id: "catalogo", label: "Catalogo" }
];

export function Header({ cartCount, onNavigate, onOpenCart }) {
  const [open, setOpen] = useState(false);

  const handleNavigate = (id) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-mir-gold/10 bg-mir-black/84 backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-mir-gold/35 to-transparent" />
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => handleNavigate("inicio")}
          className="flex min-w-0 shrink-0 items-center text-left"
          aria-label="Ir para o inicio"
        >
          <Logo />
        </button>

        <nav className="hidden items-center gap-1 rounded-sm border border-white/10 bg-white/[0.025] p-1 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.id)}
              className="rounded-sm px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-mir-silver/72 transition hover:bg-white/[0.04] hover:text-mir-gold xl:px-4 xl:tracking-[0.2em]"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => handleNavigate("catalogo")}
            className="hidden h-11 w-11 place-items-center rounded-sm border border-white/10 bg-white/[0.025] text-mir-silver transition hover:border-mir-gold/50 hover:text-mir-gold sm:grid"
            aria-label="Buscar produtos"
            title="Buscar produtos"
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            onClick={onOpenCart}
            className="relative grid h-11 w-11 place-items-center rounded-sm border border-mir-gold/40 bg-white/[0.025] text-mir-gold transition hover:bg-mir-gold hover:text-mir-black"
            aria-label="Abrir carrinho"
            title="Abrir carrinho"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-mir-silver px-1 text-[0.68rem] font-bold text-mir-black">
                {cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-sm border border-white/10 bg-white/[0.025] text-mir-silver lg:hidden"
            aria-label="Abrir menu"
            title="Menu"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-white/10 bg-mir-black px-4 py-5 lg:hidden"
        >
          <div className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className="flex min-h-12 items-center justify-between rounded-sm border border-white/10 px-3 py-3 text-left text-sm uppercase tracking-[0.18em] text-mir-silver/80 hover:bg-white/[0.04] hover:text-mir-gold"
              >
                {item.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}
