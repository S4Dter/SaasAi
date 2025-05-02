# Schéma de Redirection Optimisé pour Next.js 15 (App Router)

## Problèmes identifiés

1. La page `/signin` reste visible après authentification au lieu de rediriger vers `/dashboard`
2. La synchronisation entre cookies, état d'authentification et redirection est incomplète
3. Potentielle course condition entre l'état d'authentification et la navigation

## Schéma de redirection côté serveur et client

```mermaid
graph TD
    A[Utilisateur sur /signin] --> B{Soumission formulaire}
    B -->|Succès| C[Authentification API]
    C -->|Token reçu| D[Stockage cookies + localStorage]
    D -->|1. Solution immédiate| E[window.location.href = '/redirect']
    D -->|2. Solution robuste| F[Server Action + redirect()]
    D -->|3. Solution middleware| G[Cookie envoyé au serveur]
    
    E --> H[Page /redirect]
    H --> I[useEffect vérifie localStorage]
    I --> J[Redirection basée sur rôle]
    
    F --> K[Response.redirect()]
    K --> J
    
    G --> L[Middleware détecte cookie]
    L --> J
    
    %% Gestion d'erreurs
    B -->|Échec| M[Affichage erreur sur formulaire]
    C -->|Erreur| M
```

## Solutions proposées

1. **Approche hybride (la plus fiable)**:
   - Utiliser les Server Actions pour l'authentification
   - Utiliser Response.redirect() côté serveur
   - Avoir un fallback client avec useEffect pour s'assurer que la redirection fonctionne

2. **Protection de route consolidée**:
   - Le middleware doit vérifier à la fois le cookie httpOnly et l'état local
   - Les layouts protégés doivent aussi vérifier l'authentification

3. **Gestion synchronisée des cookies et du state**:
   - Utiliser des cookies pour le state serveur
   - Répliquer le state dans localStorage pour l'accès client
   - S'assurer que le cookie et localStorage sont synchronisés
