const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    console.log('Fetching categories...');
    const [rows] = await db.execute('SELECT * FROM categories ORDER BY name');
    console.log(`Found ${rows.length} categories`);
    res.json(rows);
  } catch (error) {
    console.error('Categories error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create category (Admin only)
router.post('/', authMiddleware, [
  body('name').notEmpty().withMessage('Category name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    const [result] = await db.execute(
      'INSERT INTO categories (name) VALUES (?)',
      [name]
    );

    res.status(201).json({ id: result.insertId, name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update category (Admin only)
router.put('/:id', authMiddleware, [
  body('name').notEmpty().withMessage('Category name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name } = req.body;

    // Check if category exists
    const [existing] = await db.execute('SELECT id FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if name already exists (excluding current category)
    const [duplicate] = await db.execute('SELECT id FROM categories WHERE name = ? AND id != ?', [name, id]);
    if (duplicate.length > 0) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    await db.execute('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    res.json({ id: parseInt(id), name, message: 'Category updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category is being used by any blogs
    const [blogsWithCategory] = await db.execute('SELECT COUNT(*) as count FROM blogs WHERE category_id = ?', [id]);
    if (blogsWithCategory[0].count > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category. It is being used by ${blogsWithCategory[0].count} blog(s).` 
      });
    }

    // Check if category exists
    const [existing] = await db.execute('SELECT id FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await db.execute('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get category by ID (Admin only)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute('SELECT * FROM categories WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
