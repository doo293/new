import { CustomerPaymentData, CardCompany, ProcessStatus, ColumnMapping } from '../types';
import { DEFAULT_COLUMN_MAPPING } from '../data/defaultTemplates';

export function normalizeCardCompany(raw: string): CardCompany | string {
  if (!raw) return '농협';
  const clean = raw.trim().toLowerCase();
  if (clean.includes('롯데')) return '롯데';
  if (clean.includes('하나') || clean.includes('1q')) return '하나';
  if (clean.includes('농협') || clean.includes('nh')) return '농협';
  if (clean.includes('우리')) return '우리';
  if (clean.includes('국민') || clean.includes('kb')) return '국민';
  if (clean.includes('신한')) return '신한';
  if (clean.includes('삼성')) return '삼성';
  if (clean.includes('bc') || clean.includes('비씨')) return 'BC';
  return '농협';
}

export function normalizeStatus(raw: string): ProcessStatus | string {
  if (!raw) return '할부완료';
  const clean = raw.trim();
  if (clean.includes('할부완료') || clean.includes('할부')) return '할부완료';
  if (clean.includes('증액완료')) return '증액완료';
  if (clean.includes('증액대기') || clean.includes('대기')) return '증액대기';
  if (clean.includes('증액') || clean.includes('한도')) return '증액완료';
  if (clean.includes('발급완료') || clean.includes('발급')) return '발급완료';
  if (clean.includes('접수완료') || clean.includes('접수')) return '접수완료';
  if (clean.includes('조회중') || clean.includes('조회') || clean.includes('심사')) return '조회중';
  return clean || '할부완료';
}

