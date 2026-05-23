import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { PromotionsSection } from "./components/PromotionsSection";
import { CATALOG_VERSION, initialProducts } from "./data/initialProducts";
import { useLocalStorage } from "./hooks/useLocalStorage";
import {
  deleteSharedProduct,
  deleteSharedPromotion,
  fetchSharedProducts,
  fetchSharedPromotions,
  saveSharedProduct,
  saveSharedPromotion,
  seedSharedProducts,
  sharedCatalogEnabled
} from "./lib/catalogStore";
import { getProductStock, isProductUnavailable } from "./lib/product";
import { applyPromotionsToProducts } from "./lib/promotions";
import { MIRVALIS_WHATSAPP } from "./lib/whatsapp";
import { ADMIN_ROUTE } from "./lib/adminAuth";

const LOCAL_PRODUCTS_KEY = "mirvalis-products";
const LOCAL_PROMOTIONS_KEY = "mirvalis-promotions";
const LOCAL_CATALOG_VERSION_KEY = "mirvalis-catalog-version";

function readLocalCatalog() {
  try {
    if (window.localStorage.getItem(LOCAL_CATALOG_VERSION_KEY) !== CATALOG_VERSION) {
      window.localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(initialProducts));
      window.localStorage.setItem(LOCAL_PROMOTIONS_KEY, JSON.stringify([]));
      window.localStorage.setItem(LOCAL_CATALOG_VERSION_KEY, CATALOG_VERSION);
      return { products: initialProducts, promotions: [] };
    }

    return {
      products: JSON.parse(window.localStorage.getItem(LOCAL_PRODUCTS_KEY) || "null") || initialProducts,
      promotions: JSON.parse(window.localStorage.getItem(LOCAL_PROMOTIONS_KEY) || "[]")
    };
  } catch {
    return { products: initialProducts, promotions: [] };
  }
}

function saveLocalCatalog(products, promotions) {
  window.localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  window.localStorage.setItem(LOCAL_PROMOTIONS_KEY, JSON.stringify(promotions));
  window.localStorage.setItem(LOCAL_CATALOG_VERSION_KEY, CATALOG_VERSION);
}

