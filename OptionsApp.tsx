import React, { useState, useEffect } from 'react';
import Toast from './components/Toast';
import { loadConfig, saveConfig } from './services/storageService';
import NotionSettings from './components/NotionSettings';
import { ApiConfig } from './types';

const OptionsApp: React.FC = () => {
    const [config, setConfig] = useState<ApiConfig>(() => loadConfig());
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
        message: '',
        type: 'success',
        isVisible: false
    });

    useEffect(() => {
        // Load settings from storageService
        const result = loadConfig();
        setConfig(result);
    }, []);

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type, isVisible: true });
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
                    <NotionSettings
                        config={config}
                        onUpdateConfig={(newConfig) => {
                            saveConfig(newConfig);
                            setConfig(newConfig);
                            showToast('설정이 저장되었습니다.', 'success');
                        }}
                    />
                </div>

                {/* Footer Section */}
                <footer className="mt-12 text-center">
                    <p className="text-[10px] text-[#98A2B3] font-bold uppercase tracking-[0.2em]">TabsVault • Intellectual Assets Synergy</p>
                </footer>
            </div>
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

export default OptionsApp;
