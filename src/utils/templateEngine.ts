import { CustomerPaymentData, MessageTemplate } from '../types';
import { formatCurrency, calculateCommission } from './parser';

export function getCardNumberText(_item?: CustomerPaymentData): string {
  return '고객님께서 직접 전달';
}

export function isInstallmentCustomer(item: CustomerPaymentData | null | undefined): boolean {
  if (!item) return false;
  if (item.isHybridPayment) return true;
  if (!item.installmentMonths) return false;
  const str = String(item.installmentMonths).trim().toLowerCase().replace(/개월$/, '');
  if (str === '' || str === '0' || str === '1' || str === '일시불' || str === '-' || str === 'none') {
    return false;
  }
  const n = parseInt(str, 10);
  return !isNaN(n) && n >= 2 && !str.includes('-') && !str.includes('.');
}

export function generateCommissionSettlementLine(item: CustomerPaymentData): string {
  const cardClean = (item.cardCompany || '하나').replace(/카드$/, '');
  const customerName = item.customerName || '고객';
  const dealer = item.dealerInfo || `현대 ${customerName}`;
  const customerType = item.customerType || '신규';
  const bank = item.bankName || '';
  const account = item.accountNumber || '';
  const settlementType = item.settlementType || '딜러인센';

  const isHybrid = Boolean(
    item.isHybridPayment ||
    (item.installmentAmount && item.lumpSumAmount && item.installmentAmount > 0 && item.lumpSumAmount > 0)
  );
  const isInstallment = !isHybrid && isInstallmentCustomer(item);

  // 1. 복합 결제 (할부 + 일시불/캐시백)
  // 예: 현대 조현국\t우리 기존 저금리 다이렉트 + 캐시백 김원기\t60,000,000\t0.9\t34,482,000\t0.1\t555,524\t\t\t기업\t36600439002014\t555,524\t딜러인센\t우리 김원기
  if (isHybrid) {
    const instAmt = item.installmentAmount || 0;
    const instRate = item.installmentCommissionRate !== undefined ? item.installmentCommissionRate : item.commissionRate;
    const lumpAmt = item.lumpSumAmount || 0;
    const lumpRate = item.lumpSumCommissionRate !== undefined ? item.lumpSumCommissionRate : 0.1;

    const gross = (instAmt * instRate) / 100 + (lumpAmt * lumpRate) / 100;
    const tax = item.applyTaxWithholding ? Math.round(gross * 0.033) : 0;
    const net = item.commissionAmount > 0 ? item.commissionAmount : Math.round(gross - tax);

    const productName = item.productName || '저금리 다이렉트 + 캐시백';
    const prodCol = `${cardClean} ${customerType} ${productName} ${customerName}`.replace(/\s+/g, ' ');

    return `${dealer}\t${prodCol}\t${formatCurrency(instAmt)}\t${instRate}\t${formatCurrency(lumpAmt)}\t${lumpRate}\t${formatCurrency(net)}\t\t\t${bank}\t${account}\t${formatCurrency(net)}\t${settlementType}\t${cardClean} ${customerName}`;
  }

  // 2. 순수 할부
  // 예: 기아 박재준\t하나 신규 저금리 다이렉트 김영훈\t30,000,000\t0.6\t\t\t174,060\t\t\t카카오뱅크\t3333198981552\t174,060\t딜러인센\t하나 김영훈
  if (isInstallment) {
    const instAmt = item.paymentAmount;
    const instRate = item.commissionRate;
    const gross = (instAmt * instRate) / 100;
    const tax = item.applyTaxWithholding ? Math.round(gross * 0.033) : 0;
    const net = item.commissionAmount > 0 ? item.commissionAmount : Math.round(gross - tax);

    const productName = item.productName || '저금리 다이렉트';
    const prodCol = `${cardClean} ${customerType} ${productName} ${customerName}`.replace(/\s+/g, ' ');

    return `${dealer}\t${prodCol}\t${formatCurrency(instAmt)}\t${instRate}\t\t\t${formatCurrency(net)}\t\t\t${bank}\t${account}\t${formatCurrency(net)}\t${settlementType}\t${cardClean} ${customerName}`;
  }

  // 3. 순수 일시불
  // 예: 기아 이현민\t하나 신규 할부 고동환\t24,300,000\t0.2\t\t\t46,996\t\t\t새마을금고\t9003222323054\t46,996\t딜러인센\t하나 고동환
  const lumpAmt = item.paymentAmount;
  const lumpRate = item.commissionRate;
  const gross = (lumpAmt * lumpRate) / 100;
  const tax = item.applyTaxWithholding ? Math.round(gross * 0.033) : 0;
  const net = item.commissionAmount > 0 ? item.commissionAmount : Math.round(gross - tax);

  const productName = item.productName || '할부';
  const prodCol = `${cardClean} ${customerType} ${productName} ${customerName}`.replace(/\s+/g, ' ');

  // 일시불 단독 건도 1열(대상금액) + 2열(요율)에 배치되어 공통 컬럼 그리드와 일치
  return `${dealer}\t${prodCol}\t${formatCurrency(lumpAmt)}\t${lumpRate}\t\t\t${formatCurrency(net)}\t\t\t${bank}\t${account}\t${formatCurrency(net)}\t${settlementType}\t${cardClean} ${customerName}`;
}

