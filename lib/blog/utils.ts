/**
 * Generates a URL-friendly slug from a given string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single one
    .trim();
}

/**
 * Creates a concise excerpt from a longer text
 */
export function createExcerpt(text: string, maxLength = 160): string {
  // Remove HTML tags
  const strippedText = text.replace(/<[^>]+>/g, '');
  
  if (strippedText.length <= maxLength) {
    return strippedText;
  }
  
  // Find the last space before maxLength
  const lastSpace = strippedText.substring(0, maxLength).lastIndexOf(' ');
  
  // Cut at the last space or at maxLength if no space is found
  const excerpt = strippedText.substring(0, lastSpace > 0 ? lastSpace : maxLength);
  
  return excerpt + '...';
}

/**
 * Calculates the estimated reading time for a given text
 */
export function calculateReadingTime(content: string): number {
  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200;
  
  // Remove HTML tags
  const strippedText = content.replace(/<[^>]+>/g, '');
  
  // Count words (approximate method)
  const words = strippedText.trim().split(/\s+/).length;
  
  // Calculate time in minutes
  const readingTime = Math.ceil(words / wordsPerMinute);
  
  // Return at least 1 minute
  return Math.max(1, readingTime);
}

/**
 * Formats a date string or Date object into a human-readable format
 */
export function formatDate(date: string | Date | null): string {
  if (!date) return '';
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date(date).toLocaleDateString('fr-FR', options);
}

/**
 * Validates post fields and returns validation errors if any
 */
export function validatePostFields(fields: { 
  title?: string; 
  content?: string; 
  slug?: string;
}) {
  const errors: Record<string, string> = {};
  
  if (!fields.title || fields.title.trim() === '') {
    errors.title = 'Le titre est requis';
  }
  
  if (!fields.content || fields.content.trim() === '') {
    errors.content = 'Le contenu est requis';
  }
  
  if (fields.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.slug)) {
    errors.slug = 'Le slug doit contenir uniquement des lettres minuscules, des chiffres et des tirets';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Truncates a string to a specified length
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
}
