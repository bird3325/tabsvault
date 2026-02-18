import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NotionSettings from './components/NotionSettings';
import UserGuide from './components/UserGuide';
import { AppState, Tab, CategoryGroup, ApiConfig } from './types';
import { categorizeTabs } from './services/geminiService';
import { saveTabsToNotion } from './services/notionService';
import BottomNav from './components/BottomNav';
import './index.css';

const MOCK_TABS: Tab[] = [
  { id: '1', title: 'React Documentation - Getting Started', url: 'https://react.dev/learn', favIconUrl: 'https://react.dev/favicon.ico' },
  { id: '2', title: 'Gemini API Reference', url: 'https://ai.google.dev/docs', favIconUrl: 'https://www.gstatic.com/lamda/images/favicon_v2_6efed32312a61cf46473.png' },
  { id: '3', title: 'Tailwind CSS Components', url: 'https://tailwindcss.com/docs', favIconUrl: 'https://tailwindcss.com/favicons/favicon-32x32.png' },
  { id: '4', title: 'MacBook Pro 14 Inch M3 - Apple', url: 'https://www.apple.com/macbook-pro/', favIconUrl: 'https://www.apple.com/favicon.ico' },
  { id: '5', title: 'Sony WH-1000XM5 Review', url: 'https://www.rtings.com/headphones/reviews/sony/wh-1000xm5-wireless', favIconUrl: 'https://www.rtings.com/favicon.ico' },
  { id: '6', title: 'How to build a SaaS in 2024', url: 'https://youtube.com/watch?v=saas-guide', favIconUrl: 'https://www.youtube.com/favicon.ico' },
  { id: '7', title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/', favIconUrl: 'https://www.typescriptlang.org/favicon-32x32.png' },
  { id: '8', title: 'Best Mechanical Keyboards for Coders', url: 'https://wirecutter.com/reviews/best-mechanical-keyboards/', favIconUrl: 'https://www.nytimes.com/wirecutter/favicon.ico' },
  { id: '9', title: 'Notion API Official Docs', url: 'https://developers.notion.com/', favIconUrl: 'https://www.notion.so/images/favicon.ico' },
  { id: '10', title: 'Top 10 AI Tools in 2024', url: 'https://medium.com/ai-tools-list', favIconUrl: 'https://medium.com/favicon.ico' },
  { id: '11', title: 'Vite Guide - Why Vite?', url: 'https://vitejs.dev/guide/why.html', favIconUrl: 'https://vitejs.dev/logo.svg' },
  { id: '12', title: 'Supabase Database Setup', url: 'https://supabase.com/docs', favIconUrl: 'https://supabase.com/favicon.ico' },
];

import { getCurrentTabs, subscribeToTabChanges } from './services/tabService';

import { loadConfig, saveConfig, STORAGE_KEY } from './services/storageService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'settings' | 'guide'>('dashboard');
  const [state, setState] = useState<AppState>(() => {
    return {
      tabs: [],
      threshold: 10,
      config: loadConfig(),
      isAnalyzing: false,
      analysisResult: null,
      syncHistory: [
        { date: '2024-05-20', count: 12 },
        { date: '2024-05-18', count: 8 },
      ]
    };
  });

  // localStorage와 동기화
  useEffect(() => {
    // 변경 리스너: 다른 창(팝업 등)에서 변경 시 실시간 반영
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        console.log("App.tsx: Storage changed");
        const updatedConfig = loadConfig();
        setState(prev => ({ ...prev, config: updatedConfig }));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [toast, setToast] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener('resize', handleResize);

    // 익스텐션 환경 감지 및 클래스 추가
    const isExtensionEnv = typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.id;
    if (isExtensionEnv) {
      document.documentElement.classList.add('is-extension');
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleUpdateConfig = (newConfig: ApiConfig) => {
    saveConfig(newConfig);
    setState(s => ({ ...s, config: newConfig }));
  };

  // 탭 초기 로드 및 변경 구독
  useEffect(() => {
    const updateTabs = async () => {
      const tabs = await getCurrentTabs(MOCK_TABS);
      setState(s => ({ ...s, tabs }));
    };

    updateTabs();
    const unsubscribe = subscribeToTabChanges(updateTabs);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // 탭 개수 감지 로직
    if (state.tabs.length >= state.threshold && !state.isAnalyzing && !state.analysisResult) {
      console.log("탭 과부하 감지! 정리를 제안합니다.");
    }
  }, [state.tabs.length, state.threshold]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSyncToNotion = async (groups: CategoryGroup[]) => {
    try {
      setState(prev => ({ ...prev, isAnalyzing: true }));

      // Notion에 실제 저장
      await saveTabsToNotion(groups, state.tabs, state.config);

      const totalTabs = groups.reduce((acc, g) => acc + g.tabIds.length, 0);
      setToast(`${totalTabs}개의 탭이 Notion 보관함에 저장되었습니다!`);

      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        analysisResult: null,
        tabs: prev.tabs.filter(t => !groups.some(g => g.tabIds.includes(t.id))),
        syncHistory: [{ date: new Date().toLocaleDateString(), count: totalTabs }, ...prev.syncHistory]
      }));
    } catch (error: any) {
      setToast(`오류: ${error.message}`);
      setState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const handleCloseTab = async (tabId: string) => {
    try {
      await import('./services/tabService').then(m => m.closeTab(tabId));
      setState(prev => ({
        ...prev,
        tabs: prev.tabs.filter(t => t.id !== tabId)
      }));
    } catch (error) {
      console.error("탭 닫기 실패:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFF]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto p-8 relative">
        {toast && (
          <div className="fixed top-8 right-8 bg-[#2B2D42] text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <span className="text-xl">🚀</span>
            <span className="font-bold">{toast}</span>
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              tabs={state.tabs}
              isAnalyzing={state.isAnalyzing}
              setIsAnalyzing={(v) => setState(s => ({ ...s, isAnalyzing: v }))}
              analysisResult={state.analysisResult}
              setAnalysisResult={(v) => setState(s => ({ ...s, analysisResult: v }))}
              onSyncToNotion={handleSyncToNotion}
              geminiApiKey={state.config.geminiApiKey}
              openaiApiKey={state.config.openaiApiKey}
              anthropicApiKey={state.config.anthropicApiKey}
              aiModel={state.config.aiModel}
              isConnected={state.config.isConnected}
              onCloseTab={handleCloseTab}
              syncHistory={state.syncHistory}
            />
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#2B2D42]">보관 내역</h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">날짜</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">저장된 탭 수</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">상태</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {state.syncHistory.map((history, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-[#2B2D42]">{history.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{history.count}개 탭</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-green-100 text-green-600 rounded-md text-[10px] font-bold">동기화 완료</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-[#5B6CFF] text-sm font-bold hover:underline">노션에서 보기 ↗</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-[#2B2D42]">환경 설정</h2>
              <NotionSettings
                config={state.config}
                onUpdateConfig={handleUpdateConfig}
              />

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-[#2B2D42] mb-4">자동 감지 규칙</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-bold text-sm">최소 탭 임계값</p>
                      <p className="text-xs text-gray-500">지정한 개수 이상의 탭이 열리면 알림을 표시합니다.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={state.threshold}
                        onChange={(e) => setState(s => ({ ...s, threshold: parseInt(e.target.value) }))}
                        className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                      />
                      <span className="text-sm">개</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && <UserGuide />}
        </div>
      </main>
    </div>
  );
};

export default App;
