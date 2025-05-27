'use client'

import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { trpc } from '@/lib/trpc/react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { type NewsArticle } from '@/types/news'
import NewsEditor from '@/components/News/NewsEditor'

export default function NewsTable() {
  const { data: newsArticles, isLoading } = trpc.newsArticles.latest.useQuery()
  const [articleToDelete, setArticleToDelete] = useState<NewsArticle | null>(
    null
  )
  const [articleToEdit, setArticleToEdit] = useState<NewsArticle | null>(null)
  const utils = trpc.useUtils()
  const deleteNewsMutation = trpc.newsArticles.deleteNewsArticle.useMutation({
    onSuccess: async () => {
      setArticleToDelete(null)
      await utils.newsArticles.latest.invalidate()
    },
  })

  if (isLoading) {
    return (
      <div className='w-full p-8 flex justify-center'>
        <div className='animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent'></div>
      </div>
    )
  }

  return (
    <div className='w-full border rounded-lg overflow-hidden'>
      <div className='p-4 bg-blue-50 border-b'>
        <h2 className='text-xl font-semibold text-blue-700'>News</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[300px]'>Titre</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Excerpt</TableHead>
            <TableHead className='text-right'>Date</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newsArticles?.length ? (
            /* eslint-disable @typescript-eslint/no-explicit-any */
            newsArticles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className='font-medium'>
                  {article.title ?? 'No Title'}
                </TableCell>
                <TableCell>{article.apiSource ?? 'Admin'}</TableCell>
                <TableCell>
                  {article.summary
                    ? article.summary.substring(0, 100) + '...'
                    : 'No content'}
                </TableCell>
                <TableCell className='text-right'>
                  {article.publishedAt
                    ? formatDistanceToNow(new Date(article.publishedAt), {
                        addSuffix: true,
                        locale: fr,
                      })
                    : article.createdAt
                      ? formatDistanceToNow(new Date(article.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })
                      : '-'}
                </TableCell>
                <TableCell className='text-right space-x-2'>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-8 w-8 p-0'
                        onClick={() => setArticleToEdit(article)}
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className='min-w-4xl max-h-[90vh] overflow-y-auto'>
                      <DialogHeader>
                        <DialogTitle>Modifier l&apos;article</DialogTitle>
                      </DialogHeader>
                      <div className='py-4'>
                        <NewsEditor article={articleToEdit} />
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-8 w-8 p-0 hover:text-red-500'
                        onClick={() => setArticleToDelete(article)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Supprimer l&apos;article</DialogTitle>
                        <DialogDescription>
                          Êtes-vous sûr de vouloir supprimer cet article ? Cette
                          action est irréversible.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className='mt-4'>
                        <Button
                          variant='ghost'
                          onClick={() => setArticleToDelete(null)}
                        >
                          Annuler
                        </Button>
                        <Button
                          variant='destructive'
                          onClick={() => {
                            if (articleToDelete?.id) {
                              deleteNewsMutation.mutate({
                                id: articleToDelete.id,
                              })
                            }
                          }}
                          disabled={deleteNewsMutation.isPending}
                        >
                          {deleteNewsMutation.isPending
                            ? 'Suppression...'
                            : 'Supprimer'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className='text-center py-8 text-gray-500'>
                Aucun article disponible
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
