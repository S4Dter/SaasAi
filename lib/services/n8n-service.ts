/**
 * Service d'intégration avec n8n
 * Ce service gère la communication avec les workflows n8n
 */

import { EmailGenerationParams, EmailResponse } from '@/types/crm';

// URL de base du serveur n8n
// Dans un environnement de production, cette URL devrait être définie dans les variables d'environnement
const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_BASE_URL || 'http://localhost:5678';

// ID du workflow pour la génération d'emails
// Ce workflow devrait être configuré dans n8n
const EMAIL_GENERATION_WORKFLOW_ID = process.env.NEXT_PUBLIC_N8N_EMAIL_WORKFLOW_ID || 'email-generation';

/**
 * Génère un email personnalisé en utilisant n8n
 * 
 * @param params Paramètres pour la génération d'email
 * @returns Réponse contenant l'email généré ou une erreur
 */
export async function generateEmailWithN8n(params: EmailGenerationParams): Promise<EmailResponse> {
  try {
    // URL du webhook n8n pour déclencher le workflow
    const webhookUrl = `${N8N_BASE_URL}/webhook/${EMAIL_GENERATION_WORKFLOW_ID}`;
    
    // Appel au webhook n8n
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    // Vérifier si la requête a réussi
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    // Récupérer la réponse
    const data = await response.json();
    
    // Vérifier si la réponse contient un email
    if (data && data.email_content) {
      return {
        success: true,
        email_content: data.email_content,
      };
    } else {
      return {
        success: false,
        error: 'La réponse n8n ne contient pas de contenu d\'email valide.',
      };
    }
  } catch (error) {
    console.error('Erreur lors de la génération de l\'email avec n8n:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue.',
    };
  }
}

/**
 * Exemple de structure du workflow n8n:
 * 
 * 1. Nœud Webhook: Point d'entrée qui reçoit les paramètres du prospect et de l'agent
 * 2. Nœud Code: Traite les données et génère un email personnalisé
 * 3. Nœud Set: Formate la réponse au format attendu
 * 4. Nœud Respond to Webhook: Renvoie l'email généré
 * 
 * Exemple de configuration n8n:
 * 
 * [Webhook] -> [Code] -> [Set] -> [Respond to Webhook]
 * 
 * Le nœud Code pourrait contenir une logique comme:
 * 
 * ```javascript
 * // Données d'entrée du webhook
 * const prospect = $input.body;
 * 
 * // Personnaliser l'email en fonction des données du prospect et de l'agent
 * const emailContent = `
 * Objet: Solution d'IA personnalisée pour ${prospect.prospect_name}
 * 
 * Bonjour ${prospect.prospect_name},
 * 
 * Suite à notre analyse, nous pensons que notre agent IA ${prospect.agent_nom || '[NOM_AGENT]'} 
 * serait particulièrement adapté aux besoins de votre entreprise dans le secteur ${prospect.secteur}.
 * 
 * Votre entreprise de taille "${prospect.taille_entreprise}" avec un budget estimé de ${prospect.budget_estime} 
 * pourrait bénéficier des fonctionnalités suivantes:
 * ${prospect.agent_fonctionalites?.map(f => `- ${f}`).join('\n') || '- [FONCTIONNALITÉS]'}
 * 
 * Ces solutions répondent directement à vos besoins identifiés:
 * ${prospect.besoins || '[BESOINS_CLIENT]'}
 * 
 * Nous proposons ce service à partir de ${prospect.agent_prix || '[PRIX]'}, 
 * ce qui correspond parfaitement à votre budget estimé.
 * 
 * Seriez-vous disponible pour une démonstration personnalisée?
 * 
 * Cordialement,
 * [Votre Nom]
 * Créateur d'Agents IA
 * `;
 * 
 * // Renvoyer le contenu d'email généré
 * return {
 *   email_content: emailContent
 * };
 * ```
 * 
 * Le nœud Set formaterait ensuite la réponse finale:
 * ```json
 * {
 *   "success": true,
 *   "email_content": "{{$node["Code"].json["email_content"]}}"
 * }
 * ```
 */

/**
 * Guide d'intégration avec n8n:
 * 
 * 1. Installer n8n localement ou sur un serveur:
 *    - npm install -g n8n
 *    - n8n start
 * 
 * 2. Créer un nouveau workflow dans n8n:
 *    - Ajouter un nœud Webhook comme déclencheur
 *    - Configurer le webhook pour accepter des requêtes POST
 *    - Note: n8n génère une URL unique pour ce webhook
 * 
 * 3. Ajouter un nœud Code pour traiter les données et générer l'email
 * 
 * 4. Ajouter un nœud Set pour formater la réponse
 * 
 * 5. Ajouter un nœud Respond to Webhook pour renvoyer la réponse
 * 
 * 6. Activer le workflow
 * 
 * 7. Mettre à jour les variables d'environnement dans votre application:
 *    - NEXT_PUBLIC_N8N_BASE_URL: URL de base de votre serveur n8n
 *    - NEXT_PUBLIC_N8N_EMAIL_WORKFLOW_ID: ID du workflow ou chemin du webhook
 */