export function renderTemplate(template: MessageTemplate, item: CustomerPaymentData): string {
  const cardCompanyClean = (item.cardCompany || '기타').replace(/카드$/, '');
  const cardPrefix = cardCompanyClean;
  const cardNumber = getCardNumberText(item);
  
  // 수수료 계산
  const commissionCalculated = calculateCommission(
    item.paymentAmount,
    item.commissionRate,
    item.applyTaxWithholding
  );
  
  const payoutAmount = item.commissionAmount > 0 
    ? item.commissionAmount 
    : commissionCalculated.netPayout;

  const isInstallment = isInstallmentCustomer(item);

  const installmentSummary = !isInstallment
    ? '일시불'
    : `${item.installmentMonths}개월${item.interestRate ? ` (금리 ${item.interestRate}%)` : ''}`;

  // 카드사 직지급 수수료 안내 문구 (고객안내 및 수수료정산 카테고리에서는 포함하지 않음)
  const isCustomerGuide = template.category === '고객안내';
  const isCommissionSettlement = template.category === '수수료정산';
  const directRate = item.cardCompanyDirectRate ?? item.commissionRate;
  const directPayoutNotice = (!isCustomerGuide && !isCommissionSettlement && item.cardCompanyDirectPayout)
    ? `\n\n** 카드사에서 ${directRate}% 지급되는점 참고 부탁드립니다 ^^`
    : '';

  let result = template.templateContent;

  // 결제준비 템플릿의 경우, 첫 줄에 다른 카드사명이 하드코딩되어 있다면 현재 고객의 카드사로 자동 교정
  if (template.category === '결제준비') {
    const knownCardsPattern = /(?:롯데|하나|농협|우리|국민|신한|삼성|현대|기타)카드/g;
    // 첫 줄의 카드사명을 현재 고객 카드사로 안전하게 보정
    const lines = result.split('\n');
    if (lines.length > 0 && lines[0].includes('결제준비완료')) {
      lines[0] = lines[0].replace(knownCardsPattern, `${cardPrefix}카드`);
      result = lines.join('\n');
    }
  }

  const customerNameClean = item.customerName 
    ? item.customerName.replace(/고객(님)?$/, '').trim() 
    : '';

  const managerClean = '강희연';

  // 복합결제 (할부 + 일시불 동시 진행 건) 처리
  const isHybrid = Boolean(
    item.isHybridPayment ||
    (item.installmentAmount && item.lumpSumAmount && item.installmentAmount > 0 && item.lumpSumAmount > 0)
  );

  const lumpSumAmt = item.lumpSumAmount || (isHybrid ? Math.max(0, item.paymentAmount - (item.installmentAmount || 0)) : 0);
  const installmentAmt = item.installmentAmount || (isHybrid ? Math.max(0, item.paymentAmount - lumpSumAmt) : 0);
  const totalPaymentAmt = item.paymentAmount || (lumpSumAmt + installmentAmt);

  const isHana = cardPrefix.includes('하나') || (item.cardCompany || '').includes('하나');

  // 복합결제 시 전체 금액 + 결제순서 문구:
  // [하나카드 전용] 결제금액: (전체금액)원\n결제순서: 1. (일시불금액)원\n 2. (할부금액)원\n** 순서대로 일시불로 결제 부탁드립니다~
  // [기타 카드사] 결제순서: 1. (일시불금액)원\n 2. (할부금액)원\n** 순서대로 일시불로 결제 부탁드립니다~
  const hybridPaymentBlock = isHana
    ? `결제금액 : ${formatCurrency(totalPaymentAmt)}원\n결제순서 : 1. ${formatCurrency(lumpSumAmt)}원\n               2. ${formatCurrency(installmentAmt)}원\n** 순서대로 일시불로 결제 부탁드립니다~`
    : `결제순서 : 1. ${formatCurrency(lumpSumAmt)}원\n               2. ${formatCurrency(installmentAmt)}원\n** 순서대로 일시불로 결제 부탁드립니다~`;

  if (isHybrid && (template.category === '결제준비' || result.includes('결제금액'))) {
    // 템플릿의 "결제금액 : {결제금액}원\n** {결제방식안내}" 부분을 치환
    result = result.replace(/결제금액\s*:\s*\{결제금액\}원\s*\r?\n\s*\*\*\s*\{결제방식안내\}/g, hybridPaymentBlock);
    result = result.replace(/결제금액\s*:\s*\{결제금액\}원\s*\r?\n\s*\{결제방식안내\}/g, hybridPaymentBlock);
  }

  const defaultMethodNote = isHybrid
    ? '순서대로 일시불로 결제 부탁드립니다~'
    : (item.paymentMethodNote && !item.paymentMethodNote.includes('할부로 결제 부탁드립니다')
        ? item.paymentMethodNote
        : '일시불로 결제 부탁드립니다~');

  const replacements: Record<string, string> = {
    '{카드사}': cardPrefix,
    '{고객명}': customerNameClean,
    '{마스킹명}': item.maskedName || item.customerName || '고*객',
    '{결제금액}': formatCurrency(totalPaymentAmt),
    '{총결제금액}': formatCurrency(totalPaymentAmt),
    '{전체금액}': formatCurrency(totalPaymentAmt),
    '{카드번호}': cardNumber,
    '{결제방식안내}': defaultMethodNote,
    '{수수료율}': String(item.commissionRate),
    '{수수료금액}': formatCurrency(payoutAmount),
    '{캐시백율}': item.customerCashbackRate ? String(item.customerCashbackRate) : String(item.commissionRate),
    '{고객캐시백율}': String(item.customerCashbackRate || 0),
    '{고객캐시백금액}': formatCurrency(item.customerCashbackAmount || (item.customerCashbackRate ? Math.round((item.paymentAmount * item.customerCashbackRate) / 100) : 0)),
    '{지급금액}': formatCurrency(payoutAmount),
    '{수수료안내문구}': isInstallment
      ? `자동차등록증 보내주시면 결제금액의 ${item.commissionRate}% 입금해드립니다.`
      : `결제전표 보내주시면 결제금액의 ${item.commissionRate}% 당일 입금해드립니다^^`,
    '{세전수수료}': formatCurrency(commissionCalculated.grossCommission),
    '{원천징수세}': formatCurrency(commissionCalculated.withholdingTax),
    '{차종}': item.carModel || '차량',
    '{할부개월}': String(item.installmentMonths || '일시불'),
    '{금리}': String(item.interestRate || '0'),
    '{할부조건}': installmentSummary,
    '{영업사원}': item.dealerInfo || '담당 카마스터',
    '{딜러명}': item.dealerInfo || '',
    '{연락처}': item.phoneNumber || '',
    '{주민번호}': item.residentNumber || '',
    '{담당자}': managerClean,
    '{에이전시}': item.agency || '뉴젠오토',
    '{진행상태}': item.status || '완료',
    '{등록일자}': item.date || new Date().toISOString().split('T')[0],
    '{카드사직지급안내}': directPayoutNotice,
    '{카드사직지급율}': String(directRate),
    '{할부금}': formatCurrency(installmentAmt),
    '{할부금액}': formatCurrency(installmentAmt),
    '{할부수수료}': item.installmentCommissionRate !== undefined ? String(item.installmentCommissionRate) : String(item.commissionRate),
    '{일시불금}': formatCurrency(lumpSumAmt),
    '{일시불금액}': formatCurrency(lumpSumAmt),
    '{일시불수수료}': item.lumpSumCommissionRate !== undefined ? String(item.lumpSumCommissionRate) : String(item.commissionRate),
    '{결제순서}': `1. ${formatCurrency(lumpSumAmt)}원\n               2. ${formatCurrency(installmentAmt)}원`,
    '{정산라인}': generateCommissionSettlementLine(item),
    '{입금은행}': item.bankName || '',
    '{계좌번호}': item.accountNumber || '',
    '{정산구분}': item.settlementType || '딜러인센',
  };

  Object.entries(replacements).forEach(([placeholder, value]) => {
    result = result.split(placeholder).join(value);
  });

  // 템플릿에 {카드사직지급안내}가 없고 직지급이 켜져 있는 경우 안전하게 맨 뒤에 추가 (단, 고객안내 및 수수료정산 카테고리는 항상 제외)
  if (!isCustomerGuide && !isCommissionSettlement && item.cardCompanyDirectPayout && !result.includes('카드사에서') && !result.includes('지급되는점')) {
    result = result.trim() + `\n\n** 카드사에서 ${directRate}% 지급되는점 참고 부탁드립니다 ^^`;
  }

  // 고객안내 및 수수료정산 카테고리에서는 혹시 양식 본문에 남아있는 직지급 관련 문구도 완전히 정리
  if (isCustomerGuide || isCommissionSettlement) {
    result = result.replace(/\r?\n\s*\*\*\s*카드사에서\s+[0-9.]+%?\s*지급되는점\s*참고\s*부탁드립니다[^\n]*/g, '');
  }

  return result;
}

