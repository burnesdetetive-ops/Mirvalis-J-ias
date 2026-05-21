import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "./Logo";

export function Hero({ onShop }) {
  return (
    <section id="inicio" className="relative min-h-[92vh] overflow-hidden pt-28">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=86"
          alt="Joia em prata MIRVALIS"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-mir-black via-mir-black/84 to-mir-black/38" />
        <div className="absolute inset-0 bg-gradient-to-t from-mir-black via-transparent to-mir-black/30" />
      </div>

      <div className="absolute bottom-6 left-1/2 w-full max-w-7xl -translate-x-1/2 px-4 sm:px-6 lg:px-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-mir-gold/45 to-transparent" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(92vh-7rem)] max-w-7xl items-center px-4 pb-20 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="mb-8 inline-flex items-center gap-3 border border-mir-gold/25 bg-mir-black/45 px-4 py-2 text-xs uppercase tracking-[0.28em] text-mir-silver/80 backdrop-blur">
            <Sparkles size={15} className="text-mir-gold" />
            Boutique feminina em prata
          </div>
          <div className="mb-7">
            <Logo compact />
          </div>
          <h1 className="font-display text-6xl font-semibold leading-[0.92] text-white sm:text-7xl lg:text-8xl">
            MIRVALIS
          </h1>
          <p className="mt-5 font-display text-3xl text-mir-gold sm:text-4xl">Joias na Prata</p>
          <p className="mt-7 max-w-xl text-base leading-8 text-mir-silver/74 sm:text-lg">
              Peças femininas em prata para quem prefere brilho contido, desenho delicado e uma
            experiência de compra direta pelo WhatsApp.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onShop}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-mir-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-mir-black transition hover:bg-[#dfbd6a]"
            >
              Ver catálogo
              <ArrowRight size={17} />
            </button>
            <a
              href="#destaques"
              className="inline-flex min-h-12 items-center justify-center rounded-sm border border-white/14 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-mir-silver transition hover:border-mir-gold/55 hover:text-mir-gold"
            >
              Destaques
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="mt-12 hidden justify-end lg:flex"
        >
          <div className="relative aspect-[4/5] w-full max-w-[25rem] overflow-hidden rounded-sm border border-mir-gold/20 bg-white/[0.03] shadow-gold">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=84"
              alt="Colar em prata em destaque"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-mir-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xs uppercase tracking-[0.32em] text-mir-gold">Curadoria MIRVALIS</p>
              <p className="mt-2 font-display text-2xl text-white">Prata com presença serena</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
