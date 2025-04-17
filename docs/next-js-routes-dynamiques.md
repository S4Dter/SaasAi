# Routes dynamiques dans Next.js 15

## Problème rencontré

Dans Next.js 15, l'utilisation des paramètres de route dynamiques (`params.id`) dans des composants marqués avec `'use client'` peut causer des problèmes, notamment lors de l'accès asynchrone à ces paramètres. De plus, il n'est pas possible d'exporter des métadonnées à partir d'un composant client.

Message d'erreur type :
```
You are attempting to export "metadata" from a component marked with "use client", which is disallowed.
```

## Solution implémentée

Nous avons mis en place une architecture en deux parties pour résoudre ce problème :

1. **Composant serveur (`page.tsx`)** :
   - Ne contient PAS la directive `'use client'`
   - Reçoit les paramètres de route via la prop `params`
   - Peut exporter des métadonnées via `export const metadata`
   - Passe les paramètres au composant client

2. **Composant client (`[NomDePage]Client.tsx`)** :
   - Contient la directive `'use client'` en haut du fichier
   - Reçoit les paramètres comme props normales
   - Contient toute la logique interactive (useState, useEffect, etc.)
   - Gère les appels API et l'affichage conditionnel

### Exemple pour la page de détail d'agent

**Composant serveur** (`app/agents/[id]/page.tsx`) :
```tsx
import { Metadata } from 'next';
import { APP_NAME } from '@/constants';
import AgentDetailsClient from './AgentDetailsClient';

interface AgentPageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: `Détails de l'agent | ${APP_NAME}`,
  description: 'Découvrez les détails, fonctionnalités et tarifs de cet agent IA',
};

export default function AgentPage({ params }: AgentPageProps) {
  return <AgentDetailsClient id={params.id} />;
}
```

**Composant client** (`app/agents/[id]/AgentDetailsClient.tsx`) :
```tsx
'use client';

import React from 'react';
import { useAgent } from '@/lib/hooks/useAgent';

interface AgentDetailsClientProps {
  id: string;
}

export default function AgentDetailsClient({ id }: AgentDetailsClientProps) {
  const { data: agent, loading, error } = useAgent(id);
  
  // Logique pour le chargement, les erreurs, et l'affichage
  // ...
}
```

## Bonnes pratiques pour les futures routes dynamiques

1. **Séparez toujours** la logique serveur de la logique client :
   - Le composant `page.tsx` ne devrait contenir que les métadonnées et passer les paramètres
   - Créez un composant client séparé pour la logique interactive

2. **Passez les paramètres explicitement** :
   - Ne comptez pas sur l'accès direct aux paramètres dans les composants clients
   - Passez les paramètres via les props pour une meilleure isolation

3. **Métadonnées uniquement dans les composants serveur** :
   - N'exportez jamais `metadata` depuis un composant marqué avec `'use client'`
   - Gardez les métadonnées dans le composant `page.tsx`

4. **Nommage cohérent** :
   - Nommez les composants clients avec le suffixe `Client` pour une meilleure clarté
   - Exemple : `AgentDetailsClient.tsx` pour la page `agents/[id]/page.tsx`

5. **Gestion des erreurs et des états de chargement** :
   - Gérez les états de chargement et d'erreur dans le composant client
   - Utilisez des composants de chargement et d'erreur spécifiques si nécessaire

Cette architecture assure que votre application respecte les contraintes de Next.js 15 concernant les composants serveur et client, tout en permettant une gestion efficace des paramètres de route dynamiques.
