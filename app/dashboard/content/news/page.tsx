import NewsTable from '@/components/tables/NewsTable'
import React from 'react'

export default function NewsPage() {
  return (
    <div className='p-8'>
      <h1 className="text-2xl font-bold">News</h1>
      <p className="mt-4 text-gray-600">Latest news articles will be displayed here.</p>
      <NewsTable />
    </div>
  )
}
