import { Tab, CategoryGroup, ApiConfig } from "../types";

export const saveTabsToNotion = async (groups: CategoryGroup[], tabs: Tab[], config: ApiConfig): Promise<void> => {
  if (!config.notionApiKey || !config.notionDatabaseId) {
    throw new Error("Notion API 설정이 올바르지 않습니다.");
  }

  // notion-sdk-js를 직접 사용하거나 HTTP Fetch를 사용할 수 있습니다.
  // 여기서는 공식 SDK 스타일의 요청을 시뮬레이션하거나 Fetch를 사용하여 구현합니다.

  for (const group of groups) {
    const groupTabs = tabs.filter(t => group.tabIds.includes(t.id));

    for (const tab of groupTabs) {
      const response = await fetch(`https://api.notion.com/v1/pages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.notionApiKey}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify({
          parent: { database_id: config.notionDatabaseId },
          properties: {
            Title: {
              title: [
                {
                  text: {
                    content: tab.title
                  }
                }
              ]
            },
            URL: {
              url: tab.url
            },
            Category: {
              select: {
                name: group.name
              }
            },
            SavedAt: {
              date: {
                start: new Date().toISOString()
              }
            }
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Notion API Error:", errorData);
        throw new Error(`Notion 저장 중 오류 발생: ${errorData.message || response.statusText}`);
      }
    }
  }
};
