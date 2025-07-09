import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import footerLogo from '../banglay-footer-logo-1.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="http://banglayielts.com/" className="footer-logo">
            <img src={footerLogo} alt="Banglay IELTS Logo" />
          </Link>
          <p className="footer-description">
            Banglay IELTS: Your trusted partner for simple, effective, and affordable IELTS preparation. Start your success journey today!
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link youtube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-section">
            <h3>Popular Categories</h3>
            <ul>
              <li><Link to="http://banglayielts.com/online-private-batch">Private Batch Admission</Link></li>
              <li><Link to="http://banglayielts.com/real-mock-test">Real Mock Test</Link></li>
              <li><Link to="http://banglayielts.com/offline-batch">Offline Batch</Link></li>
              <li><Link to="https://banglayielts.com/term-of-use/">Term of use</Link></li>
              <li><Link to="https://banglayielts.com/privacy-policy/">Privacy Policy</Link></li>
              <li><Link to="#">Cookie Policy</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><Link to="#">Help Center</Link></li>
              <li><Link to="#">FAQ</Link></li>
              <li><Link to="#">Contact us</Link></li>
              <li><Link to="#">Forum</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li><Link to="/rashed-hossain">Rashed Hossain</Link></li>
              <li><Link to="https://banglayielts.com/about/">About us</Link></li>
              <li><Link to="#">Careers</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>Copyright © 2023 Banglay IELTS, All right reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
