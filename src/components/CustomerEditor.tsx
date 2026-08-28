import React, { useState, useEffect } from 'react';
import { CustomerPaymentData, CardCompany, ProcessStatus } from '../types';
import { formatCurrency, calculateCommission, parseNumber } from '../utils/parser';
import { 
  Edit3, 
  User, 
  Car, 
  DollarSign, 
  Percent, 
  Calendar, 
  Calculator, 
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Sparkles,
  Copy,
  Check,
  Trash2,
  ArrowRightLeft,
  Plus
} from 'lucide-react';

interface CustomerEditorProps {
  customer: CustomerPaymentData;
  onChange: (updated: CustomerPaymentData) => void;
}

// 사용자 요청 순서: 롯데, 하나, 농협, 우리, 국민, 신한, 삼성 (현대/기타 제외)
const CARD_COMPANIES: CardCompany[] = ['롯데', '하나', '농협', '우리', '국민', '신한', '삼성'];
const STATUSES: ProcessStatus[] = ['결제준비', '할부완료', '증액완료', '증액대기', '발급완료', '접수완료', '조회중'];

export const CustomerEditor: React.FC<CustomerEditorProps> = ({ customer, onChange }) => {
  const isLump =
    !customer.installmentMonths ||
    customer.installmentMonths === '일시불' ||
    customer.installmentMonths === '0' ||
    customer.installmentMonths === '1' ||
    customer.installmentMonths === '-';
  const isHybrid = Boolean(
    customer.isHybridPayment ||
    (customer.installmentAmount && customer.lumpSumAmount && customer.installmentAmount > 0 && customer.lumpSumAmount > 0)
  );
  const isInstallment = !isLump || isHybrid;

  // 소수점 타이핑 중 마침표가 지워지지 않도록 로컬 문자열 상태 관리
  const [commissionRateStr, setCommissionRateStr] = useState<string>(
    customer.commissionRate !== undefined && customer.commissionRate !== null
      ? String(customer.commissionRate)
      : '0.4'
  );
  const [installmentRateStr, setInstallmentRateStr] = useState<string>(
    customer.installmentCommissionRate !== undefined && customer.installmentCommissionRate !== null
      ? String(customer.installmentCommissionRate)
      : String(isInstallment ? customer.commissionRate || 0.4 : 0.3)
  );
  const [lumpSumRateStr, setLumpSumRateStr] = useState<string>(
    customer.lumpSumCommissionRate !== undefined && customer.lumpSumCommissionRate !== null
      ? String(customer.lumpSumCommissionRate)
      : String(isLump ? customer.commissionRate || 0.4 : 0.3)
  );
  const [directPayoutRateStr, setDirectPayoutRateStr] = useState<string>(
    customer.cardCompanyDirectRate !== undefined && customer.cardCompanyDirectRate !== null
      ? String(customer.cardCompanyDirectRate)
      : String(customer.commissionRate || 0.4)
  );

  const [copiedCustInfo, setCopiedCustInfo] = useState(false);
  const [copiedFieldKey, setCopiedFieldKey] = useState<string | null>(null);

  const handleCopyField = async (key: string, value: string | number | undefined, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const text = String(value ?? '').trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFieldKey(key);
      setTimeout(() => {
        setCopiedFieldKey((prev) => (prev === key ? null : prev));
      }, 1800);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // 고객 선택 변경 시에만 입력 문자열을 고객 데이터로 동기화
  const lastCustomerIdRef = React.useRef<string>(customer.id);
  useEffect(() => {
    if (lastCustomerIdRef.current !== customer.id) {
      lastCustomerIdRef.current = customer.id;
      setCommissionRateStr(
        customer.commissionRate !== undefined && customer.commissionRate !== null
          ? String(customer.commissionRate)
          : '0.4'
      );
      setInstallmentRateStr(
        customer.installmentCommissionRate !== undefined && customer.installmentCommissionRate !== null
          ? String(customer.installmentCommissionRate)
          : String(customer.commissionRate || 0.3)
      );
      setLumpSumRateStr(
        customer.lumpSumCommissionRate !== undefined && customer.lumpSumCommissionRate !== null
          ? String(customer.lumpSumCommissionRate)
          : String(customer.commissionRate || 0.3)
      );
      setDirectPayoutRateStr(
        customer.cardCompanyDirectRate !== undefined && customer.cardCompanyDirectRate !== null
          ? String(customer.cardCompanyDirectRate)
          : String(customer.commissionRate || 0.4)
      );
    }
  }, [customer.id]);

  // 외부(예: 프리셋 클릭 등)에서 고객 수수료율이 강제로 변경된 경우의 동기화 (단, 현재 타이핑 중인 유효값과 불일치할 때만)
  useEffect(() => {
    const currentNum = parseFloat(commissionRateStr);
    if (!isNaN(customer.commissionRate) && customer.commissionRate !== currentNum && !commissionRateStr.endsWith('.') && commissionRateStr !== '') {
      setCommissionRateStr(String(customer.commissionRate));
    }
  }, [customer.commissionRate]);

  useEffect(() => {
    const currentNum = parseFloat(installmentRateStr);
    const targetRate = customer.installmentCommissionRate ?? 0.3;
    if (!isNaN(targetRate) && targetRate !== currentNum && !installmentRateStr.endsWith('.') && installmentRateStr !== '') {
      setInstallmentRateStr(String(targetRate));
    }
  }, [customer.installmentCommissionRate]);

  useEffect(() => {
    const currentNum = parseFloat(lumpSumRateStr);
    const targetRate = customer.lumpSumCommissionRate ?? 0.3;
    if (!isNaN(targetRate) && targetRate !== currentNum && !lumpSumRateStr.endsWith('.') && lumpSumRateStr !== '') {
      setLumpSumRateStr(String(targetRate));
    }
  }, [customer.lumpSumCommissionRate]);

  useEffect(() => {
    const currentNum = parseFloat(directPayoutRateStr);
    const targetRate = customer.cardCompanyDirectRate ?? customer.commissionRate ?? 0.4;
    if (!isNaN(targetRate) && targetRate !== currentNum && !directPayoutRateStr.endsWith('.') && directPayoutRateStr !== '') {
      setDirectPayoutRateStr(String(targetRate));
    }
  }, [customer.cardCompanyDirectRate, customer.commissionRate]);

  const handleAmountChange = (valStr: string) => {
    const num = parseNumber(valStr);
    const calculated = calculateCommission(num, customer.commissionRate, customer.applyTaxWithholding);
    onChange({
      ...customer,
      paymentAmount: num,
      commissionAmount: calculated.netPayout,
    });
  };

  const handleCommissionRateChange = (rawVal: string) => {
    const sanitized = rawVal.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    const cleanVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitized;
    setCommissionRateStr(cleanVal);

    const num = parseFloat(cleanVal);
    const validRate = !isNaN(num) && num >= 0 ? num : 0;
    const calculated = calculateCommission(customer.paymentAmount, validRate, customer.applyTaxWithholding);

    onChange({
      ...customer,
      commissionRate: validRate,
      commissionAmount: calculated.netPayout,
      installmentCommissionRate: !isLump && !isHybrid ? validRate : customer.installmentCommissionRate,
      lumpSumCommissionRate: isLump && !isHybrid ? validRate : customer.lumpSumCommissionRate,
      cardCompanyDirectRate: customer.cardCompanyDirectRate ?? validRate,
    });
  };

  const handleInstallmentRateChange = (rawVal: string) => {
    const sanitized = rawVal.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    const cleanVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitized;
    setInstallmentRateStr(cleanVal);

    const num = parseFloat(cleanVal);
    const validRate = !isNaN(num) && num >= 0 ? num : 0;

    if (isHybrid) {
      const instAmt = customer.installmentAmount || 0;
      const lumpAmt = customer.lumpSumAmount || 0;
      const lumpRate = customer.lumpSumCommissionRate ?? 0.3;
      const totalGross = Math.round((instAmt * validRate) / 100) + Math.round((lumpAmt * lumpRate) / 100);
      const tax = customer.applyTaxWithholding ? Math.round(totalGross * 0.033) : 0;
      const net = totalGross - tax;
      onChange({
        ...customer,
        installmentCommissionRate: validRate,
        commissionAmount: net,
      });
    } else {
      const calculated = calculateCommission(customer.paymentAmount, validRate, customer.applyTaxWithholding);
      onChange({
        ...customer,
        installmentCommissionRate: validRate,
        commissionRate: validRate,
        commissionAmount: calculated.netPayout,
      });
    }
  };

  const handleLumpSumRateChange = (rawVal: string) => {
    const sanitized = rawVal.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    const cleanVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitized;
    setLumpSumRateStr(cleanVal);

    const num = parseFloat(cleanVal);
    const validRate = !isNaN(num) && num >= 0 ? num : 0;

    if (isHybrid) {
      const instAmt = customer.installmentAmount || 0;
      const lumpAmt = customer.lumpSumAmount || 0;
      const instRate = customer.installmentCommissionRate ?? 0.3;
      const totalGross = Math.round((instAmt * instRate) / 100) + Math.round((lumpAmt * validRate) / 100);
      const tax = customer.applyTaxWithholding ? Math.round(totalGross * 0.033) : 0;
      const net = totalGross - tax;
      onChange({
        ...customer,
        lumpSumCommissionRate: validRate,
        commissionAmount: net,
      });
    } else {
      const calculated = calculateCommission(customer.paymentAmount, validRate, customer.applyTaxWithholding);
      onChange({
        ...customer,
        lumpSumCommissionRate: validRate,
        commissionRate: validRate,
        commissionAmount: calculated.netPayout,
      });
    }
  };

  const handleDirectPayoutRateChange = (rawVal: string) => {
    const sanitized = rawVal.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    const cleanVal = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitized;
    setDirectPayoutRateStr(cleanVal);

    const num = parseFloat(cleanVal);
    const validRate = !isNaN(num) && num >= 0 ? num : 0;

    onChange({
      ...customer,
      cardCompanyDirectRate: validRate,
    });
  };

  const handleTaxToggle = (checked: boolean) => {
    const calculated = calculateCommission(customer.paymentAmount, customer.commissionRate, checked);
    onChange({
      ...customer,
      applyTaxWithholding: checked,
      commissionAmount: calculated.netPayout,
    });
  };

  const handleCardChange = (card: CardCompany) => {
    const isDirectCard = ['하나', '우리', '국민'].includes(card);
    onChange({
      ...customer,
      cardCompany: card,
      status: '결제준비',
      cardCompanyDirectPayout: customer.cardCompanyDirectPayout !== undefined ? customer.cardCompanyDirectPayout : isDirectCard,
    });
  };

  // 결제 방식 전환 핸들러 (일시불 <-> 할부 <-> 할부+일시불 복합결제 자유 전환)
  const handleSwitchPaymentMode = (mode: 'lumpSum' | 'installment' | 'hybrid') => {
    const currentTotal = customer.paymentAmount || 0;
    const instRate = customer.installmentCommissionRate ?? (customer.commissionRate || 0.3);
    const lumpRate = customer.lumpSumCommissionRate ?? (customer.commissionRate || 0.4);

    if (mode === 'hybrid') {
      // 복합 결제 (할부 + 일시불)로 전환 또는 추가
      const currentInstMonths = (!customer.installmentMonths || customer.installmentMonths === '일시불' || customer.installmentMonths === '0')
        ? '60'
        : customer.installmentMonths;

      let instAmt = customer.installmentAmount || 0;
      let lumpAmt = customer.lumpSumAmount || 0;

      if (instAmt <= 0 && lumpAmt <= 0) {
        if (isLump) {
          lumpAmt = currentTotal;
          instAmt = 0;
        } else {
          instAmt = currentTotal;
          lumpAmt = 0;
        }
      } else if (instAmt + lumpAmt !== currentTotal && currentTotal > 0) {
        if (instAmt === 0 && lumpAmt > 0) {
          instAmt = Math.max(0, currentTotal - lumpAmt);
        } else if (lumpAmt === 0 && instAmt > 0) {
          lumpAmt = Math.max(0, currentTotal - instAmt);
        }
      }

      const totalGross = Math.round((instAmt * instRate) / 100) + Math.round((lumpAmt * lumpRate) / 100);
      const tax = customer.applyTaxWithholding ? Math.round(totalGross * 0.033) : 0;
      const net = totalGross - tax;

      onChange({
        ...customer,
        isHybridPayment: true,
        installmentMonths: currentInstMonths,
        installmentAmount: instAmt,
        lumpSumAmount: lumpAmt,
        paymentAmount: instAmt + lumpAmt > 0 ? instAmt + lumpAmt : currentTotal,
        installmentCommissionRate: instRate,
        lumpSumCommissionRate: lumpRate,
        commissionAmount: net,
        paymentMethodNote: '일시불로 결제 부탁드립니다~',
      });
    } else if (mode === 'installment') {
      // 할부 전용으로 전환
      const instMonths = (!customer.installmentMonths || customer.installmentMonths === '일시불' || customer.installmentMonths === '0')
        ? '60'
        : customer.installmentMonths;
      const totalAmt = customer.paymentAmount || ((customer.installmentAmount || 0) + (customer.lumpSumAmount || 0));
      const calculated = calculateCommission(totalAmt, instRate, customer.applyTaxWithholding);

      onChange({
        ...customer,
        isHybridPayment: false,
        installmentMonths: instMonths,
        paymentAmount: totalAmt,
        installmentAmount: totalAmt,
        lumpSumAmount: 0,
        commissionRate: instRate,
        installmentCommissionRate: instRate,
        commissionAmount: calculated.netPayout,
        paymentMethodNote: '일시불로 결제 부탁드립니다~',
      });
    } else if (mode === 'lumpSum') {
      // 일시불 전용으로 전환
      const totalAmt = customer.paymentAmount || ((customer.installmentAmount || 0) + (customer.lumpSumAmount || 0));
      const calculated = calculateCommission(totalAmt, lumpRate, customer.applyTaxWithholding);

      onChange({
        ...customer,
        isHybridPayment: false,
        installmentMonths: '일시불',
        paymentAmount: totalAmt,
        lumpSumAmount: totalAmt,
        installmentAmount: 0,
        commissionRate: lumpRate,
        lumpSumCommissionRate: lumpRate,
        commissionAmount: calculated.netPayout,
        paymentMethodNote: '일시불로 결제 부탁드립니다~',
      });
    }
  };

  // 복합결제 금액 변경 핸들러
  const handleUpdateHybridAmounts = (newInstAmt: number, newLumpAmt: number) => {
    const instRate = customer.installmentCommissionRate ?? (customer.commissionRate || 0.3);
    const lumpRate = customer.lumpSumCommissionRate ?? (customer.commissionRate || 0.4);
    const total = newInstAmt + newLumpAmt;

    const totalGross = Math.round((newInstAmt * instRate) / 100) + Math.round((newLumpAmt * lumpRate) / 100);
    const tax = customer.applyTaxWithholding ? Math.round(totalGross * 0.033) : 0;
    const net = totalGross - tax;

    onChange({
      ...customer,
      installmentAmount: newInstAmt,
      lumpSumAmount: newLumpAmt,
      paymentAmount: total > 0 ? total : customer.paymentAmount,
      commissionAmount: net,
    });
  };

  // 복합결제 빠른 분할 프리셋 (일시불 비율: 10%, 20%, 30%, 50% 등)
  const handleSplitHybridPreset = (percent: number) => {
    const total = customer.paymentAmount || ((customer.installmentAmount || 0) + (customer.lumpSumAmount || 0));
    if (total <= 0) return;

    const lumpAmt = Math.round((total * percent) / 100);
    const instAmt = Math.max(0, total - lumpAmt);

    handleUpdateHybridAmounts(instAmt, lumpAmt);
  };

  // 고객명 + 주민번호 한번에 복사 핸들러
  const handleCopyCustomerInfo = async () => {
    const name = customer.customerName || '';
    const resident = customer.residentNumber ? customer.residentNumber.trim() : '';
    // 요구사항 예: "전경란  810124-2011019" (공백 2칸 구분)
    const textToCopy = resident ? `${name}  ${resident}` : name;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedCustInfo(true);
      setTimeout(() => setCopiedCustInfo(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const calculation = calculateCommission(
    customer.paymentAmount,
    customer.commissionRate,
    customer.applyTaxWithholding
  );

  const directPayoutRate = customer.cardCompanyDirectRate ?? customer.commissionRate;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs select-none">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-slate-900 text-white text-[11px] font-black shadow-2xs">
            2
          </span>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-tight">
            선택된 고객 상세 및 수수료 설정
          </h3>
        </div>
        <span className="text-[11px] font-mono text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 font-bold flex items-center gap-1.5 shadow-2xs">
          <span>{customer.customerName} 고객님</span>
          {customer.dealerInfo && (
            <span className="text-slate-600 font-semibold bg-white px-1.5 py-0.2 rounded border border-slate-200 text-[10px]">
              {customer.dealerInfo}
            </span>
          )}
          <span className="text-teal-700">({customer.cardCompany}카드)</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card Company */}
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700">
              카드사 선택
            </label>
            <span className="text-[11px] text-slate-400 font-medium">
              * 하나/우리/국민은 카드사 직지급 수수료 체크 연동
            </span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {CARD_COMPANIES.map((card) => {
              const isSelected = customer.cardCompany === card;
              const hasDirectNotice = ['하나', '우리', '국민'].includes(card);
              return (
                <button
                  type="button"
                  key={card}
                  onClick={() => handleCardChange(card)}
                  className={`py-2 px-1 text-center text-xs rounded-xl border transition-all flex flex-col items-center justify-center gap-0.5 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="whitespace-nowrap font-bold">{card}</span>
                  {hasDirectNotice && (
                    <span className={`text-[9px] px-1 rounded-sm whitespace-nowrap font-medium ${
                      isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      직지급
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Customer Name, Resident Number, Phone Number, Dealer Info + Single-Click Copy Button */}
        <div className="sm:col-span-2 bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">고객 및 딜러(영업사원) 정보</span>
            {/* 고객명 + 주민번호 원클릭 복사 버튼 */}
            <button
              type="button"
              onClick={handleCopyCustomerInfo}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                copiedCustInfo
                  ? 'bg-teal-700 text-white border border-teal-700'
                  : 'bg-white text-teal-800 border border-teal-200 hover:bg-teal-50'
              }`}
              title="고객명과 주민번호를 한번에 복사합니다"
            >
              {copiedCustInfo ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>복사 완료! ({customer.customerName} {customer.residentNumber || ''})</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-teal-700" />
                  <span>고객명 + 주민번호 한번에 복사</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* 고객명 */}
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <label
                  onClick={() => handleCopyField('customerName', customer.customerName)}
                  className="text-[11px] font-bold text-slate-600 cursor-pointer hover:text-teal-700 flex items-center gap-1 transition-colors select-none"
                  title="클릭하여 고객명 복사"
                >
                  <span>고객명</span>
                  <Copy className="w-2.5 h-2.5 opacity-60" />
                </label>
                {copiedFieldKey === 'customerName' && (
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 animate-fade-in flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> 복사됨!
                  </span>
                )}
              </div>
              <div className="relative group">
                <input
                  type="text"
                  value={customer.customerName}
                  onChange={(e) => onChange({ ...customer, customerName: e.target.value })}
                  onClick={(e) => {
                    if (customer.customerName) {
                      handleCopyField('customerName', customer.customerName);
                      (e.target as HTMLInputElement).select();
                    }
                  }}
                  className={`w-full text-xs font-bold text-slate-900 bg-white border rounded-lg pl-3 pr-8 py-2 focus:border-teal-600 focus:outline-hidden shadow-2xs cursor-pointer transition-all ${
                    copiedFieldKey === 'customerName'
                      ? 'border-teal-500 ring-2 ring-teal-100 bg-teal-50/30'
                      : 'border-slate-200 hover:border-teal-400'
                  }`}
                  placeholder="고객명 입력"
                  title="클릭 시 자동으로 복사됩니다"
                />
                <button
                  type="button"
                  onClick={(e) => handleCopyField('customerName', customer.customerName, e)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-teal-700 rounded transition-colors cursor-pointer"
                  title="고객명 복사"
                >
                  {copiedFieldKey === 'customerName' ? (
                    <Check className="w-3.5 h-3.5 text-teal-700" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  )}
                </button>
              </div>
            </div>

            {/* 딜러 / 영업사원 */}
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <label
                  onClick={() => handleCopyField('dealerInfo', customer.dealerInfo)}
                  className="text-[11px] font-bold text-slate-600 cursor-pointer hover:text-teal-700 flex items-center gap-1 transition-colors select-none"
                  title="클릭하여 딜러명 복사"
                >
                  <span>딜러 / 영업사원</span>
                  <Copy className="w-2.5 h-2.5 opacity-60" />
                </label>
                {copiedFieldKey === 'dealerInfo' && (
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 animate-fade-in flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> 복사됨!
                  </span>
                )}
              </div>
              <div className="relative group">
                <input
                  type="text"
                  value={customer.dealerInfo || ''}
                  onChange={(e) => onChange({ ...customer, dealerInfo: e.target.value })}
                  onClick={(e) => {
                    if (customer.dealerInfo) {
                      handleCopyField('dealerInfo', customer.dealerInfo);
                      (e.target as HTMLInputElement).select();
                    }
                  }}
                  className={`w-full text-xs font-bold text-slate-800 bg-white border rounded-lg pl-3 pr-8 py-2 focus:border-teal-600 focus:outline-hidden shadow-2xs cursor-pointer transition-all ${
                    copiedFieldKey === 'dealerInfo'
                      ? 'border-teal-500 ring-2 ring-teal-100 bg-teal-50/30'
                      : 'border-slate-200 hover:border-teal-400'
                  }`}
                  placeholder="예: 기아 안명균, 현대 오도원"
                  title="클릭 시 자동으로 복사됩니다"
                />
                <button
                  type="button"
                  onClick={(e) => handleCopyField('dealerInfo', customer.dealerInfo, e)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-teal-700 rounded transition-colors cursor-pointer"
                  title="딜러명 복사"
                >
                  {copiedFieldKey === 'dealerInfo' ? (
                    <Check className="w-3.5 h-3.5 text-teal-700" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  )}
                </button>
              </div>
            </div>

            {/* 주민번호 */}
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <label
                  onClick={() => handleCopyField('residentNumber', customer.residentNumber)}
                  className="text-[11px] font-bold text-slate-600 cursor-pointer hover:text-teal-700 flex items-center gap-1 transition-colors select-none"
                  title="클릭하여 주민번호 복사"
                >
                  <span>주민번호</span>
                  <Copy className="w-2.5 h-2.5 opacity-60" />
                </label>
                {copiedFieldKey === 'residentNumber' && (
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 animate-fade-in flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> 복사됨!
                  </span>
                )}
              </div>
              <div className="relative group">
                <input
                  type="text"
                  value={customer.residentNumber || ''}
                  onChange={(e) => onChange({ ...customer, residentNumber: e.target.value })}
                  onClick={(e) => {
                    if (customer.residentNumber) {
                      handleCopyField('residentNumber', customer.residentNumber);
                      (e.target as HTMLInputElement).select();
                    }
                  }}
                  className={`w-full text-xs font-mono font-bold text-slate-900 bg-white border rounded-lg pl-3 pr-8 py-2 focus:border-teal-600 focus:outline-hidden shadow-2xs cursor-pointer transition-all ${
                    copiedFieldKey === 'residentNumber'
                      ? 'border-teal-500 ring-2 ring-teal-100 bg-teal-50/30'
                      : 'border-slate-200 hover:border-teal-400'
                  }`}
                  placeholder="예: 810124-2011019"
                  title="클릭 시 자동으로 복사됩니다"
                />
                <button
                  type="button"
                  onClick={(e) => handleCopyField('residentNumber', customer.residentNumber, e)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-teal-700 rounded transition-colors cursor-pointer"
                  title="주민번호 복사"
                >
                  {copiedFieldKey === 'residentNumber' ? (
                    <Check className="w-3.5 h-3.5 text-teal-700" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  )}
                </button>
              </div>
            </div>

            {/* 전화번호 */}
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <label
                  onClick={() => handleCopyField('phoneNumber', customer.phoneNumber)}
                  className="text-[11px] font-bold text-slate-600 cursor-pointer hover:text-teal-700 flex items-center gap-1 transition-colors select-none"
                  title="클릭하여 전화번호 복사"
                >
                  <span>전화번호</span>
                  <Copy className="w-2.5 h-2.5 opacity-60" />
                </label>
                {copiedFieldKey === 'phoneNumber' && (
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 animate-fade-in flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> 복사됨!
                  </span>
                )}
              </div>
              <div className="relative group">
                <input
                  type="text"
                  value={customer.phoneNumber || ''}
                  onChange={(e) => onChange({ ...customer, phoneNumber: e.target.value })}
                  onClick={(e) => {
                    if (customer.phoneNumber) {
                      handleCopyField('phoneNumber', customer.phoneNumber);
                      (e.target as HTMLInputElement).select();
                    }
                  }}
                  className={`w-full text-xs font-mono font-medium text-slate-900 bg-white border rounded-lg pl-3 pr-8 py-2 focus:border-teal-600 focus:outline-hidden shadow-2xs cursor-pointer transition-all ${
                    copiedFieldKey === 'phoneNumber'
                      ? 'border-teal-500 ring-2 ring-teal-100 bg-teal-50/30'
                      : 'border-slate-200 hover:border-teal-400'
                  }`}
                  placeholder="예: 010-2127-7547"
                  title="클릭 시 자동으로 복사됩니다"
                />
                <button
                  type="button"
                  onClick={(e) => handleCopyField('phoneNumber', customer.phoneNumber, e)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-teal-700 rounded transition-colors cursor-pointer"
                  title="전화번호 복사"
                >
                  {copiedFieldKey === 'phoneNumber' ? (
                    <Check className="w-3.5 h-3.5 text-teal-700" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Car Model & Payment Amount & Memo (Widths: Car Model shortest, Payment Amount medium, Memo longest) */}
        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Car Model (Shortest: 3 cols / 25%) */}
          <div className="relative sm:col-span-3">
            <div className="flex items-center justify-between mb-1">
              <label
                onClick={() => handleCopyField('carModel', customer.carModel)}
                className="text-xs font-bold text-slate-700 cursor-pointer hover:text-teal-700 flex items-center gap-1 transition-colors select-none"
                title="클릭하여 차종 복사"
              >
                <span>차종</span>
                <Copy className="w-2.5 h-2.5 opacity-60" />
              </label>
              {copiedFieldKey === 'carModel' && (
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 animate-fade-in flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> 복사됨!
                </span>
              )}
            </div>
            <div className="relative group">
              <input
                type="text"
                value={customer.carModel || ''}
                onChange={(e) => onChange({ ...customer, carModel: e.target.value })}
                onClick={(e) => {
                  if (customer.carModel) {
                    handleCopyField('carModel', customer.carModel);
                    (e.target as HTMLInputElement).select();
                  }
                }}
                className={`w-full text-xs font-medium text-slate-900 bg-slate-50 border rounded-lg pl-3 pr-8 py-2 focus:bg-white focus:border-teal-600 focus:outline-hidden shadow-2xs cursor-pointer transition-all ${
                  copiedFieldKey === 'carModel'
                    ? 'border-teal-500 ring-2 ring-teal-100 bg-teal-50/30'
                    : 'border-slate-200 hover:border-teal-400'
                }`}
                placeholder="예: 포터, 그랜저 등"
                title="클릭 시 자동으로 복사됩니다"
              />
              <button
                type="button"
                onClick={(e) => handleCopyField('carModel', customer.carModel, e)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-teal-700 rounded transition-colors cursor-pointer"
                title="차종 복사"
              >
                {copiedFieldKey === 'carModel' ? (
                  <Check className="w-3.5 h-3.5 text-teal-700" />
                ) : (
                  <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                )}
              </button>
            </div>
          </div>

          {/* Payment Amount (Medium: 4 cols / 33.3%) */}
          <div className="relative sm:col-span-4">
            <div className="flex items-center justify-between mb-1">
              <label
                onClick={() => handleCopyField('paymentAmount', String(customer.paymentAmount || ''))}
                className="text-xs font-bold text-slate-700 cursor-pointer hover:text-teal-700 flex items-center gap-1 transition-colors select-none"
                title="클릭하여 결제금액 숫자 복사"
              >
                <span>차량 결제금액 (원)</span>
                <Copy className="w-2.5 h-2.5 opacity-60" />
              </label>
              {copiedFieldKey === 'paymentAmount' && (
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 animate-fade-in flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> 복사됨!
                </span>
              )}
            </div>
            <div className="relative group">
              <input
                type="text"
                value={formatCurrency(customer.paymentAmount)}
                onChange={(e) => handleAmountChange(e.target.value)}
                onClick={(e) => {
                  if (customer.paymentAmount) {
                    handleCopyField('paymentAmount', String(customer.paymentAmount));
                    (e.target as HTMLInputElement).select();
                  }
                }}
                className={`w-full text-xs font-bold text-slate-900 font-mono bg-slate-50 border rounded-lg pl-3 pr-12 py-2 focus:bg-white focus:border-teal-600 focus:outline-hidden text-right shadow-2xs cursor-pointer transition-all ${
                  copiedFieldKey === 'paymentAmount'
                    ? 'border-teal-500 ring-2 ring-teal-100 bg-teal-50/30'
                    : 'border-slate-200 hover:border-teal-400'
                }`}
                title="클릭 시 숫자 금액이 자동으로 복사됩니다"
              />
              <span className="absolute right-7 top-2 text-xs text-slate-400 font-medium">원</span>
              <button
                type="button"
                onClick={(e) => handleCopyField('paymentAmount', String(customer.paymentAmount || ''), e)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-teal-700 rounded transition-colors cursor-pointer"
                title="결제금액 복사"
              >
                {copiedFieldKey === 'paymentAmount' ? (
                  <Check className="w-3.5 h-3.5 text-teal-700" />
                ) : (
                  <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                )}
              </button>
            </div>
          </div>

          {/* Memo Input Field (Longest: 5 cols / 41.7%) */}
          <div className="relative sm:col-span-5">
            <div className="flex items-center justify-between mb-1">
              <label
                onClick={() => handleCopyField('memo', customer.memo)}
                className="text-xs font-bold text-slate-700 cursor-pointer hover:text-teal-700 flex items-center gap-1 transition-colors select-none"
                title="클릭하여 메모 복사"
              >
                <span>메모 (특이사항)</span>
                <Copy className="w-2.5 h-2.5 opacity-60" />
              </label>
              {copiedFieldKey === 'memo' && (
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200 animate-fade-in flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> 복사됨!
                </span>
              )}
            </div>
            <div className="relative group">
              <input
                type="text"
                value={customer.memo || ''}
                onChange={(e) => onChange({ ...customer, memo: e.target.value })}
                onClick={(e) => {
                  if (customer.memo) {
                    handleCopyField('memo', customer.memo);
                    (e.target as HTMLInputElement).select();
                  }
                }}
                className={`w-full text-xs font-medium text-slate-900 bg-slate-50 border rounded-lg pl-3 pr-8 py-2 focus:bg-white focus:border-teal-600 focus:outline-hidden shadow-2xs cursor-pointer transition-all ${
                  copiedFieldKey === 'memo'
                    ? 'border-teal-500 ring-2 ring-teal-100 bg-teal-50/30'
                    : 'border-slate-200 hover:border-teal-400'
                }`}
                placeholder="특이사항 및 메모 입력"
                title="클릭 시 자동으로 복사됩니다"
              />
              <button
                type="button"
                onClick={(e) => handleCopyField('memo', customer.memo, e)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-teal-700 rounded transition-colors cursor-pointer"
                title="메모 복사"
              >
                {copiedFieldKey === 'memo' ? (
                  <Check className="w-3.5 h-3.5 text-teal-700" />
                ) : (
                  <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Installment & Interest Rate & Payment Method Note & Mode Switching */}
        <div className="sm:col-span-2 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="block text-xs font-bold text-slate-700">
              결제 방식 및 유형 선택
            </label>
            
            {/* 결제 유형 3단 전환 탭 (일시불 / 할부 전용 / 할부+일시불 복합) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleSwitchPaymentMode('lumpSum')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  !isHybrid && isLump
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                일시불
              </button>
              <button
                type="button"
                onClick={() => handleSwitchPaymentMode('installment')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  !isHybrid && !isLump
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                할부 전용
              </button>
              <button
                type="button"
                onClick={() => handleSwitchPaymentMode('hybrid')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  isHybrid
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>할부 + 일시불 (복합)</span>
              </button>
            </div>
          </div>

          {/* 할부 전용 또는 일시불일 때의 입력 필드 */}
          {!isHybrid && (
            <div className="space-y-2">
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                <select
                  value={customer.installmentMonths || '일시불'}
                  onChange={(e) => {
                    const val = e.target.value;
                    const isLumpVal = val === '일시불' || val === '0';
                    if (isLumpVal) {
                      handleSwitchPaymentMode('lumpSum');
                    } else {
                      onChange({
                        ...customer,
                        isHybridPayment: false,
                        installmentMonths: val,
                        paymentMethodNote: customer.paymentMethodNote || '일시불로 결제 부탁드립니다~',
                      });
                    }
                  }}
                  className="w-full sm:w-36 text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:bg-white focus:border-teal-500 focus:outline-hidden shadow-2xs cursor-pointer"
                >
                  <option value="일시불">일시불</option>
                  <option value="12">할부 12개월</option>
                  <option value="24">할부 24개월</option>
                  <option value="36">할부 36개월</option>
                  <option value="48">할부 48개월</option>
                  <option value="60">할부 60개월</option>
                </select>

                {!isLump && (
                  <div className="relative w-full sm:w-28">
                    <input
                      type="text"
                      value={customer.interestRate || ''}
                      onChange={(e) => onChange({ ...customer, interestRate: e.target.value })}
                      className="w-full text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-2.5 py-2 focus:bg-white focus:outline-hidden pr-6 font-mono text-center shadow-2xs"
                      placeholder="금리"
                      title="할부 금리 (%)"
                    />
                    <span className="absolute right-2.5 top-2 text-xs text-purple-400 font-mono">%</span>
                  </div>
                )}

                <input
                  type="text"
                  value={
                    customer.paymentMethodNote && !customer.paymentMethodNote.includes('할부로 결제 부탁드립니다')
                      ? customer.paymentMethodNote
                      : '일시불로 결제 부탁드립니다~'
                  }
                  onChange={(e) => onChange({ ...customer, paymentMethodNote: e.target.value })}
                  className="w-full sm:flex-1 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:bg-white focus:border-teal-500 focus:outline-hidden shadow-2xs"
                  placeholder="안내문구: 일시불로 결제 부탁드립니다~"
                />
              </div>

              {/* 추가 전환 유도 버튼 */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSwitchPaymentMode('hybrid')}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-md border border-slate-200 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isLump ? '할부 추가하여 복합결제로 전환' : '일시불 추가하여 복합결제로 전환'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 복합 결제 (할부 + 일시불) 세부내역 편집 패널 */}
        {isHybrid && (
          <div className="sm:col-span-2 bg-slate-50/90 border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Sparkles className="w-4 h-4 text-slate-700" />
                <span>할부 + 일시불 복합 결제 상세 설정</span>
                <span className="text-[10px] bg-slate-900 text-white font-bold px-2 py-0.5 rounded-full ml-1">
                  복합 적용중
                </span>
              </div>

              {/* 복합 -> 할부/일시불 단일 모드로 즉시 변경 버튼 */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[11px] text-slate-500 font-medium">단일 변경:</span>
                <button
                  type="button"
                  onClick={() => handleSwitchPaymentMode('installment')}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-2xs"
                  title="할부 전용으로 변경 (일시불 제거)"
                >
                  <ArrowRightLeft className="w-3 h-3 text-slate-500" />
                  <span>할부 전용으로 변경</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchPaymentMode('lumpSum')}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-2xs"
                  title="일시불 전용으로 변경 (할부 제거)"
                >
                  <ArrowRightLeft className="w-3 h-3 text-slate-500" />
                  <span>일시불 전용으로 변경</span>
                </button>
              </div>
            </div>

            {/* 안내 문구 미리보기 박스 */}
            <div className="bg-white border border-slate-200 p-3 rounded-lg text-[11px] font-mono leading-relaxed space-y-0.5 text-slate-800 shadow-2xs">
              <div className="flex items-start">
                <span className="font-semibold text-slate-900 shrink-0">결제순서 :&nbsp;</span>
                <div className="flex flex-col font-semibold text-slate-900">
                  <div>1. {formatCurrency(customer.lumpSumAmount || 0)}원 (일시불)</div>
                  <div>2. {formatCurrency(customer.installmentAmount || 0)}원 ({customer.installmentMonths || '60'}개월 할부)</div>
                </div>
              </div>
              <div className="text-slate-600 font-medium pt-0.5">** 순서대로 일시불로 결제 부탁드립니다~</div>
            </div>

            {/* 빠른 선수금 분할 프리셋 버튼 모음 (10%, 20%, 30%) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-bold text-slate-600 mr-1">빠른 선수금 비율 분할:</span>
              <button
                type="button"
                onClick={() => handleSplitHybridPreset(10)}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 transition-all shadow-2xs cursor-pointer"
                title="결제금액의 10%를 선수금(일시불)으로 지정"
              >
                선수금 10%
                {customer.paymentAmount ? (
                  <span className="font-mono text-slate-500 font-normal ml-1">
                    ({formatCurrency(Math.round(customer.paymentAmount * 0.1))}원)
                  </span>
                ) : null}
              </button>
              <button
                type="button"
                onClick={() => handleSplitHybridPreset(20)}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 transition-all shadow-2xs cursor-pointer"
                title="결제금액의 20%를 선수금(일시불)으로 지정"
              >
                선수금 20%
                {customer.paymentAmount ? (
                  <span className="font-mono text-slate-500 font-normal ml-1">
                    ({formatCurrency(Math.round(customer.paymentAmount * 0.2))}원)
                  </span>
                ) : null}
              </button>
              <button
                type="button"
                onClick={() => handleSplitHybridPreset(30)}
                className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 transition-all shadow-2xs cursor-pointer"
                title="결제금액의 30%를 선수금(일시불)으로 지정"
              >
                선수금 30%
                {customer.paymentAmount ? (
                  <span className="font-mono text-slate-500 font-normal ml-1">
                    ({formatCurrency(Math.round(customer.paymentAmount * 0.3))}원)
                  </span>
                ) : null}
              </button>
            </div>

            {/* 세부 금액 입력 카드 2개 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* 1. 일시불 결제금액 */}
              <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-1.5 shadow-2xs">
                <div className="text-[11px] font-bold text-slate-800 flex justify-between items-center">
                  <span>① 일시불 결제금액 (1순위)</span>
                  <span className="text-slate-500 font-semibold text-[10px]">일시불</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formatCurrency(customer.lumpSumAmount || 0)}
                    onChange={(e) => {
                      const val = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0;
                      handleUpdateHybridAmounts(customer.installmentAmount || 0, val);
                    }}
                    className="w-full text-xs font-bold text-slate-900 font-mono bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 text-right pr-6 focus:bg-white focus:outline-hidden focus:border-slate-400"
                    placeholder="0"
                  />
                  <span className="absolute right-2 top-1.5 text-[11px] text-slate-400 font-mono">원</span>
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between pt-0.5">
                  <span>일시불 수수료율:</span>
                  <span className="font-bold text-slate-800">{customer.lumpSumCommissionRate ?? 0.4}%</span>
                </div>
              </div>

              {/* 2. 할부 결제금액 및 개월수 */}
              <div className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-1.5 shadow-2xs">
                <div className="text-[11px] font-bold text-slate-800 flex justify-between items-center">
                  <span>② 할부 결제금액 (2순위)</span>
                  <div className="flex items-center gap-1">
                    <select
                      value={customer.installmentMonths || '60'}
                      onChange={(e) => onChange({ ...customer, installmentMonths: e.target.value })}
                      className="text-[10px] font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded px-1 py-0.5 cursor-pointer focus:outline-hidden"
                    >
                      <option value="12">12개월</option>
                      <option value="24">24개월</option>
                      <option value="36">36개월</option>
                      <option value="48">48개월</option>
                      <option value="60">60개월</option>
                    </select>
                    <input
                      type="text"
                      value={customer.interestRate || ''}
                      onChange={(e) => onChange({ ...customer, interestRate: e.target.value })}
                      placeholder="금리"
                      className="w-12 text-[10px] font-mono font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded px-1 py-0.5 text-center focus:outline-hidden"
                      title="할부 금리 (%)"
                    />
                    <span className="text-[10px] text-purple-500 font-mono">%</span>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formatCurrency(customer.installmentAmount || 0)}
                    onChange={(e) => {
                      const val = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0;
                      handleUpdateHybridAmounts(val, customer.lumpSumAmount || 0);
                    }}
                    className="w-full text-xs font-bold text-slate-900 font-mono bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 text-right pr-6 focus:bg-white focus:outline-hidden focus:border-slate-400"
                    placeholder="0"
                  />
                  <span className="absolute right-2 top-1.5 text-[11px] text-slate-400 font-mono">원</span>
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between pt-0.5">
                  <span>할부 수수료율:</span>
                  <span className="font-bold text-slate-800">{customer.installmentCommissionRate ?? 0.3}%</span>
                </div>
              </div>
            </div>

            {/* 총 합산 정보 */}
            <div className="bg-slate-100/90 border border-slate-200/80 rounded-lg p-2.5 text-xs text-slate-800 flex flex-wrap items-center justify-between gap-2 font-mono">
              <span>총 결제금액: <strong className="font-bold text-slate-900">{formatCurrency(customer.paymentAmount)}원</strong></span>
              <span>총 수수료율: <strong className="font-bold text-slate-900">{customer.commissionRate}%</strong></span>
              <span>실지급액: <strong className="font-bold text-slate-900">{formatCurrency(customer.commissionAmount)}원</strong></span>
            </div>
          </div>
        )}

        {/* 1. 수수료 설정 및 정산 (할부 수수료 / 일시불 수수료 / 전체 수수료 실지급액) */}
        <div className="sm:col-span-2 bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3.5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-bold text-slate-900">수수료 정산 설정 (할부 / 일시불 / 전체 수수료)</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* 카드사 직접 지급건 체크 */}
              <label 
                id="checkbox-card-direct-payout-label"
                className={`inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer px-2.5 py-1 rounded-lg border transition-colors shadow-2xs ${
                  customer.cardCompanyDirectPayout
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  id="checkbox-card-direct-payout"
                  type="checkbox"
                  checked={!!customer.cardCompanyDirectPayout}
                  onChange={(e) =>
                    onChange({
                      ...customer,
                      cardCompanyDirectPayout: e.target.checked,
                      cardCompanyDirectRate: customer.cardCompanyDirectRate ?? customer.commissionRate,
                    })
                  }
                  className="rounded text-slate-800 focus:ring-slate-700 h-3.5 w-3.5"
                />
                <Building2 className={`w-3.5 h-3.5 ${customer.cardCompanyDirectPayout ? 'text-slate-300' : 'text-slate-500'}`} />
                <span>카드사 수수료 직접 지급건</span>
                {['하나', '우리', '국민'].includes(customer.cardCompany as string) && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                    customer.cardCompanyDirectPayout ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {customer.cardCompany} 권장
                  </span>
                )}
              </label>

              {/* 3.3% withholding tax toggle */}
              <label className={`inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer px-2.5 py-1 rounded-lg border transition-colors shadow-2xs ${
                customer.applyTaxWithholding
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}>
                <input
                  type="checkbox"
                  checked={customer.applyTaxWithholding}
                  onChange={(e) => handleTaxToggle(e.target.checked)}
                  className="rounded text-slate-800 focus:ring-slate-700 h-3.5 w-3.5"
                />
                <span>원천징수 3.3% 공제</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* ① 할부 수수료 */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              !isLump || isHybrid ? 'bg-white border-slate-200' : 'bg-slate-100/50 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-800">① 할부 수수료율</span>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {isHybrid ? `${customer.installmentMonths || 36}개월` : !isLump ? `${customer.installmentMonths}개월` : '해당없음'}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    type="text"
                    value={installmentRateStr}
                    onChange={(e) => handleInstallmentRateChange(e.target.value)}
                    onBlur={() => {
                      const num = parseFloat(installmentRateStr);
                      setInstallmentRateStr(!isNaN(num) ? String(num) : '0');
                    }}
                    disabled={isLump && !isHybrid}
                    placeholder="0.3"
                    className="w-full text-xs font-bold text-slate-900 font-mono bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:border-slate-500 focus:outline-hidden pr-6 shadow-2xs"
                  />
                  <span className="absolute right-2.5 top-1.5 text-xs text-slate-400 font-bold">%</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                  <span>대상금액:</span>
                  <span className="font-semibold text-slate-800">
                    {formatCurrency(isHybrid ? (customer.installmentAmount || 0) : !isLump ? customer.paymentAmount : 0)}원
                  </span>
                </div>
              </div>
            </div>

            {/* ② 일시불 수수료 */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              isLump || isHybrid ? 'bg-white border-slate-200' : 'bg-slate-100/50 border-slate-200 opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-800">② 일시불 수수료율</span>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {isLump || isHybrid ? '일시불' : '해당없음'}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    type="text"
                    value={lumpSumRateStr}
                    onChange={(e) => handleLumpSumRateChange(e.target.value)}
                    onBlur={() => {
                      const num = parseFloat(lumpSumRateStr);
                      setLumpSumRateStr(!isNaN(num) ? String(num) : '0');
                    }}
                    disabled={!isLump && !isHybrid}
                    placeholder="0.4"
                    className="w-full text-xs font-bold text-slate-900 font-mono bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:border-slate-500 focus:outline-hidden pr-6 shadow-2xs"
                  />
                  <span className="absolute right-2.5 top-1.5 text-xs text-slate-400 font-bold">%</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                  <span>대상금액:</span>
                  <span className="font-semibold text-slate-800">
                    {formatCurrency(isHybrid ? (customer.lumpSumAmount || 0) : isLump ? customer.paymentAmount : 0)}원
                  </span>
                </div>
              </div>
            </div>

            {/* ③ 전체 수수료 (실지급액) */}
            <div className="bg-white border border-slate-300 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-900">③ 전체 수수료 (실지급액)</span>
                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                  {customer.applyTaxWithholding ? '세후 3.3% 공제' : '세전 전액'}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={commissionRateStr}
                  onChange={(e) => handleCommissionRateChange(e.target.value)}
                  onBlur={() => {
                    const num = parseFloat(commissionRateStr);
                    setCommissionRateStr(!isNaN(num) ? String(num) : '0');
                  }}
                  placeholder="0.4"
                  className="w-full text-xs font-bold text-slate-900 font-mono bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:bg-white focus:border-slate-500 focus:outline-hidden pr-6 shadow-2xs"
                />
                <span className="absolute right-2.5 top-1.5 text-xs text-slate-400 font-bold">%</span>
              </div>
              <div className="text-xs font-bold text-slate-900 font-mono py-1.5 px-2 bg-slate-100 border border-slate-200 rounded-lg flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-sans font-medium">실지급액:</span>
                <span>{formatCurrency(customer.commissionAmount)}원</span>
              </div>
            </div>
          </div>

          {/* CARD COMPANY DIRECT PAYOUT RATE & PREVIEW (체크 시 표시) */}
          {customer.cardCompanyDirectPayout && (
            <div className="pt-3 border-t border-slate-200 bg-white rounded-xl p-3 flex flex-col gap-2 border border-slate-200 shadow-2xs transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Building2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>카드사 직접 지급 설정</span>
                  {['하나', '우리', '국민'].includes(customer.cardCompany as string) && (
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-md font-semibold">
                      {customer.cardCompany} 권장
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-600">카드사 직접 지급율:</span>
                  <div className="relative w-20">
                    <input
                      type="text"
                      value={directPayoutRateStr}
                      onChange={(e) => handleDirectPayoutRateChange(e.target.value)}
                      onBlur={() => {
                        const num = parseFloat(directPayoutRateStr);
                        setDirectPayoutRateStr(!isNaN(num) ? String(num) : '0');
                      }}
                      placeholder="0.4"
                      className="w-full text-xs font-bold text-slate-900 font-mono bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 pr-5 focus:outline-hidden focus:bg-white focus:border-slate-500 shadow-2xs"
                    />
                    <span className="absolute right-1.5 top-1 text-xs text-slate-400 font-bold">%</span>
                  </div>
                </div>
              </div>

              <div className="text-xs font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-800 flex items-center gap-1.5 shadow-2xs">
                <span className="font-bold text-slate-600 shrink-0">출력문구:</span>
                <span className="truncate text-slate-700">** 카드사에서 {directPayoutRate}% 지급되는점 참고 부탁드립니다 ^^</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
