"use client"

import type React from "react"

import { useState } from "react"

export default function PointsFortsForm() {
  const [title, setTitle] = useState("")
  const [videoUrl, setVideoUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique pour soumettre le formulaire
    console.log({ title, videoUrl })
  }

  const handleVideoSelect = () => {
    // Simuler la sélection de fichier
    setVideoUrl("/placeholder-video.mp4")
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Titre point fort
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="titre"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="video" className="block text-sm font-medium">
            Insérer vidéo
          </label>
          <div className="flex">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-grow px-3 py-2 border rounded-l-md"
              placeholder="lien"
            />
            <button type="button" onClick={handleVideoSelect} className="px-3 py-2 text-white bg-gray-400 rounded-r-md">
              Sélectionner vidéo
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
