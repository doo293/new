import React, { useState, useMemo } from 'react';
import { CustomerPaymentData } from '../types';
import { formatCurrency } from '../utils/parser';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  CreditCard, 
  UserCheck, 
  Coins, 
  ChevronRight,
  Filter,
  X,
  StickyNote
} from 'lucide-react';

interface CustomerSidebarProps {
  customers: CustomerPaymentData[];
  selectedCustomerId: string | null;
  onSelectCustomer: (id: string) => void;
  onDeleteCustomer: (id: string) => void;
  onAddCustomer?: (newCustomer: CustomerPaymentData) => void;
  onResetAll?: () => void;
}

export const CustomerSidebar: React.FC<CustomerSidebarProps> = ({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  onDeleteCustomer,
  onAddCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCardFilter, setSelectedCardFilter] = useState<string | null>(null);

  // 고유 카드사 목록 추출 (기타 제외)
  const availableCards = useMemo(() => {
    const set = new Set<string>();
    customers.forEach((c) => {
      if (c.cardCompany && !c.cardCompany.includes('기타')) {
        set.add(c.cardCompany.replace(/카드$/, ''));
      }
    });
    return Array.from(set);
  }, [customers]);

  // 검색 및 카드사 필터링
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.trim().toLowerCase();
      const qNumOnly = q.replace(/[^0-9]/g, '');
      if (q) {
        const matchName = (c.customerName || '').toLowerCase().includes(q);
        const matchDealer = (c.dealerInfo || '').toLowerCase().includes(q);
        const matchCard = (c.cardCompany || '').toLowerCase().includes(q);
        const matchAmount = String(c.paymentAmount || '').includes(q);
        const matchMemo = (c.memo || '').toLowerCase().includes(q);
        const matchCar = (c.carModel || '').toLowerCase().includes(q);
        const matchPhone = 
          (c.phoneNumber || '').toLowerCase().includes(q) ||
          (qNumOnly.length >= 2 && (c.phoneNumber || '').replace(/[^0-9]/g, '').includes(qNumOnly));
        const matchResident = 
          (c.residentNumber || '').toLowerCase().includes(q) ||
          (qNumOnly.length >= 2 && (c.residentNumber || '').replace(/[^0-9]/g, '').includes(qNumOnly));
        const matchRow = (c.rowNumber || '').includes(q);
        const matchId = (c.id || '').toLowerCase().includes(q);

        if (!matchName && !matchDealer && !matchCard && !matchAmount && !matchMemo && !matchPhone && !matchResident && !matchRow && !matchCar && !matchId) {
          return false;
        }
      }

      if (selectedCardFilter) {
        if (!c.cardCompany.includes(selectedCardFilter)) {
          return false;
        }
      }

      return true;
    });
  }, [customers, searchQuery, selectedCardFilter]);

  // 차분하고 통일감 있는 카드사 뱃지 스타일
  const getCardBadgeColor = (_card: string) => {
    return 'bg-slate-100 text-slate-700 border-slate-200/90';
  };

  return (
    <aside 
      id="customer-sidebar-panel"
      className="w-full lg:w-80 xl:w-84 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shrink-0 lg:sticky lg:top-3 lg:self-start lg:h-[calc(100vh-2rem)] rounded-xl border shadow-xs overflow-hidden"
    >
      {/* Header */}
      <div className="p-3.5 border-b border-slate-100 bg-slate-50/70 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 leading-tight">데이터 목록</h2>
              <p className="text-[11px] text-slate-500">고객 · 딜러 · 카드사 · 일시/할부 · 결제금액</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold font-mono">
            {filteredCustomers.length}건
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="sidebar-customer-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="고객명, 연락처(전화번호), 딜러, 카드사 검색..."
            className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Card Filters (Optional Chips) */}
        {availableCards.length > 1 && (
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
            <button
              onClick={() => setSelectedCardFilter(null)}
              className={`px-2 py-0.5 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCardFilter === null
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              전체
            </button>
            {availableCards.map((card) => (
              <button
                key={card}
                onClick={() => setSelectedCardFilter(selectedCardFilter === card ? null : card)}
                className={`px-2 py-0.5 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCardFilter === card
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {card}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Customer List Items */}
      <div className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-1.5 divide-y divide-slate-100/60 max-h-[420px] lg:max-h-none">
        {filteredCustomers.length === 0 ? (
          <div className="p-6 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <Users className="w-8 h-8 text-slate-300 stroke-[1.5]" />
            <p className="text-xs font-semibold text-slate-500">일치하는 고객이 없습니다</p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCardFilter(null);
                }}
                className="text-xs text-teal-700 hover:underline font-bold"
              >
                검색 조건 초기화
              </button>
            )}
          </div>
        ) : (
          filteredCustomers.map((customer, index) => {
            const isSelected = customer.id === selectedCustomerId;
            const cardName = customer.cardCompany.replace(/카드$/, '');

            const isLump =
              !customer.installmentMonths ||
              customer.installmentMonths === '일시불' ||
              customer.installmentMonths === '0' ||
              customer.installmentMonths === '1' ||
              customer.installmentMonths === '-';

            const isHybrid = Boolean(
              customer.isHybridPayment ||
              (customer.installmentAmount && customer.installmentAmount > 0 && customer.lumpSumAmount && customer.lumpSumAmount > 0) ||
              (customer.installmentMonths && customer.installmentMonths.includes('할부') && customer.installmentMonths.includes('일시')) ||
              (customer.paymentMethodNote && (customer.paymentMethodNote.includes('복합') || customer.paymentMethodNote.includes('순서')))
            );

            const lumpSumAmt = customer.lumpSumAmount || (isHybrid ? Math.max(0, customer.paymentAmount - (customer.installmentAmount || 0)) : 0);
            const installmentAmt = customer.installmentAmount || (isHybrid ? Math.max(0, customer.paymentAmount - lumpSumAmt) : 0);
            const totalAmt = customer.paymentAmount || (lumpSumAmt + installmentAmt);

            const installmentLabel = customer.installmentMonths
              ? (customer.installmentMonths.includes('개월') || customer.installmentMonths.includes('할부')
                  ? customer.installmentMonths
                  : `${customer.installmentMonths}개월`)
              : '할부';

            return (
              <div
                key={customer.id || index}
                id={`sidebar-customer-item-${customer.id}`}
                onClick={() => onSelectCustomer(customer.id)}
                className={`group relative p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {/* 1st Row: 고객명 & 구분(일시/할부/복합) 뱃지 & 카드사 뱃지 & 삭제 버튼 */}
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {customer.customerName || '고객명 미입력'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isHybrid ? (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                        isSelected 
                          ? 'bg-slate-800 text-slate-200 border-slate-700' 
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        할부+일시불
                      </span>
                    ) : isLump ? (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${
                        isSelected 
                          ? 'bg-slate-800 text-slate-200 border-slate-700' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        일시불
                      </span>
                    ) : (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${
                        isSelected 
                          ? 'bg-slate-800 text-slate-200 border-slate-700' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {installmentLabel}
                      </span>
                    )}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                      isSelected
                        ? 'bg-slate-800 text-white border-slate-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {cardName}
                    </span>

                    {/* 깔끔하게 정렬된 삭제 버튼 (겹침 방지 및 클릭 시 즉시 삭제) */}
                    <button
                      type="button"
                      id={`btn-delete-sidebar-${customer.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onDeleteCustomer(customer.id);
                      }}
                      className={`p-1 rounded-md transition-all cursor-pointer ${
                        isSelected
                          ? 'text-slate-400 hover:text-rose-300 hover:bg-slate-800'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                      }`}
                      title="고객 데이터 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 2nd Row: 딜러 & 단일 결제금액 */}
                <div className={`flex items-center justify-between gap-2 text-xs pt-1.5 border-t ${
                  isSelected ? 'border-slate-800' : 'border-slate-100'
                }`}>
                  {/* 딜러 */}
                  <div className={`flex items-center gap-1 truncate text-[11px] min-w-0 ${
                    isSelected ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    <span className={`text-[10px] shrink-0 font-medium ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>딜러:</span>
                    <span className="truncate font-medium" title={customer.dealerInfo}>
                      {customer.dealerInfo || '미입력'}
                    </span>
                  </div>

                  {/* 단일 결제일 경우 결제금액 및 일시불/할부 표기 */}
                  {!isHybrid && (
                    <div className="shrink-0 flex items-center gap-1 text-right font-mono">
                      <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {isLump ? '일시불' : installmentLabel}:
                      </span>
                      <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {formatCurrency(customer.paymentAmount)}원
                      </span>
                    </div>
                  )}
                </div>

                {/* ⭐ 3rd Row: 할부+일시불(복합결제)일 때 할부금과 일시불금액 개별 분리 표시 */}
                {isHybrid && (
                  <div className={`mt-1.5 pt-1.5 border-t rounded-lg p-2 flex flex-col gap-1 text-[11px] ${
                    isSelected
                      ? 'border-slate-800 bg-slate-800/80 text-slate-200'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}>
                    <div className="flex items-center justify-between font-mono">
                      <span className={isSelected ? 'text-slate-300' : 'text-slate-600'}>할부금:</span>
                      <span className={`font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {formatCurrency(installmentAmt)}원
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-mono">
                      <span className={isSelected ? 'text-slate-300' : 'text-slate-600'}>일시불:</span>
                      <span className={`font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {formatCurrency(lumpSumAmt)}원
                      </span>
                    </div>
                    <div className={`flex items-center justify-between font-mono text-[10px] pt-1 border-t ${
                      isSelected ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'
                    }`}>
                      <span>총 결제금액:</span>
                      <span className={`font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {formatCurrency(totalAmt)}원
                      </span>
                    </div>
                  </div>
                )}

                {/* 📝 Memo Snippet / Badge if present */}
                {customer.memo && customer.memo.trim().length > 0 && (
                  <div className={`mt-1.5 flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded truncate ${
                    isSelected
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-slate-100 text-slate-600'
                  }`} title={customer.memo}>
                    <StickyNote className={`w-3 h-3 shrink-0 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`} />
                    <span className="truncate">{customer.memo}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info / Action */}
      <div className="p-2.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-500">
        <span className="font-medium">총 {customers.length}건 등록됨</span>
        <span className="text-[10px] text-slate-400">클릭 시 상세 편집 & 문구 즉시 생성</span>
      </div>
    </aside>
  );
};
