import React from 'react';
import { 
  Type, 
  Heading1, 
  Heading2, 
  Heading3, 
  List as ListIcon, 
  ListOrdered, 
  CheckSquare, 
  Quote, 
  Code 
} from 'lucide-react';

export default function StyleDropdown({ onApplyFormat }) {
  return (
    <div className="absolute left-0 top-9 z-50 w-52 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl p-1 space-y-0.5 animate-in fade-in duration-100">
      <button
        onClick={() => onApplyFormat('paragraph', null, 'Text')}
        className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
      >
        <Type className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        <span>Text</span>
      </button>
      <button
        onClick={() => onApplyFormat('h1', null, 'Heading 1')}
        className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
      >
        <Heading1 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        <span>Heading 1 (Selection)</span>
      </button>
      <button
        onClick={() => onApplyFormat('h2', null, 'Heading 2')}
        className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
      >
        <Heading2 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        <span>Heading 2 (20px)</span>
      </button>
      <button
        onClick={() => onApplyFormat('h3', null, 'Heading 3')}
        className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
      >
        <Heading3 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        <span>Heading 3 (18px)</span>
      </button>
      <div className="my-1 border-t border-[var(--border-color)]/60" />
      <button
        onClick={() => onApplyFormat('bullet')}
        className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
      >
        <ListIcon className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        <span>Bulleted list</span>
      </button>
      <button
        onClick={() => onApplyFormat('number')}
        className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
      >
        <ListOrdered className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        <span>Numbered list</span>
      </button>
      <button
        onClick={() => onApplyFormat('checklist')}
        className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
      >
        <CheckSquare className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        <span>To-do list</span>
      </button>
      <button
        onClick={() => onApplyFormat('quote')}
        className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
      >
        <Quote className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        <span>Quote</span>
      </button>
      <button
        onClick={() => onApplyFormat('code')}
        className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
      >
        <Code className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        <span>Code block</span>
      </button>
    </div>
  );
}
