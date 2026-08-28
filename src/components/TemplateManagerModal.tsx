import React, { useState, useEffect } from 'react';
import { MessageTemplate, CardCompany, TemplateCategory } from '../types';
import { TEMPLATE_VARIABLES, DEFAULT_TEMPLATES } from '../data/defaultTemplates';
import { 
  X, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Save, 
  Check, 
  Copy, 
  FileCode,
  Tag,
  Search,
  CheckCircle2
} from 'lucide-react';

interface TemplateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: MessageTemplate[];
  onSaveTemplates: (updated: MessageTemplate[], activeId?: string) => void;
  onResetTemplates: () => void;
}

const CARD_COMPANIES: (CardCompany | '전체' | '기타')[] = [
  '전체',
  '롯데',
  '하나',
  '농협',
  '우리',
  '국민',
  '신한',
  '삼성',
  '기타',
];

const CATEGORIES: TemplateCategory[] = [
  '결제준비',
  '고객안내',
  '수수료정산',
];

export const TemplateManagerModal: React.FC<TemplateManagerModalProps> = ({
  isOpen,
  onClose,
  templates,
  onSaveTemplates,
  onResetTemplates,
}) => {
  const [editingList, setEditingList] = useState<MessageTemplate[]>(templates);
  const [selectedId, setSelectedId] = useState<string>(templates[0]?.id || '');
  const [savedNotice, setSavedNotice] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCardFilter, setSelectedCardFilter] = useState<string>('전체');

  // 모달 열릴 때 최신 templates 동기화
  useEffect(() => {
    if (isOpen) {
      setEditingList(templates);
      if (selectedId) {
        const exists = templates.some((t) => t.id === selectedId);
        if (!exists) setSelectedId(templates[0]?.id || '');
      } else {
        setSelectedId(templates[0]?.id || '');
      }
      setSavedNotice(false);
    }
  }, [isOpen, templates]);

  if (!isOpen) return null;

  const currentTemplate = editingList.find((t) => t.id === selectedId) || editingList[0];

  const handleUpdateCurrent = (field: keyof MessageTemplate, value: any) => {
    if (!currentTemplate) return;
    const updated = editingList.map((t) =>
      t.id === currentTemplate.id ? { ...t, [field]: value } : t
    );
    setEditingList(updated);
  };

  const handleInsertVariable = (variableKey: string) => {
    if (!currentTemplate) return;
    const textarea = document.getElementById('template-editor-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const original = currentTemplate.templateContent;
      const nextContent = original.substring(0, start) + variableKey + original.substring(end);
      handleUpdateCurrent('templateContent', nextContent);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variableKey.length, start + variableKey.length);
      }, 50);
    } else {
      handleUpdateCurrent('templateContent', currentTemplate.templateContent + variableKey);
    }
  };

  const handleAddNew = () => {
    const newId = `custom-template-${Date.now()}`;
    const newTpl: MessageTemplate = {
      id: newId,
      name: '새 맞춤 양식',
      cardCompany: '전체',
      category: '결제준비',
      description: '새로 작성한 사용자 정의 양식입니다.',
      templateContent: `{고객명}고객님 {카드사} 결제준비 안내\n- 차종: {차종}\n- 결제금액: {결제금액}원\n- 할부조건: {할부개월}\n- 수수료: {지급금액}원`,
    };
    const updated = [newTpl, ...editingList];
    setEditingList(updated);
    setSelectedId(newId);
  };

  const handleDuplicate = (tpl: MessageTemplate) => {
    const newId = `custom-template-${Date.now()}`;
    const duplicated: MessageTemplate = {
      ...tpl,
      id: newId,
      name: `${tpl.name} (복사본)`,
      description: tpl.description ? `${tpl.description} (복사본)` : '복사된 맞춤 양식',
    };
    const updated = [duplicated, ...editingList];
    setEditingList(updated);
    setSelectedId(newId);
  };

  const handleDelete = (id: string) => {
    if (editingList.length <= 1) {
      alert('최소 1개 이상의 양식이 있어야 합니다.');
      return;
    }
    if (confirm('이 양식을 삭제하시겠습니까?')) {
      const updated = editingList.filter((t) => t.id !== id);
      setEditingList(updated);
      setSelectedId(updated[0]?.id || '');
    }
  };

  const handleSaveAll = () => {
    onSaveTemplates(editingList, selectedId);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    if (confirm('모든 양식을 초기 기본값으로 되돌리시겠습니까? 사용자가 추가하거나 수정한 양식은 초기화됩니다.')) {
      onResetTemplates();
      setEditingList(DEFAULT_TEMPLATES);
      setSelectedId(DEFAULT_TEMPLATES[0].id);
    }
  };

  // 필터링된 양식 목록
  const displayedTemplates = editingList.filter((tpl) => {
    if (selectedCardFilter !== '전체') {
      if (tpl.cardCompany !== selectedCardFilter && tpl.cardCompany !== '전체') return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = tpl.name.toLowerCase().includes(q);
      const matchCard = tpl.cardCompany.toLowerCase().includes(q);
      const matchCat = tpl.category.toLowerCase().includes(q);
      const matchDesc = (tpl.description || '').toLowerCase().includes(q);
      if (!matchName && !matchCard && !matchCat && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-teal-700" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              카드사별 양식(템플릿) 관리자
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              총 {editingList.length}개 양식
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200 min-h-0">
          {/* Left Column: Template List & Filter */}
          <div className="w-full md:w-72 bg-slate-50/70 p-3 flex flex-col gap-2 overflow-hidden shrink-0">
            <div className="flex items-center justify-between gap-1.5 shrink-0">
              <span className="text-xs font-bold text-slate-700">양식 목록 ({displayedTemplates.length})</span>
              <button
                id="btn-add-new-template"
                onClick={handleAddNew}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-teal-700 text-white rounded-lg hover:bg-teal-800 active:scale-95 transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>새 양식</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center shrink-0">
              <Search className="w-3 h-3 text-slate-400 absolute left-2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="양식 검색..."
                className="w-full text-xs pl-7 pr-6 py-1 bg-white border border-slate-200 rounded-md focus:outline-hidden focus:border-teal-500 text-slate-800 placeholder-slate-400"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-1.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Template List Items */}
            <div className="space-y-1.5 overflow-y-auto flex-1 pr-0.5">
              {displayedTemplates.map((tpl) => {
                const isSel = tpl.id === selectedId;
                const isCustom = tpl.id.startsWith('custom-');
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedId(tpl.id)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSel
                        ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="font-bold text-xs truncate">{tpl.name}</span>
                        {isCustom && (
                          <span
                            className={`text-[9px] px-1 py-0.2 rounded font-bold shrink-0 ${
                              isSel ? 'bg-teal-800 text-white' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            사용자
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-semibold shrink-0 ${
                          isSel ? 'bg-teal-800 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {tpl.cardCompany}
                      </span>
                    </div>
                    <div
                      className={`text-[11px] truncate ${
                        isSel ? 'text-teal-100' : 'text-slate-400'
                      }`}
                    >
                      {tpl.category} · {tpl.description || '설명 없음'}
                    </div>
                  </div>
                );
              })}
              {displayedTemplates.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  일치하는 양식이 없습니다.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Active Template Editor */}
          {currentTemplate && (
            <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto flex flex-col gap-3 min-h-0 bg-white">
              {/* Top Controls: Name, Card, Duplicate */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">양식 이름</label>
                  <input
                    type="text"
                    value={currentTemplate.name}
                    onChange={(e) => handleUpdateCurrent('name', e.target.value)}
                    placeholder="양식 이름을 입력하세요"
                    className="w-full text-xs font-semibold text-slate-800 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">카드사 적용</label>
                  <select
                    value={currentTemplate.cardCompany}
                    onChange={(e) => handleUpdateCurrent('cardCompany', e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500 cursor-pointer"
                  >
                    {CARD_COMPANIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">양식 메모/설명</label>
                  <input
                    type="text"
                    value={currentTemplate.description || ''}
                    onChange={(e) => handleUpdateCurrent('description', e.target.value)}
                    placeholder="예: 롯데카드 할부+일시불 전용 발송 양식"
                    className="w-full text-xs text-slate-800 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">양식 분류</label>
                  <div className="flex gap-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleUpdateCurrent('category', cat)}
                        className={`flex-1 py-1 text-[11px] font-bold rounded-md border transition-all cursor-pointer ${
                          currentTemplate.category === cat
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clickable Variable Chips */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-teal-700" />
                    <span>클릭하여 변수 삽입</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    버튼을 누르면 본문에 태그가 삽입됩니다
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto p-1.5 bg-slate-50 rounded-lg border border-slate-200">
                  {TEMPLATE_VARIABLES.map((v) => (
                    <button
                      type="button"
                      key={v.key}
                      onClick={() => handleInsertVariable(v.key)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-white hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 border border-slate-200 rounded text-[10px] font-mono text-slate-700 transition-colors cursor-pointer"
                      title={`${v.label} (예: ${v.example})`}
                    >
                      <span className="font-bold text-teal-800">{v.key}</span>
                      <span className="text-slate-400 text-[9px]">({v.label})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Content Textarea */}
              <div className="flex-1 flex flex-col min-h-[140px]">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">양식 본문 내용</label>
                  <span className="text-[11px] text-slate-400">
                    중괄호 태그는 실제 고객 데이터로 자동 치환됩니다
                  </span>
                </div>
                <textarea
                  id="template-editor-content"
                  rows={7}
                  value={currentTemplate.templateContent}
                  onChange={(e) => handleUpdateCurrent('templateContent', e.target.value)}
                  className="w-full flex-1 text-xs font-mono text-slate-800 bg-white border border-slate-300 rounded-xl p-3 focus:outline-hidden focus:ring-2 focus:ring-teal-500 leading-relaxed shadow-2xs"
                  placeholder="양식 내용을 작성하세요..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              id="btn-reset-templates"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
              title="모든 양식을 기본 초기값으로 복원"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">기본값 복원</span>
            </button>

            {currentTemplate && (
              <button
                type="button"
                onClick={() => handleDuplicate(currentTemplate)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors cursor-pointer"
                title="현재 선택된 양식을 복제하여 새 양식으로 생성"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>양식 복제</span>
              </button>
            )}

            {currentTemplate && editingList.length > 1 && (
              <button
                onClick={() => handleDelete(currentTemplate.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                title="현재 선택된 양식 삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>삭제</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              닫기
            </button>
            <button
              id="btn-save-all-templates"
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-2xs active:scale-95 transition-all cursor-pointer"
            >
              {savedNotice ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>저장 완료!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>양식 저장 및 적용</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

