
import { Tab } from "../types";

/**
 * 브라우저 익스텐션 환경에서 실행 중인지 확인합니다.
 */
export const isExtensionEnvironment = (): boolean => {
    return typeof chrome !== 'undefined' && !!chrome.tabs;
};

/**
 * 현재 열려 있는 탭 목록을 가져옵니다.
 * 익스텐션 환경이면 실제 탭을, 아니면 모킹된 탭을 반환합니다.
 */
export const getCurrentTabs = async (mockTabs: Tab[]): Promise<Tab[]> => {
    if (isExtensionEnvironment()) {
        return new Promise((resolve) => {
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                const convertedTabs: Tab[] = tabs.map(t => ({
                    id: String(t.id),
                    title: t.title || "Unknown Title",
                    url: t.url || "",
                    favIconUrl: t.favIconUrl
                }));
                resolve(convertedTabs);
            });
        });
    }

    // 개발 환경에서는 전달받은 MOCK_TABS 반환
    return mockTabs;
};

/**
 * 특정 탭을 닫습니다.
 */
export const closeTab = async (tabId: string): Promise<void> => {
    if (isExtensionEnvironment()) {
        await chrome.tabs.remove(Number(tabId));
        return;
    }
    console.log(`[Mock] 탭 ${tabId}이(가) 닫혔습니다.`);
};

export const subscribeToTabChanges = (callback: () => void) => {
    if (isExtensionEnvironment()) {
        chrome.tabs.onCreated.addListener(callback);
        chrome.tabs.onRemoved.addListener(callback);
        chrome.tabs.onUpdated.addListener(callback);

        return () => {
            chrome.tabs.onCreated.removeListener(callback);
            chrome.tabs.onRemoved.removeListener(callback);
            chrome.tabs.onUpdated.removeListener(callback);
        };
    }
    return () => { };
};
