import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['blockquote', 'code-block'],
    ['link'],
    [{ align: [] }],
    ['clean']
  ]
}

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent', 'blockquote',
  'code-block', 'link', 'align'
]

export default function RichTextEditor({ value, onChange, darkMode = true }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <style>{`
        .ql-toolbar {
          background: ${darkMode ? '#242424' : '#f5f5f5'} !important;
          border: 1px solid ${darkMode ? '#333' : '#ddd'} !important;
          border-bottom: none !important;
          border-radius: 8px 8px 0 0 !important;
        }
        .ql-toolbar .ql-stroke {
          stroke: ${darkMode ? '#ccc' : '#444'} !important;
        }
        .ql-toolbar .ql-fill {
          fill: ${darkMode ? '#ccc' : '#444'} !important;
        }
        .ql-toolbar .ql-picker {
          color: ${darkMode ? '#ccc' : '#444'} !important;
        }
        .ql-toolbar .ql-picker-options {
          background: ${darkMode ? '#2a2a2a' : '#fff'} !important;
          border: 1px solid ${darkMode ? '#444' : '#ddd'} !important;
        }
        .ql-toolbar button:hover .ql-stroke,
        .ql-toolbar button.ql-active .ql-stroke {
          stroke: #c0392b !important;
        }
        .ql-toolbar button:hover .ql-fill,
        .ql-toolbar button.ql-active .ql-fill {
          fill: #c0392b !important;
        }
        .ql-toolbar button:hover,
        .ql-toolbar button.ql-active {
          color: #c0392b !important;
        }
        .ql-container {
          background: ${darkMode ? '#1e1e1e' : '#fff'} !important;
          border: 1px solid ${darkMode ? '#333' : '#ddd'} !important;
          border-radius: 0 0 8px 8px !important;
          font-family: Inter, sans-serif !important;
          font-size: 0.95rem !important;
          min-height: 200px !important;
        }
        .ql-editor {
          color: ${darkMode ? '#e8e8e8' : '#111'} !important;
          min-height: 200px !important;
          line-height: 1.8 !important;
        }
        .ql-editor.ql-blank::before {
          color: ${darkMode ? '#555' : '#aaa'} !important;
          font-style: normal !important;
        }
        .ql-editor h1, .ql-editor h2, .ql-editor h3 {
          font-family: 'Playfair Display', serif !important;
          color: ${darkMode ? '#fff' : '#111'} !important;
        }
        .ql-editor blockquote {
          border-left: 4px solid #c0392b !important;
          padding-left: 16px !important;
          color: ${darkMode ? '#aaa' : '#555'} !important;
        }
        .ql-editor code, .ql-editor pre {
          background: ${darkMode ? '#2a2a2a' : '#f5f5f5'} !important;
          color: ${darkMode ? '#e8e8e8' : '#333'} !important;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Write your article here..."
      />
    </div>
  )
}