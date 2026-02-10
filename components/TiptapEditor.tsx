import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

export const TiptapEditor = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(value || '');
  }, [editor, value]);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center gap-4 text-slate-500">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'is-active' : ''}
        >
          <span className="material-symbols-outlined text-xl cursor-pointer hover:text-[#137fec]">format_bold</span>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'is-active' : ''}
        >
          <span className="material-symbols-outlined text-xl cursor-pointer hover:text-[#137fec]">format_italic</span>
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive('bulletList') ? 'is-active' : ''}
        >
          <span className="material-symbols-outlined text-xl cursor-pointer hover:text-[#137fec]">format_list_bulleted</span>
        </button>
      </div>
      <EditorContent editor={editor} className="w-full p-4 bg-white border-none text-sm min-h-[200px] focus:ring-0 outline-none text-[#111418]" />
    </div>
  );
};