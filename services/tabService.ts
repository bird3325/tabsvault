
import { Tab, CategoryGroup } from "../types";

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


/**
 * 주어진 그룹 정보에 따라 브라우저 탭을 그룹화합니다.
 */
export const groupTabs = async (groups: CategoryGroup[]): Promise<void> => {
    if (!isExtensionEnvironment()) {
        console.log('[Mock] 브라우저 탭 그룹화가 실행되었습니다.', groups);
        return;
    }

    try {
        for (const group of groups) {
            if (group.tabIds.length === 0) continue;

            const tabIds = group.tabIds.map(id => Number(id));

            // 1. 탭들을 그룹으로 묶음
            // chrome.tabs.group returns the groupId in the callback or promise
            const groupId = await new Promise<number>((resolve) => {
                chrome.tabs.group({ tabIds: tabIds as any }, (id) => resolve(id));
            });

            // 2. 그룹 메타데이터(이름, 색상) 업데이트
            // 가능한 색상: "grey", "blue", "red", "yellow", "green", "pink", "purple", "cyan", "orange"
            const colors: string[] = ["blue", "red", "yellow", "green", "pink", "purple", "cyan", "orange"];
            const randomColor = colors[Math.floor(Math.random() * colors.length)] as any;

            await chrome.tabGroups.update(groupId, {
                title: group.name,
                color: randomColor
            });
        }
    } catch (error) {
        console.error('Failed to group tabs:', error);
        throw error;
    }
};

/**
 * 현재 윈도우의 모든 탭 그룹을 해제합니다.
 */
export const ungroupCurrentTabs = async (): Promise<void> => {
    if (!isExtensionEnvironment()) {
        console.log('[Mock] 탭 그룹 해제가 실행되었습니다.');
        return;
    }

    try {
        // 현재 윈도우의 모든 탭 조회
        const tabs = await new Promise<chrome.tabs.Tab[]>((resolve) => {
            chrome.tabs.query({ currentWindow: true }, (tabs) => resolve(tabs));
        });

        const tabIds = tabs.map(t => t.id).filter((id): id is number => id !== undefined);

        if (tabIds.length > 0) {
            await chrome.tabs.ungroup(tabIds as any);
        }
    } catch (error) {
        console.error('Failed to ungroup tabs:', error);
        throw error;
    }
};
