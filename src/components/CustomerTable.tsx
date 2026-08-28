import React, { useState } from 'react';
import { CustomerPaymentData, CardCompany, PaymentTypeFilter } from '../types';
import { formatCurrency } from '../utils/parser';
import { 
  Users, 
  Copy, 
  Check, 
  Trash2, 
  Car, 
  CreditCard, 
  Percent, 
  DollarSign,
  ChevronRight,
  ListPlus,
  FileText,
  Layers,
  Sparkles,
  Zap,
  Calendar,
  StickyNote
} from 'lucide-react';

interface CustomerTableProps {
  customers: CustomerPaymentData[];
  selectedCustomerId: string | null;
  paymentTypeFilter: PaymentTypeFilter;
  onSelectPaymentTypeFilter: (filter: PaymentTypeFilter) => void;
  lumpSumCount: number;
  installmentCount: number;
  onSelectCustomer: (id: string) => void;
  onDeleteCustomer: (id: string) => void;
  onUpdateStatus?: (id: string, newStatus: string) => void;
  onCopySingleText: (customer: CustomerPaymentData, copyType?: 'all' | 'payment' | 'commission') => void;
  onBatchCopyAll: (copyType?: 'all' | 'payment' | 'commission') => void;
  copiedId: string | null;
  allCopied: boolean;
}

export const getCardBadgeStyle = (_card?: CardCompany | string) => {
  return 'bg-slate-100 text-slate-800 border-slate-300';
};

export const STATUS_OPTIONS = [
  '결제준비',
  '할부완료',
  '증액완료',
  '증액대기',
  '발급완료',
  '접수완료',
  '조회중',
] as const;

