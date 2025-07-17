import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { decodeSlug, encodeSlug } from '../utils/slugify';
import '../styles/BlogPost.css';
import '../styles/Sidebar.css';
import UniversalHeader from '../components/UniversalHeader';

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
  const [currentRecentPage, setCurrentRecentPage] = useState(1);
  const [currentCarouselSlide, setCurrentCarouselSlide] = useState(0);
  const recentPostsPerPage = 4;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Decode the slug for API call
        const decodedSlug = decodeSlug(slug);
        const response = await axios.get(`http://localhost:5000/api/blogs/${encodeURIComponent(decodedSlug)}`);
        setBlog(response.data);
        setViews(response.data.views || 0);
        
        // Check if views already incremented for this blog in this session
        const viewedKey = `blog_viewed_${decodedSlug}`;
        const hasViewed = sessionStorage.getItem(viewedKey);
        
        // Increment views count only once per session
        if (!hasViewed) {
          sessionStorage.setItem(viewedKey, 'true');
          try {
            const viewResponse = await axios.post(`http://localhost:5000/api/blogs/${encodeURIComponent(decodedSlug)}/view`);
            if (viewResponse.data.success) {
              setViews(viewResponse.data.views);
            }
          } catch (viewError) {
            console.error('Error incrementing views:', viewError);
          }
        }
      } catch (error) {
        if (error.response?.status === 404) {
        setError('Blog post not found');
        } else {
          setError('Error loading blog post');
        }
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/blogs');
        // Get more blogs for pagination
        setRecentBlogs(response.data.blogs.slice(0, 12));
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

  // Success story carousel data
  const successStories = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop&crop=center",
      title: "Team Success",
      description: "Our team achieved remarkable results through collaboration"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center",
      title: "Individual Excellence",
      description: "Personal growth and professional development success"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=250&fit=crop&crop=center",
      title: "Project Innovation",
      description: "Innovative solutions that transformed our approach"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop&crop=center",
      title: "Business Growth",
      description: "Strategic initiatives that drove exceptional growth"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=250&fit=crop&crop=center",
      title: "Client Satisfaction",
      description: "Delivering exceptional value to our clients"
    }
  ];

  // Recent posts pagination
  const getPaginatedRecentPosts = () => {
    const startIndex = (currentRecentPage - 1) * recentPostsPerPage;
    const endIndex = startIndex + recentPostsPerPage;
    return recentBlogs.slice(startIndex, endIndex);
  };

  // Helper function to truncate title to specified word count
  const truncateTitle = (title, wordCount = 10) => {
    if (!title) return '';
    const words = title.split(' ');
    if (words.length <= wordCount) return title;
    return words.slice(0, wordCount).join(' ') + '...';
  };

  // Helper function to truncate content to specified word count
  const truncateContent = (content, wordCount = 12) => {
    if (!content) return '';
    // Remove HTML tags and decode HTML entities
    const textContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    const words = textContent.split(' ').filter(word => word.trim() !== '');
    if (words.length <= wordCount) return textContent;
    return words.slice(0, wordCount).join(' ') + '...';
  };

  const totalRecentPages = Math.ceil(recentBlogs.length / recentPostsPerPage);

  const nextRecentPage = () => {
    setCurrentRecentPage((prev) => (prev < totalRecentPages ? prev + 1 : prev));
  };

  const prevRecentPage = () => {
    setCurrentRecentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // Carousel navigation
  const nextCarouselSlide = useCallback(() => {
    setCurrentCarouselSlide((prev) => (prev + 1) % successStories.length);
  }, [successStories.length]);

  const prevCarouselSlide = useCallback(() => {
    setCurrentCarouselSlide((prev) => (prev - 1 + successStories.length) % successStories.length);
  }, [successStories.length]);

     // Auto-advance carousel
   useEffect(() => {
     const interval = setInterval(() => {
       nextCarouselSlide();
     }, 4000); // Change slide every 4 seconds

     return () => clearInterval(interval);
   }, [nextCarouselSlide]);

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
                <div className="d-flex gap-3 justify-content-center">
                <Link to="/" className="btn btn-primary btn-lg rounded-pill px-4">
                  <i className="fas fa-home me-2"></i>Go Back Home
                </Link> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page-container mt-4">
      <UniversalHeader />
      
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{blog.title || 'Blog Post'} | Your Blog Name</title>
        <meta name="description" content={blog.meta_description || blog.title} />
        <meta name="keywords" content={blog.meta_keywords || ''} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.meta_description || blog.title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        {blog.image && (
          <meta property="og:image" content={`http://localhost:5000/uploads/${blog.image}`} />
        )}
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.meta_description || blog.title} />
        {blog.image && (
          <meta name="twitter:image" content={`http://localhost:5000/uploads/${blog.image}`} />
        )}
      </Helmet>

      <div className="container-fluid">
        
        {/* Desktop Layout - Hidden on mobile */}
        <div className="row d-none d-md-flex">
          <div className="col-md-12 col-lg-8">
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
                    <span>{new Date(blog.created_at).toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-tag"></i>
                    <span>{blog.category_name || 'Uncategorized'}</span>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {blog.image && (
                <div className="blog-featured-image-container">
                  <div className="featured-image-wrapper">
                    <img 
                      src={`http://localhost:5000/uploads/${blog.image}`} 
                      alt={blog.title}
                      className="featured-img"
                      loading="lazy"
                    />
                   
                  </div>
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
                  <button 
                    className="btn-share facebook"
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                    title="Share on Facebook"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button 
                    className="btn-share twitter"
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`, '_blank')}
                    title="Share on Twitter"
                  >
                    <i className="fab fa-twitter"></i>
                  </button>
                  <button 
                    className="btn-share linkedin"
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    title="Share on LinkedIn"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </button>
                  <button 
                    className="btn-share whatsapp"
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(blog.title + ' - ' + window.location.href)}`, '_blank')}
                    title="Share on WhatsApp"
                  >
                    <i className="fab fa-whatsapp"></i>
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

          {/* Sidebar - Desktop */}
          <div className="col-md-12 col-lg-4">
            <div className="sidebar-professional">
              
              {/* Success Stories Photo Carousel */}
              <div className="sidebar-widget">
                <h4 className="widget-title">
                  <i className="fas fa-trophy me-2"></i>
                  Success Stories
                </h4>
                <div className="success-carousel-container">
                  <div className="success-carousel-wrapper">
                    <div className="success-carousel-slide">
                      <div className="success-story-card">
                        <div className="success-image-container">
                          <img 
                            src={successStories[currentCarouselSlide].image}
                            alt={successStories[currentCarouselSlide].title}
                            className="success-story-image"
                          />
                          <div className="success-overlay">
                            <div className="success-content">
                              <h5>{successStories[currentCarouselSlide].title}</h5>
                              <p>{successStories[currentCarouselSlide].description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      </div>
                    
                    {/* Carousel Navigation */}
                    <div className="carousel-navigation">
                      <button 
                        className="carousel-btn prev-btn" 
                        onClick={prevCarouselSlide}
                        aria-label="Previous slide"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <button 
                        className="carousel-btn next-btn" 
                        onClick={nextCarouselSlide}
                        aria-label="Next slide"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                      </div>
                    
                    {/* Carousel Indicators */}
                    <div className="carousel-indicators">
                      {successStories.map((_, index) => (
                        <button
                          key={index}
                          className={`indicator ${index === currentCarouselSlide ? 'active' : ''}`}
                          onClick={() => setCurrentCarouselSlide(index)}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
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
                  {getPaginatedRecentPosts().map((recentBlog) => (
                    <div key={recentBlog.id} className="recent-post-item">
                      <div className="recent-post-image">
                        <img 
                          src={recentBlog.image ? `http://localhost:5000/uploads/${recentBlog.image}` : 'https://via.placeholder.com/80x60?text=No+Image'} 
                          alt={recentBlog.title}
                        />
                      </div>
                      <div className="recent-post-content">
                        <h6>
                            <Link to={`/${encodeSlug(recentBlog.slug)}`}>{truncateTitle(recentBlog.title, 6)}</Link>
                        </h6>
                          <p className="recent-post-excerpt">
                            {truncateContent(recentBlog.content, 6)}
                          </p>
                        <div className="recent-post-meta">
                          <span className="recent-post-date">
                            <i className="fas fa-calendar me-1"></i>
                            {new Date(recentBlog.created_at).toLocaleDateString('en-GB', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
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
                
                {/* Recent Posts Pagination */}
                {totalRecentPages > 1 && (
                  <div className="recent-posts-pagination">
                    <button 
                      className={`pagination-btn prev-btn ${currentRecentPage === 1 ? 'disabled' : ''}`}
                      onClick={prevRecentPage}
                      disabled={currentRecentPage === 1}
                      aria-label="Previous page"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    
                    <div className="pagination-info">
                      <span className="page-numbers">
                        {currentRecentPage} / {totalRecentPages}
                      </span>
                    </div>
                    
                    <button 
                      className={`pagination-btn next-btn ${currentRecentPage === totalRecentPages ? 'disabled' : ''}`}
                      onClick={nextRecentPage}
                      disabled={currentRecentPage === totalRecentPages}
                      aria-label="Next page"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                )}
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

        {/* Mobile Layout - Hidden on desktop */}
        <div className="d-block d-md-none">
          
          {/* Main Content - Mobile (Full Width) */}
          <div className="row mt-1">
            <div className="col-12">
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
                      <span>{new Date(blog.created_at).toLocaleDateString('en-GB', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-tag"></i>
                      <span>{blog.category_name || 'Uncategorized'}</span>
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                {blog.image && (
                  <div className="blog-featured-image-container">
                    <div className="featured-image-wrapper">
                      <img 
                        src={`http://localhost:5000/uploads/${blog.image}`} 
                        alt={blog.title}
                        className="featured-img"
                        loading="lazy"
                      />
                      <div className="image-overlay">
                        <div className="image-caption">
                          <i className="fas fa-camera"></i>
                          <span>Featured Image</span>
                        </div>
                      </div>
                    </div>
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
                    <button 
                      className="btn-share facebook"
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                      title="Share on Facebook"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </button>
                    <button 
                      className="btn-share twitter"
                      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`, '_blank')}
                      title="Share on Twitter"
                    >
                      <i className="fab fa-twitter"></i>
                    </button>
                    <button 
                      className="btn-share linkedin"
                      onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                      title="Share on LinkedIn"
                    >
                      <i className="fab fa-linkedin-in"></i>
                    </button>
                    <button 
                      className="btn-share whatsapp"
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(blog.title + ' - ' + window.location.href)}`, '_blank')}
                      title="Share on WhatsApp"
                    >
                      <i className="fab fa-whatsapp"></i>
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
          </div>

          {/* Sidebar - Mobile (Full Width Below Content) */}
          <div className="row mt-1">
            <div className="col-12">
              <div className="sidebar-professional">
                
                {/* Success Stories Photo Carousel */}
                <div className="sidebar-widget">
                  <h4 className="widget-title">
                    <i className="fas fa-trophy me-2"></i>
                    Success Stories
                  </h4>
                  <div className="success-carousel-container">
                    <div className="success-carousel-wrapper">
                      <div className="success-carousel-slide">
                        <div className="success-story-card">
                          <div className="success-image-container">
                            <img 
                              src={successStories[currentCarouselSlide].image}
                              alt={successStories[currentCarouselSlide].title}
                              className="success-story-image"
                            />
                            <div className="success-overlay">
                              <div className="success-content">
                                <h5>{successStories[currentCarouselSlide].title}</h5>
                                <p>{successStories[currentCarouselSlide].description}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        </div>
                      
                      {/* Carousel Navigation */}
                      <div className="carousel-navigation">
                        <button 
                          className="carousel-btn prev-btn" 
                          onClick={prevCarouselSlide}
                          aria-label="Previous slide"
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                        <button 
                          className="carousel-btn next-btn" 
                          onClick={nextCarouselSlide}
                          aria-label="Next slide"
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                        </div>
                      
                      {/* Carousel Indicators */}
                      <div className="carousel-indicators">
                        {successStories.map((_, index) => (
                          <button
                            key={index}
                            className={`indicator ${index === currentCarouselSlide ? 'active' : ''}`}
                            onClick={() => setCurrentCarouselSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
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
                    {getPaginatedRecentPosts().map((recentBlog) => (
                      <div key={recentBlog.id} className="recent-post-item">
                        <div className="recent-post-image">
                          <img 
                            src={recentBlog.image ? `http://localhost:5000/uploads/${recentBlog.image}` : 'https://via.placeholder.com/80x60?text=No+Image'} 
                            alt={recentBlog.title}
                          />
                        </div>
                        <div className="recent-post-content">
                          <h6>
                            <Link to={`/${encodeSlug(recentBlog.slug)}`}>{truncateTitle(recentBlog.title, 10)}</Link>
                          </h6>
                          <p className="recent-post-excerpt">
                            {truncateContent(recentBlog.content, 12)}
                          </p>
                          <div className="recent-post-meta">
                            <span className="recent-post-date">
                              <i className="fas fa-calendar me-1"></i>
                              {new Date(recentBlog.created_at).toLocaleDateString('en-GB', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
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
                  
                  {/* Recent Posts Pagination */}
                  {totalRecentPages > 1 && (
                    <div className="recent-posts-pagination">
                      <button 
                        className={`pagination-btn prev-btn ${currentRecentPage === 1 ? 'disabled' : ''}`}
                        onClick={prevRecentPage}
                        disabled={currentRecentPage === 1}
                        aria-label="Previous page"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      
                      <div className="pagination-info">
                        <span className="page-numbers">
                          {currentRecentPage} / {totalRecentPages}
                        </span>
                      </div>
                      
                      <button 
                        className={`pagination-btn next-btn ${currentRecentPage === totalRecentPages ? 'disabled' : ''}`}
                        onClick={nextRecentPage}
                        disabled={currentRecentPage === totalRecentPages}
                        aria-label="Next page"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
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
    </div>
  );
};

export default BlogPost;
