import { useEffect, useState } from 'react';
import { assetUrl } from '../utils/assets';

interface NavbarProps {
  menuOpen: boolean;
  onToggleMenu: () => void;
  currentPage?: 'home' | 'story' | 'feedback';
  onNavigate?: (page: 'home' | 'story' | 'feedback') => void;
  onOpenContact?: () => void;
  onOpenMenu?: () => void;
}

export default function Navbar({
  menuOpen,
  onToggleMenu,
  currentPage = 'home',
  onNavigate,
  onOpenContact,
  onOpenMenu,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) onNavigate('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) onNavigate('story');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFeedbackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) onNavigate('feedback');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="nav-inner">
        <a href="#" className="nav-logo" onClick={handleHomeClick}>
          <img src={assetUrl('img/logo-text.png')} alt="Silvassa" className="nav-logo-text-img" />
        </a>

        <div className="nav-actions">
          <div className="nav-text-links">
            <a
              href="#"
              className={`nav-text-link${currentPage === 'home' ? ' active' : ''}`}
              onClick={handleHomeClick}
            >
              Home
            </a>
            <span className="nav-separator">|</span>
            <a
              href="#"
              className={`nav-text-link${currentPage === 'story' ? ' active' : ''}`}
              onClick={handleStoryClick}
            >
              Our Story
            </a>
            <span className="nav-separator">|</span>
            <a
              href="#foodSection"
              className="nav-text-link"
              onClick={(e) => {
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
              Menu
            </a>
            <span className="nav-separator">|</span>
            <button
              type="button"
              className="nav-text-link nav-btn-reset"
              onClick={onOpenContact}
            >
              Contact
            </button>
            <span className="nav-separator">|</span>
            <a
              href="#"
              className={`nav-text-link${currentPage === 'feedback' ? ' active' : ''}`}
              onClick={handleFeedbackClick}
            >
              Feedback
            </a>
          </div>

          {/* Hamburger — visible on mobile only */}
          <button
            className={`hamburger-btn${menuOpen ? ' open' : ''}`}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={onToggleMenu}
          >
            <span className="ham-line"></span>
            <span className="ham-line"></span>
            <span className="ham-line"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
