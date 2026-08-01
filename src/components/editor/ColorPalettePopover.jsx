import React from 'react';

export default function ColorPalettePopover({ palette, onSelectColor }) {
  return (
    <div className="absolute left-0 top-9 z-50 grid grid-cols-7 gap-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl p-2 w-52 animate-in fade-in duration-100">
      {palette.map((item) => (
        <button
          key={item.name}
          onClick={() => onSelectColor(item.color)}
          style={{ backgroundColor: item.color }}
          className="w-5 h-5 rounded-full hover:scale-110 active:scale-95 transition-transform shadow-xs border border-black/10"
          title={item.name}
        />
      ))}
    </div>
  );
}
