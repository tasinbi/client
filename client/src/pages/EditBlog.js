import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../styles/BlogEditor.css';

const EditBlog = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slug: '',
    author: '',
    category_id: ''
  });
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/blogs`);
        const blog = response.data.blogs.find(b => b.id === parseInt(id));
        
        if (blog) {
          setFormData({
            title: blog.title,
            content: blog.content,
            slug: blog.slug,
            author: blog.author,
            category_id: blog.category_id
          });
          setCurrentImage(blog.image);
        }
      } catch (error) {
        setError('Error loading blog');
        console.error('Error fetching blog:', error);
      }
    };

    fetchCategories();
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData(prev => ({
      ...prev,
      content: data
    }));
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
      await axios.put(`http://localhost:5000/api/blogs/${id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('Blog updated successfully!');
      navigate('/admin');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating blog');
      console.error('Error updating blog:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-editor-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h3>
            <i className="fas fa-edit"></i>
            Edit Blog
          </h3>
        </div>
        
        <div className="sidebar-menu">
          <Link to="/admin" className="menu-item">
            <i className="fas fa-tachometer-alt"></i>
            Dashboard
          </Link>
          <Link to="/admin/create" className="menu-item">
            <i className="fas fa-plus"></i>
            Create New
          </Link>
          <Link to="/admin" className="menu-item active">
            <i className="fas fa-list"></i>
            All Blogs
          </Link>
        </div>
        
        <div className="sidebar-actions">
          <button 
            type="button" 
            className="btn-save"
            onClick={handleSubmit}
            disabled={loading}
          >
            <i className="fas fa-save"></i>
            {loading ? 'Updating...' : 'Update Blog'}
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
          <h1>Edit Blog Post</h1>
          <p>Update your blog content and settings</p>
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
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="form-control"
                placeholder="blog-url-slug"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="author" className="form-label">
                  <i className="fas fa-user"></i>
                  Author
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Author name"
                  required
                />
              </div>

              <div className="form-group half">
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
            </div>

            <div className="form-group">
              <label htmlFor="image" className="form-label">
                <i className="fas fa-image"></i>
                Featured Image
              </label>
              {currentImage && (
                <div className="current-image mb-3">
                  <img 
                    src={`http://localhost:5000/uploads/${currentImage}`} 
                    alt="Current" 
                    style={{
                      width: '200px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '2px solid #e9ecef'
                    }}
                  />
                  <p className="text-muted mt-2">Current image</p>
                </div>
              )}
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                className="form-control"
                accept="image/*"
              />
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
    </div>
  );
};

export default EditBlog;
