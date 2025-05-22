import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { UploadCloudIcon } from "lucide-react";

interface EditorImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageFile: File | null;
  imagePreview: string | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmUpload: () => void;
  isUploading: boolean;
  imageInputRef: React.RefObject<HTMLInputElement | null>; // Changed type here
}

export function EditorImageUploadModal({
  isOpen,
  onClose,
  imageFile,
  imagePreview,
  onFileSelect,
  onConfirmUpload,
  isUploading, // Add this line
  imageInputRef,
}: EditorImageUploadModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insérer une image dans l&pos;article</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400"
            onClick={() => imageInputRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="max-h-48 w-auto object-contain rounded-md mb-4" />
            ) : (
              <UploadCloudIcon className="w-12 h-12 text-gray-400 mb-2" />
            )}
            <span className="text-sm text-gray-500">
              {imageFile ? imageFile.name : "Cliquez pour choisir une image"}
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            className="hidden"
            onChange={onFileSelect}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={onConfirmUpload}
            disabled={!imageFile || isUploading}
          >
            {isUploading ? "Téléversement..." : "Téléverser et Insérer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
