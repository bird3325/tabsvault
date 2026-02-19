import { ApiConfig } from '../types';

export const STORAGE_KEY = 'tabsvault_config';

export const saveConfig = (config: ApiConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    // 다른 탭/창에 알리기 위해 커스텀 이벤트 발생 (필요한 경우)
    window.dispatchEvent(new Event('storage_update'));
};

export const clearConfig = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('storage_update'));
};

export const loadConfig = (): ApiConfig => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const config = JSON.parse(saved);

            // Migration: gemini-1.5... / gemini-3... -> gemini-3-flash-preview
            // 잦은 모델 ID 변경 대응: 1.5, 3.0, 3-flash 등 구버전 ID를 모두 최신 Preview 버전으로 마이그레이션
            if (config.aiModel === 'gemini-1.5-flash' ||
                config.aiModel === 'gemini-3.0-flash' ||
                config.aiModel === 'gemini-3-flash') {
                config.aiModel = 'gemini-3-flash-preview';
                saveConfig(config); // Update storage immediately
            }

            return config;
        } catch (e) {
            console.error('Failed to parse config from localStorage', e);
        }
    }
    return {
        notionApiKey: '',
        notionParentPageId: '',
        geminiApiKey: '',
        openaiApiKey: '',
        anthropicApiKey: '',
        aiModel: 'gemini-3-flash-preview', // Default to 3-preview
        isConnected: false
    };
};
