import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryManager from '../components/CategoryManager';
import UniversalHeader from '../components/UniversalHeader';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalCategories: 0,
    recentBlogs: 0,
    totalViews: 0
  });

  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  useEffect(() => {
    fetchBlogs();
    fetchStats();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs');
      setBlogs(response.data.blogs);
    } catch (error) {
      setError('Error loading blogs');
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalBlogs: 0,
        totalCategories: 0,
        recentBlogs: 0,
        totalViews: 0
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`);
        setBlogs(blogs.filter(blog => blog.id !== id));
        fetchStats();
        alert('Blog deleted successfully');
      } catch (error) {
        alert('Error deleting blog');
        console.error('Error deleting blog:', error);
      }
    }
  };

  const handleCategoryManagerClose = () => {
    setShowCategoryManager(false);
    fetchStats(); // Refresh stats after closing
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <div className="error-content">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Error Loading Dashboard</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            <i className="fas fa-refresh me-2"></i>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <UniversalHeader />
      
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome Back, Admin</h1>
          <p className="welcome-subtitle">Manage your blog content with ease</p>
        </div>
        <div className="quick-actions">
          <Link to="/admin/create" className="quick-action-btn">
            <i className="fas fa-plus"></i>
            <span>New Blog</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-blog"></i>
          </div>
          <div className="stat-content">
            <h3>{formatNumber(stats.totalBlogs)}</h3>
            <p>Total Blogs</p>
          </div>
        </div>
        
        <div className="stat-card categories-stat-card">
          <div className="stat-icon">
            <i className="fas fa-tags"></i>
          </div>
          <div className="stat-content">
            <h3>{formatNumber(stats.totalCategories)}</h3>
            <p>Categories</p>
          </div>
          <div className="stat-action">
            <button 
              className="manage-btn"
              onClick={() => setShowCategoryManager(true)}
              title="Manage Categories"
            >
              <i className="fas fa-cog"></i>
              Manage
            </button>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{formatNumber(stats.recentBlogs)}</h3>
            <p>This Week</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-eye"></i>
          </div>
          <div className="stat-content">
            <h3>{formatNumber(stats.totalViews)}</h3>
            <p>Total Views</p>
          </div>
        </div>
      </div>

      {/* Recent Blogs */}
      <div className="recent-blogs-section">
        <div className="section-header">
          <h2>Recent Blog Posts</h2>
          <Link to="/admin/create" className="create-btn">
            <i className="fas fa-plus"></i>
            Create New
          </Link>
        </div>
        
        <div className="blogs-grid">
          {blogs.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-blog"></i>
              <h3>No blogs yet</h3>
              <p>Start by creating your first blog post</p>
              <Link to="/admin/create" className="btn-primary">
                Create First Blog
              </Link>
            </div>
          ) : (
            blogs.map((blog) => (
              <div key={blog.id} className="blog-card-admin">
                <div className="blog-image">
                  <img
                    src={blog.image ? `http://localhost:5000/uploads/${blog.image}` : 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={blog.title}
                  />
                </div>
                <div className="blog-content">
                  <h3>{blog.title}</h3>
                  <p className="blog-date">
                    {new Date(blog.created_at).toLocaleDateString('en-GB', { 
                              day: '2-digit', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                  </p>
                  <div className="blog-actions">
                    <Link to={`/admin/edit/${blog.id}`} className="btn-edit">
                      <i className="fas fa-edit"></i>
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="btn-delete"
                    >
                      <i className="fas fa-trash"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <CategoryManager
          onClose={handleCategoryManagerClose}
          onCategoryChange={fetchStats}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
