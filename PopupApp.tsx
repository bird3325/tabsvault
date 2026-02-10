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
        const savedConfig = localStorage.getItem('tabsvault_config');
        if (savedConfig) setConfig(JSON.parse(savedConfig));

        const loadTabs = async () => {
            const currentTabs = await getCurrentTabs([]);
            setTabs(currentTabs);
        };
        loadTabs();
        return subscribeToTabChanges(loadTabs);
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
        <div className="w-full h-full flex flex-col bg-[#F8FAFF] relative overflow-hidden">
            {/* Premium Gradient Header */}
            <header className="p-6 premium-gradient text-white shadow-xl relative z-20">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#5B6CFF] rounded-xl flex items-center justify-center font-bold shadow-lg shadow-[#5B6CFF]/30 text-white border border-white/10">TV</div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight leading-none">TabVault</h1>
                            <p className="text-[10px] text-white/40 mt-1 uppercase font-bold tracking-widest">Intelligent Tab Manager</p>
                        </div>
                    </div>
                    <button
                        onClick={() => chrome.runtime.openOptionsPage()}
                        className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/15 rounded-xl transition-all border border-white/10 active:scale-95"
                    >
                        <span className="text-lg">⚙️</span>
                    </button>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <div>
                        <p className="text-white/60 text-xs font-medium">Active Tabs</p>
                        <p className="text-2xl font-bold text-white leading-none mt-1">{tabs.length}</p>
                    </div>
                </div>

                {!analysisResult && (
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="mt-6 w-full py-4.5 bg-[#5B6CFF] hover:bg-[#4A5BEF] disabled:bg-white/10 rounded-2xl font-bold shadow-2xl shadow-[#5B6CFF]/40 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                        {isAnalyzing ? (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                                <span className="text-sm tracking-tight text-white/90">AI가 당신의 탭을 분석 중...</span>
                            </div>
                        ) : (
                            <>
                                <span className="text-lg group-hover:rotate-12 transition-transform">✨</span>
                                <span className="text-sm tracking-tight">지금 즉시 AI 자동 정리</span>
                            </>
                        )}
                    </button>
                )}
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-5 custom-scrollbar relative bg-[#F8FAFF]/50">
                {analysisResult ? (
                    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center px-1">
                            <div>
                                <h3 className="font-black text-[#2B2D42] text-lg">AI 제안 분류</h3>
                                <p className="text-[10px] text-gray-400 font-medium">가장 효율적인 3가지 그룹을 찾았습니다.</p>
                            </div>
                            <button
                                onClick={() => setAnalysisResult(null)}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-lg text-xs font-bold transition-all"
                            >
                                취소
                            </button>
                        </div>

                        <div className="space-y-3">
                            {analysisResult.groups.map((group, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 hover:border-[#5B6CFF]/30 transition-all group/card hover:shadow-md">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-[#5B6CFF]/5 flex items-center justify-center text-xl group-hover/card:scale-110 transition-transform">
                                                {group.tag}
                                            </div>
                                            <div>
                                                <span className="font-black text-sm text-[#2B2D42] block">{group.name}</span>
                                                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{group.tabIds.length} Tabs Included</span>
                                            </div>
                                        </div>
                                        <div className="w-6 h-6 rounded-full border-2 border-gray-100 flex items-center justify-center group-hover/card:border-[#5B6CFF] transition-all">
                                            <div className="w-2.5 h-2.5 bg-[#5B6CFF] rounded-sm opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => handleSave(analysisResult.groups)}
                                className="w-full py-4.5 bg-[#2B2D42] text-white rounded-2xl font-bold shadow-xl hover:shadow-[#2B2D42]/20 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <span>🚀</span>
                                <span>Notion에 지식으로 저장하기</span>
                            </button>
                            <p className="text-center text-[9px] text-gray-400 mt-3 font-medium px-4">저장 즉시 해당 탭들은 닫히며 Notion Inbox로 안전하게 보관됩니다.</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Active Sessions</h3>
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#5B6CFF]/20"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#5B6CFF]/40"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#5B6CFF]"></span>
                            </div>
                        </div>

                        <div className="space-y-2.5 pb-2">
                            {tabs.length === 0 ? (
                                <div className="py-20 text-center">
                                    <p className="text-3xl mb-3 opacity-20">📭</p>
                                    <p className="text-xs text-gray-400 font-medium">열려 있는 탭이 없습니다.</p>
                                </div>
                            ) : tabs.map((tab) => (
                                <div key={tab.id} className="flex items-center justify-between p-3.5 bg-white rounded-2xl shadow-sm border border-transparent hover:border-[#5B6CFF]/20 hover:shadow-md transition-all group cursor-pointer active:scale-[0.99]">
                                    <div className="flex items-center gap-3.5 overflow-hidden">
                                        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#5B6CFF]/5 transition-colors border border-gray-100/50">
                                            <img src={tab.favIconUrl || 'https://picsum.photos/16/16'} className="w-4.5 h-4.5 rounded-sm shadow-sm" alt="" onError={(e) => (e.currentTarget.src = 'https://picsum.photos/16/16')} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[12px] font-bold text-[#2B2D42] truncate group-hover:text-[#5B6CFF] transition-colors leading-tight">{tab.title}</p>
                                            <p className="text-[9px] text-gray-400 truncate opacity-60 mt-0.5">{tab.url}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                                        className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <span className="text-[10px]">✕</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Glass Footer */}
            <footer className="p-4 glass backdrop-blur-3xl flex justify-center items-center z-10">
                <div className="flex items-center gap-2.5 px-4 py-2 bg-white/50 rounded-full border border-white/40 shadow-sm">
                    <div className="relative">
                        <div className={`w-2 h-2 rounded-full ${config?.isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-400 animate-pulse'}`}></div>
                    </div>
                    <span className="text-[10px] text-[#2B2D42] font-black tracking-tight uppercase">
                        {config?.isConnected ? 'Notion Core Engine Connected' : 'Connection Required'}
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default PopupApp;
