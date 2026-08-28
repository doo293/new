import React, { useState, useEffect } from 'react';
import { 
  ClipboardPaste, 
  Check, 
  Plus,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface PasteInputProps {
  onPasteText: (text: string) => void;
  lastParsedCount?: number;
}

export const PasteInput: React.FC<PasteInputProps> = ({ onPasteText }) => {
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // 전역 Ctrl+V 리스너
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA';
      
      if (!isInput && e.clipboardData) {
        const text = e.clipboardData.getData('text');
        if (text && text.trim()) {
          onPasteText(text.trim());
          triggerPasteSuccess();
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [onPasteText]);

  const triggerPasteSuccess = () => {
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2200);
  };

  const handleManualSubmit = () => {
    if (inputText.trim()) {
      onPasteText(inputText.trim());
      triggerPasteSuccess();
      setInputText('');
    }
  };

  const handleClipboardRead = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          onPasteText(text.trim());
          triggerPasteSuccess();
          setInputText('');
        } else {
          alert('클립보드에 복사된 텍스트가 없습니다. 스프레드시트에서 행을 복사(Ctrl+C)한 후 클릭해주세요.');
        }
      } else {
        alert('브라우저 보안 설정으로 인해 직접 붙여넣기(Ctrl+V)를 사용해주세요.');
      }
    } catch {
      alert('클립보드 접근 권한이 필요합니다. 텍스트 상자에 직접 Ctrl+V로 붙여넣어주세요.');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 px-3.5 py-2.5 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Step Label Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-teal-600 text-white text-[10px] font-black shrink-0 shadow-2xs">
            1
          </span>
          <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
            데이터 입력
          </span>
        </div>

        {/* Compact Single-line / Flexible Input Field */}
        <div 
          className={`relative flex-1 flex items-center rounded-lg border transition-all ${
            isFocused 
              ? 'border-teal-500 ring-2 ring-teal-100 bg-white' 
              : 'border-slate-200/90 hover:border-slate-300 bg-slate-50/70'
          }`}
        >
          <input
            id="paste-textarea"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onPaste={(e) => {
              const pasted = e.clipboardData.getData('text');
              if (pasted && pasted.trim()) {
                e.preventDefault();
                onPasteText(pasted.trim());
                triggerPasteSuccess();
                setInputText('');
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleManualSubmit();
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="스프레드시트에서 복사(Ctrl+C) 후 여기에 붙여넣기(Ctrl+V) 하세요 (누적 등록)"
            className="w-full bg-transparent px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden font-mono"
          />

          {copiedNotification && (
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-600 text-white text-[11px] font-bold shadow-xs animate-fade-in whitespace-nowrap z-10">
              <Check className="w-3 h-3" />
              <span>누적 등록 완료</span>
            </div>
          )}
        </div>

        {/* Compact Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0 justify-end">
          {inputText.trim() && (
            <button
              id="btn-clear-text-only"
              type="button"
              onClick={() => setInputText('')}
              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              title="입력 텍스트 지우기"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span className="text-[11px]">지우기</span>
            </button>
          )}

          {inputText.trim() && (
            <button
              id="btn-submit-header"
              type="button"
              onClick={handleManualSubmit}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 transition-all shadow-2xs cursor-pointer whitespace-nowrap"
              title="입력 데이터 등록"
            >
              <Plus className="w-3 h-3" />
              <span className="text-[11px]">등록</span>
            </button>
          )}

          <button
            id="btn-clipboard-paste"
            type="button"
            onClick={handleClipboardRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 transition-all shadow-2xs cursor-pointer whitespace-nowrap"
            title="클립보드에 복사된 시트 데이터 즉시 불러오기"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>클립보드 불러오기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
