import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CustomerPaymentData, CardCompany, PaymentTypeFilter } from '../types';
import { formatCurrency, calculateCommission, parseNumber } from '../utils/parser';
import { getCardBadgeStyle, STATUS_OPTIONS } from './CustomerTable';
import { 
  Menu,
  RotateCw,
  Plus, 
  Check, 
  Copy, 
  Trash2, 
  Calendar,
  Sparkles,
  Percent,
  Coins,
  ChevronDown,
  ChevronUp,
  Search,
  X
} from 'lucide-react';

const CARD_COMPANIES: CardCompany[] = ['롯데', '하나', '농협', '우리', '국민', '신한', '삼성'];

interface InlineRateInputProps {
  initialValue: number | undefined | null;
  onCommit: (val: number | undefined) => void;
  className?: string;
  placeholder?: string;
  title?: string;
}

// 소수점(1.4, 0.1 등) 입력 시 .이 지워지지 않도록 로컬 문자열을 보존하는 컴포넌트
const InlineRateInput: React.FC<InlineRateInputProps> = ({
  initialValue,
  onCommit,
  className,
  placeholder,
  title,
}) => {
  const [localVal, setLocalVal] = useState<string>(
    initialValue !== undefined && initialValue !== null ? String(initialValue) : ''
  );
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setLocalVal(
        initialValue !== undefined && initialValue !== null ? String(initialValue) : ''
      );
    }
  }, [initialValue, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const parts = raw.split('.');
    const clean = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : raw;
    setLocalVal(clean);

    const num = parseFloat(clean);
    if (!isNaN(num) && num >= 0) {
      onCommit(num);
    } else if (clean === '') {
      onCommit(undefined);
    }
  };

  return (
    <input
      type="text"
      value={localVal}
      onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        setIsFocused(false);
        const num = parseFloat(localVal);
        if (!isNaN(num)) {
          setLocalVal(String(num));
          onCommit(num);
        } else {
          setLocalVal('');
          onCommit(undefined);
        }
      }}
      className={className}
      placeholder={placeholder}
      title={title}
    />
  );
};

// 금액 클릭 시 인라인으로 즉시 수정 가능한 컴포넌트 (콤마 자동 포맷팅)
interface InlineAmountInputProps {
  initialValue: number | undefined | null;
  onCommit: (val: number) => void;
  className?: string;
  placeholder?: string;
  title?: string;
  suffix?: string;
}

const InlineAmountInput: React.FC<InlineAmountInputProps> = ({
  initialValue,
  onCommit,
  className = '',
  placeholder = '0',
  title = '클릭하여 금액 수정',
  suffix = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localVal, setLocalVal] = useState<string>(
    initialValue !== undefined && initialValue !== null ? formatCurrency(initialValue) : ''
  );

  useEffect(() => {
    if (!isFocused) {
      setLocalVal(initialValue !== undefined && initialValue !== null ? formatCurrency(initialValue) : '');
    }
  }, [initialValue, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (!raw) {
      setLocalVal('');
      onCommit(0);
      return;
    }
    const num = parseInt(raw, 10);
    setLocalVal(formatCurrency(num));
    onCommit(num);
  };

  return (
    <div className="inline-flex items-center">
      <input
        type="text"
        value={localVal}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          const num = parseInt(localVal.replace(/[^0-9]/g, ''), 10) || 0;
          setLocalVal(formatCurrency(num));
          onCommit(num);
        }}
        className={className}
        placeholder={placeholder}
        title={title}
      />
      {suffix && <span className="text-[10px] font-bold text-slate-500 ml-0.5 select-none">{suffix}</span>}
    </div>
  );
};

interface TopWorkDashboardProps {
  customers: CustomerPaymentData[];
  selectedCustomerId: string | null;
  onSelectCustomer: (id: string) => void;
  onUpdateCustomer?: (updated: CustomerPaymentData) => void;
  onUpdateStatus: (id: string, newStatus: string) => void;
  onAddCustomer: (newCust: CustomerPaymentData) => void;
  onDeleteCustomer: (id: string) => void;
  onRefreshData?: () => void;
  activeStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
  selectedCardFilter: string | null;
  onSelectCardFilter: (card: string | null) => void;
  paymentTypeFilter: PaymentTypeFilter;
  onSelectPaymentTypeFilter: (filter: PaymentTypeFilter) => void;
  onCopySingleText: (customer: CustomerPaymentData) => void;
  copiedId: string | null;
}