export interface SeparatePaymentInfo {
  isHybrid: boolean;
  totalAmount: number;
  lumpSumAmount: number;
  installmentAmount: number;
  totalHybridText: string;
  lumpSumText: string;
  installmentText: string;
}

export function getSeparatePaymentTexts(
  item: CustomerPaymentData,
  _template?: MessageTemplate
): SeparatePaymentInfo {
  const cardCompanyClean = (item.cardCompany || '기타').replace(/카드$/, '');
  const customerNameClean = item.customerName 
    ? item.customerName.replace(/고객(님)?$/, '').trim() 
    : '';
  const cardNumber = getCardNumberText(item);

  const isHybrid = Boolean(
    item.isHybridPayment ||
    (item.installmentAmount && item.lumpSumAmount && item.installmentAmount > 0 && item.lumpSumAmount > 0)
  );

  const lumpSumAmount = item.lumpSumAmount || (isHybrid ? Math.max(0, item.paymentAmount - (item.installmentAmount || 0)) : item.paymentAmount);
  const installmentAmount = item.installmentAmount || (isHybrid ? Math.max(0, item.paymentAmount - lumpSumAmount) : 0);
  const totalAmount = item.paymentAmount || (lumpSumAmount + installmentAmount);

  const isHana = cardCompanyClean.includes('하나');

  const totalHybridText = isHana
    ? `${cardCompanyClean}카드 ${customerNameClean}고객님 결제준비완료\n카드번호 : ${cardNumber}\n\n결제금액 : ${formatCurrency(totalAmount)}원\n결제순서 : 1. ${formatCurrency(lumpSumAmount)}원\n               2. ${formatCurrency(installmentAmount)}원\n** 순서대로 일시불로 결제 부탁드립니다~`
    : `${cardCompanyClean}카드 ${customerNameClean}고객님 결제준비완료\n카드번호 : ${cardNumber}\n\n결제순서 : 1. ${formatCurrency(lumpSumAmount)}원\n               2. ${formatCurrency(installmentAmount)}원\n** 순서대로 일시불로 결제 부탁드립니다~`;

  const lumpSumText = `${cardCompanyClean}카드 ${customerNameClean}고객님 결제준비완료\n카드번호 : ${cardNumber}\n\n결제금액 : ${formatCurrency(lumpSumAmount)}원\n** 일시불로 결제 부탁드립니다~`;

  const installmentText = `${cardCompanyClean}카드 ${customerNameClean}고객님 결제준비완료\n카드번호 : ${cardNumber}\n\n결제금액 : ${formatCurrency(installmentAmount)}원\n** 일시불로 결제 부탁드립니다~`;

  return {
    isHybrid,
    totalAmount,
    lumpSumAmount,
    installmentAmount,
    totalHybridText,
    lumpSumText,
    installmentText,
  };
}

