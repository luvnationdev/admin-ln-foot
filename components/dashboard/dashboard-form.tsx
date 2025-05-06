'use client';

import ContentTabs from '@/components/content-tabs'
import ArticlesForm from '@/components/dashboard/mobile/articles-form'
import EnteteForm from '@/components/dashboard/mobile/entete-form'
import Preview from '@/components/previews/article/preview'
import { useState } from 'react'
import ActualitesForm from './web/actualites-form'
import PublicitesForm from './web/publicites-form'
import PointsFortsForm from './web/points-forts-form'

type Tab = {
  id: string
  label: string
}

interface MobileDashboardProps {
  tabs: Tab[]
}

export default function DashboardForm({ tabs }: MobileDashboardProps) {
  const [contentTab, setContentTab] = useState(tabs[0].id)

  // Déterminer le titre de la section en fonction de l'onglet actif
  const getSectionTitle = () => {
    switch (contentTab) {
      case 'articles':
        return 'INSERTION DES ARTICLES'
      case 'entete':
        return "INSERTION DE L'ENTETE"
      case 'actualites':
        return 'INSERTION DES ACTUALITES'
      case 'publicites':
        return 'INSERTION DES PUBLICITES'
      case 'points-forts':
        return 'INSERTION DES POINTS FORTS'
      default:
        return 'INSERTION DES ARTICLES'
    }
  }

  // Déterminer le titre du formulaire en fonction de l'onglet actif
  const getFormTitle = () => {
    switch (contentTab) {
      case 'articles':
        return "Formulaire d'Articles"
      case 'entete':
        return "Formulaire d'Entete"
      case 'actualites':
        return "Formulaire d'Actualité"
      case 'publicites':
        return 'Formulaire Publicité'
      case 'points-forts':
        return 'Formulaire Point fort'
      default:
        return "Formulaire d'Articles"
    }
  }

  // Afficher le formulaire approprié en fonction de l'onglet actif
  const renderForm = () => {
    switch (contentTab) {
      case 'articles':
        return <ArticlesForm />
      case 'entete':
        return <EnteteForm />
      case 'actualites':
        return <ActualitesForm />
      case 'publicites':
        return <PublicitesForm />
      case 'points-forts':
        return <PointsFortsForm />
      default:
        return <ArticlesForm />
    }
  }

  return (
    <>
      <div className='relative flex items-center h-full px-8'>
        <h1 className='text-2xl font-bold text-white'>{getSectionTitle()}</h1>
      </div>
      <div className='max-w-6xl px-4 mx-auto my-6'>
        <ContentTabs
          activeTab={contentTab}
          onTabChange={setContentTab}
          tabs={tabs}
        />
        <h2 className='my-6 text-2xl font-bold'>
          {getFormTitle()}
        </h2>

        <div className='grid grid-cols-1 gap-8 md:grid-cols-1'>
          <div className='p-4 border rounded-md'>{renderForm()}</div>
        </div>
      </div>
    </>
  )
}
