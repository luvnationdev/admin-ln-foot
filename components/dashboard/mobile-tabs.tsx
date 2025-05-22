'use client'

import ContentTabs from '@/components/content-tabs'
import { useState } from 'react'
import HeadingsForm from './mobile/heading-form'
import { ProductForm } from './mobile/product-form'

type Tab = {
  id: string
  label: string
}

interface MobileDashboardProps {
  tabs: Tab[]
}

export default function MobileTabs({ tabs }: MobileDashboardProps) {
  const [contentTab, setContentTab] = useState(tabs[0].id)

  // Déterminer le titre du formulaire en fonction de l'onglet actif
  const getFormTitle = () => {
    switch (contentTab) {
      case 'products':
        return 'Formulaire de Produits'
      case 'headings':
        return 'Formulaire de entêtes'
      default:
        return "Formulaire de Produits"
    }
  }

  // Afficher le formulaire approprié en fonction de l'onglet actif
  const renderForm = () => {
    switch (contentTab) {
      case 'products':
        return <ProductForm />
      case 'headings':
        return <HeadingsForm />
      default:
        return <ProductForm />
    }
  }

  return (
    <>
      <div className='max-w-6xl px-4 mx-auto my-6'>
        <ContentTabs
          activeTab={contentTab}
          onTabChange={setContentTab}
          tabs={tabs}
        />
        <h2 className='my-6 text-2xl font-bold'>{getFormTitle()}</h2>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-1'>
          <div className='p-4 border rounded-md'>{renderForm()}</div>
        </div>
      </div>
    </>
  )
}
