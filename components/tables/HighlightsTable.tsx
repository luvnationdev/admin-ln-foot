"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc/react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Star, FileText, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import HighlightEditor from "@/components/Highlights/HighlightEditor";
import type { Highlight } from "@/types/highlight";

export default function HighlightsTable() {
  const { data: highlights, isLoading } = trpc.highlights.latest.useQuery();
  const [highlightToDelete, setHighlightToDelete] = useState<Highlight | null>(null);
  const [highlightToEdit, setHighlightToEdit] = useState<Highlight | null>(null);
  const utils = trpc.useUtils();
  const deleteHighlightMutation = trpc.highlights.deleteHighlight.useMutation({
    onSuccess: async () => {
      setHighlightToDelete(null);
      await utils.highlights.latest.invalidate();
    },
  });
  if (isLoading) {
    return (
      <div className='w-full p-12 flex flex-col items-center justify-center space-y-4'>
        <div className='animate-spin h-12 w-12 border-4 border-green-500 rounded-full border-t-transparent'></div>
        <p className='text-gray-500 text-sm'>Chargement des points forts...</p>
      </div>
    )
  }

  return (
    <div className='w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg'>
      {/* Header moderne avec gradient */}
      <div className='p-6 bg-gradient-to-r from-green-600 to-green-700 text-white'>
        <div className='flex items-center space-x-3'>
          <div className='p-2 bg-white/20 rounded-lg'>
            <Star className='h-6 w-6' />
          </div>
          <div>
            <h2 className='text-2xl font-bold'>Points Forts</h2>
            <p className='text-green-100 text-sm'>
              Gérez vos points forts et avantages
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
              <TableHead className='font-semibold text-gray-700'>Description</TableHead>
              <TableHead className='text-right font-semibold text-gray-700'>
                <div className='flex items-center justify-end space-x-2'>
                  <Calendar className='h-4 w-4' />
                  <span>Date</span>
                </div>
              </TableHead>
              <TableHead className='text-right font-semibold text-gray-700'>Actions</TableHead>
            </TableRow>
          </TableHeader>        <TableBody>
          {highlights?.length ? (
            highlights.map((highlight, index) => (
              <TableRow 
                key={highlight.id} 
                className='hover:bg-gray-50/50 transition-colors duration-200 border-b border-gray-100 group'
              >
                <TableCell className='py-4'>
                  <div className='space-y-2'>
                    <div className='font-semibold text-gray-900 line-clamp-2'>
                      {highlight.title}
                    </div>
                    <Badge variant='secondary' className='bg-green-100 text-green-700 border-green-200'>
                      ⭐ Point Fort
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className='py-4 max-w-[400px]'>
                  <p className='text-gray-600 text-sm line-clamp-3 leading-relaxed'>
                    {highlight.description || 'Aucune description disponible'}
                  </p>
                </TableCell>
                <TableCell className='text-right py-4'>
                  <div className='text-sm text-gray-500'>
                    {highlight.createdAt
                      ? formatDistanceToNow(new Date(highlight.createdAt), {
                          addSuffix: true,
                          locale: fr,
                        })
                      : "-"}
                  </div>
                </TableCell>
                <TableCell className='text-right py-4'>
                  <div className='flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-9 w-9 p-0 hover:bg-green-100 hover:text-green-600 transition-colors duration-200'
                          onClick={() => setHighlightToEdit(highlight)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='max-w-6xl max-h-[90vh] overflow-y-auto'>
                        <DialogHeader>
                          <DialogTitle>Modifier le point fort</DialogTitle>
                        </DialogHeader>
                        <div className='py-4'>
                          <HighlightEditor highlight={highlightToEdit} />
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-9 w-9 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-200'
                          onClick={() => setHighlightToDelete(highlight)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='max-w-md'>
                        <DialogHeader>
                          <DialogTitle className='text-red-600'>Supprimer le point fort</DialogTitle>
                          <DialogDescription className='text-gray-600'>
                            Êtes-vous sûr de vouloir supprimer ce point fort ? Cette action est irréversible.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className='mt-6 space-x-2'>
                          <Button
                            variant='outline'
                            onClick={() => setHighlightToDelete(null)}
                            className='border-gray-300'
                          >
                            Annuler
                          </Button>
                          <Button
                            variant='destructive'
                            onClick={() => {
                              if (highlightToDelete?.id) {
                                deleteHighlightMutation.mutate({ id: highlightToDelete.id });
                              }
                            }}
                            disabled={deleteHighlightMutation.isPending}
                            className='bg-red-600 hover:bg-red-700'
                          >
                            {deleteHighlightMutation.isPending ? "Suppression..." : "Supprimer"}
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
              <TableCell colSpan={4} className='text-center py-16'>
                <div className='flex flex-col items-center space-y-4'>
                  <div className='p-4 bg-gray-100 rounded-full'>
                    <Star className='h-8 w-8 text-gray-400' />
                  </div>
                  <div>
                    <p className='text-gray-500 font-medium'>Aucun point fort disponible</p>
                    <p className='text-gray-400 text-sm'>Commencez par créer votre premier point fort</p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
