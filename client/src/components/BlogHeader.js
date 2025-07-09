import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/BlogHeader.css';

const BlogHeader = ({ 
  selectedCategory, 
  onCategoryChange, 
  searchTerm, 
  onSearchChange,
  showSearch = true,
  showCategories = true 
}) => {
  const [categories, setCategories] = useState([]);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  return (
    <div className={`blog-header ${isSticky ? 'sticky' : ''}`}>
      <div className="blog-header-container">
        {/* Blog Title Section */}
        <div className="blog-title-section">
          <Link to="/" className="blog-brand">
            <i className="fas fa-newspaper" style={{ color: '#dc2626', fontSize: '1.2rem' }}></i>
            <h1 className="blog-main-title">Articles</h1>
          </Link>
        </div>

        {/* Categories Section */}
        {showCategories && (
          <div className="blog-categories-section">
            <div className="categories-wrapper">
              <button
                className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
                onClick={() => onCategoryChange('')}
              >
                <i className="fas fa-th-large"></i>
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id.toString() ? 'active' : ''}`}
                  onClick={() => onCategoryChange(category.id.toString())}
                >
                  <i className="fas fa-tag"></i>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Section */}
        {showSearch && (
          <div className="blog-search-section">
            <div className="search-wrapper">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  className="clear-search-btn"
                  onClick={() => onSearchChange('')}
                  title="Clear search"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogHeader; 