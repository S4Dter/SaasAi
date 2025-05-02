import { z } from 'zod';

/**
 * Schéma de validation pour l'authentification
 */

// Schéma pour la connexion
export const signInSchema = z.object({
  email: z
    .string({ 
      required_error: 'Email requis'
    })
    .email({
      message: 'Adresse email invalide'
    }),
  password: z
    .string({ 
      required_error: 'Mot de passe requis'
    })
    .min(6, {
      message: 'Le mot de passe doit contenir au moins 6 caractères'
    }),
});

// Schéma pour l'inscription
export const signUpSchema = signInSchema.extend({
  name: z
    .string({ 
      required_error: 'Nom requis'
    })
    .min(2, {
      message: 'Le nom doit contenir au moins 2 caractères'
    })
    .optional()
    .transform((val: string | undefined) => val === undefined || val === '' ? 'Anonymous' : val),
  userType: z
    .string({
      required_error: "Type d'utilisateur requis"
    })
    .refine((val: string) => ['creator', 'enterprise'].includes(val), {
      message: "Veuillez sélectionner un type d'utilisateur valide"
    }),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;

/**
 * Fonction utilitaire pour valider les données d'inscription
 * et leur appliquer des transformations (comme ajouter des valeurs par défaut)
 */
export function validateSignUp(data: Record<string, any>) {
  try {
    // Parse et transforme les données selon le schéma
    const result = signUpSchema.parse(data);
    return { 
      success: true, 
      data: result,
      errors: null 
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Formater les erreurs de validation
      const errors = (error as z.ZodError).errors.reduce((acc: Record<string, string>, err) => {
        const field = err.path[0] as string;
        acc[field] = err.message;
        return acc;
      }, {} as Record<string, string>);
      
      return { 
        success: false, 
        data: null,
        errors 
      };
    }
    
    return { 
      success: false, 
      data: null,
      errors: { general: "Une erreur est survenue lors de la validation" } 
    };
  }
}

/**
 * Fonction utilitaire pour valider les données de connexion
 */
export function validateSignIn(data: Record<string, any>) {
  try {
    const result = signInSchema.parse(data);
    return { success: true, data: result, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = (error as z.ZodError).errors.reduce((acc: Record<string, string>, err) => {
        const field = err.path[0] as string;
        acc[field] = err.message;
        return acc;
      }, {} as Record<string, string>);
      
      return { success: false, data: null, errors };
    }
    
    return { 
      success: false, 
      data: null,
      errors: { general: "Une erreur est survenue lors de la validation" } 
    };
  }
}
