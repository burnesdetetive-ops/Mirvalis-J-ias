export const CATALOG_VERSION = "mirvalis-catalog-2026-05-23-categorias-textos";

export const categories = [
  { id: "aneis", label: "Anéis" },
  { id: "colares", label: "Colares" },
  { id: "pulseiras", label: "Pulseiras" },
  { id: "brincos", label: "Brincos" },
  { id: "conjuntos", label: "Conjuntos" },
  { id: "tornozeleiras", label: "Tornozeleiras" },
  { id: "piercings", label: "Piercings" }
];

export function getCategoryLabel(categoryId) {
  return categories.find((category) => category.id === categoryId)?.label || categoryId;
}

export const initialProducts = [
  {
    id: "anel-coracao-cristais-coloridos",
    name: "Anel Coração Cristais Coloridos",
    category: "aneis",
    price: 149.9,
    stock: 3,
    featured: true,
    soldOut: false,
    description:
      "Anel delicado em prata com coração central e cristais coloridos ao redor. Feminino, luminoso e perfeito para presentear.",
    images: ["/catalog/anel-coracao-cristais.jpeg"]
  },
  {
    id: "brinco-gota-rubi-prata",
    name: "Brinco Gota Rubi Prata",
    category: "brincos",
    price: 169.9,
    stock: 4,
    featured: true,
    soldOut: false,
    description:
      "Brinco em prata com pedra rubi e pingente em formato de gota. Um toque elegante de cor para produções sofisticadas.",
    images: ["/catalog/brinco-gota-rubi.jpeg"]
  },
  {
    id: "colar-flores-prata",
    name: "Colar Flores Prata",
    category: "colares",
    price: 189.9,
    stock: 5,
    featured: true,
    soldOut: false,
    description:
      "Colar em prata com pequenos detalhes florais distribuídos na corrente. Leve, romântico e delicado no colo.",
    images: ["/catalog/colar-flores-prata.jpeg"]
  },
  {
    id: "pulseira-elos-prata",
    name: "Pulseira Elos Prata",
    category: "pulseiras",
    price: 139.9,
    stock: 6,
    featured: false,
    soldOut: false,
    description:
      "Pulseira de elos em prata com acabamento polido. Versátil para uso diário e elegante para composições minimalistas.",
    images: ["/catalog/pulseira-elos-prata.jpeg"]
  },
  {
    id: "anel-folhas-prata",
    name: "Anel Folhas Prata",
    category: "aneis",
    price: 129.9,
    stock: 4,
    featured: true,
    soldOut: false,
    description:
      "Anel em prata com desenho orgânico de folhas. Uma peça delicada com inspiração natural e acabamento refinado.",
    images: ["/catalog/anel-folhas-prata.jpeg"]
  },
  {
    id: "piercing-prata-delicado",
    name: "Piercing Prata Delicado",
    category: "piercings",
    price: 89.9,
    stock: 7,
    featured: false,
    soldOut: false,
    description:
      "Piercing em prata com curvas suaves e presença discreta. Ideal para compor mix de orelha com elegância.",
    images: ["/catalog/piercing-prata-caixa.jpeg"]
  },
  {
    id: "bracelete-coracoes-prata",
    name: "Bracelete Corações Prata",
    category: "pulseiras",
    price: 179.9,
    stock: 3,
    featured: false,
    soldOut: false,
    description:
      "Bracelete em prata com dois corações vazados. Uma peça feminina, moderna e marcante sem perder a leveza.",
    images: ["/catalog/bracelete-coracoes.jpeg"]
  },
  {
    id: "pulseira-infinito-coracoes",
    name: "Pulseira Infinito Corações",
    category: "pulseiras",
    price: 159.9,
    stock: 5,
    featured: true,
    soldOut: false,
    description:
      "Pulseira em prata com detalhe central de infinito formado por corações. Romântica, delicada e fácil de combinar.",
    images: ["/catalog/pulseira-infinito-coracoes.jpeg"]
  }
];
