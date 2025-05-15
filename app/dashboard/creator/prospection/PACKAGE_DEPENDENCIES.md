# Dépendances requises

Pour que le module de prospection fonctionne correctement, certaines dépendances npm sont nécessaires en plus des composants shadcn/ui. Voici la liste des packages que vous devrez installer :

## Packages React et formulaires

```bash
# Pour les formulaires avec validation
npm install react-hook-form zod @hookform/resolvers
```

## Packages pour les notifications

```bash
# Pour les notifications toast
npm install react-hot-toast
```

## Pour SWR / React Query

```bash
# Pour la gestion des états serveur
npm install swr
# OU
npm install @tanstack/react-query
```

## Installation

Pour installer toutes les dépendances nécessaires en une seule commande :

```bash
npm install react-hook-form zod @hookform/resolvers react-hot-toast swr
```

## Configuration dans package.json

Voici les versions minimales recommandées :

```json
"dependencies": {
  "@hookform/resolvers": "^3.3.0",
  "react-hook-form": "^7.45.0", 
  "react-hot-toast": "^2.4.1",
  "swr": "^2.2.0",
  "zod": "^3.22.0"
}
```

## Note importante

Ces dépendances sont nécessaires en plus des composants UI shadcn que vous installerez via les commandes `npx shadcn@latest add [component]` mentionnées dans le fichier `INSTALLATION_COMPOSANTS.md`.

Assurez-vous que toutes ces dépendances sont installées avant d'essayer d'utiliser le module de prospection.
