import React, { useState, useEffect, useMemo } from 'react';
import { CustomerPaymentData, MessageTemplate, TemplateCategory } from '../types';
import { 
  renderTemplate, 
  splitMessageSections, 
  SplitMessageResult, 
  splitCustomerGuideSections,
  SplitCustomerGuideResult,
  isInstallmentCustomer,
  getSeparatePaymentTexts,
  findBestTemplateForCustomer,
  isCardMatch
} from '../utils/templateEngine';
import { formatCurrency } from '../utils/parser';
import { 
  Copy, 
  Check, 
  Sparkles, 
  Send, 
  FileCheck2, 
  Layers,
  Edit3,
  RotateCcw,
  MessageCircle,
  Split,
  FileText,
  DollarSign,
  CreditCard,
  Building2,
  WalletCards,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface MessagePreviewProps {
  customer: CustomerPaymentData;
  templates: MessageTemplate[];
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
  onCopySuccess: (type: 'all' | 'payment' | 'commission' | 'lumpSum' | 'installment' | 'guide' | 'compliance') => void;
  onUpdateCustomer?: (updated: CustomerPaymentData) => void;
}

const CATEGORIES: { key: TemplateCategory; label: string }[] = [
  { key: '결제준비', label: '결제준비 (기본)' },
  { key: '고객안내', label: '고객안내' },
  { key: '수수료정산', label: '수수료정산' },
];

// 개월수 유무 체크 헬퍼 (일시불 vs 할부)
const hasInstallmentMonths = (cust: CustomerPaymentData | null | undefined): boolean => {
  return isInstallmentCustomer(cust);
};

export const MessagePreview: React.FC<MessagePreviewProps> = ({
  customer,
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onCopySuccess,
  onUpdateCustomer,
}) => {
  const [copiedType, setCopiedType] = useState<'all' | 'payment' | 'commission' | 'lumpSum' | 'installment' | 'totalHybrid' | 'guide' | 'compliance' | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [customTextOverride, setCustomTextOverride] = useState<string | null>(null);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  // 현재 템플릿 탐색 (선택된 ID 기준)
  const currentTemplate = useMemo(() => {
    const found = templates.find((t) => t.id === selectedTemplateId);
    if (found) return found;
    return findBestTemplateForCustomer(templates, customer, '결제준비');
  }, [templates, selectedTemplateId, customer]);

  // 활성 카테고리
  const activeCategory: TemplateCategory = currentTemplate?.category || '결제준비';

  // 고객 변경 또는 카드사 변경 시, 현재 카테고리에 맞는 최적 양식으로 자동 동기화
  useEffect(() => {
    const current = templates.find((t) => t.id === selectedTemplateId);
    // 현재 선택된 양식이 고객안내 카테고리이거나 공통('전체') 카드 양식인 경우 유지
    if (current && (current.category === '고객안내' || current.cardCompany === '전체' || !current.cardCompany)) {
      return;
    }

    const best = findBestTemplateForCustomer(templates, customer, activeCategory);
    if (best && best.id !== selectedTemplateId) {
      // 만약 현재 선택된 템플릿이 다른 카드사 전용 템플릿인 경우 자동 교체
      if (!current || (current.cardCompany !== '전체' && !isCardMatch(current.cardCompany, customer.cardCompany))) {
        onSelectTemplate(best.id);
      }
    }
  }, [customer.id, customer.cardCompany, activeCategory, templates, selectedTemplateId, onSelectTemplate]);

  // 카테고리 전환 핸들러 (사용자가 등록한 해당 카드사 맞춤 양식 최우선 적용)
  const handleCategoryChange = (catKey: TemplateCategory) => {
    const best = findBestTemplateForCustomer(templates, customer, catKey);
    if (best) {
      onSelectTemplate(best.id);
    }
  };

  // 텍스트 생성
  const renderedText = currentTemplate ? renderTemplate(currentTemplate, customer) : '';
  const displayText = customTextOverride !== null ? customTextOverride : renderedText;

  // 결제 안내와 수수료 일정 분할 계산
  const { paymentText, commissionText } = useMemo(() => {
    return splitMessageSections(displayText, customer);
  }, [displayText, customer]);

  // 고객안내 상단 안내문구와 하단 필수고지사항 분할 계산
  const customerGuideSections = useMemo(() => {
    return splitCustomerGuideSections(displayText);
  }, [displayText]);

  // 복합결제 시 개별 분할 결제(일시불/할부 따로) 정보 생성
  const separateInfo = useMemo(() => {
    return getSeparatePaymentTexts(customer, currentTemplate);
  }, [customer, currentTemplate]);

  // 수수료정산 탭 구분 컬럼 분할
  const commissionColumns = useMemo(() => {
    if (activeCategory !== '수수료정산') return [];
    return displayText.split('\t');
  }, [displayText, activeCategory]);

  // 고객이나 템플릿 변경시 오버라이드 리셋
  useEffect(() => {
    setCustomTextOverride(null);
    setIsEditing(false);
    const now = new Date();
    setLastUpdatedTime(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    );
  }, [customer.id, customer.cardCompany, selectedTemplateId]);

  const handleCopy = async (type: 'all' | 'payment' | 'commission' | 'lumpSum' | 'installment' | 'totalHybrid' | 'guide' | 'compliance') => {
    let textToCopy = displayText;
    if (type === 'payment') textToCopy = paymentText;
    if (type === 'commission') textToCopy = commissionText;
    if (type === 'totalHybrid') textToCopy = separateInfo.totalHybridText;
    if (type === 'lumpSum') textToCopy = separateInfo.lumpSumText;
    if (type === 'installment') textToCopy = separateInfo.installmentText;
    if (type === 'guide') textToCopy = customerGuideSections.guideText;
    if (type === 'compliance') textToCopy = customerGuideSections.complianceText;

    if (!textToCopy.trim()) {
      alert('복사할 내용이 비어 있습니다.');
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedType(type);
      onCopySuccess(type === 'totalHybrid' ? 'payment' : type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      alert('클립보드 복사 권한이 없습니다.');
    }
  };

  // 바이트 수 계산
  const getByteLength = (str: string) => {
    let byte = 0;
    for (let i = 0; i < str.length; i++) {
      byte += str.charCodeAt(i) > 128 ? 2 : 1;
    }
    return byte;
  };

  const byteLength = getByteLength(displayText);
  const msgType = byteLength <= 80 ? 'SMS (단문)' : byteLength <= 2000 ? 'LMS (장문)' : 'MMS';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col h-full overflow-hidden select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="font-extrabold text-slate-900 uppercase tracking-tight text-xs sm:text-sm whitespace-nowrap">
            {activeCategory === '고객안내' ? '고객안내 텍스트' : activeCategory === '수수료정산' ? '수수료정산 텍스트' : '결제준비 텍스트'}
          </h2>
          <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200 whitespace-nowrap shrink-0">
            {customer.cardCompany}카드
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="btn-preview-edit-toggle"
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-2.5 py-1 rounded-lg transition-colors text-xs flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer ${
              isEditing
                ? 'bg-teal-700 text-white font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold'
            }`}
            title="문구 직접 편집"
          >
            <Edit3 className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">{isEditing ? '완료' : '수정'}</span>
          </button>

          <button
            id="btn-preview-copy-icon"
            type="button"
            onClick={() => handleCopy('all')}
            className="bg-slate-100 p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
            title="전체 클립보드 복사"
          >
            {copiedType === 'all' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Category Pills & Template Selector */}
      <div className="flex flex-col gap-1.5 mb-2 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleCategoryChange(cat.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* 🌟 고객안내 전용 서브타입 빠른 선택 바 (일시불 vs 다이렉트 할부 vs 오토할부 - 스크롤 없이 3분할) */}
        {activeCategory === '고객안내' && (
          <div className="p-1.5 bg-teal-50/80 border border-teal-200/90 rounded-xl shrink-0">
            <div className="grid grid-cols-3 gap-1 w-full">
              <button
                id="btn-guide-type-lump"
                type="button"
                onClick={() => {
                  const tpl = templates.find((t) => t.id === 'customer-guide-lump') || templates.find((t) => t.category === '고객안내' && t.name.includes('일시불'));
                  if (tpl) onSelectTemplate(tpl.id);
                }}
                className={`py-1.5 px-1 rounded-lg text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  currentTemplate.id === 'customer-guide-lump' || currentTemplate.name.includes('일시불')
                    ? 'bg-teal-800 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-teal-100/70 border border-teal-200/70'
                }`}
              >
                <span>일시불</span>
                <span className="text-[10px] opacity-75 font-normal">(캐시백)</span>
              </button>

              <button
                id="btn-guide-type-direct"
                type="button"
                onClick={() => {
                  const tpl = templates.find((t) => t.id === 'customer-guide-direct') || templates.find((t) => t.category === '고객안내' && t.name.includes('다이렉트'));
                  if (tpl) onSelectTemplate(tpl.id);
                }}
                className={`py-1.5 px-1 rounded-lg text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  currentTemplate.id === 'customer-guide-direct' || (currentTemplate.category === '고객안내' && currentTemplate.name.includes('다이렉트'))
                    ? 'bg-teal-800 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-teal-100/70 border border-teal-200/70'
                }`}
              >
                <span>다이렉트</span>
                <span className="text-[10px] opacity-75 font-normal">(할부)</span>
              </button>

              <button
                id="btn-guide-type-auto"
                type="button"
                onClick={() => {
                  const tpl = templates.find((t) => t.id === 'customer-guide-auto') || templates.find((t) => t.category === '고객안내' && t.name.includes('오토할부'));
                  if (tpl) onSelectTemplate(tpl.id);
                }}
                className={`py-1.5 px-1 rounded-lg text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  currentTemplate.id === 'customer-guide-auto' || (currentTemplate.category === '고객안내' && currentTemplate.name.includes('오토할부'))
                    ? 'bg-teal-800 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-teal-100/70 border border-teal-200/70'
                }`}
              >
                <span>오토할부</span>
                <span className="text-[10px] opacity-75 font-normal">(할부)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Direct Payout Notice Toggle Bar (결제준비 카테고리 전용) */}
      {onUpdateCustomer && activeCategory === '결제준비' && (
        <div className="flex items-center justify-between px-3 py-1.5 mb-2 rounded-xl bg-slate-50 border border-slate-200 text-xs shrink-0">
          <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!customer.cardCompanyDirectPayout}
              onChange={(e) =>
                onUpdateCustomer({
                  ...customer,
                  cardCompanyDirectPayout: e.target.checked,
                  cardCompanyDirectRate: customer.cardCompanyDirectRate ?? customer.commissionRate,
                })
              }
              className="rounded text-slate-800 focus:ring-slate-700 h-3.5 w-3.5"
            />
            <span className="font-bold text-slate-700 text-[11px] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-600" />
              <span>카드사 직지급 문구 ({customer.cardCompanyDirectRate ?? customer.commissionRate}%)</span>
              {['하나', '우리', '국민'].includes(customer.cardCompany as string) && (
                <span className="text-[9px] bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.2 rounded-md font-semibold">
                  {customer.cardCompany} 권장
                </span>
              )}
            </span>
          </label>
          <span className={`text-[10px] font-mono font-bold ${customer.cardCompanyDirectPayout ? 'text-slate-900' : 'text-slate-400'}`}>
            {customer.cardCompanyDirectPayout ? '포함됨' : '제외'}
          </span>
        </div>
      )}

      {/* Content Area */}
      {isEditing ? (
        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col min-h-[260px] max-h-[380px]">
          <textarea
            value={displayText}
            onChange={(e) => setCustomTextOverride(e.target.value)}
            className="w-full flex-1 bg-white border border-slate-300 rounded-lg p-3 font-mono text-xs text-slate-800 focus:outline-hidden focus:border-slate-500 resize-none shadow-2xs"
            placeholder="발송할 문구를 직접 수정하세요..."
          />
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>{byteLength} Byte ({msgType})</span>
            {customTextOverride !== null && (
              <button
                type="button"
                onClick={() => setCustomTextOverride(null)}
                className="text-slate-800 hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>원래대로</span>
              </button>
            )}
          </div>
        </div>
      ) : activeCategory === '고객안내' && Boolean(customerGuideSections.complianceText) ? (
        /* 🌟 고객안내 분할 뷰: 1. 안내문구 + 2. 법정 필수고지사항 */
        <div className="flex-1 flex flex-col gap-3 min-h-[260px] max-h-[420px] overflow-y-auto pr-1">
          {/* 1. 상단 고객 안내 문구 (결제/캐시백 또는 할부조건) */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex flex-col shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <MessageCircle className="w-3.5 h-3.5 text-teal-700" />
                <span>1. {currentTemplate.name.includes('할부') ? '할부조건 안내문구' : '결제 및 캐시백 안내문구'}</span>
              </div>
              <button
                id="btn-copy-guide-section"
                type="button"
                onClick={() => handleCopy('guide')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  copiedType === 'guide'
                    ? 'bg-slate-900 text-white border border-slate-900'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs'
                }`}
                title="고객 안내문구 부분만 복사"
              >
                {copiedType === 'guide' ? (
                  <>
                    <Check className="w-3 h-3 text-white" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-500" />
                    <span>안내문구 복사</span>
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-xs leading-relaxed text-slate-800 select-all whitespace-pre-wrap">
              {customerGuideSections.guideText || '고객 안내 문구가 없습니다.'}
            </div>
          </div>

          {/* 2. 하단 법정 필수고지사항 문구 */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex flex-col shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                <span>2. 금융상품 법정 필수고지사항</span>
              </div>
              <button
                id="btn-copy-compliance-section"
                type="button"
                onClick={() => handleCopy('compliance')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  copiedType === 'compliance'
                    ? 'bg-slate-900 text-white border border-slate-900'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs'
                }`}
                title="필수고지사항 부분만 복사"
              >
                {copiedType === 'compliance' ? (
                  <>
                    <Check className="w-3 h-3 text-white" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-500" />
                    <span>필수고지 복사</span>
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-xs leading-relaxed text-slate-700 select-all whitespace-pre-wrap">
              {customerGuideSections.complianceText || '필수고지사항 문구가 없습니다.'}
            </div>
          </div>
        </div>
      ) : (activeCategory === '결제준비' && Boolean(commissionText)) ? (
        /* Split View Mode: Separate Payment Info & Commission Schedule */
        <div className="flex-1 flex flex-col gap-3 min-h-[260px] max-h-[420px] overflow-y-auto pr-1">
          {/* 1. Payment Preparation Section */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex flex-col shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <CreditCard className="w-3.5 h-3.5 text-slate-700" />
                <span>1. 결제준비 안내 문구 {separateInfo.isHybrid ? '(통합 결제순서)' : ''}</span>
              </div>
              <button
                id="btn-copy-payment-section"
                type="button"
                onClick={() => handleCopy('payment')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  copiedType === 'payment'
                    ? 'bg-slate-900 text-white border border-slate-900'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs'
                }`}
                title="통합 결제정보 부분만 복사"
              >
                {copiedType === 'payment' ? (
                  <>
                    <Check className="w-3 h-3 text-white" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-500" />
                    <span>{separateInfo.isHybrid ? '통합 결제순서 복사' : '결제문구 복사'}</span>
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-xs leading-relaxed text-slate-800 select-all whitespace-pre-wrap">
              {paymentText || '결제 안내 문구가 없습니다.'}
            </div>
          </div>

          {/* ⭐ Separate Payment Sections for Hybrid (할부+일시불 전체 / 일시불 따로 / 할부 따로) */}
          {separateInfo.isHybrid && (
            <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex flex-col gap-2.5 shadow-2xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <WalletCards className="w-4 h-4 text-slate-700" />
                  <span>복합결제 분할 안내</span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">원클릭 분할 및 전체 복사</span>
              </div>

              {/* 🌟 0. 할부+일시불 전체/순서 안내 카드 */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col shadow-2xs">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>
                      {(customer.cardCompany || '').includes('하나')
                        ? `하나카드: 전체 금액+순서 (${formatCurrency(separateInfo.totalAmount)}원)`
                        : `할부+일시불 순서 안내`}
                    </span>
                  </span>
                  <button
                    id="btn-copy-total-hybrid-card"
                    type="button"
                    onClick={() => handleCopy('totalHybrid')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      copiedType === 'totalHybrid'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                    title={(customer.cardCompany || '').includes('하나') ? "전체 결제금액 및 결제순서가 포함된 안내문 복사" : "결제순서 안내문 복사"}
                  >
                    {copiedType === 'totalHybrid' ? (
                      <>
                        <Check className="w-3 h-3 text-white" />
                        <span>복사완료!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-500" />
                        <span>{(customer.cardCompany || '').includes('하나') ? '전체금액 복사' : '순서안내 복사'}</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-xs leading-relaxed text-slate-700 select-all whitespace-pre-wrap">
                  {separateInfo.totalHybridText}
                </div>
              </div>

              {/* 1차 일시불 안내 카드 */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col shadow-2xs">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>1차 일시불 ({formatCurrency(separateInfo.lumpSumAmount)}원)</span>
                  </span>
                  <button
                    id="btn-copy-lump-sum-card"
                    type="button"
                    onClick={() => handleCopy('lumpSum')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      copiedType === 'lumpSum'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    {copiedType === 'lumpSum' ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>복사완료!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-500" />
                        <span>1차 일시불 복사</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-xs leading-relaxed text-slate-700 select-all whitespace-pre-wrap">
                  {separateInfo.lumpSumText}
                </div>
              </div>

              {/* 2차 할부 안내 카드 */}
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col shadow-2xs">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>2차 할부 ({formatCurrency(separateInfo.installmentAmount)}원)</span>
                  </span>
                  <button
                    id="btn-copy-installment-card"
                    type="button"
                    onClick={() => handleCopy('installment')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      copiedType === 'installment'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                  >
                    {copiedType === 'installment' ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>복사완료!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-500" />
                        <span>2차 할부 복사</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-xs leading-relaxed text-slate-700 select-all whitespace-pre-wrap">
                  {separateInfo.installmentText}
                </div>
              </div>
            </div>
          )}

          {/* 3. Commission Schedule Section */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex flex-col shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <DollarSign className="w-3.5 h-3.5 text-slate-700" />
                <span>2. 수수료 지급일정 문구</span>
              </div>
              <button
                id="btn-copy-commission-section"
                type="button"
                onClick={() => handleCopy('commission')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  copiedType === 'commission'
                    ? 'bg-slate-900 text-white border border-slate-900'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-2xs'
                }`}
                title="수수료 지급일정 부분만 복사"
              >
                {copiedType === 'commission' ? (
                  <>
                    <Check className="w-3 h-3 text-white" />
                    <span>복사완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-500" />
                    <span>수수료일정 복사</span>
                  </>
                )}
              </button>
            </div>
            <div className="font-mono text-xs leading-relaxed text-slate-800 select-all whitespace-pre-wrap">
              {commissionText || '수수료 지급일정 문구가 없습니다.'}
            </div>
          </div>
        </div>
      ) : activeCategory === '수수료정산' ? (
        /* Commission Settlement 1-Screen View Mode (No Horizontal Scroll) */
        <div className="flex-1 bg-slate-50/90 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between overflow-hidden shadow-2xs">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs shrink-0">
              <span className="font-bold flex items-center gap-1.5 text-slate-800">
                <span>📊 스프레드시트 1행 정산 (TAB 구분)</span>
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold border border-emerald-200">
                엑셀 1칸 클릭 후 Ctrl+V
              </span>
            </div>

            {/* Structured Compact Grid - 100% visible on one screen */}
            <div className="space-y-1.5 text-xs">
              <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">1. 딜러 정보</span>
                  <span className="font-bold text-slate-800 text-xs truncate block">{commissionColumns[0] || '-'}</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">2. 적요 / 항목</span>
                  <span className="font-bold text-slate-800 text-xs truncate block">
                    {commissionColumns[13] || commissionColumns[1] || '-'} ({commissionColumns[12] || '딜러인센'})
                  </span>
                </div>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">3. 상품 / 고객명</span>
                <span className="font-bold text-slate-800 text-xs block break-words">{commissionColumns[1] || '-'}</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">
                    {commissionColumns[4] ? '4. 할부 + 일시불 금액' : '4. 결제금액 / 요율'}
                  </span>
                  <span className="font-bold text-slate-900 text-xs block">
                    {commissionColumns[2] || '0'}원 ({commissionColumns[3]}%)
                    {commissionColumns[4] && (
                      <span className="text-slate-600 block text-[11px] font-medium">
                        + {commissionColumns[4]}원 ({commissionColumns[5]}%)
                      </span>
                    )}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block">5. 계좌 / 실지급액</span>
                  <span className="font-bold text-slate-800 text-xs block truncate">
                    {commissionColumns[9] || commissionColumns[10] ? `${commissionColumns[9]} ${commissionColumns[10]}`.trim() : '(계좌 공백)'}
                  </span>
                  <span className="text-emerald-700 font-extrabold text-xs block">
                    지급: {commissionColumns[6] || '0'}원
                  </span>
                </div>
              </div>

              {/* Raw Tab Text (Wrapped cleanly with tab formatting, no horizontal scroll) */}
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1">
                  <span>복사될 TAB 데이터 (클릭 드래그 복사 가능):</span>
                  <span className="text-slate-400 font-normal">줄바꿈 표기</span>
                </div>
                <div className="font-mono text-[11px] text-slate-700 leading-snug break-all select-all whitespace-pre-wrap">
                  {displayText}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
            <div className="flex items-center gap-2 font-medium">
              <span>{byteLength} Byte</span>
              <span>•</span>
              <span className="font-bold text-slate-600">스프레드시트 1행</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">14개 탭(TAB) 열 분할</span>
          </div>
        </div>
      ) : (
        /* Unified View Mode (for regular templates) */
        <div className="flex-1 bg-slate-50/80 border border-slate-200/90 rounded-xl p-4 flex flex-col min-h-[260px] max-h-[380px]">
          <div className="flex-1 overflow-y-auto font-mono text-xs leading-relaxed text-slate-700 select-all whitespace-pre-wrap">
            {displayText}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2 font-medium">
              <span>{byteLength} Byte</span>
              <span>•</span>
              <span className="font-bold text-slate-600">{msgType}</span>
            </div>
            {customTextOverride !== null && (
              <button
                type="button"
                onClick={() => setCustomTextOverride(null)}
                className="text-slate-800 hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>원래대로</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons: Split vs All */}
      <div className="mt-3 space-y-2 shrink-0">
        {/* Primary All Copy Button */}
        <button
          id="btn-copy-main"
          type="button"
          onClick={() => handleCopy('all')}
          className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
            copiedType === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-900 text-white hover:bg-black active:scale-98'
          }`}
        >
          {copiedType === 'all' ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>
                {activeCategory === '수수료정산'
                  ? '정산 1행 복사완료! (엑셀에 Ctrl+V)'
                  : '전체 복사완료! (카톡에 Ctrl+V)'}
              </span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-300" />
              <span>
                {activeCategory === '수수료정산'
                  ? '정산 1행 복사 (엑셀/스프레드시트에 Ctrl+V)'
                  : '텍스트 전체 복사 (카톡에 Ctrl+V)'}
              </span>
            </>
          )}
        </button>

        {/* 🌟 고객안내 부분복사 버튼 (안내문구만 복사 / 필수고지만 복사) */}
        {activeCategory === '고객안내' && Boolean(customerGuideSections.complianceText) ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-copy-guide-only"
              type="button"
              onClick={() => handleCopy('guide')}
              className={`py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                copiedType === 'guide'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-98 shadow-2xs'
              }`}
              title="상단 고객 안내문구만 복사"
            >
              {copiedType === 'guide' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>안내문구 복사됨!</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-teal-700" />
                  <span>1. 안내문구만 복사</span>
                </>
              )}
            </button>

            <button
              id="btn-copy-compliance-only"
              type="button"
              onClick={() => handleCopy('compliance')}
              className={`py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                copiedType === 'compliance'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-98 shadow-2xs'
              }`}
              title="하단 필수고지사항만 복사"
            >
              {copiedType === 'compliance' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>필수고지 복사됨!</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                  <span>2. 필수고지만 복사</span>
                </>
              )}
            </button>
          </div>
        ) : (commissionText && activeCategory === '결제준비') ? (
          separateInfo.isHybrid ? (
            <div className="grid grid-cols-2 gap-1.5">
              <button
                id="btn-copy-payment-only"
                type="button"
                onClick={() => handleCopy('payment')}
                className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                  copiedType === 'payment'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-98 shadow-2xs'
                }`}
                title="통합 결제순서 안내문구 복사"
              >
                {copiedType === 'payment' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>통합 결제 복사됨!</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">통합 결제순서 복사</span>
                  </>
                )}
              </button>

              <button
                id="btn-copy-lump-sum-action"
                type="button"
                onClick={() => handleCopy('lumpSum')}
                className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                  copiedType === 'lumpSum'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-98 shadow-2xs'
                }`}
                title={`1차 일시불 ${formatCurrency(separateInfo.lumpSumAmount)}원 문구 복사`}
              >
                {copiedType === 'lumpSum' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>1차 일시불 복사됨!</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">1차 일시불만 복사</span>
                  </>
                )}
              </button>

              <button
                id="btn-copy-installment-action"
                type="button"
                onClick={() => handleCopy('installment')}
                className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                  copiedType === 'installment'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-98 shadow-2xs'
                }`}
                title={`2차 할부 ${formatCurrency(separateInfo.installmentAmount)}원 문구 복사`}
              >
                {copiedType === 'installment' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>2차 할부 복사됨!</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">2차 할부만 복사</span>
                  </>
                )}
              </button>

              <button
                id="btn-copy-commission-only"
                type="button"
                onClick={() => handleCopy('commission')}
                className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                  copiedType === 'commission'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-98 shadow-2xs'
                }`}
                title="수수료 일정 문구만 복사"
              >
                {copiedType === 'commission' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>수수료일정 복사됨!</span>
                  </>
                ) : (
                  <>
                    <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">수수료일정만 복사</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-copy-payment-only"
                type="button"
                onClick={() => handleCopy('payment')}
                className={`py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  copiedType === 'payment'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-98 shadow-2xs'
                }`}
              >
                {copiedType === 'payment' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>결제문구 복사됨!</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                    <span>결제정보만 복사</span>
                  </>
                )}
              </button>

              <button
                id="btn-copy-commission-only"
                type="button"
                onClick={() => handleCopy('commission')}
                className={`py-2.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  copiedType === 'commission'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:scale-98 shadow-2xs'
                }`}
              >
                {copiedType === 'commission' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>수수료일정 복사됨!</span>
                  </>
                ) : (
                  <>
                    <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                    <span>수수료일정만 복사</span>
                  </>
                )}
              </button>
            </div>
          )
        ) : null}

        <p className="text-center text-[10px] text-slate-400 font-medium">
          마지막 업데이트: {lastUpdatedTime}
        </p>
      </div>
    </div>
  );
};
