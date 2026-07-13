import { ArrowUpRight } from 'lucide-react';
import './OpenStudioButton.css';

export function OpenStudioButton({ text = "Open Studio — free" }: { text?: string }) {
  return (
    <button className="btn-open-studio">
      <span>{text}</span>
      <div className="icon-circle">
        <ArrowUpRight size={20} strokeWidth={2.5} />
      </div>
    </button>
  );
}
