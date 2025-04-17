"use client"

import type React from "react"

import { useState } from "react"

export default function EnteteForm() {
  const [title, setTitle] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique pour soumettre le formulaire
    console.log({ title, imageUrl })
  }

  const handleFileSelect = () => {
    // Simuler la sélection de fichier
    setImageUrl("/placeholder-header.jpg")
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Titre
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Titre"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className="block text-sm font-medium">
            Insérer image
          </label>
          <div className="flex">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-grow px-3 py-2 border rounded-l-md"
              placeholder="lien"
            />
            <button type="button" onClick={handleFileSelect} className="px-3 py-2 text-white bg-gray-400 rounded-r-md">
              Sélectionner image
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600"
        >
          PUBLIER
        </button>
      </form>
    </div>
  )
}
