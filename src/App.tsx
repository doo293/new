import React, { useState, useEffect, useMemo } from 'react';
import { CustomerPaymentData, MessageTemplate, ColumnMapping, PaymentTypeFilter } from './types';
import { DEFAULT_TEMPLATES, DEFAULT_COLUMN_MAPPING } from './data/defaultTemplates';
import { 
  parseSpreadsheetText, 
  SAMPLE_TSV_LINE, 
  MULTI_SAMPLE_TSV,
  SAMPLE_LUMP_SUM_TSV,
  SAMPLE_INSTALLMENT_TSV
} from './utils/parser';
import { renderTemplate, splitMessageSections, findBestTemplateForCustomer } from './utils/templateEngine';

import { Header, MainTabType } from './components/Header';
import { CustomerSidebar } from './components/CustomerSidebar';
import { TopWorkDashboard } from './components/TopWorkDashboard';
import { FullDataView } from './components/FullDataView';
import { ConditionMatrixTab } from './components/ConditionMatrixTab';
import { PasteInput } from './components/PasteInput';
import { CustomerTable } from './components/CustomerTable';
import { CustomerEditor } from './components/CustomerEditor';
import { MessagePreview } from './components/MessagePreview';
import { TemplateManagerModal } from './components/TemplateManagerModal';
import { ColumnMapperModal } from './components/ColumnMapperModal';
import { QuickUsageGuide } from './components/QuickUsageGuide';

import { 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  FileSpreadsheet, 
  ArrowRight,
  Filter,
  Check,
  Trash2
} from 'lucide-react';

const STORAGE_KEY_TEMPLATES = 'autofinance_custom_templates_v11';
const STORAGE_KEY_MAPPING = 'autofinance_column_mapping_v2';
const STORAGE_KEY_CUSTOMERS = 'autofinance_recent_customers_v2';

