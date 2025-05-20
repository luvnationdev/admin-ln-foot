"use client";

import { useState, useRef } from "react";
import { X, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useUploadFile } from '@/lib/minio/upload';
import { trpc } from '@/lib/trpc/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AdvertisementEditorProps {
  advertisement?: any;
}

export default function AdvertisementEditor({ advertisement }: AdvertisementEditorProps) {
  const [title, setTitle] = useState(advertisement?.title || '');
  const [description, setDescription] = useState(advertisement?.description || '');
  const [referenceUrl, setReferenceUrl] = useState(advertisement?.redirectUrl || '');
  const [videoUrl, setVideoUrl] = useState(advertisement?.videoUrl || '');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [featuredImage, setFeaturedImage] = useState(advertisement?.imageUrl || "");
  const [mediaType, setMediaType] = useState<'image' | 'video'>(advertisement?.mediaType || 'image');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateAdvertisement } = trpc.advertisements.updateAdvertisement.useMutation({
    onSuccess: () => {
      toast.success('Publicité mise à jour avec succès!');
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour de la publicité');
    }
  });

  const { uploadUrl } = useUploadFile(uploadFile);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaType('image');
      setVideoUrl('');
      setUploadFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFeaturedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!advertisement?.id) return;

    let imageUrl = advertisement.imageUrl;
    if (uploadFile) {
      imageUrl = await uploadUrl();
    }

    updateAdvertisement({
      id: advertisement.id,
      title,
      description,
      referenceUrl: referenceUrl,
      imageUrl: mediaType === 'image' ? imageUrl : null,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <Input
          placeholder="Titre de la publicité"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg"
        />

        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="url"
              placeholder="URL de référence"
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(referenceUrl, '_blank')}
              disabled={!referenceUrl}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type de média</label>
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}
              className="w-full p-2 border rounded-md"
            >
              <option value="image">Image</option>
              <option value="video">Vidéo</option>
            </select>
          </div>
        </div>

        {mediaType === 'image' && (
          <div
            className="border-2 border-dashed border-blue-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {featuredImage ? (
              <div className="relative w-full">
                <img
                  src={featuredImage}
                  alt="Featured"
                  className="w-full h-48 object-cover rounded-md"
                />
                <button
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
                <p className="mt-2 text-sm text-blue-500">Ajouter une image</p>
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
        )}

        {mediaType === 'video' && (
          <Input
            type="url"
            placeholder="URL de la vidéo"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        )}

        <Button
          onClick={handleSave}
          className="w-full"
        >
          Mettre à jour
        </Button>
      </div>
    </div>
  );
}
