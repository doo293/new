import React from 'react';
import { CardCompany } from '../types';
import { Sparkles, Layers, CheckCircle2, Clock, CheckCheck, FileText } from 'lucide-react';

export type WorkflowFilter = 'all' | 'pending' | 'ready' | 'etc';

interface SidebarProps {
  activeWorkflow: WorkflowFilter;
  onSelectWorkflow: (filter: WorkflowFilter) => void;
  selectedCardCompany: string | null;
  onSelectCardCompany: (card: string | null) => void;
  onOpenTemplates: () => void;
  statusCounts: {
    all: number;
    pending: number;
    ready: number;
    etc: number;
  };
}

const CARDS_LIST = [
  { name: '롯데 카드', key: '롯데', isDefault: false },
  { name: '하나 카드', key: '하나', isDefault: false },
  { name: '농협 카드', key: '농협', isDefault: false },
  { name: '우리 카드', key: '우리', isDefault: true },
  { name: '국민 카드', key: '국민', isDefault: false },
  { name: '신한 카드', key: '신한', isDefault: false },
  { name: '삼성 카드', key: '삼성', isDefault: false },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeWorkflow,
  onSelectWorkflow,
  selectedCardCompany,
  onSelectCardCompany,
  onOpenTemplates,
  statusCounts,
}) => {
  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col gap-4 shrink-0 overflow-y-auto select-none">
      {/* Workflow Section */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">
          워크플로우
        </div>
        <div className="flex flex-col gap-1">
          <button
            id="sidebar-filter-all"
            onClick={() => onSelectWorkflow('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeWorkflow === 'all'
                ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200/60'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              <span>전체 현황</span>
            </div>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-200/80 font-mono text-slate-600">
              {statusCounts.all}
            </span>
          </button>

          <button
            id="sidebar-filter-pending"
            onClick={() => onSelectWorkflow('pending')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeWorkflow === 'pending'
                ? 'bg-orange-50 text-orange-700 font-bold border border-orange-200/60'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              <span>증액/할부 대기</span>
            </div>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-200/80 font-mono text-slate-600">
              {statusCounts.pending}
            </span>
          </button>

          <button
            id="sidebar-filter-ready"
            onClick={() => onSelectWorkflow('ready')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeWorkflow === 'ready'
                ? 'bg-green-50 text-green-700 font-bold border border-green-200/60'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>결제준비 완료</span>
            </div>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-200/80 font-mono text-slate-600">
              {statusCounts.ready}
            </span>
          </button>
        </div>
      </div>

      {/* Card Templates Section */}
      <div>
        <div className="flex items-center justify-between mb-2 px-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            카드사별 양식
          </div>
          <button
            id="btn-sidebar-manage-templates"
            onClick={onOpenTemplates}
            className="text-[11px] text-teal-700 hover:underline font-semibold"
          >
            설정
          </button>
        </div>
        <div className="space-y-0.5">
          {CARDS_LIST.map((card) => {
            const isSelected = selectedCardCompany === card.key;
            return (
              <button
                key={card.key}
                onClick={() => {
                  if (selectedCardCompany === card.key) {
                    onSelectCardCompany(null);
                  } else {
                    onSelectCardCompany(card.key);
                  }
                }}
                className={`w-full px-3 py-1.5 text-xs text-left flex items-center justify-between rounded-md transition-colors ${
                  isSelected
                    ? 'bg-teal-700 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <span>{card.name}</span>
                {card.isDefault && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isSelected ? 'bg-teal-800 text-teal-100' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    Default
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Technical Pro Tip Box */}
      <div className="mt-auto p-3.5 rounded-lg border border-dashed border-slate-300 bg-slate-100/70">
        <p className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-700" />
          <span>안내 팁</span>
        </p>
        <p className="text-[11px] text-slate-500 leading-normal">
          상단 필터에서 <strong>일시불</strong> 및 <strong>할부</strong> 고객을 즉시 분류하여 조회하고 개별/일괄 양식을 복사할 수 있습니다.
        </p>
      </div>
    </aside>
  );
};
