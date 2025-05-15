# Installation des composants shadcn/ui

Pour faire fonctionner le module de prospection, vous devez installer certains composants shadcn/ui manquants. Voici la procédure à suivre :

## Composants à installer

Voici les composants utilisés dans le module mais qui ne sont pas encore installés :

1. Dialog (utilisé dans `ProspectFormDialog.tsx`)
2. Drawer (utilisé dans `EmailDraftDrawer.tsx`) 
3. Sheet (utilisé dans `ActivityTimeline.tsx`)
4. Input (utilisé dans `ProspectFormDialog.tsx`)
5. Textarea (utilisé dans `ProspectFormDialog.tsx`)
6. Select (utilisé dans `ProspectFormDialog.tsx`)

## Procédure d'installation

Exécutez les commandes suivantes une par une dans votre terminal :

```bash
# Installation du composant Dialog
npx shadcn@latest add dialog

# Installation du composant Drawer
npx shadcn@latest add drawer

# Installation du composant Sheet
npx shadcn@latest add sheet

# Installation du composant Input
npx shadcn@latest add input

# Installation du composant Textarea
npx shadcn@latest add textarea

# Installation du composant Select
npx shadcn@latest add select
```

## Vérification

Après l'installation, vous devriez avoir les fichiers suivants dans votre dossier `components/ui` :

- `dialog.tsx`
- `drawer.tsx`
- `sheet.tsx`
- `input.tsx`
- `textarea.tsx`
- `select.tsx`

## Résolution de problèmes potentiels

Si vous rencontrez des erreurs lors de l'installation, assurez-vous que :

1. Vous avez bien un fichier `components.json` à la racine de votre projet
2. Votre configuration shadcn/ui est correcte (tailwind.config.js, etc.)
3. Vous avez les dépendances requises dans votre package.json

## Adaptation du code

Si les noms des composants ne correspondent pas exactement (par exemple différence de casse entre `Button.tsx` et `button.tsx`), vous devrez ajuster les imports dans les fichiers du module de prospection.

Par exemple, si le fichier est généré en minuscules :

```typescript
// Remplacer
import { Dialog, ... } from '@/components/ui/Dialog';
// Par
import { Dialog, ... } from '@/components/ui/dialog';
