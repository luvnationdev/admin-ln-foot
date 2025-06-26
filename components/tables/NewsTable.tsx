'use client'

import NewsEditor from '@/components/News/NewsEditor'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  useNewsArticleControllerServiceDeleteApiV1NewsArticlesById,
  useNewsArticleControllerServiceGetApiV1NewsArticles,
} from '@/lib/api-client/rq-generated/queries'
import * as CommonQueryKeys from '@/lib/api-client/rq-generated/queries/common' // For query key functions
import type { NewsArticleDto } from '@/lib/api-client/rq-generated/requests'
import { useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Calendar,
  FileText,
  Newspaper,
  Pencil,
  Trash2,
  User,
} from 'lucide-react'
import { useState } from 'react'

export default function NewsTable() {
  const { data: newsArticles, isLoading } =
    useNewsArticleControllerServiceGetApiV1NewsArticles()
  const [articleToDelete, setArticleToDelete] = useState<NewsArticleDto | null>(
    null
  )
  const [articleToEdit, setArticleToEdit] = useState<NewsArticleDto | null>(
    null
  )

  const queryClient = useQueryClient()
  const deleteNewsMutation =
    useNewsArticleControllerServiceDeleteApiV1NewsArticlesById({
      onSuccess: () => {
        setArticleToDelete(null)
        void queryClient.invalidateQueries({
          queryKey:
            CommonQueryKeys.UseNewsArticleControllerServiceGetApiV1NewsArticlesKeyFn(),
        })
      },
    })

  if (isLoading) {
    return (
      <div className='w-full p-12 flex flex-col items-center justify-center space-y-4'>
        <div className='animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent'></div>
        <p className='text-gray-500 text-sm'>Chargement des actualités...</p>
      </div>
    )
  }

  return (
    <div className='w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg'>
      {/* Header moderne avec gradient */}
      <div className='p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
        <div className='flex items-center space-x-3'>
          <div className='p-2 bg-white/20 rounded-lg'>
            <Newspaper className='h-6 w-6' />
          </div>
          <div>
            <h2 className='text-2xl font-bold'>Actualités</h2>
            <p className='text-blue-100 text-sm'>
              Gérez vos articles et actualités
            </p>
          </div>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='bg-gray-50/80 border-b border-gray-200'>
              <TableHead className='w-[350px] font-semibold text-gray-700 py-4'>
                <div className='flex items-center space-x-2'>
                  <FileText className='h-4 w-4' />
                  <span>Titre</span>
                </div>
              </TableHead>
              <TableHead className='font-semibold text-gray-700'>
                <div className='flex items-center space-x-2'>
                  <User className='h-4 w-4' />
                  <span>Auteur</span>
                </div>
              </TableHead>
              <TableHead className='font-semibold text-gray-700'>
                Extrait
              </TableHead>
              <TableHead className='text-right font-semibold text-gray-700'>
                <div className='flex items-center justify-end space-x-2'>
                  <Calendar className='h-4 w-4' />
                  <span>Date</span>
                </div>
              </TableHead>
              <TableHead className='text-right font-semibold text-gray-700'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newsArticles?.length ? (
              newsArticles.map((article) => (
                <TableRow
                  key={article.id}
                  className='hover:bg-gray-50/50 transition-colors duration-200 border-b border-gray-100 group'
                >
                  <TableCell className='py-4'>
                    <div className='space-y-2'>
                      <div className='font-semibold text-gray-900 line-clamp-2'>
                        {article.title ?? 'Sans titre'}
                      </div>
                      {article.isMajorUpdate && (
                        <Badge
                          variant='secondary'
                          className='bg-red-100 text-red-700 border-red-200'
                        >
                          🔥 Actualité majeure
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='py-4'>
                    <Badge
                      variant='outline'
                      className='bg-blue-50 text-blue-700 border-blue-200'
                    >
                      {article.authorName ?? 'Admin'}
                    </Badge>
                  </TableCell>
                  <TableCell className='py-4 max-w-[300px]'>
                    <p className='text-gray-600 text-sm line-clamp-3 leading-relaxed'>
                      {article.summary
                        ? article.summary.substring(0, 120) + '...'
                        : 'Aucun contenu disponible'}
                    </p>
                  </TableCell>
                  <TableCell className='text-right py-4'>
                    <div className='text-sm text-gray-500'>
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
                    </div>
                  </TableCell>
                  <TableCell className='text-right py-4'>
                    <div className='flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-9 w-9 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200'
                            onClick={() => setArticleToEdit(article)}
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='max-w-6xl max-h-[90vh] overflow-y-auto'>
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
                            className='h-9 w-9 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-200'
                            onClick={() => setArticleToDelete(article)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className='max-w-md'>
                          <DialogHeader>
                            <DialogTitle className='text-red-600'>
                              Supprimer l&apos;article
                            </DialogTitle>
                            <DialogDescription className='text-gray-600'>
                              Êtes-vous sûr de vouloir supprimer cet article ?
                              Cette action est irréversible.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className='mt-6 space-x-2'>
                            <Button
                              variant='outline'
                              onClick={() => setArticleToDelete(null)}
                              className='border-gray-300'
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
                              className='bg-red-600 hover:bg-red-700'
                            >
                              {deleteNewsMutation.isPending
                                ? 'Suppression...'
                                : 'Supprimer'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className='text-center py-16'>
                  <div className='flex flex-col items-center space-y-4'>
                    <div className='p-4 bg-gray-100 rounded-full'>
                      <Newspaper className='h-8 w-8 text-gray-400' />
                    </div>
                    <div>
                      <p className='text-gray-500 font-medium'>
                        Aucun article disponible
                      </p>
                      <p className='text-gray-400 text-sm'>
                        Commencez par créer votre premier article
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