export function parseNumber(val: any): number {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function formatCurrency(num: number): string {
  if (isNaN(num)) return '0';
  return Math.round(num).toLocaleString('ko-KR');
}

/**
 * 계산 로직:
 * 결제금액 * 캐시백율(%) = 세전 수수료
 * 원천징수 3.3% = 세전 수수료 * 0.033
 * 실지급액 = 세전 수수료 - 원천징수 3.3%
 */
export function calculateCommission(
  paymentAmount: number,
  ratePercent: number,
  applyWithholdingTax: boolean = true
): {
  grossCommission: number;
  withholdingTax: number;
  netPayout: number;
} {
  const gross = (paymentAmount * ratePercent) / 100;
  if (!applyWithholdingTax) {
    return {
      grossCommission: Math.round(gross),
      withholdingTax: 0,
      netPayout: Math.round(gross),
    };
  }
  const tax = Math.round(gross * 0.033);
  const net = Math.round(gross - tax);
  return {
    grossCommission: Math.round(gross),
    withholdingTax: tax,
    netPayout: net,
  };
}

/**
 * 구글 스프레드시트 또는 엑셀에서 복사한 텍스트 파싱
 */
export function parseSpreadsheetText(
  pastedText: string,
  customMapping: ColumnMapping = DEFAULT_COLUMN_MAPPING
): CustomerPaymentData[] {
  if (!pastedText || !pastedText.trim()) return [];

  // 줄바꿈 단위로 분리
  const lines = pastedText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const results: CustomerPaymentData[] = [];

  lines.forEach((line, index) => {
    // 탭으로 분리
    const cols = line.split('\t').map((c) => c.trim());

    // 만약 탭이 없는 한 줄인 경우 (공백 여러개나 콤마로 분리 시도)
    const tokens = cols.length > 1 ? cols : line.split(/ {2,}|\t/).map((c) => c.trim());

    if (tokens.length === 0) return;

    // 만약 헤더 줄(예: '순번', '고객명', '결제금액' 등이 포함된 줄)이면 스킵
    const isHeaderLine = tokens.some(
      (t) => t.includes('순번') || t.includes('고객명') || t.includes('결제금액') || t.includes('카드사')
    );
    if (isHeaderLine && lines.length > 1 && index === 0) {
      return;
    }

    // 기본 매핑 값 추출
    const rowId = tokens[customMapping.id] || String(index + 1);
    const date = tokens[customMapping.date] || new Date().toISOString().split('T')[0];
    const dateSummary = tokens[customMapping.dateSummary] || '';
    const manager = '강희연';

    // 진행 상태 (스마트 추출 우선: 텍스트에 포함된 상태 키워드를 우선 탐색)
    let rawStatus = '';
    const knownStatusKeywords = ['할부완료', '증액완료', '증액대기', '발급완료', '접수완료', '조회중'];
    const foundStatus = tokens.find((t) =>
      knownStatusKeywords.some((s) => t.includes(s))
    );
    if (foundStatus) {
      rawStatus = foundStatus;
    } else if (customMapping.status !== undefined && tokens[customMapping.status]) {
      rawStatus = tokens[customMapping.status];
    }
    const status = normalizeStatus(rawStatus);

    // 카드사 & 딜러정보 보정
    let rawCard = tokens[customMapping.cardCompany] || '';
    const hasKnownCard = ['롯데', '하나', '농협', '우리', '국민', '신한', '삼성', 'bc', '비씨', 'kb', 'nh'].some((c) =>
      rawCard.toLowerCase().includes(c)
    );
    
    // 딜러정보 스마트 탐색 ("강재원 이사", "cm 강재원", "현대 신인철", "기아 안명균" 등)
    let dealerInfo = '';
    const dealerKeywords = ['이사', '팀장', '대리', '과장', '부장', '주임', 'cm', '카마스터', '대리점', '지점', '모터스'];
    const foundDealer = tokens.find((t) =>
      dealerKeywords.some((kw) => t.toLowerCase().includes(kw)) &&
      !t.includes('뉴젠오토') &&
      !t.includes('우리') &&
      !t.includes('하나') &&
      !t.includes('국민') &&
      !t.includes('신한')
    );
    if (foundDealer) {
      dealerInfo = foundDealer;
    } else if (customMapping.dealerInfo !== undefined && tokens[customMapping.dealerInfo]) {
      dealerInfo = tokens[customMapping.dealerInfo];
    }

    if (!hasKnownCard) {
      if (rawCard && (rawCard.includes('현대') || rawCard.includes('기아') || rawCard.includes('대리점') || rawCard.includes('지점') || rawCard.includes('이사'))) {
        if (!dealerInfo) dealerInfo = rawCard;
      }
      const foundCard = tokens.find((t) =>
        ['롯데', '하나', '농협', '우리', '국민', '신한', '삼성', 'bc', '비씨', 'kb', 'nh'].some((c) =>
          t.toLowerCase().includes(c)
        )
      );
      rawCard = foundCard || '';
    }
    const cardCompany = normalizeCardCompany(rawCard);

    const customerType = tokens[customMapping.customerType] || '기존';
    const dealerType = tokens[customMapping.dealerType] || '';
    const affiliation = tokens[customMapping.affiliation] || '';

    // 고객명 & 마스킹명 스마트 탐색
    let customerName = '';
    let maskedName = '';

    // 마스킹명 (* 포함) 탐색
    const foundMasked = tokens.find((t) => /^[가-힣]\*[가-힣]+$/.test(t));
    if (foundMasked) {
      maskedName = foundMasked;
    } else if (customMapping.maskedName !== undefined && tokens[customMapping.maskedName]) {
      maskedName = tokens[customMapping.maskedName];
    }

    // 상태명 바로 다음 토큰이 2~4글자 한글 이름인지 확인 (스프레드시트 표준 배치)
    if (foundStatus) {
      const statusIdx = tokens.indexOf(foundStatus);
      if (statusIdx !== -1 && tokens[statusIdx + 1] && /^[가-힣]{2,4}$/.test(tokens[statusIdx + 1])) {
        customerName = tokens[statusIdx + 1];
      }
    }

    if (!customerName && customMapping.customerName !== undefined && tokens[customMapping.customerName]) {
      const rawName = tokens[customMapping.customerName].trim();
      if (/^[가-힣]{2,4}$/.test(rawName) && !rawName.includes('*')) {
        customerName = rawName;
      }
    }

    if (!customerName && maskedName) {
      const first = maskedName[0];
      const last = maskedName[maskedName.length - 1];
      const matchedCandidate = tokens.find(
        (t) =>
          t.length === maskedName.length &&
          t[0] === first &&
          t[t.length - 1] === last &&
          !t.includes('*') &&
          /^[가-힣]+$/.test(t)
      );
      if (matchedCandidate) customerName = matchedCandidate;
    }

    // 후보군 중 적절한 2~4글자 한글 탐색
    if (!customerName) {
      const candidate = tokens.find(
        (t) =>
          /^[가-힣]{2,4}$/.test(t) &&
          !['우리', '기존', '신규', '상조회', '현대', '기아', '완료', '접수', '쏘나타', '그랜저', '포터', '영업', '가상', '뉴젠오토', '담당자', '팰리세이드', '아반떼', '투싼', '스포티지', '카니발', '쏘렌토'].includes(t)
      );
      if (candidate) customerName = candidate;
    }

    // 주민번호 & 전화번호 & 차종 탐색
    let residentNumber = tokens[customMapping.residentNumber] || '';
    let phoneNumber = tokens[customMapping.phoneNumber] || '';
    let carModel = tokens[customMapping.carModel] || '';
    let agency = tokens[customMapping.agency] || '';

    // 정규식 스마트 보정
    tokens.forEach((token) => {
      if (!phoneNumber && /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(token.replace(/\s/g, ''))) {
        phoneNumber = token;
      } else if (!residentNumber && /^\d{6}-?[1-4]\d{6}$/.test(token.replace(/\s/g, ''))) {
        residentNumber = token;
      }
    });

    // 차종 탐색
    if (!carModel) {
      const knownCars = ['팰리세이드', '쏘나타', '그랜저', '아반떼', '투싼', '스포티지', '카니발', '쏘렌토', '포터', '봉고', 'pv5', 'k5', 'k8', 'k9', 'ev6', 'ev9', 'gv70', 'gv80', 'g80', 'g90', '코나', '셀토스', '아이오닉'];
      const foundCar = tokens.find((t) => knownCars.some((car) => t.toLowerCase().includes(car)));
      if (foundCar) carModel = foundCar;
    }

    // 카드번호 전달방식 (가상계좌, 직접전달 등)
    let cardNumberOption: '직접전달' | '가상계좌' | '수기입력' | '앱카드' = '직접전달';
    if (tokens.some((t) => t.includes('가상'))) {
      cardNumberOption = '가상계좌';
    }

    // 통화/금액 토큰 유효성 검사 함수 (문자열, 메모, 전화번호, 영문 등이 섞인 토큰 배제)
    const isValidMoneyToken = (str: string): boolean => {
      const trimmed = str.trim();
      if (!trimmed) return false;
      // 날짜, 시간, 주민번호, 전화번호 패턴 배제
      if (trimmed.includes('-') || trimmed.includes('/') || trimmed.includes(':')) return false;
      // 한글 포함 (뒤에 붙은 '원' 제외) 배제
      if (/[가-힣]/.test(trimmed.replace(/원$/, ''))) return false;
      // 영문 포함 (예: cm, p형 등) 배제
      if (/[a-zA-Z]/.test(trimmed)) return false;
      // 숫자 사이에 공백이 들어간 패턴 배제 (예: "6263 4632")
      if (/\d+\s+\d+/.test(trimmed)) return false;
      // 숫자와 쉼표, 마침표, 통화기호만으로 구성된 형식 검증
      const clean = trimmed.replace(/^[￦\$\s]+/, '').replace(/[\s원]+$/, '');
      return /^[\d,]+(\.\d+)?$/.test(clean);
    };

    // 큰 금액(자동차 결제금액 >= 500,000) 모두 탐색
    interface FoundAmountInfo {
      amount: number;
      index: number;
    }
    const foundAmounts: FoundAmountInfo[] = [];

    tokens.forEach((t, i) => {
      if (!isValidMoneyToken(t)) return;
      const num = parseNumber(t);
      if (num >= 500000) {
        foundAmounts.push({ amount: num, index: i });
      }
    });

    // 수수료 실지급액 탐색 (시트 맨 뒤쪽의 수수료 금액, 예: 96,136 / 107,012 / 255,868 / 166,808)
    let rawCommissionAmount = 0;
    const nonBlankTokens = tokens.filter((t) => t.trim() !== '');
    for (let i = nonBlankTokens.length - 1; i >= 0; i--) {
      const token = nonBlankTokens[i];
      if (!isValidMoneyToken(token)) continue;
      const num = parseNumber(token);
      if (num >= 1000) {
        // 큰 차량 결제금액 목록에 포함되지 않은 수수료 금액인지 확인
        const isCarAmount = foundAmounts.some((fa) => Math.abs(fa.amount - num) < 100);
        if (!isCarAmount) {
          rawCommissionAmount = num;
          break;
        }
      }
    }

    let isHybridPayment = false;
    let installmentAmount: number | undefined = undefined;
    let installmentMonths = '일시불';
    let interestRate = '';
    let installmentCommissionRate: number | undefined = undefined;
    let lumpSumAmount: number | undefined = undefined;
    let lumpSumCommissionRate: number | undefined = undefined;
    let customerCashbackRate = 0;
    let commissionRate = 0;
    let paymentAmount = 0;

    // === 케이스 1: 복합 결제 (할부금 + 일시불 금액 존재) ===
    if (foundAmounts.length >= 2) {
      isHybridPayment = true;
      let firstAmtInfo: FoundAmountInfo;
      let secondAmtInfo: FoundAmountInfo;

      // 만약 차량 총 차량가격(예: 48,753,000) + 할부금(28,750,000) + 일시불(20,003,000) 처럼 3개 이상의 금액이 있을 때
      // 총 차량가격 = 할부금 + 일시불 인지 검사
      if (foundAmounts.length >= 3) {
        const amt0 = foundAmounts[0].amount;
        const amt1 = foundAmounts[1].amount;
        const amt2 = foundAmounts[2].amount;
        if (Math.abs(amt0 - (amt1 + amt2)) <= 1000) {
          // 첫 번째는 총 차량가액, 2번째가 할부금, 3번째가 일시불
          firstAmtInfo = foundAmounts[1];
          secondAmtInfo = foundAmounts[2];
        } else {
          firstAmtInfo = foundAmounts[0];
          secondAmtInfo = foundAmounts[1];
        }
      } else {
        firstAmtInfo = foundAmounts[0];
        secondAmtInfo = foundAmounts[1];
      }

      installmentAmount = firstAmtInfo.amount;
      lumpSumAmount = secondAmtInfo.amount;
      paymentAmount = installmentAmount + lumpSumAmount;

      // 1. 첫번째 금액(할부) 뒤에 오는 토큰들 분석 (개월수, 금리, 할부수수료)
      const firstSubTokens = tokens.slice(firstAmtInfo.index + 1, secondAmtInfo.index);
      for (let i = 0; i < firstSubTokens.length; i++) {
        const t = firstSubTokens[i].trim();
        if (!t) continue;

        // 할부 개월수 (예: 36, 60, 36개월)
        const monthMatch = t.match(/^(\d{1,3})(개월)?$/);
        if (monthMatch && installmentMonths === '일시불') {
          const m = parseInt(monthMatch[1], 10);
          const hasSuffix = Boolean(monthMatch[2]);
          if ([12, 18, 24, 36, 48, 60, 72, 84, 96, 120].includes(m) || (hasSuffix && [2, 3, 6, 10].includes(m))) {
            installmentMonths = String(m);
            // 바로 다음 토큰이 금리인지 확인
            if (i + 1 < firstSubTokens.length) {
              const nextT = firstSubTokens[i + 1].trim();
              const nextNum = parseFloat(nextT);
              if (!isNaN(nextNum) && nextNum >= 1 && nextNum <= 25) {
                interestRate = String(nextNum);
              }
            }
            continue;
          }
        }

        // 수수료율 (예: 0.3)
        if (t.includes('.')) {
          const rateNum = parseFloat(t);
          if (!isNaN(rateNum) && rateNum > 0 && rateNum <= 10) {
            if (rateNum === parseFloat(interestRate)) {
              // 금리와 동일하면 스킵
            } else {
              installmentCommissionRate = rateNum;
            }
          }
        }
      }

      // 2. 두번째 금액(일시불) 뒤에 오는 토큰들 분석 (일시불 수수료율)
      const secondSubTokens = tokens.slice(secondAmtInfo.index + 1, secondAmtInfo.index + 5);
      for (let i = 0; i < secondSubTokens.length; i++) {
        const t = secondSubTokens[i].trim();
        if (!t) continue;
        if (t.includes('.')) {
          const rateNum = parseFloat(t);
          if (!isNaN(rateNum) && rateNum > 0 && rateNum <= 10) {
            lumpSumCommissionRate = rateNum;
            break;
          }
        }
      }

      // 기본값 보정
      if (installmentCommissionRate === undefined) installmentCommissionRate = 0.3;
      if (lumpSumCommissionRate === undefined) lumpSumCommissionRate = 0.3;

      // 총 수수료율 = 할부 수수료율(0.3%) + 일시불 수수료율(0.3%) = 0.6%
      const grossComm = (installmentAmount * installmentCommissionRate) / 100 + (lumpSumAmount * lumpSumCommissionRate) / 100;
      const combinedRate = Math.round((installmentCommissionRate + lumpSumCommissionRate) * 10) / 10;
      commissionRate = combinedRate > 0 ? combinedRate : 0.6;

      if (rawCommissionAmount === 0) {
        const netAfterTax = Math.round(grossComm - Math.round(grossComm * 0.033));
        rawCommissionAmount = netAfterTax;
      }
    } 
    // === 케이스 2: 단독 결제 (금액 1개) ===
    else {
      let paymentAmountIdx = -1;
      let rawAmount = tokens[customMapping.paymentAmount] || '';
      paymentAmount = parseNumber(rawAmount);

      if (paymentAmount >= 500000) {
        paymentAmountIdx = customMapping.paymentAmount;
      } else if (foundAmounts.length === 1) {
        paymentAmount = foundAmounts[0].amount;
        paymentAmountIdx = foundAmounts[0].index;
      } else {
        paymentAmount = 27666000;
      }

      if (paymentAmountIdx !== -1) {
        const subsequentTokens = tokens.slice(paymentAmountIdx + 1, paymentAmountIdx + 8);
        const decimalRates: number[] = [];

        for (let i = 0; i < subsequentTokens.length; i++) {
          const t = subsequentTokens[i].trim();
          if (!t) continue;

          if (t.includes('-') || t.includes('/') || t.includes(':') || t.includes(',')) {
            continue;
          }

          // 소수점 요율 (예: 1.5, 0.4 등)
          if (t.includes('.')) {
            const r = parseFloat(t);
            if (!isNaN(r) && r > 0 && r <= 20) {
              decimalRates.push(r);
            }
            continue;
          }

          // 할부 개월수 검사
          // 엄격 규칙: 12, 18, 24, 36, 48, 60, 72, 84, 96, 120 또는 'N개월'
          // 1자리 숫자(2, 3 등)는 뒤에 '개월'이 붙어있지 않으면 순번/등급으로 간주하여 할부로 인식하지 않음!
          const match = t.match(/^(\d{1,3})(개월)?$/);
          if (match) {
            const num = parseInt(match[1], 10);
            const hasSuffix = Boolean(match[2]);
            const isStandardLoanMonth = [12, 18, 24, 36, 48, 60, 72, 84, 96, 120].includes(num);
            const isShortMonthWithSuffix = hasSuffix && [2, 3, 6, 10].includes(num);

            if (isStandardLoanMonth || isShortMonthWithSuffix) {
              installmentMonths = String(num);

              if (i + 1 < subsequentTokens.length) {
                const nextT = subsequentTokens[i + 1].trim();
                const nextNum = parseFloat(nextT);
                if (!isNaN(nextNum) && nextNum >= 1 && nextNum <= 25 && !nextT.includes('-') && !nextT.includes('/')) {
                  interestRate = String(nextNum);
                }
              }
            }
          }
        }

        if (decimalRates.length >= 2) {
          customerCashbackRate = decimalRates[0];
          commissionRate = decimalRates[1];
        } else if (decimalRates.length === 1) {
          const singleRate = decimalRates[0];
          // 1.0% 이상이면 고객 캐시백율 (예: 1.4, 1.5, 1.8), 당사 수수료율은 0.4 기본값
          if (singleRate >= 1.0) {
            customerCashbackRate = singleRate;
            commissionRate = 0.4;
          } else {
            // 1.0% 미만이면 당사 수수료율 (예: 0.3, 0.4, 0.9)
            commissionRate = singleRate;
          }
        }
      }

      // customMapping.installmentMonths 검사 시에도 paymentAmountIdx 이후 열이며 유효한 할부 개월수일 때만 적용
      if (
        customMapping.installmentMonths !== undefined &&
        paymentAmountIdx !== -1 &&
        customMapping.installmentMonths > paymentAmountIdx &&
        tokens[customMapping.installmentMonths]
      ) {
        const explicitRaw = tokens[customMapping.installmentMonths].trim();
        if (!explicitRaw.includes('.') && !explicitRaw.includes('-')) {
          const match = explicitRaw.match(/^(\d{1,3})(개월)?$/);
          if (match) {
            const n = parseInt(match[1], 10);
            const hasSuffix = Boolean(match[2]);
            if ([12, 18, 24, 36, 48, 60, 72, 84, 96, 120].includes(n) || (hasSuffix && [2, 3, 6, 10].includes(n))) {
              installmentMonths = String(n);
            }
          }
        }
      }

      if (commissionRate === 0 && rawCommissionAmount > 0 && paymentAmount > 0) {
        const calculatedRate = (rawCommissionAmount / (paymentAmount * 0.967)) * 100;
        const roundedRate = Math.round(calculatedRate * 10) / 10;
        if (roundedRate > 0 && roundedRate <= 10) {
          commissionRate = roundedRate;
        }
      }

      if (commissionRate === 0) {
        commissionRate = 0.4;
      }
    }

    // 은행명 & 계좌번호 & 정산유형 스마트 탐색
    let bankName = '';
    let accountNumber = '';
    let settlementType = '딜러인센';
    let parsedProductName = '';

    const knownBanks = ['신협', '카카오뱅크', '카카오', '신한', '국민', '우리', '하나', '농협', '기업', '토스', '토스뱅크', '새마을', '새마을금고', '수협', 'SC제일', '씨티', '대구', '부산', '광주', '전북', '경남', '우체국', '산림조합', '저축은행', '케이뱅크'];
    
    tokens.forEach((t) => {
      const trimmed = t.trim();
      if (!trimmed) return;

      // 딜러인센, 인센티브 등 탐색
      if (trimmed.includes('인센') || trimmed.includes('수수료정산')) {
        settlementType = trimmed;
      }

      // 상품명 (일시불, 신규 저금리 다이렉트 등)
      if (trimmed.includes('다이렉트') || trimmed.includes('저금리') || trimmed.includes('오토할부')) {
        parsedProductName = trimmed;
      }

      // 은행명 탐색 (단, 카드사명과 중복되는 경우 토큰 위치나 뒤쪽 위치 고려)
      if (!bankName) {
        const foundBank = knownBanks.find((b) => trimmed === b || trimmed === `${b}은행` || (trimmed.startsWith(b) && trimmed.length <= 6));
        if (foundBank) {
          bankName = foundBank;
        }
      }

      // 계좌번호 탐색 (10~16자리 숫자, 주민번호나 전화번호가 아닌 것)
      if (!accountNumber) {
        const cleanDigits = trimmed.replace(/-/g, '');
        const isAccountPattern = /^\d{10,16}$/.test(cleanDigits);
        const isResident = /^\d{6}[1-4]\d{6}$/.test(cleanDigits);
        const isPhone = /^01\d{8,9}$/.test(cleanDigits);
        if (isAccountPattern && !isResident && !isPhone) {
          accountNumber = trimmed;
        }
      }
    });

    // 기본 수수료 및 고객 캐시백 계산
    const calculated = calculateCommission(paymentAmount, commissionRate, true);
    const finalCommissionAmount = rawCommissionAmount > 0 ? rawCommissionAmount : calculated.netPayout;
    const customerCashbackAmount = customerCashbackRate > 0 ? Math.round((paymentAmount * customerCashbackRate) / 100) : 0;

    // 결제방식 기본문구 (할부/일시불/복합결제 모두 결제준비는 '일시불로 결제 부탁드립니다~'가 기본값)
    const paymentMethodNote = '일시불로 결제 부탁드립니다~';

    results.push({
      id: `item-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
      rawLine: line,
      rowNumber: rowId,
      date,
      dateSummary,
      manager,
      cardCompany,
      customerType,
      dealerInfo: dealerInfo || (customerName ? `현대 ${customerName}` : '현대 오도원'),
      dealerType,
      affiliation,
      status,
      customerName: customerName || '고객',
      maskedName: maskedName || (customerName ? customerName.slice(0, 1) + '*' + customerName.slice(2) : '고*객'),
      agency: agency || '에이전시',
      residentNumber,
      phoneNumber,
      carModel: carModel || '차량',
      customerSummary: tokens[customMapping.customerSummary] || '',
      paymentAmount: paymentAmount || 27666000,
      customerCashbackRate: customerCashbackRate > 0 ? customerCashbackRate : undefined,
      customerCashbackAmount: customerCashbackAmount > 0 ? customerCashbackAmount : undefined,
      installmentMonths: installmentMonths || '일시불',
      interestRate: interestRate || '0',
      commissionRate,
      commissionAmount: finalCommissionAmount,
      applyTaxWithholding: true,
      cardNumberOption,
      customCardNumber: '',
      paymentMethodNote,
      cardCompanyDirectPayout: false,
      cardCompanyDirectRate: commissionRate,
      memo: '',
      createdAt: Date.now(),

      // 은행 및 계좌 정산 정보
      bankName: bankName || '',
      accountNumber: accountNumber || '',
      settlementType,
      productName: parsedProductName,

      // 복합결제 정보
      isHybridPayment,
      installmentAmount,
      installmentCommissionRate,
      lumpSumAmount,
      lumpSumCommissionRate,
    });
  });

  return results;
}

export const SAMPLE_LUMP_SUM_TSV = `13\t2026-08-20\t8/20\t정지혜\t현대 신인철\t\t기존\t영업\t기존\t\t증액완료\t전경란\t\t\t전*란\t뉴젠오토\t\t810124-2011019\t010-2127-7547\t포터\t가상\t\t27,666,000\t1.4\t\t0.4\t\t\t107,012`;

export const SAMPLE_INSTALLMENT_TSV = `90\t2026-08-19\t8/19\t강희연\t우리\t기존\t\t현대 오도원\t기존\t상조회\t\t할부완료\t원동경\t\t원*경\t\t뉴젠오토\t770827-1380711\t010-9103-0260\t쏘나타\t원동경, 770827, 010-9103-0260\t\t\t29,400,000 \t60\t4\t0.9\t\t\t\t\t255,868`;

export const SAMPLE_HYBRID_TSV = `5\t2026-08-20\t8/20\t정지혜\t신한\t기존\t경기\t기아 안명균\t기존\t영업\t14일\t할부완료\t김성우\t\t김*우\t\t뉴젠오토\t850516-1058611\t010-3005-0226\tpv5\t김성우, 850516, 010-3005-0226\t\t\t13,200,000 \t36\t3.9\t0.3\t19,939,000 \t0.3\t\t\t96,136`;

export const SAMPLE_TSV_LINE = SAMPLE_LUMP_SUM_TSV;

export const MULTI_SAMPLE_TSV = `${SAMPLE_LUMP_SUM_TSV}\n${SAMPLE_INSTALLMENT_TSV}\n${SAMPLE_HYBRID_TSV}`;
