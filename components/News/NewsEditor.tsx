"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Bold, Italic, List, ListOrdered, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { trpc } from '@/lib/trpc/react'


export default function NewsEditor() {
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [featuredImage, setFeaturedImage] = useState("")
  const [author, setAuthor] = useState("Autor (user Connected)")
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        class: "prose prose-blue max-w-none focus:outline-none min-h-[200px] py-4",
      },
    },
  })

  const { mutate: createNewsArticle } =
    trpc.newsArticles.createNewsArticle.useMutation()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setFeaturedImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    const content = editor?.getHTML()
    console.log({
      title,
      excerpt,
      featuredImage,
      content,
      author,
    })
    // Ici vous pourriez envoyer les données à votre API
    createNewsArticle(
      {
        imageUrl: '/placeholder.svg',
        title,
        summary: excerpt,
        sourceUrl: "lnfoot-cameroon",
        content: content || "",
      },
      {
        onError(error) {
          console.log(error)
        },
        onSuccess(data) {
          console.log("Sucessfull: ", data)
        },
      }
    )

    alert("Article enregistré!")
  }

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
                e.stopPropagation()
                setFeaturedImage("")
              }}
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="text-blue-500 text-center">
            <span className="text-3xl">+</span>
            <p className="mt-2 text-sm text-blue-500">Ajouter une image à la une</p>
          </div>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
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

      {/* Rich Text Editor */}
      <div className="border border-blue-200 rounded-lg overflow-hidden">
        <div className="flex items-center gap-1 p-2 border-b border-blue-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={cn("p-2 h-8 w-8", editor?.isActive("bold") && "bg-blue-100")}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={cn("p-2 h-8 w-8", editor?.isActive("italic") && "bg-blue-100")}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={cn("p-2 h-8 w-8", editor?.isActive("bulletList") && "bg-blue-100")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={cn("p-2 h-8 w-8", editor?.isActive("orderedList") && "bg-blue-100")}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = window.prompt("URL de l'image")
              if (url) {
                editor?.chain().focus().setImage({ src: url }).run()
              }
            }}
            className="p-2 h-8 w-8"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>
        <EditorContent editor={editor} className="p-4" />
      </div>

      {/* Author and Save */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <div className="border border-blue-200 rounded-md px-3 py-1.5 text-blue-600">{author}</div>
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-blue-200">
            <X className="h-4 w-4 mr-1" />
            Publier Aut.
          </Button>
          <Button onClick={handleSave} className="bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  )
}
