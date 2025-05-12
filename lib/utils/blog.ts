import fs from 'fs';
import path from 'path';

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  image?: string;
  tags?: string[];
};

// This function reads a portion of the file at a time to avoid memory issues
export function getArticles(limit: number = 10, offset: number = 0): BlogPost[] {
  try {
    const articlesFilePath = path.join(process.cwd(), 'articles.txt');
    
    // Read the file in chunks or use a stream for very large files
    // This is a simplified implementation - for production, consider using streams
    const fileContent = fs.readFileSync(articlesFilePath, 'utf-8');
    
    // Try to detect articles based on common patterns
    // Détection automatique des articles avec plusieurs méthodes
    let articles: string[] = [];
    
    // Méthode 1: Recherche de séparations avec "---"
    if (fileContent.includes('\n---\n')) {
      articles = fileContent.split('\n---\n');
    } 
    // Méthode 2: Recherche d'en-têtes avec "#"
    else if (fileContent.match(/\n# /g)) {
      // Split by headings (except the first one if it's at the beginning of the file)
      const firstHeadingMatch = fileContent.match(/^# /);
      if (firstHeadingMatch) {
        // Le premier article commence au début du fichier
        articles = fileContent.split(/\n# /).filter(Boolean);
        if (articles.length > 0) {
          articles[0] = '# ' + articles[0]; // Restaure le "# " pour le premier article
        }
        for (let i = 1; i < articles.length; i++) {
          articles[i] = '# ' + articles[i]; // Restaure le "# " pour les autres articles
        }
      } else {
        // Les articles sont séparés par des nouveaux titres
        articles = fileContent.split(/\n# /).filter(Boolean);
        for (let i = 0; i < articles.length; i++) {
          articles[i] = '# ' + articles[i]; // Restaure le "# "
        }
      }
    }
    // Méthode 3: Recherche de lignes vides consécutives pour séparer des articles
    else if (fileContent.includes('\n\n\n')) {
      articles = fileContent.split(/\n\n\n+/);
    }
    // Méthode 4: Si aucun délimiteur évident n'est trouvé, essayer des séparateurs personnalisés
    else if (fileContent.includes('====================')) {
      articles = fileContent.split(/={10,}/);
    }
    // Méthode 5: Dernier recours - traiter chaque paragraphe comme un article distinct
    else {
      articles = fileContent.split(/\n\n+/);
    }
    
    return articles
      .slice(offset, offset + limit)
      .map((articleText, index) => {
        // Parse article content - adjust based on your format
        const lines = articleText.trim().split('\n');
        
        // Basic parsing - customize according to your file format
        // Essaie de détecter différents formats de titre
        let title: string;
        if (lines[0]?.startsWith('# ')) {
          title = lines[0]?.replace('# ', '');
        } else if (lines[0]?.startsWith('Titre: ')) {
          title = lines[0]?.replace('Titre: ', '');
        } else if (lines[0]?.startsWith('Title: ')) {
          title = lines[0]?.replace('Title: ', '');
        } else {
          title = `Article ${index + offset + 1}`;
        }
        
        // Détecte différents formats de métadonnées
        const dateMatch = articleText.match(/Date: (.+)/i) || 
                          articleText.match(/Date:\s*(.+)/i) ||
                          articleText.match(/Publié le ?: (.+)/i);
                          
        const categoryMatch = articleText.match(/Category: (.+)/i) || 
                              articleText.match(/Catégorie: (.+)/i) || 
                              articleText.match(/Cat(?:é|e)gories?: (.+)/i);
                              
        const tagsMatch = articleText.match(/Tags: (.+)/i) || 
                          articleText.match(/Mots-clés: (.+)/i) || 
                          articleText.match(/Étiquettes: (.+)/i);
        
        // Extract content (everything after metadata)
        // Trouve le contenu après les métadonnées
        const contentStartIndex = lines.findIndex(line => {
          const lowerLine = line.toLowerCase();
          return !lowerLine.startsWith('date:') && 
                 !lowerLine.startsWith('category:') && 
                 !lowerLine.startsWith('catégorie:') && 
                 !lowerLine.startsWith('tags:') && 
                 !lowerLine.startsWith('mots-clés:') && 
                 !lowerLine.startsWith('titre:') && 
                 !lowerLine.startsWith('title:') && 
                 !lowerLine.startsWith('étiquettes:') && 
                 line.trim() !== '' && 
                 !line.startsWith('# ');
        });
        
        // Si le contenu est vide ou non trouvé, utiliser l'ensemble du texte
        const content = contentStartIndex !== -1 
          ? lines.slice(contentStartIndex).join('\n') 
          : articleText;
          
        // Crée un extrait plus intelligent
        const plainTextContent = content.replace(/^#{1,6}\s+.+$/gm, ''); // Retire les titres
        const contentForExcerpt = plainTextContent.substring(0, 500); // Prend plus de texte pour un meilleur extrait
        const excerpt = contentForExcerpt.substring(0, 150) + '...';
        
        return {
          id: (index + offset).toString(),
          slug: title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-'),
          title,
          date: dateMatch?.[1] || new Date().toLocaleDateString(),
          category: categoryMatch?.[1] || 'Non catégorisé',
          excerpt,
          content,
          tags: tagsMatch?.[1]?.split(',').map(t => t.trim()) || [],
        };
      });
  } catch (error) {
    console.error('Error reading articles:', error);
    return [];
  }
}

export function getArticleBySlug(slug: string): BlogPost | null {
  try {
    const articles = getArticles(100); // Get a larger batch to search through
    return articles.find(article => article.slug === slug) || null;
  } catch (error) {
    console.error('Error finding article by slug:', error);
    return null;
  }
}

export function getArticlesByCategory(category: string, limit: number = 10): BlogPost[] {
  try {
    const articles = getArticles(100); // Get a larger batch to filter
    return articles
      .filter(article => article.category.toLowerCase() === category.toLowerCase())
      .slice(0, limit);
  } catch (error) {
    console.error('Error finding articles by category:', error);
    return [];
  }
}

export function getCategories(): { name: string; count: number }[] {
  try {
    const articles = getArticles(100);
    const categories = articles.reduce((acc, article) => {
      const category = article.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category]++;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categories).map(([name, count]) => ({ name, count }));
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

export function searchArticles(query: string): BlogPost[] {
  try {
    const articles = getArticles(100);
    const lowerQuery = query.toLowerCase();
    
    return articles.filter(article => 
      article.title.toLowerCase().includes(lowerQuery) || 
      article.content.toLowerCase().includes(lowerQuery) ||
      article.category.toLowerCase().includes(lowerQuery) ||
      article.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
}
