import { Edit3, ImageUp, LogOut, PackageCheck, Phone, Plus, Save, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { categories } from "../data/initialProducts";
import { formatCurrency } from "../lib/format";
import { getStockLabel, isProductUnavailable } from "../lib/product";
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

export function AdminPanel({ products, setProducts, whatsappNumber, setWhatsappNumber, onLogout }) {
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);

  const editingProduct = useMemo(
    () => products.find((product) => product.id === editingId),
    [editingId, products]
  );

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyProduct);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedProduct = {
      ...form,
      id:
        editingId ||
        `${form.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now()}`,
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

  return (
    <section id="admin" className="relative border-t border-white/10 bg-[#070707] py-24">
      <div className="absolute right-0 top-10 opacity-70">
        <div className="font-display text-[16vw] font-semibold leading-none tracking-[0.12em] text-white/[0.018]">
          MIRVALIS
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.38em] text-mir-gold">Painel</p>
          <h2 className="mt-4 font-display text-5xl font-semibold text-white sm:text-6xl">
            Administração simples
          </h2>
          <p className="mt-5 text-base leading-8 text-mir-silver/64">
            Cadastre, edite, remova produtos e marque itens como esgotados. As alterações ficam
            salvas no navegador por localStorage.
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
                  Este número será usado nos botões de compra e finalização do pedido.
                </p>
              </div>
            </div>
            <label className="mt-5 block">
              <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-mir-gold/75">
                Número com DDI e DDD
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
                  placeholder="Ex.: Anel Solitário Prata 925"
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
                    Preço
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
                  Descrição
                </span>
                <textarea
                  required
                  value={form.description}
                  onChange={(event) => updateProduct("description", event.target.value)}
                  placeholder="Descreva material, acabamento, banho, medidas e diferenciais."
                  rows="4"
                  className="w-full resize-none rounded-sm border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-7 text-white outline-none placeholder:text-mir-silver/38 focus:border-mir-gold/60"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-mir-gold/75">
                  Quantidade disponível
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
                {editingProduct ? "Salvar alterações" : "Adicionar produto"}
              </button>
            </div>
          </form>
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
                <div key={product.id} className="grid grid-cols-[4.75rem_1fr] gap-4 rounded-sm border border-white/10 bg-white/[0.03] p-3">
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
                        <p className={`mt-1 text-xs uppercase tracking-[0.18em] ${
                          isProductUnavailable(product) ? "text-mir-silver/38" : "text-mir-gold/70"
                        }`}>
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
    </section>
  );
}
