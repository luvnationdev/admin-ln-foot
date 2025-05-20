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
import { Pencil, Trash2 } from "lucide-react";
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
      <div className="w-full p-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <div className="p-4 bg-blue-50 border-b">
        <h2 className="text-xl font-semibold text-blue-700">Publicités</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Titre</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Lien</TableHead>
            <TableHead className="text-right">Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {advertisements?.length ? (
            advertisements.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell className="font-medium">{ad.title}</TableCell>
                <TableCell>{ad.imageUrl ?? ad.referenceUrl}</TableCell>
                <TableCell>{ad.referenceUrl}</TableCell>
                <TableCell className="text-right">
                  {ad.createdAt
                    ? formatDistanceToNow(new Date(ad.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })
                    : "-"}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setAdToEdit(ad)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Modifier la publicité</DialogTitle>
                      </DialogHeader>                      <div className="py-4">
                        <AdvertisementEditor advertisement={adToEdit} />
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:text-red-500"
                        onClick={() => setAdToDelete(ad)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Supprimer la publicité</DialogTitle>
                        <DialogDescription>
                          Êtes-vous sûr de vouloir supprimer cette publicité ? Cette action est irréversible.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-4">
                        <Button
                          variant="ghost"
                          onClick={() => setAdToDelete(null)}
                        >
                          Annuler
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            if (adToDelete?.id) {
                              deleteAdMutation.mutate({ id: adToDelete.id });
                            }
                          }}
                          disabled={deleteAdMutation.isPending}
                        >
                          {deleteAdMutation.isPending ? "Suppression..." : "Supprimer"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                Aucune publicité disponible
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
