// Frontend Bangla slug utility functions

// Create Bangla-friendly slug from title
export const createBanglaSlug = (title) => {
  if (!title || typeof title !== 'string') {
    return '';
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

  // Ensure slug is not too long (max 200 characters)
  if (slug.length > 200) {
    slug = slug.substring(0, 200).replace(/-[^-]*$/, '');
  }

  return slug;
};

// Validate slug format
export const isValidSlug = (slug) => {
  if (!slug || typeof slug !== 'string') return false;
  
  // Check length
  if (slug.length < 1 || slug.length > 200) return false;
  
  // Check format: should contain only Bangla chars, English letters, numbers, and hyphens
  const slugRegex = /^[\u0980-\u09FF\w-]+$/;
  return slugRegex.test(slug);
};

// URL encode slug for safe transmission
export const encodeSlug = (slug) => {
  try {
    return encodeURIComponent(slug);
  } catch (error) {
    console.error('Error encoding slug:', error);
    return slug;
  }
};

// URL decode slug
export const decodeSlug = (encodedSlug) => {
  try {
    return decodeURIComponent(encodedSlug);
  } catch (error) {
    console.error('Error decoding slug:', error);
    return encodedSlug;
  }
};

// Generate preview slug as user types
export const generatePreviewSlug = (title) => {
  const slug = createBanglaSlug(title);
  return slug || 'untitled-post';
};

// Check if slug contains Bangla characters
export const containsBangla = (text) => {
  const banglaRegex = /[\u0980-\u09FF]/;
  return banglaRegex.test(text);
};

// Format slug for display (decode if needed)
export const formatSlugForDisplay = (slug) => {
  if (!slug) return '';
  
  try {
    // Try to decode in case it's URL encoded
    const decoded = decodeURIComponent(slug);
    return decoded;
  } catch (error) {
    return slug;
  }
}; 