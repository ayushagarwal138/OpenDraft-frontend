import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Youtube from '@tiptap/extension-youtube';
import postService from '../../services/postService';
import {
  Box,
  Toolbar,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatStrikethrough,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Clear
} from '@mui/icons-material';

const RichTextEditor = ({ value, onChange, placeholder = "Write an amazing story... (Markdown, tables, embeds supported!)" }) => {
  const theme = useTheme();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Avoid duplicate Link extension: we'll use the explicitly configured Link below
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'image',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'youtube-embed',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      if (onChange && editor) {
        onChange(editor.getHTML());
      }
    },
  }, [value, onChange]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const handleFilesUpload = async (fileList) => {
    const files = Array.from(fileList || []);
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const res = await postService.uploadImage(file);
        const url = res.data.url || res.data.path || res.data.location;
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      } catch (e) {
        // ignore upload errors silently here
      }
    }
  };

  const onDrop = async (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFilesUpload(e.dataTransfer.files);
    }
  };

  const onPaste = async (e) => {
    if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
      await handleFilesUpload(e.clipboardData.files);
    }
  };

  const addLink = () => {
    if (!editor) return;
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    if (!editor) return;
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addTable = () => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };
  const addYoutube = () => {
    if (!editor) return;
    const url = window.prompt('Enter YouTube URL');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
      {/* Toolbar */}
      <Toolbar sx={{ 
        backgroundColor: 'background.paper', 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        gap: 0.5,
        flexWrap: 'wrap'
      }}>
        {/* Text Formatting */}
        <IconButton
          size="small"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          color={editor?.isActive('bold') ? 'primary' : 'default'}
        >
          <FormatBold />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          color={editor?.isActive('italic') ? 'primary' : 'default'}
        >
          <FormatItalic />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          color={editor?.isActive('strike') ? 'primary' : 'default'}
        >
          <FormatStrikethrough />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Lists */}
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          color={editor.isActive('bulletList') ? 'primary' : 'default'}
        >
          <FormatListBulleted />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          color={editor.isActive('orderedList') ? 'primary' : 'default'}
        >
          <FormatListNumbered />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Block Elements */}
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          color={editor.isActive('blockquote') ? 'primary' : 'default'}
        >
          <FormatQuote />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          color={editor.isActive('codeBlock') ? 'primary' : 'default'}
        >
          <Code />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Media */}
        <IconButton
          size="small"
          onClick={addLink}
          color={editor.isActive('link') ? 'primary' : 'default'}
        >
          <LinkIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={addImage}
        >
          <ImageIcon />
        </IconButton>
        {/* Table */}
        <IconButton size="small" onClick={addTable} title="Insert Table">
          <svg width="20" height="20" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="15" x2="21" y2="15" stroke="currentColor" strokeWidth="2"/><line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" strokeWidth="2"/><line x1="15" y1="3" x2="15" y2="21" stroke="currentColor" strokeWidth="2"/></svg>
        </IconButton>
        {/* YouTube Embed */}
        <IconButton size="small" onClick={addYoutube} title="Embed YouTube Video">
          <svg width="20" height="20" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/><polygon points="10,9 16,12 10,15" fill="currentColor"/></svg>
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* History */}
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo />
        </IconButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Clear */}
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().clearContent().run()}
        >
          <Clear />
        </IconButton>
      </Toolbar>

      {/* Editor Content */}
      <Box sx={{ 
        minHeight: 300, 
        maxHeight: 500, 
        overflow: 'auto',
        p: 2,
        '& .ProseMirror': {
          outline: 'none',
          minHeight: 250,
          '& p': {
            margin: '0.5em 0',
            lineHeight: 1.6,
          },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            margin: '1em 0 0.5em 0',
            fontWeight: 600,
          },
          '& ul, & ol': {
            paddingLeft: '1.5em',
            margin: '0.5em 0',
          },
          '& blockquote': {
            borderLeft: `3px solid ${theme.palette.primary.main}`,
            margin: '1em 0',
            paddingLeft: '1em',
            fontStyle: 'italic',
            color: theme.palette.text.secondary,
          },
          '& code': {
            backgroundColor: theme.palette.grey[100],
            padding: '0.2em 0.4em',
            borderRadius: 3,
            fontSize: '0.9em',
          },
          '& pre': {
            backgroundColor: theme.palette.grey[100],
            padding: '1em',
            borderRadius: 4,
            overflow: 'auto',
            '& code': {
              backgroundColor: 'transparent',
              padding: 0,
            },
          },
          '& .link': {
            color: theme.palette.primary.main,
            textDecoration: 'underline',
            '&:hover': {
              color: theme.palette.primary.dark,
            },
          },
          '& .image': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 4,
          },
          '& .is-editor-empty:first-of-type::before': {
            color: theme.palette.text.disabled,
            content: `attr(data-placeholder)`,
            float: 'left',
            height: 0,
            pointerEvents: 'none',
          },
          '& .youtube-embed': {
            margin: '1em 0',
            display: 'flex',
            justifyContent: 'center',
          },
        },
      }} onDrop={onDrop} onPaste={onPaste}>
        <EditorContent editor={editor} />
      </Box>
      {/* Word/Character Count */}
      {editor && (
        <Box sx={{ p: 1, textAlign: 'right', color: 'text.secondary', fontSize: 13 }}>
          {`Words: ${editor.getText().split(/\s+/).filter(Boolean).length} | Characters: ${editor.getText().length}`}
        </Box>
      )}
    </Box>
  );
};

export default RichTextEditor; 