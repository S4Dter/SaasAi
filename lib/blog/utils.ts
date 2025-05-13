/**
 * Helper functions for blog-related operations
 */

/**
 * Generates a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Formats a date using Intl.DateTimeFormat
 */
export function formatDate(date: string | Date, locale = 'fr-FR'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Creates an excerpt from post content
 */
export function createExcerpt(content: string, maxLength = 160): string {
  // Remove HTML tags
  const textOnly = content.replace(/<\/?[^>]+(>|$)/g, '');
  
  if (textOnly.length <= maxLength) {
    return textOnly;
  }
  
  // Find the last space before maxLength
  const lastSpace = textOnly.lastIndexOf(' ', maxLength);
  return textOnly.substring(0, lastSpace) + '...';
}

/**
 * Calculates estimated reading time
 */
export function calculateReadingTime(content: string): number {
  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200;
  // Remove HTML tags and count words
  const textOnly = content.replace(/<\/?[^>]+(>|$)/g, '');
  const wordCount = textOnly.split(/\s+/).length;
  
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Gets post status display label
 */
export function getPostStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    'draft': 'Brouillon',
    'published': 'Publié',
  };
  
  return statusMap[status] || status;
}

/**
 * Validates if required post fields are filled
 */
export function validatePostFields(data: any): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  
  if (!data.title || data.title.trim() === '') {
    errors.title = 'Le titre est requis';
  }
  
  if (!data.content || data.content.trim() === '') {
    errors.content = 'Le contenu est requis';
  }
  
  if (!data.slug || data.slug.trim() === '') {
    errors.slug = 'Le slug est requis';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Formats file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}
