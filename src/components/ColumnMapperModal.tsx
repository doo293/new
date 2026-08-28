import React, { useState } from 'react';
import { ColumnMapping } from '../types';
import { DEFAULT_COLUMN_MAPPING } from '../data/defaultTemplates';
import { X, Save, RotateCcw, Table, Check, HelpCircle } from 'lucide-react';

interface ColumnMapperModalProps {
  isOpen: boolean;
  onClose: () => void;
  mapping: ColumnMapping;
  onSaveMapping: (updated: ColumnMapping) => void;
  onResetMapping: () => void;
}

const FIELD_LABELS: { key: keyof ColumnMapping; label: string; desc: string; sample: string }[] = [
  { key: 'cardCompany', label: '카드사 열', desc: '우리, 국민, 신한 등 카드사명 위치', sample: '4번째 열 (index 4)' },
  { key: 'status', label: '진행상태 열', desc: '할부완료, 증액완료 등 상태 위치', sample: '11번째 열 (index 11)' },
  { key: 'customerName', label: '고객명 열', desc: '고객 성함 위치', sample: '12번째 열 (index 12)' },
  { key: 'carModel', label: '차종 열', desc: '차량 모델명 위치', sample: '19번째 열 (index 19)' },
  { key: 'paymentAmount', label: '결제금액 열', desc: '차량 결제 대금(원)', sample: '23번째 열 (index 23)' },
  { key: 'installmentMonths', label: '할부개월 열', desc: '할부 기간(60, 일시불 등)', sample: '24번째 열 (index 24)' },
  { key: 'interestRate', label: '금리 열', desc: '할부 금리(4%)', sample: '25번째 열 (index 25)' },
  { key: 'commissionRate', label: '수수료율(%) 열', desc: '캐시백/수수료 요율(0.9)', sample: '26번째 열 (index 26)' },
  { key: 'dealerInfo', label: '영업사원/대리점', desc: '카마스터 정보', sample: '7번째 열 (index 7)' },
  { key: 'phoneNumber', label: '연락처 열', desc: '고객 휴대전화 번호', sample: '18번째 열 (index 18)' },
  { key: 'residentNumber', label: '주민번호 열', desc: '고객 생년월일/주민번호', sample: '17번째 열 (index 17)' },
  { key: 'manager', label: '담당자 열', desc: '작성 담당자 성함', sample: '3번째 열 (index 3)' },
  { key: 'agency', label: '에이전시 열', desc: '상사/에이전시명', sample: '16번째 열 (index 16)' },
];

export const ColumnMapperModal: React.FC<ColumnMapperModalProps> = ({
  isOpen,
  onClose,
  mapping,
  onSaveMapping,
  onResetMapping,
}) => {
  const [current, setCurrent] = useState<ColumnMapping>(mapping);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof ColumnMapping, val: number) => {
    setCurrent({ ...current, [field]: isNaN(val) ? 0 : val });
  };

  const handleSave = () => {
    onSaveMapping(current);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    if (confirm('기본 구글 스프레드시트 컬럼 매핑으로 초기화하시겠습니까?')) {
      setCurrent(DEFAULT_COLUMN_MAPPING);
      onResetMapping();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-teal-700" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                스프레드시트 열(컬럼) 매핑 설정
              </h2>
              <p className="text-xs text-slate-500">
                구글 스프레드시트의 각 항목이 몇 번째 열(0부터 시작)에 있는지 지정합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3 text-xs text-teal-900 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold mb-0.5">스프레드시트 복사 시 0번 열부터 카운트됩니다.</p>
              <p className="text-slate-600">
                기본값은 제공해주신 양식(90, 2026-08-19, 강희연, 우리, ...)에 100% 최적화되어 있습니다. 스프레드시트 열 순서를 바꾸셨을 때만 수정해주세요.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FIELD_LABELS.map((item) => (
              <div
                key={item.key}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">{item.label}</div>
                  <div className="text-[10px] text-slate-400">{item.desc}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500 font-mono">Index</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={current[item.key]}
                    onChange={(e) => handleChange(item.key, parseInt(e.target.value, 10))}
                    className="w-14 text-xs font-bold font-mono text-center bg-white border border-slate-300 rounded-lg py-1.5 px-1 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>기본값 초기화</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              닫기
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-sm cursor-pointer"
            >
              {savedNotice ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>설정 저장됨!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>설정 저장하기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
