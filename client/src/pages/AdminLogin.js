import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials);
    
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="admin-login-page">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-6 col-lg-5">
            {/* Login Card */}
            <div className="login-card fade-in">
              <div className="card-header">
                <div className="login-icon mb-3">
                  <i className="fas fa-shield-alt" style={{fontSize: '3rem'}}></i>
                </div>
                <h3 className="mb-0">Admin Login</h3>
                <p className="mb-0 opacity-75">Access your dashboard</p>
              </div>
              
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger slide-in" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="username" className="form-label">
                      <i className="fas fa-user me-2"></i>
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="username"
                      name="username"
                      value={credentials.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      <i className="fas fa-lock me-2"></i>
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Login
                      </>
                    )}
                  </button>
                </form>

                {/* Back to Home */}
                <div className="text-center">
                  <button 
                    onClick={() => navigate('/')}
                    className="btn btn-outline-secondary"
                  >
                    <i className="fas fa-home me-2"></i>
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
            
            {/* Demo Credentials */}
            <div className="login-demo fade-in mt-4">
              <div className="card">
                <div className="card-body text-center">
                  <h6 className="card-title">
                    <i className="fas fa-info-circle me-2 text-primary"></i>
                    Demo Login Info
                  </h6>
                  <div className="demo-credentials">
                    <div className="credential-item">
                      <strong>Username:</strong> 
                      <span className="badge bg-primary ms-2">admin</span>
                    </div>
                    <div className="credential-item mt-2">
                      <strong>Password:</strong> 
                      <span className="badge bg-secondary ms-2">admin123</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Side Illustration */}
          <div className="col-md-6 d-none d-md-block">
            <div className="login-illustration text-center">
              <img 
                src="https://via.placeholder.com/500x400/667eea/ffffff?text=🔐+SECURE+LOGIN"
                alt="Admin Login"
                className="img-fluid rounded-3 shadow-lg"
                style={{maxWidth: '400px'}}
              />
              <h4 className="mt-4 text-muted">Secure Admin Panel</h4>
              <p className="text-muted">Manage your blog with ease</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-login-page {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
        }

        .admin-login-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,176C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom center;
          background-size: cover;
        }

        .login-card {
          position: relative;
          z-index: 2;
        }

        .login-icon {
          background: rgba(255,255,255,0.2);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .demo-credentials {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          border: 2px dashed #dee2e6;
        }

        .credential-item {
          font-family: 'Courier New', monospace;
        }

        .login-illustration img {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
