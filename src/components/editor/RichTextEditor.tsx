import BlockquoteExtension from "@tiptap/extension-blockquote";
import BulletListExtension from "@tiptap/extension-bullet-list";
import LinkExtension from "@tiptap/extension-link";
import ListItemExtension from "@tiptap/extension-list-item";
import OrderedListExtension from "@tiptap/extension-ordered-list";
import UnderlineExtension from "@tiptap/extension-underline";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKitExtension from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import type { Editor } from "@tiptap/react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      // Disable default list and blockquote functionality from StarterKit
      StarterKitExtension.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
      }),
      // Add our explicit extensions
      BulletListExtension,
      OrderedListExtension,
      ListItemExtension,
      BlockquoteExtension,
      UnderlineExtension,
      LinkExtension,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update the editor when the external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div>
      <MenuBar editor={editor} />
      <div className="rounded border p-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

const MenuBar = ({ editor }: { editor: Editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="mb-2 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold") ? "rounded bg-gray-700 p-1" : "rounded p-1"
        }
      >
        𝗕
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic") ? "rounded bg-gray-700 p-1" : "rounded p-1"
        }
      >
        𝘐
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={
          editor.isActive("underline")
            ? "rounded bg-gray-700 p-1"
            : "rounded p-1"
        }
      >
        <u>U</u>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike") ? "rounded bg-gray-700 p-1" : "rounded p-1"
        }
      >
        S
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={
          editor.isActive("bulletList")
            ? "rounded bg-gray-700 p-1"
            : "rounded p-1"
        }
      >
        •
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={
          editor.isActive("orderedList")
            ? "rounded bg-gray-700 p-1"
            : "rounded p-1"
        }
      >
        1.
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={
          editor.isActive("blockquote")
            ? "rounded bg-gray-700 p-1"
            : "rounded p-1"
        }
      >
        ❝
      </button>
    </div>
  );
};
