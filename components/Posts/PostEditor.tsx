"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Bold, Italic, List, ListOrdered, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Edit2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "../ui/badge";
import { trpc } from "@/lib/trpc/react";

export default function PostEditor() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [author] = useState("Autor (user Connected)");
  const [view, setView] = useState<"edit" | "preview">("edit");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [autoPublish, setAutoPublish] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "Commencez à écrire votre contenu ici...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-blue max-w-none focus:outline-none min-h-[200px] py-4",
      },
    },
  });

  const { mutate: createNewsArticle } =
    trpc.newsArticles.createNewsArticle.useMutation();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFeaturedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const content = editor?.getHTML();
    console.log({
      title,
      excerpt,
      featuredImage,
      content,
      author,
      autoPublish,
    });

    // On doit changer ca par l'api des Posts (qui n'a pas encore ete implemetes)
    createNewsArticle({
      title,
      content: content ?? "",
      summary: excerpt,
      imageUrl: featuredImage ?? "",
      sourceUrl: "", // Vous pouvez ajouter une URL de source si nécessaire
      apiSource: author,
      apiNewsId: "", // Vous pouvez ajouter un ID d'article si nécessaire
    });

    alert(
      "Article enregistré!" +
        (autoPublish ? " Il sera publié automatiquement." : ""),
    );
  };

  return (
    <div className="space-y-4">
      {/* Featured Image Upload */}
      <div
        className="border-2 border-dashed border-blue-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        {featuredImage ? (
          <div className="relative w-full">
            <img
              src={featuredImage || "/placeholder.svg"}
              alt="Featured"
              className="w-full h-48 object-cover rounded-md"
            />
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-1"
              onClick={(e) => {
                e.stopPropagation();
                setFeaturedImage("");
              }}
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="text-blue-500 text-center">
            <span className="text-3xl">+</span>
            <p className="mt-2 text-sm text-blue-500">
              Ajouter une image à la une
            </p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>

      {/* Title */}
      <Input
        placeholder="Titre de l'article"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-lg border-blue-200 focus:border-blue-500"
      />

      {/* Excerpt */}
      <Textarea
        placeholder="Résumé de l'article"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        className="border-blue-200 focus:border-blue-500"
        rows={2}
      />

      {/* Tabs for Edit/Preview */}
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
          {/* Rich Text Editor */}
          <div className="border border-blue-200 rounded-lg overflow-hidden">
            <div className="flex items-center gap-1 p-2 border-b border-blue-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={cn(
                  "p-2 h-8 w-8",
                  editor?.isActive("bold") && "bg-blue-100",
                )}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={cn(
                  "p-2 h-8 w-8",
                  editor?.isActive("italic") && "bg-blue-100",
                )}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={cn(
                  "p-2 h-8 w-8",
                  editor?.isActive("bulletList") && "bg-blue-100",
                )}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                className={cn(
                  "p-2 h-8 w-8",
                  editor?.isActive("orderedList") && "bg-blue-100",
                )}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const url = window.prompt("URL de l'image");
                  if (url) {
                    editor?.chain().focus().setImage({ src: url }).run();
                  }
                }}
                className="p-2 h-8 w-8"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
            <EditorContent editor={editor} className="p-4" />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          {/* Preview */}
          <div className="border border-blue-200 rounded-lg p-6 bg-white">
            <div className="max-w-3xl mx-auto">
              {featuredImage && (
                <div className="mb-6">
                  <img
                    src={featuredImage || "/placeholder.svg"}
                    alt={title || "Featured image"}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {title ? (
                <h1 className="text-3xl font-bold mb-3">{title}</h1>
              ) : (
                <div className="h-9 w-3/4 bg-gray-100 rounded mb-3"></div>
              )}

              {excerpt ? (
                <p className="text-gray-600 mb-6 text-lg">{excerpt}</p>
              ) : (
                <div className="h-6 w-full bg-gray-100 rounded mb-6"></div>
              )}

              <div className="prose max-w-none">
                {editor?.isEmpty ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-100 rounded w-4/6"></div>
                  </div>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: editor?.getHTML() ?? "",
                    }}
                  ></div>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Écrit par {author}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Author info moved to tabs section */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Badge className="border  px-3 py-1.5 bg-secondary text-foreground">
            {author}
          </Badge>
          <div className="w-2 h-2 bg-green-500 animate-pulse rounded-full"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2 mr-2">
            <Checkbox
              id="auto-publish"
              checked={autoPublish}
              onCheckedChange={(checked) => setAutoPublish(checked as boolean)}
              className="border-blue-300 data-[state=checked]:bg-blue-500"
            />
            <label
              htmlFor="auto-publish"
              className="text-xs text-gray-500 cursor-pointer"
            >
              publier automatiquement
            </label>
          </div>
          <Button
            onClick={handleSave}
            className="bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
}
