'use client'

import type React from 'react'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function ArticlesForm() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Catégories')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const categories = [
    'Maillot',
    'Godasse',
    'Ballon',
    'Altere',
    'Equipement foot',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique pour soumettre le formulaire
    console.log({ category, imageUrl, name, price, description })
  }

  const handleFileSelect = () => {
    // Simuler la sélection de fichier
    setImageUrl('/placeholder-article.jpg')
  }

  return (
    <div className='w-full'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <label htmlFor='category' className='block text-sm font-medium'>
            Catégories
          </label>
          <div className='relative'>
            <button
              type='button'
              className='flex items-center justify-between w-full px-3 py-2 text-left border rounded-md'
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {category}
              <ChevronDown className='w-4 h-4 ml-2' />
            </button>
            {isDropdownOpen && (
              <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto'>
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className='px-3 py-2 cursor-pointer hover:bg-gray-100'
                    onClick={() => {
                      setCategory(cat)
                      setIsDropdownOpen(false)
                    }}
                  >
                    {cat}
                  </div>
                ))}
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
          <label htmlFor='name' className='block text-sm font-medium'>
            Nom de l&apos;article
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full px-3 py-2 border rounded-md'
            placeholder="Nom de l'article"
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='price' className='block text-sm font-medium'>
            Prix
          </label>
          <input
            type='text'
            id='price'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className='w-full px-3 py-2 border rounded-md'
            placeholder='Prix'
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='description' className='block text-sm font-medium'>
            Description
          </label>
          <textarea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
