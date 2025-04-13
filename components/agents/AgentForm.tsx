import React, { useState } from 'react';
import { AgentFormData, AgentCategory, IntegrationType, AgentPricing } from '@/types';
import { AGENT_CATEGORIES, INTEGRATION_TYPES, PRICING_MODELS, CURRENCIES } from '@/constants';

interface AgentFormProps {
  initialData?: Partial<AgentFormData>;
  onSubmit: (data: AgentFormData) => void;
  isSubmitting?: boolean;
}

/**
 * Formulaire de création ou d'édition d'agent IA
 * 
 * @param initialData - Données initiales (pour édition)
 * @param onSubmit - Fonction appelée lors de la soumission
 * @param isSubmitting - Indique si le formulaire est en cours de soumission
 */
const AgentForm: React.FC<AgentFormProps> = ({
  initialData = {},
  onSubmit,
  isSubmitting = false
}) => {
  // État du formulaire
  const [formData, setFormData] = useState<AgentFormData>({
    name: initialData.name || '',
    description: initialData.description || '',
    shortDescription: initialData.shortDescription || '',
    category: initialData.category || 'other',
    pricing: initialData.pricing || {
      model: 'subscription',
      startingPrice: 0,
      currency: 'EUR',
      details: ''
    },
    integrations: initialData.integrations || [],
    demoUrl: initialData.demoUrl || '',
    demoVideoUrl: initialData.demoVideoUrl || ''
  });

  // État des erreurs de validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Gestion des changements de champs simples
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur si le champ est rempli
    if (value && errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Gestion des changements de prix
  const handlePricingChange = (field: keyof AgentPricing, value: string) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: field === 'startingPrice' ? parseFloat(value) || 0 : value
      }
    }));
  };

  // Gestion des intégrations
  const handleIntegrationToggle = (integration: IntegrationType) => {
    setFormData(prev => {
      const currentIntegrations = [...prev.integrations];
      
      // Ajouter ou supprimer l'intégration
      if (currentIntegrations.includes(integration)) {
        return {
          ...prev,
          integrations: currentIntegrations.filter(i => i !== integration)
        };
      } else {
        return {
          ...prev,
          integrations: [...currentIntegrations, integration]
        };
      }
    });
  };

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validation des champs obligatoires
    if (!formData.name.trim()) newErrors.name = 'Le nom est obligatoire';
    if (!formData.description.trim()) newErrors.description = 'La description est obligatoire';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'La description courte est obligatoire';
    if (formData.shortDescription.length > 200) {
      newErrors.shortDescription = 'La description courte doit faire moins de 200 caractères';
    }
    
    if (formData.pricing.startingPrice < 0) {
      newErrors.startingPrice = 'Le prix doit être positif';
    }
    
    if (formData.integrations.length === 0) {
      newErrors.integrations = 'Sélectionnez au moins un type d\'intégration';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Informations générales */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
        
        <div className="space-y-4">
          {/* Nom de l'agent */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l&apos;agent <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          
          {/* Catégorie */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {AGENT_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Description courte */}
          <div>
            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Description courte <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">
                (max 200 caractères, utilisée dans les résumés)
              </span>
            </label>
            <input
              type="text"
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              maxLength={200}
              className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.shortDescription ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <div className="mt-1 flex justify-between">
              {errors.shortDescription ? (
                <p className="text-sm text-red-600">{errors.shortDescription}</p>
              ) : (
                <span className="text-xs text-gray-500">
                  {formData.shortDescription.length}/200 caractères
                </span>
              )}
            </div>
          </div>
          
          {/* Description complète */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description complète <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">
                (support du markdown)
              </span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={10}
              className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
        </div>
      </div>
      
      {/* Tarification */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Tarification</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Modèle de tarification */}
          <div>
            <label htmlFor="pricing-model" className="block text-sm font-medium text-gray-700 mb-1">
              Modèle de tarification <span className="text-red-500">*</span>
            </label>
            <select
              id="pricing-model"
              value={formData.pricing.model}
              onChange={(e) => handlePricingChange('model', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {PRICING_MODELS.map(model => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Prix de départ */}
          <div className="flex space-x-2">
            <div className="flex-grow">
              <label htmlFor="starting-price" className="block text-sm font-medium text-gray-700 mb-1">
                Prix de départ <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="starting-price"
                min="0"
                step="0.01"
                value={formData.pricing.startingPrice}
                onChange={(e) => handlePricingChange('startingPrice', e.target.value)}
                className={`block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.startingPrice ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.startingPrice && <p className="mt-1 text-sm text-red-600">{errors.startingPrice}</p>}
            </div>
            
            <div className="w-24">
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Devise
              </label>
              <select
                id="currency"
                value={formData.pricing.currency}
                onChange={(e) => handlePricingChange('currency', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {CURRENCIES.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label} ({currency.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Détails de tarification */}
        <div className="mt-4">
          <label htmlFor="pricing-details" className="block text-sm font-medium text-gray-700 mb-1">
            Détails de tarification <span className="text-xs text-gray-500">(optionnel)</span>
          </label>
          <input
            type="text"
            id="pricing-details"
            value={formData.pricing.details || ''}
            onChange={(e) => handlePricingChange('details', e.target.value)}
            placeholder="Ex: Abonnement mensuel avec remise de 20% pour engagement annuel"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      {/* Types d'intégration */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Types d&apos;intégration</h2>
          <span className="text-sm text-gray-500">
            Sélectionnez tous les types d&apos;intégration disponibles
          </span>
        </div>
        
        {errors.integrations && (
          <p className="mb-4 text-sm text-red-600 p-2 bg-red-50 rounded">
            {errors.integrations}
          </p>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {INTEGRATION_TYPES.map(integration => (
            <div key={integration.value} className="flex items-center">
              <input
                id={`integration-${integration.value}`}
                type="checkbox"
                checked={formData.integrations.includes(integration.value as IntegrationType)}
                onChange={() => handleIntegrationToggle(integration.value as IntegrationType)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`integration-${integration.value}`}
                className="ml-2 block text-sm text-gray-700"
              >
                {integration.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Démonstration */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Démonstration</h2>
        
        <div className="space-y-4">
          {/* URL de démo */}
          <div>
            <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700 mb-1">
              URL de démonstration <span className="text-xs text-gray-500">(optionnel)</span>
            </label>
            <input
              type="url"
              id="demoUrl"
              name="demoUrl"
              value={formData.demoUrl || ''}
              onChange={handleChange}
              placeholder="https://demo.votre-agent.com"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          {/* URL vidéo */}
          <div>
            <label htmlFor="demoVideoUrl" className="block text-sm font-medium text-gray-700 mb-1">
              URL de vidéo de démonstration <span className="text-xs text-gray-500">(optionnel)</span>
            </label>
            <input
              type="url"
              id="demoVideoUrl"
              name="demoVideoUrl"
              value={formData.demoVideoUrl || ''}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      
      {/* Boutons d'action */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer l\'agent'}
        </button>
      </div>
    </form>
  );
};

export default AgentForm;
