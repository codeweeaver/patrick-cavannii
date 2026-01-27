import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Controller, useFormContext } from 'react-hook-form';
import { FiBold, FiItalic, FiList, FiType } from 'react-icons/fi';
import { FormGroup } from './FormGroup';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const btnClass = (active) => `
    p-2 rounded-lg transition-colors
    ${active ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-100'}
  `;

  return (
    <div className="mb-2 flex items-center gap-1 border-b border-gray-50 pb-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive('bold'))}
      >
        <FiBold />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive('italic'))}
      >
        <FiItalic />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive('bulletList'))}
      >
        <FiList />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive('heading'))}
      >
        <FiType />
      </button>
    </div>
  );
};

export const TextAreaInput = ({ name, label, placeholder }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <FormGroup label={label} error={errors[name]} id={name}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => {
          const editor = useEditor({
            extensions: [StarterKit],
            content: value,
            editorProps: {
              attributes: {
                class:
                  'prose prose-sm focus:outline-none min-h-[150px] max-h-[400px] overflow-y-auto px-4 py-3 text-sm',
              },
            },
            onUpdate: ({ editor }) => {
              onChange(editor.getHTML());
            },
          });

          return (
            <div
              className={`w-full rounded-xl border bg-white transition-all duration-300 ${errors[name] ? 'border-red-500 ring-2 ring-red-500/10' : 'focus-within:border-primary focus-within:ring-primary/10 border-gray-100 focus-within:ring-4'} `}
            >
              <div className="rounded-t-xl bg-gray-50/50 p-2">
                <MenuBar editor={editor} />
              </div>
              <EditorContent editor={editor} />
            </div>
          );
        }}
      />
    </FormGroup>
  );
};

export default TextAreaInput;
