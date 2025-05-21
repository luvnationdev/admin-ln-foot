"use client";

import type React from "react";
import type { NewsArticle } from "@/types/news";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Edit2, Eye } from "lucide-react";
import { useState } from "react";

import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Custom Hooks
import { useNewsEditorForm } from "./hooks/useNewsEditorForm";
import { useEditorImageUpload } from "./hooks/useEditorImageUpload";

// Subcomponents
import { FeaturedImageUploader } from "./subcomponents/FeaturedImageUploader";
import { EditorToolbar } from "./subcomponents/EditorToolbar";
import { EditorPreview } from "./subcomponents/EditorPreview";
import { EditorImageUploadModal } from "./subcomponents/EditorImageUploadModal";

interface NewsEditorProps {
  article: NewsArticle | null;
}

export default function NewsEditor({ article }: NewsEditorProps) {
  const [view, setView] = useState<"edit" | "preview">("edit");
  const { userName } = useCurrentUser();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'max-h-[400px] w-auto object-contain',
        },
      }),
      Placeholder.configure({
        placeholder: "Commencez à écrire votre contenu ici...",
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: article?.content ?? "",
    editorProps: {
      attributes: {
        class:
          "prose prose-blue max-w-none focus:outline-none min-h-[200px] py-4",
      },
    },
  });

  const {
    title, setTitle,
    excerpt, setExcerpt,
    featuredImage,
    handleFeaturedImageFileSelect,
    removeFeaturedImage,
    fileInputRef,
    isSubmitting,
    handleSave,
    resetForm: resetNewsEditorForm,
  } = useNewsEditorForm({ article, editor, onFormReset: () => setView("edit") });

  const {
    isImageModalOpen,
    openEditorImageModal,
    closeEditorImageModal,
    editorImageFile,
    editorImagePreview,
    handleEditorImageFileSelect: handleModalImageSelect,
    handleConfirmUploadAndInsertEditorImage,
    imageInputRef: editorImageModalInputRef,
    isUploading: isEditorImageUploading, // Assume useEditorImageUpload now returns isUploading
  } = useEditorImageUpload(editor);


  const formattedDate = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      <FeaturedImageUploader
        featuredImage={featuredImage}
        onFileSelect={handleFeaturedImageFileSelect}
        onRemoveImage={removeFeaturedImage}
        fileInputRef={fileInputRef}
      />

      <Input
        placeholder="Titre de l'article"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-lg border-blue-200 focus:border-blue-500"
      />

      <Textarea
        placeholder="Résumé de l'article"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        className="border-blue-200 focus:border-blue-500"
        rows={2}
      />

      <Tabs
        value={view}
        onValueChange={(v) => setView(v as "edit" | "preview")}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-2">
          <TabsList className="grid grid-cols-2 w-64">
            <TabsTrigger value="edit" className="flex items-center gap-1">
              <Edit2 className="h-4 w-4" />
              Éditer
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              Prévisualiser
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="mt-0">
          <div className="border border-blue-200 rounded-lg overflow-hidden">
            <EditorToolbar editor={editor} onOpenImageModal={openEditorImageModal} />
            <EditorContent editor={editor} className="p-4" />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <EditorPreview
            featuredImage={featuredImage}
            title={title}
            excerpt={excerpt}
            editor={editor}
            userName={userName}
            formattedDate={formattedDate}
          />
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Badge className="border px-3 py-1.5 bg-secondary text-foreground">
            {userName}
          </Badge>
          <div className="w-2 h-2 bg-green-500 animate-pulse rounded-full"></div>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSubmitting || isEditorImageUploading}
          className="bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enregistrement..." : (isEditorImageUploading ? "Téléchargement image..." : "Enregistrer")}
        </Button>
      </div>

      <EditorImageUploadModal
        isOpen={isImageModalOpen}
        onClose={closeEditorImageModal}
        imageFile={editorImageFile}
        imagePreview={editorImagePreview}
        onFileSelect={handleModalImageSelect}
        onConfirmUpload={handleConfirmUploadAndInsertEditorImage}
        imageInputRef={editorImageModalInputRef}
        isUploading={isEditorImageUploading} // Pass isUploading to the modal
      />
    </div>
  );
}
