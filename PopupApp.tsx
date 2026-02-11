import React, { useState, useEffect } from 'react';
import { Tab, AnalysisResult, CategoryGroup, ApiConfig } from './types';
import { categorizeTabs } from './services/geminiService';
import { saveTabsToNotion } from './services/notionService';
import { getCurrentTabs, closeTab, subscribeToTabChanges } from './services/tabService';

const PopupApp: React.FC = () => {
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [config, setConfig] = useState<ApiConfig | null>(null);

    useEffect(() => {
        const loadConfig = () => {
            chrome.storage.local.get(['notionApiKey', 'notionParentPageId', 'geminiApiKey'], (result) => {
                const newConfig: ApiConfig = {
                    notionApiKey: (result.notionApiKey as string) || '',
                    notionParentPageId: (result.notionParentPageId as string) || '',
                    geminiApiKey: (result.geminiApiKey as string) || '',
                    openaiApiKey: '',
                    anthropicApiKey: '',
                    aiModel: 'gemini-1.5-pro',
                    isConnected: !!(result.notionApiKey && result.geminiApiKey)
                };
                setConfig(newConfig);
            });
        };

        loadConfig();

        const loadTabs = async () => {
            const currentTabs = await getCurrentTabs([]);
            setTabs(currentTabs);
        };
        loadTabs();

        // Listen for storage changes to update config in real-time if options page is used
        const handleStorageChange = (changes: any) => {
            if (changes.notionApiKey || changes.notionParentPageId || changes.geminiApiKey) {
                loadConfig();
            }
        };
        chrome.storage.onChanged.addListener(handleStorageChange);

        const tabUnsub = subscribeToTabChanges(loadTabs);

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
            tabUnsub();
        };
    }, []);

    const handleAnalyze = async () => {
        if (!config) return alert('설정 페이지에서 API 키를 먼저 설정해주세요.');
        setIsAnalyzing(true);
        try {
            let activeKey = '';
            const model = config.aiModel;
            if (model.startsWith('gemini')) activeKey = config.geminiApiKey;
            else if (model.startsWith('gpt')) activeKey = config.openaiApiKey;
            else if (model.startsWith('claude')) activeKey = config.anthropicApiKey;

            const result = await categorizeTabs(tabs, activeKey, model);
            setAnalysisResult(result);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSave = async (groups: CategoryGroup[]) => {
        if (!config) return;
        setIsAnalyzing(true);
        try {
            await saveTabsToNotion(groups, tabs, config);
            setAnalysisResult(null);
            // 저장 후 탭 목록 갱신은 subscribeToTabChanges가 처리할 것임 (탭이 닫히므로)
            alert('성공적으로 저장되었습니다!');
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-white relative overflow-hidden selection:bg-[#5B6CFF]/10">
            {/* Header: Minimal & Precise (Notion/Cron Style) */}
            <header className="px-5 py-5 bg-white border-b border-[#F2F4F7] relative z-20">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#F9FAFB] border border-[#F2F4F7] rounded-lg flex items-center justify-center font-bold shadow-sm">
                            <span className="text-xs text-[#1A1A1A]">TV</span>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold tracking-tight text-[#1A1A1A]">TabsVault</h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${config?.isConnected ? 'bg-[#5B6CFF]' : 'bg-[#F43F5E]'}`}></div>
                                <span className="text-[10px] text-[#667085] font-medium uppercase tracking-tight">
                                    {config?.isConnected ? 'Neural Sync Ready' : 'Sync Required'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => chrome.runtime.openOptionsPage()}
                        className="w-8 h-8 flex items-center justify-center text-[#667085] hover:text-[#1A1A1A] hover:bg-[#F9FAFB] rounded-lg transition-all active:scale-95"
                    >
                        <span className="text-sm">⚙️</span>
                    </button>
                </div>

                {!analysisResult && (
                    <div className="mt-5 flex items-center justify-between gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 bg-[#F9FAFB] border border-[#F2F4F7] rounded-xl overflow-hidden relative">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-[#667085] font-semibold uppercase tracking-wider">Buffer</span>
                                <span className="text-lg font-bold text-[#1A1A1A] leading-tight mt-0.5">{tabs.length} 탭</span>
                            </div>
                            <div className="w-px h-6 bg-[#EAECF0]"></div>
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-white border border-[#D0D5DD] rounded-lg text-xs font-bold text-[#344054] hover:bg-[#F9FAFB] hover:border-[#98A2B3] transition-all disabled:opacity-50 relative group"
                            >
                                {isAnalyzing ? (
                                    <div className="w-4 h-4 border-2 border-[#EAECF0] border-t-[#5B6CFF] rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>✨</span>
                                        <span>AI 정리 실행</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content: Focused & Organized (Linear Style) */}
            <main className="flex-1 overflow-y-auto p-4 relative bg-white custom-scrollbar">
                {analysisResult ? (
                    <div className="space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center px-1">
                            <div>
                                <h3 className="font-bold text-[#101828] text-sm">AI 정리 제안</h3>
                                <p className="text-[11px] text-[#667085] mt-0.5">{analysisResult.groups.length}개의 논리적 그룹 생성됨</p>
                            </div>
                            <button
                                onClick={() => setAnalysisResult(null)}
                                className="text-[11px] font-semibold text-[#5B6CFF] hover:underline"
                            >
                                되돌리기
                            </button>
                        </div>

                        <div className="space-y-2">
                            {analysisResult.groups.map((group, idx) => (
                                <div key={idx} className="premium-card p-3 flex items-center justify-between group/card" style={{ animationDelay: `${idx * 0.05}s` }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-[#F9FAFB] border border-[#F2F4F7] flex items-center justify-center text-lg group-hover/card:bg-white transition-all">
                                            {group.tag}
                                        </div>
                                        <div>
                                            <span className="font-bold text-xs text-[#1A1A1A] block">{group.name}</span>
                                            <span className="text-[10px] text-[#667085] block mt-0.5">{group.tabIds.length}개 탭 통합</span>
                                        </div>
                                    </div>
                                    <div className="px-2 py-1 bg-[#F9FAFB] rounded-md border border-[#F2F4F7] text-[9px] font-bold text-[#667085] group-hover/card:bg-[#5B6CFF] group-hover/card:text-white group-hover/card:border-[#5B6CFF] transition-all">
                                        SAVE
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => handleSave(analysisResult.groups)}
                                className="w-full py-3.5 bg-[#1A1A1A] text-white rounded-xl font-bold text-xs shadow-sm shadow-[#1A1A1A]/10 hover:bg-[#333333] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <span>🛡️</span>
                                <span>Notion 워크스페이스에 즉시 보관</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="text-[10px] font-bold text-[#98A2B3] uppercase tracking-[0.08em]">Active Buffers</h3>
                        </div>

                        <div className="space-y-1.5 pb-4">
                            {tabs.length === 0 ? (
                                <div className="py-20 text-center bg-[#F9FAFB] border border-dashed border-[#EAECF0] rounded-2xl animate-fade-in">
                                    <p className="text-2xl mb-2 grayscale opacity-30">🗂️</p>
                                    <p className="text-[11px] text-[#98A2B3] font-medium">관리할 탭이 비어 있습니다.</p>
                                </div>
                            ) : tabs.map((tab, idx) => (
                                <div
                                    key={tab.id}
                                    className="flex items-center justify-between p-2.5 bg-white hover:bg-[#F9FAFB] border border-transparent hover:border-[#F2F4F7] rounded-xl transition-all group cursor-pointer animate-fade-in"
                                    style={{ animationDelay: `${idx * 0.02}s` }}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-[#F2F4F7] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-none transition-all">
                                            <img
                                                src={tab.favIconUrl || 'https://www.google.com/s2/favicons?domain=google.com'}
                                                className="w-4 h-4 rounded-sm"
                                                alt=""
                                                onError={(e) => (e.currentTarget.src = 'https://www.google.com/s2/favicons?domain=google.com')}
                                            />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs font-bold text-[#344054] truncate group-hover:text-[#5B6CFF] transition-colors leading-tight">{tab.title}</p>
                                            <p className="text-[9px] text-[#667085] truncate mt-0.5 font-medium tracking-tight">{new URL(tab.url).hostname}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                                        className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-[#98A2B3] hover:text-[#F43F5E] hover:bg-white rounded-md border border-transparent hover:border-[#EAECF0] transition-all"
                                    >
                                        <span className="text-[8px]">✕</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Footer: Subtle & Clean */}
            <footer className="px-5 py-4 bg-[#F9FAFB] border-t border-[#F2F4F7] flex justify-center items-center">
                <span className="text-[9px] font-bold text-[#98A2B3] uppercase tracking-widest tracking-widest">
                    TabsVault • Intellectual Assets
                </span>
            </footer>
        </div>
    );
};

export default PopupApp;