export interface SplitMessageResult {
  paymentText: string;
  commissionText: string;
  fullText: string;
}

export function splitMessageSections(
  text: string,
  fallbackCustomer?: CustomerPaymentData
): SplitMessageResult {
  const trimmed = text.trim();

  // 1. Look for standard header markers
  const markerRegex = /(\r?\n\s*(?:\[(?:수수료|캐시백|정산).*?\]|------------------------------------|※\s*결제\s*완료\s*후|(?=\[수수료)|(?=\[캐시백)))/i;
  const match = trimmed.match(markerRegex);

  if (match && match.index !== undefined && match.index > 0) {
    const paymentPart = trimmed.substring(0, match.index).trim();
    const commissionPart = trimmed.substring(match.index).trim();
    return {
      paymentText: paymentPart,
      commissionText: commissionPart,
      fullText: trimmed,
    };
  }

  // 2. Line by line search
  const lines = trimmed.split('\n');
  let splitLineIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      line.startsWith('[수수료') ||
      line.startsWith('[캐시백') ||
      line.startsWith('[정산') ||
      line.includes('수수료 지급일정') ||
      (line.includes('수수료') && line.includes('입금')) ||
      (line.includes('캐시백') && line.includes('입금')) ||
      (line.includes('결제전표') && (line.includes('입금') || line.includes('당일'))) ||
      (line.includes('자동차등록증') && (line.includes('입금') || line.includes('정산')))
    ) {
      if (i > 0) {
        splitLineIndex = i;
        break;
      }
    }
  }

  if (splitLineIndex > 0) {
    const paymentPart = lines.slice(0, splitLineIndex).join('\n').trim();
    const commissionPart = lines.slice(splitLineIndex).join('\n').trim();
    return {
      paymentText: paymentPart,
      commissionText: commissionPart,
      fullText: trimmed,
    };
  }

  // 3. Fallback if text doesn't contain a commission section
  if (fallbackCustomer) {
    const rate = fallbackCustomer.commissionRate || 0.9;
    const calc = calculateCommission(
      fallbackCustomer.paymentAmount,
      rate,
      fallbackCustomer.applyTaxWithholding
    );
    const payout =
      fallbackCustomer.commissionAmount > 0
        ? fallbackCustomer.commissionAmount
        : calc.netPayout;

    const isInstallment = isInstallmentCustomer(fallbackCustomer);

    const directRate = fallbackCustomer.cardCompanyDirectRate ?? rate;
    const directNote = fallbackCustomer.cardCompanyDirectPayout
      ? `\n\n** 카드사에서 ${directRate}% 지급되는점 참고 부탁드립니다 ^^`
      : '';

    const commissionNotice = isInstallment
      ? `자동차등록증 보내주시면 결제금액의 ${rate}% 입금해드립니다.`
      : `결제전표 보내주시면 결제금액의 ${rate}% 당일 입금해드립니다^^`;

    return {
      paymentText: trimmed,
      commissionText: `[수수료 지급일정]\n${commissionNotice}\n입금금액 : ${formatCurrency(payout)}원${directNote}`,
      fullText: trimmed,
    };
  }

  return {
    paymentText: trimmed,
    commissionText: '',
    fullText: trimmed,
  };
}

