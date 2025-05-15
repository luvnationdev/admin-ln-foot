"use client";

import type React from "react";

import { useState, useRef } from "react";
import { X } from "lucide-react";

export default function PublicitesForm() {
  const [fileUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleVideoSelect = () => {
    // Simuler la sélection de fichier
    setVideoUrl("/placeholder-video.mp4");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique pour soumettre le formulaire
    console.log({ fileUrl });
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="file" className="block text-sm font-light">
            Insérer vidéo ou image
          </label>

          <div id="file">
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
          </div>
        </div>

        {/* Separator */}
        <div className="inline-flex items-center justify-center w-full">
          <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">
            ou
          </span>
        </div>

        {/* video ads */}
        <div className="space-y-2">
          <label htmlFor="video" className="block text-sm font-light">
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
            <button
              type="button"
              onClick={handleVideoSelect}
              className="px-3 py-2 text-white bg-gray-400 rounded-r-md"
            >
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
  );
}
