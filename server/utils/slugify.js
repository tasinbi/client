const crypto = require('crypto');

// Bangla slug generation utility
const createBanglaSlug = (title) => {
  if (!title || typeof title !== 'string') {
    return `post-${Date.now()}`;
  }

  let slug = title
    .toLowerCase()
    .trim()
    // Keep Bangla characters (U+0980 to U+09FF), English letters, numbers, spaces, and hyphens
    .replace(/[^\u0980-\u09FF\w\s-]/g, '')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Replace spaces with hyphens
    .replace(/\s/g, '-')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');

  // If slug is empty after processing, generate a fallback
  if (!slug || slug.length === 0) {
    slug = `post-${Date.now()}`;
  }

  // Ensure slug is not too long (max 200 characters)
  if (slug.length > 200) {
    slug = slug.substring(0, 200).replace(/-[^-]*$/, '');
  }

  return slug;
};

// Generate unique slug by checking database
const generateUniqueSlug = async (title, db, excludeId = null) => {
  let baseSlug = createBanglaSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    try {
      let query = 'SELECT id FROM blogs WHERE slug = ?';
      let params = [slug];
      
      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }

      const [rows] = await db.execute(query, params);
      
      if (rows.length === 0) {
        return slug;
      }
      
      // If slug exists, append counter
      slug = `${baseSlug}-${counter}`;
      counter++;
      
      // Prevent infinite loop
      if (counter > 1000) {
        slug = `${baseSlug}-${Date.now()}`;
        break;
      }
    } catch (error) {
      console.error('Error checking slug uniqueness:', error);
      // Fallback to timestamp-based slug
      return `${baseSlug}-${Date.now()}`;
    }
  }

  return slug;
};

// Validate slug format
const isValidSlug = (slug) => {
  if (!slug || typeof slug !== 'string') return false;
  
  // Check length
  if (slug.length < 1 || slug.length > 200) return false;
  
  // Check format: should contain only Bangla chars, English letters, numbers, and hyphens
  const slugRegex = /^[\u0980-\u09FF\w-]+$/;
  return slugRegex.test(slug);
};

// URL encode slug for safe transmission
const encodeSlug = (slug) => {
  return encodeURIComponent(slug);
};

// URL decode slug
const decodeSlug = (encodedSlug) => {
  try {
    return decodeURIComponent(encodedSlug);
  } catch (error) {
    console.error('Error decoding slug:', error);
    return encodedSlug;
  }
};

module.exports = {
  createBanglaSlug,
  generateUniqueSlug,
  isValidSlug,
  encodeSlug,
  decodeSlug
}; 