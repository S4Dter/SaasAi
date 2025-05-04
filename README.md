# AgentMarket - Vue d'ensemble

AgentMarket est une plateforme de marché d'agents IA connectant entreprises et créateurs d'agents spécialisés.

## Structure du projet

Ce projet utilise Next.js 15 avec App Router et est structuré comme suit:

- `/app`: Pages et composants associés à des routes
- `/components`: Composants réutilisables
- `/lib`: Hooks, utilitaires, API clients
- `/docs`: Documentation technique
- `/types`: Définitions de types TypeScript

## Configuration Supabase

Nous utilisons Supabase pour la base de données, l'authentification et le stockage.

### Base de données

Le schéma complet de la base de données est disponible dans le fichier:
- [agent-marketplace-schema.sql](./docs/agent-marketplace-schema.sql)

Ce fichier contient:
- Définition des tables (users, agents, favorites, contacts, etc.)
- Index pour optimiser les requêtes
- Politiques de sécurité Row Level Security (RLS)
- Fonctions et triggers PostgreSQL
- Configuration des extensions nécessaires

Vous pouvez importer ce fichier SQL directement dans l'éditeur SQL de Supabase pour configurer votre projet.

### Authentification

Nous utilisons l'authentification email/mot de passe de Supabase avec:
- Vérification par email obligatoire
- Synchronisation entre `auth.users` et notre table personnalisée `users`
- Politiques de sécurité spécifiques aux rôles (creator/enterprise)

Pour plus de détails sur l'authentification, voir [authentication.md](./docs/authentication.md) et [supabase-setup.md](./docs/supabase-setup.md).

### Storage

Nous utilisons trois buckets de stockage principaux:
- **agents-logos**: logos des agents
- **agents-screenshots**: captures d'écran des agents
- **user-avatars**: avatars des utilisateurs

Chaque bucket est configuré avec des politiques d'accès appropriées (lecture publique, écriture restreinte).

## Variables d'environnement

Pour démarrer le projet, configurez ces variables dans un fichier `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-supabase
```

## Guide de démarrage rapide

1. Clonez le dépôt
2. Installez les dépendances: `npm install`
3. Configurez Supabase avec le fichier SQL fourni
4. Configurez les variables d'environnement
5. Lancez le serveur de développement: `npm run dev`

## Fonctionnalités communautaires

Pour la fonctionnalité de communauté, consultez:
- [community-database-schema.sql](./docs/community-database-schema.sql)
