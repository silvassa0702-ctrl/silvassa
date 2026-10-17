import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MobileMenu from '../components/MobileMenu';
import ContactModal from '../components/ContactModal';

export default function PublicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const currentPage =
    location.pathname === '/story' ? 'story' : location.pathname === '/feedback' ? 'feedback' : 'home';

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const goHomeAndScroll = (hash?: string) => {
    navigate('/');
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  return (
    <>
      <Navbar
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        currentPage={currentPage}
        onNavigate={(page) => {
          if (page === 'home') goHomeAndScroll();
          else navigate(`/${page}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenContact={() => setContactOpen(true)}
        onOpenMenu={() => goHomeAndScroll('foodSection')}
      />
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        currentPage={currentPage}
        onNavigate={(page) => {
          if (page === 'home') goHomeAndScroll();
          else navigate(`/${page}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenContact={() => setContactOpen(true)}
        onOpenMenu={() => goHomeAndScroll('foodSection')}
      />
      <Outlet />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
