import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-professional fixed-top ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand-professional" to="/">
          <div className="brand-logo">
            <i className="fas fa-blog"></i>
          </div>
          <div className="brand-text">
            <h3 className="brand-title">BlogHub</h3>
            <span className="brand-subtitle">Professional Blog Platform</span>
          </div>
        </Link>
        
        <button 
          className="navbar-toggler-professional" 
          type="button" 
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav-professional">
            <li className="nav-item-professional">
              <Link className="nav-link-professional" to="/" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-home nav-icon"></i>
                <span>Home</span>
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-item-professional">
                  <Link className="nav-link-professional" to="/admin" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-tachometer-alt nav-icon"></i>
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li className="nav-item-professional">
                  <Link className="nav-link-professional" to="/admin/create" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-plus-circle nav-icon"></i>
                    <span>Create Blog</span>
                  </Link>
                </li>
                <li className="nav-item-professional user-info">
                  <div className="user-avatar">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <div className="user-details">
                    <span className="user-name">{user?.username}</span>
                    <span className="user-role">Admin</span>
                  </div>
                </li>
                <li className="nav-item-professional">
                  <button 
                    className="btn-logout-professional" 
                    onClick={logout}
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : null}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
