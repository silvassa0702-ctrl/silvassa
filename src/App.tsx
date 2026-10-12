import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import MobileMenu from './components/MobileMenu';
import Hero from './components/Hero';
import CategoryStrip from './components/CategoryStrip';
import FoodGrid from './components/FoodGrid';
import WhySilvassa from './components/WhySilvassa';
import StoryTrust from './components/StoryTrust';
import OurStoryPage from './components/OurStoryPage';
import FeedbackPage from './components/FeedbackPage';
import CartSidebar from './components/CartSidebar';
import DetailsModal from './components/DetailsModal';
import CustomizeModal from './components/CustomizeModal';
import SuccessModal from './components/SuccessModal';
import ContactModal from './components/ContactModal';
import FloatingCartBar from './components/FloatingCartBar';
import Toast from './components/Toast';
import { MENU } from './data/menu';
import type { Cart, CategoryFilter, CustomizeState, SizeId } from './types';
import { getCartTotalPieces } from './utils/pricing';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'story' | 'feedback'>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [cart, setCart] = useState<Cart>({});

  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Modals keep their last item so content doesn't vanish during the close animation
  const [detailsItemId, setDetailsItemId] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [customize, setCustomize] = useState<CustomizeState | null>(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const [toast, setToast] = useState({ message: '', show: false });
  const toastTimer = useRef<number | undefined>(undefined);

  // ── Derived data ──
  const items = useMemo(() => {
    const filtered =
      activeCategory === 'all' ? [...MENU] : MENU.filter((i) => i.cat === activeCategory);
    // Top selling items first (sort is stable)
    return filtered.sort((a, b) => Number(Boolean(b.topSelling)) - Number(Boolean(a.topSelling)));
  }, [activeCategory]);

  const totalPieces = getCartTotalPieces(cart);
  const detailsItem = MENU.find((m) => m.id === detailsItemId) ?? null;
  const customizeItem = MENU.find((m) => m.id === customize?.itemId) ?? null;

  // ── Toast ──
  const showToast = useCallback((message: string) => {
    setToast({ message, show: true });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, 2500);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  // ── Lock page scroll while a modal / drawer is open ──
  useEffect(() => {
    document.body.style.overflow = detailsOpen || customizeOpen || menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [detailsOpen, customizeOpen, menuOpen]);

  // ── Escape closes whatever is open ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setDetailsOpen(false);
      setCustomizeOpen(false);
      setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // ── Details / customize modal handlers ──
  const openDetails = (id: number) => {
    setDetailsItemId(id);
    setDetailsOpen(true);
  };

  const openCustomize = (itemId: number, size: SizeId = 'half', qty = 1, editingKey: string | null = null) => {
    setCustomize({ itemId, size, qty: Math.max(1, qty), editingKey });
    setCustomizeOpen(true);
  };

  const selectSizeFromDetails = (id: number) => {
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

  // ── Cart handlers ──
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

  const confirmOrder = () => {
    setSuccessOpen(true);
    setCart({});
    setCartOpen(false);
  };

  return (
    <>
      <Navbar
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onOpenContact={() => setContactOpen(true)}
      />
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onOpenContact={() => setContactOpen(true)}
      />

      {currentPage === 'story' ? (
        <OurStoryPage
          onBack={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onGoFeedback={() => {
            setCurrentPage('feedback');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentPage === 'feedback' ? (
        <FeedbackPage
          onBack={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSubmitSuccess={() => {
            showToast('Feedback submitted successfully! Thank you ❤️');
          }}
        />
      ) : (
        <>
          <Hero />
          <CategoryStrip active={activeCategory} onChange={setActiveCategory} />
          <FoodGrid items={items} cart={cart} onOpenDetails={openDetails} onOpenCustomize={(id) => openCustomize(id)} />
          <WhySilvassa />
          <StoryTrust
            onOpenStory={() => {
              setCurrentPage('story');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenFeedback={() => {
              setCurrentPage('feedback');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}

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
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      <FloatingCartBar count={totalPieces} onClick={() => setCartOpen(true)} />
      <Toast message={toast.message} show={toast.show} />
    </>
  );
}
