"use client";

import type React from "react";

import { useState, useRef } from "react";
import { X, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { useUploadFile } from "@/lib/minio/upload";
import { trpc } from "@/lib/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PublicitesForm() {
  // États principaux
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploadFileInput, setUploadFile] = useState<File | null>(null);
  const [featuredImage, setFeaturedImage] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

  // Refs pour file inputs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // TRPC & upload
  const { mutate: createAdvertisement } =
    trpc.advertisements.createAdvertisement.useMutation();
  const { uploadFile } = useUploadFile(uploadFileInput);

  // Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaType("image");
    setVideoUrl("");
    setUploadFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setFeaturedImage(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMediaType("video");
    setFeaturedImage("");
    setUploadFile(null);
    setVideoUrl(e.target.value);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setReferenceUrl("");
    setVideoUrl("");
    setFeaturedImage("");
    setUploadFile(null);
    setMediaType("image");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Le titre est requis");
      return;
    }
    if (mediaType === "image" && !uploadFileInput) {
      toast.error("Veuillez sélectionner une image");
      return;
    }
    if (mediaType === "video" && !videoUrl.trim()) {
      toast.error("Veuillez fournir une URL de vidéo");
      return;
    }

    const toastId = toast.loading("Création de la publicité en cours...");

    try {
      let finalMediaUrl = videoUrl;
      if (mediaType === "image" && uploadFileInput) {
        toast.loading("Upload de l'image...", { id: toastId });
        finalMediaUrl = await uploadFile(uploadFileInput);
      }

      toast.loading("Enregistrement de la publicité...", { id: toastId });
      createAdvertisement(
        {
          title,
          description,
          referenceUrl,
          imageUrl: finalMediaUrl,
        },
        {
          onSuccess: () => {
            toast.success("Publicité créée avec succès !", { id: toastId });
            resetForm();
          },
          onError: (error) => {
            toast.error(`Erreur : ${error.message}`, { id: toastId });
          },
        }
      );
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue", { id: toastId });
    }
  };

  // Rendu
  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sélecteur de type média */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Média de la publicité</h3>
          <div className="flex space-x-4 mb-2">
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${
                mediaType === "image"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setMediaType("image")}
            >
              Image
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md ${
                mediaType === "video"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setMediaType("video")}
            >
              Vidéo
            </button>
          </div>

          {/* Upload image */}
          {mediaType === "image" && (
            <div
              className="border-2 border-dashed border-blue-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {featuredImage ? (
                <div className="relative w-full">
                  <img
                    src={featuredImage}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-white rounded-full p-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFeaturedImage("");
                      setUploadFile(null);
                    }}
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              ) : (
                <div className="text-blue-500 text-center">
                  <span className="text-3xl">+</span>
                  <p className="mt-2 text-sm">Ajouter une image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          )}

          {/* Saisie URL vidéo */}
          {mediaType === "video" && (
            <div className="space-y-2">
              <Input
                type="text"
                value={videoUrl}
                onChange={handleVideoUrlChange}
                placeholder="URL de la vidéo (YouTube, Vimeo, etc.)"
              />
              {videoUrl && (
                <div className="mt-2 p-2 border rounded-md">
                  <p className="text-sm text-gray-600">
                    URL vidéo : {videoUrl}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Titre */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium">
            Titre de la publicité
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la publicité"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={4}
          />
        </div>

        {/* URL de référence */}
        <div className="space-y-2">
          <label htmlFor="referenceUrl" className="block text-sm font-medium">
            URL de référence
          </label>
          <div className="flex items-center space-x-2">
            <LinkIcon className="h-4 w-4 text-gray-500" />
            <Input
              id="referenceUrl"
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            className="px-4 bg-orange-400 rounded-sm"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="px-4 font-semibold bg-blue-500 hover:bg-blue-600"
          >
            PUBLIER
          </Button>
        </div>
      </form>
            <div className="flex justify-between items-center mb-4">
        <Button variant="outline">
          <a href="/dashboard/content/advertisements">
            Voir toutes les publicités
          </a>
        </Button>
      </div>

    </div>
  );
}
