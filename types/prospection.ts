export interface Prospect {
  id: string;
  user_id: string;
  name: string;
  company: string;
  email: string;
  avatar?: string;
  location?: string;
  industry_interest: string;
  budget: string;
  company_size: string;
  needs?: string;
  match_score: number;
  contacted: boolean;
  last_activity?: string;
  created_at: string;
  updated_at: string;
}

export interface ProspectActivity {
  id: string;
  prospect_id: string;
  type: 'profile_view' | 'agent_view' | 'contact_creator' | 'email_sent' | 'email_opened' | 'email_clicked';
  details?: string;
  created_at: string;
}

export interface ProspectFormValues {
  id?: string;
  name: string;
  company: string;
  email: string;
  avatar?: string;
  location?: string;
  industry_interest: string;
  budget: string;
  company_size: string;
  needs?: string;
}

export interface EmailDraft {
  prospectId: string;
  content: string;
  generated: boolean;
}

export interface CategoryRecommendation {
  category: string;
  score: number;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  score: number;
}
