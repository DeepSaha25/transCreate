import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import './UploadZone.css'

interface Props {
  onFileUpload: (file: File) => void
}

const ACCEPTED = ['.srt', '.vtt', '.txt']

export default function UploadZone({ onFileUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File) => onFileUpload(file)

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="upload-wrap">
      <div
        className={`upload-zone ${isDragging ? 'upload-zone--drag' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        id="upload-zone"
        aria-label="Upload subtitle or script file"
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".srt,.vtt,.txt"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          style={{ display: 'none' }}
          aria-hidden="true"
        />

        <div className="upload-zone__icon">
          <Upload size={22} strokeWidth={1.5} />
        </div>

        <div className="upload-zone__text">
          <p className="upload-zone__heading">Drop your file here</p>
          <p className="upload-zone__sub">Supports {ACCEPTED.join(', ')} — or click to browse</p>
        </div>

        <div className="upload-zone__formats">
          {ACCEPTED.map(f => (
            <span key={f} className="upload-format">{f}</span>
          ))}
        </div>
      </div>

      <p className="upload-note">
        No file? Paste raw dialog as a <code>.txt</code> — one line per subtitle.
      </p>
    </div>
  )
}
