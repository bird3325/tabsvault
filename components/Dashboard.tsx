
import React from 'react';
import { Tab, AnalysisResult, CategoryGroup } from '../types';
import { categorizeTabs } from '../services/geminiService';

interface DashboardProps {
  tabs: Tab[];
  isAnalyzing: boolean;
  setIsAnalyzing: (v: boolean) => void;
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (v: AnalysisResult | null) => void;
  onSyncToNotion: (groups: CategoryGroup[]) => void;
  geminiApiKey: string;
  openaiApiKey: string;
  anthropicApiKey: string;
  aiModel: string;
  isConnected: boolean;
  onCloseTab: (id: string) => void;
  syncHistory: { date: string, count: number }[];
}

const Dashboard: React.FC<DashboardProps> = ({
  tabs,
  isAnalyzing,
  setIsAnalyzing,
  analysisResult,
  setAnalysisResult,
  onSyncToNotion,
  geminiApiKey,
  openaiApiKey,
  anthropicApiKey,
  aiModel,
  isConnected,
  onCloseTab,
  syncHistory
}) => {
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      // 선택된 모델에 따라 API 키 결정
      let activeKey = '';
      if (activeKey === '') { // Placeholder, logic is handled via props/state in real scenario
        if (aiModel.startsWith('gemini')) activeKey = geminiApiKey;
        else if (aiModel.startsWith('gpt')) activeKey = openaiApiKey;
        else if (aiModel.startsWith('claude')) activeKey = anthropicApiKey;
      }

      const result = await categorizeTabs(tabs, activeKey, aiModel);
      setAnalysisResult(result);
    } catch (err: any) {
      alert(err.message || "AI 분류 중 오류가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isOverloaded = tabs.length >= 10;
  const weeklyTotal = syncHistory.reduce((acc, h) => acc + h.count, 0);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#2B2D42]">탭 대시보드</h2>
          <p className="text-gray-500">현재 브라우저에 <span className="font-bold text-[#5B6CFF]">{tabs.length}개</span>의 탭이 열려 있습니다.</p>
        </div>
        {!analysisResult && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`px-6 py-2.5 rounded-lg font-bold text-white shadow-lg transition-all ${isAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5B6CFF] hover:bg-[#4A5BEF] active:scale-95'
              }`}
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI 분석 중...
              </span>
            ) : "지금 자동 정리하기"}
          </button>
        )}
      </header>

      {isOverloaded && !analysisResult && !isAnalyzing && (
        <div className="bg-[#FDB827]/10 border border-[#FDB827]/30 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-[#2B2D42]">탭 과부하 감지!</p>
              <p className="text-sm text-gray-600">탭이 너무 많아 생산성이 떨어질 수 있습니다. AI가 깔끔하게 정리해드릴까요?</p>
            </div>
          </div>
          <button onClick={handleAnalyze} className="text-[#2B2D42] font-bold text-sm underline">예, 분석해주세요</button>
        </div>
      )}

      {analysisResult ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span>🧠 AI 제안 분류</span>
              <span className="bg-[#E2E6FF] text-[#5B6CFF] text-xs px-2 py-1 rounded-md">{analysisResult.groups.length} Groups</span>
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setAnalysisResult(null)}
                className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={() => onSyncToNotion(analysisResult.groups)}
                className="px-6 py-2 bg-[#2B2D42] text-white rounded-lg text-sm font-bold shadow-md hover:opacity-90 active:scale-95"
              >
                Notion에 모두 저장
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisResult.groups.map((group, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 hover:border-[#5B6CFF]/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-2 py-1 bg-[#E2E6FF] text-[#5B6CFF] rounded text-[10px] font-bold mb-1">{group.tag}</span>
                    <h4 className="font-bold text-[#2B2D42]">{group.name}</h4>
                  </div>
                  <span className="text-xs text-gray-400">{group.tabIds.length} tabs</span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {group.tabIds.map(id => {
                    const tab = tabs.find(t => t.id === id);
                    return tab ? (
                      <div key={id} className="flex items-center gap-2 text-xs text-gray-600 p-2 bg-gray-50 rounded-lg group justify-between">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <img src={tab.favIconUrl || 'https://picsum.photos/16/16'} className="w-4 h-4 rounded-sm" alt="icon" />
                          <span className="truncate">{tab.title}</span>
                        </div>
                        <button onClick={() => onCloseTab(tab.id)} className="text-gray-300 hover:text-red-500 transition-colors px-1">✕</button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#2B2D42] mb-4 flex items-center gap-2">
              <span>열린 탭 목록</span>
              <span className="text-xs font-normal text-gray-400">실시간 반영 중</span>
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {tabs.map(tab => (
                <div key={tab.id} className="flex items-center justify-between p-3 bg-gray-50/50 hover:bg-gray-50 rounded-xl group transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={tab.favIconUrl || 'https://picsum.photos/16/16'} className="w-5 h-5 rounded" alt="favicon" />
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-[#2B2D42] truncate">{tab.title}</p>
                      <p className="text-[10px] text-gray-400 truncate">{tab.url}</p>
                    </div>
                  </div>
                  <button onClick={() => onCloseTab(tab.id)} className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 transition-opacity">
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#2B2D42] mb-4">최근 저장 통계</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">누적 저장 탭</span>
                  <span className="font-bold">{weeklyTotal}개</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">주요 카테고리</span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs font-medium">🧩 지식 자산</span>
                </div>
                <div className="w-full h-24 mt-4 flex items-end gap-1.5 px-1 border-b border-gray-50 pb-1">
                  {syncHistory.slice(0, 7).reverse().map((h, i) => (
                    <div
                      key={i}
                      title={`${h.date}: ${h.count}개`}
                      className="flex-1 bg-[#5B6CFF]/20 rounded-t-sm hover:bg-[#5B6CFF] transition-all cursor-pointer group relative"
                      style={{ height: `${Math.min(h.count * 10, 100)}%` }}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-[#2B2D42] text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10">
                        {h.count}개
                      </div>
                    </div>
                  ))}
                  {syncHistory.length === 0 && <div className="text-xs text-gray-300 w-full text-center pb-8 italic">데이터 없음</div>}
                </div>
              </div>
            </div>

            <div className={`rounded-2xl p-6 shadow-lg text-white transition-all duration-500 ${isConnected ? 'bg-[#2B2D42]' : 'bg-gray-400'}`}>
              <p className="text-xs opacity-60 mb-1">Notion 연동 상태</p>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className="font-medium">{isConnected ? 'Notion Inbox 연결됨' : 'Notion 연결 필요'}</span>
              </div>
              <p className="text-xs opacity-70 leading-relaxed italic">
                {isConnected
                  ? '"열려 있는 탭은 산재된 생각입니다. 지식으로 바꿔보세요."'
                  : '설정 페이지에서 Notion API 키를 입력하여 연동을 시작하세요.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
