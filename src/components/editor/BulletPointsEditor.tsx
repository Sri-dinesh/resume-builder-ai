import UnderlineExtension from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKitExtension from "@tiptap/starter-kit";
import DOMPurify from "dompurify";
import { Plus, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { Editor } from "@tiptap/react";

interface BulletPointsEditorProps {
  value?: string[];
  onChange: (value: string[]) => void;
  label?: string;
}

export function BulletPointsEditor({
  value = [],
  onChange,
  label = "RESPONSIBILITIES / ACHIEVEMENTS",
}: BulletPointsEditorProps) {
  const points = value.length > 0 ? value : [""];

  function handlePointChange(index: number, html: string) {
    const cleaned = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["b", "i", "u", "s", "strong", "em", "p", "br"],
      ALLOWED_ATTR: [],
    });
    const updated = [...points];
    updated[index] = cleaned;
    onChange(updated);
  }

  function handleAddPoint() {
    onChange([...points, ""]);
  }

  function handleRemovePoint(index: number) {
    const updated = points.filter((_, i) => i !== index);
    onChange(updated.length > 0 ? updated : [""]);
  }

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {points.map((point, index) => (
          <BulletItemRow
            key={index}
            index={index}
            value={point}
            onChange={(html) => handlePointChange(index, html)}
            onRemove={() => handleRemovePoint(index)}
            canRemove={points.length > 1 || point.length > 0}
          />
        ))}
      </div>
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddPoint}
          className="flex items-center gap-1 text-xs"
        >
          <Plus className="size-3.5" />
          Add Point
        </Button>
      </div>
    </div>
  );
}

interface BulletItemRowProps {
  index: number;
  value: string;
  onChange: (html: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function BulletItemRow({ value, onChange, onRemove }: BulletItemRowProps) {
  const editor = useEditor({
    extensions: [
      StarterKitExtension.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        codeBlock: false,
        heading: false,
      }),
      UnderlineExtension,
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  return (
    <div className="bg-muted/30 focus-within:border-primary/50 flex items-start gap-2 rounded-md border p-2 transition-colors">
      <span className="text-muted-foreground mt-2 text-sm select-none">•</span>
      <div className="flex-1 space-y-1">
        {editor && <MiniMenuBar editor={editor} />}
        <div className="bg-background min-h-[38px] rounded border px-3 py-1.5 text-sm">
          <EditorContent editor={editor} />
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="text-muted-foreground hover:text-destructive mt-1 h-8 w-8"
        title="Delete point"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

function MiniMenuBar({ editor }: { editor: Editor }) {
  return (
    <div className="flex items-center gap-1 border-b pb-1">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`hover:bg-muted h-6 w-6 rounded text-xs font-bold transition-colors ${
          editor.isActive("bold")
            ? "bg-muted text-primary font-black"
            : "text-muted-foreground"
        }`}
        title="Bold"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`hover:bg-muted h-6 w-6 rounded text-xs italic transition-colors ${
          editor.isActive("italic")
            ? "bg-muted text-primary font-black"
            : "text-muted-foreground"
        }`}
        title="Italic"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`hover:bg-muted h-6 w-6 rounded text-xs underline transition-colors ${
          editor.isActive("underline")
            ? "bg-muted text-primary font-black"
            : "text-muted-foreground"
        }`}
        title="Underline"
      >
        U
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`hover:bg-muted h-6 w-6 rounded text-xs line-through transition-colors ${
          editor.isActive("strike")
            ? "bg-muted text-primary font-black"
            : "text-muted-foreground"
        }`}
        title="Strikethrough"
      >
        S
      </button>
    </div>
  );
}
