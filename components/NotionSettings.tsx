
import React, { useState } from 'react';
import { ApiConfig } from '../types';

interface ApiSettingsProps {
  config: ApiConfig;
  onUpdateConfig: (config: ApiConfig) => void;
}

const NotionSettings: React.FC<ApiSettingsProps> = ({ config, onUpdateConfig }) => {
  const updateConfig = (newConfig: Partial<ApiConfig>) => {
    const updated = { ...config, ...newConfig };
    onUpdateConfig(updated as ApiConfig);
  };
  const [notionApiKey, setNotionApiKey] = useState(config.notionApiKey);
  // @ts-ignore: 하위 호환성을 위해 구형 키 확인
  const [notionDatabaseId, setNotionDatabaseId] = useState(config.notionParentPageId || config.notionDatabaseId || '');
  const [geminiApiKey, setGeminiApiKey] = useState(config.geminiApiKey);
  const [openaiApiKey, setOpenaiApiKey] = useState(config.openaiApiKey || '');
  const [anthropicApiKey, setAnthropicApiKey] = useState(config.anthropicApiKey || '');
  const [aiModel, setAiModel] = useState(config.aiModel || 'gemini-1.5-flash');
  const [isSaving, setIsSaving] = useState(false);

  // Visibility States
  const [showGemini, setShowGemini] = useState(false);
  const [showOpenai, setShowOpenai] = useState(false);
  const [showAnthropic, setShowAnthropic] = useState(false);
  const [showNotion, setShowNotion] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateConfig({
        notionApiKey,
        notionParentPageId: notionDatabaseId, // 인터페이스 통일
        // notionDatabaseId, // 하위 호환성 유지 (Removed as it's not needed for updateConfig)
        geminiApiKey,
        openaiApiKey,
        anthropicApiKey,
        aiModel,
        isConnected: notionApiKey.length > 5 && notionDatabaseId.length > 5
      });
      setIsSaving(false);
      alert("설정이 저장되었습니다.");
    }, 800);
  };

  const ToggleIcon = ({ show }: { show: boolean }) => (
    show ? (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    ) : (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
    )
  );

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* AI Model Core Engine Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-3 bg-gray-50/50">
          <div className="w-6 h-6 bg-[#5B6CFF]/10 rounded-lg flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-[#5B6CFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" /><path d="M12 6v6l4 2" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-[#2B2D42]">AI 엔진 설정</h3>
        </div>

        <div className="p-4 space-y-3">
          {/* AI Engine Model Selection Dropdown */}
          <div>
            <div className="relative">
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-xs font-bold text-[#2B2D42] focus:ring-2 focus:ring-[#5B6CFF]/20 focus:border-[#5B6CFF] outline-none transition-all bg-white cursor-pointer hover:bg-gray-50"
              >
                <optgroup label="Google Gemini">
                  <option value="gemini-3-flash-preview">Gemini 3.0 Flash (Preview)</option>
                  <option value="gemini-3-pro-preview">Gemini 3.0 Pro (Preview)</option>
                </optgroup>
                <optgroup label="OpenAI GPT">
                  <option value="gpt-4o-mini">GPT-4o mini</option>
                  <option value="gpt-4o">GPT-4o</option>
                </optgroup>
                <optgroup label="Anthropic Claude">
                  <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</option>
                </optgroup>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Conditional API Key Input based on Selected Model */}
          {aiModel.startsWith('gemini') && (
            <div className="relative group">
              <input
                type={showGemini ? "text" : "password"}
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="Gemini API Key"
                className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#5B6CFF]/20 focus:border-[#5B6CFF] outline-none font-mono text-xs transition-all placeholder:text-gray-400"
              />
              <button
                onClick={() => setShowGemini(!showGemini)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#5B6CFF] transition-colors p-1"
              >
                <ToggleIcon show={showGemini} />
              </button>
            </div>
          )}

          {aiModel.startsWith('gpt') && (
            <div className="relative group">
              <input
                type={showOpenai ? "text" : "password"}
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                placeholder="OpenAI API Key (sk-...)"
                className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#5B6CFF]/20 focus:border-[#5B6CFF] outline-none font-mono text-xs transition-all placeholder:text-gray-400"
              />
              <button
                onClick={() => setShowOpenai(!showOpenai)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#5B6CFF] transition-colors p-1"
              >
                <ToggleIcon show={showOpenai} />
              </button>
            </div>
          )}

          {aiModel.startsWith('claude') && (
            <div className="relative group">
              <input
                type={showAnthropic ? "text" : "password"}
                value={anthropicApiKey}
                onChange={(e) => setAnthropicApiKey(e.target.value)}
                placeholder="Anthropic API Key (sk-ant-...)"
                className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#5B6CFF]/20 focus:border-[#5B6CFF] outline-none font-mono text-xs transition-all placeholder:text-gray-400"
              />
              <button
                onClick={() => setShowAnthropic(!showAnthropic)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#5B6CFF] transition-colors p-1"
              >
                <ToggleIcon show={showAnthropic} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notion Connection Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
          <h3 className="text-sm font-bold text-[#2B2D42]">Notion 연동</h3>
        </div>

        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showNotion ? "text" : "password"}
                value={notionApiKey}
                onChange={(e) => setNotionApiKey(e.target.value)}
                placeholder="Notion Integration Token (secret_...)"
                className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5B6CFF]/20 focus:border-[#5B6CFF] outline-none text-xs font-mono transition-all"
              />
              <button
                onClick={() => setShowNotion(!showNotion)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#5B6CFF] transition-colors p-1"
              >
                <ToggleIcon show={showNotion} />
              </button>
            </div>

            <input
              type="text"
              value={notionDatabaseId}
              onChange={(e) => setNotionDatabaseId(e.target.value)}
              placeholder="Database ID"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5B6CFF]/20 focus:border-[#5B6CFF] outline-none text-xs font-mono transition-all"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => {
                if (confirm('설정을 초기화하시겠습니까?')) {
                  updateConfig({
                    notionApiKey: '',
                    notionParentPageId: '',
                    geminiApiKey: '',
                    openaiApiKey: '',
                    anthropicApiKey: '',
                    isConnected: false
                  });
                }
              }}
              className="px-3 py-2 rounded-lg font-bold text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-all text-xs"
            >
              초기화
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex-1 px-4 py-2 rounded-lg font-bold text-white shadow-sm transition-all text-xs flex items-center justify-center gap-1.5 ${isSaving ? 'bg-gray-400' : 'bg-[#5B6CFF] hover:bg-[#4A5BEF] active:scale-[0.98]'
                } `}
            >
              {isSaving ? (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>저장</span>
                  <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotionSettings;
