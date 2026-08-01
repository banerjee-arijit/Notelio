import React, { useRef, useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  Type, 
  Palette, 
  Bold as BoldIcon, 
  Italic as ItalicIcon, 
  Underline as UnderlineIcon, 
  Strikethrough as StrikethroughIcon, 
  List as ListIcon, 
  ListOrdered, 
  CheckSquare, 
  Highlighter, 
  Heading1, 
  Heading2, 
  Heading3, 
  Code,
  ChevronDown,
  Quote,
  Search,
  X,
  ChevronUp
} from 'lucide-react';

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
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);

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
        setShowSearch(true);
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
        setShowStyleDropdown(false);
        setShowColorDropdown(false);
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

  // Calculate statistics (strip HTML tags)
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

    setShowStyleDropdown(false);
    setShowColorDropdown(false);
    handleContentInput();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col animate-note-open relative">
      {/* Top Navigation Control */}
      <div className="px-6 sm:px-12 md:px-20 lg:px-32 py-6 flex items-center justify-between max-w-4xl mx-auto w-full">
        <button
          onClick={onBackToGrid}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors active:scale-95 duration-150"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Notebooks</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            title="Search inside notebook (Ctrl+F)"
            className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors active:scale-95 duration-150 flex items-center gap-1 text-xs"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title="Toggle Theme"
            className="p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors active:scale-95 duration-150"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* In-Note Search Floating Bar */}
      {showSearch && (
        <div className="max-w-4xl mx-auto w-full px-6 sm:px-12 md:px-20 lg:px-32 mb-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] p-2 rounded-2xl shadow-lg">
            <Search className="w-4 h-4 text-[var(--text-muted)] ms-2 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Find text inside this note..."
              value={inNoteSearch}
              onChange={(e) => handleInNoteSearchChange(e.target.value)}
              className="flex-1 bg-transparent text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
            />
            {inNoteSearch && (
              <span className="text-[11px] font-medium text-[var(--text-muted)] me-2">
                {matchCount} {matchCount === 1 ? 'match' : 'matches'}
              </span>
            )}
            <button
              onClick={closeSearch}
              className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Editor Content Canvas */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 sm:px-12 md:px-20 lg:px-32 py-4 flex flex-col" onClick={handleCanvasClick}>
        {/* Multi-line Auto-wrapping Notebook Title */}
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
      {selectionMenu.visible && (
        <div
          style={{ left: `${selectionMenu.x}px`, top: `${selectionMenu.y}px` }}
          className="fixed z-50 flex items-center gap-0.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl p-1 text-xs text-[var(--text-primary)] animate-in fade-in zoom-in-95 duration-150 backdrop-blur-none"
        >
          {/* Style Dropdown Trigger */}
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

            {/* Style Selection Popover */}
            {showStyleDropdown && (
              <div className="absolute left-0 top-9 z-50 w-52 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl p-1 space-y-0.5 animate-in fade-in duration-100">
                <button
                  onClick={() => applyDirectFormat('paragraph', null, 'Text')}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
                >
                  <Type className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span>Text</span>
                </button>
                <button
                  onClick={() => applyDirectFormat('h1', null, 'Heading 1')}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
                >
                  <Heading1 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span>Heading 1 (Selection)</span>
                </button>
                <button
                  onClick={() => applyDirectFormat('h2', null, 'Heading 2')}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
                >
                  <Heading2 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span>Heading 2 (20px)</span>
                </button>
                <button
                  onClick={() => applyDirectFormat('h3', null, 'Heading 3')}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
                >
                  <Heading3 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span>Heading 3 (18px)</span>
                </button>
                <div className="my-1 border-t border-[var(--border-color)]/60" />
                <button
                  onClick={() => applyDirectFormat('bullet')}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
                >
                  <ListIcon className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span>Bulleted list</span>
                </button>
                <button
                  onClick={() => applyDirectFormat('number')}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
                >
                  <ListOrdered className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span>Numbered list</span>
                </button>
                <button
                  onClick={() => applyDirectFormat('checklist')}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span>To-do list</span>
                </button>
                <button
                  onClick={() => applyDirectFormat('quote')}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
                >
                  <Quote className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span>Quote</span>
                </button>
                <button
                  onClick={() => applyDirectFormat('code')}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-[var(--bg-secondary)] rounded-lg flex items-center gap-2.5 transition-colors"
                >
                  <Code className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span>Code block</span>
                </button>
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-[var(--border-color)]/60 mx-1" />

          {/* Color Palette Trigger */}
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

            {/* Colors Expanded Grid Popover */}
            {showColorDropdown && (
              <div className="absolute left-0 top-9 z-50 grid grid-cols-7 gap-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl p-2 w-52 animate-in fade-in duration-100">
                {colorPalette.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => applyDirectFormat('foreColor', item.color)}
                    style={{ backgroundColor: item.color }}
                    className="w-5 h-5 rounded-full hover:scale-110 active:scale-95 transition-transform shadow-xs border border-black/10"
                    title={item.name}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Bold */}
          <button
            onClick={() => applyDirectFormat('bold')}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Bold"
          >
            <BoldIcon className="w-3.5 h-3.5" />
          </button>

          {/* Italic */}
          <button
            onClick={() => applyDirectFormat('italic')}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Italic"
          >
            <ItalicIcon className="w-3.5 h-3.5" />
          </button>

          {/* Underline */}
          <button
            onClick={() => applyDirectFormat('underline')}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Underline"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </button>

          {/* Strikethrough */}
          <button
            onClick={() => applyDirectFormat('strikethrough')}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Strikethrough"
          >
            <StrikethroughIcon className="w-3.5 h-3.5" />
          </button>

          {/* Highlight */}
          <button
            onClick={() => applyDirectFormat('highlight', '#fef08a')}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-amber-500 hover:text-amber-400 transition-colors"
            title="Highlight"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Ultra Minimal Footer */}
      <div className="px-6 sm:px-12 md:px-20 lg:px-32 py-3 max-w-4xl mx-auto w-full flex items-center justify-between text-[11px] text-[var(--text-muted)] opacity-60">
        <span>{wordCount} words &bull; {charCount} characters</span>
        <span>~{readingTime} min read</span>
      </div>
    </div>
  );
}
