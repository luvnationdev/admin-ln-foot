'use client'

import ContentTabs from '@/components/content-tabs'
import AdvertisementForm from '@/components/dashboard/web/advertisements/advertisement-form'
import HighlightForm from '@/components/dashboard/web/highlights/highlight-form'
import NewsForm from '@/components/dashboard/web/news/news-form'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import CategoriesManagement from './mobile/categories/category-management'
import HeadingsForm from './mobile/headings/heading-form'
import { HeadingsManagement } from './mobile/headings/headings-management'
import OrderManagement from './mobile/orders/order-management'; // Corrected import
import { ProductForm } from './mobile/products/product-form'
import { ProductsManagement } from './mobile/products/products-management'
import UsersManagement from './users/users-management'
import AdvertisementsManagement from './web/advertisements/advertisements-management'
import HighlightsManagement from './web/highlights/highlights-management'
import NewsManagement from './web/news/news-management'

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
      case 'orders':
        return 'Gestion des Commandes'
      case 'categories':
        return 'Gestion des Catégories'
      default:
        return variant === 'mobile'
          ? 'Formulaire de Produits'
          : 'Gestion du Contenu'
    }
  }

  const renderForm = () => {
    switch (activeTab) {
      case 'users':
        return <UsersManagement />
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
      case 'orders':
        return <OrderManagement />
      case 'categories':
        return <CategoriesManagement />
      default:
        return variant === 'mobile' ? <ProductForm /> : <NewsForm />
    }
  }

  const renderTable = () => {
    switch (activeTab) {
      case 'news':
        return <NewsManagement />
      case 'highlights':
        return <HighlightsManagement />
      case 'advertisements':
        return <AdvertisementsManagement />
      case 'products':
        return <ProductsManagement />
      case 'headings':
        return <HeadingsManagement />
      default:
        return variant === 'mobile' ? (
          <ProductsManagement />
        ) : (
          <NewsManagement />
        )
    }
  }

  const shouldShowViewToggleButton =
    activeTab !== 'users' && activeTab !== 'orders'

  return (
    <div className='max-w-6xl px-4 mx-auto my-6'>
      <ContentTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(newTab) => {
          setActiveTab(newTab)
          setShowTable(false)
        }}
      />

      <div className='flex items-center justify-between my-6'>
        <h2 className='text-2xl font-bold'>{getFormTitle()}</h2>
        {shouldShowViewToggleButton && (
          <Button variant='outline' onClick={() => setShowTable(!showTable)}>
            {showTable ? 'Afficher le formulaire' : '← Voir toutes les entrées'}
          </Button>
        )}
      </div>

      <div className='grid grid-cols-1 gap-8 md:grid-cols-1'>
        <div className='p-4 border rounded-md'>
          {activeTab === 'orders' || !showTable ? renderForm() : renderTable()}
        </div>
      </div>
    </div>
  )
}
