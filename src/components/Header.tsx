import React from 'react';
import { 
  Settings2, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  RotateCcw,
  RefreshCw,
  FileSpreadsheet,
  LayoutDashboard,
  TableProperties,
  Percent,
} from 'lucide-react';

export type MainTabType = 'workspace' | 'full-list' | 'condition-matrix';

interface HeaderProps {
  activeTab: MainTabType;
  onSelectTab: (tab: MainTabType) => void;
  onOpenTemplates: () => void;
  onOpenColumnMapper: () => void;
  onOpenGuide: () => void;
  onLoadSample: (type: 'single' | 'multi' | 'lumpSum' | 'installment') => void;
  onReset: () => void;
  customerCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenTemplates,
  onOpenColumnMapper,
  onOpenGuide,
  onLoadSample,
  onReset,
  customerCount,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 shrink-0 sticky top-0 z-40 select-none">
      <div className="h-10 max-w-[1920px] mx-auto flex items-center justify-between px-3 sm:px-4">
        {/* Left: Main Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
          <button
            id="tab-btn-workspace"
            type="button"
            onClick={() => onSelectTab('workspace')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'workspace'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>작업대 (문구/등록)</span>
          </button>

          <button
            id="tab-btn-full-list"
            type="button"
            onClick={() => onSelectTab('full-list')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'full-list'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <TableProperties className="w-3.5 h-3.5" />
            <span>전체 데이터 목록</span>
            {customerCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  activeTab === 'full-list'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {customerCount}
              </span>
            )}
          </button>

          <button
            id="tab-btn-condition-matrix"
            type="button"
            onClick={() => onSelectTab('condition-matrix')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'condition-matrix'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100/60 font-semibold'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>조건표 (신차구매)</span>
            <span className="text-[9px] bg-rose-500 text-white px-1 rounded-full font-extrabold">NEW</span>
          </button>
        </div>

        {/* Right: Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Column Mapper */}
          <button
            id="btn-column-mapping"
            type="button"
            onClick={onOpenColumnMapper}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-colors"
            title="스프레드시트 컬럼 매핑"
          >
            <Settings2 className="w-3.5 h-3.5 text-slate-500" />
            <span>컬럼 설정</span>
          </button>

          {/* Template Manager */}
          <button
            id="btn-template-manager"
            type="button"
            onClick={onOpenTemplates}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-colors"
            title="카드사별 양식 관리"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>양식 관리</span>
          </button>

          {/* Guide */}
          <button
            id="btn-quick-guide"
            type="button"
            onClick={onOpenGuide}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200/80 transition-colors"
            title="사용법 가이드"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Reset */}
          {customerCount > 0 && (
            <button
              id="btn-reset-data"
              type="button"
              onClick={onReset}
              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 transition-colors"
              title="목록 초기화"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Sample Data Load Button */}
          <button
            id="btn-header-sync"
            type="button"
            onClick={() => onLoadSample('multi')}
            className="bg-teal-700 text-white px-2.5 py-1 rounded-md text-xs font-semibold hover:bg-teal-800 active:scale-95 transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
            title="샘플 데이터 로드"
          >
            <RefreshCw className="w-3 h-3" />
            <span>예시 데이터</span>
          </button>
        </div>
      </div>
    </header>
  );
};

