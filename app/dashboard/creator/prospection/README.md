# Module de Prospection

Ce module permet aux créateurs d'agents IA de gérer leurs prospects, suivre les activités et générer des emails personnalisés.

## Structure du dossier

```
app/dashboard/creator/prospection/
├─ page.tsx                 – Server Component (auth + data prefetch)
├─ ProspectsTable.tsx       – Client Component
├─ ProspectFormDialog.tsx   – formulaire détaillé d'ajout/édition
├─ EmailDraftDrawer.tsx     – aperçu et édition du brouillon
├─ ActivityTimeline.tsx     – activités du prospect
└─ hooks/
   └─ useGenerateEmail.ts   – mutate pour POST /api/generate-email
```

## Configuration de l'environnement

Pour utiliser ce module, vous devez configurer les variables d'environnement suivantes dans votre fichier `.env.local` :

```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
OPENAI_API_KEY=votre_clé_api_openai
```

## Tables Supabase requises

Ce module utilise les tables suivantes dans Supabase :

1. `prospects` - Stockage des prospects
2. `prospect_activities` - Historique des activités des prospects
3. `category_recommendations` - Recommandations de catégories pour les prospects
4. `agents` - Informations sur les agents IA

Assurez-vous que les politiques RLS (Row Level Security) sont configurées pour chaque table afin de restreindre l'accès aux données.

## Tester la génération d'emails

Pour tester la fonctionnalité de génération d'emails :

1. Ajoutez un nouveau prospect en utilisant le formulaire ProspectFormDialog
2. Dans le tableau des prospects, cliquez sur le bouton "Brouillon" à côté du prospect
3. L'API `/api/generate-email` sera appelée avec l'ID du prospect
4. Une fois généré, le brouillon d'email sera affiché dans EmailDraftDrawer

### Simuler l'API de génération d'emails

Pour développer sans appeler l'API OpenAI, vous pouvez créer un endpoint stub :

```typescript
// app/api/generate-email/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prospectId } = await request.json();
  
  // Simule un délai de génération
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return NextResponse.json({
    email: `Cher prospect,

Nous avons remarqué votre intérêt pour nos agents IA. Voici comment nous pouvons vous aider...

[Contenu d'exemple généré pour le prospect ID: ${prospectId}]

Cordialement,
L'équipe des Créateurs d'Agents`
  });
}
```

## Intégration future avec n8n

Ce module contient des commentaires TODO pour les points d'intégration avec n8n :

1. Dans `useGenerateEmail.ts` - Pour l'envoi automatique des emails et le suivi des séquences
2. Dans `ActivityTimeline.tsx` - Pour la mise à jour en temps réel du statut des emails

Ces fonctionnalités seront implémentées ultérieurement lorsque les workflows n8n seront disponibles.

## Tests

Des tests basiques sont inclus pour vérifier le bon fonctionnement du module :

- Rendu du tableau de prospects avec des données fictives
- Vérification du tri par score de compatibilité
- Mocking de l'appel à l'API de génération d'email

Pour exécuter les tests :

```bash
npm test app/dashboard/creator/prospection
