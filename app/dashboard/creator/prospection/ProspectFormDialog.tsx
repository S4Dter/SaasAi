'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { ProspectFormValues } from '@/types/prospection';

// Schéma de validation Zod
const formSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  company: z.string().min(2, { message: 'Le nom de l\'entreprise est requis' }),
  email: z.string().email({ message: 'Email invalide' }),
  avatar: z.string().url({ message: 'URL invalide' }).optional().or(z.literal('')),
  location: z.string().optional(),
  industry_interest: z.string().min(1, { message: 'Veuillez sélectionner un secteur' }),
  budget: z.string().min(1, { message: 'Veuillez sélectionner un budget' }),
  company_size: z.string().min(1, { message: 'Veuillez sélectionner une taille d\'entreprise' }),
  needs: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ProspectFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ProspectFormValues;
  isEditing?: boolean;
}

export default function ProspectFormDialog({ 
  isOpen, 
  onClose, 
  initialData,
  isEditing = false 
}: ProspectFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createBrowserSupabaseClient();
  
  // Initialiser react-hook-form avec zod resolver
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors },
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      company: '',
      email: '',
      avatar: '',
      location: '',
      industry_interest: '',
      budget: '',
      company_size: '',
      needs: '',
    }
  });
  
  // Soumettre le formulaire à Supabase
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Préparer les données pour l'upsert
      const prospectData = {
        ...data,
        updated_at: new Date().toISOString(),
        ...(isEditing ? {} : { created_at: new Date().toISOString() })
      };
      
      // Effectuer l'upsert dans Supabase
      // Le score de correspondance sera recalculé côté DB via un trigger
      const { error } = isEditing
        ? await supabase
            .from('prospects')
            .update(prospectData)
            .eq('id', initialData?.id)
        : await supabase
            .from('prospects')
            .insert([prospectData]);
      
      if (error) throw error;
      
      // Réinitialiser le formulaire et fermer la modal
      reset();
      onClose();
      
      // Afficher un toast de succès
      toast.success(isEditing ? 'Prospect mis à jour avec succès' : 'Prospect ajouté avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du prospect:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifier le prospect' : 'Ajouter un nouveau prospect'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les informations du prospect ci-dessous.'
              : 'Entrez les détails du nouveau prospect pour l\'ajouter à votre liste.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register('name')}
                error={errors.name?.message}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise <span className="text-red-500">*</span></Label>
              <Input
                id="company"
                placeholder="Acme Inc."
                {...register('company')}
                error={errors.company?.message}
              />
              {errors.company && (
                <p className="text-sm text-red-500">{errors.company.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                placeholder="john.doe@example.com"
                {...register('email')}
                error={errors.email?.message}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                placeholder="https://example.com/avatar.jpg"
                {...register('avatar')}
                error={errors.avatar?.message}
              />
              {errors.avatar && (
                <p className="text-sm text-red-500">{errors.avatar.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                placeholder="Paris, France"
                {...register('location')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="industry_interest">Secteur d'activité <span className="text-red-500">*</span></Label>
              <Select
                onValueChange={(value) => setValue('industry_interest', value)}
                defaultValue={watch('industry_interest')}
              >
                <SelectTrigger id="industry_interest">
                  <SelectValue placeholder="Sélectionnez un secteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technologie</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Santé</SelectItem>
                  <SelectItem value="education">Éducation</SelectItem>
                  <SelectItem value="retail">Commerce</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
              {errors.industry_interest && (
                <p className="text-sm text-red-500">{errors.industry_interest.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget <span className="text-red-500">*</span></Label>
              <Select
                onValueChange={(value) => setValue('budget', value)}
                defaultValue={watch('budget')}
              >
                <SelectTrigger id="budget">
                  <SelectValue placeholder="Sélectionnez un budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Moins de 500€</SelectItem>
                  <SelectItem value="medium">500€ - 2000€</SelectItem>
                  <SelectItem value="high">Plus de 2000€</SelectItem>
                </SelectContent>
              </Select>
              {errors.budget && (
                <p className="text-sm text-red-500">{errors.budget.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company_size">Taille de l'entreprise <span className="text-red-500">*</span></Label>
              <Select
                onValueChange={(value) => setValue('company_size', value)}
                defaultValue={watch('company_size')}
              >
                <SelectTrigger id="company_size">
                  <SelectValue placeholder="Sélectionnez une taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employés</SelectItem>
                  <SelectItem value="11-50">11-50 employés</SelectItem>
                  <SelectItem value="51-200">51-200 employés</SelectItem>
                  <SelectItem value="201-500">201-500 employés</SelectItem>
                  <SelectItem value="501+">501+ employés</SelectItem>
                </SelectContent>
              </Select>
              {errors.company_size && (
                <p className="text-sm text-red-500">{errors.company_size.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="needs">Besoins spécifiques</Label>
            <Textarea
              id="needs"
              placeholder="Décrivez les besoins spécifiques de ce prospect..."
              className="min-h-[100px]"
              {...register('needs')}
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