export const getStatusBadge = (status: string, onSelect?: (newStatus: string) => void) => {
  let badgeStyle = 'bg-slate-100 text-slate-800 border-slate-300';
  if (status.includes('결제준비')) {
    badgeStyle = 'bg-slate-100 text-slate-900 border-slate-300 font-bold';
  } else if (status.includes('할부완료') || status.includes('완료')) {
    badgeStyle = 'bg-slate-200 text-slate-900 border-slate-300 font-bold';
  } else if (status.includes('증액완료') || status.includes('발급완료')) {
    badgeStyle = 'bg-slate-100 text-slate-800 border-slate-300';
  } else if (status.includes('증액대기') || status.includes('조회중')) {
    badgeStyle = 'bg-slate-50 text-slate-700 border-slate-200';
  } else if (status.includes('접수완료') || status.includes('접수')) {
    badgeStyle = 'bg-slate-100 text-slate-800 border-slate-300';
  }

  if (onSelect) {
    return (
      <select
        value={status}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          e.stopPropagation();
          onSelect(e.target.value);
        }}
        className={`px-2 py-0.5 rounded-full text-xs font-bold border cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-teal-500 appearance-none text-center ${badgeStyle}`}
        title="클릭하여 진행상태 변경"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt} value={opt} className="bg-white text-slate-900 font-medium">
            {opt}
          </option>
        ))}
      </select>
    );
  }

  return <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${badgeStyle}`}>{status || '미처리'}</span>;
};

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  selectedCustomerId,
  paymentTypeFilter,
  onSelectPaymentTypeFilter,
  lumpSumCount,
  installmentCount,
  onSelectCustomer,
  onDeleteCustomer,
  onUpdateStatus,
  onCopySingleText,
  onBatchCopyAll,
  copiedId,
  allCopied,
}) => {
  const [rowCopiedType, setRowCopiedType] = useState<{ id: string; type: 'all' | 'payment' | 'commission' } | null>(null);

  if (customers.length === 0 && lumpSumCount === 0 && installmentCount === 0) {
    return null;
  }

  const handleRowCopy = (c: CustomerPaymentData, type: 'all' | 'payment' | 'commission') => {
    onSelectCustomer(c.id);
    onCopySingleText(c, type);
    setRowCopiedType({ id: c.id, type });
    setTimeout(() => setRowCopiedType(null), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
      {/* Table Control Banner: 일시불 / 할부 탭 구분 포함 */}
      <div className="px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
        {/* Left: 일시불 / 할부 구분 필터 탭 */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg border border-slate-300/60 text-xs">
          <button
            id="tab-filter-all"
            type="button"
            onClick={() => onSelectPaymentTypeFilter('all')}
            className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
              paymentTypeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>전체보기</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-mono">
              {lumpSumCount + installmentCount}
            </span>
          </button>

          <button
            id="tab-filter-lumpsum"
            type="button"
            onClick={() => onSelectPaymentTypeFilter('lumpSum')}
            className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
              paymentTypeFilter === 'lumpSum'
                ? 'bg-teal-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${paymentTypeFilter === 'lumpSum' ? 'text-yellow-300' : 'text-teal-700'}`} />
            <span>일시불</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              paymentTypeFilter === 'lumpSum' ? 'bg-teal-800 text-white' : 'bg-teal-100 text-teal-800'
            }`}>
              {lumpSumCount}
            </span>
          </button>

          <button
            id="tab-filter-installment"
            type="button"
            onClick={() => onSelectPaymentTypeFilter('installment')}
            className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
              paymentTypeFilter === 'installment'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${paymentTypeFilter === 'installment' ? 'text-purple-200' : 'text-purple-600'}`} />
            <span>할부</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              paymentTypeFilter === 'installment' ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-800'
            }`}>
              {installmentCount}
            </span>
          </button>
        </div>

        {/* Right: Batch Copy Options */}
        {customers.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 font-medium mr-0.5">
              {paymentTypeFilter === 'lumpSum' ? '일시불' : paymentTypeFilter === 'installment' ? '할부' : '현재 목록'} 일괄 복사:
            </span>
            
            <button
              id="btn-batch-copy-all"
              onClick={() => onBatchCopyAll('all')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold text-white bg-slate-900 hover:bg-black active:scale-95 transition-all shadow-2xs"
              title="현재 표시된 모든 고객의 결제+수수료 전체 양식 복사"
            >
              {allCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ListPlus className="w-3.5 h-3.5" />}
              <span>전체 ({customers.length}건)</span>
            </button>

            <button
              id="btn-batch-copy-payment"
              onClick={() => onBatchCopyAll('payment')}
              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 active:scale-95 transition-all shadow-2xs"
              title="모든 고객의 결제안내 문구만 일괄 복사"
            >
              <CreditCard className="w-3 h-3" />
              <span>결제만</span>
            </button>

            <button
              id="btn-batch-copy-commission"
              onClick={() => onBatchCopyAll('commission')}
              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 active:scale-95 transition-all shadow-2xs"
              title="모든 고객의 수수료 지급일정만 일괄 복사"
            >
              <DollarSign className="w-3 h-3" />
              <span>수수료만</span>
            </button>
          </div>
        )}
      </div>

      {/* Technical Data Table (최대 3개 항목 표시 후 스크롤) */}
      {customers.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs">
          선택한 필터 조건({paymentTypeFilter === 'lumpSum' ? '일시불' : '할부'})에 해당하는 고객 데이터가 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[205px] overflow-y-auto scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
              <tr>
                <th className="p-2.5 pl-4 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                  구분
                </th>
                <th className="p-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                  고객명
                </th>
                <th className="p-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                  카드사
                </th>
                <th className="p-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                  차종 / 개월수
                </th>
                <th className="p-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50">
                  상태
                </th>
                <th className="p-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right bg-slate-50">
                  결제금액
                </th>
                <th className="p-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right bg-slate-50">
                  수수료(요율)
                </th>
                <th className="p-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider pr-4 text-right bg-slate-50">
                  빠른 분할 복사
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((c) => {
                const isSelected = c.id === selectedCustomerId;
                const currentCopied = rowCopiedType?.id === c.id ? rowCopiedType.type : null;
                const isLumpSum =
                  !c.installmentMonths ||
                  c.installmentMonths === '일시불' ||
                  c.installmentMonths === '0' ||
                  c.installmentMonths === '1';
                const isHybrid = Boolean(
                  c.isHybridPayment ||
                  (c.installmentAmount && c.lumpSumAmount && c.installmentAmount > 0 && c.lumpSumAmount > 0)
                );

                return (
                  <tr
                    key={c.id}
                    id={`customer-row-${c.id}`}
                    onClick={() => onSelectCustomer(c.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-teal-50/70 font-medium text-slate-900 border-l-4 border-l-teal-700'
                        : 'hover:bg-slate-50/80 text-slate-700'
                    }`}
                  >
                    <td className="p-3 pl-4">
                      {isHybrid ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300 w-fit">
                            복합(할부+일시불)
                          </span>
                          <span className="text-[10px] text-purple-700 font-mono font-semibold">
                            할부 {c.installmentMonths || 36}개월
                          </span>
                        </div>
                      ) : isLumpSum ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                          <Zap className="w-2.5 h-2.5" />
                          일시불
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          <Calendar className="w-2.5 h-2.5" />
                          {c.installmentMonths}개월
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-medium">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{c.customerName}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse"></span>
                        )}
                      </div>
                      {c.phoneNumber && (
                        <div className="text-[10px] text-slate-400 font-mono">{c.phoneNumber}</div>
                      )}
                      {c.memo && c.memo.trim().length > 0 && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded max-w-[180px] truncate" title={c.memo}>
                          <StickyNote className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{c.memo}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-slate-600">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${getCardBadgeStyle(
                          c.cardCompany
                        )}`}
                      >
                        {c.cardCompany}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">
                      <div className="font-medium text-slate-800">{c.carModel || '-'}</div>
                      <div className="text-[10px] text-slate-400">
                        {isHybrid
                          ? `할부 ${c.installmentMonths || 36}개월 + 일시불`
                          : isLumpSum
                          ? '일시불'
                          : `${c.installmentMonths}개월`}
                        {c.interestRate && c.interestRate !== '0' ? ` (${c.interestRate}%)` : ''}
                      </div>
                    </td>
                    <td className="p-3">
                      {getStatusBadge(c.status, onUpdateStatus ? (newSt) => onUpdateStatus(c.id, newSt) : undefined)}
                    </td>
                    <td className="p-3 text-right font-mono text-sm font-semibold text-slate-900">
                      <div>{formatCurrency(c.paymentAmount)}</div>
                      {isHybrid && (
                        <div className="text-[10px] font-normal text-slate-500 leading-tight">
                          <span className="text-purple-700 font-semibold">할부 {formatCurrency(c.installmentAmount || 0)}</span>
                          <span className="mx-0.5">/</span>
                          <span className="text-teal-800 font-semibold">일시불 {formatCurrency(c.lumpSumAmount || 0)}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-right font-mono text-sm font-semibold text-slate-700">
                      <span className="text-emerald-700 font-bold">{formatCurrency(c.commissionAmount)}</span>
                      <span className="text-[10px] text-slate-400 ml-1 font-sans">({c.commissionRate}%)</span>
                    </td>
                    <td className="p-3 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Split Copy Button Group */}
                        <div className="inline-flex rounded-md shadow-2xs border border-slate-200 bg-white p-0.5">
                          <button
                            id={`btn-copy-all-${c.id}`}
                            type="button"
                            onClick={() => handleRowCopy(c, 'all')}
                            className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                              currentCopied === 'all'
                                ? 'bg-slate-900 text-white'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                            title="전체 양식 복사"
                          >
                            {currentCopied === 'all' ? '전체✓' : '전체'}
                          </button>
                          <button
                            id={`btn-copy-pay-${c.id}`}
                            type="button"
                            onClick={() => handleRowCopy(c, 'payment')}
                            className={`px-2 py-1 rounded text-[11px] font-bold border-l border-slate-200 transition-all ${
                              currentCopied === 'payment'
                                ? 'bg-teal-700 text-white'
                                : 'text-teal-700 hover:bg-teal-50'
                            }`}
                            title="결제안내 문구만 복사"
                          >
                            {currentCopied === 'payment' ? '결제✓' : '결제만'}
                          </button>
                          <button
                            id={`btn-copy-comm-${c.id}`}
                            type="button"
                            onClick={() => handleRowCopy(c, 'commission')}
                            className={`px-2 py-1 rounded text-[11px] font-bold border-l border-slate-200 transition-all ${
                              currentCopied === 'commission'
                                ? 'bg-emerald-600 text-white'
                                : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title="수수료 지급일정만 복사"
                          >
                            {currentCopied === 'commission' ? '수수료✓' : '수수료만'}
                          </button>
                        </div>

                        <button
                          id={`btn-delete-row-${c.id}`}
                          type="button"
                          onClick={() => onDeleteCustomer(c.id)}
                          className="p-1.5 rounded text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="행 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
