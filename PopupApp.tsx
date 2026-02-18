import React, { useState, useEffect } from 'react';
import { Tab, AnalysisResult, CategoryGroup, ApiConfig } from './types';
import { categorizeTabs } from './services/geminiService';
import { saveTabsToNotion } from './services/notionService';
import { getCurrentTabs, closeTab, subscribeToTabChanges } from './services/tabService';
import { loadConfig, saveConfig } from './services/storageService';
import NotionSettings from './components/NotionSettings';

import Toast from './components/Toast';

const PopupApp: React.FC = () => {
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [config, setConfig] = useState<ApiConfig>(() => loadConfig());

    const [showSettings, setShowSettings] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'success',
        isVisible: false
    });

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type, isVisible: true });
    };

    const loadConfigLocal = () => {
        const newConfig = loadConfig();
        setConfig(newConfig);
    };

    useEffect(() => {
        const loadTabs = async () => {
            const currentTabs = await getCurrentTabs([]);
            setTabs(currentTabs);
        };
        loadTabs();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'tabsvault_config') {
                loadConfigLocal();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        const tabUnsub = subscribeToTabChanges(loadTabs);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            tabUnsub();
        };
    }, []);

    const handleAnalyze = async () => {
        if (!config || !config.isConnected) return setShowSettings(true);
        setIsAnalyzing(true);
        try {
            let activeKey = '';
            const model = config.aiModel;
            if (model.startsWith('gemini')) activeKey = config.geminiApiKey;
            else if (model.startsWith('gpt')) activeKey = config.openaiApiKey;
            else if (model.startsWith('claude')) activeKey = config.anthropicApiKey;

            const result = await categorizeTabs(tabs, activeKey, model);
            setAnalysisResult(result);
            showToast('AI 분석이 완료되었습니다.', 'success');
        } catch (err: any) {
            showToast(err.message, 'error');
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
            showToast('성공적으로 저장되었습니다!', 'success');
        } catch (err: any) {
            showToast(err.message, 'error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="w-full h-[600px] flex flex-col bg-white relative overflow-hidden selection:bg-[#5B6CFF]/10">
            {/* Header */}
            <header className="px-5 py-5 bg-[#5B6CFF] flex-shrink-0 z-20 shadow-lg shadow-[#5B6CFF]/20">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-white/20 border border-white/20 rounded-lg flex items-center justify-center font-bold shadow-inner backdrop-blur-sm">
                            <span className="text-xs text-white">TV</span>
                        </div>
                        <div>
                            <h1 className="text-sm font-bold tracking-tight text-white">TabsVault</h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${config?.isConnected ? 'bg-[#98FF98]' : 'bg-[#FF9898]'}`}></div>
                                <span className="text-[10px] text-white/70 font-medium uppercase tracking-tight">
                                    {config?.isConnected ? 'Neural Sync Ready' : 'Sync Required'}
                                </span>
                            </div>
                        </div>
                    </div>
                    {showSettings ? (
                        <button
                            onClick={() => setShowSettings(false)}
                            className="text-[11px] font-bold text-white/80 hover:text-white transition-colors"
                        >
                            닫기
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowSettings(true)}
                            className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all active:scale-95"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
                            </svg>
                        </button>
                    )}
                </div>

                {!analysisResult && !showSettings && (
                    <div className="mt-5 flex items-center justify-between gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 bg-white/10 border border-white/10 rounded-xl overflow-hidden relative backdrop-blur-sm">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-white/60 font-semibold uppercase tracking-wider">Buffer</span>
                                <span className="text-lg font-bold text-white leading-tight mt-0.5">{tabs.length} 탭</span>
                            </div>
                            <div className="w-px h-6 bg-white/10"></div>
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                                className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-white rounded-lg text-xs font-bold text-[#5B6CFF] hover:bg-white/90 transition-all disabled:opacity-50 relative group shadow-lg shadow-white/5"
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

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 relative bg-white custom-scrollbar">
                {showSettings ? (
                    <div className="space-y-6 animate-fade-in px-1">
                        <div>
                            <h3 className="font-bold text-[#101828] text-sm">환경 설정</h3>
                            <p className="text-[11px] text-[#667085] mt-0.5">API 키 및 엔진을 구성하세요.</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                            <NotionSettings
                                config={config}
                                onUpdateConfig={(newConfig) => {
                                    saveConfig(newConfig);
                                    setConfig(newConfig);
                                    // NotionSettings handles the alert/toast internally or we can do it here via onUpdateConfig callback wrapper if needed.
                                    // Actually NotionSettings accepts onUpdateConfig which takes the FULL config.
                                    // NotionSettings internal handleSave calls onUpdateConfig.
                                    // let's verify NotionSettings implementation.
                                    // It calls updateConfig which calls onUpdateConfig.
                                    // So we just save it here.
                                    showToast('설정이 저장되었습니다.', 'success');
                                    setShowSettings(false);
                                }}
                            />
                        </div>
                    </div>
                ) : analysisResult ? (
                    <div className="space-y-4 animate-fade-in">
// ... (rest of the analysisResult view remains same)
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
                                            <p className="text-[9px] text-[#667085] truncate mt-0.5 font-medium tracking-tight">
                                                {(() => {
                                                    try {
                                                        return new URL(tab.url).hostname || tab.url;
                                                    } catch {
                                                        return tab.url || 'Internal Page';
                                                    }
                                                })()}
                                            </p>
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
            <footer className="px-5 py-4 bg-[#F9FAFB] border-t border-[#F2F4F7] flex justify-center items-center flex-shrink-0">
                <span className="text-[9px] font-bold text-[#98A2B3] uppercase tracking-widest tracking-widest">
                    TabsVault • Intellectual Assets
                </span>
            </footer>
            {/* Toast Notification */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
};

export default PopupApp;
