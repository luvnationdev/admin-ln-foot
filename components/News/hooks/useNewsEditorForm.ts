import { useState, useRef } from "react";
import type React from "react";
import type { NewsArticle } from "@/types/news";
import { useUploadFile } from "@/lib/minio/upload";
import { trpc } from "@/lib/trpc/react";
import { toast } from "sonner";
import type { Editor } from "@tiptap/react";

interface UseNewsEditorFormProps {
    article: NewsArticle | null;
    editor: Editor | null;
    onFormReset?: () => void; // Callback for when form is reset (e.g., to reset view state)
}

export function useNewsEditorForm({ article, editor, onFormReset }: UseNewsEditorFormProps) {
    const [title, setTitle] = useState(article?.title ?? "");
    const [excerpt, setExcerpt] = useState(article?.summary ?? "");
    const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
    const [featuredImage, setFeaturedImage] = useState(article?.imageUrl ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: createNewsArticle } = trpc.newsArticles.createNewsArticle.useMutation();
    const { uploadFile: uploadFeaturedImageFileAndGetUrl } = useUploadFile(featuredImageFile);

    const handleFeaturedImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFeaturedImageFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setFeaturedImage(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFeaturedImage = () => {
        setFeaturedImage("");
        setFeaturedImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const resetForm = () => {
        setTitle("");
        setExcerpt("");
        removeFeaturedImage();
        editor?.commands.clearContent(true);
        if (onFormReset) {
            onFormReset();
        }
    };

    const handleSave = async () => {
        if (isSubmitting || !editor) return;

        setIsSubmitting(true);
        const submissionToastId = toast.loading("Enregistrement en cours...");

        const content = editor.getHTML();

        try {
            let finalImageUrl = featuredImage; // Existing image URL if not changed
            if (featuredImageFile) { // If a new file is selected, upload it
                const uploadedUrl = await uploadFeaturedImageFileAndGetUrl();
                if (!uploadedUrl) {
                    throw new Error("Échec du téléversement de l'image à la une.");
                }
                finalImageUrl = uploadedUrl;
            }

            if (!title || !excerpt || !finalImageUrl || !content || editor.isEmpty) {
                toast.error("Veuillez remplir tous les champs requis, y compris l'image à la une et le contenu.", { id: submissionToastId });
                setIsSubmitting(false);
                return;
            }

            createNewsArticle(
                {
                    title,
                    imageUrl: finalImageUrl,
                    summary: excerpt,
                    sourceUrl: "lnfoot-cameroon", // Consider making this dynamic if needed
                    content,
                },
                {
                    onError(error) {
                        console.error("Article creation error:", error);
                        toast.error("Erreur lors de la création de l'article.", { id: submissionToastId });
                        setIsSubmitting(false);
                    },
                    onSuccess(data) {
                        console.log("Successfully created article: ", data);
                        toast.success("Article créé avec succès!", { id: submissionToastId });
                        resetForm();
                        setIsSubmitting(false);
                    },
                }
            );
        } catch (error) {
            console.error("Save operation error:", error);
            toast.error((error as Error).message || "Impossible de traiter l'article.", { id: submissionToastId });
            setIsSubmitting(false);
        }
    };

    return {
        title,
        setTitle,
        excerpt,
        setExcerpt,
        featuredImage,
        featuredImageFile,
        handleFeaturedImageFileSelect,
        removeFeaturedImage,
        fileInputRef,
        isSubmitting,
        handleSave,
        resetForm,
    };
}
