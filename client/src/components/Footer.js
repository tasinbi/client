import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="modern-footer text-white py-5 mt-5" style={{
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        opacity: 0.1
      }}></div>
      
      <div className="container position-relative">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="footer-section">
              <h5 className="mb-3 d-flex align-items-center">
                <i className="fas fa-blog me-2" style={{ color: '#ffd700' }}></i>
                My Blog
              </h5>
              <p className="text-light mb-3">
                Your favorite blog site - Join us for stories about knowledge, technology, and life experiences.
              </p>
              <div className="social-links">
                <button className="social-link me-3" onClick={() => window.open('https://facebook.com', '_blank')}>
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button className="social-link me-3" onClick={() => window.open('https://twitter.com', '_blank')}>
                  <i className="fab fa-twitter"></i>
                </button>
                <button className="social-link me-3" onClick={() => window.open('https://instagram.com', '_blank')}>
                  <i className="fab fa-instagram"></i>
                </button>
                <button className="social-link" onClick={() => window.open('https://youtube.com', '_blank')}>
                  <i className="fab fa-youtube"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="footer-section">
              <h5 className="mb-3">
                <i className="fas fa-phone me-2" style={{ color: '#ffd700' }}></i>
                Contact
              </h5>
              <div className="contact-info">
                <p className="mb-2">
                  <i className="fas fa-envelope me-2"></i>
                  contact@myblog.com
                </p>
                <p className="mb-2">
                  <i className="fas fa-phone me-2"></i>
                  +880 17123 45678
                </p>
                <p className="mb-2">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4 col-md-12 mb-4">
            <div className="footer-section">
              <h5 className="mb-3">
                <i className="fas fa-envelope me-2" style={{ color: '#ffd700' }}></i>
                Newsletter
              </h5>
              <p className="text-light mb-3">
                Subscribe to get updates on new blog posts.
              </p>
              <div className="newsletter-form">
                <div className="input-group">
                  <input 
                    type="email" 
                    className="form-control rounded-pill newsletter-input" 
                    placeholder="Your email" 
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <button className="btn btn-warning rounded-pill ms-2 px-3" type="button">
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <hr className="border-light opacity-25 my-4" />
        
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0 text-center text-md-start">
              &copy; 2025 My Blog. All rights reserved.
            </p>
          </div>
          <div className="col-md-6">
            <div className="text-center text-md-end">
              <span className="text-warning">
                <i className="fas fa-heart me-1"></i>
                Made in Bangladesh
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
