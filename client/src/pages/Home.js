import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/Footer';
import api from '../services/api';
import { encodeSlug } from '../utils/slugify';
import '../styles/Home.css';

const Home = () => {
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Comment out hero slider data and related states
  /*
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef(null);

  // Hero slider data
  const heroSlides = [
    {
      id: 1,
      title: "Welcome to Our Blog",
      subtitle: "Discover amazing stories and insights",
      description: "Explore our collection of articles, tutorials, and insights from industry experts.",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Explore Articles",
      buttonLink: "#blog-section"
    },
    {
      id: 2,
      title: "Latest Technology Trends",
      subtitle: "Stay updated with cutting-edge innovations",
      description: "Get the latest updates on technology, programming, and digital transformation.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Read More",
      buttonLink: "#blog-section"
    },
    {
      id: 3,
      title: "Expert Insights",
      subtitle: "Learn from industry professionals",
      description: "Access exclusive content from experienced professionals and thought leaders.",
      image: "https://images.unsplash.com/photo-1542744095-291d1f67b221?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      buttonText: "Get Started",
      buttonLink: "#blog-section"
    }
  ];

  // Create array with multiple sets of slides for seamless loop
  const allSlides = [...heroSlides, ...heroSlides, ...heroSlides]; // 3 sets of slides
  */

  useEffect(() => {
    fetchPopularBlogs();
    fetchLatestBlogs();
  }, []);

  // Comment out hero slider auto-advance effect
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  */

  const fetchPopularBlogs = async () => {
    try {
      const response = await api.get('/blogs/popular/3');
      setPopularBlogs(response.data || []);
    } catch (error) {
      console.error('Error fetching popular blogs:', error);
      setPopularBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestBlogs = async () => {
    try {
      const response = await api.get('/blogs');
      setLatestBlogs(response.data?.blogs || []);
    } catch (error) {
      console.error('Error fetching latest blogs:', error);
      setLatestBlogs([]);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sanitizeContent = (content) => {
    if (!content || typeof content !== 'string') return 'No content available';
    
    const textContent = content
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
    
    return textContent.length > 0 ? textContent.substring(0, 120) : 'No content available';
  };

  // Pagination functions
  const totalPages = Math.ceil(latestBlogs.length / itemsPerPage);
  
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      if (currentPage < totalPages / 2) {
        endPage = Math.min(totalPages, maxPagesToShow);
      } else {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
      }
    }

    // Add first page if not included
    if (startPage > 1) {
      pageNumbers.push(
        <button key={1} className="pagination-number" onClick={() => goToPage(1)}>1</button>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key="start-ellipsis" className="pagination-ellipsis">...</span>);
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`pagination-number ${currentPage === i ? 'active' : ''}`}
          onClick={() => goToPage(i)}
        >
          {i}
        </button>
      );
    }

    // Add last page if not included
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="end-ellipsis" className="pagination-ellipsis">...</span>);
      }
      pageNumbers.push(
        <button
          key={totalPages}
          className="pagination-number"
          onClick={() => goToPage(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  // Get current page's blogs
  const getCurrentPageBlogs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return latestBlogs.slice(startIndex, endIndex);
  };

  return (
    <div className="homepage">
      <UniversalHeader />
      
      {/* Simple Banner Section */}
      <section className="simple-banner">
        <div className="banner-content">
          <h1>Welcome to Banglay IELTS</h1>
          <p>Your trusted source for IELTS preparation and success</p>
        </div>
      </section>

      {/* Comment out Hero Slider Section */}
      {/*
      <section className="hero-slider">
        <div className="slider-container">
          <div 
            className="slides-wrapper" 
            style={{ 
              transform: `translateX(-${currentSlide * 33.333}%)`,
              width: '300%' // For 3 slides
            }}
          >
            {heroSlides.map((slide, index) => (
              <div key={slide.id} className="slide">
                <div className="slide-image">
                  <img src={slide.image} alt={slide.title} />
                  <div className="slide-overlay"></div>
                </div>
                <div className="slide-content">
                  <div className="container">
                    <div className="slide-text">
                      <h1 className="slide-title">{slide.title}</h1>
                      <h2 className="slide-subtitle">{slide.subtitle}</h2>
                      <p className="slide-description">{slide.description}</p>
                      <a href={slide.buttonLink} className="slide-button">
                        {slide.buttonText}
                        <i className="fas fa-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="slider-controls">
            <button 
              className="slider-btn prev-btn" 
              onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button 
              className="slider-btn next-btn" 
              onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <div className="slider-indicators">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${currentSlide === index ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Popular Articles Section */}
      {popularBlogs.length > 0 && (
        <section className="popular-articles-section">
          <div className="container">
            <div className="section-header">
              <div className="section-title-area">
                <h2 className="section-title">
                  <i className="fas fa-fire"></i>
                  Popular Articles
                </h2>
              </div>
            </div>
            
            <div className="articles-static-grid">
              {popularBlogs.map((blog) => (
                <article key={blog.id} className="article-card">
                  <Link to={`/${encodeSlug(blog.slug || blog.id)}`} className="article-link">
                    <div className="article-image-container">
                      <img
                        src={blog.image ? `http://localhost:5000/uploads/${blog.image}` : 'https://via.placeholder.com/400x250?text=Blog+Image'}
                        alt={blog.title || 'Blog Post'}
                        className="article-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x250/6c757d/ffffff?text=No+Image';
                        }}
                      />
                      <div className="article-overlay"></div>
                    </div>
                    
                    <div className="article-content">
                      <h3 className="article-title">
                        {blog.title && blog.title.trim() !== '' ? blog.title : 'Untitled Post'}
                      </h3>
                      <p className="article-excerpt">
                        {sanitizeContent(blog.content)}...
                      </p>
                      <div className="article-meta">
                        <span className="meta-item">
                          <i className="fas fa-user"></i>
                          {blog.author || 'Unknown Author'}
                        </span>
                        <span className="meta-item">
                          <i className="fas fa-calendar"></i>
                          {formatDate(blog.created_at)}
                        </span>
                        <span className="article-views">
                          <i className="fas fa-eye"></i>
                          {blog.views || 0} views
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles Section */}
      {latestBlogs.length > 0 && (
        <section className="latest-articles-section">
          <div className="container">
            <div className="section-header">
              <div className="section-title-area">
                <h2 className="section-title">
                  <i className="fas fa-clock"></i>
                  Latest Articles
                </h2>
              </div>
            </div>
            
            <div className="articles-static-grid">
              {getCurrentPageBlogs().map((blog) => (
                <article key={blog.id} className="article-card">
                  <Link to={`/${encodeSlug(blog.slug || blog.id)}`} className="article-link">
                    <div className="article-image-container">
                      <img
                        src={blog.image ? `http://localhost:5000/uploads/${blog.image}` : 'https://via.placeholder.com/400x250?text=Blog+Image'}
                        alt={blog.title || 'Blog Post'}
                        className="article-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x250/6c757d/ffffff?text=No+Image';
                        }}
                      />
                      <div className="article-overlay">
                        <div className="article-category">
                          {blog.category_name || 'Uncategorized'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="article-meta-small">
                      <span className="meta-item-small">
                        <i className="fas fa-user"></i>
                        {blog.author || 'Unknown Author'}
                      </span>
                      <span className="meta-item-small">
                        <i className="fas fa-calendar"></i>
                        {formatDate(blog.created_at)}
                      </span>
                    </div>
                    
                    <div className="article-content">
                      <h3 className="article-title">
                        {blog.title && blog.title.trim() !== '' ? blog.title : 'Untitled Post'}
                      </h3>
                      <p className="article-excerpt">
                        {sanitizeContent(blog.content)}...
                      </p>
                      <div className="read-more">
                        Read More <i className="fas fa-arrow-right"></i>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination">
                  <button 
                    className={`pagination-btn prev ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i> Previous
                  </button>

                  <div className="pagination-numbers">
                    {renderPaginationNumbers()}
                  </div>

                  <button 
                    className={`pagination-btn next ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;