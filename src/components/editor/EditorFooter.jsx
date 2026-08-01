import React from 'react';

export default function EditorFooter({ wordCount, charCount, readingTime }) {
  return (
    <div className="px-6 sm:px-12 md:px-20 lg:px-32 py-3 max-w-4xl mx-auto w-full flex items-center justify-between text-[11px] text-[var(--text-muted)] opacity-60">
      <span>{wordCount} words &bull; {charCount} characters</span>
      <span>~{readingTime} min read</span>
    </div>
  );
}
