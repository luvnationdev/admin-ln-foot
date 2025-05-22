import { useState, useRef } from "react";
import type React from "react";
import type { Editor } from "@tiptap/react";
import { useUploadFile } from "@/lib/minio/upload";
import { toast } from "sonner";

export function useEditorImageUpload(editor: Editor | null) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editorImageFile, setEditorImageFile] = useState<File | null>(null);
  const [editorImagePreview, setEditorImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false); // Add this line

  const { uploadFile: uploadEditorImageFileAndGetUrl } = useUploadFile(editorImageFile);

  const handleEditorImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditorImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditorImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setEditorImageFile(null);
      setEditorImagePreview(null);
    }
  };

  const openEditorImageModal = () => setIsImageModalOpen(true);

  const closeEditorImageModal = () => {
    setIsImageModalOpen(false);
    setEditorImageFile(null);
    setEditorImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleConfirmUploadAndInsertEditorImage = async () => {
    if (!editorImageFile || !editor ) return;

    setIsUploading(true); // Add this line
    const toastId = toast.loading("Téléversement de l'image en cours...");
    try {
      const imageUrl = await uploadEditorImageFileAndGetUrl();
      if (imageUrl) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
        toast.success("Image insérée avec succès!", { id: toastId });
        closeEditorImageModal();
      } else {
        throw new Error("URL d'image non retournée.");
      }
    } catch (error) {
      console.error("Editor image upload error:", error);
      toast.error("Échec du téléversement de l'image.", { id: toastId });
    } finally {
      setIsUploading(false); // Add this line
    }
  };

  return {
    isImageModalOpen,
    openEditorImageModal,
    closeEditorImageModal,
    editorImageFile,
    editorImagePreview,
    handleEditorImageFileSelect,
    handleConfirmUploadAndInsertEditorImage,
    imageInputRef,
    isUploading, // Add this line
  };
}
