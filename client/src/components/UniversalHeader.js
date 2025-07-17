import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/UniversalHeader.css';

const UniversalHeader = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide header when scrolling down, show when scrolling up or at top
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsScrolled(true); // Hide header
      } else {
        setIsScrolled(false); // Show header
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`universal-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="universal-header-container">
        <div className="header-logo-section">
          <Link to="/" onClick={closeMobileMenu}>
            <img src="/banglay-ielts-logo.png" alt="বাংলায় IELTS Logo" className="header-logo-img" />
            <div className="header-brand-text">
              <h1 className="header-brand-title">Banglay IELTS</h1>
            </div>
          </Link>
        </div>
        
        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <nav className={`header-main-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          {isAuthenticated ? (
            // Admin Menu Items
            <>
              <Link to="/" className="nav-item-main" onClick={closeMobileMenu}>Home</Link>
              <Link to="/admin" className="nav-item-main" onClick={closeMobileMenu}>Dashboard</Link>
              <Link to="/admin/create" className="nav-item-main" onClick={closeMobileMenu}>Create Blog</Link>
              <div className="nav-user-info">
                <span className="user-name">{user?.username}</span>
                <button 
                  className="logout-btn"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            // Public Menu Items - Only Home and About
            <>
              <Link to="/" className="nav-item-main" onClick={closeMobileMenu}>Home</Link>
              <Link to="/about" className="nav-item-main" onClick={closeMobileMenu}>About</Link>
            </>
          )}
        </nav>
        
        <div className="header-cta-section">
          {isAuthenticated ? (
            <Link to="/admin/create" className="header-cta-btn" onClick={closeMobileMenu}>
              Create New Post
            </Link>
          ) : (
            <button className="header-cta-btn">
              Get Admission
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default UniversalHeader; 