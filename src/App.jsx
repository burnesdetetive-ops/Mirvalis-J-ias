import { useEffect, useMemo, useState } from "react";
import { Gem, MessageCircle, ShieldCheck } from "lucide-react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Catalog } from "./components/Catalog";
import { ProductCard } from "./components/ProductCard";
import { ProductModal } from "./components/ProductModal";
import { CartDrawer } from "./components/CartDrawer";
import { AdminPanel } from "./components/AdminPanel";
import { AdminLogin } from "./components/AdminLogin";
import { Logo } from "./components/Logo";
import { TrustSection } from "./components/TrustSection";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { CATALOG_VERSION, initialProducts } from "./data/initialProducts";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { getProductStock, isProductUnavailable } from "./lib/product";
import { MIRVALIS_WHATSAPP } from "./lib/whatsapp";
import { ADMIN_ROUTE } from "./lib/adminAuth";

function App() {
  const [products, setProducts] = useLocalStorage("mirvalis-products", initialProducts);
  const [cartItems, setCartItems] = useLocalStorage("mirvalis-cart", []);
  const [whatsappNumber, setWhatsappNumber] = useLocalStorage(
    "mirvalis-whatsapp",
    MIRVALIS_WHATSAPP
  );
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("99999");
  const [adminRoute, setAdminRoute] = useState(() => window.location.hash === ADMIN_ROUTE);
  const [adminAuthenticated, setAdminAuthenticated] = useState(
    () => window.sessionStorage.getItem("mirvalis-admin-auth") === "true"
  );

  useEffect(() => {
    if (window.localStorage.getItem("mirvalis-catalog-version") !== CATALOG_VERSION) {
      setProducts(initialProducts);
      setCartItems([]);
      window.localStorage.setItem("mirvalis-catalog-version", CATALOG_VERSION);
    }
  }, [setCartItems, setProducts]);

  useEffect(() => {
    const handleHashChange = () => {
      setAdminRoute(window.location.hash === ADMIN_ROUTE);
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (adminRoute) {
      window.setTimeout(() => {
        document.getElementById("admin")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, [adminRoute, adminAuthenticated]);

  useEffect(() => {
    if (
      ["5511999999999", "553298107950", "329981077950", "984056901", "32984056901"].includes(
        whatsappNumber
      )
    ) {
      setWhatsappNumber(MIRVALIS_WHATSAPP);
    }
  }, [setWhatsappNumber, whatsappNumber]);

  const normalizedProducts = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        stock: Number.isFinite(Number(product.stock))
          ? Math.max(0, Number(product.stock))
          : product.soldOut
            ? 0
            : 1
      })),
    [products]
  );

  const cartItemsWithStock = useMemo(
    () =>
      cartItems.map((item) => {
        const currentProduct = normalizedProducts.find((product) => product.id === item.id);
        return currentProduct ? { ...item, stock: currentProduct.stock, soldOut: currentProduct.soldOut } : item;
      }),
    [cartItems, normalizedProducts]
  );

  const featuredProducts = normalizedProducts.filter((product) => product.featured).slice(0, 4);

  const cartCount = cartItemsWithStock.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = useMemo(
    () => cartItemsWithStock.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItemsWithStock]
  );

  const navigateTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const addToCart = (product) => {
    if (isProductUnavailable(product)) return;
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, stock: product.stock, quantity: Math.min(item.quantity + 1, getProductStock(product)) }
            : item
        );
      }
      return [...currentItems, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const incrementItem = (id) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== id) return item;
        const currentProduct = normalizedProducts.find((product) => product.id === id) || item;
        return {
          ...item,
          quantity: Math.min(item.quantity + 1, getProductStock(currentProduct)),
          stock: getProductStock(currentProduct)
        };
      })
    );
  };

  const decrementItem = (id) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const handleAdminLogin = () => {
    window.sessionStorage.setItem("mirvalis-admin-auth", "true");
    setAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    window.sessionStorage.removeItem("mirvalis-admin-auth");
    setAdminAuthenticated(false);
    window.location.hash = "";
    navigateTo("inicio");
  };

  const adminExperience = adminRoute ? (
    adminAuthenticated ? (
      <AdminPanel
        products={normalizedProducts}
        setProducts={setProducts}
        whatsappNumber={whatsappNumber}
        setWhatsappNumber={setWhatsappNumber}
        onLogout={handleAdminLogout}
      />
    ) : (
      <AdminLogin onLogin={handleAdminLogin} />
    )
  ) : null;

  return (
    <div className="min-h-screen bg-mir-black text-white">
      <Header cartCount={cartCount} onNavigate={navigateTo} onOpenCart={() => setCartOpen(true)} />
      <Hero onShop={() => navigateTo("catalogo")} />

      <main>
        <TrustSection />

        <section id="destaques" className="relative overflow-hidden py-24 sm:py-28">
          <div className="absolute inset-x-0 top-20 flex justify-center opacity-70">
            <Logo watermark />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.38em] text-mir-gold">Destaques</p>
                <h2 className="mt-4 font-display text-5xl font-semibold text-white sm:text-6xl">
                  Peças de desejo
                </h2>
              </div>
              <p className="max-w-md text-base leading-8 text-mir-silver/62">
                Uma seleção inicial para apresentar a essência MIRVALIS: feminina, limpa e
                silenciosamente luminosa.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addToCart}
                  onView={setSelectedProduct}
                  whatsappNumber={whatsappNumber}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#0b0b0b] py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
            <div className="flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.38em] text-mir-gold">Compra assistida</p>
              <h2 className="mt-4 font-display text-5xl font-semibold leading-tight text-white">
                Do catálogo ao WhatsApp, sem perder o clima de boutique.
              </h2>
              <p className="mt-5 text-base leading-8 text-mir-silver/62">
                A compra acontece com calma: você escolhe, envia o pedido e recebe confirmação
                personalizada antes de finalizar.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Gem, title: "Escolha", text: "Veja categoria, preço e detalhes da joia." },
                { icon: MessageCircle, title: "Converse", text: "Envie a peça pelo WhatsApp com mensagem pronta." },
                { icon: ShieldCheck, title: "Confirme", text: "Receba atendimento e confirmação do pedido." }
              ].map((item) => (
                <div key={item.title} className="rounded-sm border border-white/10 bg-white/[0.03] p-6">
                  <item.icon className="text-mir-gold" size={20} />
                  <h3 className="mt-4 font-display text-2xl text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-mir-silver/68">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Catalog
          products={normalizedProducts}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          query={query}
          setQuery={setQuery}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          onAdd={addToCart}
          onView={setSelectedProduct}
          whatsappNumber={whatsappNumber}
        />

        {adminExperience}
      </main>

      <footer className="border-t border-white/10 bg-mir-black py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <Logo />
          <p className="text-sm text-mir-silver/48">
            MIRVALIS Joias na Prata. Vitrine digital com finalização via WhatsApp.
          </p>
        </div>
      </footer>

      <ProductModal
        product={selectedProduct}
        whatsappNumber={whatsappNumber}
        onClose={() => setSelectedProduct(null)}
        onAdd={addToCart}
      />
      <CartDrawer
        open={cartOpen}
        items={cartItemsWithStock}
        total={cartTotal}
        whatsappNumber={whatsappNumber}
        onClose={() => setCartOpen(false)}
        onIncrement={incrementItem}
        onDecrement={decrementItem}
        onRemove={removeItem}
      />
      <FloatingWhatsApp whatsappNumber={whatsappNumber} />
    </div>
  );
}

export default App;
