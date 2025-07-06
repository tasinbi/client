import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Home.css';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

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
  }, []);

  const filterBlogs = useCallback(() => {
    let filtered = blogs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        (blog.title && blog.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (blog.content && blog.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (blog.author && blog.author.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(blog => blog.category_id === parseInt(selectedCategory));
    }

    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, selectedCategory]);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, selectedCategory, filterBlogs]);

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
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

  return (
    <div className="homepage">
      {/* Hero Slider Section */}
      <section className="hero-slider">
        <div className="slider-container">
          <div className="slides-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
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

      {/* Search and Filter Section */}
      <section className="search-filter-section">
        <div className="container">
          <div className="search-filter-container">
            <div className="search-section">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search articles, authors, or topics..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {searchTerm && (
                  <button 
                    className="clear-search" 
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>
            
            <div className="category-filter">
              <h4>Categories</h4>
              <div className="category-buttons">
                <button
                  className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('')}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategory === category.id.toString() ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category.id.toString())}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Cards Section */}
      <section id="blog-section" className="blog-cards-section">
        <div className="container">
          <div className="section-header">
            <h2>Latest Articles</h2>
            <p>Discover our latest blog posts and insights</p>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading articles...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <h3>No articles found</h3>
              <p>
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'There are currently no blog posts available.'}
              </p>
              {(searchTerm || selectedCategory) && (
                <button 
                  className="btn-clear-filters"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="blog-grid">
              {filteredBlogs.map((blog) => (
                <div key={blog.id} className="blog-card">
                  <Link to={`/blog/${blog.slug || blog.id}`} className="blog-card-link">
                    <div className="blog-card-image">
                      <img
                        src={blog.image ? `http://localhost:5000/uploads/${blog.image}` : 'https://via.placeholder.com/400x250?text=Blog+Image'}
                        alt={blog.title || 'Blog Post'}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x250/6c757d/ffffff?text=No+Image';
                        }}
                      />
                      <div className="blog-card-overlay">
                        <div className="blog-category">
                          {getCategoryName(blog.category_id)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="blog-card-content">
                      <h3 className="blog-card-title">
                        {blog.title && blog.title.trim() !== '' ? blog.title : 'Untitled Post'}
                      </h3>
                      <div className="blog-card-meta">
                        <span className="blog-author">
                          <i className="fas fa-user"></i>
                          {blog.author || 'Unknown Author'}
                        </span>
                        <span className="blog-date">
                          <i className="fas fa-calendar"></i>
                          {formatDate(blog.created_at)}
                        </span>
                      </div>
                      <div className="blog-card-excerpt">
                        {sanitizeContent(blog.content)}...
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
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
