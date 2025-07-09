import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CategoryManager = ({ onClose, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/categories', { name: newCategoryName.trim() });
      setCategories([...categories, response.data]);
      setNewCategoryName('');
      onCategoryChange && onCategoryChange();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async (categoryId) => {
    if (!editName.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.put(`/categories/${categoryId}`, { name: editName.trim() });
      setCategories(categories.map(cat => 
        cat.id === categoryId ? response.data : cat
      ));
      setEditingCategory(null);
      setEditName('');
      onCategoryChange && onCategoryChange();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.delete(`/categories/${categoryId}`);
      setCategories(categories.filter(cat => cat.id !== categoryId));
      onCategoryChange && onCategoryChange();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (category) => {
    setEditingCategory(category.id);
    setEditName(category.name);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditName('');
  };

  return (
    <div className="category-manager-overlay">
      <div className="category-manager-modal">
        <div className="modal-header">
          <h3>
            <i className="fas fa-tags"></i>
            Category Management
          </h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-content">
          {error && (
            <div className="alert-message error">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}

          {/* Add New Category */}
          <div className="add-category-section">
            <h4>Add New Category</h4>
            <form onSubmit={handleAddCategory} className="add-category-form">
              <div className="form-group">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name..."
                  className="form-control"
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  className="btn-add"
                  disabled={loading || !newCategoryName.trim()}
                >
                  <i className="fas fa-plus"></i>
                  Add
                </button>
              </div>
            </form>
          </div>

          {/* Categories List */}
          <div className="categories-list-section">
            <h4>Existing Categories</h4>
            <div className="categories-list">
              {categories.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-folder-open"></i>
                  <p>No categories found</p>
                </div>
              ) : (
                categories.map(category => (
                  <div key={category.id} className="category-item">
                    {editingCategory === category.id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="form-control"
                          disabled={loading}
                        />
                        <div className="edit-actions">
                          <button 
                            className="btn-save"
                            onClick={() => handleEditCategory(category.id)}
                            disabled={loading || !editName.trim()}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button 
                            className="btn-cancel"
                            onClick={cancelEdit}
                            disabled={loading}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="category-display">
                        <span className="category-name">{category.name}</span>
                        <div className="category-actions">
                          <button 
                            className="btn-edit"
                            onClick={() => startEdit(category)}
                            disabled={loading}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteCategory(category.id)}
                            disabled={loading}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>
            <i className="fas fa-check"></i>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager; 