export default function App() {
  // 1. 템플릿 상태 (사용자 맞춤 등록 양식 영구 보존 및 최신 기본 템플릿 자동 동기화)
  const [templates, setTemplates] = useState<MessageTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEMPLATES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const userTemplates = parsed.filter(
            (t: MessageTemplate) => t && t.id && (t.id.startsWith('custom-') || !t.isDefault)
          );
          // 기본 템플릿 목록과 사용자 등록 양식 안전하게 결합
          return [...DEFAULT_TEMPLATES, ...userTemplates];
        }
      }
    } catch (e) {}
    return DEFAULT_TEMPLATES;
  });

  // 2. 컬럼 매핑 상태
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MAPPING);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_COLUMN_MAPPING;
  });

  // 3. 파싱된 고객 목록 상태
  const [customers, setCustomers] = useState<CustomerPaymentData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOMERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c: CustomerPaymentData) => ({
            ...c,
            paymentMethodNote: (!c.paymentMethodNote || c.paymentMethodNote.includes('할부로 결제 부탁드립니다'))
              ? '일시불로 결제 부탁드립니다~'
              : c.paymentMethodNote,
          }));
        }
      }
    } catch (e) {}
    return parseSpreadsheetText(SAMPLE_TSV_LINE, DEFAULT_COLUMN_MAPPING);
  });

  // 4. 상태 및 결제유형 필터 상태
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('전체');
  const [selectedCardFilter, setSelectedCardFilter] = useState<string | null>(null);
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<PaymentTypeFilter>('all');

  // 5. 선택된 고객 및 템플릿
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(() => {
    return customers[0]?.id || null;
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => {
    return DEFAULT_TEMPLATES[0].id;
  });

  // 6. 메인 상단 탭 상태 (작업대 vs 전체 데이터 목록)
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>('workspace');

  // 7. 모달 제어 상태
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // 8. 복사 피드백 알림
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [allCopied, setAllCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 로컬 스토리지 자동 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(templates));
    } catch (e) {}
  }, [templates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MAPPING, JSON.stringify(columnMapping));
    } catch (e) {}
  }, [columnMapping]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOMERS, JSON.stringify(customers));
    } catch (e) {}
  }, [customers]);

  // 일시불 vs 할부 건수 집계
  const { lumpSumCount, installmentCount } = useMemo(() => {
    let lumpSum = 0;
    let installment = 0;

    customers.forEach((c) => {
      const isLump =
        !c.installmentMonths ||
        c.installmentMonths === '일시불' ||
        c.installmentMonths === '0' ||
        c.installmentMonths === '1';
      if (isLump) {
        lumpSum++;
      } else {
        installment++;
      }
    });

    return { lumpSumCount: lumpSum, installmentCount: installment };
  }, [customers]);

  // 필터링된 고객 목록
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // 1. Status filter
      if (activeStatusFilter !== '전체') {
        if (c.status !== activeStatusFilter) return false;
      }

      // 2. Card filter
      if (selectedCardFilter) {
        if (!c.cardCompany.includes(selectedCardFilter)) return false;
      }

      // 3. Payment Type filter (일시불 vs 할부)
      const isLump =
        !c.installmentMonths ||
        c.installmentMonths === '일시불' ||
        c.installmentMonths === '0' ||
        c.installmentMonths === '1';

      if (paymentTypeFilter === 'lumpSum' && !isLump) {
        return false;
      }
      if (paymentTypeFilter === 'installment' && isLump) {
        return false;
      }

      return true;
    });
  }, [customers, activeStatusFilter, selectedCardFilter, paymentTypeFilter]);

  // 선택된 고객 정보
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  // 토스트 띄우기 함수
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 고객 선택 핸들러 (고객 카드사에 맞는 템플릿 자동 동기화, 현재 카테고리 유지)
  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    const targetCust = customers.find((c) => c.id === id);
    if (targetCust) {
      const currentTpl = templates.find((t) => t.id === selectedTemplateId);
      const currentCategory = currentTpl?.category || '결제준비';
      if (currentCategory === '고객안내' || (currentTpl && (currentTpl.cardCompany === '전체' || !currentTpl.cardCompany))) {
        // 고객안내 화면이거나 공통 양식인 경우 화면 카테고리 및 양식 유지
      } else {
        const matchedTpl = findBestTemplateForCustomer(templates, targetCust, currentCategory);
        if (matchedTpl) {
          setSelectedTemplateId(matchedTpl.id);
        }
      }
    }
  };

  // 스프레드시트 텍스트 파싱 핸들러 (밑으로 누적 추가)
  const handlePasteText = (text: string) => {
    const parsed = parseSpreadsheetText(text, columnMapping);
    if (parsed.length > 0) {
      setCustomers((prev) => [...prev, ...parsed]);
      setSelectedCustomerId(parsed[0].id);

      // 해당 카드사 기본 템플릿으로 자동 매칭
      const matchedTpl = findBestTemplateForCustomer(templates, parsed[0], '결제준비');
      if (matchedTpl) {
        setSelectedTemplateId(matchedTpl.id);
      }

      showToast(`${parsed.length}건의 데이터가 목록 하단에 추가되었습니다!`);
    } else {
      showToast('붙여넣은 텍스트에서 데이터를 추출하지 못했습니다. 확인 후 다시 시도해주세요.');
    }
  };

  // 직접 신규 업무 추가 핸들러 (밑으로 누적 추가)
  const handleAddCustomer = (newCust: CustomerPaymentData) => {
    setCustomers((prev) => [...prev, newCust]);
    setSelectedCustomerId(newCust.id);
    showToast(`[${newCust.customerName} 고객님] 신규 업무가 등록되었습니다.`);
  };

  // 예시 데이터 로드
  const handleLoadSample = (type: 'single' | 'multi' | 'lumpSum' | 'installment') => {
    let text = SAMPLE_TSV_LINE;
    if (type === 'lumpSum') {
      text = SAMPLE_LUMP_SUM_TSV;
      setPaymentTypeFilter('lumpSum');
    } else if (type === 'installment') {
      text = SAMPLE_INSTALLMENT_TSV;
      setPaymentTypeFilter('installment');
    } else if (type === 'multi') {
      text = MULTI_SAMPLE_TSV;
      setPaymentTypeFilter('all');
    } else {
      text = SAMPLE_TSV_LINE;
      setPaymentTypeFilter('all');
    }
    handlePasteText(text);
  };

  // 선택된 고객 데이터 수정 핸들러
  const handleUpdateCustomer = (updated: CustomerPaymentData) => {
    const prevCust = customers.find((c) => c.id === updated.id);
    const cardChanged = prevCust && prevCust.cardCompany !== updated.cardCompany;

    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));

    // 카드사가 변경된 경우, 현재 카테고리(고객안내, 결제준비, 수수료정산)를 유지하며 적합한 양식 동기화
    if (cardChanged) {
      const currentTpl = templates.find((t) => t.id === selectedTemplateId);
      const currentCategory = currentTpl?.category || '결제준비';
      
      // 고객안내 화면이거나 공통('전체') 양식인 경우 현재 템플릿 유지
      if (currentCategory === '고객안내' || (currentTpl && (currentTpl.cardCompany === '전체' || !currentTpl.cardCompany))) {
        // 고객안내 및 공통 양식 그대로 유지
      } else {
        const matchedTpl = findBestTemplateForCustomer(templates, updated, currentCategory);
        if (matchedTpl) {
          setSelectedTemplateId(matchedTpl.id);
        }
      }
    }
  };

  // 고객 상태(진행상태) 변경 핸들러
  const handleUpdateStatus = (id: string, newStatus: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    showToast(`진행상태가 [${newStatus}](으)로 변경되었습니다.`);
  };

  // 고객 삭제 (단일)
  const handleDeleteCustomer = (id: string) => {
    const target = customers.find((c) => c.id === id);
    const targetName = target?.customerName || '고객';
    const next = customers.filter((c) => c.id !== id);
    setCustomers(next);
    if (selectedCustomerId === id) {
      setSelectedCustomerId(next.length > 0 ? next[0].id : null);
    }
    showToast(`[${targetName} 고객님] 데이터가 삭제되었습니다.`);
  };

  // 고객 일괄 삭제 (다중)
  const handleDeleteMultipleCustomers = (ids: string[]) => {
    const idSet = new Set(ids);
    const next = customers.filter((c) => !idSet.has(c.id));
    setCustomers(next);
    if (selectedCustomerId && idSet.has(selectedCustomerId)) {
      setSelectedCustomerId(next.length > 0 ? next[0].id : null);
    }
    showToast(`${ids.length}건의 고객 데이터가 삭제되었습니다.`);
  };

  // 데이터 전체 초기화 (모달 확인 후 실행)
  const handleResetCustomers = () => {
    setCustomers([]);
    setSelectedCustomerId(null);
    setIsResetConfirmOpen(false);
    showToast('고객 데이터가 전체 삭제되었습니다.');
  };

  // 단일 고객 텍스트 복사 (전체, 결제만, 수수료만)
  const handleCopySingleText = async (
    customer: CustomerPaymentData,
    copyType: 'all' | 'payment' | 'commission' = 'all'
  ) => {
    const matchedTpl = findBestTemplateForCustomer(templates, customer, '결제준비');

    const rendered = renderTemplate(matchedTpl, customer);
    const { paymentText, commissionText } = splitMessageSections(rendered, customer);

    let textToCopy = rendered;
    let label = '전체 결제준비 양식';
    if (copyType === 'payment') {
      textToCopy = paymentText;
      label = '결제안내 문구';
    } else if (copyType === 'commission') {
      textToCopy = commissionText;
      label = '수수료 지급일정 문구';
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(customer.id);
      showToast(`[${customer.customerName} 고객님] ${label}가 복사되었습니다!`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      showToast('클립보드 권한 오류');
    }
  };

  // 전체/필터링된 고객 일괄 복사 (전체, 결제만, 수수료만)
  const handleBatchCopyAll = async (
    copyType: 'all' | 'payment' | 'commission' = 'all'
  ) => {
    const targetList = filteredCustomers.length > 0 ? filteredCustomers : customers;
    if (targetList.length === 0) return;

    const fullBatchText = targetList
      .map((c) => {
        const matchedTpl = findBestTemplateForCustomer(templates, c, '결제준비');
        const rendered = renderTemplate(matchedTpl, c);
        if (copyType === 'payment') {
          return splitMessageSections(rendered, c).paymentText;
        }
        if (copyType === 'commission') {
          return splitMessageSections(rendered, c).commissionText;
        }
        return rendered;
      })
      .join('\n\n==============================\n\n');

    let label = '결제준비 양식';
    if (copyType === 'payment') label = '결제안내 문구';
    if (copyType === 'commission') label = '수수료 지급일정';

    try {
      await navigator.clipboard.writeText(fullBatchText);
      setAllCopied(true);
      showToast(`${targetList.length}건의 ${label}가 일괄 복사되었습니다!`);
      setTimeout(() => setAllCopied(false), 2500);
    } catch (e) {
      showToast('클립보드 권한 오류');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F1F5F9] font-sans text-slate-900">
      {/* 1. Top Nav Bar with Tab Controls */}
      <Header
        activeTab={activeMainTab}
        onSelectTab={(tab) => setActiveMainTab(tab)}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
        onOpenColumnMapper={() => setIsColumnModalOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onLoadSample={handleLoadSample}
        onReset={() => setIsResetConfirmOpen(true)}
        customerCount={customers.length}
      />

      {/* 2. Main Content Area */}
      {activeMainTab === 'condition-matrix' ? (
        /* TAB 3: 신차구매 카드사별 조건표 뷰 (사진 완벽 일치 및 조건 입력/편집) */
        <main className="flex-1 w-full animate-fade-in flex flex-col">
          <ConditionMatrixTab />
        </main>
      ) : activeMainTab === 'full-list' ? (
        /* TAB 2: 전체 데이터 목록 & 수정 전용 뷰 */
        <main className="flex-1 w-full animate-fade-in">
          <FullDataView
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            onSelectCustomer={handleSelectCustomer}
            onUpdateCustomer={handleUpdateCustomer}
            onUpdateStatus={handleUpdateStatus}
            onAddCustomer={handleAddCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onDeleteCustomers={handleDeleteMultipleCustomers}
            onResetAll={() => setIsResetConfirmOpen(true)}
            onNavigateToWorkspace={(customerId) => {
              handleSelectCustomer(customerId);
              setActiveMainTab('workspace');
            }}
            onCopySingleText={handleCopySingleText}
            onBatchCopyAll={handleBatchCopyAll}
            copiedId={copiedId}
          />
        </main>
      ) : (
        /* TAB 1: 스마트 작업대 (사이드바 데이터목록 + 기술적 붙여넣기 + 고객상세편집 + 문구생성기) */
        <>
          {/* Main Workspace (전체 페이지 자연스러운 스크롤 지원) */}
          <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1920px] mx-auto items-start animate-fade-in p-3 sm:p-4 gap-4">
            {/* 1. Left Sidebar: Data List (고객, 딜러, 카드사, 결제금액 / 할부금, 일시불금) */}
            <CustomerSidebar
              customers={customers}
              selectedCustomerId={selectedCustomerId}
              onSelectCustomer={handleSelectCustomer}
              onDeleteCustomer={handleDeleteCustomer}
              onAddCustomer={handleAddCustomer}
              onResetAll={() => setIsResetConfirmOpen(true)}
            />

            {/* 2. Center Main Column */}
            <main className="flex-1 w-full min-w-0 flex flex-col gap-4">
              {/* Step 1: Technical Paste Box */}
              <PasteInput
                onPasteText={handlePasteText}
                lastParsedCount={customers.length}
              />

              {/* Selected Customer Detail Editor & Mobile Preview */}
              {selectedCustomer ? (
                <>
                  <CustomerEditor
                    customer={selectedCustomer}
                    onChange={handleUpdateCustomer}
                  />

                  {/* For mobile / tablet (< lg screens) */}
                  <div className="lg:hidden">
                    <MessagePreview
                      customer={selectedCustomer}
                      templates={templates}
                      selectedTemplateId={selectedTemplateId}
                      onSelectTemplate={(tId) => setSelectedTemplateId(tId)}
                      onUpdateCustomer={handleUpdateCustomer}
                      onCopySuccess={(type) => {
                        const typeLabel =
                          type === 'payment'
                            ? '통합 결제안내 문구'
                            : type === 'commission'
                            ? '수수료 지급일정'
                            : type === 'lumpSum'
                            ? '1차 일시불 결제문구'
                            : type === 'installment'
                            ? '2차 할부 결제문구'
                            : type === 'guide'
                            ? '고객 안내문구'
                            : type === 'compliance'
                            ? '금융상품 필수고지사항'
                            : '전체 메시지 양식';
                        showToast(`[${selectedCustomer.customerName} 고객님] ${typeLabel}가 복사되었습니다!`);
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-2">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">
                    등록된 업무 데이터가 없습니다
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-3">
                    상단의 <strong>[+ 새 업무 직접 등록]</strong> 버튼 또는 스프레드시트 복사(Ctrl+V)를 이용하세요.
                  </p>
                  <button
                    onClick={() => handleLoadSample('single')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-2xs cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>예시 데이터 불러오기</span>
                  </button>
                </div>
              )}
            </main>

            {/* 3. Right Inspector Pane (Message Generator & Instant Copy Console) */}
            {selectedCustomer && (
              <aside className="w-full lg:w-[22rem] xl:w-[26rem] bg-white border border-slate-200 p-4 xl:p-5 shrink-0 flex flex-col lg:sticky lg:top-3 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto hidden lg:flex rounded-xl shadow-xs">
                <MessagePreview
                  customer={selectedCustomer}
                  templates={templates}
                  selectedTemplateId={selectedTemplateId}
                  onSelectTemplate={(tId) => setSelectedTemplateId(tId)}
                  onUpdateCustomer={handleUpdateCustomer}
                  onCopySuccess={(type) => {
                    const typeLabel =
                      type === 'payment'
                        ? '통합 결제안내 문구'
                        : type === 'commission'
                        ? '수수료 지급일정'
                        : type === 'lumpSum'
                        ? '1차 일시불 결제문구'
                        : type === 'installment'
                        ? '2차 할부 결제문구'
                        : type === 'guide'
                        ? '고객 안내문구'
                        : type === 'compliance'
                        ? '금융상품 필수고지사항'
                        : '전체 메시지 양식';
                    showToast(`[${selectedCustomer.customerName} 고객님] ${typeLabel}가 복사되었습니다!`);
                  }}
                />
              </aside>
            )}
          </div>
        </>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-bold shadow-xl border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <TemplateManagerModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        templates={templates}
        onSaveTemplates={(updated, activeId) => {
          setTemplates(updated);
          if (activeId) {
            setSelectedTemplateId(activeId);
          } else if (selectedCustomer) {
            const best = findBestTemplateForCustomer(updated, selectedCustomer, '결제준비');
            if (best) setSelectedTemplateId(best.id);
          }
          showToast('양식이 저장되어 현재 화면에 즉시 적용되었습니다!');
        }}
        onResetTemplates={() => {
          setTemplates(DEFAULT_TEMPLATES);
          setSelectedTemplateId(DEFAULT_TEMPLATES[0].id);
          showToast('기본 양식으로 복원되었습니다.');
        }}
      />

      <ColumnMapperModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        mapping={columnMapping}
        onSaveMapping={(updated) => {
          setColumnMapping(updated);
          showToast('컬럼 매핑 설정이 저장되었습니다.');
        }}
        onResetMapping={() => {
          setColumnMapping(DEFAULT_COLUMN_MAPPING);
          showToast('기본 컬럼 매핑으로 복원되었습니다.');
        }}
      />

      <QuickUsageGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* 데이터 전체 초기화 확인 모달 */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">고객 데이터 전체 삭제</h3>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                현재 등록된 <strong className="text-slate-900">{customers.length}건</strong>의 고객 데이터를 모두 삭제하시겠습니까?<br />
                삭제된 데이터는 복구할 수 없습니다.
              </p>
              <div className="flex items-center gap-2 w-full">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleResetCustomers}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
                >
                  전체 삭제 실행
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
