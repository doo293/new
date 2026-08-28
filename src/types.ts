export type CardCompany = 
  | '롯데'
  | '하나'
  | '농협'
  | '우리'
  | '국민'
  | '신한'
  | '삼성';

export type ProcessStatus = 
  | '결제준비'
  | '할부완료'
  | '증액완료'
  | '증액대기'
  | '발급완료'
  | '접수완료'
  | '조회중'
  | string;

export type PaymentTypeFilter = 'all' | 'lumpSum' | 'installment' | 'hybrid';

export interface CustomerPaymentData {
  id: string;
  rawLine?: string;
  rowNumber?: string;
  date?: string;
  dateSummary?: string;
  manager?: string; // 담당자 (예: 강희연)
  cardCompany: CardCompany | string; // 카드사 (우리, 국민, 신한 등)
  customerType?: string; // 기존, 신규 등
  dealerInfo?: string; // 대리점/영업사원 (예: 현대 오도원)
  dealerType?: string; // 딜러구분
  affiliation?: string; // 상조회, 제휴 등
  status: ProcessStatus | string; // 할부완료, 증액완료 등
  customerName: string; // 원동경
  maskedName?: string; // 원*경
  agency?: string; // 뉴젠오토
  residentNumber?: string; // 770827-1380711
  phoneNumber?: string; // 010-9103-0260
  carModel?: string; // 쏘나타
  customerSummary?: string;
  paymentAmount: number; // 총 결제금액 (예: 29400000 또는 복합결제 합계 33139000)
  customerCashbackRate?: number; // 고객 캐시백 요율 (예: 1.4%)
  customerCashbackAmount?: number; // 고객 캐시백 금액 (예: 387,324원)
  installmentMonths: string; // 60, 일시불, 36 등
  interestRate?: string; // 4%, 3.9% 등
  commissionRate: number; // 0.4%, 0.6%, 0.9% 등
  commissionAmount: number; // 107012, 255868, 96136 (3.3% 원천징수 후)
  applyTaxWithholding: boolean; // 3.3% 공제 여부 (기본 true)
  cardNumberOption: '직접전달' | string;
  customCardNumber?: string;
  paymentMethodNote: string; // ** 일시불로 결제 부탁드립니다~ or 복합결제 안내
  cardCompanyDirectPayout?: boolean; // 카드사 직지급 수수료 안내 포함 여부 (하나, 우리, 국민 등)
  cardCompanyDirectRate?: number; // 카드사 직지급 요율 (%)
  memo?: string;
  createdAt: number;

  // 은행 및 계좌 정산 정보 (수수료 정산 라인용)
  bankName?: string; // 신협, 카카오뱅크, 신한, 국민 등
  accountNumber?: string; // 137016035002 등
  settlementType?: string; // 딜러인센 등
  productName?: string; // 일시불, 신규 저금리 다이렉트 등

  // 복합 결제 (할부 + 캐시백 일시불 동시 진행 건)
  isHybridPayment?: boolean;
  installmentAmount?: number; // 할부 결제금액 (예: 13,200,000)
  installmentCommissionRate?: number; // 할부 수수료율 (예: 0.3%)
  lumpSumAmount?: number; // 캐시백 일시불 결제금액 (예: 19,939,000)
  lumpSumCommissionRate?: number; // 일시불 수수료율 (예: 0.3%)
}

export type TemplateCategory = '결제준비' | '고객안내' | '수수료정산';

export interface MessageTemplate {
  id: string;
  name: string;
  cardCompany: CardCompany | '전체';
  category: TemplateCategory;
  templateContent: string;
  description: string;
  isDefault?: boolean;
}

export interface ColumnMapping {
  id: number;
  date: number;
  dateSummary: number;
  manager: number;
  cardCompany: number;
  customerType: number;
  dealerInfo: number;
  dealerType: number;
  affiliation: number;
  status: number;
  customerName: number;
  maskedName: number;
  agency: number;
  residentNumber: number;
  phoneNumber: number;
  carModel: number;
  customerSummary: number;
  paymentAmount: number;
  installmentMonths: number;
  interestRate: number;
  commissionRate: number;
  commissionAmount: number;
}
