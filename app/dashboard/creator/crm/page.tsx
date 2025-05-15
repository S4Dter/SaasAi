import React from 'react'
import { Metadata } from 'next'
import CrmClient from './CrmClient'

export const metadata: Metadata = {
  title: 'Tableau de Prospection | Dashboard Créateur',
  description: 'Gérez vos prospects et générez des emails personnalisés pour les contacter.'
}

export default function CrmPage() {
  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto">
      <CrmClient />
    </div>
  )
}
