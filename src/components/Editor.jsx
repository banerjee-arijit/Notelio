import React, { useRef, useEffect, useState } from 'react';
import EditorHeader from './editor/EditorHeader';
import InNoteSearchBar from './editor/InNoteSearchBar';
import SelectionToolbar from './editor/SelectionToolbar';
import EditorFooter from './editor/EditorFooter';

export default function Editor({
  title,
  content,
  onChangeTitle,
  onChangeContent,
  onBackToGrid,
  theme,
  onToggleTheme
}) {
  const contentEditableRef = useRef(null);
  const titleRef = useRef(null);

  // Selection Floating Menu State
  const [selectionMenu, setSelectionMenu] = useState({ visible: false, x: 0, y: 0, currentStyle: 'Text' });

  // In-Note Search Bar State
  const [showSearch, setShowSearch] = useState(false);
  const [inNoteSearch, setInNoteSearch] = useState('');
  const [matchCount, setMatchCount] = useState(0);

  // Expanded 14 Colors Palette
  const colorPalette = [
    { name: 'Black', color: '#18181b' },
    { name: 'Charcoal', color: '#3f3f46' },
    { name: 'Red', color: '#ef4444' },
    { name: 'Rose', color: '#f43f5e' },
    { name: 'Orange', color: '#f97316' },
    { name: 'Amber', color: '#f59e0b' },
    { name: 'Yellow', color: '#eab308' },
    { name: 'Emerald', color: '#10b981' },
    { name: 'Teal', color: '#14b8a6' },
    { name: 'Cyan', color: '#06b6d4' },
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Indigo', color: '#6366f1' },
    { name: 'Purple', color: '#a855f7' },
    { name: 'Pink', color: '#ec4899' },
  ];

  // Sync content into contentEditable on initial load / note change
  useEffect(() => {
    if (contentEditableRef.current && contentEditableRef.current.innerHTML !== (content || '')) {
      contentEditableRef.current.innerHTML = content || '';
    }
  }, [content]);

  // Adjust Title Textarea height on load or title change
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [title]);

  // Handle Ctrl+F for In-Note Search
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Perform In-Note Search highlighting
  const handleInNoteSearchChange = (query) => {
    setInNoteSearch(query);
    const editor = contentEditableRef.current;
    if (!editor) return;

    // Remove existing search highlights
    const marks = editor.querySelectorAll('mark.search-highlight');
    marks.forEach(mark => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });

    if (!query.trim()) {
      setMatchCount(0);
      return;
    }

    // Highlight matches
    let count = 0;
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, null, false);
    const nodesToReplace = [];

    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue && node.nodeValue.toLowerCase().includes(query.toLowerCase())) {
        nodesToReplace.push(node);
      }
    }

    nodesToReplace.forEach(node => {
      const parent = node.parentNode;
      if (!parent || parent.tagName === 'MARK') return;

      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = node.nodeValue.split(regex);
      const fragment = document.createDocumentFragment();

      parts.forEach(part => {
        if (part.toLowerCase() === query.toLowerCase()) {
          count++;
          const mark = document.createElement('mark');
          mark.className = 'search-highlight';
          mark.style.backgroundColor = '#fef08a';
          mark.style.color = '#0f172a';
          mark.style.borderRadius = '0.2rem';
          mark.style.padding = '0.1rem 0.25rem';
          mark.textContent = part;
          fragment.appendChild(mark);
        } else {
          fragment.appendChild(document.createTextNode(part));
        }
      });

      parent.replaceChild(fragment, node);
    });

    setMatchCount(count);
  };

  const closeSearch = () => {
    handleInNoteSearchChange('');
    setShowSearch(false);
  };

  // Handle selection changes
  const handleSelectionCheck = () => {
    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        setSelectionMenu((prev) => ({ ...prev, visible: false }));
        return;
      }

      if (contentEditableRef.current && contentEditableRef.current.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        const menuWidth = 340;
        let posX = rect.left + rect.width / 2 - menuWidth / 2;
        let posY = rect.top - 58;

        if (posX < 20) posX = 20;
        if (posX + menuWidth > window.innerWidth - 20) posX = window.innerWidth - menuWidth - 20;
        if (posY < 60) posY = rect.bottom + 10;

        setSelectionMenu({
          visible: true,
          x: posX,
          y: posY,
          currentStyle: 'Text'
        });
      }
    }, 10);
  };

  // Handle innerHTML updates & automatic cleanup of empty code blocks
  const handleContentInput = () => {
    if (contentEditableRef.current) {
      const preBlocks = contentEditableRef.current.querySelectorAll('pre');
      preBlocks.forEach((pre) => {
        if (!pre.textContent.trim()) {
          pre.remove();
        }
      });

      onChangeContent(contentEditableRef.current.innerHTML);
    }
  };

  // Handle key navigation inside code blocks
  const handleKeyDown = (e) => {
    const selection = window.getSelection();
    if (!selection || !selection.anchorNode) return;

    let node = selection.anchorNode;
    while (node && node !== contentEditableRef.current && node.tagName !== 'PRE') {
      node = node.parentNode;
    }

    if (node && node.tagName === 'PRE') {
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        node.parentNode.insertBefore(p, node.nextSibling);
        
        const range = document.createRange();
        range.setStart(p, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const handleCanvasClick = (e) => {
    if (e.target === contentEditableRef.current) {
      const editor = contentEditableRef.current;
      const lastChild = editor.lastElementChild;
      if (!lastChild || lastChild.tagName === 'PRE') {
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        editor.appendChild(p);
      }
    }
  };

  // Calculate statistics
  const plainText = content ? content.replace(/<[^>]+>/g, '') : '';
  const wordCount = plainText ? plainText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = plainText ? plainText.length : 0;
  const readingTime = Math.ceil(wordCount / 200);

  // Apply inline formatting to ONLY selected text
  const applyInlineFormatting = (stylesHtml) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const selectedText = selection.toString();
    if (!selectedText) return;

    const formattedHtml = stylesHtml.replace('%s', selectedText);
    document.execCommand('insertHTML', false, formattedHtml);
    handleContentInput();
  };

  // Apply direct visual formatting
  const applyDirectFormat = (command, value = null, styleLabel = null) => {
    const editor = contentEditableRef.current;
    if (!editor) return;

    editor.focus();

    switch (command) {
      case 'h1':
        applyInlineFormatting('<span style="font-size: 2.25rem; font-weight: 800; line-height: 1.25;">%s</span>');
        if (styleLabel) setSelectionMenu((prev) => ({ ...prev, currentStyle: 'Heading 1' }));
        break;
      case 'h2':
        applyInlineFormatting('<span style="font-size: 20px; font-weight: 700; line-height: 1.35;">%s</span>');
        if (styleLabel) setSelectionMenu((prev) => ({ ...prev, currentStyle: 'Heading 2' }));
        break;
      case 'h3':
        applyInlineFormatting('<span style="font-size: 18px; font-weight: 700; line-height: 1.4;">%s</span>');
        if (styleLabel) setSelectionMenu((prev) => ({ ...prev, currentStyle: 'Heading 3' }));
        break;
      case 'paragraph':
        applyInlineFormatting('<span style="font-size: 1rem; font-weight: 400;">%s</span>');
        if (styleLabel) setSelectionMenu((prev) => ({ ...prev, currentStyle: 'Text' }));
        break;
      case 'code':
        document.execCommand('insertHTML', false, '<pre class="code-block" style="background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 0.75rem 1rem; border-radius: 0.5rem; font-family: var(--font-mono); font-size: 0.9rem; margin: 0.75rem 0;"><code>' + (window.getSelection()?.toString() || 'code here...') + '</code></pre><p><br></p>');
        break;
      case 'bold':
        document.execCommand('bold', false, null);
        break;
      case 'italic':
        document.execCommand('italic', false, null);
        break;
      case 'underline':
        document.execCommand('underline', false, null);
        break;
      case 'strikethrough':
        document.execCommand('strikeThrough', false, null);
        break;
      case 'foreColor':
        document.execCommand('foreColor', false, value);
        break;
      case 'highlight':
        document.execCommand('hiliteColor', false, value || '#fef08a');
        break;
      case 'bullet':
        document.execCommand('insertUnorderedList', false, null);
        break;
      case 'number':
        document.execCommand('insertOrderedList', false, null);
        break;
      case 'checklist':
        document.execCommand('insertHTML', false, '<div style="display:flex; align-items:center; gap:0.5rem; margin:0.35rem 0;"><input type="checkbox" style="width:1.15rem; height:1.15rem; cursor:pointer;" /> <span>Task item</span></div><p><br></p>');
        break;
      case 'quote':
        document.execCommand('formatBlock', false, '<blockquote>');
        break;
      default:
        break;
    }

    handleContentInput();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col animate-note-open relative">
      {/* Top Navigation Control */}
      <EditorHeader
        onBackToGrid={onBackToGrid}
        showSearch={showSearch}
        onToggleSearch={() => setShowSearch(!showSearch)}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {/* In-Note Search Bar */}
      {showSearch && (
        <InNoteSearchBar
          query={inNoteSearch}
          matchCount={matchCount}
          onChangeQuery={handleInNoteSearchChange}
          onClose={closeSearch}
        />
      )}

      {/* Editor Content Canvas */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 sm:px-12 md:px-20 lg:px-32 py-4 flex flex-col" onClick={handleCanvasClick}>
        {/* Notebook Title Textarea */}
        <textarea
          ref={titleRef}
          rows={1}
          placeholder="Notebook Title"
          value={title}
          onChange={(e) => {
            onChangeTitle(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          className="w-full bg-transparent text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] placeholder-[var(--text-muted)] border-none outline-none resize-none overflow-hidden leading-tight mb-6 tracking-tight"
        />

        {/* Direct Visual WYSIWYG Editor */}
        <div
          ref={contentEditableRef}
          contentEditable
          onInput={handleContentInput}
          onKeyDown={handleKeyDown}
          onMouseUp={handleSelectionCheck}
          onKeyUp={handleSelectionCheck}
          data-placeholder="Write your note here... (Select any text to reveal format toolbar)"
          className="w-full flex-1 min-h-[500px] bg-transparent text-base sm:text-lg text-[var(--text-primary)] outline-none resize-none leading-relaxed note-content-rendered empty:before:content-[attr(data-placeholder)] empty:before:text-[var(--text-muted)]"
        />
      </div>

      {/* AUTOMATIC FLOATING SELECTION TOOLBAR */}
      <SelectionToolbar
        selectionMenu={selectionMenu}
        colorPalette={colorPalette}
        onApplyFormat={applyDirectFormat}
      />

      {/* Footer */}
      <EditorFooter
        wordCount={wordCount}
        charCount={charCount}
        readingTime={readingTime}
      />
    </div>
  );
}
