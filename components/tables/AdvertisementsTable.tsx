"use client";

import React, { useState } from "react";
import type { Advertisement } from "@/types/advertisement";
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
import { Pencil, Trash2, Megaphone, FileText, Calendar, Link } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import AdvertisementEditor from "@/components/Advertisements/AdvertisementEditor";

export default function AdvertisementsTable() {  const { data: advertisements, isLoading } = trpc.advertisements.latest.useQuery();
  const [adToDelete, setAdToDelete] = useState<Advertisement | null>(null);
  const [adToEdit, setAdToEdit] = useState<Advertisement | null>(null);
  const utils = trpc.useUtils();
  const deleteAdMutation = trpc.advertisements.deleteAdvertisement.useMutation({
    onSuccess: () => {
      setAdToDelete(null);
      void utils.advertisements.latest.invalidate();
    },
  });
  if (isLoading) {
    return (
      <div className='w-full p-12 flex flex-col items-center justify-center space-y-4'>
        <div className='animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent'></div>
        <p className='text-gray-500 text-sm'>Chargement des publicités...</p>
      </div>
    )
  }

  return (
    <div className='w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg'>
      {/* Header moderne avec gradient */}
      <div className='p-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white'>
        <div className='flex items-center space-x-3'>
          <div className='p-2 bg-white/20 rounded-lg'>
            <Megaphone className='h-6 w-6' />
          </div>
          <div>
            <h2 className='text-2xl font-bold'>Publicités</h2>
            <p className='text-purple-100 text-sm'>
              Gérez vos publicités et campagnes
            </p>
          </div>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow className='bg-gray-50/80 border-b border-gray-200'>
              <TableHead className='w-[300px] font-semibold text-gray-700 py-4'>
                <div className='flex items-center space-x-2'>
                  <FileText className='h-4 w-4' />
                  <span>Titre</span>
                </div>
              </TableHead>
              <TableHead className='font-semibold text-gray-700'>Description</TableHead>
              <TableHead className='font-semibold text-gray-700'>
                <div className='flex items-center space-x-2'>
                  <Link className='h-4 w-4' />
                  <span>Lien</span>
                </div>
              </TableHead>
              <TableHead className='text-right font-semibold text-gray-700'>
                <div className='flex items-center justify-end space-x-2'>
                  <Calendar className='h-4 w-4' />
                  <span>Date</span>
                </div>
              </TableHead>
              <TableHead className='text-right font-semibold text-gray-700'>Actions</TableHead>
            </TableRow>
          </TableHeader>        <TableBody>
          {advertisements?.length ? (
            advertisements.map((ad, index) => (
              <TableRow 
                key={ad.id} 
                className='hover:bg-gray-50/50 transition-colors duration-200 border-b border-gray-100 group'
              >
                <TableCell className='py-4'>
                  <div className='space-y-2'>
                    <div className='font-semibold text-gray-900 line-clamp-2'>
                      {ad.title}
                    </div>
                    <Badge variant='secondary' className='bg-purple-100 text-purple-700 border-purple-200'>
                      📢 Publicité
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className='py-4 max-w-[300px]'>
                  <p className='text-gray-600 text-sm line-clamp-3 leading-relaxed'>
                    {ad.description || 'Aucune description disponible'}
                  </p>
                </TableCell>
                <TableCell className='py-4'>
                  {ad.referenceUrl ? (
                    <a 
                      href={ad.referenceUrl} 
                      target='_blank' 
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:text-blue-800 text-sm underline flex items-center space-x-1 max-w-[200px] truncate'
                    >
                      <Link className='h-3 w-3 flex-shrink-0' />
                      <span className='truncate'>{ad.referenceUrl}</span>
                    </a>
                  ) : (
                    <span className='text-gray-400 text-sm'>Aucun lien</span>
                  )}
                </TableCell>
                <TableCell className='text-right py-4'>
                  <div className='text-sm text-gray-500'>
                    {ad.createdAt
                      ? formatDistanceToNow(new Date(ad.createdAt), {
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
                          className='h-9 w-9 p-0 hover:bg-purple-100 hover:text-purple-600 transition-colors duration-200'
                          onClick={() => setAdToEdit(ad)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='max-w-6xl max-h-[90vh] overflow-y-auto'>
                        <DialogHeader>
                          <DialogTitle>Modifier la publicité</DialogTitle>
                        </DialogHeader>
                        <div className='py-4'>
                          <AdvertisementEditor advertisement={adToEdit} />
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-9 w-9 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-200'
                          onClick={() => setAdToDelete(ad)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='max-w-md'>
                        <DialogHeader>
                          <DialogTitle className='text-red-600'>Supprimer la publicité</DialogTitle>
                          <DialogDescription className='text-gray-600'>
                            Êtes-vous sûr de vouloir supprimer cette publicité ? Cette action est irréversible.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className='mt-6 space-x-2'>
                          <Button
                            variant='outline'
                            onClick={() => setAdToDelete(null)}
                            className='border-gray-300'
                          >
                            Annuler
                          </Button>
                          <Button
                            variant='destructive'
                            onClick={() => {
                              if (adToDelete?.id) {
                                deleteAdMutation.mutate({ id: adToDelete.id });
                              }
                            }}
                            disabled={deleteAdMutation.isPending}
                            className='bg-red-600 hover:bg-red-700'
                          >
                            {deleteAdMutation.isPending ? "Suppression..." : "Supprimer"}
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
                    <Megaphone className='h-8 w-8 text-gray-400' />
                  </div>
                  <div>
                    <p className='text-gray-500 font-medium'>Aucune publicité disponible</p>
                    <p className='text-gray-400 text-sm'>Commencez par créer votre première publicité</p>
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
