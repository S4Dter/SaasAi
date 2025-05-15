export interface CrmProspect {
  id: string;
  user_id: string;
  prospect_name: string;
  secteur: string;
  budget_estime: string;
  taille_entreprise: string;
  besoins: string | null;
  compatibilite: number;
  statut_email: 'non_envoye' | 'en_attente' | 'envoye' | 'ouvert' | 'repondu';
  email_envoye: boolean;
  email_contenu: string | null;
  email_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailGenerationParams {
  prospect_id: string;
  prospect_name: string;
  secteur: string;
  budget_estime: string;
  taille_entreprise: string;
  besoins: string | null;
  agent_id?: string;
  agent_nom?: string;
  agent_secteur?: string;
  agent_fonctionalites?: string[];
  agent_prix?: string;
}

export interface EmailResponse {
  success: boolean;
  email_content?: string;
  error?: string;
}
