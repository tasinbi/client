import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/BlogPost.css';
import '../styles/Sidebar.css';

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [views, setViews] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blogs/${slug}`);
        setBlog(response.data);
        // Simulate views increment
        setViews(Math.floor(Math.random() * 1000) + 100);
      } catch (error) {
        setError('Blog post not found');
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/blogs');
        setRecentBlogs(response.data.blogs.slice(0, 5));
      } catch (error) {
        console.error('Error fetching recent blogs:', error);
      }
    };

    fetchBlog();
    fetchRecentBlogs();
  }, [slug]);

  // Contact form handlers
  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  // Back to top functionality
  useEffect(() => {
    const toggleBackToTop = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', toggleBackToTop);
    return () => window.removeEventListener('scroll', toggleBackToTop);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <div className="spinner-border spinner-border-lg text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-0 shadow-lg">
              <div className="card-body text-center p-5">
                <i className="fas fa-exclamation-triangle text-danger mb-3" style={{ fontSize: '3rem' }}></i>
                <h4 className="text-danger mb-3">Sorry!</h4>
                <p className="text-muted mb-4">{error}</p>
                <Link to="/" className="btn btn-primary btn-lg rounded-pill px-4">
                  <i className="fas fa-home me-2"></i>Go Back Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8">
          <article className="blog-post-professional">
            {/* Blog Title */}
            <div className="blog-title-section">
              <h1 className="blog-title-main">
                {blog.title && blog.title.trim() !== '' ? blog.title : 'Untitled Blog Post'}
              </h1>
              
              {/* Blog Meta Information */}
              <div className="blog-meta-info">
                <div className="meta-item">
                  <i className="fas fa-eye"></i>
                  <span>{views} views</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-user"></i>
                  <span>{blog.author || 'Admin'}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-clock"></i>
                  <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                </div>
                <div className="meta-item">
                  <i className="fas fa-tag"></i>
                  <span>{blog.category_name || 'Uncategorized'}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {blog.image && (
              <div className="blog-featured-image">
                <img 
                  src={`http://localhost:5000/uploads/${blog.image}`} 
                  alt={blog.title}
                  className="featured-img"
                />
              </div>
            )}
            
            {/* Blog Content */}
            <div className="blog-content-main">
              <div dangerouslySetInnerHTML={{ 
                __html: blog.content ? blog.content : '<p>No content available for this blog post.</p>' 
              }} />
            </div>
            
            {/* Share Buttons */}
            <div className="blog-share-section">
              <h5>Share This Post</h5>
              <div className="share-buttons">
                <button className="btn-share facebook">
                  <i className="fab fa-facebook-f"></i>
                  <span>Facebook</span>
                </button>
                <button className="btn-share twitter">
                  <i className="fab fa-twitter"></i>
                  <span>Twitter</span>
                </button>
                <button className="btn-share linkedin">
                  <i className="fab fa-linkedin-in"></i>
                  <span>LinkedIn</span>
                </button>
                <button className="btn-share whatsapp">
                  <i className="fab fa-whatsapp"></i>
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="blog-navigation">
              <Link to="/" className="btn btn-outline-primary">
                <i className="fas fa-arrow-left me-2"></i>
                Back to All Posts
              </Link>
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="sidebar-professional">
            
            {/* Success Stories Photo Carousel */}
            <div className="sidebar-widget">
              <h4 className="widget-title">
                <i className="fas fa-trophy me-2"></i>
                Success Stories
              </h4>
              <div className="sidebar-carousel">
                <div id="successCarousel" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <img 
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop&crop=center" 
                        className="d-block w-100 sidebar-carousel-image" 
                        alt="Team Success"
                      />
                      <div className="carousel-caption">
                        <h6>Team Achievement</h6>
                        <p>Our team exceeded goals by 150%</p>
                      </div>
                    </div>
                    <div className="carousel-item">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center" 
                        className="d-block w-100 sidebar-carousel-image" 
                        alt="Individual Success"
                      />
                      <div className="carousel-caption">
                        <h6>Individual Excellence</h6>
                        <p>Employee of the month recognition</p>
                      </div>
                    </div>
                    <div className="carousel-item">
                      <img 
                        src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=250&fit=crop&crop=center" 
                        className="d-block w-100 sidebar-carousel-image" 
                        alt="Project Success"
                      />
                      <div className="carousel-caption">
                        <h6>Project Milestone</h6>
                        <p>Successfully delivered on time</p>
                      </div>
                    </div>
                    <div className="carousel-item">
                      <img 
                        src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop&crop=center" 
                        className="d-block w-100 sidebar-carousel-image" 
                        alt="Innovation Success"
                      />
                      <div className="carousel-caption">
                        <h6>Innovation Award</h6>
                        <p>Recognized for creative solutions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Blogs */}
            <div className="sidebar-widget">
              <h4 className="widget-title">
                <i className="fas fa-newspaper me-2"></i>
                Recent Posts
              </h4>
              <div className="recent-posts">
                {recentBlogs.map((recentBlog) => (
                  <div key={recentBlog.id} className="recent-post-item">
                    <div className="recent-post-image">
                      <img 
                        src={recentBlog.image ? `http://localhost:5000/uploads/${recentBlog.image}` : 'https://via.placeholder.com/80x60?text=No+Image'} 
                        alt={recentBlog.title}
                      />
                    </div>
                    <div className="recent-post-content">
                      <h6>
                        <Link to={`/blog/${recentBlog.slug}`}>{recentBlog.title}</Link>
                      </h6>
                      <div className="recent-post-meta">
                        <span className="recent-post-date">
                          <i className="fas fa-calendar me-1"></i>
                          {new Date(recentBlog.created_at).toLocaleDateString()}
                        </span>
                        <span className="recent-post-category">
                          <i className="fas fa-tag me-1"></i>
                          {recentBlog.category_name}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="sidebar-widget">
              <h4 className="widget-title">
                <i className="fas fa-envelope me-2"></i>
                Get In Touch
              </h4>
              <form onSubmit={handleContactSubmit} className="contact-form">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    placeholder="Your Name"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    placeholder="Your Email"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="Your Message"
                    className="form-control"
                    rows="4"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  <i className="fas fa-paper-plane me-2"></i>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button 
          className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </div>
  );
};

export default BlogPost;
