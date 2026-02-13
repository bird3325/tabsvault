import React, { useState, useEffect } from 'react';

const OptionsApp: React.FC = () => {
    const [notionApiKey, setNotionApiKey] = useState('');
    const [notionParentPageId, setNotionParentPageId] = useState('');
    const [geminiApiKey, setGeminiApiKey] = useState('');
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    useEffect(() => {
        // Load settings from chrome.storage
        chrome.storage.local.get(['notionApiKey', 'notionParentPageId', 'geminiApiKey'], (result) => {
            if (result.notionApiKey) setNotionApiKey(result.notionApiKey);
            if (result.notionParentPageId) setNotionParentPageId(result.notionParentPageId);
            if (result.geminiApiKey) setGeminiApiKey(result.geminiApiKey);
        });
    }, []);

    const handleSave = () => {
        setStatus('saving');
        chrome.storage.local.set({
            notionApiKey,
            notionParentPageId,
            geminiApiKey
        }, () => {
            if (chrome.runtime.lastError) {
                setStatus('error');
            } else {
                setStatus('success');
                setTimeout(() => setStatus('idle'), 2000);
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 selection:bg-[#5B6CFF]/10">
            <div className="w-full max-w-xl animate-fade-in">
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white border border-[#F2F4F7] rounded-2xl shadow-sm mb-4">
                        <svg className="w-6 h-6 text-[#1A1A1A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">서비스 설정</h1>
                    <p className="text-[#667085] mt-2 text-sm">TabsVault의 지능형 기능을 활성화하기 위한 API 정보를 입력해 주세요.</p>
                </div>

                {/* Settings Card: Porcelain & Glass Style */}
                <div className="premium-card premium-shadow bg-white p-8 space-y-8">
                    {/* Notion Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <span className="text-lg">📓</span>
                            <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">Notion Integration</h2>
                        </div>
                        <div className="grid gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-[#667085] ml-1 uppercase tracking-tight">Internal Integration Token</label>
                                <input
                                    type="password"
                                    value={notionApiKey}
                                    onChange={(e) => setNotionApiKey(e.target.value)}
                                    placeholder="secret_..."
                                    className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#F2F4F7] rounded-xl text-sm focus:outline-none focus:border-[#5B6CFF] focus:bg-white transition-all placeholder:text-[#98A2B3]"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-[#667085] ml-1 uppercase tracking-tight">Parent Page ID</label>
                                <input
                                    type="text"
                                    value={notionParentPageId}
                                    onChange={(e) => setNotionParentPageId(e.target.value)}
                                    placeholder="32자리 ID 입력"
                                    className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#F2F4F7] rounded-xl text-sm focus:outline-none focus:border-[#5B6CFF] focus:bg-white transition-all placeholder:text-[#98A2B3]"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="h-px bg-[#F2F4F7]"></div>

                    {/* Gemini Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <span className="text-lg">✨</span>
                            <h2 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider">AI Analysis (Gemini)</h2>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-[#667085] ml-1 uppercase tracking-tight">Gemini API Key</label>
                            <input
                                type="password"
                                value={geminiApiKey}
                                onChange={(e) => setGeminiApiKey(e.target.value)}
                                placeholder="AIza..."
                                className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#F2F4F7] rounded-xl text-sm focus:outline-none focus:border-[#5B6CFF] focus:bg-white transition-all placeholder:text-[#98A2B3]"
                            />
                        </div>
                    </section>

                    {/* Action Section */}
                    <div className="pt-4 flex items-center justify-between gap-4">
                        <p className="text-[11px] text-[#98A2B3] font-medium leading-relaxed">
                            입력된 정보는 사용자의 기기에 암호화되어 로컬에만 저장되며, 외부로 전송되지 않습니다.
                        </p>
                        <button
                            onClick={handleSave}
                            disabled={status === 'saving'}
                            className={`min-w-[120px] px-6 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${status === 'success'
                                ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20'
                                : status === 'error'
                                    ? 'bg-[#F43F5E] text-white'
                                    : 'bg-[#1A1A1A] text-white hover:bg-[#333333] shadow-lg shadow-[#1A1A1A]/10'
                                }`}
                        >
                            {status === 'saving' ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : status === 'success' ? (
                                <><span>Check</span> <span>저장 완료</span></>
                            ) : (
                                <span>저장하기</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Footer Section */}
                <footer className="mt-12 text-center">
                    <p className="text-[10px] text-[#98A2B3] font-bold uppercase tracking-[0.2em]">TabsVault • Intellectual Assets Synergy</p>
                </footer>
            </div>
        </div>
    );
};

export default OptionsApp;
