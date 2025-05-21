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
      <div className="w-full p-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <div className="p-4 bg-blue-50 border-b">
        <h2 className="text-xl font-semibold text-blue-700">Points Forts</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Titre</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {highlights?.length ? (
            highlights.map((highlight) => (
              <TableRow key={highlight.id}>
                <TableCell className="font-medium">{highlight.title}</TableCell>
                <TableCell>{highlight.description}</TableCell>
                <TableCell className="text-right">
                  {highlight.createdAt
                    ? formatDistanceToNow(new Date(highlight.createdAt), {
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
                        onClick={() => setHighlightToEdit(highlight)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Modifier le point fort</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <HighlightEditor highlight={highlightToEdit} />
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:text-red-500"
                        onClick={() => setHighlightToDelete(highlight)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Supprimer le point fort</DialogTitle>
                        <DialogDescription>
                          Êtes-vous sûr de vouloir supprimer ce point fort ? Cette action est irréversible.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="mt-4">
                        <Button
                          variant="ghost"
                          onClick={() => setHighlightToDelete(null)}
                        >
                          Annuler
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            if (highlightToDelete?.id) {
                              deleteHighlightMutation.mutate({ id: highlightToDelete.id });
                            }
                          }}
                          disabled={deleteHighlightMutation.isPending}
                        >
                          {deleteHighlightMutation.isPending ? "Suppression..." : "Supprimer"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                Aucun point fort disponible
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
