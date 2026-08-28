import React, { useState, useEffect, useRef } from 'react';
import {
  CreditCard,
  Zap,
  Car,
  Building2,
  Edit3,
  Check,
  RotateCcw,
  Printer,
  CheckCircle2,
  Image as ImageIcon,
  Upload,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Plus,
  Sliders,
  Type,
  Palette,
  Eye,
  ShieldCheck,
} from 'lucide-react';

// ============================================================================
// 카드사별 기본 CI 로고 및 브랜드 뱃지 (기본 벡터 렌더러 - 동일 규격 통일)
// ============================================================================
export const WooriBrandBadge: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <div className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap ${className}`}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <defs>
        <linearGradient id="woori_grad_c" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0090D9" />
          <stop offset="0.6" stopColor="#0066B3" />
          <stop offset="1" stopColor="#004D8C" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#woori_grad_c)" />
      <path d="M12 56 C24 24, 76 24, 88 56 C74 38, 26 38, 12 56 Z" fill="#FFFFFF" opacity="0.95" />
      <path d="M16 54 C30 32, 70 32, 84 54 C72 44, 28 44, 16 54 Z" fill="#E1F3FE" opacity="0.8" />
    </svg>
    <span className="font-bold tracking-tight text-[#0066B3]" style={{ fontSize: `${Math.max(11, size * 0.65)}px` }}>
      우리카드
    </span>
  </div>
);

export const LotteBrandBadge: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <div className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap ${className}`}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <rect x="50" y="8" width="58" height="58" rx="16" transform="rotate(45 50 8)" fill="#ED1C24" />
      <path
        d="M50 24 C44 24, 38 29, 38 38 C38 48, 52 60, 52 68 C52 73, 49 76, 44 76 C39 76, 35 72, 35 67 L28 67 C28 77, 35 83, 44 83 C54 83, 60 76, 60 67 C60 56, 46 44, 46 37 C46 32, 48 30, 51 30 C54 30, 57 33, 58 37 L65 34 C63 28, 57 24, 50 24 Z"
        fill="#FFFFFF"
      />
      <circle cx="34" cy="53" r="3.5" fill="#FFFFFF" />
    </svg>
    <span className="font-bold tracking-tight text-[#ED1C24]" style={{ fontSize: `${Math.max(11, size * 0.65)}px` }}>
      롯데카드
    </span>
  </div>
);

export const NHBrandBadge: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <div className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap ${className}`}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="50" cy="50" r="48" fill="#004D99" />
      <path
        d="M50 14 C32 14, 20 28, 20 48 C20 68, 33 84, 50 84 C67 84, 80 68, 80 48 C80 28, 68 14, 50 14 Z M50 24 C62 24, 70 34, 70 48 C70 62, 62 74, 50 74 C38 74, 30 62, 30 48 C30 34, 38 24, 50 24 Z"
        fill="#FFD200"
      />
      <path d="M42 34 L58 34 L58 42 L42 42 Z M42 48 L58 48 L58 64 L42 64 Z" fill="#FFD200" />
      <path d="M46 38 L54 38 L54 60 L46 60 Z" fill="#004D99" />
    </svg>
    <span className="font-bold tracking-tight text-[#004D99]" style={{ fontSize: `${Math.max(11, size * 0.65)}px` }}>
      NH농협카드
    </span>
  </div>
);

export const ShinhanBrandBadge: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <div className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap ${className}`}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <defs>
        <linearGradient id="shinhan_grad_c" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0046FF" />
          <stop offset="1" stopColor="#002080" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#shinhan_grad_c)" />
      <path d="M26 62 C34 72, 66 72, 74 62 C68 44, 32 44, 26 62 Z" fill="#FFFFFF" />
      <path d="M32 38 C42 26, 58 26, 68 38 C60 48, 40 48, 32 38 Z" fill="#FFDE00" />
    </svg>
    <span className="font-bold tracking-tight text-[#0046FF]" style={{ fontSize: `${Math.max(11, size * 0.65)}px` }}>
      신한카드
    </span>
  </div>
);

export const HanaBrandBadge: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <div className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap ${className}`}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="50" cy="50" r="48" fill="#008485" />
      <path
        d="M50 20 C36 20, 26 30, 26 44 C26 58, 38 72, 50 82 C62 72, 74 58, 74 44 C74 30, 64 20, 50 20 Z"
        fill="#FFFFFF"
      />
      <path
        d="M50 30 C42 30, 36 36, 36 44 C36 53, 44 64, 50 71 C56 64, 64 53, 64 44 C64 36, 58 30, 50 30 Z"
        fill="#E80028"
      />
    </svg>
    <span className="font-bold tracking-tight text-[#008485]" style={{ fontSize: `${Math.max(11, size * 0.65)}px` }}>
      하나카드
    </span>
  </div>
);

export const HanaBankBrandBadge: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <div className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap ${className}`}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <circle cx="50" cy="50" r="48" fill="#008485" />
      <path
        d="M50 20 C36 20, 26 30, 26 44 C26 58, 38 72, 50 82 C62 72, 74 58, 74 44 C74 30, 64 20, 50 20 Z"
        fill="#FFFFFF"
      />
      <path
        d="M50 30 C42 30, 36 36, 36 44 C36 53, 44 64, 50 71 C56 64, 64 53, 64 44 C64 36, 58 30, 50 30 Z"
        fill="#E80028"
      />
    </svg>
    <span className="font-bold tracking-tight text-[#008485]" style={{ fontSize: `${Math.max(11, size * 0.65)}px` }}>
      하나은행
    </span>
  </div>
);

