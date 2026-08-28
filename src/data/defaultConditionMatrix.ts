export interface ConditionItemRow {
  id: string;
  col1?: string; // 금액 또는 구분
  col2?: string; // 조건 또는 개월
  col3?: string; // 고객 또는 금리
  col4?: string; // 인센 또는 신규/기존
  col5?: string; // 기존 (신한일시불 등에서 사용)
  highlightCol3?: boolean;
  highlightCol4?: boolean;
}

export interface ConditionCardBlock {
  id: string;
  title: string;
  badge?: string;
  theme: 'blue' | 'rose' | 'green' | 'gray';
  headers: string[];
  colWidths?: string[];
  rows: ConditionItemRow[];
  footerNotices: string[];
  highlightNotices?: string[];
}

export interface ConditionMatrixData {
  title: string;
  lastUpdated: string;
  lumpSumSection: {
    title: string;
    subTitle?: string;
    blocks: ConditionCardBlock[];
    notices: string[];
  };
  directInstallmentSection: {
    title: string;
    subTitle: string;
    blocks: ConditionCardBlock[];
  };
  autoInstallmentSection: {
    title: string;
    subTitle: string;
    blocks: ConditionCardBlock[];
  };
}

export const INITIAL_CONDITION_MATRIX: ConditionMatrixData = {
  title: '2026년 8월 신차구매 조건표',
  lastUpdated: '2026. 08',
  lumpSumSection: {
    title: '일시불',
    blocks: [
      {
        id: 'nh-lump',
        title: '농협카드 일시불',
        theme: 'blue',
        headers: ['금액', '조건', '고객', '인센'],
        rows: [
          { id: '1', col1: '2천 이상', col2: '기존', col3: '1.2%', col4: '0.4%' },
          { id: '2', col1: '1천 이상', col2: '기존', col3: '1%', col4: '0.3%' },
        ],
        footerNotices: ['* 기존 고객만 진행 가능', '* 신규 고객은 카드수령 후 진행가능'],
      },
      {
        id: 'lotte-lump',
        title: '롯데카드 일시불',
        theme: 'blue',
        headers: ['금액', '조건', '고객', '기존'],
        rows: [
          { id: '1', col1: '1백 이상', col2: '신규\n기존', col3: '1.4%', col4: '0.4%' },
        ],
        footerNotices: ['* 가상계좌, 기존만 진행가능 신규카드 발급중단'],
        highlightNotices: ['신규카드 발급중단'],
      },
      {
        id: 'woori-lump',
        title: '우리카드 일시불',
        theme: 'blue',
        headers: ['금액', '조건', '고객', '인센'],
        rows: [
          { id: '1', col1: '1천 이상', col2: '신규\n기존', col3: '1.3%', col4: '0.4%' },
        ],
        footerNotices: ['* 캐시백 받고 해지 가능'],
      },
      {
        id: 'shinhan-lump',
        title: '신한카드 일시불',
        theme: 'blue',
        headers: ['금액', '조건', '고객', '신규', '기존'],
        rows: [
          { id: '1', col1: '5백 이상', col2: '신규\n기존', col3: '1.3%', col4: '0.6%', col5: '0.3%' },
        ],
        footerNotices: ['* 후불 가능 / 신규카드 3개월 유지'],
      },
      {
        id: 'hana-lump',
        title: '하나카드 일시불',
        theme: 'blue',
        headers: ['금액', '조건', '고객', '인센'],
        rows: [
          { id: '1', col1: '3백 이상', col2: '신규\n기존', col3: '1.5%', col4: '0.4%', highlightCol3: true },
          { id: '2', col1: '3백 이상', col2: '신규\n기존', col3: '1.4%', col4: '0.5%', highlightCol3: true },
          { id: '3', col1: '3백 이상', col2: '신규\n기존', col3: '1.3%', col4: '0.6%', highlightCol3: true },
        ],
        footerNotices: ['세가지 조건 선택', '* 연회비 19,900원 / 6개월 유지'],
      },
      {
        id: 'corp-lump',
        title: '법인캐시백 진행 가능',
        theme: 'blue',
        headers: ['구분', '고객', '인센', '비고'],
        rows: [
          { id: '1', col1: '하나', col2: '0.5%', col3: '0.8%', col4: '연회비 X' },
          { id: '2', col1: '국민', col2: '0.5%', col3: '0.6%', col4: '연회비 X' },
          { id: '3', col1: '신한', col2: '0.5%', col3: '0.2%', col4: '' },
        ],
        footerNotices: ['* 가상계좌 선입금 / 법인 할부 미진행'],
      },
      {
        id: 'kb-lump',
        title: '국민카드 일시불',
        theme: 'blue',
        headers: ['금액', '조건', '고객', '인센'],
        rows: [
          { id: '1', col1: '5천 이상', col2: '신규\n기존', col3: '1.3%', col4: '0.4%' },
          { id: '2', col1: '4천 이상', col2: '신규\n기존', col3: '1.3%', col4: '0.3%' },
          { id: '3', col1: '3천 이상', col2: '신규\n기존', col3: '1.3%', col4: '0.3%' },
          { id: '4', col1: '2천 이상', col2: '신규\n기존', col3: '1.3%', col4: '0.3%' },
          { id: '5', col1: '1백 이상', col2: '신규\n기존', col3: '1.3%', col4: '0.2%' },
        ],
        footerNotices: ['* 후불 가능 / 2개월 유지'],
      },
    ],
    notices: [
      '* 카드사별 캐시백 및 할부 조건은 변동될 수 있으므로 진행 전 확인 부탁드립니다.',
      '* 할부 진행시 공동명의는 사전에 말씀 부탁드립니다.',
      '* 중도상환은 할부 3개월간 유지 후, 4개월 차 때부터 가능합니다. (첫회차 납부 필수)',
      '* 문제가 발생할 경우, 수수료 지급이 어렵거나 환수가 있을 수 있는 점 참고 부탁드립니다.',
    ],
  },
  directInstallmentSection: {
    title: '다이렉트 할부',
    subTitle: '대출기록 X / 중도상환수수료 X / 원금균등상환',
    blocks: [
      {
        id: 'lotte-direct',
        title: '롯데카드 다이렉트',
        theme: 'rose',
        headers: ['구분', '개월', '금리', '인센'],
        rows: [
          { id: '1', col1: '무선수', col2: '36개월\n~\n60개월', col3: '6.0%', col4: '0.9%' },
        ],
        footerNotices: [],
      },
      {
        id: 'woori-direct',
        title: '우리카드 다이렉트',
        theme: 'rose',
        headers: ['구분', '개월', '금리', '인센'],
        rows: [
          { id: '1', col1: '무선수', col2: '36개월\n~\n60개월', col3: '4.5%', col4: '1.7%' },
        ],
        footerNotices: [],
      },
      {
        id: 'lotte-direct-low',
        title: '롯데카드 저금리',
        theme: 'rose',
        headers: ['구분', '개월', '금리', '인센'],
        rows: [
          { id: '1', col1: '무선수', col2: '36개월\n48개월\n60개월', col3: '5.5%', col4: '0.5%' },
        ],
        footerNotices: [],
      },
      {
        id: 'woori-direct-low',
        title: '우리카드 저금리',
        theme: 'rose',
        headers: ['구분', '개월', '금리', '인센'],
        rows: [
          { id: '1', col1: '무선수', col2: '36개월\n48개월\n60개월', col3: '3.5%\n3.6%\n3.7%', col4: '0.9%', highlightCol3: true },
        ],
        footerNotices: ['* 인센 월말 지급'],
      },
      {
        id: 'kb-direct',
        title: '국민카드 다이렉트',
        theme: 'rose',
        headers: ['구분', '개월', '금리', '인센'],
        rows: [
          { id: '1', col1: '무선수', col2: '36개월\n~\n60개월', col3: '4.8%', col4: '1.4%' },
        ],
        footerNotices: [],
      },
      {
        id: 'hana-direct',
        title: '하나카드 다이렉트',
        theme: 'rose',
        headers: ['구분', '개월', '금리', '인센'],
        rows: [
          { id: '1', col1: '무선수', col2: '36개월\n~\n60개월', col3: '4.4%', col4: '1.3%' },
          { id: '2', col1: '선수 10%', col2: '36개월\n~\n60개월', col3: '4.3%', col4: '1.3%' },
          { id: '3', col1: '선수 20%', col2: '36개월\n~\n60개월', col3: '4.2%', col4: '1.3%' },
          { id: '4', col1: '선수 30%', col2: '36개월\n~\n60개월', col3: '4.1%', col4: '1.3%' },
        ],
        footerNotices: [],
      },
      {
        id: 'kb-direct-low',
        title: '국민카드 다이렉트',
        theme: 'rose',
        headers: ['구분', '개월', '금리', '인센'],
        rows: [
          { id: '1', col1: '무선수', col2: '36개월\n~\n60개월', col3: '4.3%', col4: '0.5%' },
        ],
        footerNotices: ['* 수수료 익월 15일 카드사 지급'],
      },
      {
        id: 'hana-direct-low',
        title: '하나카드 저금리',
        theme: 'rose',
        headers: ['구분', '개월', '금리', '인센'],
        rows: [
          { id: '1', col1: '무선수', col2: '36개월', col3: '3.8%', col4: '0.6%', highlightCol3: true },
          { id: '2', col1: '선수 10%', col2: '~', col3: '3.7%', col4: '0.6%', highlightCol3: true },
          { id: '3', col1: '선수 20%', col2: '60개월', col3: '3.6%', col4: '0.6%', highlightCol3: true },
        ],
        footerNotices: ['* 캐시백 진행시 고객 0.9% / 인센 0.3%'],
      },
      {
        id: 'shinhan-direct',
        title: '신한카드 다이렉트',
        theme: 'rose',
        headers: ['구분', '개월', '금리', '인센'],
        rows: [
          { id: '1', col1: '무선수', col2: '36개월\n48개월\n60개월', col3: '3.9%\n4.0%\n4.1%', col4: '0.3%' },
        ],
        footerNotices: ['* 신한은행계좌로 자동이체시 0.1% 할인'],
      },
    ],
  },
  autoInstallmentSection: {
    title: '오토할부',
    subTitle: '대출기록 O / 중도상환수수료 O / 원리금균등상환',
    blocks: [
      {
        id: 'lotte-auto',
        title: '롯데카드 오토할부',
        theme: 'green',
        headers: ['구분', '개월', '금리', '인센'],
        rows: [
          { id: '1', col1: '무선수', col2: '36개월', col3: '5.4%', col4: '1.7%' },
          { id: '2', col1: '무선수', col2: '60개월', col3: '4.9%', col4: '0.5%' },
        ],
        footerNotices: ['* 공동명의시 직계가족만 진행 가능'],
      },
      {
        id: 'hana-auto',
        title: '하나카드 오토할부',
        theme: 'green',
        headers: ['구분', '개월', '금리', '인센'],
        rows: [
          { id: '1', col1: '무선수', col2: '36개월\n~\n72개월', col3: '4.6%', col4: '1.9%' },
          { id: '2', col1: '선수 10%', col2: '36개월\n~\n72개월', col3: '4.5%', col4: '1.9%' },
          { id: '3', col1: '선수 20%', col2: '36개월\n~\n72개월', col3: '4.4%', col4: '1.9%' },
          { id: '4', col1: '선수 30%', col2: '36개월\n~\n72개월', col3: '4.3%', col4: '1.9%' },
        ],
        footerNotices: ['* 전기차, 하이브리드 0.1% 금리인하'],
      },
      {
        id: 'woori-auto',
        title: '우리카드 오토할부',
        theme: 'green',
        headers: ['구분', '개월', '금리', '인센'],
        rows: [
          { id: '1', col1: '무선수', col2: '36개월\n48개월\n60개월', col3: '5.6%\n5.7%\n5.8%', col4: '1.6%' },
          { id: '2', col1: '선수 10%', col2: '36개월\n48개월\n60개월', col3: '5.5%\n5.5%\n5.6%', col4: '1.6%' },
          { id: '3', col1: '선수 30%', col2: '36개월\n48개월\n60개월', col3: '4.4%\n4.8%\n4.9%', col4: '1.6%' },
        ],
        footerNotices: ['* 전기차 0.1% 금리 인하'],
      },
      {
        id: 'hana-auto-low',
        title: '하나카드 저금리',
        theme: 'green',
        headers: ['구분', '개월', '금리', '인센'],
        rows: [
          { id: '1', col1: '무선수', col2: '36개월\n~\n72개월', col3: '4.0%', col4: '0.5%' },
          { id: '2', col1: '선수 10%', col2: '36개월\n~\n72개월', col3: '3.9%', col4: '0.5%' },
          { id: '3', col1: '선수 20%\n선수 30%', col2: '36개월\n~\n72개월', col3: '3.8%', col4: '0.5%' },
        ],
        footerNotices: [],
      },
      {
        id: 'hanabank-installment',
        title: '하나은행 할부',
        theme: 'green',
        headers: ['구분', '개월', '금리', '인센'],
        rows: [
          { id: '1', col1: '무선수', col2: '36개월~\n59개월', col3: '변동', col4: '2.2%' },
          { id: '2', col1: '무선수', col2: '60개월~\n119개월', col3: '변동', col4: '2.4%' },
          { id: '3', col1: '무선수', col2: '120개월', col3: '변동', col4: '2.6%' },
        ],
        footerNotices: [
          '* F4 외국인 할부가능 상품',
          '*변동금리 5~6%',
          '*중도상환 0.7% -> 3년후 면제',
        ],
      },
      {
        id: 'kb-auto',
        title: '국민카드 오토할부',
        theme: 'green',
        headers: ['구분', '개월', '금리', '인센'],
        rows: [
          { id: '1', col1: '무선수', col2: '36개월\n~\n72개월', col3: '5.1%', col4: '1.5%' },
          { id: '2', col1: '선수 10%', col2: '36개월\n~\n72개월', col3: '5.0%', col4: '1.5%' },
          { id: '3', col1: '선수 30%', col2: '36개월\n~\n72개월', col3: '4.9%', col4: '1.5%' },
          { id: '4', col1: '선수 50%', col2: '36개월\n~\n72개월', col3: '4.8%', col4: '1.5%' },
        ],
        footerNotices: [],
      },
      {
        id: 'kb-auto-low',
        title: '국민카드 저금리',
        theme: 'green',
        headers: ['구분', '개월', '금리', '인센'],
        rows: [
          { id: '1', col1: '무선수', col2: '36개월\n~\n72개월', col3: '4.5%', col4: '0.4%' },
          { id: '2', col1: '선수 10%', col2: '36개월\n~\n72개월', col3: '4.4%', col4: '0.4%' },
          { id: '3', col1: '선수 30%', col2: '36개월\n~\n72개월', col3: '4.3%', col4: '0.4%' },
          { id: '4', col1: '선수 50%', col2: '36개월\n~\n72개월', col3: '4.2%', col4: '0.4%' },
        ],
        footerNotices: [],
      },
    ],
  },
};
