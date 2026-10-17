import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import CategoryStrip from '../components/CategoryStrip';
import FoodGrid from '../components/FoodGrid';
import WhySilvassa from '../components/WhySilvassa';
import StoryTrust from '../components/StoryTrust';
import CartSidebar from '../components/CartSidebar';
import DetailsModal from '../components/DetailsModal';
import CustomizeModal from '../components/CustomizeModal';
import SuccessModal from '../components/SuccessModal';
import FloatingCartBar from '../components/FloatingCartBar';
import Toast from '../components/Toast';
import type { Cart, CartEnquiryDetails, CategoryFilter, CustomizeState, MenuItem, SizeId } from '../types';
import { getCartTotalPieces } from '../utils/pricing';
import { enquiryService } from '../services/enquiryService';
import { productService } from '../services/productService';

export default function HomePage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Cart>({});

  const [cartOpen, setCartOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const [detailsItemId, setDetailsItemId] = useState<number | string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [customize, setCustomize] = useState<CustomizeState | null>(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const [toast, setToast] = useState({ message: '', show: false });
  const toastTimer = useRef<number | undefined>(undefined);

  // Load real catalog directly from PostgreSQL database via API
  useEffect(() => {
    void productService.listPublic().then((loaded) => {
      setMenuItems(loaded);
      setLoading(false);
    });

    const unsubscribe = productService.subscribe(() => {
      setMenuItems(productService.getMenuItems());
    });
    return unsubscribe;
  }, []);

  const items = useMemo(() => {
    const filtered =
      activeCategory === 'all'
        ? [...menuItems]
        : menuItems.filter((i) => i.cat === activeCategory);
    return filtered.sort((a, b) => Number(Boolean(b.topSelling)) - Number(Boolean(a.topSelling)));
  }, [menuItems, activeCategory]);

  const totalPieces = getCartTotalPieces(cart);
  const detailsItem = menuItems.find((m) => String(m.id) === String(detailsItemId)) ?? null;
  const customizeItem = menuItems.find((m) => String(m.id) === String(customize?.itemId)) ?? null;

  const showToast = useCallback((message: string) => {
    setToast({ message, show: true });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, 2500);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  useEffect(() => {
    document.body.style.overflow = detailsOpen || customizeOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [detailsOpen, customizeOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setDetailsOpen(false);
      setCustomizeOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const openDetails = (id: number | string) => {
    setDetailsItemId(id);
    setDetailsOpen(true);
  };

  const openCustomize = (
    itemId: number | string,
    size: SizeId = 'half',
    qty = 1,
    editingKey: string | null = null,
  ) => {
    setCustomize({ itemId, size, qty: Math.max(1, qty), editingKey });
    setCustomizeOpen(true);
  };

  const selectSizeFromDetails = (id: number | string) => {
    setDetailsOpen(false);
    openCustomize(id, 'half', 1);
  };

  const submitCustomize = () => {
    if (!customize || !customizeItem) return;
    const { itemId, size, qty, editingKey } = customize;
    const newKey = `${itemId}_${size}`;

    setCart((prev) => {
      const next: Cart = { ...prev };
      if (editingKey && editingKey === newKey && next[editingKey]) {
        next[editingKey] = { ...next[editingKey], qty };
        return next;
      }
      if (editingKey) delete next[editingKey];
      next[newKey] = next[newKey]
        ? { ...next[newKey], qty: next[newKey].qty + qty }
        : { id: itemId, size, qty };
      return next;
    });

    const sizeName = size === 'half' ? 'Half' : 'Full';
    const pcs = `${qty} pc${qty > 1 ? 's' : ''}`;
    showToast(
      editingKey
        ? `Updated: ${pcs} (${sizeName}) of ${customizeItem.name}`
        : `Added ${pcs} (${sizeName}) to cart!`,
    );
    setCustomizeOpen(false);
  };

  const increase = (key: string) =>
    setCart((prev) => (prev[key] ? { ...prev, [key]: { ...prev[key], qty: prev[key].qty + 1 } } : prev));

  const decrease = (key: string) =>
    setCart((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      if (next[key].qty <= 1) delete next[key];
      else next[key] = { ...next[key], qty: next[key].qty - 1 };
      return next;
    });

  const remove = (key: string) =>
    setCart((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

  const editCartItem = (key: string) => {
    const entry = cart[key];
    if (entry) openCustomize(entry.id, entry.size, entry.qty, key);
  };

  const confirmOrder = (details: CartEnquiryDetails) => {
    void enquiryService.confirmFromCart(details, cart, menuItems);
    setSuccessOpen(true);
    setCart({});
    setCartOpen(false);
  };

  return (
    <>
      <Hero />
      <CategoryStrip active={activeCategory} onChange={setActiveCategory} />
      {loading ? (
        <section className="section-wrap" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: 16, color: '#4a5568', fontWeight: 600 }}>
            Fetching fresh baked treats from oven...
          </p>
        </section>
      ) : (
        <FoodGrid
          items={items}
          cart={cart}
          onOpenDetails={openDetails}
          onOpenCustomize={(id) => openCustomize(id)}
        />
      )}
      <WhySilvassa />
      <StoryTrust
        onOpenStory={() => {
          navigate('/story');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenFeedback={() => {
          navigate('/feedback');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
      <CartSidebar
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onIncrease={increase}
        onDecrease={decrease}
        onRemove={remove}
        onEdit={editCartItem}
        onConfirm={confirmOrder}
        onToast={showToast}
      />
      <DetailsModal
        open={detailsOpen}
        item={detailsItem}
        onClose={() => setDetailsOpen(false)}
        onSelectSize={selectSizeFromDetails}
      />
      <CustomizeModal
        open={customizeOpen}
        item={customizeItem}
        state={customize}
        onClose={() => setCustomizeOpen(false)}
        onSizeChange={(size) => setCustomize((c) => (c ? { ...c, size } : c))}
        onQtyChange={(qty) => setCustomize((c) => (c ? { ...c, qty } : c))}
        onSubmit={submitCustomize}
      />
      <SuccessModal open={successOpen} onClose={() => setSuccessOpen(false)} />
      <FloatingCartBar
        count={totalPieces}
        onClick={() => setCartOpen(true)}
      />
      <Toast message={toast.message} show={toast.show} />
    </>
  );
}
