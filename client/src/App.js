import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import PixelTracking from './components/PixelTracking';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import BlogPost from './pages/BlogPost';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import Home from './pages/Home';
import About from './pages/About';
import RashedHossain from './pages/RashedHossain';
import './styles/Global.css';

function App() {
  useEffect(() => {
    // Scroll animation observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    // Observe all fade-in sections
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    fadeInSections.forEach(section => {
      observer.observe(section);
    });

    // Smooth scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Pixel Tracking - Add your pixel IDs here */}
          <PixelTracking 
            facebookPixelId={process.env.REACT_APP_FACEBOOK_PIXEL_ID}
            googleAnalyticsId={process.env.REACT_APP_GOOGLE_ANALYTICS_ID}
          />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/rashed-hossain" element={<RashedHossain />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/create" element={<PrivateRoute><CreateBlog /></PrivateRoute>} />
              <Route path="/admin/edit/:id" element={<PrivateRoute><EditBlog /></PrivateRoute>} />
              {/* Blog post route - this should be last to catch all remaining slugs */}
              <Route path="/:slug" element={<BlogPost />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
