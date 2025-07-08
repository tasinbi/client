const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const { generateUniqueSlug, decodeSlug, isValidSlug } = require('../utils/slugify');

const router = express.Router();

// Get dashboard statistics - MUST BE BEFORE /:slug route
router.get('/stats', async (req, res) => {
  try {
    // Get total blogs count
    const [totalBlogsResult] = await db.execute('SELECT COUNT(*) as count FROM blogs');
    const totalBlogs = totalBlogsResult[0].count;

    // Get total categories count
    const [totalCategoriesResult] = await db.execute('SELECT COUNT(*) as count FROM categories');
    const totalCategories = totalCategoriesResult[0].count;

    // Get blogs from this week
    const [weeklyBlogsResult] = await db.execute(`
      SELECT COUNT(*) as count 
      FROM blogs 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);
    const recentBlogs = weeklyBlogsResult[0].count;

    // Get total views
    const [totalViewsResult] = await db.execute('SELECT SUM(views) as total FROM blogs');
    const totalViews = parseInt(totalViewsResult[0].total) || 0;

    res.json({
      totalBlogs,
      totalCategories,
      recentBlogs,
      totalViews
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular blogs by views - MUST BE BEFORE /:slug route
router.get('/popular/:limit', async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 5;

    const [rows] = await db.execute(`
      SELECT b.*, c.name as category_name 
      FROM blogs b 
      LEFT JOIN categories c ON b.category_id = c.id 
      WHERE b.views > 1
      ORDER BY b.views DESC, b.created_at DESC
      LIMIT ?
    `, [limit]);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recent blogs - MUST BE BEFORE /:slug route
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
    let { slug } = req.params;
    
    // Decode URL-encoded Bangla slug
    slug = decodeSlug(slug);

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
    console.error('Get blog by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment views for a blog post
router.post('/:slug/view', async (req, res) => {
  try {
    let { slug } = req.params;
    
    // Decode URL-encoded Bangla slug
    slug = decodeSlug(slug);

    // First check if blog exists
    const [checkRows] = await db.execute('SELECT id FROM blogs WHERE slug = ?', [slug]);
    
    if (checkRows.length === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment views
    await db.execute('UPDATE blogs SET views = views + 1 WHERE slug = ?', [slug]);

    // Get updated views count
    const [updatedRows] = await db.execute('SELECT views FROM blogs WHERE slug = ?', [slug]);
    
    res.json({ 
      success: true, 
      views: updatedRows[0].views,
      message: 'Views incremented successfully' 
    });
  } catch (error) {
    console.error('Increment views error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create blog (Admin only)
router.post('/', authMiddleware, upload.single('image'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('category_id').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, author, category_id, meta_keywords, meta_description } = req.body;
    let { slug } = req.body;
    const image = req.file ? req.file.filename : null;

    // Generate slug from title if not provided or invalid
    if (!slug || !isValidSlug(slug)) {
      slug = await generateUniqueSlug(title, db);
    } else {
      // Check if provided slug already exists
      const [existingBlog] = await db.execute('SELECT id FROM blogs WHERE slug = ?', [slug]);
      if (existingBlog.length > 0) {
        slug = await generateUniqueSlug(title, db);
      }
    }

    const [result] = await db.execute(
      'INSERT INTO blogs (title, content, slug, author, category_id, image, meta_keywords, meta_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, content, slug, author, category_id, image, meta_keywords || null, meta_description || null]
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
  body('author').notEmpty().withMessage('Author is required'),
  body('category_id').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, content, author, category_id, meta_keywords, meta_description } = req.body;
    let { slug } = req.body;
    const image = req.file ? req.file.filename : null;

    // Generate slug from title if not provided or invalid
    if (!slug || !isValidSlug(slug)) {
      slug = await generateUniqueSlug(title, db, id);
    } else {
      // Check if provided slug already exists for different blog
      const [existingBlog] = await db.execute('SELECT id FROM blogs WHERE slug = ? AND id != ?', [slug, id]);
      if (existingBlog.length > 0) {
        slug = await generateUniqueSlug(title, db, id);
      }
    }

    let query = 'UPDATE blogs SET title = ?, content = ?, slug = ?, author = ?, category_id = ?, meta_keywords = ?, meta_description = ?';
    let params = [title, content, slug, author, category_id, meta_keywords || null, meta_description || null];

    if (image) {
      query += ', image = ?';
      params.push(image);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.execute(query, params);

    res.json({ message: 'Blog updated successfully', slug });
  } catch (error) {
    console.error('Update blog error:', error);
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



module.exports = router;
