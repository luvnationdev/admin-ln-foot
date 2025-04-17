"use client"

import type React from "react"

import { useState } from "react"

export default function PublicitesForm() {
  const [fileUrl, setFileUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique pour soumettre le formulaire
    console.log({ fileUrl })
  }

  const handleFileSelect = () => {
    // Simuler la sélection de fichier
    setFileUrl("/placeholder-ad.jpg")
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="file" className="block text-sm font-medium">
            Insérer vidéo ou image
          </label>
          <div className="flex">
            <input
              type="text"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="flex-grow px-3 py-2 border rounded-l-md"
              placeholder="lien"
            />
            <button type="button" onClick={handleFileSelect} className="px-3 py-2 text-white bg-gray-400 rounded-r-md">
              Sélectionner Fichier
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
