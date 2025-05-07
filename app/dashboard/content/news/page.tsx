import NewsTable from '@/components/tables/NewsTable'
import React from 'react'

export default function NewsPage() {
  return (
    <div className='p-8'>
      <h1 className="text-2xl font-bold">News</h1>
      <NewsTable />
    </div>
  )
}
