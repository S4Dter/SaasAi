export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  author?: {
    name: string;
    email: string;
  };
  likes_count?: number;
  user_has_liked?: boolean;
}

export interface CreatePostPayload {
  title: string;
  content: string;
}
