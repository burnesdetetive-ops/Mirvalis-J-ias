import {
  CalendarDays,
  Edit3,
  ImageUp,
  LogOut,
  PackageCheck,
  Percent,
  Phone,
  Plus,
  Save,
  Tag,
  Trash2
} from "lucide-react";
import { useMemo, useState } from "react";
import { categories } from "../data/initialProducts";
import { formatCurrency } from "../lib/format";
import { getStockLabel, isProductUnavailable } from "../lib/product";
import { emptyPromotion, getPromotionPrice } from "../lib/promotions";
import { sanitizeWhatsAppNumber } from "../lib/whatsapp";

const emptyProduct = {
  name: "",
  category: "aneis",
  price: "",
  stock: 1,
  featured: false,
  soldOut: false,
  description: "",
  images: []
};

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function createSlug(value) {
  return String(value || "mirvalis")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function AdminPanel({
  products,
  setProducts,
  promotions = [],
  setPromotions,
  whatsappNumber,
  setWhatsappNumber,
  onLogout
}) {
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [promotionForm, setPromotionForm] = useState(emptyPromotion);
  const [editingPromotionId, setEditingPromotionId] = useState(null);

  const editingProduct = useMemo(
    () => products.find((product) => product.id === editingId),
    [editingId, products]
  );

  const editingPromotion = useMemo(
    () => promotions.find((promotion) => promotion.id === editingPromotionId),
    [editingPromotionId, promotions]
  );

  const selectedPromotionProducts = useMemo(
    () => products.filter((product) => promotionForm.productIds.includes(product.id)),
    [products, promotionForm.productIds]
  );

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyProduct);
  };

  const resetPromotionForm = () => {
    setEditingPromotionId(null);
    setPromotionForm(emptyPromotion);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedProduct = {
      ...form,
      id: editingId || `${createSlug(form.name)}-${Date.now()}`,
      price: Number(form.price),
      stock: Math.max(0, Number(form.stock || 0)),
      soldOut: Boolean(form.soldOut) || Number(form.stock || 0) <= 0,
      images:
        form.images.length > 0
          ? form.images
          : ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=82"]
    };

    setProducts((currentProducts) =>
      editingId
        ? currentProducts.map((product) => (product.id === editingId ? normalizedProduct : product))
        : [normalizedProduct, ...currentProducts]
    );
    resetForm();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: Number.isFinite(Number(product.stock)) ? Number(product.stock) : product.soldOut ? 0 : 1,
      featured: product.featured,
      soldOut: product.soldOut,
      description: product.description,
      images: product.images || []
    });
    document.getElementById("admin")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRemove = (id) => {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== id));
    setPromotions?.((currentPromotions) =>
      currentPromotions.map((promotion) => ({
        ...promotion,
        productIds: (promotion.productIds || []).filter((productId) => productId !== id)
      }))
    );
    if (editingId === id) resetForm();
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    const images = await Promise.all(files.map(fileToDataUrl));
    setForm((currentForm) => ({ ...currentForm, images: [...currentForm.images, ...images] }));
  };

  const updateProduct = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const updatePromotion = (field, value) => {
    setPromotionForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const togglePromotionProduct = (productId) => {
    setPromotionForm((currentForm) => {
      const productIds = currentForm.productIds.includes(productId)
        ? currentForm.productIds.filter((id) => id !== productId)
        : [...currentForm.productIds, productId];
      return { ...currentForm, productIds };
    });
  };

  const handlePromotionSubmit = (event) => {
    event.preventDefault();
    if (!promotionForm.productIds.length) return;

    const normalizedPromotion = {
      ...promotionForm,
      id: editingPromotionId || `${createSlug(promotionForm.name || "promocao")}-${Date.now()}`,
      name: promotionForm.name || "Promocao MIRVALIS",
      active: Boolean(promotionForm.active),
      productIds: promotionForm.productIds,
      promotionalPrice: promotionForm.promotionalPrice ? Number(promotionForm.promotionalPrice) : "",
      discountPercent: promotionForm.discountPercent ? Number(promotionForm.discountPercent) : "",
      startDate: promotionForm.startDate || "",
      endDate: promotionForm.endDate || ""
    };

    setPromotions((currentPromotions) =>
      editingPromotionId
        ? currentPromotions.map((promotion) =>
            promotion.id === editingPromotionId ? normalizedPromotion : promotion
          )
        : [normalizedPromotion, ...currentPromotions]
    );
    resetPromotionForm();
  };

  const handlePromotionEdit = (promotion) => {
    setEditingPromotionId(promotion.id);
    setPromotionForm({
      name: promotion.name || "",
      active: Boolean(promotion.active),
      productIds: promotion.productIds || [],
      promotionalPrice: promotion.promotionalPrice || "",
      discountPercent: promotion.discountPercent || "",
      startDate: promotion.startDate || "",
      endDate: promotion.endDate || ""
    });
    document.getElementById("admin-promocoes")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePromotionRemove = (id) => {
    setPromotions((currentPromotions) => currentPromotions.filter((promotion) => promotion.id !== id));
    if (editingPromotionId === id) resetPromotionForm();
  };

  const togglePromotionActive = (id) => {
    setPromotions((currentPromotions) =>
      currentPromotions.map((promotion) =>
        promotion.id === id ? { ...promotion, active: !promotion.active } : promotion
      )
    );
  };

  const removeProductFromPromotion = (promotionId, productId) => {
    setPromotions((currentPromotions) =>
      currentPromotions.map((promotion) =>
        promotion.id === promotionId
          ? {
              ...promotion,
              productIds: (promotion.productIds || []).filter((id) => id !== productId)
            }
          : promotion
      )
    );
  };

  return (
    <section id="admin" className="relative border-t border-white/10 bg-[#070707] py-20 sm:py-24">
      <div className="absolute right-0 top-10 opacity-70">
        <div className="font-display text-[16vw] font-semibold leading-none tracking-[0.12em] text-white/[0.018]">
          MIRVALIS
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.38em] text-mir-gold">Painel</p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-white sm:text-6xl">
            Administracao simples
          </h2>
          <p className="mt-5 text-base leading-8 text-mir-silver/64">
            Cadastre produtos reais, ajuste o WhatsApp da loja e gerencie promocoes salvas no
            navegador.
          </p>
          <button
            type="button"
            onClick={onLogout}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-3 rounded-sm border border-white/10 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-mir-silver transition hover:border-mir-gold/50 hover:text-mir-gold"
          >
            <LogOut size={16} />
            Sair do admin
          </button>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-6">
            <div className="rounded-sm surface p-5 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-sm border border-mir-gold/35 text-mir-gold">
                  <Phone size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-3xl text-white">WhatsApp da loja</h3>
                  <p className="mt-2 text-sm leading-6 text-mir-silver/58">
                    Este numero sera usado nos botoes de compra e finalizacao do pedido.
                  </p>
                </div>
              </div>
              <label className="mt-5 block">
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-mir-gold/75">
                  Numero com DDI e DDD
                </span>
                <input
                  value={whatsappNumber}
                  onChange={(event) => setWhatsappNumber(sanitizeWhatsAppNumber(event.target.value))}
                  placeholder="32998107950"
                  inputMode="numeric"
                  className="h-12 w-full rounded-sm border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-mir-silver/38 focus:border-mir-gold/60"
                />
              </label>
            </div>

            <div id="admin-promocoes" className="rounded-sm surface p-5 sm:p-7">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-mir-gold">Promocoes</p>
                  <h3 className="mt-2 font-display text-3xl text-white">
                    {editingPromotion ? "Editar promocao" : "Criar promocao"}
                  </h3>
                </div>
                {editingPromotion && (
                  <button
                    type="button"
                    onClick={resetPromotionForm}
                    className="min-h-10 rounded-sm border border-white/10 px-3 text-xs uppercase tracking-[0.18em] text-mir-silver hover:border-mir-gold/50 hover:text-mir-gold"
                  >
                    Nova
                  </button>
                )}
              </div>

              <form onSubmit={handlePromotionSubmit} className="grid gap-4">
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-mir-gold/75">
                    Nome da promocao
                  </span>
                  <input
                    value={promotionForm.name}
                    onChange={(event) => updatePromotion("name", event.target.value)}
                    placeholder="Ex.: Promocoes da Semana"
                    className="h-12 w-full rounded-sm border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-mir-silver/38 focus:border-mir-gold/60"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-mir-gold/75">
                      Preco promocional
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={promotionForm.promotionalPrice}
                      onChange={(event) => updatePromotion("promotionalPrice", event.target.value)}
                      placeholder="129.90"
                      className="h-12 w-full rounded-sm border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-mir-silver/38 focus:border-mir-gold/60"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-mir-gold/75">
                      Porcentagem de desconto
                    </span>
                    <div className="relative">
                      <Percent
                        size={16}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mir-gold"
                      />
                      <input
                        type="number"
                        min="0"
                        max="95"
                        step="1"
                        value={promotionForm.discountPercent}
                        onChange={(event) => updatePromotion("discountPercent", event.target.value)}
                        placeholder="20"
                        className="h-12 w-full rounded-sm border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none placeholder:text-mir-silver/38 focus:border-mir-gold/60"
                      />
                    </div>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-mir-gold/75">
                      Data de inicio
                    </span>
                    <input
                      type="date"
                      value={promotionForm.startDate}
                      onChange={(event) => updatePromotion("startDate", event.target.value)}
                      className="h-12 w-full rounded-sm border border-white/10 bg-[#101010] px-4 text-sm text-white outline-none focus:border-mir-gold/60"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-mir-gold/75">
                      Data de fim
                    </span>
                    <input
                      type="date"
                      value={promotionForm.endDate}
                      onChange={(event) => updatePromotion("endDate", event.target.value)}
                      className="h-12 w-full rounded-sm border border-white/10 bg-[#101010] px-4 text-sm text-white outline-none focus:border-mir-gold/60"
                    />
                  </label>
                </div>

                <label className="flex min-h-12 items-center gap-3 rounded-sm border border-white/10 px-4 text-sm text-mir-silver">
                  <input
                    type="checkbox"
                    checked={promotionForm.active}
                    onChange={(event) => updatePromotion("active", event.target.checked)}
                    className="accent-mir-gold"
                  />
                  Promocao ativa
                </label>

                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-[0.22em] text-mir-gold/75">
                      Produtos participantes
                    </span>
                    <span className="text-xs text-mir-silver/45">
                      {selectedPromotionProducts.length} selecionado(s)
                    </span>
                  </div>
                  <div className="grid max-h-64 gap-2 overflow-y-auto pr-1 scrollbar-soft">
                    {products.map((product) => {
                      const checked = promotionForm.productIds.includes(product.id);
                      const previewPrice = getPromotionPrice(product, promotionForm);
                      return (
                        <label
                          key={product.id}
                          className={`grid cursor-pointer grid-cols-[3.5rem_1fr_auto] items-center gap-3 rounded-sm border p-2 transition ${
                            checked
                              ? "border-mir-gold/45 bg-mir-gold/[0.08]"
                              : "border-white/10 bg-white/[0.03] hover:border-mir-gold/30"
                          }`}
                        >
                          <img
                            src={product.images?.[0]}
                            alt={product.name}
                            className="aspect-square rounded-sm object-cover"
                          />
                          <span className="min-w-0">
                            <span className="block truncate font-display text-lg text-white">
                              {product.name}
                            </span>
                            <span className="block text-xs text-mir-silver/50">
                              {formatCurrency(product.price)}
                              {checked && previewPrice < Number(product.price) ? ` -> ${formatCurrency(previewPrice)}` : ""}
                            </span>
                          </span>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePromotionProduct(product.id)}
                            className="accent-mir-gold"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!promotionForm.productIds.length}
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-mir-gold px-5 text-sm font-semibold uppercase tracking-[0.18em] text-mir-black transition hover:bg-[#dfbd6a] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-mir-silver/35"
                >
                  {editingPromotion ? <Save size={17} /> : <Tag size={17} />}
                  {editingPromotion ? "Salvar promocao" : "Criar promocao"}
                </button>
              </form>
            </div>

            <form onSubmit={handleSubmit} className="rounded-sm surface p-5 sm:p-7">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h3 className="font-display text-3xl text-white">
                  {editingProduct ? "Editar produto" : "Cadastrar produto real"}
                </h3>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-sm border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-mir-silver hover:border-mir-gold/50 hover:text-mir-gold"
                  >
                    Novo
                  </button>
                )}
              </div>

              <div className="grid gap-4">
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-mir-gold/75">
                    Nome da joia
                  </span>
                  <input
                    required
                    value={form.name}
                    onChange={(event) => updateProduct("name", event.target.value)}
                    placeholder="Ex.: Anel Solitario Prata 925"
                    className="h-12 w-full rounded-sm border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-mir-silver/38 focus:border-mir-gold/60"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-mir-gold/75">
                      Categoria
                    </span>
                    <select
                      value={form.category}
                      onChange={(event) => updateProduct("category", event.target.value)}
                      className="h-12 w-full rounded-sm border border-white/10 bg-[#101010] px-4 text-sm text-white outline-none focus:border-mir-gold/60"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-mir-gold/75">
                      Preco
                    </span>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(event) => updateProduct("price", event.target.value)}
                      placeholder="189.90"
                      className="h-12 w-full rounded-sm border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-mir-silver/38 focus:border-mir-gold/60"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-mir-gold/75">
                    Descricao
                  </span>
                  <textarea
                    required
                    value={form.description}
                    onChange={(event) => updateProduct("description", event.target.value)}
                    placeholder="Descreva material, acabamento, medidas e diferenciais."
                    rows="4"
                    className="w-full resize-none rounded-sm border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-7 text-white outline-none placeholder:text-mir-silver/38 focus:border-mir-gold/60"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-mir-gold/75">
                    Quantidade disponivel
                  </span>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(event) => updateProduct("stock", event.target.value)}
                    placeholder="1"
                    className="h-12 w-full rounded-sm border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-mir-silver/38 focus:border-mir-gold/60"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex min-h-12 cursor-pointer items-center justify-center gap-3 rounded-sm border border-white/10 px-4 text-sm font-semibold uppercase tracking-[0.16em] text-mir-silver transition hover:border-mir-gold/50 hover:text-mir-gold">
                    <ImageUp size={17} />
                    Foto da joia
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 rounded-sm border border-white/10 px-4 text-sm text-mir-silver">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(event) => updateProduct("featured", event.target.checked)}
                        className="accent-mir-gold"
                      />
                      Destaque
                    </label>
                    <label className="flex items-center gap-3 rounded-sm border border-white/10 px-4 text-sm text-mir-silver">
                      <input
                        type="checkbox"
                        checked={form.soldOut}
                        onChange={(event) => updateProduct("soldOut", event.target.checked)}
                        className="accent-mir-gold"
                      />
                      Esgotado
                    </label>
                  </div>
                </div>

                {form.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {form.images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() =>
                          setForm((currentForm) => ({
                            ...currentForm,
                            images: currentForm.images.filter((_, imageIndex) => imageIndex !== index)
                          }))
                        }
                        className="aspect-square overflow-hidden rounded-sm border border-white/10"
                        title="Remover imagem"
                      >
                        <img src={image} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-2 inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-mir-gold px-5 text-sm font-semibold uppercase tracking-[0.18em] text-mir-black transition hover:bg-[#dfbd6a]"
                >
                  {editingProduct ? <Save size={17} /> : <Plus size={17} />}
                  {editingProduct ? "Salvar alteracoes" : "Adicionar produto"}
                </button>
              </div>
            </form>
          </div>

          <div className="grid gap-6">
            <div className="rounded-sm surface p-5 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-3xl text-white">Promocoes cadastradas</h3>
                <CalendarDays size={18} className="hidden text-mir-gold sm:block" />
              </div>
              <div className="mt-6 grid max-h-[28rem] gap-3 overflow-y-auto pr-1 scrollbar-soft">
                {promotions.length === 0 ? (
                  <div className="rounded-sm border border-white/10 bg-white/[0.03] p-6 text-sm leading-7 text-mir-silver/60">
                    Nenhuma promocao cadastrada ainda.
                  </div>
                ) : (
                  promotions.map((promotion) => {
                    const selectedProducts = products.filter((product) =>
                      (promotion.productIds || []).includes(product.id)
                    );
                    return (
                      <div key={promotion.id} className="rounded-sm border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-display text-2xl text-white">{promotion.name}</h4>
                              <span
                                className={`border px-2 py-1 text-[0.65rem] uppercase tracking-[0.16em] ${
                                  promotion.active
                                    ? "border-mir-gold/35 text-mir-gold"
                                    : "border-white/10 text-mir-silver/35"
                                }`}
                              >
                                {promotion.active ? "Ativa" : "Inativa"}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-mir-silver/55">
                              {promotion.promotionalPrice
                                ? `Preco: ${formatCurrency(promotion.promotionalPrice)}`
                                : `${promotion.discountPercent || 0}% de desconto`}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-mir-silver/38">
                              {promotion.startDate || "sem inicio"} ate {promotion.endDate || "sem fim"}
                            </p>
                          </div>
                          <div className="flex shrink-0 gap-1">
                            <button
                              type="button"
                              onClick={() => togglePromotionActive(promotion.id)}
                              className="grid h-9 w-9 place-items-center rounded-sm border border-white/10 text-mir-silver hover:border-mir-gold/50 hover:text-mir-gold"
                              title={promotion.active ? "Desativar" : "Ativar"}
                            >
                              <Tag size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePromotionEdit(promotion)}
                              className="grid h-9 w-9 place-items-center rounded-sm border border-white/10 text-mir-silver hover:border-mir-gold/50 hover:text-mir-gold"
                              title="Editar"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePromotionRemove(promotion.id)}
                              className="grid h-9 w-9 place-items-center rounded-sm border border-white/10 text-mir-silver hover:border-mir-gold/50 hover:text-mir-gold"
                              title="Excluir"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {selectedProducts.map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => removeProductFromPromotion(promotion.id, product.id)}
                              className="inline-flex items-center gap-2 rounded-sm border border-mir-gold/20 bg-mir-gold/[0.07] px-3 py-2 text-xs text-mir-gold transition hover:border-mir-gold/50"
                              title="Remover produto da promocao"
                            >
                              {product.name}
                              <Trash2 size={12} />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="rounded-sm surface p-5 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-3xl text-white">Produtos cadastrados</h3>
                <div className="hidden items-center gap-2 text-xs uppercase tracking-[0.18em] text-mir-silver/45 sm:flex">
                  <PackageCheck size={16} className="text-mir-gold" />
                  Estoque real
                </div>
              </div>
              <div className="mt-6 grid max-h-[44rem] gap-3 overflow-y-auto pr-1 scrollbar-soft">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="grid grid-cols-[4.75rem_1fr] gap-4 rounded-sm border border-white/10 bg-white/[0.03] p-3"
                  >
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="aspect-square rounded-sm object-cover"
                    />
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="truncate font-display text-xl text-white">{product.name}</h4>
                          <p className="mt-1 text-sm text-mir-silver/62">
                            {formatCurrency(product.price)}
                          </p>
                          <p
                            className={`mt-1 text-xs uppercase tracking-[0.18em] ${
                              isProductUnavailable(product) ? "text-mir-silver/38" : "text-mir-gold/70"
                            }`}
                          >
                            {getStockLabel(product)}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="grid h-9 w-9 place-items-center rounded-sm border border-white/10 text-mir-silver hover:border-mir-gold/50 hover:text-mir-gold"
                            aria-label={`Editar ${product.name}`}
                            title="Editar"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemove(product.id)}
                            className="grid h-9 w-9 place-items-center rounded-sm border border-white/10 text-mir-silver hover:border-mir-gold/50 hover:text-mir-gold"
                            aria-label={`Remover ${product.name}`}
                            title="Remover"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-mir-silver/50">
                        {product.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
