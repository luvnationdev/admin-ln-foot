'use client'
import ContentTabs from '@/components/content-tabs'
import AdvertisementForm from '@/components/dashboard/web/advertisement-form'
import HighlightForm from '@/components/dashboard/web/highlight-form'
import NewsForm from '@/components/dashboard/web/news-form'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import AdvertisementsTable from '../tables/AdvertisementsTable'
import HighlightsTable from '../tables/HighlightsTable'
import NewsTable from '../tables/NewsTable'

type Tab = {
  id: string
  label: string
}

interface MobileDashboardProps {
  tabs: Tab[]
}

export function WebTabs({ tabs }: MobileDashboardProps) {
  const [showTable, setShowTable] = useState(false)
  const [activeTab, setActiveTab] = useState('news')

  // Function to determine the form title based on active tab
  const getFormTitle = () => {
    switch (activeTab) {
      case 'news':
        return 'Gestion des Actualités'
      case 'highlights':
        return 'Gestion des Points Forts'
      case 'advertisements':
        return 'Gestion des Publicités'
      default:
        return 'Gestion du Contenu'
    }
  }

  const renderForm = () => {
    switch (activeTab) {
      case 'news':
        return <NewsForm />
      case 'highlights':
        return <HighlightForm />
      case 'advertisements':
        return <AdvertisementForm />
      default:
        return <NewsForm />
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
      default:
        return <NewsForm />
    }
  }

  return (
    <>
      <ContentTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className='flex items-center justify-between my-6'>
        <h2 className='text-2xl font-bold'>{getFormTitle()}</h2>
        <Button variant='outline' onClick={() => setShowTable(!showTable)}>
          {showTable ? 'Show form' : 'Voir toutes les actualités'}
        </Button>
      </div>
      {showTable ? renderTable() : renderForm()}
    </>
  )
}
