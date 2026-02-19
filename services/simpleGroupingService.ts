import { Tab, CategoryGroup } from '../types';

/**
 * Tabs are grouped by domain (hostname).
 * AI is not used, and it is performed with pure rule-based logic.
 *
 * @param tabs List of tabs to group
 * @returns Grouped CategoryGroup list
 */
export const groupTabsByDomain = (tabs: Tab[]): CategoryGroup[] => {
    const groups: { [key: string]: string[] } = {};
    const domainNames: { [key: string]: string } = {};

    tabs.forEach(tab => {
        try {
            const url = new URL(tab.url);
            const hostname = url.hostname;

            // Remove 'www.' and use it as the key
            const domainKey = hostname.replace(/^www\./, '');

            if (!groups[domainKey]) {
                groups[domainKey] = [];
                // Simple naming: Use the domain name as the group name
                domainNames[domainKey] = hostname;
            }
            groups[domainKey].push(tab.id);
        } catch (e) {
            // If URL parsing fails, group as 'Other'
            const key = 'others';
            if (!groups[key]) {
                groups[key] = [];
                domainNames[key] = '기타';
            }
            groups[key].push(tab.id);
        }
    });

    // Convert to CategoryGroup array
    return Object.keys(groups).map(key => ({
        name: domainNames[key],
        tag: '🌐', // Icon for domain grouping
        tabIds: groups[key]
    })).sort((a, b) => b.tabIds.length - a.tabIds.length); // Sort by number of tabs
};
