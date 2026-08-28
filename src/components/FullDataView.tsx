import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CustomerPaymentData, CardCompany, PaymentTypeFilter } from '../types';
import { formatCurrency, calculateCommission, parseNumber } from '../utils/parser';
import { getCardBadgeStyle, STATUS_OPTIONS, getStatusBadge } from './CustomerTable';
import { 
  Search, 
  X, 
  Download, 
  Copy, 
  Check, 
  Trash2, 
  Plus, 
  Sparkles, 
  CreditCard, 
  DollarSign, 
  ArrowRight,
  Filter,
  CheckCircle2,
  Calendar,
  Building2,
  Edit3,
  Percent,
  FileSpreadsheet,
  Layers,
  ChevronDown,
  AlertTriangle,
  RotateCcw,
  CheckSquare,
  Square
} from 'lucide-react';

const CARD_COMPANIES: CardCompany[] = ['롯데', '하나', '농협', '우리', '국민', '신한', '삼성'];

interface InlineRateInputProps {
  initialValue: number | undefined | null;
  onCommit: (val: number | undefined) => void;
  className?: string;
  placeholder?: string;
  title?: string;
}

// 소수점 입력 시 .이 지워지지 않도록 로컬 문자열을 보존하는 인라인 입력 컴포넌트
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

  const handleBlur = () => {
    setIsFocused(false);
    const num = parseFloat(localVal);
    if (!isNaN(num) && num >= 0) {
      onCommit(num);
      setLocalVal(String(num));
    } else {
      onCommit(undefined);
      setLocalVal('');
    }
  };

  return (
    <input
      type="text"
      value={localVal}
      onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      title={title}
    />
  );
};

interface FullDataViewProps {
  customers: CustomerPaymentData[];
  selectedCustomerId: string | null;
  onSelectCustomer: (id: string) => void;
  onUpdateCustomer: (updated: CustomerPaymentData) => void;
  onUpdateStatus: (id: string, newStatus: string) => void;
  onAddCustomer: (newCust: CustomerPaymentData) => void;
  onDeleteCustomer: (id: string) => void;
  onDeleteCustomers?: (ids: string[]) => void;
  onResetAll?: () => void;
  onNavigateToWorkspace: (customerId: string) => void;
  onCopySingleText: (customer: CustomerPaymentData, type?: 'all' | 'payment' | 'commission') => void;
  onBatchCopyAll: (type?: 'all' | 'payment' | 'commission') => void;
  copiedId: string | null;
}