export const TopWorkDashboard: React.FC<TopWorkDashboardProps> = ({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  onUpdateCustomer,
  onUpdateStatus,
  onAddCustomer,
  onDeleteCustomer,
  onRefreshData,
  activeStatusFilter,
  onSelectStatusFilter,
  selectedCardFilter,
  onSelectCardFilter,
  paymentTypeFilter,
  onSelectPaymentTypeFilter,
  onCopySingleText,
  copiedId,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMultiRowExpanded, setIsMultiRowExpanded] = useState(false);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const selectedRowRef = useRef<HTMLTableRowElement>(null);

  // 선택된 고객이 변경될 때 해당 행을 화면에 보이도록 자동 스크롤
  useEffect(() => {
    if (selectedCustomerId && selectedRowRef.current && tableContainerRef.current) {
      selectedRowRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedCustomerId]);

  // 새 업무 등록 폼 상태
  const [newName, setNewName] = useState('');
  const [newDealer, setNewDealer] = useState('');
  const [newCard, setNewCard] = useState<CardCompany>('농협');
  const [newAmount, setNewAmount] = useState('');
  const [newCarModel, setNewCarModel] = useState('');
  const [newInstallment, setNewInstallment] = useState('일시불');
  const [newInterestRate, setNewInterestRate] = useState('');
  const [newInstallmentRate, setNewInstallmentRate] = useState('0.3');
  const [newLumpSumRate, setNewLumpSumRate] = useState('0.4');
  const [newCommissionRate, setNewCommissionRate] = useState('0.4');
  const [newStatus, setNewStatus] = useState('할부완료');

  // 검색어 필터링
  const displayedCustomers = useMemo(() => {
    if (!searchTerm.trim()) return customers;
    const term = searchTerm.trim().toLowerCase();
    const termNumOnly = term.replace(/[^0-9]/g, '');
    return customers.filter(
      (c) =>
        c.customerName?.toLowerCase().includes(term) ||
        c.dealerInfo?.toLowerCase().includes(term) ||
        c.carModel?.toLowerCase().includes(term) ||
        c.cardCompany?.toLowerCase().includes(term) ||
        c.phoneNumber?.toLowerCase().includes(term) ||
        (termNumOnly.length >= 2 && (c.phoneNumber || '').replace(/[^0-9]/g, '').includes(termNumOnly)) ||
        c.residentNumber?.toLowerCase().includes(term) ||
        (termNumOnly.length >= 2 && (c.residentNumber || '').replace(/[^0-9]/g, '').includes(termNumOnly)) ||
        c.rowNumber?.includes(term) ||
        c.id?.toLowerCase().includes(term) ||
        c.bankName?.toLowerCase().includes(term) ||
        c.accountNumber?.includes(term) ||
        c.memo?.toLowerCase().includes(term)
    );
  }, [customers, searchTerm]);

  // 상태별 닷 스타일 및 텍스트 색상
  const getStatusDotInfo = (status: string) => {
    const st = status || '미처리';
    if (st.includes('결제준비')) {
      return { dot: 'bg-orange-500', text: 'text-orange-700 font-semibold' };
    }
    if (st.includes('할부완료')) {
      return { dot: 'bg-emerald-500', text: 'text-emerald-700 font-semibold' };
    }
    if (st.includes('증액완료')) {
      return { dot: 'bg-teal-500', text: 'text-teal-700 font-semibold' };
    }
    if (st.includes('증액대기')) {
      return { dot: 'bg-amber-500', text: 'text-amber-700 font-semibold' };
    }
    if (st.includes('발급완료')) {
      return { dot: 'bg-teal-500', text: 'text-teal-700 font-semibold' };
    }
    if (st.includes('접수완료') || st.includes('접수')) {
      return { dot: 'bg-purple-500', text: 'text-purple-700 font-semibold' };
    }
    if (st.includes('조회중') || st.includes('조회')) {
      return { dot: 'bg-indigo-500', text: 'text-indigo-700 font-semibold' };
    }
    return { dot: 'bg-slate-400', text: 'text-slate-600' };
  };

  // 날짜 포맷팅 (오늘 날짜 기본)
  const getFormattedDate = (createdAt?: number) => {
    if (!createdAt) {
      const today = new Date();
      return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }
    const d = new Date(createdAt);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // 인라인 수정 헬퍼 함수들
  const updateCustomerField = (cust: CustomerPaymentData, updates: Partial<CustomerPaymentData>) => {
    if (!onUpdateCustomer) return;
    const updated = { ...cust, ...updates };
    onUpdateCustomer(updated);
  };

  const handleUpdateTotalAmount = (cust: CustomerPaymentData, newTotal: number) => {
    const isHybrid = Boolean(
      cust.isHybridPayment ||
      (cust.installmentAmount && cust.lumpSumAmount && cust.installmentAmount > 0 && cust.lumpSumAmount > 0)
    );
    if (isHybrid) {
      const lump = cust.lumpSumAmount || 0;
      const newInst = Math.max(0, newTotal - lump);
      const instRate = cust.installmentCommissionRate ?? 0.3;
      const lumpRate = cust.lumpSumCommissionRate ?? 0.3;
      const totalGross = Math.round((newInst * instRate) / 100) + Math.round((lump * lumpRate) / 100);
      const tax = (cust.applyTaxWithholding ?? true) ? Math.round(totalGross * 0.033) : 0;
      const net = totalGross - tax;
      updateCustomerField(cust, {
        paymentAmount: newTotal,
        installmentAmount: newInst,
        commissionAmount: net,
      });
    } else {
      const commRate = cust.commissionRate || 0.4;
      const calculated = calculateCommission(newTotal, commRate, cust.applyTaxWithholding ?? true);
      const cashRate = cust.customerCashbackRate || 0;
      const cashAmount = cashRate > 0 ? Math.round((newTotal * cashRate) / 100) : undefined;
      updateCustomerField(cust, {
        paymentAmount: newTotal,
        commissionAmount: calculated.netPayout,
        customerCashbackAmount: cashAmount,
      });
    }
  };

  const handleUpdateHybridInstallmentAmount = (cust: CustomerPaymentData, newInst: number) => {
    const lump = cust.lumpSumAmount || 0;
    const newTotal = newInst + lump;
    const instRate = cust.installmentCommissionRate ?? 0.3;
    const lumpRate = cust.lumpSumCommissionRate ?? 0.3;
    const totalGross = Math.round((newInst * instRate) / 100) + Math.round((lump * lumpRate) / 100);
    const tax = (cust.applyTaxWithholding ?? true) ? Math.round(totalGross * 0.033) : 0;
    const net = totalGross - tax;
    updateCustomerField(cust, {
      paymentAmount: newTotal,
      installmentAmount: newInst,
      commissionAmount: net,
    });
  };

  const handleUpdateHybridLumpSumAmount = (cust: CustomerPaymentData, newLump: number) => {
    const inst = cust.installmentAmount || 0;
    const newTotal = inst + newLump;
    const instRate = cust.installmentCommissionRate ?? 0.3;
    const lumpRate = cust.lumpSumCommissionRate ?? 0.3;
    const totalGross = Math.round((inst * instRate) / 100) + Math.round((newLump * lumpRate) / 100);
    const tax = (cust.applyTaxWithholding ?? true) ? Math.round(totalGross * 0.033) : 0;
    const net = totalGross - tax;
    updateCustomerField(cust, {
      paymentAmount: newTotal,
      lumpSumAmount: newLump,
      commissionAmount: net,
    });
  };

  const handleInlineAmountChange = (cust: CustomerPaymentData, rawVal: string) => {
    const amount = parseNumber(rawVal);
    handleUpdateTotalAmount(cust, amount);
  };

  const handleInlineCommissionRateCommit = (cust: CustomerPaymentData, rate: number | undefined) => {
    const commRate = rate ?? 0.4;
    const calculated = calculateCommission(cust.paymentAmount, commRate, cust.applyTaxWithholding ?? true);
    updateCustomerField(cust, {
      commissionRate: commRate,
      commissionAmount: calculated.netPayout,
      cardCompanyDirectRate: cust.cardCompanyDirectRate ?? commRate,
    });
  };

  const handleInlineInstallmentRateCommit = (cust: CustomerPaymentData, rate: number | undefined) => {
    const isHybrid = Boolean(
      cust.isHybridPayment ||
      (cust.installmentAmount && cust.lumpSumAmount && cust.installmentAmount > 0 && cust.lumpSumAmount > 0)
    );
    const instRate = rate ?? 0.3;
    if (isHybrid) {
      const instAmt = cust.installmentAmount || 0;
      const lumpAmt = cust.lumpSumAmount || 0;
      const lumpRate = cust.lumpSumCommissionRate ?? 0.3;
      const totalGross = Math.round((instAmt * instRate) / 100) + Math.round((lumpAmt * lumpRate) / 100);
      const tax = (cust.applyTaxWithholding ?? true) ? Math.round(totalGross * 0.033) : 0;
      const net = totalGross - tax;
      updateCustomerField(cust, {
        installmentCommissionRate: instRate,
        commissionAmount: net,
      });
    } else {
      const calculated = calculateCommission(cust.paymentAmount, instRate, cust.applyTaxWithholding ?? true);
      updateCustomerField(cust, {
        installmentCommissionRate: instRate,
        commissionRate: instRate,
        commissionAmount: calculated.netPayout,
      });
    }
  };

  const handleInlineLumpSumRateCommit = (cust: CustomerPaymentData, rate: number | undefined) => {
    const isHybrid = Boolean(
      cust.isHybridPayment ||
      (cust.installmentAmount && cust.lumpSumAmount && cust.installmentAmount > 0 && cust.lumpSumAmount > 0)
    );
    const lumpRate = rate ?? 0.4;
    if (isHybrid) {
      const instAmt = cust.installmentAmount || 0;
      const lumpAmt = cust.lumpSumAmount || 0;
      const instRate = cust.installmentCommissionRate ?? 0.3;
      const totalGross = Math.round((instAmt * instRate) / 100) + Math.round((lumpAmt * lumpRate) / 100);
      const tax = (cust.applyTaxWithholding ?? true) ? Math.round(totalGross * 0.033) : 0;
      const net = totalGross - tax;
      updateCustomerField(cust, {
        lumpSumCommissionRate: lumpRate,
        commissionAmount: net,
      });
    } else {
      const calculated = calculateCommission(cust.paymentAmount, lumpRate, cust.applyTaxWithholding ?? true);
      updateCustomerField(cust, {
        lumpSumCommissionRate: lumpRate,
        commissionRate: lumpRate,
        commissionAmount: calculated.netPayout,
      });
    }
  };

  const handleInlineInstallmentChange = (cust: CustomerPaymentData, months: string) => {
    if (months === '복합') {
      const currentInstMonths = (!cust.installmentMonths || cust.installmentMonths === '일시불' || cust.installmentMonths === '0') ? '60' : cust.installmentMonths;
      const totalAmt = cust.paymentAmount || ((cust.installmentAmount || 0) + (cust.lumpSumAmount || 0));
      const instAmt = cust.installmentAmount && cust.installmentAmount > 0 ? cust.installmentAmount : totalAmt;
      const lumpAmt = cust.lumpSumAmount || 0;
      const instRate = cust.installmentCommissionRate ?? (cust.commissionRate || 0.3);
      const lumpRate = cust.lumpSumCommissionRate ?? 0.4;
      const totalGross = Math.round((instAmt * instRate) / 100) + Math.round((lumpAmt * lumpRate) / 100);
      const tax = cust.applyTaxWithholding ? Math.round(totalGross * 0.033) : 0;
      const net = totalGross - tax;

      updateCustomerField(cust, {
        isHybridPayment: true,
        installmentMonths: currentInstMonths,
        installmentAmount: instAmt,
        lumpSumAmount: lumpAmt,
        paymentAmount: instAmt + lumpAmt > 0 ? instAmt + lumpAmt : totalAmt,
        commissionAmount: net,
        paymentMethodNote: '일시불로 결제 부탁드립니다~',
      });
      return;
    }

    const isLump = months === '일시불' || months === '0';
    const totalAmt = cust.paymentAmount || ((cust.installmentAmount || 0) + (cust.lumpSumAmount || 0));
    const rate = isLump 
      ? (cust.lumpSumCommissionRate ?? cust.commissionRate ?? 0.4)
      : (cust.installmentCommissionRate ?? cust.commissionRate ?? 0.3);
    const calculated = calculateCommission(totalAmt, rate, cust.applyTaxWithholding);

    updateCustomerField(cust, {
      isHybridPayment: false,
      installmentMonths: isLump ? '일시불' : months,
      paymentAmount: totalAmt,
      installmentAmount: isLump ? 0 : totalAmt,
      lumpSumAmount: isLump ? totalAmt : 0,
      commissionRate: rate,
      commissionAmount: calculated.netPayout,
      paymentMethodNote: cust.paymentMethodNote || '일시불로 결제 부탁드립니다~',
    });
  };

  // 신규 업무 등록 핸들러
  const handleAddNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('고객명을 입력해주세요.');
      return;
    }

    const rawNum = parseInt(newAmount.replace(/[^0-9]/g, ''), 10) || 0;
    const commRateNum = parseFloat(newCommissionRate) || 0.4;
    const instRateNum = parseFloat(newInstallmentRate) || 0.3;
    const lumpRateNum = parseFloat(newLumpSumRate) || 0.4;
    const isLump = newInstallment === '일시불' || newInstallment === '0';
    const rateToUse = isLump ? lumpRateNum : instRateNum;
    const calculated = calculateCommission(rawNum, rateToUse, true);

    const newCust: CustomerPaymentData = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      customerName: newName.trim(),
      dealerInfo: newDealer.trim() || undefined,
      cardCompany: newCard,
      paymentAmount: rawNum,
      commissionRate: rateToUse,
      installmentCommissionRate: !isLump ? instRateNum : undefined,
      lumpSumCommissionRate: isLump ? lumpRateNum : undefined,
      commissionAmount: calculated.netPayout,
      applyTaxWithholding: true,
      installmentMonths: isLump ? '일시불' : newInstallment,
      interestRate: !isLump && newInterestRate ? newInterestRate : undefined,
      carModel: newCarModel.trim() || '차량',
      status: newStatus,
      paymentMethodNote: '일시불로 결제 부탁드립니다~',
      cardNumberOption: '직접전달',
      cardCompanyDirectPayout: ['하나', '우리', '국민'].includes(newCard),
      cardCompanyDirectRate: rateToUse,
      createdAt: Date.now(),
    };

    onAddCustomer(newCust);
    onSelectCustomer(newCust.id);

    // 폼 초기화
    setNewName('');
    setNewDealer('');
    setNewAmount('');
    setNewCarModel('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white border-b border-slate-200 shadow-2xs">
      {/* 1. Header Card with Search & Quick Actions */}
      <div className="px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Menu className="w-4 h-4 text-slate-700" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight whitespace-nowrap">
              데이터 목록
            </h2>
            <span className="text-[11px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {customers.length}건
              {searchTerm && ` (${displayedCustomers.length}건)`}
            </span>
          </div>

            {/* Quick Name / Dealer Search Bar */}
            <div className="relative flex items-center min-w-[170px] sm:min-w-[220px]">
              <Search className="w-3 h-3 text-slate-400 absolute left-2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="고객명, 연락처, 딜러명, 차종 검색..."
                className="w-full text-xs pl-7 pr-6 py-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-teal-500 rounded-md focus:outline-hidden text-slate-800 placeholder-slate-400 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-1.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  title="검색어 지우기"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Quick Add Button */}
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className={`w-3 h-3 transition-transform ${isAdding ? 'rotate-45' : ''}`} />
            <span>{isAdding ? '닫기' : '새 업무 등록'}</span>
          </button>

          {/* 1줄 보기 / 여러 줄 펼치기 토글 */}
          <button
            type="button"
            onClick={() => setIsMultiRowExpanded(!isMultiRowExpanded)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              isMultiRowExpanded
                ? 'bg-teal-100 text-teal-800 hover:bg-teal-200 border border-teal-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
            }`}
            title={isMultiRowExpanded ? '1줄 컴팩트 뷰로 전환' : '여러 줄 펼쳐보기'}
          >
            <Menu className="w-3 h-3" />
            <span>{isMultiRowExpanded ? '1줄 보기' : '여러줄 펼치기'}</span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefreshData}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-2xs cursor-pointer whitespace-nowrap"
            title="데이터 새로고침"
          >
            <RotateCw className="w-3 h-3 text-slate-500" />
            <span className="hidden sm:inline">새로고침</span>
          </button>

          {/* Toggle Fold / Expand Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer whitespace-nowrap"
            title={isCollapsed ? '데이터 목록 펼치기' : '데이터 목록 접기'}
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="w-3 h-3" />
                <span>펼치기</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3 h-3" />
                <span>접기</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Direct Task Registration Form (Collapsible) */}
      {isAdding && (
        <form
          onSubmit={handleAddNewSubmit}
          className="bg-teal-50/70 border-b border-teal-100 p-4 sm:px-6 flex flex-wrap items-end gap-3 animate-fade-in"
        >
          <div className="flex-1 min-w-[110px]">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">고객명 *</label>
            <input
              type="text"
              required
              placeholder="예: 김성우"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:border-teal-600 focus:outline-hidden font-bold text-slate-900"
            />
          </div>

          <div className="flex-1 min-w-[120px]">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">딜러 / 영업사원</label>
            <input
              type="text"
              placeholder="예: 기아 안명균"
              value={newDealer}
              onChange={(e) => setNewDealer(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:border-teal-600 focus:outline-hidden font-semibold text-slate-800"
            />
          </div>

          <div className="w-24 min-w-[90px]">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">카드사</label>
            <select
              value={newCard}
              onChange={(e) => {
                const c = e.target.value as CardCompany;
                setNewCard(c);
                setNewStatus('결제준비');
              }}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:border-teal-600 focus:outline-hidden font-semibold text-slate-900"
            >
              {CARD_COMPANIES.map((card) => (
                <option key={card} value={card}>
                  {card}카드
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[120px]">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">결제금액 (원)</label>
            <input
              type="text"
              placeholder="예: 27,666,000"
              value={newAmount}
              onChange={(e) => {
                const num = e.target.value.replace(/[^0-9]/g, '');
                setNewAmount(num ? Number(num).toLocaleString() : '');
              }}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:border-teal-600 focus:outline-hidden font-bold font-mono text-slate-900 text-right"
            />
          </div>

          <div className="w-28 min-w-[90px]">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">구분(일시불/할부)</label>
            <select
              value={newInstallment}
              onChange={(e) => setNewInstallment(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:border-teal-600 focus:outline-hidden font-semibold text-slate-900"
            >
              <option value="일시불">일시불</option>
              <option value="12">할부 12개월</option>
              <option value="24">할부 24개월</option>
              <option value="36">할부 36개월</option>
              <option value="48">할부 48개월</option>
              <option value="60">할부 60개월</option>
            </select>
          </div>

          {newInstallment !== '일시불' && (
            <div className="w-18 min-w-[70px]">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">금리(%)</label>
              <input
                type="text"
                placeholder="예: 4"
                value={newInterestRate}
                onChange={(e) => setNewInterestRate(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:border-teal-600 focus:outline-hidden font-mono font-bold text-slate-900 text-center"
              />
            </div>
          )}

          {newInstallment !== '일시불' ? (
            <div className="w-24 min-w-[80px]">
              <label className="block text-[11px] font-bold text-purple-800 mb-1">할부수수료(%)</label>
              <input
                type="text"
                value={newInstallmentRate}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, '');
                  setNewInstallmentRate(val);
                }}
                placeholder="예: 0.3"
                className="w-full text-xs bg-white border border-purple-300 rounded-md px-2 py-1.5 focus:border-purple-600 focus:outline-hidden font-mono font-bold text-purple-700 text-center"
              />
            </div>
          ) : (
            <div className="w-24 min-w-[80px]">
              <label className="block text-[11px] font-bold text-sky-800 mb-1">일시불수수료(%)</label>
              <input
                type="text"
                value={newLumpSumRate}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, '');
                  setNewLumpSumRate(val);
                }}
                placeholder="예: 0.4"
                className="w-full text-xs bg-white border border-sky-300 rounded-md px-2 py-1.5 focus:border-sky-600 focus:outline-hidden font-mono font-bold text-sky-700 text-center"
              />
            </div>
          )}

          <div className="w-24 min-w-[80px]">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">차종</label>
            <input
              type="text"
              placeholder="포터, 쏘나타"
              value={newCarModel}
              onChange={(e) => setNewCarModel(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:border-teal-600 focus:outline-hidden font-medium text-slate-900"
            />
          </div>

          <div className="w-28 min-w-[90px]">
            <label className="block text-[11px] font-bold text-slate-700 mb-1">진행상태</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-md px-2 py-1.5 focus:border-teal-600 focus:outline-hidden font-bold text-slate-900"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-md shadow-2xs whitespace-nowrap cursor-pointer"
          >
            업무 등록 완료
          </button>
        </form>
      )}

      {/* 3. Table with Direct Editable Cells (1줄 컴팩트 뷰 & 스크롤 지원) */}
      {!isCollapsed && (
        <div
          ref={tableContainerRef}
          className={`overflow-x-auto overflow-y-auto scrollbar-thin rounded-b-xl animate-fade-in transition-all ${
            isMultiRowExpanded ? 'max-h-[300px]' : 'h-[132px] max-h-[132px]'
          }`}
        >
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50 shadow-2xs">
            <tr className="text-slate-600 font-semibold border-b border-slate-200">
              <th className="py-2 px-3.5 whitespace-nowrap w-[170px] bg-slate-50">날짜/고객명 (딜러)</th>
              <th className="py-2 px-3 whitespace-nowrap w-[110px] bg-slate-50">차종</th>
              <th className="py-2 px-3 whitespace-nowrap w-[90px] bg-slate-50">카드사</th>
              <th className="py-2 px-3 whitespace-nowrap w-[130px] bg-slate-50">구분 (일시/할부)</th>
              <th className="py-2 px-3 whitespace-nowrap text-right w-[130px] bg-slate-50">결제금액</th>
              <th className="py-2 px-3 whitespace-nowrap text-right w-[125px] bg-slate-50 text-slate-700 font-bold">할부 수수료</th>
              <th className="py-2 px-3 whitespace-nowrap text-right w-[125px] bg-slate-50 text-slate-700 font-bold">일시불 수수료</th>
              <th className="py-2 px-3 whitespace-nowrap text-right w-[140px] bg-slate-50 text-slate-900 font-bold">전체 수수료 (실지급액)</th>
              <th className="py-2 px-3 whitespace-nowrap w-[120px] bg-slate-50">진행상태</th>
              <th className="py-2 px-3 whitespace-nowrap w-[150px] bg-slate-50">메모/특이사항</th>
              <th className="py-2 px-3 whitespace-nowrap text-center w-[80px] bg-slate-50">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedCustomers.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-6 text-center text-slate-400 font-medium">
                  {searchTerm ? (
                    <div className="flex flex-col items-center gap-1">
                      <span>"{searchTerm}"에 대한 검색 결과가 없습니다.</span>
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="text-xs text-slate-800 font-semibold hover:underline"
                      >
                        검색어 초기화
                      </button>
                    </div>
                  ) : (
                    '스프레드시트에서 데이터를 복사하여 붙여넣거나 [새 업무 직접 등록]을 눌러주세요.'
                  )}
                </td>
              </tr>
            ) : (
              displayedCustomers.map((cust) => {
                const isSelected = cust.id === selectedCustomerId;
                const statusDot = getStatusDotInfo(cust.status || '미처리');
                const isLump = !cust.installmentMonths || cust.installmentMonths === '일시불' || cust.installmentMonths === '0' || cust.installmentMonths === '1' || cust.installmentMonths === '-';
                const isHybrid = Boolean(cust.isHybridPayment || (cust.installmentAmount && cust.lumpSumAmount && cust.installmentAmount > 0 && cust.lumpSumAmount > 0));
                const hasInstallment = !isLump || isHybrid;
                const hasLump = isLump || isHybrid;

                const instRate = cust.installmentCommissionRate ?? (isHybrid ? 0.3 : cust.commissionRate || 0.3);
                const instAmt = isHybrid ? (cust.installmentAmount || 0) : cust.paymentAmount;
                const instFee = Math.round((instAmt * instRate) / 100);

                const lumpRate = cust.lumpSumCommissionRate ?? (isHybrid ? 0.3 : cust.commissionRate || 0.4);
                const lumpAmt = isHybrid ? (cust.lumpSumAmount || 0) : cust.paymentAmount;
                const lumpFee = Math.round((lumpAmt * lumpRate) / 100);

                return (
                  <tr
                    key={cust.id}
                    ref={isSelected ? selectedRowRef : undefined}
                    onClick={() => onSelectCustomer(cust.id)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-slate-100/90 font-semibold text-slate-950 border-l-4 border-l-slate-900 shadow-2xs'
                        : 'hover:bg-slate-50/80 text-slate-700'
                    }`}
                  >
                    {/* 날짜 / 고객명 및 딜러명 (직접 수정 가능) */}
                    <td className="py-2 px-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={cust.customerName}
                            onChange={(e) => updateCustomerField(cust, { customerName: e.target.value })}
                            onFocus={() => onSelectCustomer(cust.id)}
                            className={`text-xs font-bold px-1 py-0.5 rounded border border-transparent hover:border-slate-300 focus:border-slate-500 focus:bg-white focus:outline-hidden transition-all ${
                              isSelected ? 'text-slate-950' : 'text-slate-900'
                            }`}
                            placeholder="고객명"
                            title="고객명 직접 수정"
                          />
                          <input
                            type="text"
                            value={cust.dealerInfo || ''}
                            onChange={(e) => updateCustomerField(cust, { dealerInfo: e.target.value })}
                            onFocus={() => onSelectCustomer(cust.id)}
                            className="text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-white px-1.5 py-0.5 rounded border border-slate-200 hover:border-slate-300 focus:border-slate-500 focus:bg-white focus:outline-hidden transition-all max-w-[110px]"
                            placeholder="딜러/영업사원"
                            title="딜러 / 영업사원 (예: 기아 안명균, 현대 오도원)"
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono px-1">
                          {getFormattedDate(cust.createdAt)}
                        </span>
                      </div>
                    </td>

                    {/* 차종 (직접 수정 가능) */}
                    <td className="py-2 px-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={cust.carModel || ''}
                        onChange={(e) => updateCustomerField(cust, { carModel: e.target.value })}
                        onFocus={() => onSelectCustomer(cust.id)}
                        className="w-full text-xs font-medium text-slate-800 px-1.5 py-0.5 rounded border border-transparent hover:border-slate-300 focus:border-slate-500 focus:bg-white focus:outline-hidden transition-all"
                        placeholder="차종"
                        title="차종 직접 수정"
                      />
                    </td>

                    {/* 카드사 (드롭다운으로 바로 변경) */}
                    <td className="py-2 px-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={cust.cardCompany}
                        onChange={(e) => {
                          const newCard = e.target.value as CardCompany;
                          const isDirectCard = ['하나', '우리', '국민'].includes(newCard);
                          updateCustomerField(cust, {
                            cardCompany: newCard,
                            status: '결제준비',
                            cardCompanyDirectPayout: cust.cardCompanyDirectPayout !== undefined ? cust.cardCompanyDirectPayout : isDirectCard,
                          });
                        }}
                        onFocus={() => onSelectCustomer(cust.id)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-slate-500 ${getCardBadgeStyle(
                          cust.cardCompany
                        )}`}
                        title="카드사 변경"
                      >
                        {CARD_COMPANIES.map((card) => (
                          <option key={card} value={card}>
                            {card}카드
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* 구분 (일시불 vs 할부 개월수 및 금리 직접 선택/수정, 복합결제 표시 및 전환) */}
                    <td className="py-2 px-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      {cust.isHybridPayment ? (
                        <div className="flex flex-col gap-1 max-w-[195px]">
                          <div className="flex items-center justify-between gap-1">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white shadow-2xs w-fit">
                              <span>할부 + 일시불</span>
                            </span>
                            <select
                              value="복합"
                              onChange={(e) => handleInlineInstallmentChange(cust, e.target.value)}
                              className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 rounded px-1 py-0.5 cursor-pointer hover:border-slate-400"
                              title="단일 결제 방식으로 변경"
                            >
                              <option value="복합">복합 유지</option>
                              <option value="일시불">일시불로 변경</option>
                              <option value="12">12개월 할부로 변경</option>
                              <option value="24">24개월 할부로 변경</option>
                              <option value="36">36개월 할부로 변경</option>
                              <option value="48">48개월 할부로 변경</option>
                              <option value="60">60개월 할부로 변경</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-semibold text-slate-700 shrink-0">1. 일시불:</span>
                            <InlineAmountInput
                              initialValue={cust.lumpSumAmount || 0}
                              onCommit={(val) => handleUpdateHybridLumpSumAmount(cust, val)}
                              className="w-20 text-[10px] font-mono font-bold text-slate-800 text-right px-1 py-0.5 rounded bg-slate-50 border border-slate-200 hover:border-slate-400 focus:bg-white focus:outline-hidden"
                              suffix="원"
                              title="일시불 결제금액 직접 수정 (클릭)"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-semibold text-slate-700 shrink-0">2. {cust.installmentMonths || 60}개월:</span>
                            <InlineAmountInput
                              initialValue={cust.installmentAmount || 0}
                              onCommit={(val) => handleUpdateHybridInstallmentAmount(cust, val)}
                              className="w-20 text-[10px] font-mono font-bold text-slate-800 text-right px-1 py-0.5 rounded bg-slate-50 border border-slate-200 hover:border-slate-400 focus:bg-white focus:outline-hidden"
                              suffix="원"
                              title="할부 결제금액 직접 수정 (클릭)"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <select
                            value={isLump ? '일시불' : cust.installmentMonths}
                            onChange={(e) => handleInlineInstallmentChange(cust, e.target.value)}
                            onFocus={() => onSelectCustomer(cust.id)}
                            className="px-1.5 py-0.5 rounded text-[11px] font-bold border cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-slate-500 bg-white text-slate-700 border-slate-300"
                            title="일시불/할부/복합 구분 변경"
                          >
                            <option value="일시불">일시불</option>
                            <option value="12">12개월</option>
                            <option value="24">24개월</option>
                            <option value="36">36개월</option>
                            <option value="48">48개월</option>
                            <option value="60">60개월</option>
                            <option value="복합">＋ 복합(할부+일시불)</option>
                          </select>

                          {!isLump && (
                            <div className="relative w-14">
                              <input
                                type="text"
                                value={cust.interestRate || ''}
                                onChange={(e) => updateCustomerField(cust, { interestRate: e.target.value })}
                                placeholder="금리"
                                className="w-full text-[11px] font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-center focus:bg-white focus:outline-hidden pr-3.5"
                                title="할부 금리 (%)"
                              />
                              <span className="absolute right-1 top-0.5 text-[10px] text-slate-400 font-mono">%</span>
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* 결제금액 (클릭 시 직접 수정 가능 / 복합결제 시 할부금 + 일시불금액 상세 표기 및 클릭 수정) */}
                    <td className="py-2 px-3 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      {cust.isHybridPayment ? (
                        <div className="flex flex-col items-end gap-0.5">
                          <div className="flex items-center justify-end">
                            <InlineAmountInput
                              initialValue={cust.paymentAmount}
                              onCommit={(val) => handleUpdateTotalAmount(cust, val)}
                              className="w-28 text-xs font-mono font-bold text-slate-900 text-right px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 hover:border-slate-400 focus:border-slate-500 focus:bg-white focus:outline-hidden transition-all"
                              suffix="원"
                              title="총 결제금액 직접 수정 (클릭)"
                            />
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 flex flex-col items-end leading-tight gap-0.5">
                            <div className="flex items-center gap-1">
                              <span className="text-slate-600 font-medium">할부금:</span>
                              <InlineAmountInput
                                initialValue={cust.installmentAmount || 0}
                                onCommit={(val) => handleUpdateHybridInstallmentAmount(cust, val)}
                                className="w-22 text-[10px] font-mono font-bold text-slate-800 text-right px-1 py-0.2 rounded bg-slate-50 border border-slate-200 hover:border-slate-400 focus:bg-white focus:outline-hidden"
                                suffix="원"
                                title="할부금 직접 수정 (클릭)"
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-slate-600 font-medium">일시불금액:</span>
                              <InlineAmountInput
                                initialValue={cust.lumpSumAmount || 0}
                                onCommit={(val) => handleUpdateHybridLumpSumAmount(cust, val)}
                                className="w-22 text-[10px] font-mono font-bold text-slate-800 text-right px-1 py-0.2 rounded bg-slate-50 border border-slate-200 hover:border-slate-400 focus:bg-white focus:outline-hidden"
                                suffix="원"
                                title="일시불금액 직접 수정 (클릭)"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end">
                          <InlineAmountInput
                            initialValue={cust.paymentAmount}
                            onCommit={(val) => handleUpdateTotalAmount(cust, val)}
                            className="w-28 text-xs font-mono font-bold text-slate-900 text-right px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 hover:border-slate-400 focus:border-slate-500 focus:bg-white focus:outline-hidden transition-all"
                            suffix="원"
                            title="결제금액 직접 수정 (클릭)"
                          />
                        </div>
                      )}
                    </td>

                    {/* 1. 할부 수수료 */}
                    <td className="py-2 px-3 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      {hasInstallment ? (
                        <div className="flex flex-col items-end">
                          <div className="flex items-center justify-end gap-0.5">
                            <InlineRateInput
                              initialValue={instRate}
                              onCommit={(newRate) => handleInlineInstallmentRateCommit(cust, newRate)}
                              className="w-12 text-xs font-mono font-bold text-slate-800 text-right px-1 py-0.5 rounded border border-transparent hover:border-slate-200 focus:border-slate-500 focus:bg-white focus:outline-hidden transition-all"
                              placeholder="0.3"
                              title="할부 수수료율 (%) 직접 수정"
                            />
                            <span className="text-xs text-slate-600 font-bold">%</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-700 font-semibold pr-1">
                            {formatCurrency(instFee)}원
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-300 font-mono pr-2">-</span>
                      )}
                    </td>

                    {/* 2. 일시불 수수료 */}
                    <td className="py-2 px-3 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      {hasLump ? (
                        <div className="flex flex-col items-end">
                          <div className="flex items-center justify-end gap-0.5">
                            <InlineRateInput
                              initialValue={lumpRate}
                              onCommit={(newRate) => handleInlineLumpSumRateCommit(cust, newRate)}
                              className="w-12 text-xs font-mono font-bold text-slate-800 text-right px-1 py-0.5 rounded border border-transparent hover:border-slate-200 focus:border-slate-500 focus:bg-white focus:outline-hidden transition-all"
                              placeholder="0.4"
                              title="일시불 수수료율 (%) 직접 수정"
                            />
                            <span className="text-xs text-slate-600 font-bold">%</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-700 font-semibold pr-1">
                            {formatCurrency(lumpFee)}원
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-300 font-mono pr-2">-</span>
                      )}
                    </td>

                    {/* 3. 전체 수수료 (실지급액) */}
                    <td className="py-2 px-3 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center justify-end gap-0.5">
                          {cust.isHybridPayment && (
                            <span className="text-[10px] text-slate-600 font-bold mr-0.5">합계</span>
                          )}
                          <InlineRateInput
                            initialValue={cust.commissionRate}
                            onCommit={(newRate) => handleInlineCommissionRateCommit(cust, newRate)}
                            className="w-12 text-xs font-mono font-bold text-slate-900 text-right px-1 py-0.5 rounded border border-transparent hover:border-slate-200 focus:border-slate-500 focus:bg-white focus:outline-hidden transition-all"
                            placeholder="0.4"
                            title="전체 수수료율 (%) 직접 수정"
                          />
                          <span className="text-xs text-slate-700 font-bold">%</span>
                        </div>
                        <span className="font-mono font-bold text-[10px] text-slate-900 pr-1">
                          {formatCurrency(cust.commissionAmount)}원
                        </span>
                      </div>
                    </td>

                    {/* 진행상태 (컬러 닷 + 상태 선택 드롭다운) */}
                    <td className="py-2 px-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${statusDot.dot}`} />
                        <select
                          value={cust.status || '할부완료'}
                          onChange={(e) => onUpdateStatus(cust.id, e.target.value)}
                          className={`text-xs bg-transparent border-0 font-semibold cursor-pointer focus:ring-0 focus:outline-hidden py-0.5 pr-3 ${statusDot.text}`}
                          title="진행상태 변경"
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* 메모 / 특이사항 */}
                    <td className="py-2 px-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={cust.memo || ''}
                        onChange={(e) => updateCustomerField(cust, { memo: e.target.value })}
                        onFocus={() => onSelectCustomer(cust.id)}
                        placeholder="메모 입력"
                        className="w-full text-xs text-slate-700 bg-slate-50 hover:bg-white focus:bg-white px-2 py-0.5 rounded border border-transparent hover:border-slate-300 focus:border-slate-500 focus:outline-hidden transition-all truncate"
                        title={cust.memo || '고객 특이사항/메모 직접 입력 (클릭)'}
                      />
                    </td>

                    {/* 작업 (선택 버튼 + 복사 + 삭제) */}
                    <td className="py-2 px-3 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectCustomer(cust.id)}
                          className={`text-xs font-bold transition-colors cursor-pointer ${
                            isSelected ? 'text-teal-700 underline' : 'text-teal-700 hover:text-teal-900'
                          }`}
                        >
                          선택
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => onCopySingleText(cust)}
                          className="p-1 text-slate-400 hover:text-teal-700 rounded transition-colors cursor-pointer"
                          title="결제문구 복사"
                        >
                          {copiedId === cust.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteCustomer(cust.id)}
                          className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};
