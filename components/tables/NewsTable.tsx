'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { trpc } from '@/lib/trpc/react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { NewsArticle } from '@/types/news'

export default function NewsTable() {
  const { data: newsArticles, isLoading } = trpc.newsArticles.latest.useQuery()

  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <div className="p-4 bg-blue-50 border-b">
        <h2 className="text-xl font-semibold text-blue-700">News</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Titre</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Excerpt</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newsArticles?.length ? (
            /* eslint-disable @typescript-eslint/no-explicit-any */ 
            newsArticles.map((article: NewsArticle) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title ?? 'No Title'}</TableCell>
                <TableCell>{article.apiSource ?? 'Admin'}</TableCell>
                <TableCell>
                  {article.summary
                    ? article.summary.substring(0, 100) + '...'
                    : 'No content'}
                </TableCell>
                <TableCell className="text-right">
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                Aucun article disponible
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
