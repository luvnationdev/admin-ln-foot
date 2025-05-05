'use client'

import type React from 'react'

import { trpc } from '@/lib/trpc/react'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import NewsEditor from '@/components/News/NewsEditor'

export default function ActualitesForm() {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [comment, setComment] = useState('')
  const [type, setType] = useState('À la une')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const { mutate: createNewsArticle } =
    trpc.newsArticles.createNewsArticle.useMutation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique pour soumettre le formulaire

    createNewsArticle(
      {
        imageUrl,
        title,
        sourceUrl: '',
        content: summary,
      },
      {
        onError(error) {
          console.log(error)
        },
        onSuccess(data) {
          console.log('Sucessfull: ', data)
        },
      }
    )
  }


  return (
    <div className='w-full'>
      <NewsEditor />
    </div>
  )
}
