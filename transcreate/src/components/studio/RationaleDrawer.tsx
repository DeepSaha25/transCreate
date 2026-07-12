import { X } from 'lucide-react'
import type { TranscreatedLine } from '../../types/transcript'
import './RationaleDrawer.css'

interface Props {
  line: TranscreatedLine
  onClose: () => void
}

const CONFIDENCE_LABEL = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence — review recommended',
}

export default function RationaleDrawer({ line, onClose }: Props) {
  return (
    <div className="rationale-drawer animate-slide-up" role="complementary" aria-label="AI Rationale">
      <div className="rationale-drawer__header">
        <span className="rationale-drawer__title">AI Rationale</span>
        <button className="rationale-drawer__close" onClick={onClose} aria-label="Close rationale panel">
          <X size={16} />
        </button>
      </div>

      <div className="rationale-drawer__body">
        {/* Original */}
        <div className="rationale-section">
          <span className="rationale-section__label">Original</span>
          <p className="rationale-section__text rationale-section__text--original">{line.originalText}</p>
        </div>

        {/* Transcreated */}
        <div className="rationale-section">
          <span className="rationale-section__label">Transcreated</span>
          <p className="rationale-section__text rationale-section__text--new">{line.transcreatedText}</p>
          <div className="rationale-tags">
            <span className="badge badge-muted">[{line.emotionTag}]</span>
            <span className={`badge ${line.confidence === 'high' ? 'badge-green' : line.confidence === 'medium' ? 'badge-amber' : 'badge-muted'}`}>
              {CONFIDENCE_LABEL[line.confidence]}
            </span>
          </div>
        </div>

        {/* Rationale */}
        <div className="rationale-section">
          <span className="rationale-section__label">Why this adaptation?</span>
          <p className="rationale-section__body">{line.rationale}</p>
        </div>

        {/* Pronunciation */}
        {line.pronunciationHint && (
          <div className="rationale-section">
            <span className="rationale-section__label">Voice Actor Pronunciation Guide</span>
            <code className="rationale-pronunciation">{line.pronunciationHint}</code>
          </div>
        )}

        {/* Timestamps */}
        <div className="rationale-section">
          <span className="rationale-section__label">Timing</span>
          <code className="rationale-timing">{line.startTime} → {line.endTime}</code>
        </div>
      </div>
    </div>
  )
}
