'use client'

import { useUploadFile } from '@/lib/minio/upload'
import type React from 'react'
import { useRef, useState, useEffect } from 'react' // Added useEffect
import { toast } from 'sonner'
import { useHeadingControllerServicePostApiHeadings } from '@/lib/api-client/rq-generated/queries'
import { useQueryClient } from '@tanstack/react-query'
// Removed useSession as it's not directly used for auth token anymore

export default function HeadingsPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // For preview
  const [uploadFileInput, setUploadFileInput] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading: isFileUploading, error: fileUploadError } = useUploadFile(uploadFileInput); // Use isUploading and error from hook

  const createHeadingMutation = useHeadingControllerServicePostApiHeadings({
    onSuccess: () => {
      toast.success('Contenu créé avec succès !');
      setTitle('');
      setImageUrl('');
      setUploadFileInput(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      queryClient.invalidateQueries({ queryKey: ['headings'] }); // Assuming 'headings' is the query key for HeadingsList
    },
    onError: (error) => {
      toast.error(`Erreur lors de la création du contenu: ${error.message}`);
    },
  });

  // Effect to handle file upload errors specifically
  useEffect(() => {
    if (fileUploadError) {
      toast.error(`Erreur lors de l'upload de l'image: ${fileUploadError.message}`);
    }
  }, [fileUploadError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || (!imageUrl && !uploadFileInput)) { // imageUrl check can be for preview, uploadFileInput for actual file
      toast.error('Veuillez fournir un titre et une image.');
      return;
    }

    let finalThumbnailUrl = imageUrl;

    if (uploadFileInput) {
      try {
        toast.loading('Upload de la miniature...');
        finalThumbnailUrl = await uploadFile(); // uploadFile from hook should handle its own state
        toast.dismiss(); // Dismiss loading toast for upload
        toast.success('Image uploadée avec succès !');
      } catch (error) { // Error should be caught by useUploadFile hook's error state, but good to have safeguard
        toast.dismiss();
        console.error('Error uploading thumbnail:', error);
        // Toast for upload error is handled by useEffect above if fileUploadError is set
        if (!fileUploadError) toast.error("Erreur lors de l'upload de l'image.");
        return;
      }
    }

    if (!finalThumbnailUrl) { // Ensure URL is present after potential upload
        toast.error("L'URL de l'image est manquante après la tentative d'upload.");
        return;
    }

    createHeadingMutation.mutate({ requestBody: { imageUrl: finalThumbnailUrl, title } });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFileInput(file); // Set file for upload hook
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageUrl(ev.target?.result as string); // Set for preview
      };
      reader.readAsDataURL(file);
    } else {
      setUploadFileInput(null);
      // Optionally reset imageUrl if you want the preview to clear when file is deselected
      // setImageUrl('');
    }
  };

  const isSubmitting = createHeadingMutation.isPending || isFileUploading;

  return (
    <div className='w-full max-w-3xl mx-auto p-6 space-y-8'>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col sm:flex-row gap-6 justify-between space-y-6 p-4 rounded-md'
      >
        <div className='flex-1 space-y-4'>
          <div>
            <label htmlFor='title' className='block text-sm font-medium mb-1'>
              Titre
            </label>
            <input
              type='text'
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full px-3 py-2 border rounded-md'
              placeholder='Titre'
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor='image' className='block text-sm font-medium mb-1'>
              Image miniature
            </label>
            <div className='flex'>
              <input
                type='text'
                value={imageUrl} // Controlled by state for preview or manual input
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setUploadFileInput(null); // Clear file input if URL is typed manually
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className='flex-grow px-3 py-2 border rounded-l-md'
                placeholder='Lien de l’image ou sélectionner un fichier'
                disabled={isSubmitting}
              />
              <button
                type='button'
                onClick={() => fileInputRef.current?.click()}
                className='px-4 py-2 text-white bg-gray-500 rounded-r-md hover:bg-gray-600'
                disabled={isSubmitting}
              >
                Parcourir
              </button>
              <input
                type='file'
                accept='image/*'
                ref={fileInputRef}
                onChange={handleFileSelect}
                className='hidden'
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full py-3 font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600 disabled:opacity-50'
          >
            {isSubmitting ? 'Publication en cours...' : 'PUBLIER'}
          </button>
        </div>

        {imageUrl && ( // Show preview if imageUrl is set (from file or manual input)
          <div className='sm:w-1/3 flex justify-center items-start'>
            <img
              src={imageUrl}
              alt='Aperçu miniature'
              className='rounded-md max-h-40 w-full object-contain border'
            />
          </div>
        )}
      </form>
    </div>
  );
}