export const KBBrandBadge: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <div className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap ${className}`}>
    <div
      className="rounded flex items-center justify-center font-black text-slate-800 tracking-tighter shrink-0"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: '#FFCC00',
        fontSize: `${size * 0.55}px`,
      }}
    >
      KB
    </div>
    <span className="font-bold tracking-tight text-slate-900" style={{ fontSize: `${Math.max(11, size * 0.65)}px` }}>
      KB국민카드
    </span>
  </div>
);

// 카드사 로고 이미지 저장소 키
const LOGO_STORAGE_KEY = 'dealer_custom_card_logos_v2';
const LOGO_SCALES_STORAGE_KEY = 'dealer_custom_card_logo_scales_v2';
const STYLES_STORAGE_KEY = 'dealer_condition_custom_styles_v2';
const CANVAS_NATIVE_WIDTH = 1540;

export const getCleanCardKey = (name: string): string => {
  const clean = name.replace(/\s+/g, '');
  if (clean.includes('농협') || clean.includes('NH')) return '농협카드';
  if (clean.includes('롯데')) return '롯데카드';
  if (clean.includes('우리')) return '우리카드';
  if (clean.includes('신한은행')) return '신한은행';
  if (clean.includes('신한')) return '신한카드';
  if (clean.includes('하나은행')) return '하나은행';
  if (clean.includes('하나')) return '하나카드';
  if (clean.includes('국민은행') || clean.includes('KB은행')) return 'KB국민은행';
  if (clean.includes('국민') || clean.includes('KB')) return 'KB국민카드';
  return clean;
};

// 카드사 명칭에 맞춰 커스텀 업로드 이미지 또는 기본 브랜드 뱃지를 반환하는 컴포넌트
// 모든 로고가 동일한 가로/세로 규격 박스(w-[114px] h-[30px])에 정렬되도록 보정
export const CardBrandLogo: React.FC<{
  name: string;
  size?: number;
  className?: string;
  customLogos?: Record<string, string>;
  customScales?: Record<string, number>;
  onUploadClick?: (brandKey: string) => void;
}> = ({ name, size = 20, className = '', customLogos, customScales, onUploadClick }) => {
  const brandKey = getCleanCardKey(name);
  const customImg = customLogos?.[brandKey];
  const userScale = (customScales?.[brandKey] ?? 100) / 100;

  // 전체 통일된 높이 및 박스 규격
  const targetHeight = Math.max(18, size * 1.15);

  if (customImg) {
    return (
      <div
        className={`w-[114px] h-[32px] mx-auto flex items-center justify-center cursor-pointer group relative overflow-hidden ${className}`}
        onClick={() => onUploadClick?.(brandKey)}
        title={`${brandKey} (클릭하여 로고 이미지 변경/크기 조절)`}
      >
        <img
          src={customImg}
          alt={brandKey}
          style={{
            height: `${targetHeight}px`,
            maxHeight: '30px',
            maxWidth: '108px',
            transform: `scale(${userScale})`,
            transformOrigin: 'center center',
          }}
          className="object-contain transition-transform group-hover:opacity-90"
        />
      </div>
    );
  }

  const renderBadge = () => {
    if (brandKey === '농협카드') return <NHBrandBadge size={size} />;
    if (brandKey === '롯데카드') return <LotteBrandBadge size={size} />;
    if (brandKey === '우리카드') return <WooriBrandBadge size={size} />;
    if (brandKey === '신한카드') return <ShinhanBrandBadge size={size} />;
    if (brandKey === '하나은행') return <HanaBankBrandBadge size={size} />;
    if (brandKey === '하나카드') return <HanaBrandBadge size={size} />;
    if (brandKey === 'KB국민카드') return <KBBrandBadge size={size} />;
    return (
      <div className="inline-flex items-center justify-center gap-1 text-slate-800 font-bold">
        <CreditCard size={size * 0.85} className="text-slate-400" />
        <span style={{ fontSize: `${Math.max(11, size * 0.65)}px` }}>{name}</span>
      </div>
    );
  };

  return (
    <div
      className={`w-[114px] h-[32px] mx-auto flex items-center justify-center cursor-pointer group ${className}`}
      onClick={() => onUploadClick?.(brandKey)}
      title={`${brandKey} (클릭하여 이미지 직접 업로드/교체)`}
    >
      <div
        style={{
          transform: userScale !== 1 ? `scale(${userScale})` : undefined,
          transformOrigin: 'center center',
        }}
      >
        {renderBadge()}
      </div>
    </div>
  );
};

// 개별 항목 스타일 설정 인터페이스
export interface ItemStyleConfig {
  fontSize?: string;      // 예: '11px', '12px', '13px', '14px', '15px'
  color?: string;         // 텍스트 색상 hex (예: '#2563eb', '#dc2626')
  fontWeight?: string;    // 'normal' | 'bold' | '900'
  bgColor?: string;       // 배경 강조색
}

export interface DealerConditionStyles {
  // 섹션별 폰트 크기 및 색상 커스텀
  headerFontSize?: string;
  tableHeadFontSize?: string;
  tableBodyFontSize?: string;
  customerRateColor?: string;
  incentiveRateColor?: string;
  highlightColor?: string;
  noteFontSize?: string;
  noteColor?: string;
  logoSize?: number; // 로고 기준 크기 (기본 20px)
  
  // 개별 행 또는 항목 커스텀 오버라이드
  customItemStyles?: Record<string, ItemStyleConfig>;
}

export const DEFAULT_CONDITION_STYLES: DealerConditionStyles = {
  headerFontSize: '30px',
  tableHeadFontSize: '12px',
  tableBodyFontSize: '12px',
  customerRateColor: '#2563eb', // Blue-600
  incentiveRateColor: '#0f172a', // Slate-900
  highlightColor: '#dc2626',     // Red-600
  noteFontSize: '10.5px',
  noteColor: '#475569',         // Slate-600
  logoSize: 20,
  customItemStyles: {},
};

export interface DirectItem {
  id?: string;
  brand: string;
  type?: string;
  downPayment: string;
  period?: string;
  rate?: string;
  periodRate?: string;
  incentive: string;
  note: string;
  isHighlight?: boolean;
  fontSize?: string;
  textColor?: string;
  incColor?: string;
}

export interface AutoItem {
  id?: string;
  brand: string;
  type?: string;
  downPaymentRate: string;
  period?: string;
  rate?: string;
  periodRate?: string;
  incentive: string;
  note: string;
  isHighlight?: boolean;
  fontSize?: string;
  textColor?: string;
  incColor?: string;
}

export function splitPeriodRate(periodRate?: string, defaultPeriod?: string, defaultRate?: string): { period: string; rate: string } {
  if (!periodRate) {
    return { period: defaultPeriod || '', rate: defaultRate || '' };
  }
  const lines = periodRate.split('\n');
  const periods: string[] = [];
  const rates: string[] = [];
  for (const line of lines) {
    if (line.includes(':')) {
      const parts = line.split(':');
      const p = parts[0].trim();
      const periodFormatted = /^\d+$/.test(p) ? `${p}개월` : p;
      periods.push(periodFormatted);
      rates.push(parts.slice(1).join(':').trim());
    } else {
      periods.push(line.trim());
      rates.push('');
    }
  }
  return {
    period: periods.join('\n'),
    rate: rates.join('\n'),
  };
}

export function formatPercentValue(val: string | undefined | null): string {
  if (!val) return '';
  const lines = String(val).split('\n').map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    if (trimmed.includes('%')) return trimmed;

    // Pure number (integer or decimal: e.g. "1.5", "2", "0.8", "0.0", "-0.5")
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      return `${trimmed}%`;
    }
    // Range (e.g. "1.5~2.0", "1.5 ~ 2.0", "1.5-2.0")
    if (/^\d+(\.\d+)?\s*[~-]\s*\d+(\.\d+)?$/.test(trimmed)) {
      const parts = trimmed.split(/[~-]/);
      return `${parts[0].trim()}%~${parts[1].trim()}%`;
    }
    return trimmed;
  });
  return lines.join('\n');
}

export interface CorporateItem {
  name: string;
  cust: string;
  inc: string;
  note: string;
  fontSize?: string;
  textColor?: string;
}

export interface DealerConditionState {
  titleYearMonth: string;
  titleSuffix: string;
  exclusiveBadge: string;
  baseDateNotice: string;

  // 1. 일시불
  lumpSum: {
    nh: {
      tier1_amt: string;
      tier1_cust: string;
      tier1_inc: string;
      tier1_note: string;
      tier2_amt: string;
      tier2_cust: string;
      tier2_inc: string;
      tier2_note: string;
    };
    lotte: {
      amt: string;
      cust: string;
      inc: string;
      note1: string;
      note2Highlight: string;
    };
    woori: {
      amt: string;
      cust: string;
      inc: string;
      note: string;
    };
    shinhan: {
      amt: string;
      cust: string;
      incNew: string;
      incExist: string;
      note1: string;
      note2: string;
    };
    hana: {
      amt: string;
      rates: Array<{
        type: string;
        cust: string;
        inc: string;
      }>;
      notes: string[];
    };
    kb: {
      cust: string;
      tiers: Array<{
        amt: string;
        inc: string;
      }>;
      notes: string[];
    };
  };

  // 2. 법인 캐시백
  corporate: CorporateItem[];

  // 3. 다이렉트 할부
  directBadges: {
    badge1: string;
    badge2: string;
    badge3: string;
  };
  directList: DirectItem[];

  // 4. 오토 할부
  autoBadges: {
    badge1: string;
    badge2: string;
    badge3: string;
  };
  autoList: AutoItem[];

  // 5. 오토할부 / 조건표 참고사항
  autoLoanNotes?: string[];
}

export const DEFAULT_AUTO_LOAN_NOTES = [
  '카드사별 캐시백 및 할부 조건은 변동될 수 있으므로 진행 전 확인 부탁드립니다.',
  '할부 진행시 공동명의는 사전에 말씀 부탁드립니다.',
  '중도상환은 할부 3개월간 유지 후, 4개월 차 때부터 가능합니다. (첫회차 납부 필수)',
  '문제가 발생할 경우, 수수료 지급이 어렵거나 환수가 있을 수 있는 점 참고 부탁드립니다.',
];

export const INITIAL_DEALER_CONDITION: DealerConditionState = {
  titleYearMonth: '2026.02월',
  titleSuffix: '신차구매 통합 조건표',
  exclusiveBadge: 'B2B DEALER EXCLUSIVE',
  baseDateNotice: '※ 02/02(월) 기준 (정책 변동 시 실시간 업데이트)',

  lumpSum: {
    nh: {
      tier1_amt: '2천이상',
      tier1_cust: '1.7%',
      tier1_inc: '0.2%',
      tier1_note: '신규 가상발급시 +0.3%',
      tier2_amt: '5백이상',
      tier2_cust: '1.2%',
      tier2_inc: '0.2%',
      tier2_note: '신규 가상발급시 +0.3%',
    },
    lotte: {
      amt: '5백이상',
      cust: '1.6%',
      inc: '0.3%',
      note1: '신규발급시 +0.3% 익월말지급',
      note2Highlight: '※ 2천이상시 2.0% 50명선착순',
    },
    woori: {
      amt: '5백이상',
      cust: '1.5%',
      inc: '0.3%',
      note: '신규발급시 +0.3% 익월말지급\n(단, 우리은행 결제계좌 등록)',
    },
    shinhan: {
      amt: '5백이상',
      cust: '1.3%',
      incNew: '신규 0.5%',
      incExist: '기존 0.3%',
      note1: '신규발급시 +0.2% 익월말지급\n(단, 신한은행 결제계좌 등록)',
      note2: '기존회원 5천이상 추가+0.1%',
    },
    hana: {
      amt: '5백이상',
      rates: [
        { type: '하나Plus체크', cust: '1.3%', inc: '0.4%' },
        { type: '신용카드', cust: '1.2%', inc: '0.4%' },
      ],
      notes: [
        '체크 발급조건 : 1천만원이상 0.2% / 3천만원이상 0.3% / 5천만원이상 0.4%',
        '신용 신규발급시 +0.2% (단, 하나은행 결제계좌 등록)',
      ],
    },
    kb: {
      cust: '1.0%',
      tiers: [
        { amt: '5천이상', inc: '0.7%' },
        { amt: '2천이상', inc: '0.6%' },
        { amt: '5백이상', inc: '0.5%' },
      ],
      notes: ['신규발급시 +0.3% 익월말지급\n(단, 국민은행 결제계좌 등록)'],
    },
  },

  corporate: [
    {
      name: 'NH농협카드',
      cust: '1.4%',
      inc: '0.2%',
      note: '5백만원 이상',
    },
    {
      name: '신한카드',
      cust: '1.3%',
      inc: '0.3%',
      note: '신규/기존 5백이상\n(5천이상 +0.1%)',
    },
    {
      name: '롯데카드',
      cust: '1.3%',
      inc: '0.3%',
      note: '5백만원 이상',
    },
    {
      name: '우리카드',
      cust: '1.3%',
      inc: '0.3%',
      note: '5백만원 이상',
    },
    {
      name: '하나카드',
      cust: '1.3%',
      inc: '0.3%',
      note: '5백만원 이상',
    },
    {
      name: 'KB국민카드',
      cust: '1.0%',
      inc: '0.5%',
      note: '5백만원 이상',
    },
  ],

  directBadges: {
    badge1: '대출기록 無',
    badge2: '중도상환수수료 無',
    badge3: '원금균등상환',
  },

  directList: [
    {
      brand: '롯데카드',
      type: '다이렉트',
      downPayment: '선수0%\n(무선수)',
      period: '12개월\n24개월\n36개월\n48개월\n60개월',
      rate: '3.8%\n3.9%\n4.0%\n4.1%\n4.2%',
      periodRate: '12 : 3.8%\n24 : 3.9%\n36 : 4.0%\n48 : 4.1%\n60 : 4.2%',
      incentive: '0.8%',
      note: '카드 발급조건\n선수금 결제시 1.5% 캐시백',
    },
    {
      brand: '우리카드',
      type: '저금리',
      downPayment: '선수금\n10%이상',
      period: '12개월\n24개월\n36개월\n48개월\n60개월',
      rate: '3.1%\n3.4%\n3.6%\n3.8%\n3.9%',
      periodRate: '12 : 3.1%\n24 : 3.4%\n36 : 3.6%\n48 : 3.8%\n60 : 3.9%',
      incentive: '0.0%',
      note: '신차 전차종\n카드 발급조건\n선수금 캐시백 불가',
      isHighlight: true,
    },
    {
      brand: '우리카드',
      type: '다이렉트',
      downPayment: '선수금\n무관',
      period: '12개월\n24개월\n36개월\n48개월\n60개월',
      rate: '3.6%\n3.9%\n4.1%\n4.3%\n4.4%',
      periodRate: '12 : 3.6%\n24 : 3.9%\n36 : 4.1%\n48 : 4.3%\n60 : 4.4%',
      incentive: '1.0%',
      note: '신차 전차종\n카드 발급조건\n선수금 결제시 1.5% 캐시백',
    },
    {
      brand: '하나카드',
      type: '다이렉트',
      downPayment: '선수금\n무관',
      period: '12개월\n24개월\n36개월\n48개월\n60개월',
      rate: '3.7%\n4.0%\n4.2%\n4.3%\n4.4%',
      periodRate: '12 : 3.7%\n24 : 4.0%\n36 : 4.2%\n48 : 4.3%\n60 : 4.4%',
      incentive: '1.0%',
      note: '신차 전차종\n하나Plus체크 발급\n선수금 결제시 1.2% 캐시백',
    },
    {
      brand: 'KB국민카드',
      type: '다이렉트',
      downPayment: '선수금\n무관',
      period: '12개월\n24개월\n36개월\n48개월\n60개월',
      rate: '3.8%\n4.1%\n4.3%\n4.4%\n4.5%',
      periodRate: '12 : 3.8%\n24 : 4.1%\n36 : 4.3%\n48 : 4.4%\n60 : 4.5%',
      incentive: '0.9%',
      note: '신차 전차종\n카드 발급조건\n선수금 결제시 1.0% 캐시백',
    },
    {
      brand: '신한카드',
      type: '다이렉트',
      downPayment: '선수금\n무관',
      period: '12개월\n24개월\n36개월\n48개월\n60개월',
      rate: '3.9%\n4.2%\n4.4%\n4.5%\n4.6%',
      periodRate: '12 : 3.9%\n24 : 4.2%\n36 : 4.4%\n48 : 4.5%\n60 : 4.6%',
      incentive: '0.8%',
      note: '신차 전차종\n신한카드 발급\n선수금 결제시 1.3% 캐시백',
    },
  ],

  autoBadges: {
    badge1: 'DSR 1억원 한도',
    badge2: '은행 저금리',
    badge3: '최장 120개월',
  },

  autoList: [
    {
      brand: '하나은행',
      type: '오토할부',
      downPaymentRate: '무선수',
      period: '36~59개월\n60~119개월\n120개월',
      rate: '변동 (2.0%)\n변동 (2.2%)\n변동 (2.4%)',
      periodRate: '36~59 : 변동 (2.0%)\n60~119 : 변동 (2.2%)\n120 : 변동 (2.4%)',
      incentive: '2.0~\n2.4%',
      note: '은행계좌 개설필수\n변동금리 4~5%\n중도 0.7%(3년후면제)',
      isHighlight: true,
    },
    {
      brand: '신한은행',
      type: '마이카',
      downPaymentRate: '무선수',
      period: '36~59개월\n60~119개월\n120개월',
      rate: '변동 (2.0%)\n변동 (2.2%)\n변동 (2.3%)',
      periodRate: '36~59 : 변동 (2.0%)\n60~119 : 변동 (2.2%)\n120 : 변동 (2.3%)',
      incentive: '2.0~\n2.3%',
      note: '신한은행 거래고객\n변동금리 4~5%\n중도 0.7%(3년후면제)',
    },
    {
      brand: 'KB국민은행',
      type: '매직카',
      downPaymentRate: '무선수',
      period: '36~59개월\n60~119개월\n120개월',
      rate: '변동 (1.9%)\n변동 (2.1%)\n변동 (2.3%)',
      periodRate: '36~59 : 변동 (1.9%)\n60~119 : 변동 (2.1%)\n120 : 변동 (2.3%)',
      incentive: '1.9~\n2.3%',
      note: '국민은행 거래고객\n변동금리 4~5%\n중도 0.7%(3년후면제)',
    },
    {
      brand: '우리아이엠캐피탈',
      type: '오토할부',
      downPaymentRate: '무선수',
      period: '36~59개월\n60~119개월\n120개월',
      rate: '변동 (2.2%)\n변동 (2.4%)\n변동 (2.6%)',
      periodRate: '36~59 : 변동 (2.2%)\n60~119 : 변동 (2.4%)\n120 : 변동 (2.6%)',
      incentive: '2.2~\n2.6%',
      note: 'F4 외국인 가능\n변동금리 5~6%\n중도 0.7%(3년후면제)',
    },
  ],

  autoLoanNotes: DEFAULT_AUTO_LOAN_NOTES,
};

const STORAGE_KEY = 'dealer_clean_condition_matrix_v2';

export const ConditionMatrixTab: React.FC = () => {
  const [data, setData] = useState<DealerConditionState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const directList = (parsed.directList || INITIAL_DEALER_CONDITION.directList).map((item: any) => {
          if (!item.period && !item.rate && item.periodRate) {
            const split = splitPeriodRate(item.periodRate);
            return { ...item, period: split.period, rate: split.rate };
          }
          return {
            ...item,
            period: item.period ?? '',
            rate: item.rate ?? '',
          };
        });

        const autoList = (parsed.autoList || INITIAL_DEALER_CONDITION.autoList).map((item: any) => {
          if (!item.period && !item.rate && item.periodRate) {
            const split = splitPeriodRate(item.periodRate);
            return { ...item, period: split.period, rate: split.rate };
          }
          return {
            ...item,
            period: item.period ?? '',
            rate: item.rate ?? '',
          };
        });

        return {
          ...INITIAL_DEALER_CONDITION,
          ...parsed,
          directList,
          autoList,
          autoLoanNotes: parsed.autoLoanNotes || DEFAULT_AUTO_LOAN_NOTES,
          directBadges: { ...INITIAL_DEALER_CONDITION.directBadges, ...(parsed.directBadges || {}) },
          autoBadges: { ...INITIAL_DEALER_CONDITION.autoBadges, ...(parsed.autoBadges || {}) },
          lumpSum: {
            nh: { ...INITIAL_DEALER_CONDITION.lumpSum.nh, ...(parsed.lumpSum?.nh || {}) },
            lotte: { ...INITIAL_DEALER_CONDITION.lumpSum.lotte, ...(parsed.lumpSum?.lotte || {}) },
            woori: { ...INITIAL_DEALER_CONDITION.lumpSum.woori, ...(parsed.lumpSum?.woori || {}) },
            shinhan: { ...INITIAL_DEALER_CONDITION.lumpSum.shinhan, ...(parsed.lumpSum?.shinhan || {}) },
            hana: {
              amt: parsed.lumpSum?.hana?.amt ?? INITIAL_DEALER_CONDITION.lumpSum.hana.amt,
              rates: Array.isArray(parsed.lumpSum?.hana?.rates) ? parsed.lumpSum.hana.rates : INITIAL_DEALER_CONDITION.lumpSum.hana.rates,
              notes: Array.isArray(parsed.lumpSum?.hana?.notes) ? parsed.lumpSum.hana.notes : INITIAL_DEALER_CONDITION.lumpSum.hana.notes,
            },
            kb: {
              cust: parsed.lumpSum?.kb?.cust ?? INITIAL_DEALER_CONDITION.lumpSum.kb.cust,
              tiers: Array.isArray(parsed.lumpSum?.kb?.tiers) ? parsed.lumpSum.kb.tiers : INITIAL_DEALER_CONDITION.lumpSum.kb.tiers,
              notes: Array.isArray(parsed.lumpSum?.kb?.notes) ? parsed.lumpSum.kb.notes : INITIAL_DEALER_CONDITION.lumpSum.kb.notes,
            },
          },
        };
      }
    } catch {
      // ignore
    }
    return INITIAL_DEALER_CONDITION;
  });

  // 커스텀 스타일 (글자크기, 글자색 등)
  const [styles, setStyles] = useState<DealerConditionStyles>(() => {
    try {
      const saved = localStorage.getItem(STYLES_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_CONDITION_STYLES, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_CONDITION_STYLES;
  });

  // 커스텀 로고 이미지 상태 (Base64 data URLs)
  const [customLogos, setCustomLogos] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(LOGO_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {};
  });

  // 커스텀 로고 개별 크기 배율 (%)
  const [customLogoScales, setCustomLogoScales] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(LOGO_SCALES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {};
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState<'basic' | 'lumpSum' | 'corporate' | 'direct' | 'auto' | 'styles'>('basic');
  const [savedToast, setSavedToast] = useState('');
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [selectedBrandForUpload, setSelectedBrandForUpload] = useState<string>('');
  
  // 창 크기에 따른 전체화면 100% 자동 맞춤 배율 계산 상태
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [autoScaleFactor, setAutoScaleFactor] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // 창 크기 변화에 맞춰 1540px 고정 캔버스가 왜곡 없이 100% 전체 너비에 딱 맞게 자동 스케일링
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth - 16; // 약간의 패딩 버퍼
      if (containerWidth > 0) {
        const factor = Math.min(1.4, Math.max(0.35, containerWidth / CANVAS_NATIVE_WIDTH));
        setAutoScaleFactor(factor);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const effectiveScale = isAutoFit ? autoScaleFactor : zoomLevel / 100;

  const saveToStorage = (newData: DealerConditionState) => {
    const cloned = JSON.parse(JSON.stringify(newData));
    setData(cloned);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cloned));
    } catch {
      // ignore
    }
  };

  const saveStylesToStorage = (newStyles: DealerConditionStyles) => {
    setStyles(newStyles);
    try {
      localStorage.setItem(STYLES_STORAGE_KEY, JSON.stringify(newStyles));
    } catch {
      // ignore
    }
  };

  const saveCustomLogo = (brandKey: string, base64Url: string) => {
    const updated = { ...customLogos, [brandKey]: base64Url };
    setCustomLogos(updated);
    try {
      localStorage.setItem(LOGO_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast(`${brandKey} 로고 이미지가 성공적으로 적용되었습니다.`);
  };

  const saveCustomLogoScale = (brandKey: string, scale: number) => {
    const updated = { ...customLogoScales, [brandKey]: scale };
    setCustomLogoScales(updated);
    try {
      localStorage.setItem(LOGO_SCALES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const removeCustomLogo = (brandKey: string) => {
    const updated = { ...customLogos };
    delete updated[brandKey];
    setCustomLogos(updated);
    const updatedScales = { ...customLogoScales };
    delete updatedScales[brandKey];
    setCustomLogoScales(updatedScales);
    try {
      localStorage.setItem(LOGO_STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(LOGO_SCALES_STORAGE_KEY, JSON.stringify(updatedScales));
    } catch {
      // ignore
    }
    showToast(`${brandKey} 로고를 기본값으로 복원했습니다.`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetBrand?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const brand = targetBrand || selectedBrandForUpload;
    if (!brand) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        saveCustomLogo(brand, event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    if (e.target) e.target.value = '';
  };

  const showToast = (msg: string) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(''), 3000);
  };

  const handleReset = () => {
    if (window.confirm('기본 조건표 데이터 및 스타일을 초기화하시겠습니까?')) {
      setData(INITIAL_DEALER_CONDITION);
      setStyles(DEFAULT_CONDITION_STYLES);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STYLES_STORAGE_KEY);
      showToast('초기 조건표 데이터로 복원되었습니다.');
    }
  };

  const handleResetAllLogos = () => {
    if (window.confirm('모든 카드사 로고 이미지 및 크기 조절 설정을 기본값으로 초기화하시겠습니까?')) {
      setCustomLogos({});
      setCustomLogoScales({});
      localStorage.removeItem(LOGO_STORAGE_KEY);
      localStorage.removeItem(LOGO_SCALES_STORAGE_KEY);
      showToast('모든 로고 이미지 및 크기 배율이 초기화되었습니다.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const openLogoUpload = (brandKey: string) => {
    setSelectedBrandForUpload(brandKey);
    setIsLogoModalOpen(true);
  };

  // 법인 캐시백 추가 & 삭제
  const addCorporateRow = () => {
    const newItem: CorporateItem = {
      name: '현대카드',
      cust: '1.2%',
      inc: '0.3%',
      note: '5백만원 이상',
    };
    const updated = { ...data, corporate: [...data.corporate, newItem] };
    saveToStorage(updated);
    showToast('법인 캐시백 행이 추가되었습니다.');
  };

  const removeCorporateRow = (index: number) => {
    const updated = {
      ...data,
      corporate: data.corporate.filter((_, i) => i !== index),
    };
    saveToStorage(updated);
    showToast('법인 캐시백 행이 삭제되었습니다.');
  };

  // 다이렉트 / 오토 항목 추가 & 삭제
  const addDirectRow = () => {
    const newItem: DirectItem = {
      brand: '롯데카드',
      type: '다이렉트',
      downPayment: '선수0%\n(무선수)',
      period: '12개월\n24개월\n36개월\n48개월\n60개월',
      rate: '3.8%\n3.9%\n4.0%\n4.1%\n4.2%',
      periodRate: '12 : 3.8%\n24 : 3.9%\n36 : 4.0%\n48 : 4.1%\n60 : 4.2%',
      incentive: '0.8%',
      note: '신차 전차종',
    };
    const updated = { ...data, directList: [...data.directList, newItem] };
    saveToStorage(updated);
    showToast('다이렉트 할부 행이 추가되었습니다.');
  };

  const removeDirectRow = (index: number) => {
    const updated = {
      ...data,
      directList: data.directList.filter((_, i) => i !== index),
    };
    saveToStorage(updated);
    showToast('다이렉트 할부 행이 삭제되었습니다.');
  };

  const addAutoRow = () => {
    const newItem: AutoItem = {
      brand: '하나은행',
      type: '오토할부',
      downPaymentRate: '무선수',
      period: '36~59개월\n60~119개월\n120개월',
      rate: '변동 (2.0%)\n변동 (2.2%)\n변동 (2.4%)',
      periodRate: '36~59 : 변동 (2.0%)\n60~119 : 변동 (2.2%)\n120 : 변동 (2.4%)',
      incentive: '2.0~\n2.4%',
      note: '은행계좌 개설필수',
    };
    const updated = { ...data, autoList: [...data.autoList, newItem] };
    saveToStorage(updated);
    showToast('오토 할부 행이 추가되었습니다.');
  };

  const removeAutoRow = (index: number) => {
    const updated = {
      ...data,
      autoList: data.autoList.filter((_, i) => i !== index),
    };
    saveToStorage(updated);
    showToast('오토 할부 행이 삭제되었습니다.');
  };

  // 오토할부 참고사항 추가/수정/삭제
  const addAutoLoanNote = () => {
    const currentNotes = data.autoLoanNotes || DEFAULT_AUTO_LOAN_NOTES;
    const updatedNotes = [...currentNotes, '새 참고사항 내용을 입력하세요.'];
    saveToStorage({ ...data, autoLoanNotes: updatedNotes });
    showToast('새 참고사항 항목이 추가되었습니다.');
  };

  const updateAutoLoanNote = (index: number, text: string) => {
    const currentNotes = [...(data.autoLoanNotes || DEFAULT_AUTO_LOAN_NOTES)];
    currentNotes[index] = text;
    saveToStorage({ ...data, autoLoanNotes: currentNotes });
  };

  const removeAutoLoanNote = (index: number) => {
    const currentNotes = (data.autoLoanNotes || DEFAULT_AUTO_LOAN_NOTES).filter((_, i) => i !== index);
    saveToStorage({ ...data, autoLoanNotes: currentNotes });
    showToast('참고사항 항목이 삭제되었습니다.');
  };

  // 1. 일시불 - 하나카드 요율/비고 관리
  const addHanaRate = () => {
    const currentRates = data.lumpSum.hana.rates || [];
    const updated = {
      ...data,
      lumpSum: {
        ...data.lumpSum,
        hana: {
          ...data.lumpSum.hana,
          rates: [...currentRates, { type: '신규카드', cust: '1.2%', inc: '0.3%' }],
        },
      },
    };
    saveToStorage(updated);
    showToast('하나카드 요율 행이 추가되었습니다.');
  };

  const updateHanaRate = (index: number, field: 'type' | 'cust' | 'inc', value: string) => {
    const currentRates = [...(data.lumpSum.hana.rates || [])];
    if (currentRates[index]) {
      currentRates[index] = { ...currentRates[index], [field]: value };
      const updated = {
        ...data,
        lumpSum: {
          ...data.lumpSum,
          hana: {
            ...data.lumpSum.hana,
            rates: currentRates,
          },
        },
      };
      saveToStorage(updated);
    }
  };

  const removeHanaRate = (index: number) => {
    const currentRates = (data.lumpSum.hana.rates || []).filter((_, i) => i !== index);
    const updated = {
      ...data,
      lumpSum: {
        ...data.lumpSum,
        hana: {
          ...data.lumpSum.hana,
          rates: currentRates,
        },
      },
    };
    saveToStorage(updated);
    showToast('하나카드 요율 행이 삭제되었습니다.');
  };

  const addHanaNote = () => {
    const currentNotes = data.lumpSum.hana.notes || [];
    const updated = {
      ...data,
      lumpSum: {
        ...data.lumpSum,
        hana: {
          ...data.lumpSum.hana,
          notes: [...currentNotes, '새 비고 내용'],
        },
      },
    };
    saveToStorage(updated);
    showToast('하나카드 비고 항목이 추가되었습니다.');
  };

  const updateHanaNote = (index: number, text: string) => {
    const currentNotes = [...(data.lumpSum.hana.notes || [])];
    currentNotes[index] = text;
    const updated = {
      ...data,
      lumpSum: {
        ...data.lumpSum,
        hana: {
          ...data.lumpSum.hana,
          notes: currentNotes,
        },
      },
    };
    saveToStorage(updated);
  };

  const removeHanaNote = (index: number) => {
    const currentNotes = (data.lumpSum.hana.notes || []).filter((_, i) => i !== index);
    const updated = {
      ...data,
      lumpSum: {
        ...data.lumpSum,
        hana: {
          ...data.lumpSum.hana,
          notes: currentNotes,
        },
      },
    };
    saveToStorage(updated);
    showToast('하나카드 비고 항목이 삭제되었습니다.');
  };

  // 1. 일시불 - KB국민카드 구간/비고 관리
  const addKBTier = () => {
    const currentTiers = data.lumpSum.kb.tiers || [];
    const updated = {
      ...data,
      lumpSum: {
        ...data.lumpSum,
        kb: {
          ...data.lumpSum.kb,
          tiers: [...currentTiers, { amt: '1천이상', inc: '0.4%' }],
        },
      },
    };
    saveToStorage(updated);
    showToast('KB국민카드 구간이 추가되었습니다.');
  };

  const updateKBTier = (index: number, field: 'amt' | 'inc', value: string) => {
    const currentTiers = [...(data.lumpSum.kb.tiers || [])];
    if (currentTiers[index]) {
      currentTiers[index] = { ...currentTiers[index], [field]: value };
      const updated = {
        ...data,
        lumpSum: {
          ...data.lumpSum,
          kb: {
            ...data.lumpSum.kb,
            tiers: currentTiers,
          },
        },
      };
      saveToStorage(updated);
    }
  };

  const removeKBTier = (index: number) => {
    const currentTiers = (data.lumpSum.kb.tiers || []).filter((_, i) => i !== index);
    const updated = {
      ...data,
      lumpSum: {
        ...data.lumpSum,
        kb: {
          ...data.lumpSum.kb,
          tiers: currentTiers,
        },
      },
    };
    saveToStorage(updated);
    showToast('KB국민카드 구간이 삭제되었습니다.');
  };

  const addKBNote = () => {
    const currentNotes = data.lumpSum.kb.notes || [];
    const updated = {
      ...data,
      lumpSum: {
        ...data.lumpSum,
        kb: {
          ...data.lumpSum.kb,
          notes: [...currentNotes, '새 비고 내용'],
        },
      },
    };
    saveToStorage(updated);
    showToast('KB국민카드 비고 항목이 추가되었습니다.');
  };

  const updateKBNote = (index: number, text: string) => {
    const currentNotes = [...(data.lumpSum.kb.notes || [])];
    currentNotes[index] = text;
    const updated = {
      ...data,
      lumpSum: {
        ...data.lumpSum,
        kb: {
          ...data.lumpSum.kb,
          notes: currentNotes,
        },
      },
    };
    saveToStorage(updated);
  };

  const removeKBNote = (index: number) => {
    const currentNotes = (data.lumpSum.kb.notes || []).filter((_, i) => i !== index);
    const updated = {
      ...data,
      lumpSum: {
        ...data.lumpSum,
        kb: {
          ...data.lumpSum.kb,
          notes: currentNotes,
        },
      },
    };
    saveToStorage(updated);
    showToast('KB국민카드 비고 항목이 삭제되었습니다.');
  };

  const BRAND_LIST = [
    { key: '롯데카드', name: '롯데카드', desc: '다이렉트 / 저금리 / 일시불' },
    { key: 'KB국민카드', name: 'KB국민카드', desc: '다이렉트 / 일시불' },
    { key: '우리카드', name: '우리카드', desc: '다이렉트 / 저금리 / 일시불' },
    { key: '하나카드', name: '하나카드', desc: '다이렉트 / 일시불' },
    { key: '하나은행', name: '하나은행', desc: '오토할부 (은행할부)' },
    { key: '신한카드', name: '신한카드', desc: '다이렉트 / 일시불 / 법인' },
    { key: '농협카드', name: 'NH농협카드', desc: '일시불 / 법인' },
  ];

  return (
    <div className="space-y-4 w-full" ref={containerRef}>
      {/* Hidden Global File Input for fast upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e)}
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        className="hidden"
      />

      {/* Top Action Toolbar */}
      <div className="flex items-center justify-between bg-white px-4 sm:px-5 py-3 rounded-xl border border-slate-200/80 shadow-xs flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h2 className="text-base font-bold text-slate-800">
              신차구매 통합 조건표 (딜러 전송용)
            </h2>
          </div>
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium hidden sm:inline">
            {isAutoFit ? `창 크기 전체화면 자동맞춤 (${Math.round(autoScaleFactor * 100)}%)` : `고정 배율 (${zoomLevel}%)`}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Auto-fit Toggle & Zoom controls */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setIsAutoFit(true)}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                isAutoFit ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="어떤 모니터/창 크기에서든 100% 한 화면에 딱 맞게 자동 조절"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>창 크기 자동맞춤</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAutoFit(false);
                setZoomLevel(100);
              }}
              className={`px-2 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1 ${
                !isAutoFit ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="100% 원본 고정 배율"
            >
              <span>고정</span>
            </button>
          </div>

          {!isAutoFit && (
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.max(50, prev - 10))}
                className="p-1 hover:bg-slate-200 rounded text-slate-700 cursor-pointer transition-colors"
                title="축소"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-slate-700 min-w-[36px] text-center">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.min(150, prev + 10))}
                className="p-1 hover:bg-slate-200 rounded text-slate-700 cursor-pointer transition-colors"
                title="확대"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Logo Upload Modal Trigger */}
          <button
            id="btn-open-logo-modal"
            type="button"
            onClick={() => {
              setSelectedBrandForUpload(BRAND_LIST[0].key);
              setIsLogoModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95"
            title="카드사 로고 이미지 직접 업로드/교체"
          >
            <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span>로고 이미지 등록</span>
          </button>

          {/* Edit Button */}
          {isEditing ? (
            <button
              id="btn-save-condition-matrix"
              type="button"
              onClick={() => {
                setIsEditing(false);
                showToast('조건표 수정 내용이 모두 안전하게 저장되었습니다.');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>수정 완료 (저장)</span>
            </button>
          ) : (
            <button
              id="btn-edit-condition-matrix-exact"
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95"
            >
              <Edit3 className="w-4 h-4" />
              <span>조건표 수정 (내용/글자크기/색상)</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 cursor-pointer transition-all active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>인쇄</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg text-xs font-medium border border-slate-300 cursor-pointer transition-all"
            title="조건표 텍스트 & 스타일 기본값으로 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>초기화</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 상세 수정 컨트롤 패널 (isEditing 상태일 때 상단에 펼쳐짐) */}
      {/* ========================================================================= */}
      {isEditing && (
        <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-top-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-base text-white">조건표 종합 편집 패널</h3>
              <span className="text-xs text-slate-400 ml-2">
                상품명, 개월수, 인센티브, 비고, 글자 크기, 글자 색상을 원하는 대로 수정할 수 있습니다.
              </span>
            </div>
            {/* Tab navigation in edit panel */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-xs flex-wrap">
              <button
                type="button"
                onClick={() => setActiveEditTab('basic')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeEditTab === 'basic' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                기본 정보 & 참고사항
              </button>
              <button
                type="button"
                onClick={() => setActiveEditTab('lumpSum')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeEditTab === 'lumpSum' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                일시불 캐시백
              </button>
              <button
                type="button"
                onClick={() => setActiveEditTab('corporate')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeEditTab === 'corporate' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                법인 캐시백 ({data.corporate.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveEditTab('direct')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeEditTab === 'direct' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                다이렉트 할부 ({data.directList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveEditTab('auto')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeEditTab === 'auto' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                오토 할부 ({data.autoList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveEditTab('styles')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeEditTab === 'styles' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>글자 크기 & 색상 설정</span>
              </button>
            </div>
          </div>

          {/* TAB 1: 기본 정보 & 참고사항 수정 */}
          {activeEditTab === 'basic' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">기준년월</label>
                  <input
                    type="text"
                    value={data.titleYearMonth}
                    onChange={(e) => saveToStorage({ ...data, titleYearMonth: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">제목 텍스트</label>
                  <input
                    type="text"
                    value={data.titleSuffix}
                    onChange={(e) => saveToStorage({ ...data, titleSuffix: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">우측 상단 배지</label>
                  <input
                    type="text"
                    value={data.exclusiveBadge}
                    onChange={(e) => saveToStorage({ ...data, exclusiveBadge: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">기준일자 공지 문구</label>
                  <input
                    type="text"
                    value={data.baseDateNotice}
                    onChange={(e) => saveToStorage({ ...data, baseDateNotice: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* 오토할부 하단 참고사항 수정 목록 */}
              <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                    <span>* 오토할부 (하나은행) 하단 참고사항 항목 관리</span>
                  </span>
                  <button
                    type="button"
                    onClick={addAutoLoanNote}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[11px] font-bold cursor-pointer transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    <span>참고사항 줄 추가</span>
                  </button>
                </div>
                <div className="space-y-1.5">
                  {(data.autoLoanNotes || DEFAULT_AUTO_LOAN_NOTES).map((note, nIdx) => (
                    <div key={nIdx} className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold shrink-0 text-xs">•</span>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => updateAutoLoanNote(nIdx, e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeAutoLoanNote(nIdx)}
                        className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                        title="이 줄 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 일시불 캐시백 상세 편집 */}
          {activeEditTab === 'lumpSum' && (
            <div className="space-y-4 text-xs max-h-[460px] overflow-y-auto pr-1">
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/80 flex items-center justify-between text-slate-300">
                <span>카드사별 일시불 캐시백 요율, 인센티브, 구간 조건 및 비고 사항을 실시간으로 편집할 수 있습니다.</span>
                <span className="text-[11px] text-blue-400 font-medium">수정 즉시 조건표 및 문구에 반영됩니다</span>
              </div>

              {/* 1. NH농협카드 */}
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-3">
                <div className="font-bold text-emerald-400 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>NH농협카드 일시불 (2구간 구조)</span>
                  </span>
                </div>

                {/* 1구간 */}
                <div className="bg-slate-900/70 p-2.5 rounded-lg border border-slate-750 space-y-1.5">
                  <div className="text-[11px] font-bold text-emerald-300">1구간 설정</div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">금액조건</label>
                      <input
                        type="text"
                        value={data.lumpSum.nh.tier1_amt}
                        onChange={(e) => {
                          const updated = {
                            ...data,
                            lumpSum: {
                              ...data.lumpSum,
                              nh: { ...data.lumpSum.nh, tier1_amt: e.target.value },
                            },
                          };
                          saveToStorage(updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">고객캐시백</label>
                      <input
                        type="text"
                        value={data.lumpSum.nh.tier1_cust}
                        onChange={(e) => {
                          const updated = {
                            ...data,
                            lumpSum: {
                              ...data.lumpSum,
                              nh: { ...data.lumpSum.nh, tier1_cust: e.target.value },
                            },
                          };
                          saveToStorage(updated);
                        }}
                        onBlur={(e) => {
                          const updated = {
                            ...data,
                            lumpSum: {
                              ...data.lumpSum,
                              nh: { ...data.lumpSum.nh, tier1_cust: formatPercentValue(e.target.value) },
                            },
                          };
                          saveToStorage(updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-red-400 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">인센</label>
                      <input
                        type="text"
                        value={data.lumpSum.nh.tier1_inc}
                        onChange={(e) => {
                          const updated = {
                            ...data,
                            lumpSum: {
                              ...data.lumpSum,
                              nh: { ...data.lumpSum.nh, tier1_inc: e.target.value },
                            },
                          };
                          saveToStorage(updated);
                        }}
                        onBlur={(e) => {
                          const updated = {
                            ...data,
                            lumpSum: {
                              ...data.lumpSum,
                              nh: { ...data.lumpSum.nh, tier1_inc: formatPercentValue(e.target.value) },
                            },
                          };
                          saveToStorage(updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-blue-400 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">비고</label>
                      <input
                        type="text"
                        value={data.lumpSum.nh.tier1_note}
                        onChange={(e) => {
                          const updated = {
                            ...data,
                            lumpSum: {
                              ...data.lumpSum,
                              nh: { ...data.lumpSum.nh, tier1_note: e.target.value },
                            },
                          };
                          saveToStorage(updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 2구간 */}
                <div className="bg-slate-900/70 p-2.5 rounded-lg border border-slate-750 space-y-1.5">
                  <div className="text-[11px] font-bold text-emerald-300">2구간 설정</div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">금액조건</label>
                      <input
                        type="text"
                        value={data.lumpSum.nh.tier2_amt}
                        onChange={(e) => {
                          const updated = {
                            ...data,
                            lumpSum: {
                              ...data.lumpSum,
                              nh: { ...data.lumpSum.nh, tier2_amt: e.target.value },
                            },
                          };
                          saveToStorage(updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">고객캐시백</label>
                      <input
                        type="text"
                        value={data.lumpSum.nh.tier2_cust}
                        onChange={(e) => {
                          const updated = {
                            ...data,
                            lumpSum: {
                              ...data.lumpSum,
                              nh: { ...data.lumpSum.nh, tier2_cust: e.target.value },
                            },
                          };
                          saveToStorage(updated);
                        }}
                        onBlur={(e) => {
                          const updated = {
                            ...data,
                            lumpSum: {
                              ...data.lumpSum,
                              nh: { ...data.lumpSum.nh, tier2_cust: formatPercentValue(e.target.value) },
                            },
                          };
                          saveToStorage(updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-red-400 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">인센</label>
                      <input
                        type="text"
                        value={data.lumpSum.nh.tier2_inc}
                        onChange={(e) => {
                          const updated = {
                            ...data,
                            lumpSum: {
                              ...data.lumpSum,
                              nh: { ...data.lumpSum.nh, tier2_inc: e.target.value },
                            },
                          };
                          saveToStorage(updated);
                        }}
                        onBlur={(e) => {
                          const updated = {
                            ...data,
                            lumpSum: {
                              ...data.lumpSum,
                              nh: { ...data.lumpSum.nh, tier2_inc: formatPercentValue(e.target.value) },
                            },
                          };
                          saveToStorage(updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-blue-400 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">비고</label>
                      <input
                        type="text"
                        value={data.lumpSum.nh.tier2_note}
                        onChange={(e) => {
                          const updated = {
                            ...data,
                            lumpSum: {
                              ...data.lumpSum,
                              nh: { ...data.lumpSum.nh, tier2_note: e.target.value },
                            },
                          };
                          saveToStorage(updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 롯데카드 */}
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2.5">
                <div className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>롯데카드 일시불</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 bg-slate-900/70 p-2.5 rounded-lg border border-slate-750">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">금액조건</label>
                    <input
                      type="text"
                      value={data.lumpSum.lotte.amt}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            lotte: { ...data.lumpSum.lotte, amt: e.target.value },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">고객캐시백</label>
                    <input
                      type="text"
                      value={data.lumpSum.lotte.cust}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            lotte: { ...data.lumpSum.lotte, cust: e.target.value },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      onBlur={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            lotte: { ...data.lumpSum.lotte, cust: formatPercentValue(e.target.value) },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-red-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">인센</label>
                    <input
                      type="text"
                      value={data.lumpSum.lotte.inc}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            lotte: { ...data.lumpSum.lotte, inc: e.target.value },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      onBlur={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            lotte: { ...data.lumpSum.lotte, inc: formatPercentValue(e.target.value) },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-blue-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">기본 비고</label>
                    <input
                      type="text"
                      value={data.lumpSum.lotte.note1}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            lotte: { ...data.lumpSum.lotte, note1: e.target.value },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-amber-400 mb-0.5 font-bold">강조 비고 (빨강/오렌지)</label>
                    <input
                      type="text"
                      value={data.lumpSum.lotte.note2Highlight}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            lotte: { ...data.lumpSum.lotte, note2Highlight: e.target.value },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-950 border border-amber-600/60 rounded px-2 py-1 text-amber-300 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* 3. 우리카드 */}
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2.5">
                <div className="font-bold text-sky-400 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>우리카드 일시불</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-900/70 p-2.5 rounded-lg border border-slate-750">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">금액조건</label>
                    <input
                      type="text"
                      value={data.lumpSum.woori.amt}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            woori: { ...data.lumpSum.woori, amt: e.target.value },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">고객캐시백</label>
                    <input
                      type="text"
                      value={data.lumpSum.woori.cust}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            woori: { ...data.lumpSum.woori, cust: e.target.value },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      onBlur={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            woori: { ...data.lumpSum.woori, cust: formatPercentValue(e.target.value) },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-red-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">인센</label>
                    <input
                      type="text"
                      value={data.lumpSum.woori.inc}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            woori: { ...data.lumpSum.woori, inc: e.target.value },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      onBlur={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            woori: { ...data.lumpSum.woori, inc: formatPercentValue(e.target.value) },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-blue-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">비고 (줄바꿈 가능)</label>
                    <input
                      type="text"
                      value={data.lumpSum.woori.note}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            woori: { ...data.lumpSum.woori, note: e.target.value },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* 4. 신한카드 */}
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2.5">
                <div className="font-bold text-indigo-400 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span>신한카드 일시불</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 bg-slate-900/70 p-2.5 rounded-lg border border-slate-750">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">금액조건</label>
                    <input
                      type="text"
                      value={data.lumpSum.shinhan.amt}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            shinhan: { ...data.lumpSum.shinhan, amt: e.target.value },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">고객캐시백</label>
                    <input
                      type="text"
                      value={data.lumpSum.shinhan.cust}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            shinhan: { ...data.lumpSum.shinhan, cust: e.target.value },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      onBlur={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            shinhan: { ...data.lumpSum.shinhan, cust: formatPercentValue(e.target.value) },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-red-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-blue-300 mb-0.5">신규 인센</label>
                    <input
                      type="text"
                      value={data.lumpSum.shinhan.incNew}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            shinhan: { ...data.lumpSum.shinhan, incNew: e.target.value },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      onBlur={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            shinhan: { ...data.lumpSum.shinhan, incNew: formatPercentValue(e.target.value) },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-blue-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">기존 인센</label>
                    <input
                      type="text"
                      value={data.lumpSum.shinhan.incExist}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            shinhan: { ...data.lumpSum.shinhan, incExist: e.target.value },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      onBlur={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            shinhan: { ...data.lumpSum.shinhan, incExist: formatPercentValue(e.target.value) },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">비고 1</label>
                    <input
                      type="text"
                      value={data.lumpSum.shinhan.note1}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            shinhan: { ...data.lumpSum.shinhan, note1: e.target.value },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">비고 2</label>
                    <input
                      type="text"
                      value={data.lumpSum.shinhan.note2}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            shinhan: { ...data.lumpSum.shinhan, note2: e.target.value },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* 5. 하나카드 */}
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-teal-400 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    <span>하나카드 일시불</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">금액조건:</span>
                    <input
                      type="text"
                      value={data.lumpSum.hana.amt}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            hana: { ...data.lumpSum.hana, amt: e.target.value },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-white font-medium"
                    />
                    <button
                      type="button"
                      onClick={addHanaRate}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-teal-700 hover:bg-teal-600 text-white rounded text-[10.5px] font-bold cursor-pointer transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>요율 행 추가</span>
                    </button>
                  </div>
                </div>

                {/* 상품별 요율 목록 */}
                <div className="space-y-1.5">
                  <div className="text-[10.5px] text-slate-400 font-bold">카드 상품별 고객캐시백 및 인센</div>
                  {(data.lumpSum.hana.rates || []).map((rate, rIdx) => (
                    <div key={rIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-900/70 p-2 rounded-lg items-center">
                      <div className="sm:col-span-5">
                        <label className="block text-[9.5px] text-slate-400 mb-0.5">카드/상품 구분</label>
                        <input
                          type="text"
                          value={rate.type}
                          onChange={(e) => updateHanaRate(rIdx, 'type', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-medium"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[9.5px] text-slate-400 mb-0.5">고객캐시백</label>
                        <input
                          type="text"
                          value={rate.cust}
                          onChange={(e) => updateHanaRate(rIdx, 'cust', e.target.value)}
                          onBlur={(e) => updateHanaRate(rIdx, 'cust', formatPercentValue(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-red-400 font-bold"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[9.5px] text-slate-400 mb-0.5">인센</label>
                        <input
                          type="text"
                          value={rate.inc}
                          onChange={(e) => updateHanaRate(rIdx, 'inc', e.target.value)}
                          onBlur={(e) => updateHanaRate(rIdx, 'inc', formatPercentValue(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-blue-400 font-bold"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeHanaRate(rIdx)}
                          className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 비고 목록 */}
                <div className="space-y-1.5 pt-1 border-t border-slate-750">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] text-slate-400 font-bold">비고 내용 목록</span>
                    <button
                      type="button"
                      onClick={addHanaNote}
                      className="text-[10.5px] text-teal-400 hover:text-teal-300 font-bold cursor-pointer"
                    >
                      + 비고 줄 추가
                    </button>
                  </div>
                  {(data.lumpSum.hana.notes || []).map((note, nIdx) => (
                    <div key={nIdx} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => updateHanaNote(nIdx, e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => removeHanaNote(nIdx)}
                        className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. KB국민카드 */}
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-yellow-400 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span>KB국민카드 일시불</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">기본 고객캐시백:</span>
                    <input
                      type="text"
                      value={data.lumpSum.kb.cust}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            kb: { ...data.lumpSum.kb, cust: e.target.value },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      onBlur={(e) => {
                        const updated = {
                          ...data,
                          lumpSum: {
                            ...data.lumpSum,
                            kb: { ...data.lumpSum.kb, cust: formatPercentValue(e.target.value) },
                          },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-red-400 font-bold"
                    />
                    <button
                      type="button"
                      onClick={addKBTier}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-600 text-white rounded text-[10.5px] font-bold cursor-pointer transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>인센 구간 추가</span>
                    </button>
                  </div>
                </div>

                {/* 구간별 인센티브 목록 */}
                <div className="space-y-1.5">
                  <div className="text-[10.5px] text-slate-400 font-bold">금액 구간별 인센 요율</div>
                  {(data.lumpSum.kb.tiers || []).map((tier, tIdx) => (
                    <div key={tIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-900/70 p-2 rounded-lg items-center">
                      <div className="sm:col-span-6">
                        <label className="block text-[9.5px] text-slate-400 mb-0.5">금액 구간</label>
                        <input
                          type="text"
                          value={tier.amt}
                          onChange={(e) => updateKBTier(tIdx, 'amt', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-medium"
                        />
                      </div>
                      <div className="sm:col-span-5">
                        <label className="block text-[9.5px] text-slate-400 mb-0.5">인센</label>
                        <input
                          type="text"
                          value={tier.inc}
                          onChange={(e) => updateKBTier(tIdx, 'inc', e.target.value)}
                          onBlur={(e) => updateKBTier(tIdx, 'inc', formatPercentValue(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-blue-400 font-bold"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeKBTier(tIdx)}
                          className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 비고 목록 */}
                <div className="space-y-1.5 pt-1 border-t border-slate-750">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] text-slate-400 font-bold">비고 내용 목록</span>
                    <button
                      type="button"
                      onClick={addKBNote}
                      className="text-[10.5px] text-yellow-400 hover:text-yellow-300 font-bold cursor-pointer"
                    >
                      + 비고 줄 추가
                    </button>
                  </div>
                  {(data.lumpSum.kb.notes || []).map((note, nIdx) => (
                    <div key={nIdx} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => updateKBNote(nIdx, e.target.value)}
                        className="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => removeKBNote(nIdx)}
                        className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 법인 캐시백 수정 */}
          {activeEditTab === 'corporate' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  법인(카드사) 캐시백 목록의 카드사명, 고객캐시백, 인센, 비고를 편집하세요.
                </span>
                <button
                  type="button"
                  onClick={addCorporateRow}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>새 법인 카드사 추가</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {data.corporate.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-12 gap-2 items-center text-xs"
                  >
                    <div className="col-span-3">
                      <label className="block text-[10px] text-slate-400 mb-0.5">카드사명</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const list = [...data.corporate];
                          list[idx] = { ...list[idx], name: e.target.value };
                          saveToStorage({ ...data, corporate: list });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-bold"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-0.5">고객캐시백</label>
                      <input
                        type="text"
                        value={item.cust}
                        onChange={(e) => {
                          const list = [...data.corporate];
                          list[idx] = { ...list[idx], cust: e.target.value };
                          saveToStorage({ ...data, corporate: list });
                        }}
                        onBlur={(e) => {
                          const list = [...data.corporate];
                          list[idx] = { ...list[idx], cust: formatPercentValue(e.target.value) };
                          saveToStorage({ ...data, corporate: list });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-red-400 font-bold"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-0.5">인센</label>
                      <input
                        type="text"
                        value={item.inc}
                        onChange={(e) => {
                          const list = [...data.corporate];
                          list[idx] = { ...list[idx], inc: e.target.value };
                          saveToStorage({ ...data, corporate: list });
                        }}
                        onBlur={(e) => {
                          const list = [...data.corporate];
                          list[idx] = { ...list[idx], inc: formatPercentValue(e.target.value) };
                          saveToStorage({ ...data, corporate: list });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-blue-400 font-bold"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="block text-[10px] text-slate-400 mb-0.5">비고</label>
                      <input
                        type="text"
                        value={item.note}
                        onChange={(e) => {
                          const list = [...data.corporate];
                          list[idx] = { ...list[idx], note: e.target.value };
                          saveToStorage({ ...data, corporate: list });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => removeCorporateRow(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded cursor-pointer"
                        title="행 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: 다이렉트 할부 목록 수정 (상품명, 개월수/금리, 인센, 비고, 행 추가/삭제) */}
          {activeEditTab === 'direct' && (
            <div className="space-y-3">
              {/* 상단 뱃지 3개 편집 */}
              <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>다이렉트 할부 상단 뱃지 문구</span>
                  <span className="text-[10.5px] text-slate-400 font-normal">비워두면 표시되지 않습니다</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] text-rose-400 mb-0.5 font-bold">뱃지 1 (강조/핑크)</label>
                    <input
                      type="text"
                      value={data.directBadges?.badge1 ?? ''}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          directBadges: { ...data.directBadges, badge1: e.target.value },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-rose-300 font-bold"
                      placeholder="예: 대출기록 無"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-rose-400 mb-0.5 font-bold">뱃지 2 (강조/핑크)</label>
                    <input
                      type="text"
                      value={data.directBadges?.badge2 ?? ''}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          directBadges: { ...data.directBadges, badge2: e.target.value },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-rose-300 font-bold"
                      placeholder="예: 중도상환수수료 無"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">뱃지 3 (일반/그레이)</label>
                    <input
                      type="text"
                      value={data.directBadges?.badge3 ?? ''}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          directBadges: { ...data.directBadges, badge3: e.target.value },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      placeholder="예: 원금균등상환"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  다이렉트 할부 상품의 카드사, 상품구분, 선수조건, 개월별 금리, 인센티브, 비고를 편집하세요.
                </span>
                <button
                  type="button"
                  onClick={addDirectRow}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>새 다이렉트 상품 추가</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {data.directList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-2 items-start text-xs"
                  >
                    {/* 카드사 */}
                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-0.5">카드사명</label>
                      <input
                        type="text"
                        value={item.brand}
                        onChange={(e) => {
                          const list = [...data.directList];
                          list[idx] = { ...list[idx], brand: e.target.value };
                          saveToStorage({ ...data, directList: list });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-bold"
                      />
                    </div>
                    {/* 구분 */}
                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-0.5">구분 / 선수조건</label>
                      <textarea
                        rows={3}
                        value={item.downPayment}
                        onChange={(e) => {
                          const list = [...data.directList];
                          list[idx] = { ...list[idx], downPayment: e.target.value };
                          saveToStorage({ ...data, directList: list });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    {/* 개월수 */}
                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-0.5">개월수 (줄바꿈 가능)</label>
                      <textarea
                        rows={3}
                        value={item.period ?? ''}
                        onChange={(e) => {
                          const list = [...data.directList];
                          list[idx] = { ...list[idx], period: e.target.value };
                          saveToStorage({ ...data, directList: list });
                        }}
                        placeholder="12개월&#10;24개월..."
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono text-[11px]"
                      />
                    </div>
                    {/* 금리 */}
                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-0.5">금리 (줄바꿈 가능)</label>
                      <textarea
                        rows={3}
                        value={item.rate ?? ''}
                        onChange={(e) => {
                          const list = [...data.directList];
                          list[idx] = { ...list[idx], rate: e.target.value };
                          saveToStorage({ ...data, directList: list });
                        }}
                        placeholder="3.8%&#10;3.9%..."
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-emerald-300 font-mono text-[11px] font-bold"
                      />
                    </div>
                    {/* 인센티브 */}
                    <div className="col-span-1">
                      <label className="block text-[10px] text-slate-400 mb-0.5">인센</label>
                      <textarea
                        rows={3}
                        value={item.incentive}
                        onChange={(e) => {
                          const list = [...data.directList];
                          list[idx] = { ...list[idx], incentive: e.target.value };
                          saveToStorage({ ...data, directList: list });
                        }}
                        onBlur={(e) => {
                          const list = [...data.directList];
                          list[idx] = { ...list[idx], incentive: formatPercentValue(e.target.value) };
                          saveToStorage({ ...data, directList: list });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-blue-400 font-bold text-[11px]"
                      />
                    </div>
                    {/* 비고 */}
                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-0.5">비고 / 특이사항</label>
                      <textarea
                        rows={3}
                        value={item.note}
                        onChange={(e) => {
                          const list = [...data.directList];
                          list[idx] = { ...list[idx], note: e.target.value };
                          saveToStorage({ ...data, directList: list });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    {/* 삭제 */}
                    <div className="col-span-1 flex justify-end pt-5">
                      <button
                        type="button"
                        onClick={() => removeDirectRow(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded cursor-pointer"
                        title="행 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: 오토 할부 목록 수정 */}
          {activeEditTab === 'auto' && (
            <div className="space-y-3">
              {/* 상단 뱃지 3개 편집 */}
              <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>오토 할부 상단 뱃지 문구</span>
                  <span className="text-[10.5px] text-slate-400 font-normal">비워두면 표시되지 않습니다</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] text-rose-400 mb-0.5 font-bold">뱃지 1 (강조/핑크)</label>
                    <input
                      type="text"
                      value={data.autoBadges?.badge1 ?? ''}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          autoBadges: { ...data.autoBadges, badge1: e.target.value },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-rose-300 font-bold"
                      placeholder="예: DSR 1억원 한도"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-rose-400 mb-0.5 font-bold">뱃지 2 (강조/핑크)</label>
                    <input
                      type="text"
                      value={data.autoBadges?.badge2 ?? ''}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          autoBadges: { ...data.autoBadges, badge2: e.target.value },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-rose-300 font-bold"
                      placeholder="예: 은행 저금리"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">뱃지 3 (일반/그레이)</label>
                    <input
                      type="text"
                      value={data.autoBadges?.badge3 ?? ''}
                      onChange={(e) => {
                        const updated = {
                          ...data,
                          autoBadges: { ...data.autoBadges, badge3: e.target.value },
                        };
                        saveToStorage(updated);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                      placeholder="예: 최장 120개월"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  오토(은행) 할부 상품의 은행/금융사명, 구분, 개월별 금리, 인센, 비고를 편집하세요.
                </span>
                <button
                  type="button"
                  onClick={addAutoRow}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>새 오토 상품 추가</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {data.autoList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-2 items-start text-xs"
                  >
                    {/* 금융사 */}
                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-0.5">금융사명</label>
                      <input
                        type="text"
                        value={item.brand}
                        onChange={(e) => {
                          const list = [...data.autoList];
                          list[idx] = { ...list[idx], brand: e.target.value };
                          saveToStorage({ ...data, autoList: list });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-bold"
                      />
                    </div>
                    {/* 구분 */}
                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-0.5">구분 (줄바꿈 가능)</label>
                      <textarea
                        rows={3}
                        value={item.downPaymentRate}
                        onChange={(e) => {
                          const list = [...data.autoList];
                          list[idx] = { ...list[idx], downPaymentRate: e.target.value };
                          saveToStorage({ ...data, autoList: list });
                        }}
                        placeholder="무관&#10;10% 이상..."
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    {/* 개월수 */}
                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-0.5">개월수 (줄바꿈 가능)</label>
                      <textarea
                        rows={3}
                        value={item.period ?? ''}
                        onChange={(e) => {
                          const list = [...data.autoList];
                          list[idx] = { ...list[idx], period: e.target.value };
                          saveToStorage({ ...data, autoList: list });
                        }}
                        placeholder="36~59개월&#10;60~119개월..."
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono text-[11px]"
                      />
                    </div>
                    {/* 금리 */}
                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-0.5">금리 (줄바꿈 가능)</label>
                      <textarea
                        rows={3}
                        value={item.rate ?? ''}
                        onChange={(e) => {
                          const list = [...data.autoList];
                          list[idx] = { ...list[idx], rate: e.target.value };
                          saveToStorage({ ...data, autoList: list });
                        }}
                        placeholder="변동 (2.0%)&#10;변동 (2.2%)..."
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-emerald-300 font-mono text-[11px] font-bold"
                      />
                    </div>
                    {/* 인센티브 */}
                    <div className="col-span-1">
                      <label className="block text-[10px] text-slate-400 mb-0.5">인센</label>
                      <textarea
                        rows={3}
                        value={item.incentive}
                        onChange={(e) => {
                          const list = [...data.autoList];
                          list[idx] = { ...list[idx], incentive: e.target.value };
                          saveToStorage({ ...data, autoList: list });
                        }}
                        onBlur={(e) => {
                          const list = [...data.autoList];
                          list[idx] = { ...list[idx], incentive: formatPercentValue(e.target.value) };
                          saveToStorage({ ...data, autoList: list });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-blue-400 font-bold text-[11px]"
                      />
                    </div>
                    {/* 비고 */}
                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-0.5">비고 / 특이사항</label>
                      <textarea
                        rows={3}
                        value={item.note}
                        onChange={(e) => {
                          const list = [...data.autoList];
                          list[idx] = { ...list[idx], note: e.target.value };
                          saveToStorage({ ...data, autoList: list });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                    {/* 삭제 */}
                    <div className="col-span-1 flex justify-end pt-5">
                      <button
                        type="button"
                        onClick={() => removeAutoRow(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded cursor-pointer"
                        title="행 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: 글자 크기 & 글자 색상 스타일 설정 */}
          {activeEditTab === 'styles' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs bg-slate-800/80 p-4 rounded-xl border border-slate-700">
              {/* 메인 타이틀 크기 */}
              <div>
                <label className="block text-slate-400 mb-1.5 flex items-center gap-1 font-bold">
                  <Type className="w-3.5 h-3.5 text-blue-400" />
                  <span>타이틀 글자 크기</span>
                </label>
                <select
                  value={styles.headerFontSize}
                  onChange={(e) => saveStylesToStorage({ ...styles, headerFontSize: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-blue-500"
                >
                  <option value="26px">작게 (26px)</option>
                  <option value="30px">보통 (30px - 기본)</option>
                  <option value="34px">크게 (34px)</option>
                  <option value="38px">아주 크게 (38px)</option>
                </select>
              </div>

              {/* 본문 폰트 크기 */}
              <div>
                <label className="block text-slate-400 mb-1.5 flex items-center gap-1 font-bold">
                  <Type className="w-3.5 h-3.5 text-blue-400" />
                  <span>테이블 본문 글자 크기</span>
                </label>
                <select
                  value={styles.tableBodyFontSize}
                  onChange={(e) => saveStylesToStorage({ ...styles, tableBodyFontSize: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-blue-500"
                >
                  <option value="11px">11px (오밀조밀)</option>
                  <option value="12px">12px (표준 기본)</option>
                  <option value="13px">13px (시원하게)</option>
                  <option value="14px">14px (크고 또렷하게)</option>
                </select>
              </div>

              {/* 고객 금리/캐시백 강조 색상 */}
              <div>
                <label className="block text-slate-400 mb-1.5 flex items-center gap-1 font-bold">
                  <Palette className="w-3.5 h-3.5 text-blue-400" />
                  <span>고객 혜택/금리 색상</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.customerRateColor}
                    onChange={(e) => saveStylesToStorage({ ...styles, customerRateColor: e.target.value })}
                    className="w-9 h-9 rounded cursor-pointer border border-slate-700 bg-transparent"
                  />
                  <input
                    type="text"
                    value={styles.customerRateColor}
                    onChange={(e) => saveStylesToStorage({ ...styles, customerRateColor: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono uppercase"
                  />
                </div>
              </div>

              {/* 인센티브 강조 색상 */}
              <div>
                <label className="block text-slate-400 mb-1.5 flex items-center gap-1 font-bold">
                  <Palette className="w-3.5 h-3.5 text-blue-400" />
                  <span>인센티브 글자 색상</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.incentiveRateColor}
                    onChange={(e) => saveStylesToStorage({ ...styles, incentiveRateColor: e.target.value })}
                    className="w-9 h-9 rounded cursor-pointer border border-slate-700 bg-transparent"
                  />
                  <input
                    type="text"
                    value={styles.incentiveRateColor}
                    onChange={(e) => saveStylesToStorage({ ...styles, incentiveRateColor: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono uppercase"
                  />
                </div>
              </div>

              {/* 비고 글자 크기 */}
              <div>
                <label className="block text-slate-400 mb-1.5 flex items-center gap-1 font-bold">
                  <Type className="w-3.5 h-3.5 text-blue-400" />
                  <span>비고 글자 크기</span>
                </label>
                <select
                  value={styles.noteFontSize}
                  onChange={(e) => saveStylesToStorage({ ...styles, noteFontSize: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-blue-500"
                >
                  <option value="9.5px">9.5px</option>
                  <option value="10.5px">10.5px (기본)</option>
                  <option value="11.5px">11.5px</option>
                  <option value="12.5px">12.5px</option>
                </select>
              </div>

              {/* 비고 글자 색상 */}
              <div>
                <label className="block text-slate-400 mb-1.5 flex items-center gap-1 font-bold">
                  <Palette className="w-3.5 h-3.5 text-blue-400" />
                  <span>비고 글자 색상</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.noteColor}
                    onChange={(e) => saveStylesToStorage({ ...styles, noteColor: e.target.value })}
                    className="w-9 h-9 rounded cursor-pointer border border-slate-700 bg-transparent"
                  />
                  <input
                    type="text"
                    value={styles.noteColor}
                    onChange={(e) => saveStylesToStorage({ ...styles, noteColor: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono uppercase"
                  />
                </div>
              </div>

              {/* 특이사항 강조 색상 */}
              <div>
                <label className="block text-slate-400 mb-1.5 flex items-center gap-1 font-bold">
                  <Palette className="w-3.5 h-3.5 text-rose-400" />
                  <span>특별강조/선착순 색상</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.highlightColor}
                    onChange={(e) => saveStylesToStorage({ ...styles, highlightColor: e.target.value })}
                    className="w-9 h-9 rounded cursor-pointer border border-slate-700 bg-transparent"
                  />
                  <input
                    type="text"
                    value={styles.highlightColor}
                    onChange={(e) => saveStylesToStorage({ ...styles, highlightColor: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono uppercase"
                  />
                </div>
              </div>

              {/* 카드사 로고 기준 크기 */}
              <div>
                <label className="block text-slate-400 mb-1.5 flex items-center gap-1 font-bold">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>카드사 로고 크기 (통일 규격)</span>
                </label>
                <select
                  value={styles.logoSize || 20}
                  onChange={(e) => saveStylesToStorage({ ...styles, logoSize: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-blue-500"
                >
                  <option value={18}>18px (컴팩트)</option>
                  <option value={20}>20px (표준 기본)</option>
                  <option value={22}>22px (약간 크게)</option>
                  <option value={24}>24px (크고 시원하게)</option>
                  <option value={26}>26px (최대 강조)</option>
                </select>
              </div>

              {/* 스타일 초기화 */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => saveStylesToStorage(DEFAULT_CONDITION_STYLES)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 hover:text-white font-bold cursor-pointer transition-all"
                >
                  기본 스타일로 초기화
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 backdrop-blur-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 딜러 전송용 B2B DEALER EXCLUSIVE 통합 조건표 (어느 화면이든 100% 전체화면 핏) */}
      {/* ========================================================================= */}
      <div className="w-full overflow-x-auto pb-8 flex justify-center">
        <div
          style={{
            width: isAutoFit ? `${CANVAS_NATIVE_WIDTH * autoScaleFactor}px` : `${CANVAS_NATIVE_WIDTH * (zoomLevel / 100)}px`,
            maxWidth: '100%',
          }}
          className="transition-all"
        >
          <div
            ref={printRef}
            id="dealer-condition-matrix-canvas"
            className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-xs overflow-hidden select-text relative p-7 sm:p-9"
            style={{
              width: `${CANVAS_NATIVE_WIDTH}px`,
              minWidth: `${CANVAS_NATIVE_WIDTH}px`,
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top left',
              fontFamily: '"Noto Sans KR", "Malgun Gothic", "맑은 고딕", -apple-system, sans-serif',
            }}
          >
            {/* Header Title Section */}
            <div className="flex items-end justify-between pb-2 mb-2 flex-wrap gap-2">
              {/* Left Title */}
              <div className="flex items-baseline gap-2">
                {isEditing ? (
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <input
                      type="text"
                      value={data.titleYearMonth}
                      onChange={(e) => saveToStorage({ ...data, titleYearMonth: e.target.value })}
                      style={{ fontSize: styles.headerFontSize }}
                      className="font-black text-blue-600 border-b-2 border-blue-500 bg-yellow-50 px-1 w-44"
                    />
                    <input
                      type="text"
                      value={data.titleSuffix}
                      onChange={(e) => saveToStorage({ ...data, titleSuffix: e.target.value })}
                      style={{ fontSize: styles.headerFontSize }}
                      className="font-black text-slate-900 border-b-2 border-blue-500 bg-yellow-50 px-1 w-80"
                    />
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2 sm:gap-2.5 flex-wrap">
                    <span
                      style={{ fontSize: styles.headerFontSize }}
                      className="font-black text-blue-600 tracking-tight"
                    >
                      {data.titleYearMonth}
                    </span>
                    <span
                      style={{ fontSize: styles.headerFontSize }}
                      className="font-black text-slate-900 tracking-tight"
                    >
                      {data.titleSuffix}
                    </span>
                  </div>
                )}
              </div>

              {/* Right Subtitle & Notice */}
              <div className="text-right">
                <div className="text-xs sm:text-[13px] font-extrabold text-slate-600 tracking-wider">
                  {data.exclusiveBadge}
                </div>
                <div className="text-[10px] sm:text-[11.5px] font-medium text-slate-500 mt-0.5">
                  {data.baseDateNotice}
                </div>
              </div>
            </div>

            {/* Solid Top Accent Divider */}
            <div className="w-full h-[3.5px] bg-blue-600 mb-5 sm:mb-6 rounded-full" />

            {/* ========================================================================= */}
            {/* 가로 3분할 그리드 (일시불 / 다이렉트 할부 / 오토 할부) */}
            {/* ========================================================================= */}
            <div className="grid grid-cols-3 gap-6 items-start">
              {/* ===================================================================== */}
              {/* COLUMN 1 : 일시불 결제 조건 & 법인 캐시백 */}
              {/* ===================================================================== */}
              <div className="space-y-6">
                {/* 일시불 결제 조건 섹션 */}
                <div>
                  {/* 섹션 헤더 */}
                  <div className="flex items-center gap-2 mb-2 pb-1 border-b-2 border-slate-800">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <h2 className="text-base sm:text-[17px] font-black text-slate-900 tracking-tight">
                      일시불 결제 조건
                    </h2>
                  </div>

                  {/* 일시불 테이블 */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr
                          className="bg-slate-50/80 text-slate-600 border-y border-slate-300"
                          style={{ fontSize: styles.tableHeadFontSize }}
                        >
                          <th className="py-2 px-1 text-center font-bold w-[114px] whitespace-nowrap">카드사</th>
                          <th className="py-2 px-1 text-center font-bold w-[72px] whitespace-nowrap">금액조건</th>
                          <th className="py-2 px-1 text-center font-bold w-[76px] whitespace-nowrap">고객캐시백</th>
                          <th className="py-2 px-1 text-center font-bold w-[54px] whitespace-nowrap">인센</th>
                          <th className="py-2 px-1.5 text-center font-bold whitespace-nowrap">비고 / 특이사항</th>
                        </tr>
                      </thead>
                      <tbody
                        className="divide-y divide-slate-200 text-slate-800"
                        style={{ fontSize: styles.tableBodyFontSize }}
                      >
                        {/* 농협 */}
                        <tr>
                          <td rowSpan={2} className="text-center bg-white border-r border-slate-100 align-middle py-2 px-1">
                            <div className="flex items-center justify-center">
                              <CardBrandLogo
                                name="NH농협카드"
                                size={styles.logoSize || 20}
                                customLogos={customLogos}
                                customScales={customLogoScales}
                                onUploadClick={openLogoUpload}
                              />
                            </div>
                          </td>
                          <td className="text-center py-2 text-slate-700 font-medium">
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.nh.tier1_amt}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.nh.tier1_amt = e.target.value;
                                  saveToStorage(updated);
                                }}
                                className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1"
                              />
                            ) : (
                              data.lumpSum.nh.tier1_amt
                            )}
                          </td>
                          <td
                            className="text-center py-2 font-black text-[13.5px]"
                            style={{ color: styles.customerRateColor }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.nh.tier1_cust}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.nh.tier1_cust = e.target.value;
                                  saveToStorage(updated);
                                }}
                                onBlur={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.nh.tier1_cust = formatPercentValue(e.target.value);
                                  saveToStorage(updated);
                                }}
                                className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 font-bold"
                              />
                            ) : (
                              data.lumpSum.nh.tier1_cust
                            )}
                          </td>
                          <td
                            className="text-center py-2 font-bold"
                            style={{ color: styles.incentiveRateColor }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.nh.tier1_inc}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.nh.tier1_inc = e.target.value;
                                  saveToStorage(updated);
                                }}
                                onBlur={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.nh.tier1_inc = formatPercentValue(e.target.value);
                                  saveToStorage(updated);
                                }}
                                className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1"
                              />
                            ) : (
                              data.lumpSum.nh.tier1_inc
                            )}
                          </td>
                          <td
                            className="py-2 px-2 leading-tight"
                            style={{ fontSize: styles.noteFontSize, color: styles.noteColor }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.nh.tier1_note}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.nh.tier1_note = e.target.value;
                                  saveToStorage(updated);
                                }}
                                className="w-full bg-yellow-50 border border-slate-300 rounded px-1"
                              />
                            ) : (
                              data.lumpSum.nh.tier1_note
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-center py-2 text-slate-700 font-medium border-t border-slate-100">
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.nh.tier2_amt}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.nh.tier2_amt = e.target.value;
                                  saveToStorage(updated);
                                }}
                                className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1"
                              />
                            ) : (
                              data.lumpSum.nh.tier2_amt
                            )}
                          </td>
                          <td
                            className="text-center py-2 font-black text-[13.5px] border-t border-slate-100"
                            style={{ color: styles.customerRateColor }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.nh.tier2_cust}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.nh.tier2_cust = e.target.value;
                                  saveToStorage(updated);
                                }}
                                onBlur={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.nh.tier2_cust = formatPercentValue(e.target.value);
                                  saveToStorage(updated);
                                }}
                                className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 font-bold"
                              />
                            ) : (
                              data.lumpSum.nh.tier2_cust
                            )}
                          </td>
                          <td
                            className="text-center py-2 font-bold border-t border-slate-100"
                            style={{ color: styles.incentiveRateColor }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.nh.tier2_inc}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.nh.tier2_inc = e.target.value;
                                  saveToStorage(updated);
                                }}
                                onBlur={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.nh.tier2_inc = formatPercentValue(e.target.value);
                                  saveToStorage(updated);
                                }}
                                className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1"
                              />
                            ) : (
                              data.lumpSum.nh.tier2_inc
                            )}
                          </td>
                          <td
                            className="py-2 px-2 leading-tight border-t border-slate-100"
                            style={{ fontSize: styles.noteFontSize, color: styles.noteColor }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.nh.tier2_note}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.nh.tier2_note = e.target.value;
                                  saveToStorage(updated);
                                }}
                                className="w-full bg-yellow-50 border border-slate-300 rounded px-1"
                              />
                            ) : (
                              data.lumpSum.nh.tier2_note
                            )}
                          </td>
                        </tr>

                        {/* 롯데 */}
                        <tr>
                          <td className="text-center bg-white border-r border-slate-100 align-middle py-2.5 px-1">
                            <div className="flex items-center justify-center">
                              <CardBrandLogo
                                name="롯데카드"
                                size={styles.logoSize || 20}
                                customLogos={customLogos}
                                customScales={customLogoScales}
                                onUploadClick={openLogoUpload}
                              />
                            </div>
                          </td>
                          <td className="text-center py-2 text-slate-700 font-medium">
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.lotte.amt}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.lotte.amt = e.target.value;
                                  saveToStorage(updated);
                                }}
                                className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1"
                              />
                            ) : (
                              data.lumpSum.lotte.amt
                            )}
                          </td>
                          <td
                            className="text-center py-2 font-black text-[13.5px]"
                            style={{ color: styles.customerRateColor }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.lotte.cust}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.lotte.cust = e.target.value;
                                  saveToStorage(updated);
                                }}
                                onBlur={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.lotte.cust = formatPercentValue(e.target.value);
                                  saveToStorage(updated);
                                }}
                                className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 font-bold"
                              />
                            ) : (
                              data.lumpSum.lotte.cust
                            )}
                          </td>
                          <td
                            className="text-center py-2 font-bold"
                            style={{ color: styles.incentiveRateColor }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.lotte.inc}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.lotte.inc = e.target.value;
                                  saveToStorage(updated);
                                }}
                                onBlur={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.lotte.inc = formatPercentValue(e.target.value);
                                  saveToStorage(updated);
                                }}
                                className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1"
                              />
                            ) : (
                              data.lumpSum.lotte.inc
                            )}
                          </td>
                          <td
                            className="py-2 px-2 leading-tight"
                            style={{ fontSize: styles.noteFontSize, color: styles.noteColor }}
                          >
                            {isEditing ? (
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  value={data.lumpSum.lotte.note1}
                                  onChange={(e) => {
                                    const updated = { ...data };
                                    updated.lumpSum.lotte.note1 = e.target.value;
                                    saveToStorage(updated);
                                  }}
                                  className="w-full bg-yellow-50 border border-slate-300 rounded px-1 text-[11px]"
                                  placeholder="기본 비고"
                                />
                                <input
                                  type="text"
                                  value={data.lumpSum.lotte.note2Highlight}
                                  onChange={(e) => {
                                    const updated = { ...data };
                                    updated.lumpSum.lotte.note2Highlight = e.target.value;
                                    saveToStorage(updated);
                                  }}
                                  className="w-full bg-yellow-50 border border-rose-300 rounded px-1 text-[11px] font-bold text-rose-600"
                                  placeholder="강조 비고"
                                />
                              </div>
                            ) : (
                              <>
                                <div>{data.lumpSum.lotte.note1}</div>
                                <div
                                  className="font-bold mt-0.5"
                                  style={{ color: styles.highlightColor }}
                                >
                                  {data.lumpSum.lotte.note2Highlight}
                                </div>
                              </>
                            )}
                          </td>
                        </tr>

                        {/* 우리 */}
                        <tr>
                          <td className="text-center bg-white border-r border-slate-100 align-middle py-2.5 px-1">
                            <div className="flex items-center justify-center">
                              <CardBrandLogo
                                name="우리카드"
                                size={styles.logoSize || 20}
                                customLogos={customLogos}
                                customScales={customLogoScales}
                                onUploadClick={openLogoUpload}
                              />
                            </div>
                          </td>
                          <td className="text-center py-2 text-slate-700 font-medium">
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.woori.amt}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.woori.amt = e.target.value;
                                  saveToStorage(updated);
                                }}
                                className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1"
                              />
                            ) : (
                              data.lumpSum.woori.amt
                            )}
                          </td>
                          <td
                            className="text-center py-2 font-black text-[13.5px]"
                            style={{ color: styles.customerRateColor }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.woori.cust}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.woori.cust = e.target.value;
                                  saveToStorage(updated);
                                }}
                                onBlur={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.woori.cust = formatPercentValue(e.target.value);
                                  saveToStorage(updated);
                                }}
                                className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 font-bold"
                              />
                            ) : (
                              data.lumpSum.woori.cust
                            )}
                          </td>
                          <td
                            className="text-center py-2 font-bold"
                            style={{ color: styles.incentiveRateColor }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.woori.inc}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.woori.inc = e.target.value;
                                  saveToStorage(updated);
                                }}
                                onBlur={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.woori.inc = formatPercentValue(e.target.value);
                                  saveToStorage(updated);
                                }}
                                className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1"
                              />
                            ) : (
                              data.lumpSum.woori.inc
                            )}
                          </td>
                          <td
                            className="py-2 px-2 leading-tight whitespace-pre-line"
                            style={{ fontSize: styles.noteFontSize, color: styles.noteColor }}
                          >
                            {isEditing ? (
                              <textarea
                                rows={2}
                                value={data.lumpSum.woori.note}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.woori.note = e.target.value;
                                  saveToStorage(updated);
                                }}
                                className="w-full bg-yellow-50 border border-slate-300 rounded px-1 text-[11px]"
                              />
                            ) : (
                              data.lumpSum.woori.note
                            )}
                          </td>
                        </tr>

                        {/* 신한 */}
                        <tr>
                          <td className="text-center bg-white border-r border-slate-100 align-middle py-2.5 px-1">
                            <div className="flex items-center justify-center">
                              <CardBrandLogo
                                name="신한카드"
                                size={styles.logoSize || 20}
                                customLogos={customLogos}
                                customScales={customLogoScales}
                                onUploadClick={openLogoUpload}
                              />
                            </div>
                          </td>
                          <td className="text-center py-2 text-slate-700 font-medium">
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.shinhan.amt}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.shinhan.amt = e.target.value;
                                  saveToStorage(updated);
                                }}
                                className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1"
                              />
                            ) : (
                              data.lumpSum.shinhan.amt
                            )}
                          </td>
                          <td
                            className="text-center py-2 font-black text-[13.5px]"
                            style={{ color: styles.customerRateColor }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.shinhan.cust}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.shinhan.cust = e.target.value;
                                  saveToStorage(updated);
                                }}
                                className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 font-bold"
                              />
                            ) : (
                              data.lumpSum.shinhan.cust
                            )}
                          </td>
                          <td className="text-center py-2 text-[11.5px] leading-tight">
                            {isEditing ? (
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  value={data.lumpSum.shinhan.incNew}
                                  onChange={(e) => {
                                    const updated = { ...data };
                                    updated.lumpSum.shinhan.incNew = e.target.value;
                                    saveToStorage(updated);
                                  }}
                                  className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 text-[11px] font-bold text-blue-600"
                                  placeholder="신규 인센"
                                />
                                <input
                                  type="text"
                                  value={data.lumpSum.shinhan.incExist}
                                  onChange={(e) => {
                                    const updated = { ...data };
                                    updated.lumpSum.shinhan.incExist = e.target.value;
                                    saveToStorage(updated);
                                  }}
                                  className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 text-[10.5px] text-slate-600"
                                  placeholder="기존 인센"
                                />
                              </div>
                            ) : (
                              <>
                                <div className="font-bold" style={{ color: styles.incentiveRateColor }}>
                                  {data.lumpSum.shinhan.incNew}
                                </div>
                                <div className="text-slate-500 text-[10.5px]">
                                  {data.lumpSum.shinhan.incExist}
                                </div>
                              </>
                            )}
                          </td>
                          <td
                            className="py-2 px-2 leading-tight"
                            style={{ fontSize: styles.noteFontSize, color: styles.noteColor }}
                          >
                            {isEditing ? (
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  value={data.lumpSum.shinhan.note1}
                                  onChange={(e) => {
                                    const updated = { ...data };
                                    updated.lumpSum.shinhan.note1 = e.target.value;
                                    saveToStorage(updated);
                                  }}
                                  className="w-full bg-yellow-50 border border-slate-300 rounded px-1 text-[11px]"
                                  placeholder="비고 1"
                                />
                                <input
                                  type="text"
                                  value={data.lumpSum.shinhan.note2}
                                  onChange={(e) => {
                                    const updated = { ...data };
                                    updated.lumpSum.shinhan.note2 = e.target.value;
                                    saveToStorage(updated);
                                  }}
                                  className="w-full bg-yellow-50 border border-slate-300 rounded px-1 text-[11px] text-slate-600"
                                  placeholder="비고 2"
                                />
                              </div>
                            ) : (
                              <>
                                <div>{data.lumpSum.shinhan.note1}</div>
                                <div className="text-slate-500 mt-0.5">
                                  {data.lumpSum.shinhan.note2}
                                </div>
                              </>
                            )}
                          </td>
                        </tr>

                        {/* 하나 */}
                        <tr>
                          <td className="text-center bg-white border-r border-slate-100 align-middle py-2.5 px-1">
                            <div className="flex items-center justify-center">
                              <CardBrandLogo
                                name="하나카드"
                                size={styles.logoSize || 20}
                                customLogos={customLogos}
                                customScales={customLogoScales}
                                onUploadClick={openLogoUpload}
                              />
                            </div>
                          </td>
                          <td className="text-center py-2 text-slate-700 font-medium">
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.hana.amt}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.hana.amt = e.target.value;
                                  saveToStorage(updated);
                                }}
                                className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1"
                              />
                            ) : (
                              data.lumpSum.hana.amt
                            )}
                          </td>
                          {/* 고객(%) 컬럼 */}
                          <td className="text-center py-2 px-1 text-[11.5px] leading-snug">
                            {isEditing ? (
                              <div className="space-y-1.5 py-1">
                                {(data.lumpSum.hana.rates || []).map((r, idx) => (
                                  <div key={idx} className="flex flex-col items-center gap-0.5">
                                    <input
                                      type="text"
                                      value={r.type}
                                      onChange={(e) => updateHanaRate(idx, 'type', e.target.value)}
                                      className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-0.5 text-[9.5px]"
                                      placeholder="상품명(선택)"
                                    />
                                    <input
                                      type="text"
                                      value={r.cust}
                                      onChange={(e) => updateHanaRate(idx, 'cust', e.target.value)}
                                      onBlur={(e) => updateHanaRate(idx, 'cust', formatPercentValue(e.target.value))}
                                      className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 font-bold text-red-600 text-[11px]"
                                      placeholder="고객%"
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {(data.lumpSum.hana.rates || []).map((r, idx) => (
                                  <div key={idx} className="py-0.5">
                                    {r.type ? (
                                      <div className="text-[9.5px] text-slate-500 font-medium leading-none mb-0.5">
                                        {r.type}
                                      </div>
                                    ) : null}
                                    <span
                                      className="font-black text-[13.5px]"
                                      style={{ color: styles.customerRateColor }}
                                    >
                                      {r.cust}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                          {/* 인센(%) 컬럼 */}
                          <td className="text-center py-2 px-1 text-[11.5px] leading-snug">
                            {isEditing ? (
                              <div className="space-y-1.5 py-1">
                                {(data.lumpSum.hana.rates || []).map((r, idx) => (
                                  <div key={idx} className="flex items-center justify-center gap-1">
                                    <input
                                      type="text"
                                      value={r.inc}
                                      onChange={(e) => updateHanaRate(idx, 'inc', e.target.value)}
                                      onBlur={(e) => updateHanaRate(idx, 'inc', formatPercentValue(e.target.value))}
                                      className="w-14 text-center bg-yellow-50 border border-slate-300 rounded px-1 font-bold text-blue-600 text-[11px]"
                                      placeholder="인센%"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeHanaRate(idx)}
                                      className="text-slate-400 hover:text-rose-500 px-0.5 text-xs"
                                      title="삭제"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={addHanaRate}
                                  className="text-[10px] text-teal-600 hover:underline font-bold block mx-auto mt-0.5"
                                >
                                  + 요율 추가
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {(data.lumpSum.hana.rates || []).map((r, idx) => (
                                  <div key={idx} className="py-0.5">
                                    {r.type ? (
                                      <div className="text-[9.5px] invisible font-normal leading-none mb-0.5">
                                        &nbsp;
                                      </div>
                                    ) : null}
                                    <span
                                      className="font-bold text-[12.5px]"
                                      style={{ color: styles.incentiveRateColor }}
                                    >
                                      {r.inc}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                          <td
                            className="py-2 px-2 leading-tight"
                            style={{ fontSize: styles.noteFontSize, color: styles.noteColor }}
                          >
                            {isEditing ? (
                              <div className="space-y-1">
                                {(data.lumpSum.hana.notes || []).map((n, idx) => (
                                  <div key={idx} className="flex items-center gap-1">
                                    <input
                                      type="text"
                                      value={n}
                                      onChange={(e) => updateHanaNote(idx, e.target.value)}
                                      className="w-full bg-yellow-50 border border-slate-300 rounded px-1 text-[10.5px]"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeHanaNote(idx)}
                                      className="text-slate-400 hover:text-rose-500 px-0.5"
                                      title="삭제"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={addHanaNote}
                                  className="text-[10px] text-teal-600 hover:underline font-bold"
                                >
                                  + 비고 추가
                                </button>
                              </div>
                            ) : (
                              (data.lumpSum.hana.notes || []).map((n, idx) => (
                                <div key={idx} className="whitespace-pre-line">{n}</div>
                              ))
                            )}
                          </td>
                        </tr>

                        {/* 국민 */}
                        <tr>
                          <td className="text-center bg-white border-r border-slate-100 align-middle py-2.5 px-1">
                            <div className="flex items-center justify-center">
                              <CardBrandLogo
                                name="KB국민카드"
                                size={styles.logoSize || 20}
                                customLogos={customLogos}
                                customScales={customLogoScales}
                                onUploadClick={openLogoUpload}
                              />
                            </div>
                          </td>
                          {/* 금액조건 컬럼 */}
                          <td className="text-center py-2 px-1 text-slate-700 font-medium text-[11.5px] leading-snug">
                            {isEditing ? (
                              <div className="space-y-1 py-1">
                                {(data.lumpSum.kb.tiers || []).map((t, idx) => (
                                  <input
                                    key={idx}
                                    type="text"
                                    value={t.amt}
                                    onChange={(e) => updateKBTier(idx, 'amt', e.target.value)}
                                    className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 text-[11px]"
                                    placeholder="구간금액"
                                  />
                                ))}
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {(data.lumpSum.kb.tiers || []).map((t, idx) => (
                                  <div key={idx} className="py-0.5 text-slate-700">
                                    {t.amt}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                          {/* 고객(%) 컬럼 */}
                          <td
                            className="text-center py-2 px-1 font-black text-[13.5px] align-middle"
                            style={{ color: styles.customerRateColor }}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={data.lumpSum.kb.cust}
                                onChange={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.kb.cust = e.target.value;
                                  saveToStorage(updated);
                                }}
                                onBlur={(e) => {
                                  const updated = { ...data };
                                  updated.lumpSum.kb.cust = formatPercentValue(e.target.value);
                                  saveToStorage(updated);
                                }}
                                className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 font-bold"
                                placeholder="고객%"
                              />
                            ) : (
                              data.lumpSum.kb.cust
                            )}
                          </td>
                          {/* 인센(%) 컬럼 */}
                          <td className="text-center py-2 px-1 text-[11.5px] leading-snug">
                            {isEditing ? (
                              <div className="space-y-1 py-1">
                                {(data.lumpSum.kb.tiers || []).map((t, idx) => (
                                  <div key={idx} className="flex items-center justify-center gap-1">
                                    <input
                                      type="text"
                                      value={t.inc}
                                      onChange={(e) => updateKBTier(idx, 'inc', e.target.value)}
                                      onBlur={(e) => updateKBTier(idx, 'inc', formatPercentValue(e.target.value))}
                                      className="w-14 text-center bg-yellow-50 border border-slate-300 rounded px-1 font-bold text-blue-600 text-[11px]"
                                      placeholder="인센%"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeKBTier(idx)}
                                      className="text-slate-400 hover:text-rose-500 px-0.5 text-xs"
                                      title="삭제"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={addKBTier}
                                  className="text-[10px] text-amber-600 hover:underline font-bold block mx-auto mt-0.5"
                                >
                                  + 구간 추가
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {(data.lumpSum.kb.tiers || []).map((t, idx) => (
                                  <div
                                    key={idx}
                                    className="py-0.5 font-bold"
                                    style={{ color: styles.incentiveRateColor }}
                                  >
                                    {t.inc}
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                          {/* 비고 컬럼 */}
                          <td
                            className="py-2 px-2 leading-tight"
                            style={{ fontSize: styles.noteFontSize, color: styles.noteColor }}
                          >
                            {isEditing ? (
                              <div className="space-y-1">
                                {(data.lumpSum.kb.notes || []).map((n, idx) => (
                                  <div key={idx} className="flex items-center gap-1">
                                    <input
                                      type="text"
                                      value={n}
                                      onChange={(e) => updateKBNote(idx, e.target.value)}
                                      className="w-full bg-yellow-50 border border-slate-300 rounded px-1 text-[10.5px]"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeKBNote(idx)}
                                      className="text-slate-400 hover:text-rose-500 px-0.5"
                                      title="삭제"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={addKBNote}
                                  className="text-[10px] text-yellow-600 hover:underline font-bold"
                                >
                                  + 비고 추가
                                </button>
                              </div>
                            ) : (
                              (data.lumpSum.kb.notes || []).map((n, idx) => (
                                <div key={idx} className="whitespace-pre-line">{n}</div>
                              ))
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 법인 캐시백 섹션 */}
                <div>
                  <div className="flex items-center gap-2 mb-2 pb-1 border-b-2 border-slate-800">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h2 className="text-base sm:text-[17px] font-black text-slate-900 tracking-tight">
                      법인 캐시백
                    </h2>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr
                          className="bg-slate-50/80 text-slate-600 border-y border-slate-300"
                          style={{ fontSize: styles.tableHeadFontSize }}
                        >
                          <th className="py-2 px-1 text-center font-bold w-[114px] whitespace-nowrap">카드사</th>
                          <th className="py-2 px-1 text-center font-bold w-[76px] whitespace-nowrap">고객캐시백</th>
                          <th className="py-2 px-1 text-center font-bold w-[54px] whitespace-nowrap">인센</th>
                          <th className="py-2 px-1.5 text-center font-bold whitespace-nowrap">비고</th>
                        </tr>
                      </thead>
                      <tbody
                        className="divide-y divide-slate-200 text-slate-800"
                        style={{ fontSize: styles.tableBodyFontSize }}
                      >
                        {data.corporate.map((item, idx) => (
                          <tr key={idx}>
                            <td className="text-center py-2.5 px-1 bg-white border-r border-slate-100">
                              <div className="flex items-center justify-center">
                                <CardBrandLogo
                                  name={item.name}
                                  size={styles.logoSize || 20}
                                  customLogos={customLogos}
                                  customScales={customLogoScales}
                                  onUploadClick={openLogoUpload}
                                />
                              </div>
                            </td>
                            <td
                              className="text-center py-2 font-black text-[13.5px]"
                              style={{ color: styles.customerRateColor }}
                            >
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={item.cust}
                                  onChange={(e) => {
                                    const list = [...data.corporate];
                                    list[idx] = { ...list[idx], cust: e.target.value };
                                    saveToStorage({ ...data, corporate: list });
                                  }}
                                  onBlur={(e) => {
                                    const list = [...data.corporate];
                                    list[idx] = { ...list[idx], cust: formatPercentValue(e.target.value) };
                                    saveToStorage({ ...data, corporate: list });
                                  }}
                                  className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 font-bold"
                                />
                              ) : (
                                item.cust
                              )}
                            </td>
                            <td
                              className="text-center py-2 font-bold"
                              style={{ color: styles.incentiveRateColor }}
                            >
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={item.inc}
                                  onChange={(e) => {
                                    const list = [...data.corporate];
                                    list[idx] = { ...list[idx], inc: e.target.value };
                                    saveToStorage({ ...data, corporate: list });
                                  }}
                                  onBlur={(e) => {
                                    const list = [...data.corporate];
                                    list[idx] = { ...list[idx], inc: formatPercentValue(e.target.value) };
                                    saveToStorage({ ...data, corporate: list });
                                  }}
                                  className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 font-bold"
                                />
                              ) : (
                                item.inc
                              )}
                            </td>
                            <td
                              className="py-2 px-2 leading-tight"
                              style={{ fontSize: styles.noteFontSize, color: styles.noteColor }}
                            >
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={item.note}
                                  onChange={(e) => {
                                    const list = [...data.corporate];
                                    list[idx] = { ...list[idx], note: e.target.value };
                                    saveToStorage({ ...data, corporate: list });
                                  }}
                                  className="w-full bg-yellow-50 border border-slate-300 rounded px-1"
                                />
                              ) : (
                                item.note
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* ===================================================================== */}
              {/* COLUMN 2 : 다이렉트 할부 */}
              {/* ===================================================================== */}
              <div>
                {/* 섹션 헤더 & 뱃지 */}
                <div className="flex items-center justify-between mb-2 pb-1 border-b-2 border-slate-800 flex-wrap gap-1">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <h2 className="text-base sm:text-[17px] font-black text-slate-900 tracking-tight">
                      다이렉트 할부
                    </h2>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={data.directBadges?.badge1 ?? ''}
                        onChange={(e) => {
                          const updated = {
                            ...data,
                            directBadges: { ...data.directBadges, badge1: e.target.value },
                          };
                          saveToStorage(updated);
                        }}
                        className="w-20 px-1 py-0.5 bg-yellow-50 text-rose-600 font-bold text-[10px] rounded border border-rose-300 text-center"
                        placeholder="뱃지1"
                      />
                      <input
                        type="text"
                        value={data.directBadges?.badge2 ?? ''}
                        onChange={(e) => {
                          const updated = {
                            ...data,
                            directBadges: { ...data.directBadges, badge2: e.target.value },
                          };
                          saveToStorage(updated);
                        }}
                        className="w-24 px-1 py-0.5 bg-yellow-50 text-rose-600 font-bold text-[10px] rounded border border-rose-300 text-center"
                        placeholder="뱃지2"
                      />
                      <input
                        type="text"
                        value={data.directBadges?.badge3 ?? ''}
                        onChange={(e) => {
                          const updated = {
                            ...data,
                            directBadges: { ...data.directBadges, badge3: e.target.value },
                          };
                          saveToStorage(updated);
                        }}
                        className="w-20 px-1 py-0.5 bg-yellow-50 text-slate-700 font-bold text-[10px] rounded border border-slate-300 text-center"
                        placeholder="뱃지3"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      {data.directBadges?.badge1 ? (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-600 font-bold text-[10.5px] rounded-xs border border-rose-200">
                          {data.directBadges.badge1}
                        </span>
                      ) : null}
                      {data.directBadges?.badge2 ? (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-600 font-bold text-[10.5px] rounded-xs border border-rose-200">
                          {data.directBadges.badge2}
                        </span>
                      ) : null}
                      {data.directBadges?.badge3 ? (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[10.5px] rounded-xs border border-slate-200">
                          {data.directBadges.badge3}
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* 다이렉트 할부 테이블 */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr
                        className="bg-slate-50/80 text-slate-600 border-y border-slate-300"
                        style={{ fontSize: styles.tableHeadFontSize }}
                      >
                        <th className="py-2 px-1 text-center font-bold w-[114px] whitespace-nowrap">상품명</th>
                        <th className="py-2 px-1 text-center font-bold w-[72px] whitespace-nowrap">구분</th>
                        <th className="py-2 px-1 text-center font-bold w-[72px] whitespace-nowrap">개월수</th>
                        <th className="py-2 px-1 text-center font-bold w-[72px] whitespace-nowrap">금리</th>
                        <th className="py-2 px-1 text-center font-bold w-[54px] whitespace-nowrap">인센</th>
                        <th className="py-2 px-1.5 text-center font-bold whitespace-nowrap">비고</th>
                      </tr>
                    </thead>
                    <tbody
                      className="divide-y divide-slate-200 text-slate-800"
                      style={{ fontSize: styles.tableBodyFontSize }}
                    >
                      {data.directList.map((item, idx) => {
                        const fallback = splitPeriodRate(item.periodRate);
                        const displayPeriod = item.period !== undefined ? item.period : fallback.period;
                        const displayRate = item.rate !== undefined ? item.rate : fallback.rate;

                        return (
                          <tr
                            key={idx}
                            className={`${
                              idx === data.directList.length - 1 ? 'border-b border-slate-300' : ''
                            }`}
                          >
                            {/* 상품명 */}
                            <td className="text-center py-2.5 px-1 bg-white whitespace-nowrap">
                              <div className="flex flex-col items-center justify-center">
                                <CardBrandLogo
                                  name={item.brand}
                                  size={styles.logoSize || 20}
                                  customLogos={customLogos}
                                  customScales={customLogoScales}
                                  onUploadClick={openLogoUpload}
                                />
                                {item.type && (
                                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200/60 rounded px-1.5 py-0.5 mt-1 leading-none">
                                    {item.type}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 구분 */}
                            <td className="text-center py-2.5 px-1 text-[11.5px] text-slate-700 font-medium leading-tight whitespace-pre break-keep">
                              {isEditing ? (
                                <textarea
                                  rows={3}
                                  value={item.downPayment}
                                  onChange={(e) => {
                                    const list = [...data.directList];
                                    list[idx] = { ...list[idx], downPayment: e.target.value };
                                    saveToStorage({ ...data, directList: list });
                                  }}
                                  className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 text-[11px]"
                                />
                              ) : (
                                item.downPayment
                              )}
                            </td>

                            {/* 개월수 */}
                            <td className="text-center py-2.5 px-1 text-[11.5px] text-slate-700 font-medium leading-snug whitespace-pre break-keep font-mono">
                              {isEditing ? (
                                <textarea
                                  rows={4}
                                  value={item.period ?? displayPeriod}
                                  onChange={(e) => {
                                    const list = [...data.directList];
                                    list[idx] = { ...list[idx], period: e.target.value };
                                    saveToStorage({ ...data, directList: list });
                                  }}
                                  className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 text-[11px] font-mono"
                                />
                              ) : (
                                displayPeriod
                              )}
                            </td>

                            {/* 금리 */}
                            <td className="text-center py-2.5 px-1 text-[11.5px] leading-snug whitespace-pre break-keep font-bold font-mono">
                              {isEditing ? (
                                <textarea
                                  rows={4}
                                  value={item.rate ?? displayRate}
                                  onChange={(e) => {
                                    const list = [...data.directList];
                                    list[idx] = { ...list[idx], rate: e.target.value };
                                    saveToStorage({ ...data, directList: list });
                                  }}
                                  className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 text-[11px] font-mono font-bold"
                                />
                              ) : (
                                <span
                                  style={{
                                    color: (item.brand.includes('우리') && item.type === '저금리') || item.isHighlight
                                      ? styles.customerRateColor
                                      : 'inherit',
                                  }}
                                >
                                  {displayRate}
                                </span>
                              )}
                            </td>

                            {/* 인센 */}
                            <td className="text-center py-2.5 px-1 whitespace-nowrap">
                              {isEditing ? (
                                <textarea
                                  rows={2}
                                  value={item.incentive}
                                  onChange={(e) => {
                                    const list = [...data.directList];
                                    list[idx] = { ...list[idx], incentive: e.target.value };
                                    saveToStorage({ ...data, directList: list });
                                  }}
                                  onBlur={(e) => {
                                    const list = [...data.directList];
                                    list[idx] = { ...list[idx], incentive: formatPercentValue(e.target.value) };
                                    saveToStorage({ ...data, directList: list });
                                  }}
                                  className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 font-bold text-[11px]"
                                />
                              ) : (
                                <span
                                  className="font-black text-[13px] whitespace-pre-line"
                                  style={{
                                    color: item.isHighlight ? styles.customerRateColor : styles.incentiveRateColor,
                                  }}
                                >
                                  {item.incentive}
                                </span>
                              )}
                            </td>

                            {/* 비고 */}
                            <td
                              className="text-center py-2.5 px-1.5 leading-tight whitespace-pre-line"
                              style={{ fontSize: styles.noteFontSize, color: styles.noteColor }}
                            >
                              {isEditing ? (
                                <textarea
                                  rows={3}
                                  value={item.note}
                                  onChange={(e) => {
                                    const list = [...data.directList];
                                    list[idx] = { ...list[idx], note: e.target.value };
                                    saveToStorage({ ...data, directList: list });
                                  }}
                                  className="w-full bg-yellow-50 border border-slate-300 rounded px-1 text-[10.5px]"
                                />
                              ) : (
                                item.note || '-'
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ===================================================================== */}
              {/* COLUMN 3 : 오토 할부 */}
              {/* ===================================================================== */}
              <div>
                {/* 섹션 헤더 & 뱃지 */}
                <div className="flex items-center justify-between mb-2 pb-1 border-b-2 border-slate-800 flex-wrap gap-1">
                  <div className="flex items-center gap-1.5">
                    <Car className="w-5 h-5 text-blue-600" />
                    <h2 className="text-base sm:text-[17px] font-black text-slate-900 tracking-tight">
                      오토 할부
                    </h2>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={data.autoBadges?.badge1 ?? ''}
                        onChange={(e) => {
                          const updated = {
                            ...data,
                            autoBadges: { ...data.autoBadges, badge1: e.target.value },
                          };
                          saveToStorage(updated);
                        }}
                        className="w-20 px-1 py-0.5 bg-yellow-50 text-rose-600 font-bold text-[10px] rounded border border-rose-300 text-center"
                        placeholder="뱃지1"
                      />
                      <input
                        type="text"
                        value={data.autoBadges?.badge2 ?? ''}
                        onChange={(e) => {
                          const updated = {
                            ...data,
                            autoBadges: { ...data.autoBadges, badge2: e.target.value },
                          };
                          saveToStorage(updated);
                        }}
                        className="w-24 px-1 py-0.5 bg-yellow-50 text-rose-600 font-bold text-[10px] rounded border border-rose-300 text-center"
                        placeholder="뱃지2"
                      />
                      <input
                        type="text"
                        value={data.autoBadges?.badge3 ?? ''}
                        onChange={(e) => {
                          const updated = {
                            ...data,
                            autoBadges: { ...data.autoBadges, badge3: e.target.value },
                          };
                          saveToStorage(updated);
                        }}
                        className="w-20 px-1 py-0.5 bg-yellow-50 text-slate-700 font-bold text-[10px] rounded border border-slate-300 text-center"
                        placeholder="뱃지3"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      {data.autoBadges?.badge1 ? (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-600 font-bold text-[10.5px] rounded-xs border border-rose-200">
                          {data.autoBadges.badge1}
                        </span>
                      ) : null}
                      {data.autoBadges?.badge2 ? (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-600 font-bold text-[10.5px] rounded-xs border border-rose-200">
                          {data.autoBadges.badge2}
                        </span>
                      ) : null}
                      {data.autoBadges?.badge3 ? (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[10.5px] rounded-xs border border-slate-200">
                          {data.autoBadges.badge3}
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* 오토 할부 테이블 */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr
                        className="bg-slate-50/80 text-slate-600 border-y border-slate-300"
                        style={{ fontSize: styles.tableHeadFontSize }}
                      >
                        <th className="py-2 px-1 text-center font-bold w-[114px] whitespace-nowrap">상품명</th>
                        <th className="py-2 px-1 text-center font-bold w-[74px] whitespace-nowrap">구분</th>
                        <th className="py-2 px-1 text-center font-bold w-[74px] whitespace-nowrap">개월수</th>
                        <th className="py-2 px-1 text-center font-bold w-[74px] whitespace-nowrap">금리</th>
                        <th className="py-2 px-1 text-center font-bold w-[54px] whitespace-nowrap">인센</th>
                        <th className="py-2 px-1.5 text-center font-bold whitespace-nowrap">비고</th>
                      </tr>
                    </thead>
                    <tbody
                      className="divide-y divide-slate-200 text-slate-800"
                      style={{ fontSize: styles.tableBodyFontSize }}
                    >
                      {data.autoList.map((item, idx) => {
                        const fallback = splitPeriodRate(item.periodRate);
                        const displayPeriod = item.period !== undefined ? item.period : fallback.period;
                        const displayRate = item.rate !== undefined ? item.rate : fallback.rate;

                        return (
                          <tr
                            key={idx}
                            className={`${
                              idx === data.autoList.length - 1 ? 'border-b border-slate-300' : ''
                            }`}
                          >
                            {/* 상품명 */}
                            <td className="text-center py-2.5 px-1 bg-white whitespace-nowrap">
                              <div className="flex flex-col items-center justify-center">
                                <CardBrandLogo
                                  name={item.brand}
                                  size={styles.logoSize || 20}
                                  customLogos={customLogos}
                                  customScales={customLogoScales}
                                  onUploadClick={openLogoUpload}
                                />
                                {item.type && (
                                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200/60 rounded px-1.5 py-0.5 mt-1 leading-none">
                                    {item.type}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 구분 */}
                            <td className="text-center py-2.5 px-1 text-[11.5px] text-slate-700 font-medium leading-tight whitespace-pre break-keep">
                              {isEditing ? (
                                <textarea
                                  rows={2}
                                  value={item.downPaymentRate}
                                  onChange={(e) => {
                                    const list = [...data.autoList];
                                    list[idx] = { ...list[idx], downPaymentRate: e.target.value };
                                    saveToStorage({ ...data, autoList: list });
                                  }}
                                  className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 text-[11px]"
                                />
                              ) : (
                                item.downPaymentRate
                              )}
                            </td>

                            {/* 개월수 */}
                            <td className="text-center py-2.5 px-1 text-[11.5px] text-slate-700 font-medium leading-snug whitespace-pre break-keep font-mono">
                              {isEditing ? (
                                <textarea
                                  rows={3}
                                  value={item.period ?? displayPeriod}
                                  onChange={(e) => {
                                    const list = [...data.autoList];
                                    list[idx] = { ...list[idx], period: e.target.value };
                                    saveToStorage({ ...data, autoList: list });
                                  }}
                                  className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 text-[11px] font-mono"
                                />
                              ) : (
                                displayPeriod
                              )}
                            </td>

                            {/* 금리 */}
                            <td className="text-center py-2.5 px-1 text-[11.5px] leading-snug whitespace-pre break-keep font-bold font-mono">
                              {isEditing ? (
                                <textarea
                                  rows={3}
                                  value={item.rate ?? displayRate}
                                  onChange={(e) => {
                                    const list = [...data.autoList];
                                    list[idx] = { ...list[idx], rate: e.target.value };
                                    saveToStorage({ ...data, autoList: list });
                                  }}
                                  className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 text-[11px] font-mono font-bold"
                                />
                              ) : (
                                <span
                                  style={{
                                    color: item.isHighlight ? styles.customerRateColor : 'inherit',
                                  }}
                                >
                                  {displayRate}
                                </span>
                              )}
                            </td>

                            {/* 인센 */}
                            <td className="text-center py-2.5 px-1 whitespace-nowrap">
                              {isEditing ? (
                                <textarea
                                  rows={2}
                                  value={item.incentive}
                                  onChange={(e) => {
                                    const list = [...data.autoList];
                                    list[idx] = { ...list[idx], incentive: e.target.value };
                                    saveToStorage({ ...data, autoList: list });
                                  }}
                                  onBlur={(e) => {
                                    const list = [...data.autoList];
                                    list[idx] = { ...list[idx], incentive: formatPercentValue(e.target.value) };
                                    saveToStorage({ ...data, autoList: list });
                                  }}
                                  className="w-full text-center bg-yellow-50 border border-slate-300 rounded px-1 font-bold text-[11px]"
                                />
                              ) : (
                                <span
                                  className="font-black text-[13px] whitespace-pre-line"
                                  style={{
                                    color: item.isHighlight ? styles.customerRateColor : styles.incentiveRateColor,
                                  }}
                                >
                                  {item.incentive}
                                </span>
                              )}
                            </td>

                            {/* 비고 */}
                            <td
                              className="text-center py-2.5 px-1.5 leading-tight whitespace-pre-line"
                              style={{ fontSize: styles.noteFontSize, color: styles.noteColor }}
                            >
                              {isEditing ? (
                                <textarea
                                  rows={3}
                                  value={item.note}
                                  onChange={(e) => {
                                    const list = [...data.autoList];
                                    list[idx] = { ...list[idx], note: e.target.value };
                                    saveToStorage({ ...data, autoList: list });
                                  }}
                                  className="w-full bg-yellow-50 border border-slate-300 rounded px-1 text-[10.5px]"
                                />
                              ) : (
                                item.note || '-'
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 오토할부 하나은행 밑 [참고사항] 안내 박스 (요청사항 반영 & 실시간 수정 지원) */}
                <div className="mt-4 p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-slate-700 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-[12px] text-amber-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
                      <span>[오토할부 참고사항]</span>
                    </span>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={addAutoLoanNote}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10.5px] font-bold cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>참고사항 추가</span>
                      </button>
                    )}
                  </div>
                  <ul className="space-y-1.5 text-[11px] leading-relaxed text-slate-800">
                    {(data.autoLoanNotes || DEFAULT_AUTO_LOAN_NOTES).map((note, noteIdx) => (
                      <li key={noteIdx} className="flex items-start gap-1.5">
                        <span className="text-amber-700 font-bold shrink-0 leading-tight">•</span>
                        {isEditing ? (
                          <div className="flex items-center gap-1 flex-1">
                            <input
                              type="text"
                              value={note}
                              onChange={(e) => updateAutoLoanNote(noteIdx, e.target.value)}
                              className="flex-1 bg-white border border-amber-300 rounded px-2 py-0.5 text-[11px] text-slate-900 font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => removeAutoLoanNote(noteIdx)}
                              className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                              title="삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="font-medium text-slate-800 break-keep">{note}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* Footer Clean Signature Note */}
            {/* ========================================================================= */}
            <div className="mt-8 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  본 조건표는 딜러 전용 프로모션 안내 자료이며, 금융사 정책 및 접수 시점에 따라 사전 예고 없이 변동될 수 있습니다.
                </span>
              </div>
              <div className="font-bold text-slate-400">
                PAGE 1 / 1
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 카드사 로고 이미지 직접 업로드 & 동일 규격 크기 조절 모달 */}
      {/* ========================================================================= */}
      {isLogoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    카드사 로고 관리 & 동일 크기 정렬
                  </h3>
                  <p className="text-xs text-slate-500">
                    이미지 업로드뿐만 아니라 각 로고의 크기(배율)를 조절하여 모든 카드사 로고를 완벽히 똑같은 규격으로 맞출 수 있습니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLogoModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 전체 로고 일체형 규격 비교 박스 */}
            <div className="mb-5 p-3.5 bg-slate-900 rounded-xl text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>실시간 규격 정렬 비교 (모든 로고가 동일한 가로/세로 박스에 배치됩니다)</span>
                </span>
                <span className="text-[11px] text-slate-400">표준 박스: 114 × 32px</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
                {BRAND_LIST.map((b) => (
                  <div key={b.key} className="bg-white rounded-md p-1 flex flex-col items-center justify-center">
                    <div className="text-[9px] text-slate-400 font-bold mb-0.5">{b.name}</div>
                    <CardBrandLogo
                      name={b.key}
                      size={styles.logoSize || 20}
                      customLogos={customLogos}
                      customScales={customLogoScales}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Logo Upload & Scale Adjustment List */}
            <div className="space-y-3">
              {BRAND_LIST.map((brand) => {
                const hasCustom = !!customLogos[brand.key];
                const currentScale = customLogoScales[brand.key] ?? 100;

                return (
                  <div
                    key={brand.key}
                    className="p-3 bg-slate-50 hover:bg-slate-100/90 rounded-xl border border-slate-200 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                      {/* Left: Brand Name & Preview Box */}
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="w-32 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-1 overflow-hidden shadow-2xs">
                          <CardBrandLogo
                            name={brand.key}
                            size={styles.logoSize || 20}
                            customLogos={customLogos}
                            customScales={customLogoScales}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-800">{brand.name}</div>
                          <div className="text-xs text-slate-400">{brand.desc}</div>
                        </div>
                      </div>

                      {/* Right: Upload & Reset Buttons */}
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95">
                          <Upload className="w-3.5 h-3.5" />
                          <span>이미지 업로드</span>
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp, image/svg+xml"
                            onChange={(e) => handleFileUpload(e, brand.key)}
                            className="hidden"
                          />
                        </label>

                        {hasCustom && (
                          <button
                            type="button"
                            onClick={() => removeCustomLogo(brand.key)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-300 hover:border-rose-200 rounded-lg text-xs font-medium cursor-pointer transition-all"
                            title="기본 벡터 로고로 복원"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>기본 복원</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Scale Slider for Equal Sizing */}
                    <div className="flex items-center gap-3 pt-1 border-t border-slate-200/60 text-xs">
                      <span className="text-slate-500 font-medium whitespace-nowrap">
                        크기(배율): <strong className="text-slate-800 font-mono">{currentScale}%</strong>
                      </span>
                      <input
                        type="range"
                        min="60"
                        max="140"
                        step="2"
                        value={currentScale}
                        onChange={(e) => saveCustomLogoScale(brand.key, Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                      />
                      {currentScale !== 100 && (
                        <button
                          type="button"
                          onClick={() => saveCustomLogoScale(brand.key, 100)}
                          className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer whitespace-nowrap underline"
                        >
                          100% 맞춤
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
              <button
                type="button"
                onClick={handleResetAllLogos}
                className="text-xs text-slate-500 hover:text-rose-600 font-medium cursor-pointer transition-all"
              >
                전체 로고 및 크기 설정 초기화
              </button>

              <button
                type="button"
                onClick={() => setIsLogoModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
              >
                설정 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
