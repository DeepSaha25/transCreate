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

  const handleFile = (file: File) => {
    onFileUpload(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="upload-zone-outer">
      <div
        className={`upload-zone ${isDragging ? 'upload-zone--dragging' : ''}`}
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
        <Upload size={28} color="var(--text-faint)" strokeWidth={1.5} />
        <div className="upload-zone__labels">
          <span className="upload-zone__main">Drop your subtitle or script file here</span>
          <span className="upload-zone__sub">Accepts {ACCEPTED.join(', ')} · click to browse</span>
        </div>
        <div className="upload-zone__formats">
          {ACCEPTED.map(f => (
            <span key={f} className="badge badge-muted">{f}</span>
          ))}
        </div>
      </div>

      <p className="upload-zone__note">
        No file? Paste raw dialog text directly as a <span className="badge badge-muted">.txt</span> file — one line per subtitle.
      </p>
    </div>
  )
}
