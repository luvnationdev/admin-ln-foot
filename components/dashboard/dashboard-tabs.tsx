'use client'

import ContentTabs from '@/components/content-tabs'
import AdvertisementForm from '@/components/dashboard/web/advertisement-form'
import HighlightForm from '@/components/dashboard/web/highlight-form'
import NewsForm from '@/components/dashboard/web/news-form'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { HeadingsList } from '../lists/headings-list'
import { ProductsList } from '../lists/products-list'
import UserList from '../lists/users-list'
import AdvertisementsTable from '../tables/AdvertisementsTable'
import HighlightsTable from '../tables/HighlightsTable'
import NewsTable from '../tables/NewsTable'
import HeadingsForm from './mobile/heading-form'
import { ProductForm } from './mobile/product-form'

type Tab = {
  id: string
  label: string
}

interface DashboardTabsProps {
  tabs: Tab[]
  variant: 'mobile' | 'web' | 'users'
}

export default function DashboardTabs({ tabs, variant }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [showTable, setShowTable] = useState(false)

  const getFormTitle = () => {
    switch (activeTab) {
      case 'products':
        return 'Formulaire de Produits'
      case 'headings':
        return 'Formulaire de entêtes'
      case 'news':
        return 'Gestion des Actualités'
      case 'highlights':
        return 'Gestion des Points Forts'
      case 'advertisements':
        return 'Gestion des Publicités'
      default:
        return variant === 'mobile'
          ? 'Formulaire de Produits'
          : 'Gestion du Contenu'
    }
  }

  const renderForm = () => {
    switch (activeTab) {
      case 'users':
        return <UserList />
      case 'products':
        return <ProductForm />
      case 'headings':
        return <HeadingsForm />
      case 'news':
        return <NewsForm />
      case 'highlights':
        return <HighlightForm />
      case 'advertisements':
        return <AdvertisementForm />
      default:
        return variant === 'mobile' ? <ProductForm /> : <NewsForm />
    }
  }

  const renderTable = () => {
    switch (activeTab) {
      case 'news':
        return <NewsTable />
      case 'highlights':
        return <HighlightsTable />
      case 'advertisements':
        return <AdvertisementsTable />
      case 'products':
        return <ProductsList />
      case 'headings':
        return <HeadingsList />
      default:
        return variant === 'mobile' ? <ProductsList /> : <NewsTable />
    }
  }

  return (
    <div className='max-w-6xl px-4 mx-auto my-6'>
      <ContentTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className='flex items-center justify-between my-6'>
        <h2 className='text-2xl font-bold'>{getFormTitle()}</h2>
        {activeTab !== 'users' && (
          <Button variant='outline' onClick={() => setShowTable(!showTable)}>
            {showTable ? 'Afficher le formulaire' : '← Voir toutes les entrées'}
          </Button>
        )}
      </div>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-1'>
        <div className='p-4 border rounded-md'>
          {showTable ? renderTable() : renderForm()}
        </div>
      </div>
    </div>
  )
}
