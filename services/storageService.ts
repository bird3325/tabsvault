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
            return JSON.parse(saved);
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
        aiModel: 'gemini-1.5-flash',
        isConnected: false
    };
};
