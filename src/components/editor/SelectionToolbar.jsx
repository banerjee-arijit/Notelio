import React, { useState } from 'react';
import { 
  Type, 
  Palette, 
  Bold as BoldIcon, 
  Italic as ItalicIcon, 
  Underline as UnderlineIcon, 
  Strikethrough as StrikethroughIcon, 
  Highlighter, 
  ChevronDown 
} from 'lucide-react';
import StyleDropdown from './StyleDropdown';
import ColorPalettePopover from './ColorPalettePopover';

export default function SelectionToolbar({
  selectionMenu,
  colorPalette,
  onApplyFormat
}) {
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);

  if (!selectionMenu.visible) return null;

  return (
    <div
      style={{ left: `${selectionMenu.x}px`, top: `${selectionMenu.y}px` }}
      className="fixed z-50 flex items-center gap-0.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl p-1 text-xs text-[var(--text-primary)] animate-in fade-in zoom-in-95 duration-150 backdrop-blur-none"
    >
      {/* Style Dropdown */}
      <div className="relative">
        <button
          onClick={() => {
            setShowStyleDropdown(!showStyleDropdown);
            setShowColorDropdown(false);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] font-medium transition-colors"
        >
          <Type className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          <span>{selectionMenu.currentStyle}</span>
          <ChevronDown className="w-3 h-3 opacity-60" />
        </button>

        {showStyleDropdown && (
          <StyleDropdown 
            onApplyFormat={(cmd, val, label) => {
              onApplyFormat(cmd, val, label);
              setShowStyleDropdown(false);
            }} 
          />
        )}
      </div>

      <div className="w-px h-4 bg-[var(--border-color)]/60 mx-1" />

      {/* Color Palette Popover */}
      <div className="relative">
        <button
          onClick={() => {
            setShowColorDropdown(!showColorDropdown);
            setShowStyleDropdown(false);
          }}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
          title="Color Palette"
        >
          <Palette className="w-3.5 h-3.5" />
          <ChevronDown className="w-2.5 h-2.5 opacity-60" />
        </button>

        {showColorDropdown && (
          <ColorPalettePopover
            palette={colorPalette}
            onSelectColor={(color) => {
              onApplyFormat('foreColor', color);
              setShowColorDropdown(false);
            }}
          />
        )}
      </div>

      {/* Bold */}
      <button
        onClick={() => onApplyFormat('bold')}
        className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        title="Bold"
      >
        <BoldIcon className="w-3.5 h-3.5" />
      </button>

      {/* Italic */}
      <button
        onClick={() => onApplyFormat('italic')}
        className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        title="Italic"
      >
        <ItalicIcon className="w-3.5 h-3.5" />
      </button>

      {/* Underline */}
      <button
        onClick={() => onApplyFormat('underline')}
        className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        title="Underline"
      >
        <UnderlineIcon className="w-3.5 h-3.5" />
      </button>

      {/* Strikethrough */}
      <button
        onClick={() => onApplyFormat('strikethrough')}
        className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        title="Strikethrough"
      >
        <StrikethroughIcon className="w-3.5 h-3.5" />
      </button>

      {/* Highlight */}
      <button
        onClick={() => onApplyFormat('highlight', '#fef08a')}
        className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-amber-500 hover:text-amber-400 transition-colors"
        title="Highlight"
      >
        <Highlighter className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
