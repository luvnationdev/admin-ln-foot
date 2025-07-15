import type React from "react";
import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlignCenterIcon,
  Bold,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  MinusIcon,
  UnderlineIcon,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
  onOpenImageModal: () => void;
}

export function EditorToolbar({ editor, onOpenImageModal }: EditorToolbarProps) {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-1 p-2 border-b border-blue-100 flex-wrap">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn("p-2 h-8", editor.isActive("bold") && "bg-blue-100")}
      >
        <Bold className={cn('h-4', editor.isActive("bold") && "text-black")} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn("p-2 h-8 w-8", editor.isActive("italic") && "bg-blue-100")}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn("p-2 h-8 w-8", editor.isActive("underline") && "bg-blue-100")}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={cn("p-2 h-8 w-8", editor.isActive({ textAlign: 'center' }) && "bg-blue-100")}
      >
        <AlignCenterIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn("p-2 h-8 w-8", editor.isActive("bulletList") && "bg-blue-100")}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn("p-2 h-8 w-8", editor.isActive("orderedList") && "bg-blue-100")}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onOpenImageModal}
        className="p-2 h-8 w-8"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 h-8 w-8"
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
