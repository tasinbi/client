const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all blogs with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [rows] = await db.execute(`
      SELECT b.*, c.name as category_name 
      FROM blogs b 
      LEFT JOIN categories c ON b.category_id = c.id 
      ORDER BY b.created_at DESC 
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const [countRows] = await db.execute('SELECT COUNT(*) as total FROM blogs');
    const total = countRows[0].total;

    res.json({
      blogs: rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const [rows] = await db.execute(`
      SELECT b.*, c.name as category_name 
      FROM blogs b 
      LEFT JOIN categories c ON b.category_id = c.id 
      WHERE b.slug = ?
    `, [slug]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create blog (Admin only)
router.post('/', authMiddleware, upload.single('image'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('category_id').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, slug, author, category_id } = req.body;
    const image = req.file ? req.file.filename : null;

    // Check if slug already exists
    const [existingBlog] = await db.execute('SELECT id FROM blogs WHERE slug = ?', [slug]);
    if (existingBlog.length > 0) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    const [result] = await db.execute(
      'INSERT INTO blogs (title, content, slug, author, category_id, image) VALUES (?, ?, ?, ?, ?, ?)',
      [title, content, slug, author, category_id, image]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      content,
      slug,
      author,
      category_id,
      image,
      message: 'Blog created successfully'
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update blog (Admin only)
router.put('/:id', authMiddleware, upload.single('image'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('category_id').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, content, slug, author, category_id } = req.body;
    const image = req.file ? req.file.filename : null;

    // Check if slug already exists for different blog
    const [existingBlog] = await db.execute('SELECT id FROM blogs WHERE slug = ? AND id != ?', [slug, id]);
    if (existingBlog.length > 0) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    let query = 'UPDATE blogs SET title = ?, content = ?, slug = ?, author = ?, category_id = ?';
    let params = [title, content, slug, author, category_id];

    if (image) {
      query += ', image = ?';
      params.push(image);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.execute(query, params);

    res.json({ message: 'Blog updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete blog (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute('DELETE FROM blogs WHERE id = ?', [id]);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent blogs
router.get('/recent/:limit', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 5;

    const [rows] = await db.execute(`
      SELECT b.*, c.name as category_name 
      FROM blogs b 
      LEFT JOIN categories c ON b.category_id = c.id 
      ORDER BY b.created_at DESC 
      LIMIT ?
    `, [limit]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
