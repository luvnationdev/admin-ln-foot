'use client'

import type React from 'react'

import { trpc } from '@/lib/trpc/react'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

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

  const handleFileSelect = () => {
    // Simuler la sélection de fichier
    setImageUrl('/placeholder-news.jpg')
  }

  return (
    <div className='w-full'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <label htmlFor='type' className='block text-sm font-medium'>
            Type actualité
          </label>
          <div className='relative'>
            <button
              type='button'
              className='flex items-center justify-between w-full px-3 py-2 text-left border rounded-md'
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {type}
              <ChevronDown className='w-4 h-4 ml-2' />
            </button>
            {isDropdownOpen && (
              <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg'>
                <div
                  className='px-3 py-2 cursor-pointer hover:bg-gray-100'
                  onClick={() => {
                    setType('À la une')
                    setIsDropdownOpen(false)
                  }}
                >
                  À la une
                </div>
                <div
                  className='px-3 py-2 cursor-pointer hover:bg-gray-100'
                  onClick={() => {
                    setType('Actualité normale')
                    setIsDropdownOpen(false)
                  }}
                >
                  Actualité normale
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='space-y-2'>
          <label htmlFor='image' className='block text-sm font-medium'>
            Insérer image
          </label>
          <div className='flex'>
            <input
              type='text'
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className='flex-grow px-3 py-2 border rounded-l-md'
              placeholder='lien'
            />
            <button
              type='button'
              onClick={handleFileSelect}
              className='px-3 py-2 text-white bg-gray-400 rounded-r-md'
            >
              Sélectionner image
            </button>
          </div>
        </div>

        <div className='space-y-2'>
          <label htmlFor='title' className='block text-sm font-medium'>
            Titre actualité
          </label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='w-full px-3 py-2 border rounded-md'
            placeholder='titre'
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='summary' className='block text-sm font-medium'>
            Résumer
          </label>
          <textarea
            id='summary'
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className='w-full px-3 py-2 border rounded-md'
            rows={4}
            placeholder='écrire.....'
          ></textarea>
        </div>

        <div className='space-y-2'>
          <label htmlFor='comment' className='block text-sm font-medium'>
            Commentaire publication
          </label>
          <textarea
            id='comment'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className='w-full px-3 py-2 border rounded-md'
            rows={4}
            placeholder='écrire.....'
          ></textarea>
        </div>

        <button
          type='submit'
          className='w-full py-3 font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600'
        >
          PUBLIER
        </button>
      </form>
    </div>
  )
}
