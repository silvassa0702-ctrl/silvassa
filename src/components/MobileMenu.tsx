import Icon from './Icon';
import { assetUrl } from '../utils/assets';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  currentPage?: 'home' | 'story' | 'feedback';
  onNavigate?: (page: 'home' | 'story' | 'feedback') => void;
  onOpenContact?: () => void;
  onOpenMenu?: () => void;
}

export default function MobileMenu({
  open,
  onClose,
  currentPage = 'home',
  onNavigate,
  onOpenContact,
  onOpenMenu,
}: MobileMenuProps) {
  const handleNavigate = (page: 'home' | 'story' | 'feedback') => {
    if (onNavigate) onNavigate(page);
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className={`mobile-menu-overlay${open ? ' active' : ''}`} onClick={onClose}></div>
      <div className={`mobile-menu-drawer${open ? ' open' : ''}`} aria-hidden={!open}>
        <div className="mobile-menu-header">
          <img src={assetUrl('img/logo-text.png')} alt="Silvassa" className="mobile-menu-logo" />
          <button className="mobile-menu-close" aria-label="Close menu" onClick={onClose}>
            <Icon name="x-lg" />
          </button>
        </div>
        <nav className="mobile-menu-nav">
          <a
            href="#"
            className={`mobile-menu-link${currentPage === 'home' ? ' active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavigate('home');
            }}
          >
            <Icon name="house-fill" /> Home
          </a>
          <a
            href="#"
            className={`mobile-menu-link${currentPage === 'story' ? ' active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavigate('story');
            }}
          >
            <Icon name="chat-heart-fill" /> Our Story
          </a>
          <a
            href="#foodSection"
            className="mobile-menu-link"
            onClick={(e) => {
              onClose();
              if (currentPage !== 'home' || onOpenMenu) {
                e.preventDefault();
                if (onOpenMenu) onOpenMenu();
                else if (onNavigate) {
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('foodSection')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }
            }}
          >
            <Icon name="grid-fill" /> Menu
          </a>
          <button
            type="button"
            className="mobile-menu-link mobile-btn-reset"
            onClick={() => {
              onClose();
              if (onOpenContact) onOpenContact();
            }}
          >
            <Icon name="telephone-fill" /> Contact
          </button>
          <a
            href="#"
            className={`mobile-menu-link${currentPage === 'feedback' ? ' active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavigate('feedback');
            }}
          >
            <Icon name="pencil-square" /> Feedback
          </a>
        </nav>
        <div className="mobile-menu-footer">
          <p>Baked fresh. Delivered with love. 🍰</p>
        </div>
      </div>
    </>
  );
}
