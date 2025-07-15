import type React from "react";
import { X } from "lucide-react";

interface FeaturedImageUploaderProps {
  featuredImage: string | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function FeaturedImageUploader({
  featuredImage,
  onFileSelect,
  onRemoveImage,
  fileInputRef,
}: FeaturedImageUploaderProps) {
  return (
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
              onRemoveImage();
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
        onChange={onFileSelect}
      />
    </div>
  );
}