/**
 * 고객안내 템플릿(일시불/할부)의 상단 안내문구와 하단 필수고지사항 분할
 */
export interface SplitCustomerGuideResult {
  guideText: string;       // 상단 안내 (결제금액/캐시백 또는 할부조건)
  complianceText: string;  // 하단 필수고지사항 (뉴젠오토 법정 고지 및 담당자 정보)
  fullText: string;
}

export function splitCustomerGuideSections(text: string): SplitCustomerGuideResult {
  if (!text) {
    return { guideText: '', complianceText: '', fullText: '' };
  }

  const trimmed = text.trim();
  const lines = trimmed.split('\n');
  let splitIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      line.includes('계약체결된 금융상품') ||
      line.includes('판매대리,중개업자') ||
      line.includes('필수고지사항') ||
      line.startsWith('1. 해당 모집종사자') ||
      line.includes('뉴젠오토 소속')
    ) {
      if (i > 0 && (lines[i - 1].includes('계약체결된') || lines[i - 1].includes('판매대리'))) {
        splitIndex = i - 1;
      } else {
        splitIndex = i;
      }
      break;
    }
  }

  if (splitIndex > 0) {
    const guidePart = lines.slice(0, splitIndex).join('\n').trim();
    const compliancePart = lines.slice(splitIndex).join('\n').trim();
    return {
      guideText: guidePart,
      complianceText: compliancePart,
      fullText: trimmed,
    };
  }

  return {
    guideText: trimmed,
    complianceText: '',
    fullText: trimmed,
  };
}