export const FullDataView: React.FC<FullDataViewProps> = ({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  onUpdateCustomer,
  onUpdateStatus,
  onAddCustomer,
  onDeleteCustomer,
  onDeleteCustomers,
  onResetAll,
  onNavigateToWorkspace,
  onCopySingleText,
  onBatchCopyAll,
  copiedId,
}) => {
  // 1. 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState<string>('전체');
  const [selectedStatus, setSelectedStatus] = useState<string>('전체');
  const [paymentType, setPaymentType] = useState<PaymentTypeFilter>('all');
  
  // 2. 선택 체크박스 (다중 선택 및 일괄 작업)
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  // 3. 모달 제어 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'single' | 'batch' | 'all';
    targetCustomer?: CustomerPaymentData;
    targetIds?: string[];
  }>({
    isOpen: false,
    type: 'single',
  });

  // 4. 신규 추가 폼 상태
  const [newName, setNewName] = useState('');
  const [newDealer, setNewDealer] = useState('');
  const [newCard, setNewCard] = useState<CardCompany>('신한');
  const [newAmount, setNewAmount] = useState('');
  const [newCarModel, setNewCarModel] = useState('');
  const [newInstallment, setNewInstallment] = useState('일시불');
  const [newInstallmentAmount, setNewInstallmentAmount] = useState('');
  const [newLumpSumAmount, setNewLumpSumAmount] = useState('');
  const [newInterestRate, setNewInterestRate] = useState('');
  const [newInstallmentRate, setNewInstallmentRate] = useState('0.3');
  const [newLumpSumRate, setNewLumpSumRate] = useState('0.4');
  const [newCommissionRate, setNewCommissionRate] = useState('0.4');
  const [newStatus, setNewStatus] = useState('할부완료');

  // 5. 필터링된 고객 목록
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // 5-1. 검색어 필터
      if (searchTerm.trim()) {
        const term = searchTerm.trim().toLowerCase();
        const termNumOnly = term.replace(/[^0-9]/g, '');
        const matchesTerm =
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
          c.customCardNumber?.includes(term) ||
          c.memo?.toLowerCase().includes(term);
        if (!matchesTerm) return false;
      }

      // 5-2. 카드사 필터
      if (selectedCard !== '전체' && c.cardCompany !== selectedCard) {
        return false;
      }

      // 5-3. 진행상태 필터
      if (selectedStatus !== '전체') {
        const curStatus = c.status || '할부완료';
        if (curStatus !== selectedStatus && !curStatus.includes(selectedStatus)) {
          return false;
        }
      }

      // 5-4. 결제유형 필터
      const isLump =
        !c.installmentMonths ||
        c.installmentMonths === '일시불' ||
        c.installmentMonths === '0' ||
        c.installmentMonths === '1' ||
        c.installmentMonths === '-';
      const isHybrid = Boolean(
        c.isHybridPayment ||
        (c.installmentAmount && c.lumpSumAmount && c.installmentAmount > 0 && c.lumpSumAmount > 0)
      );

      if (paymentType === 'lumpSum' && (!isLump || isHybrid)) return false;
      if (paymentType === 'installment' && (isLump || isHybrid)) return false;
      if (paymentType === 'hybrid' && !isHybrid) return false;

      return true;
    });
  }, [customers, searchTerm, selectedCard, selectedStatus, paymentType]);

  // 전체 선택 체크박스 상태 동기화
  const isAllFilteredSelected = useMemo(() => {
    if (filteredCustomers.length === 0) return false;
    return filteredCustomers.every((c) => selectedRowIds.has(c.id));
  }, [filteredCustomers, selectedRowIds]);

  const isSomeFilteredSelected = useMemo(() => {
    if (filteredCustomers.length === 0) return false;
    return filteredCustomers.some((c) => selectedRowIds.has(c.id)) && !isAllFilteredSelected;
  }, [filteredCustomers, selectedRowIds, isAllFilteredSelected]);

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isSomeFilteredSelected;
    }
  }, [isSomeFilteredSelected]);

  // 전체 선택 토글
  const handleToggleSelectAll = () => {
    if (isAllFilteredSelected) {
      // 현재 필터된 항목들만 선택 해제
      const next = new Set(selectedRowIds);
      filteredCustomers.forEach((c) => next.delete(c.id));
      setSelectedRowIds(next);
    } else {
      // 현재 필터된 모든 항목 선택
      const next = new Set(selectedRowIds);
      filteredCustomers.forEach((c) => next.add(c.id));
      setSelectedRowIds(next);
    }
  };

  // 단일 행 선택 토글
  const handleToggleSelectRow = (id: string) => {
    const next = new Set(selectedRowIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedRowIds(next);
  };

  // 6. 통계 계산
  const stats = useMemo(() => {
    const totalCount = filteredCustomers.length;
    const totalAmount = filteredCustomers.reduce((acc, c) => acc + (c.paymentAmount || 0), 0);
    const totalCommission = filteredCustomers.reduce((acc, c) => acc + (c.commissionAmount || 0), 0);

    const totalInstallmentFee = filteredCustomers.reduce((acc, c) => {
      const isLump = !c.installmentMonths || c.installmentMonths === '일시불' || c.installmentMonths === '0' || c.installmentMonths === '1' || c.installmentMonths === '-';
      const isHybrid = Boolean(c.isHybridPayment || (c.installmentAmount && c.lumpSumAmount && c.installmentAmount > 0 && c.lumpSumAmount > 0));
      if (isHybrid) {
        const instAmt = c.installmentAmount || 0;
        const instRate = c.installmentCommissionRate ?? 0.3;
        return acc + Math.round((instAmt * instRate) / 100);
      } else if (!isLump) {
        const instRate = c.installmentCommissionRate ?? (c.commissionRate || 0.3);
        return acc + Math.round((c.paymentAmount * instRate) / 100);
      }
      return acc;
    }, 0);

    const totalLumpSumFee = filteredCustomers.reduce((acc, c) => {
      const isLump = !c.installmentMonths || c.installmentMonths === '일시불' || c.installmentMonths === '0' || c.installmentMonths === '1' || c.installmentMonths === '-';
      const isHybrid = Boolean(c.isHybridPayment || (c.installmentAmount && c.lumpSumAmount && c.installmentAmount > 0 && c.lumpSumAmount > 0));
      if (isHybrid) {
        const lumpAmt = c.lumpSumAmount || 0;
        const lumpRate = c.lumpSumCommissionRate ?? 0.3;
        return acc + Math.round((lumpAmt * lumpRate) / 100);
      } else if (isLump) {
        const lumpRate = c.lumpSumCommissionRate ?? (c.commissionRate || 0.4);
        return acc + Math.round((c.paymentAmount * lumpRate) / 100);
      }
      return acc;
    }, 0);

    return { totalCount, totalAmount, totalCommission, totalInstallmentFee, totalLumpSumFee };
  }, [filteredCustomers]);

  // 7. 인라인 필드 수정 헬퍼
  const updateField = (cust: CustomerPaymentData, updates: Partial<CustomerPaymentData>) => {
    const updated = { ...cust, ...updates };
    onUpdateCustomer(updated);
  };

  const handleAmountChange = (cust: CustomerPaymentData, rawVal: string) => {
    const amount = parseNumber(rawVal);
    const isLump =
      !cust.installmentMonths ||
      cust.installmentMonths === '일시불' ||
      cust.installmentMonths === '0' ||
      cust.installmentMonths === '1' ||
      cust.installmentMonths === '-';
    const isHybrid = Boolean(
      cust.isHybridPayment ||
      (cust.installmentAmount && cust.lumpSumAmount && cust.installmentAmount > 0 && cust.lumpSumAmount > 0)
    );

    if (isHybrid) {
      const instAmt = cust.installmentAmount || 0;
      const lumpAmt = cust.lumpSumAmount || 0;
      const instRate = cust.installmentCommissionRate ?? 0.3;
      const lumpRate = cust.lumpSumCommissionRate ?? 0.3;
      const gross = Math.round((instAmt * instRate) / 100) + Math.round((lumpAmt * lumpRate) / 100);
      const tax = (cust.applyTaxWithholding ?? true) ? Math.round(gross * 0.033) : 0;
      updateField(cust, {
        paymentAmount: amount,
        commissionAmount: gross - tax,
      });
    } else {
      const rate = isLump
        ? (cust.lumpSumCommissionRate ?? cust.commissionRate ?? 0.4)
        : (cust.installmentCommissionRate ?? cust.commissionRate ?? 0.3);
      const calculated = calculateCommission(amount, rate, cust.applyTaxWithholding ?? true);
      updateField(cust, {
        paymentAmount: amount,
        commissionAmount: calculated.netPayout,
      });
    }
  };

  const handleInstallmentRateCommit = (cust: CustomerPaymentData, rate: number | undefined) => {
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
      updateField(cust, {
        installmentCommissionRate: instRate,
        commissionAmount: net,
      });
    } else {
      const calculated = calculateCommission(cust.paymentAmount, instRate, cust.applyTaxWithholding ?? true);
      updateField(cust, {
        installmentCommissionRate: instRate,
        commissionRate: instRate,
        commissionAmount: calculated.netPayout,
      });
    }
  };

  const handleLumpSumRateCommit = (cust: CustomerPaymentData, rate: number | undefined) => {
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
      updateField(cust, {
        lumpSumCommissionRate: lumpRate,
        commissionAmount: net,
      });
    } else {
      const calculated = calculateCommission(cust.paymentAmount, lumpRate, cust.applyTaxWithholding ?? true);
      updateField(cust, {
        lumpSumCommissionRate: lumpRate,
        commissionRate: lumpRate,
        commissionAmount: calculated.netPayout,
      });
    }
  };

  const handleCommissionRateCommit = (cust: CustomerPaymentData, rate: number | undefined) => {
    const commRate = rate ?? 0.4;
    const calculated = calculateCommission(cust.paymentAmount, commRate, cust.applyTaxWithholding ?? true);

    updateField(cust, {
      commissionRate: commRate,
      commissionAmount: calculated.netPayout,
      cardCompanyDirectRate: cust.cardCompanyDirectRate ?? commRate,
    });
  };

  // 8. CSV 내보내기 핸들러
  const handleExportCSV = () => {
    if (filteredCustomers.length === 0) {
      return;
    }

    const headers = [
      '일자',
      '고객명',
      '딜러/영업사원',
      '카드사',
      '차종',
      '결제금액',
      '구분',
      '할부수수료율(%)',
      '할부수수료(원)',
      '일시불수수료율(%)',
      '일시불수수료(원)',
      '전체수수료율(%)',
      '수수료실지급액(원)',
      '카드사직지급',
      '진행상태',
      '연락처',
      '비고',
    ];

    const rows = filteredCustomers.map((c) => {
      const dateStr = c.createdAt
        ? new Date(c.createdAt).toLocaleDateString('ko-KR')
        : c.date || '';
      const isLump =
        !c.installmentMonths ||
        c.installmentMonths === '일시불' ||
        c.installmentMonths === '0' ||
        c.installmentMonths === '1' ||
        c.installmentMonths === '-';
      const isHybrid = Boolean(
        c.isHybridPayment ||
        (c.installmentAmount && c.lumpSumAmount && c.installmentAmount > 0 && c.lumpSumAmount > 0)
      );
      const typeStr = isHybrid
        ? `복합(할부 ${c.installmentMonths || '36'}개월 + 일시불)`
        : isLump
        ? '일시불'
        : `할부 ${c.installmentMonths}개월`;

      const instAmt = isHybrid ? (c.installmentAmount || 0) : (!isLump ? c.paymentAmount : 0);
      const lumpAmt = isHybrid ? (c.lumpSumAmount || 0) : (isLump ? c.paymentAmount : 0);
      const instRate = c.installmentCommissionRate ?? (isHybrid ? 0.3 : (c.commissionRate || 0.3));
      const lumpRate = c.lumpSumCommissionRate ?? (isHybrid ? 0.3 : (c.commissionRate || 0.4));
      const instFee = instAmt > 0 ? Math.round((instAmt * instRate) / 100) : 0;
      const lumpFee = lumpAmt > 0 ? Math.round((lumpAmt * lumpRate) / 100) : 0;

      return [
        `"${dateStr}"`,
        `"${c.customerName || ''}"`,
        `"${c.dealerInfo || ''}"`,
        `"${c.cardCompany || ''}"`,
        `"${c.carModel || ''}"`,
        c.paymentAmount,
        `"${typeStr}"`,
        !isLump || isHybrid ? instRate : '',
        !isLump || isHybrid ? instFee : '',
        isLump || isHybrid ? lumpRate : '',
        isLump || isHybrid ? lumpFee : '',
        c.commissionRate || '',
        c.commissionAmount || '',
        c.cardCompanyDirectPayout ? '포함' : '미포함',
        `"${c.status || ''}"`,
        `"${c.phoneNumber || ''}"`,
        `"${c.memo || ''}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `오토캐시백_고객데이터목록_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 9. 신규 고객 등록 완료
  const handleAddNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      return;
    }

    const isHybrid = newInstallment === '복합';
    let rawNum = parseNumber(newAmount);
    let instAmt = parseNumber(newInstallmentAmount);
    let lumpAmt = parseNumber(newLumpSumAmount);

    if (isHybrid) {
      if (instAmt > 0 && lumpAmt > 0 && (!rawNum || rawNum === 0)) {
        rawNum = instAmt + lumpAmt;
      }
    }

    const isLump = newInstallment === '일시불' || newInstallment === '0';
    const instRateNum = parseFloat(newInstallmentRate) || 0.3;
    const lumpRateNum = parseFloat(newLumpSumRate) || 0.4;
    const commRateNum = parseFloat(newCommissionRate) || (isLump ? lumpRateNum : instRateNum);

    let calculatedNet = 0;
    if (isHybrid) {
      const gross = Math.round((instAmt * instRateNum) / 100) + Math.round((lumpAmt * lumpRateNum) / 100);
      calculatedNet = gross - Math.round(gross * 0.033);
    } else {
      const calc = calculateCommission(rawNum, isLump ? lumpRateNum : instRateNum, true);
      calculatedNet = calc.netPayout;
    }

    const newCust: CustomerPaymentData = {
      id: `cust-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      customerName: newName.trim(),
      dealerInfo: newDealer.trim() || undefined,
      cardCompany: newCard,
      paymentAmount: rawNum,
      commissionRate: commRateNum,
      commissionAmount: calculatedNet,
      applyTaxWithholding: true,
      installmentMonths: isHybrid ? '36' : isLump ? '일시불' : newInstallment,
      interestRate: !isLump && newInterestRate ? newInterestRate : undefined,
      carModel: newCarModel.trim() || '차량',
      status: newStatus,
      paymentMethodNote: '일시불로 결제 부탁드립니다~',
      cardNumberOption: '직접전달',
      cardCompanyDirectPayout: ['하나', '우리', '국민'].includes(newCard),
      cardCompanyDirectRate: commRateNum,
      createdAt: Date.now(),
      isHybridPayment: isHybrid,
      installmentAmount: isHybrid ? instAmt : undefined,
      installmentCommissionRate: isHybrid || !isLump ? instRateNum : undefined,
      lumpSumAmount: isHybrid ? lumpAmt : undefined,
      lumpSumCommissionRate: isHybrid || isLump ? lumpRateNum : undefined,
    };

    onAddCustomer(newCust);
    setIsAddModalOpen(false);
    setNewName('');
    setNewDealer('');
    setNewAmount('');
    setNewInstallmentAmount('');
    setNewLumpSumAmount('');
    setNewCarModel('');
  };

  // 10. 삭제 실행 처리 (인앱 모달 확인 후 안전하게 실행)
  const handleConfirmDelete = () => {
    if (deleteModalState.type === 'single' && deleteModalState.targetCustomer) {
      const id = deleteModalState.targetCustomer.id;
      onDeleteCustomer(id);
      setSelectedRowIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else if (deleteModalState.type === 'batch' && deleteModalState.targetIds) {
      const ids = deleteModalState.targetIds;
      if (onDeleteCustomers) {
        onDeleteCustomers(ids);
      } else {
        ids.forEach((id) => onDeleteCustomer(id));
      }
      setSelectedRowIds(new Set());
    } else if (deleteModalState.type === 'all') {
      if (onResetAll) {
        onResetAll();
      } else {
        customers.forEach((c) => onDeleteCustomer(c.id));
      }
      setSelectedRowIds(new Set());
    }
    setDeleteModalState({ isOpen: false, type: 'single' });
  };

  // 선택된 항목들의 문구 일괄 복사
  const handleCopySelectedCustomers = () => {
    const selectedList = customers.filter((c) => selectedRowIds.has(c.id));
    if (selectedList.length === 0) return;
    // 첫 번째 항목 선택 후 전체 복사 호출
    onBatchCopyAll('all');
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto p-2.5 sm:p-4 flex flex-col gap-2.5">
      {/* 1. Slim Compact Header Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs px-3.5 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-600"></span>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            고객 데이터 목록
          </h1>
          <span className="px-2 py-0.2 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            총 {customers.length}건
          </span>
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            id="btn-add-customer-full"
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 active:scale-95 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 고객 직접 등록</span>
          </button>

          <button
            id="btn-export-csv"
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
            title="엑셀(CSV) 파일로 다운로드"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>엑셀 다운로드</span>
          </button>

          {customers.length > 0 && (
            <button
              id="btn-reset-all-full"
              type="button"
              onClick={() => setDeleteModalState({ isOpen: true, type: 'all' })}
              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 active:scale-95 border border-rose-200/80 text-xs font-semibold transition-all cursor-pointer"
              title="등록된 전체 데이터 삭제"
            >
              <Trash2 className="w-3 h-3" />
              <span>전체 비우기</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Compact Filter & Search Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Name / Keyword Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="고객명, 딜러명, 차종, 연락처, 카드사 검색..."
            className="w-full text-xs pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-teal-500 rounded-lg focus:outline-hidden font-medium text-slate-900 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              title="검색어 지우기"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Filters (Card, Payment Type, Status) */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          {/* Card Filter */}
          <div className="flex items-center gap-0.5 bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500 px-1">카드사</span>
            {['전체', ...CARD_COMPANIES].map((card) => (
              <button
                key={card}
                type="button"
                onClick={() => setSelectedCard(card)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCard === card
                    ? 'bg-white text-teal-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {card}
              </button>
            ))}
          </div>

          {/* Payment Type Filter */}
          <div className="flex items-center gap-0.5 bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500 px-1">결제구분</span>
            {[
              { key: 'all', label: '전체' },
              { key: 'lumpSum', label: '일시불' },
              { key: 'installment', label: '할부' },
              { key: 'hybrid', label: '복합' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setPaymentType(item.key as PaymentTypeFilter)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  paymentType === item.key
                    ? 'bg-white text-teal-800 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Status Filter (7가지 표준 진행상태) */}
          <div className="flex items-center gap-0.5 bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500 px-1">진행상태</span>
            {['전체', '결제준비', '할부완료', '증액완료', '증액대기', '발급완료', '접수완료', '조회중'].map((st) => {
              let dotColor = 'bg-slate-400';
              if (st === '결제준비') dotColor = 'bg-orange-500';
              if (st === '할부완료') dotColor = 'bg-emerald-500';
              if (st === '증액완료') dotColor = 'bg-teal-500';
              if (st === '증액대기') dotColor = 'bg-amber-500';
              if (st === '발급완료') dotColor = 'bg-emerald-600';
              if (st === '접수완료') dotColor = 'bg-purple-500';
              if (st === '조회중') dotColor = 'bg-indigo-500';

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedStatus === st
                      ? 'bg-white text-teal-800 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st !== '전체' && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
                  <span>{st}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Multi-Selection Action Floating Bar */}
      {selectedRowIds.size > 0 && (
        <div className="bg-slate-900 text-white rounded-xl p-3.5 px-5 shadow-lg flex items-center justify-between flex-wrap gap-3 animate-slide-up border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-teal-500/30 text-teal-400 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-bold">
              선택된 고객: <strong className="text-emerald-400 font-mono text-base">{selectedRowIds.size}</strong>명
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySelectedCustomers}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-400" />
              <span>선택 항목 문구 복사</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setDeleteModalState({
                  isOpen: true,
                  type: 'batch',
                  targetIds: Array.from(selectedRowIds),
                })
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>선택 삭제 ({selectedRowIds.size}건)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRowIds(new Set())}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            >
              선택 해제
            </button>
          </div>
        </div>
      )}

      {/* 4. Full-Width Data Table with Direct Inline Editing */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
                {/* Select All Checkbox */}
                <th className="py-3.5 px-3 w-[45px] text-center">
                  <input
                    ref={headerCheckboxRef}
                    type="checkbox"
                    checked={isAllFilteredSelected}
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
                    title="전체 선택 / 해제"
                  />
                </th>
                <th className="py-3.5 px-2 w-[40px] text-center text-slate-400">No</th>
                <th className="py-3.5 px-3.5 min-w-[130px]">고객명 *</th>
                <th className="py-3.5 px-3 min-w-[110px]">딜러 / 영업사원</th>
                <th className="py-3.5 px-3 min-w-[85px] text-center">카드사</th>
                <th className="py-3.5 px-3 min-w-[95px]">차종</th>
                <th className="py-3.5 px-3 min-w-[130px]">결제구분</th>
                <th className="py-3.5 px-3 text-right min-w-[160px]">결제금액 (총액 / 할부+일시불)</th>
                <th className="py-3.5 px-3 text-right min-w-[115px] bg-purple-50/60 text-purple-950 font-bold">할부 수수료</th>
                <th className="py-3.5 px-3 text-right min-w-[115px] bg-sky-50/60 text-sky-950 font-bold">일시불 수수료</th>
                <th className="py-3.5 px-3 text-right min-w-[130px] bg-emerald-50/60 text-emerald-950 font-bold">전체 수수료(실지급)</th>
                <th className="py-3.5 px-3 text-center min-w-[85px]">카드사직지급</th>
                <th className="py-3.5 px-3 text-center min-w-[110px]">진행상태</th>
                <th className="py-3.5 px-3.5 text-center min-w-[155px]">관리 / 작업</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2.5">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-slate-700 text-sm">
                        {searchTerm || selectedCard !== '전체' || selectedStatus !== '전체'
                          ? '검색 또는 필터 조건에 부합하는 고객 데이터가 없습니다.'
                          : '등록된 고객 데이터가 없습니다.'}
                      </p>
                      {(searchTerm || selectedCard !== '전체' || selectedStatus !== '전체' || paymentType !== 'all') && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedCard('전체');
                            setSelectedStatus('전체');
                            setPaymentType('all');
                          }}
                          className="text-xs text-teal-700 font-bold hover:underline cursor-pointer mt-1"
                        >
                          모든 검색 및 필터 조건 초기화
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust, idx) => {
                  const isSelected = cust.id === selectedCustomerId;
                  const isRowChecked = selectedRowIds.has(cust.id);
                  const isLump =
                    !cust.installmentMonths ||
                    cust.installmentMonths === '일시불' ||
                    cust.installmentMonths === '0' ||
                    cust.installmentMonths === '1' ||
                    cust.installmentMonths === '-';
                  const isHybrid = Boolean(
                    cust.isHybridPayment ||
                    (cust.installmentAmount && cust.lumpSumAmount && cust.installmentAmount > 0 && cust.lumpSumAmount > 0)
                  );
                  const isCopied = copiedId === cust.id;

                  const hasInstallment = isHybrid || !isLump;
                  const hasLump = isHybrid || isLump;

                  const instAmt = isHybrid ? (cust.installmentAmount || 0) : (hasInstallment ? cust.paymentAmount : 0);
                  const lumpAmt = isHybrid ? (cust.lumpSumAmount || 0) : (hasLump ? cust.paymentAmount : 0);

                  const instRate = cust.installmentCommissionRate ?? (isHybrid ? 0.3 : (cust.commissionRate || 0.3));
                  const lumpRate = cust.lumpSumCommissionRate ?? (isHybrid ? 0.3 : (cust.commissionRate || 0.4));

                  const instFee = instAmt > 0 ? Math.round((instAmt * instRate) / 100) : 0;
                  const lumpFee = lumpAmt > 0 ? Math.round((lumpAmt * lumpRate) / 100) : 0;

                  return (
                    <tr
                      key={cust.id}
                      className={`transition-colors group ${
                        isRowChecked
                          ? 'bg-teal-50/70 hover:bg-teal-50'
                          : isSelected
                          ? 'bg-slate-50/90 hover:bg-slate-100/70'
                          : 'hover:bg-slate-50/60'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isRowChecked}
                          onChange={() => handleToggleSelectRow(cust.id)}
                          className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
                        />
                      </td>

                      {/* No */}
                      <td className="py-3 px-2 text-center text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>

                      {/* 고객명 (인라인 수정) */}
                      <td className="py-3 px-3.5">
                        <div className="flex flex-col">
                          <input
                            type="text"
                            value={cust.customerName}
                            onChange={(e) => updateField(cust, { customerName: e.target.value })}
                            className="w-full text-xs font-bold text-slate-900 bg-transparent hover:bg-white focus:bg-white px-2 py-1 rounded-lg border border-transparent hover:border-slate-300 focus:border-teal-500 focus:outline-hidden transition-all"
                            title="고객명 직접 수정"
                          />
                          {cust.phoneNumber && (
                            <span className="text-[10px] text-slate-400 font-mono px-2 -mt-0.5">
                              {cust.phoneNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 딜러 / 영업사원 (인라인 수정) */}
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={cust.dealerInfo || ''}
                          onChange={(e) => updateField(cust, { dealerInfo: e.target.value })}
                          placeholder="딜러/영업사원"
                          className="w-full text-[11px] font-semibold text-slate-700 bg-transparent hover:bg-white focus:bg-white px-2 py-1 rounded-lg border border-transparent hover:border-slate-300 focus:border-teal-500 focus:outline-hidden transition-all"
                        />
                      </td>

                      {/* 카드사 (셀렉트 드롭다운) */}
                      <td className="py-3 px-3 text-center">
                        <select
                          value={cust.cardCompany}
                          onChange={(e) => {
                            const newCard = e.target.value as CardCompany;
                            const isDirectCard = ['하나', '우리', '국민'].includes(newCard);
                            updateField(cust, {
                              cardCompany: newCard,
                              status: '결제준비',
                              cardCompanyDirectPayout: cust.cardCompanyDirectPayout !== undefined ? cust.cardCompanyDirectPayout : isDirectCard,
                            });
                          }}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border appearance-none text-center cursor-pointer shadow-2xs ${getCardBadgeStyle(
                            cust.cardCompany
                          )}`}
                        >
                          {CARD_COMPANIES.map((card) => (
                            <option key={card} value={card}>
                              {card}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* 차종 (인라인 수정) */}
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={cust.carModel || ''}
                          onChange={(e) => updateField(cust, { carModel: e.target.value })}
                          placeholder="차종 입력"
                          className="w-full text-xs text-slate-700 bg-transparent hover:bg-white focus:bg-white px-2 py-1 rounded-lg border border-transparent hover:border-slate-300 focus:border-teal-500 focus:outline-hidden font-medium transition-all"
                        />
                      </td>

                      {/* 구분 / 할부개월 */}
                      <td className="py-3 px-3">
                        {isHybrid ? (
                          <div className="flex flex-col gap-1 min-w-[130px]">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300 whitespace-nowrap">
                                복합
                              </span>
                              <select
                                value={cust.installmentMonths || '36'}
                                onChange={(e) =>
                                  updateField(cust, {
                                    installmentMonths: e.target.value,
                                  })
                                }
                                className="text-xs font-bold text-purple-950 bg-purple-50 hover:bg-white border border-purple-200 rounded-lg px-2 py-0.5 focus:border-purple-500 focus:outline-hidden cursor-pointer"
                                title="할부 개월수 변경"
                              >
                                <option value="12">할부 12개월</option>
                                <option value="24">할부 24개월</option>
                                <option value="36">할부 36개월</option>
                                <option value="48">할부 48개월</option>
                                <option value="60">할부 60개월</option>
                              </select>
                            </div>
                            <div className="flex flex-col text-[10px] font-semibold leading-tight text-slate-600">
                              <span className="text-purple-700 font-mono">
                                1. 할부 {cust.installmentMonths || '36'}개월
                              </span>
                              <span className="text-teal-700 font-mono">
                                2. 일시불
                              </span>
                            </div>
                          </div>
                        ) : (
                          <select
                            value={isLump ? '일시불' : cust.installmentMonths}
                            onChange={(e) =>
                              updateField(cust, {
                                installmentMonths: e.target.value,
                                paymentMethodNote: '일시불로 결제 부탁드립니다~',
                              })
                            }
                            className="text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-white border border-slate-200 rounded-lg px-2.5 py-1 focus:border-teal-500 focus:outline-hidden cursor-pointer shadow-2xs"
                          >
                            <option value="일시불">일시불</option>
                            <option value="12">할부 12개월</option>
                            <option value="24">할부 24개월</option>
                            <option value="36">할부 36개월</option>
                            <option value="48">할부 48개월</option>
                            <option value="60">할부 60개월</option>
                          </select>
                        )}
                      </td>

                      {/* 총 결제금액 (인라인 수정) */}
                      <td className="py-3 px-3 text-right">
                        {isHybrid ? (
                          <div className="flex flex-col items-end gap-1 min-w-[165px]">
                            {/* 총 결제금액 (합계) */}
                            <div className="flex items-center justify-end w-full">
                              <span className="text-[10px] text-purple-700 font-bold mr-1 whitespace-nowrap">총액:</span>
                              <input
                                type="text"
                                value={cust.paymentAmount ? formatCurrency(cust.paymentAmount) : ''}
                                onChange={(e) => handleAmountChange(cust, e.target.value)}
                                placeholder="0"
                                className="w-28 text-xs font-mono font-black text-purple-950 text-right bg-purple-50/60 hover:bg-white focus:bg-white px-2 py-0.5 rounded-lg border border-purple-200 focus:border-purple-500 focus:outline-hidden"
                                title="총 결제금액(합계) 직접 수정"
                              />
                              <span className="text-xs font-bold text-purple-900 ml-0.5">원</span>
                            </div>
                            {/* 할부 & 일시불 분할금액 박스 */}
                            <div className="w-full bg-slate-50 border border-purple-100 rounded-lg p-1.5 text-[10px] font-mono flex flex-col gap-1 text-right">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-purple-700 font-bold whitespace-nowrap">1.할부:</span>
                                <div className="flex items-center">
                                  <input
                                    type="text"
                                    value={formatCurrency(cust.installmentAmount || 0)}
                                    onChange={(e) => {
                                      const instVal = parseNumber(e.target.value);
                                      const lumpVal = cust.lumpSumAmount || 0;
                                      const total = instVal + lumpVal;
                                      const instRate = cust.installmentCommissionRate ?? 0.3;
                                      const lumpRate = cust.lumpSumCommissionRate ?? 0.3;
                                      const gross = Math.round((instVal * instRate) / 100) + Math.round((lumpVal * lumpRate) / 100);
                                      const tax = (cust.applyTaxWithholding ?? true) ? Math.round(gross * 0.033) : 0;
                                      updateField(cust, {
                                        installmentAmount: instVal,
                                        paymentAmount: total > 0 ? total : cust.paymentAmount,
                                        commissionAmount: gross - tax,
                                      });
                                    }}
                                    className="w-20 text-[10px] font-mono font-bold text-purple-900 text-right bg-white px-1.5 py-0.5 rounded border border-purple-200 focus:outline-hidden"
                                    title="할부 결제금액 수정"
                                  />
                                  <span className="text-slate-400 ml-0.5">원</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-teal-700 font-bold whitespace-nowrap">2.일시불:</span>
                                <div className="flex items-center">
                                  <input
                                    type="text"
                                    value={formatCurrency(cust.lumpSumAmount || 0)}
                                    onChange={(e) => {
                                      const lumpVal = parseNumber(e.target.value);
                                      const instVal = cust.installmentAmount || 0;
                                      const total = instVal + lumpVal;
                                      const instRate = cust.installmentCommissionRate ?? 0.3;
                                      const lumpRate = cust.lumpSumCommissionRate ?? 0.3;
                                      const gross = Math.round((instVal * instRate) / 100) + Math.round((lumpVal * lumpRate) / 100);
                                      const tax = (cust.applyTaxWithholding ?? true) ? Math.round(gross * 0.033) : 0;
                                      updateField(cust, {
                                        lumpSumAmount: lumpVal,
                                        paymentAmount: total > 0 ? total : cust.paymentAmount,
                                        commissionAmount: gross - tax,
                                      });
                                    }}
                                    className="w-20 text-[10px] font-mono font-bold text-teal-900 text-right bg-white px-1.5 py-0.5 rounded border border-teal-200 focus:outline-hidden"
                                    title="일시불 결제금액 수정"
                                  />
                                  <span className="text-slate-400 ml-0.5">원</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end">
                            <input
                              type="text"
                              value={cust.paymentAmount ? formatCurrency(cust.paymentAmount) : ''}
                              onChange={(e) => handleAmountChange(cust, e.target.value)}
                              placeholder="0"
                              className="w-full text-xs font-mono font-black text-slate-900 text-right bg-transparent hover:bg-white focus:bg-white px-2 py-1 rounded-lg border border-transparent hover:border-slate-300 focus:border-teal-500 focus:outline-hidden transition-all"
                            />
                            <span className="text-xs text-slate-400 ml-0.5">원</span>
                          </div>
                        )}
                      </td>

                      {/* 1. 할부 수수료 */}
                      <td className="py-3 px-3 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        {hasInstallment ? (
                          <div className="flex flex-col items-end">
                            <div className="flex items-center justify-end gap-0.5">
                              <InlineRateInput
                                initialValue={instRate}
                                onCommit={(newRate) => handleInstallmentRateCommit(cust, newRate)}
                                className="w-12 text-xs font-mono font-bold text-purple-700 text-right px-1.5 py-0.5 rounded border border-transparent hover:border-purple-200 focus:border-purple-500 focus:bg-white focus:outline-hidden transition-all"
                                placeholder="0.3"
                                title="할부 수수료율 (%) 직접 수정"
                              />
                              <span className="text-xs text-purple-700 font-bold">%</span>
                            </div>
                            <span className="font-mono text-[10px] text-purple-900 font-semibold pr-1">
                              {formatCurrency(instFee)}원
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300 font-mono pr-2">-</span>
                        )}
                      </td>

                      {/* 2. 일시불 수수료 */}
                      <td className="py-3 px-3 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        {hasLump ? (
                          <div className="flex flex-col items-end">
                            <div className="flex items-center justify-end gap-0.5">
                              <InlineRateInput
                                initialValue={lumpRate}
                                onCommit={(newRate) => handleLumpSumRateCommit(cust, newRate)}
                                className="w-12 text-xs font-mono font-bold text-sky-700 text-right px-1.5 py-0.5 rounded border border-transparent hover:border-sky-200 focus:border-sky-500 focus:bg-white focus:outline-hidden transition-all"
                                placeholder="0.4"
                                title="일시불 수수료율 (%) 직접 수정"
                              />
                              <span className="text-xs text-sky-700 font-bold">%</span>
                            </div>
                            <span className="font-mono text-[10px] text-sky-900 font-semibold pr-1">
                              {formatCurrency(lumpFee)}원
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300 font-mono pr-2">-</span>
                        )}
                      </td>

                      {/* 3. 전체 수수료 (실지급액) */}
                      <td className="py-3 px-3 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center justify-end gap-0.5">
                            {cust.isHybridPayment && (
                              <span className="text-[10px] text-purple-700 font-bold mr-0.5">합계</span>
                            )}
                            <InlineRateInput
                              initialValue={cust.commissionRate}
                              onCommit={(newRate) => handleCommissionRateCommit(cust, newRate)}
                              className="w-12 text-xs font-mono font-bold text-emerald-700 text-right px-1.5 py-0.5 rounded border border-transparent hover:border-emerald-200 focus:border-emerald-500 focus:bg-white focus:outline-hidden transition-all"
                              placeholder="0.4"
                              title="전체 수수료율 (%) 직접 수정"
                            />
                            <span className="text-xs text-emerald-700 font-bold">%</span>
                          </div>
                          <span className="font-mono font-black text-[11px] text-emerald-700 pr-1">
                            {formatCurrency(cust.commissionAmount)}원
                          </span>
                        </div>
                      </td>

                      {/* 카드사 직지급 토글 */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            updateField(cust, {
                              cardCompanyDirectPayout: !cust.cardCompanyDirectPayout,
                              cardCompanyDirectRate: cust.cardCompanyDirectRate ?? cust.commissionRate,
                            })
                          }
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                            cust.cardCompanyDirectPayout
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
                          }`}
                          title="클릭하여 직지급 문구 포함 여부 전환"
                        >
                          {cust.cardCompanyDirectPayout ? '포함' : '미포함'}
                        </button>
                      </td>

                      {/* 진행상태 (6가지 표준 상태 배지 드롭다운) */}
                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        {getStatusBadge(cust.status || '할부완료', (newStatus) => onUpdateStatus(cust.id, newStatus))}
                      </td>

                      {/* 관리 / 작업 */}
                      <td className="py-3 px-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 작업대에서 문구생성 버튼 */}
                          <button
                            type="button"
                            onClick={() => {
                              onSelectCustomer(cust.id);
                              onNavigateToWorkspace(cust.id);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                            title="이 고객을 선택하고 작업대로 이동하여 결제문구 확인 및 복사"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>문구생성</span>
                          </button>

                          {/* 빠른 복사 버튼 */}
                          <button
                            type="button"
                            onClick={() => onCopySingleText(cust, 'all')}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                              isCopied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                            }`}
                            title="전체 결제준비 문구 즉시 복사"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          {/* 삭제 버튼 (인앱 확인 모달 오픈) */}
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteModalState({
                                isOpen: true,
                                type: 'single',
                                targetCustomer: cust,
                              })
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer"
                            title="고객 데이터 삭제"
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
      </div>

      {/* 5. 안전한 인앱 삭제 확인 모달 (iframe confirm 차단 문제 해결) */}
      {deleteModalState.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                <Trash2 className="w-6 h-6" />
              </div>

              {deleteModalState.type === 'single' && deleteModalState.targetCustomer && (
                <>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">고객 데이터 삭제</h3>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    <strong className="text-slate-900 font-bold">
                      [{deleteModalState.targetCustomer.customerName}]
                    </strong> 고객 데이터를 삭제하시겠습니까?
                  </p>
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs mb-5 text-left space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">카드사 / 차종:</span>
                      <span className="font-bold text-slate-800">
                        {deleteModalState.targetCustomer.cardCompany}카드 / {deleteModalState.targetCustomer.carModel || '미지정'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">결제금액:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {formatCurrency(deleteModalState.targetCustomer.paymentAmount)}원
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">진행상태:</span>
                      <span className="font-bold text-teal-700">
                        {deleteModalState.targetCustomer.status || '할부완료'}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {deleteModalState.type === 'batch' && deleteModalState.targetIds && (
                <>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">선택 항목 일괄 삭제</h3>
                  <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                    선택하신 <strong className="text-rose-600 font-bold">{deleteModalState.targetIds.length}건</strong>의 고객 데이터를 모두 삭제하시겠습니까?<br />
                    삭제 후에는 데이터를 복구할 수 없습니다.
                  </p>
                </>
              )}

              {deleteModalState.type === 'all' && (
                <>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">데이터 전체 비우기</h3>
                  <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                    현재 등록된 <strong className="text-rose-600 font-bold">{customers.length}건</strong>의 모든 고객 데이터를 삭제하시겠습니까?<br />
                    삭제된 데이터는 복구할 수 없습니다.
                  </p>
                </>
              )}

              <div className="flex items-center gap-2.5 w-full">
                <button
                  type="button"
                  onClick={() => setDeleteModalState({ isOpen: false, type: 'single' })}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
                >
                  삭제 확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. 신규 고객 직접 등록 모달 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">새 업무 / 고객 등록</h3>
                  <p className="text-xs text-slate-500">필수 정보를 입력하여 목록에 추가합니다.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">고객명 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 홍길동"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:bg-white focus:border-teal-600 focus:outline-hidden font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">딜러 / 영업사원</label>
                  <input
                    type="text"
                    placeholder="예: 현대 김철수"
                    value={newDealer}
                    onChange={(e) => setNewDealer(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:bg-white focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">카드사</label>
                  <select
                    value={newCard}
                    onChange={(e) => {
                      const c = e.target.value as CardCompany;
                      setNewCard(c);
                      setNewStatus('결제준비');
                    }}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:bg-white focus:border-teal-600 focus:outline-hidden font-bold cursor-pointer"
                  >
                    {CARD_COMPANIES.map((card) => (
                      <option key={card} value={card}>
                        {card}카드
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">차종</label>
                  <input
                    type="text"
                    placeholder="예: 그랜저, 쏘나타"
                    value={newCarModel}
                    onChange={(e) => setNewCarModel(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:bg-white focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">구분(일시불/할부/복합)</label>
                  <select
                    value={newInstallment}
                    onChange={(e) => setNewInstallment(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:bg-white focus:border-teal-600 focus:outline-hidden font-bold cursor-pointer"
                  >
                    <option value="일시불">일시불</option>
                    <option value="12">할부 12개월</option>
                    <option value="24">할부 24개월</option>
                    <option value="36">할부 36개월</option>
                    <option value="48">할부 48개월</option>
                    <option value="60">할부 60개월</option>
                    <option value="복합">복합 (할부 + 일시불)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {newInstallment === '복합' ? '총 결제금액 (합계 자동계산)' : '결제금액 (원)'}
                  </label>
                  <input
                    type="text"
                    placeholder="예: 35,000,000"
                    value={newAmount}
                    onChange={(e) => {
                      const num = e.target.value.replace(/[^0-9]/g, '');
                      setNewAmount(num ? Number(num).toLocaleString() : '');
                    }}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:bg-white focus:border-teal-600 focus:outline-hidden font-mono font-bold text-right"
                  />
                </div>
              </div>

              {/* 복합 결제 선택 시 상세 금액 입력 필드 */}
              {newInstallment === '복합' && (
                <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3.5 space-y-3">
                  <div className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <span>✨ 할부 + 일시불 복합 결제 금액 상세 입력</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-purple-800 mb-1">① 할부 결제금액 (원)</label>
                      <input
                        type="text"
                        placeholder="예: 13,200,000"
                        value={newInstallmentAmount}
                        onChange={(e) => {
                          const num = e.target.value.replace(/[^0-9]/g, '');
                          const formatted = num ? Number(num).toLocaleString() : '';
                          setNewInstallmentAmount(formatted);
                          const inst = parseNumber(num);
                          const lump = parseNumber(newLumpSumAmount);
                          if (inst + lump > 0) {
                            setNewAmount((inst + lump).toLocaleString());
                          }
                        }}
                        className="w-full text-xs bg-white border border-purple-300 rounded-lg p-2 focus:border-purple-600 focus:outline-hidden font-mono font-bold text-right text-purple-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-teal-800 mb-1">② 일시불 결제금액 (원)</label>
                      <input
                        type="text"
                        placeholder="예: 19,939,000"
                        value={newLumpSumAmount}
                        onChange={(e) => {
                          const num = e.target.value.replace(/[^0-9]/g, '');
                          const formatted = num ? Number(num).toLocaleString() : '';
                          setNewLumpSumAmount(formatted);
                          const lump = parseNumber(num);
                          const inst = parseNumber(newInstallmentAmount);
                          if (inst + lump > 0) {
                            setNewAmount((inst + lump).toLocaleString());
                          }
                        }}
                        className="w-full text-xs bg-white border border-teal-300 rounded-lg p-2 focus:border-teal-600 focus:outline-hidden font-mono font-bold text-right text-teal-950"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 수수료율 설정 필드 (할부 / 일시불 / 전체 수수료율) */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-purple-800 mb-1">할부 요율(%)</label>
                  <input
                    type="text"
                    value={newInstallmentRate}
                    onChange={(e) => setNewInstallmentRate(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="0.3"
                    className="w-full text-xs bg-purple-50 border border-purple-300 rounded-xl p-2 focus:bg-white focus:border-purple-600 focus:outline-hidden font-mono font-bold text-center text-purple-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-sky-800 mb-1">일시불 요율(%)</label>
                  <input
                    type="text"
                    value={newLumpSumRate}
                    onChange={(e) => setNewLumpSumRate(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="0.4"
                    className="w-full text-xs bg-sky-50 border border-sky-300 rounded-xl p-2 focus:bg-white focus:border-sky-600 focus:outline-hidden font-mono font-bold text-center text-sky-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-800 mb-1">전체 요율(%)</label>
                  <input
                    type="text"
                    value={newCommissionRate}
                    onChange={(e) => setNewCommissionRate(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="0.4"
                    className="w-full text-xs bg-emerald-50 border border-emerald-300 rounded-xl p-2 focus:bg-white focus:border-emerald-600 focus:outline-hidden font-mono font-bold text-center text-emerald-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">진행상태</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:bg-white focus:border-teal-600 focus:outline-hidden font-bold cursor-pointer"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs cursor-pointer"
                >
                  등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
