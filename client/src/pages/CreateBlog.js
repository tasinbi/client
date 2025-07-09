import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { generatePreviewSlug, isValidSlug, containsBangla } from '../utils/slugify';
import { useAuth } from '../contexts/AuthContext';
import CategoryManager from '../components/CategoryManager';
import UniversalHeader from '../components/UniversalHeader';
import '../styles/BlogEditor.css';

const CreateBlog = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: '',
    author: '',
    category_id: '',
    meta_keywords: '',
    meta_description: ''
  });
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    // Set author name from logged-in user
    if (user && user.username) {
      setFormData(prev => ({
        ...prev,
        author: user.username
      }));
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryManagerClose = () => {
    setShowCategoryManager(false);
    fetchCategories(); // Refresh categories after closing
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate Bangla-friendly slug from title
    if (name === 'title') {
      const slug = generatePreviewSlug(value);
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    if (image) {
      submitData.append('image', image);
    }

    try {
      await api.post('/blogs', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('Blog created successfully!');
      navigate('/admin');
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating blog');
      console.error('Error creating blog:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-editor-layout">
      <UniversalHeader />
      
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h3>
            <i className="fas fa-plus-circle"></i>
            Create Blog
          </h3>
        </div>
        
        <div className="sidebar-menu">
          <Link to="/admin" className="menu-item">
            <i className="fas fa-tachometer-alt"></i>
            Dashboard
          </Link>
          <Link to="/admin/create" className="menu-item active">
            <i className="fas fa-plus"></i>
            Create New
          </Link>
          <Link to="/admin" className="menu-item">
            <i className="fas fa-list"></i>
            All Blogs
          </Link>
          <button 
            className="menu-item menu-item-button"
            onClick={() => setShowCategoryManager(true)}
          >
            <i className="fas fa-tags"></i>
            All Categories
          </button>
        </div>
        
        <div className="sidebar-actions">
          <button 
            type="button" 
            className="btn-save"
            onClick={handleSubmit}
            disabled={loading}
          >
            <i className="fas fa-save"></i>
            {loading ? 'Saving...' : 'Save Blog'}
          </button>
          
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate('/admin')}
          >
            <i className="fas fa-times"></i>
            Cancel
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <div className="content-header">
          <h1>Create New Blog Post</h1>
          <p>Share your thoughts and experiences with the world</p>
        </div>

        {error && (
          <div className="alert-message error">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        <div className="editor-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                <i className="fas fa-heading"></i>
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter blog title..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug" className="form-label">
                <i className="fas fa-link"></i>
                Slug (URL)
                {containsBangla(formData.slug) && (
                  <span className="bangla-indicator">
                    <i className="fas fa-language"></i>
                    Bangla
                  </span>
                )}
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className={`form-control ${formData.slug && !isValidSlug(formData.slug) ? 'invalid' : ''}`}
                placeholder="blog-url-slug or বাংলা-স্লাগ"
              />
              {formData.slug && (
                <div className="slug-preview">
                  <small className="form-help">
                    <i className="fas fa-eye"></i>
                    Preview: <span className="preview-url">blog.banglayielts.com/{formData.slug}</span>
                  </small>
                </div>
              )}
              {formData.slug && !isValidSlug(formData.slug) && (
                <small className="form-error">
                  <i className="fas fa-exclamation-triangle"></i>
                  Invalid slug format. Use only letters, numbers, and hyphens.
                </small>
              )}
            </div>

            <div className="form-group">
                <label htmlFor="category_id" className="form-label">
                  <i className="fas fa-tag"></i>
                  Category
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
            </div>

            <div className="form-group">
              <label htmlFor="image" className="form-label">
                <i className="fas fa-image"></i>
                Featured Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                className="form-control"
                accept="image/*"
              />
            </div>

            {/* SEO Fields */}
            <div className="seo-section">
              <h3 className="section-title">
                <i className="fas fa-search"></i>
                SEO Settings
              </h3>
              
              <div className="form-group">
                <label htmlFor="meta_keywords" className="form-label">
                  <i className="fas fa-key"></i>
                  Meta Keywords
                </label>
                <input
                  type="text"
                  id="meta_keywords"
                  name="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="keyword1, keyword2, keyword3 (comma separated)"
                />
                <small className="form-help">Enter keywords separated by commas for better SEO</small>
              </div>

              <div className="form-group">
                <label htmlFor="meta_description" className="form-label">
                  <i className="fas fa-file-alt"></i>
                  Meta Description
                </label>
                <textarea
                  id="meta_description"
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                  placeholder="Brief description of your blog post (150-160 characters recommended)"
                  maxLength="160"
                />
                <small className="form-help">
                  {formData.meta_description.length}/160 characters
                </small>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-edit"></i>
                Content
              </label>
              <div className="editor-wrapper">
                <CKEditor
                  editor={ClassicEditor}
                  data={formData.content}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setFormData(prev => ({
                      ...prev,
                      content: data
                    }));
                  }}
                  config={{
                    toolbar: [
                      'heading', '|',
                      'bold', 'italic', 'underline', '|',
                      'link', 'bulletedList', 'numberedList', '|',
                      'outdent', 'indent', '|',
                      'imageUpload', 'blockQuote', 'insertTable', '|',
                      'undo', 'redo'
                    ],
                    placeholder: 'Write your blog content here...'
                  }}
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <CategoryManager
          onClose={handleCategoryManagerClose}
          onCategoryChange={fetchCategories}
        />
      )}
    </div>
  );
};

export default CreateBlog;