/**
 * 카드사 매칭 검사 헬퍼
 */
export function isCardMatch(templateCard: string | undefined, customerCard: string | undefined): boolean {
  if (!templateCard || templateCard === '전체') return true;
  if (!customerCard) return false;
  const t = templateCard.replace(/카드$/, '').trim().toLowerCase();
  const c = customerCard.replace(/카드$/, '').trim().toLowerCase();
  if (t === c) return true;
  if (c.includes(t) || t.includes(c)) return true;
  if ((t === 'nh' || t === '농협') && (c === 'nh' || c === '농협' || c.includes('농협'))) return true;
  if ((t === 'kb' || t === '국민') && (c === 'kb' || c === '국민' || c.includes('국민'))) return true;
  if (t === '우리' && (c === '우리' || c.includes('우리'))) return true;
  if (t === '신한' && (c === '신한' || c.includes('신한'))) return true;
  if (t === '삼성' && (c === '삼성' || c.includes('삼성'))) return true;
  if (t === '하나' && (c === '하나' || c.includes('하나'))) return true;
  if (t === '롯데' && (c === '롯데' || c.includes('롯데'))) return true;
  return false;
}

export function isExactCardMatch(templateCard: string | undefined, customerCard: string | undefined): boolean {
  if (!templateCard || templateCard === '전체') return false;
  return isCardMatch(templateCard, customerCard);
}

/**
 * 고객 및 카테고리에 가장 적합한 템플릿 검색 (사용자 직접 등록 양식 최우선 적용)
 */
export function findBestTemplateForCustomer(
  templates: MessageTemplate[],
  customer: CustomerPaymentData | null | undefined,
  targetCategory: string = '결제준비'
): MessageTemplate {
  if (!templates || templates.length === 0) {
    throw new Error('No templates available');
  }
  if (!customer) return templates[0];

  const card = customer.cardCompany;

  const isCustom = (tpl: MessageTemplate) => {
    return tpl.id.startsWith('custom-') || !tpl.isDefault;
  };

  // 수수료정산 카테고리인 경우 항상 스프레드시트 1행 정산 양식 최우선 적용
  if (targetCategory === '수수료정산') {
    const tableTpl = templates.find(
      (t) => t.category === '수수료정산' && (t.id === 'commission-calc-table' || t.templateContent.includes('{정산라인}'))
    );
    if (tableTpl) return tableTpl;
  }

  // 1. [최우선] 사용자 등록 양식 중 해당 카드사 & 카테고리 일치
  const userExact = templates.find(
    (t) => t.category === targetCategory && isExactCardMatch(t.cardCompany, card) && isCustom(t)
  );
  if (userExact) return userExact;

  // 2. 기본 양식 중 해당 카드사 & 카테고리 일치
  const defaultExact = templates.find(
    (t) => t.category === targetCategory && isExactCardMatch(t.cardCompany, card)
  );
  if (defaultExact) return defaultExact;

  // 3. 사용자 등록 양식 중 '전체' 카드사 & 카테고리 일치
  const userCommon = templates.find(
    (t) => t.category === targetCategory && (t.cardCompany === '전체' || !t.cardCompany) && isCustom(t)
  );
  if (userCommon) return userCommon;

  // 4. 기본 양식 중 일시불/할부 전용 양식 매칭 (고객안내의 경우) 또는 수수료정산 표 양식
  const isInstallment = isInstallmentCustomer(customer);
  if (targetCategory === '고객안내') {
    const prefId = isInstallment ? 'customer-guide-direct' : 'customer-guide-lump';
    const prefTpl = templates.find((t) => t.id === prefId && t.category === '고객안내');
    if (prefTpl) return prefTpl;
  } else if (targetCategory === '수수료정산') {
    const prefTpl = templates.find((t) => t.id === 'commission-calc-table' && t.category === '수수료정산');
    if (prefTpl) return prefTpl;
  }

  // 5. 기본 양식 중 '전체' 카드사 & 카테고리 일치
  const defaultCommon = templates.find(
    (t) => t.category === targetCategory && (t.cardCompany === '전체' || !t.cardCompany)
  );
  if (defaultCommon) return defaultCommon;

  // 6. 카테고리 일치하는 아무 양식
  const anyInCat = templates.find((t) => t.category === targetCategory);
  if (anyInCat) return anyInCat;

  return templates[0];
}
