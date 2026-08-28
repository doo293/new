import React from 'react';
import { X, CheckCircle2, FileSpreadsheet, Sparkles, Copy, ArrowRight, ShieldCheck } from 'lucide-react';

interface QuickUsageGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickUsageGuide: React.FC<QuickUsageGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              업무 효율 10배 높이는 초간단 사용법
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              1
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs mb-1">
                구글 스프레드시트에서 행 복사 (Ctrl+C)
              </h3>
              <p className="text-slate-600">
                작업 중인 구글 시트 또는 엑셀에서 증액완료/할부완료된 고객의 <strong>한 행(또는 여러 행)</strong>을 드래그하여 <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono">Ctrl + C</kbd> 로 복사합니다.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              2
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs mb-1">
                이 프로그램에 붙여넣기 (Ctrl+V)
              </h3>
              <p className="text-slate-600">
                화면 어디서든 <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono">Ctrl + V</kbd>를 누르거나 상단의 <strong>[클립보드 붙여넣기]</strong> 버튼을 누르면 끝!
              </p>
              <p className="text-teal-700 font-medium mt-1">
                👉 카드사(우리/국민/신한 등), 고객명, 결제금액, 할부조건, 3.3% 원천징수 세금 후 실지급액이 0.1초 만에 자동 계산됩니다.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-6 h-6 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
              3
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs mb-1">
                상황별 탭 선택 & [양식 복사하기]
              </h3>
              <p className="text-slate-600">
                <strong>[결제준비 (기본)]</strong>, <strong>[할부완료]</strong>, <strong>[증액완료]</strong>, <strong>[고객 발송용 카톡]</strong>, <strong>[딜러 전달용]</strong> 탭을 클릭하여 원하는 문구를 확인한 뒤 <kbd className="px-1.5 py-0.5 rounded bg-teal-700 text-white font-semibold">양식 복사하기</kbd>를 누르세요.
              </p>
            </div>
          </div>

          {/* Special Feature */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>자주 묻는 질문 & 핵심 기능</span>
            </h4>
            <ul className="space-y-1.5 text-emerald-800">
              <li>• <strong>원천징수 3.3% 자동 계산</strong>: 결제금액 × 요율% 에서 3.3% 세금을 자동 공제한 실입금액(255,868원)을 정확히 계산합니다.</li>
              <li>• <strong>다건 일괄 복사</strong>: 10개 행을 한 번에 복사해 붙여넣으면 [전체 일괄 복사] 버튼으로 모든 안내문을 한 번에 복사할 수 있습니다.</li>
              <li>• <strong>문구 커스텀</strong>: 상단 [양식 관리]에서 카드사마다 원하는 문구와 양식을 자유롭게 수정 및 영구 저장할 수 있습니다.</li>
            </ul>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-sm cursor-pointer"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
};