function App() {
  const localCatalog = readLocalCatalog();
  const [products, setProducts] = useState(localCatalog.products);
  const [promotions, setPromotions] = useState(localCatalog.promotions);
  const productsRef = useRef(localCatalog.products);
  const promotionsRef = useRef(localCatalog.promotions);
  const [catalogStatus, setCatalogStatus] = useState({
    loading: sharedCatalogEnabled,
    error: "",
    shared: sharedCatalogEnabled
  });
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
    productsRef.current = products;
  }, [products]);

  useEffect(() => {
    promotionsRef.current = promotions;
  }, [promotions]);

  const loadCatalog = useCallback(async ({ quiet = false } = {}) => {
    if (!sharedCatalogEnabled) {
      const localData = readLocalCatalog();
      setProducts(localData.products);
      setPromotions(localData.promotions);
      setCatalogStatus({
        loading: false,
        error: "Supabase nao configurado. Usando dados locais deste navegador.",
        shared: false
      });
      return;
    }

    if (!quiet) {
      setCatalogStatus((current) => ({ ...current, loading: true, error: "", shared: true }));
    }

    try {
      let remoteProducts = await fetchSharedProducts();
      if (remoteProducts.length === 0) {
        remoteProducts = await seedSharedProducts(initialProducts);
      }
      const remotePromotions = await fetchSharedPromotions();
      setProducts(remoteProducts);
      setPromotions(remotePromotions);
      setCatalogStatus({ loading: false, error: "", shared: true });
    } catch (error) {
      const localData = readLocalCatalog();
      setProducts(localData.products);
      setPromotions(localData.promotions);
      setCatalogStatus({
        loading: false,
        error: `Nao foi possivel carregar o Supabase. Fallback local ativo: ${error.message}`,
        shared: false
      });
    }
  }, []);

  useEffect(() => {
    loadCatalog();
    if (!sharedCatalogEnabled) return undefined;

    const interval = window.setInterval(() => {
      loadCatalog({ quiet: true });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [loadCatalog]);

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

  const promotedProducts = useMemo(
    () => applyPromotionsToProducts(normalizedProducts, promotions),
    [normalizedProducts, promotions]
  );

  const cartItemsWithStock = useMemo(
    () =>
      cartItems.map((item) => {
        const currentProduct = promotedProducts.find((product) => product.id === item.id);
        return currentProduct
          ? {
              ...item,
              ...currentProduct,
              quantity: item.quantity
            }
          : item;
      }),
    [cartItems, promotedProducts]
  );

  const featuredProducts = promotedProducts.filter((product) => product.featured).slice(0, 4);
  const promotionProducts = promotedProducts.filter((product) => product.promotion).slice(0, 4);

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
        const currentProduct = promotedProducts.find((product) => product.id === id) || item;
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

  const persistLocalSnapshot = (nextProducts = productsRef.current, nextPromotions = promotionsRef.current) => {
    if (!sharedCatalogEnabled) {
      saveLocalCatalog(nextProducts, nextPromotions);
    }
  };

  const handleSaveProduct = async (product, { editing = false } = {}) => {
    const nextProducts = editing
      ? productsRef.current.map((currentProduct) => (currentProduct.id === product.id ? product : currentProduct))
      : [product, ...productsRef.current];

    setProducts(nextProducts);
    persistLocalSnapshot(nextProducts);

    if (sharedCatalogEnabled) {
      try {
        await saveSharedProduct(product);
        await loadCatalog({ quiet: true });
      } catch (error) {
        setCatalogStatus((current) => ({ ...current, error: error.message, shared: false }));
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    const nextProducts = productsRef.current.filter((product) => product.id !== id);
    const nextPromotions = promotionsRef.current.map((promotion) => ({
      ...promotion,
      productIds: (promotion.productIds || []).filter((productId) => productId !== id)
    }));

    setProducts(nextProducts);
    setPromotions(nextPromotions);
    persistLocalSnapshot(nextProducts, nextPromotions);

    if (sharedCatalogEnabled) {
      try {
        await deleteSharedProduct(id);
        await Promise.all(nextPromotions.map((promotion) => saveSharedPromotion(promotion)));
        await loadCatalog({ quiet: true });
      } catch (error) {
        setCatalogStatus((current) => ({ ...current, error: error.message, shared: false }));
      }
    }
  };

  const handleSavePromotion = async (promotion, { editing = false } = {}) => {
    const nextPromotions = editing
      ? promotionsRef.current.map((currentPromotion) =>
          currentPromotion.id === promotion.id ? promotion : currentPromotion
        )
      : [promotion, ...promotionsRef.current];

    setPromotions(nextPromotions);
    persistLocalSnapshot(productsRef.current, nextPromotions);

    if (sharedCatalogEnabled) {
      try {
        await saveSharedPromotion(promotion);
        await loadCatalog({ quiet: true });
      } catch (error) {
        setCatalogStatus((current) => ({ ...current, error: error.message, shared: false }));
      }
    }
  };

  const handleDeletePromotion = async (id) => {
    const nextPromotions = promotionsRef.current.filter((promotion) => promotion.id !== id);

    setPromotions(nextPromotions);
    persistLocalSnapshot(productsRef.current, nextPromotions);

    if (sharedCatalogEnabled) {
      try {
        await deleteSharedPromotion(id);
        await loadCatalog({ quiet: true });
      } catch (error) {
        setCatalogStatus((current) => ({ ...current, error: error.message, shared: false }));
      }
    }
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
        promotions={promotions}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onSavePromotion={handleSavePromotion}
        onDeletePromotion={handleDeletePromotion}
        catalogStatus={catalogStatus}
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

        <PromotionsSection
          products={promotionProducts}
          onAdd={addToCart}
          onView={setSelectedProduct}
          whatsappNumber={whatsappNumber}
          onSeeAll={() => navigateTo("catalogo")}
        />

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
          products={promotedProducts}
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
