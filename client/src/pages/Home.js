import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UniversalHeader from '../components/UniversalHeader';
import Footer from '../components/Footer';
import api from '../services/api';
import { encodeSlug } from '../utils/slugify';
import '../styles/Home.css';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 6 cards per page
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchPopularBlogs();
  }, []);

  const filterBlogs = useCallback(() => {
    let filtered = blogs;

    // Filter by category
    if (selectedCategory && selectedCategory !== '') {
      filtered = filtered.filter(blog => blog.category_id === parseInt(selectedCategory));
    }

    setFilteredBlogs(filtered);
  }, [blogs, selectedCategory]);

  useEffect(() => {
    filterBlogs();
  }, [blogs, selectedCategory, filterBlogs]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.custom-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs');
      
      if (response.data && response.data.blogs) {
        // Filter out blogs with corrupted or invalid data
        const validBlogs = response.data.blogs.filter(blog => {
          const hasValidTitle = blog.title && 
                               typeof blog.title === 'string' && 
                               blog.title.trim().length > 0 &&
                               !/^[^a-zA-Z0-9\s]+$/.test(blog.title); // Not just special characters
          
          const hasValidContent = blog.content && 
                                 typeof blog.content === 'string' && 
                                 blog.content.trim().length > 0;
          
          // Log problematic entries in development
          if (!hasValidTitle || !hasValidContent) {
            console.warn('Filtering out corrupted blog entry:', blog);
          }
          
          return hasValidTitle && hasValidContent;
        });
        
        setBlogs(validBlogs);
      } else if (Array.isArray(response.data)) {
        setBlogs(response.data);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchPopularBlogs = async () => {
    try {
      const response = await api.get('/blogs/popular/3'); // Get top 3 popular blogs
      setPopularBlogs(response.data || []);
    } catch (error) {
      console.error('Error fetching popular blogs:', error);
      setPopularBlogs([]);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const sanitizeContent = (content) => {
    if (!content || typeof content !== 'string') return 'No content available';
    
    // Remove HTML tags and decode HTML entities
    const textContent = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .trim();
    
    return textContent.length > 0 ? textContent.substring(0, 120) : 'No content available';
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Pagination functions for latest articles
  const nextPage = () => {
    const maxPages = Math.ceil(filteredBlogs.length / itemsPerPage);
    setCurrentPage((prev) => (prev < maxPages ? prev + 1 : prev));
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Get paginated blogs for current page
  const getPaginatedBlogs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBlogs.slice(startIndex, endIndex);
  };

  // Get total pages
  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / itemsPerPage));

  // Pagination rendering logic
  const renderPaginationNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Adjust this to control how many page numbers are shown
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust start and end pages if we're near the beginning or end
    if (endPage - startPage + 1 < maxPagesToShow) {
      if (currentPage < totalPages / 2) {
        endPage = Math.min(totalPages, maxPagesToShow);
      } else {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
      }
    }

    // Add first page if not already shown
    if (startPage > 1) {
      pageNumbers.push(
        <button
          key="first"
          className="pagination-number"
          onClick={() => goToPage(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span key="start-ellipsis" className="pagination-ellipsis">
            ...
          </span>
        );
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

    // Add last page if not already shown
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="end-ellipsis" className="pagination-ellipsis">
            ...
          </span>
        );
      }
      pageNumbers.push(
        <button
          key="last"
          className="pagination-number"
          onClick={() => goToPage(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="homepage">
      <UniversalHeader />
      
      {/* Hero Slider Section */}
      <section className="hero-slider">
        <div className="slider-container">
          <div className="slides-wrapper" style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}>
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
          
          {/* Navigation Controls */}
          <div className="slider-controls">
            <button className="slider-btn prev-btn" onClick={prevSlide}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="slider-btn next-btn" onClick={nextSlide}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          
          {/* Slide Indicators */}
          <div className="slider-indicators">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </section>

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
                <p className="section-subtitle">Most viewed articles from our community</p>
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
                      <div className="article-overlay">
                        <div className="article-category">
                          {getCategoryName(blog.category_id)}
                        </div>
                      </div>
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

      {/* Latest Articles Section with Pagination */}
      <section className="blog-cards-section">
        <div className="container">
          <div className="section-header">
            <div className="section-title-area">
              <h2 className="section-title">
                <i className="fas fa-newspaper"></i> Latest Articles
              </h2>
              <p className="section-subtitle">
                {filteredBlogs.length > 0 
                  ? `Showing ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filteredBlogs.length)} of ${filteredBlogs.length} articles` 
                  : 'No articles found'}
              </p>
            </div>
            
            {/* Category Filter */}
            <div className="section-filters">
              <div className="category-filter">
                <div className={`custom-dropdown ${dropdownOpen ? 'open' : ''}`}>
                  <div 
                    className="dropdown-header" 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span className="dropdown-label">
                      <i className="fas fa-filter"></i> 
                      {selectedCategory 
                        ? categories.find(cat => cat.id === parseInt(selectedCategory))?.name || 'All Categories'
                        : 'All Categories'}
                    </span>
                    <i className={`dropdown-arrow fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
                  </div>
                  {dropdownOpen && (
                    <div className="dropdown-menu">
                      <div 
                        className={`dropdown-item ${!selectedCategory ? 'active' : ''}`} 
                        onClick={() => {
                          handleCategoryChange('');
                          setDropdownOpen(false);
                        }}
                      >
                        <i className="fas fa-list"></i> All Categories
                      </div>
                      {categories.map(category => (
                        <div 
                          key={category.id} 
                          className={`dropdown-item ${selectedCategory === category.id.toString() ? 'active' : ''}`}
                          onClick={() => {
                            handleCategoryChange(category.id.toString());
                            setDropdownOpen(false);
                          }}
                        >
                          <i className={`fas fa-${category.icon || 'tag'}`}></i> {category.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <>
              <div className="latest-blogs-grid">
                {getPaginatedBlogs().map(blog => (
                  <div key={blog.id} className="blog-card">
                    <Link to={`/blog/${encodeSlug(blog.title)}`} className="blog-card-link">
                      <div className="blog-card-image">
                        <img 
                          src={blog.image || '/default-blog-image.png'} 
                          alt={blog.title} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-blog-image.png';
                          }}
                        />
                        <div className="blog-card-overlay"></div>
                      </div>
                      <div className="blog-card-content">
                        <span className="blog-category">
                          {getCategoryName(blog.category_id)}
                        </span>
                        <h3 className="blog-card-title">{blog.title}</h3>
                        <p className="blog-card-excerpt">
                          {sanitizeContent(blog.content)}
                        </p>
                        <div className="blog-card-meta">
                          <span className="blog-date">
                            <i className="fas fa-calendar"></i> {formatDate(blog.created_at)}
                          </span>
                        </div>
                        <div className="blog-card-footer">
                          <span className="read-more">
                            Read More <i className="fas fa-arrow-right"></i>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination Container */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <div className="pagination">
                    <button 
                      className={`pagination-btn prev ${currentPage === 1 ? 'disabled' : ''}`}
                      onClick={prevPage}
                      disabled={currentPage === 1}
                    >
                      <i className="fas fa-chevron-left"></i> Previous
                    </button>

                    <div className="pagination-numbers">
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                          onClick={() => goToPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <button 
                      className={`pagination-btn next ${currentPage === totalPages ? 'disabled' : ''}`}
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <i className="fas fa-box-open"></i>
              <h3>No Articles Found</h3>
              <p>Try adjusting your category filter or check back later.</p>
              {selectedCategory && (
                <button 
                  className="btn-clear-filters"
                  onClick={() => handleCategoryChange('')}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;