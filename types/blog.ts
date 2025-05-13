export interface Author {
  name: string;
  avatar?: string;
  role: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  author: Author;
  category: string;
  tags: string[];
  coverImage?: string;
}
