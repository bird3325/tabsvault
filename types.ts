
export interface Tab {
  id: string;
  title: string;
  url: string;
  favIconUrl?: string;
}

export interface CategoryGroup {
  name: string;
  tag: string;
  tabIds: string[];
}

export interface AnalysisResult {
  groups: CategoryGroup[];
}

export interface ApiConfig {
  notionApiKey: string;
  notionParentPageId: string;
  geminiApiKey: string;
  openaiApiKey: string;
  anthropicApiKey: string;
  aiModel: string;
  isConnected: boolean;
}

export interface AppState {
  tabs: Tab[];
  threshold: number;
  config: ApiConfig;
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
  syncHistory: { date: string; count: number }[];
}
