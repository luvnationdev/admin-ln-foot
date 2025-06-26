import type React from 'react'
import { EditorContent, type Editor } from '@tiptap/react'

interface EditorPreviewProps {
  featuredImage: string | null
  title: string
  excerpt: string
  editor: Editor | null
  userName: string | null
  formattedDate: string
  isMajorUpdate: boolean
}

export function EditorPreview({
  featuredImage,
  title,
  excerpt,
  editor,
  userName,
  formattedDate,
  isMajorUpdate,
}: EditorPreviewProps) {
  return (
    <div className='border border-blue-200 rounded-lg p-6 bg-white'>
      <div className='max-w-3xl mx-auto'>
        {featuredImage && (
          <div className='mb-6'>
            <img
              src={featuredImage || '/placeholder.svg'}
              alt={title || 'Featured image'}
              className='w-full h-64 object-cover rounded-lg'
            />
          </div>
        )}

        {isMajorUpdate && (
          <div className='mb-2'>
            <span className='inline-block bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full'>
              🔥 Actualités majeure
            </span>
          </div>
        )}
        {title ? (
          <h1 className='text-3xl font-bold mb-3'>{title}</h1>
        ) : (
          <div className='h-9 w-3/4 bg-gray-100 rounded mb-3'></div>
        )}

        {excerpt ? (
          <p className='text-gray-600 mb-6 text-lg'>{excerpt}</p>
        ) : (
          <div className='h-6 w-full bg-gray-100 rounded mb-6'></div>
        )}

        <div className='prose max-w-none'>
          {editor?.isEmpty ? (
            <div className='space-y-2'>
              <div className='h-4 bg-gray-100 rounded w-full'></div>
              <div className='h-4 bg-gray-100 rounded w-5/6'></div>
              <div className='h-4 bg-gray-100 rounded w-4/6'></div>
            </div>
          ) : (
            <EditorContent editor={editor} className='prose-preview' />
          )}
        </div>

        <div className='mt-8 pt-4 border-t border-gray-200'>
          <p className='text-sm text-gray-500'>
            {userName} • {formattedDate}
          </p>
        </div>
      </div>
    </div>
  )
}
