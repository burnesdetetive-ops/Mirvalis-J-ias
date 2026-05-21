import { Gem, MessageCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const trustItems = [
  {
    icon: Gem,
    title: "Prata 925",
    text: "Peças selecionadas com brilho limpo, acabamento delicado e presença elegante."
  },
  {
    icon: MessageCircle,
    title: "Atendimento personalizado",
    text: "Compra assistida pelo WhatsApp para tirar dúvidas, confirmar disponibilidade e combinar entrega."
  },
  {
    icon: ShieldCheck,
    title: "Compra segura",
    text: "Pedido revisado antes do fechamento, com confirmação de produto, quantidade e valor."
  }
];

export function TrustSection() {
  return (
    <section className="border-y border-white/10 bg-[#080808] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-mir-gold">Confiança</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Detalhes que fazem a compra parecer boutique.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-mir-silver/62 sm:text-base">
            A MIRVALIS valoriza uma jornada silenciosa, elegante e acompanhada de perto, do primeiro
            clique à confirmação do pedido.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.06 }}
              className="group rounded-sm border border-white/10 bg-white/[0.025] p-6 transition hover:border-mir-gold/35 hover:bg-white/[0.04]"
            >
              <div className="grid h-12 w-12 place-items-center rounded-sm border border-mir-gold/30 text-mir-gold transition group-hover:bg-mir-gold group-hover:text-mir-black">
                <item.icon size={20} />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-mir-silver/62">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
