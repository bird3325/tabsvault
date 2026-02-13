
import React, { useState } from 'react';
import { ApiConfig } from '../types';

interface ApiSettingsProps {
  config: ApiConfig;
  onUpdateConfig: (config: ApiConfig) => void;
}

const NotionSettings: React.FC<ApiSettingsProps> = ({ config, onUpdateConfig }) => {
  const [notionApiKey, setNotionApiKey] = useState(config.notionApiKey);
  const [notionDatabaseId, setNotionDatabaseId] = useState(config.notionDatabaseId);
  const [geminiApiKey, setGeminiApiKey] = useState(config.geminiApiKey);
  const [openaiApiKey, setOpenaiApiKey] = useState(config.openaiApiKey || '');
  const [anthropicApiKey, setAnthropicApiKey] = useState(config.anthropicApiKey || '');
  const [aiModel, setAiModel] = useState(config.aiModel || 'gemini-2.0-flash');
  const [isSaving, setIsSaving] = useState(false);

  // Visibility States
  const [showGemini, setShowGemini] = useState(false);
  const [showOpenai, setShowOpenai] = useState(false);
  const [showAnthropic, setShowAnthropic] = useState(false);
  const [showNotion, setShowNotion] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateConfig({
        notionApiKey,
        notionDatabaseId,
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* AI Model Core Engine Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#5B6CFF] bg-opacity-10 rounded-xl flex items-center justify-center shadow-inner">
            <svg className="w-6 h-6 text-[#5B6CFF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#2B2D42]">AI 모델 코어 엔진</h3>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">전용 엔진 선택 (AI ENGINE)</p>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* AI Engine Model Selection Dropdown */}
          <div className="relative">
            <label className="block text-sm font-bold text-gray-600 mb-3 ml-1">사용할 AI 엔진을 선택하세요</label>
            <div className="relative">
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full pl-6 pr-12 py-4 border-2 border-[#5B6CFF] border-opacity-20 rounded-2xl focus:ring-4 focus:ring-[#5B6CFF] focus:ring-opacity-10 focus:border-[#5B6CFF] outline-none transition-all bg-white text-lg font-bold text-[#2B2D42] appearance-none cursor-pointer hover:border-opacity-40"
              >
                <optgroup label="Google Gemini">
                  <option value="gemini-2.0-flash">Gemini 3 Flash (추천: 빠른 속도/가성비)</option>
                  <option value="gemini-1.5-pro">Gemini 3 Pro (고성능: 복잡한 추론/HTML)</option>
                </optgroup>
                <optgroup label="OpenAI (GPT)">
                  <option value="gpt-4o">GPT-4o (Omni)</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                </optgroup>
                <optgroup label="Anthropic (Claude)">
                  <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</option>
                </optgroup>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#5B6CFF]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Conditional API Key Input based on Selected Model */}
            {aiModel.startsWith('gemini') && (
              <div className="p-6 rounded-2xl border-2 border-[#5B6CFF] border-opacity-40 bg-[#F8FAFF] animate-in zoom-in-95 duration-300">
                <label className="block text-xs font-bold text-[#5B6CFF] mb-3 uppercase tracking-widest flex items-center justify-between">
                  <span>Google Gemini API Key</span>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-[10px] bg-white px-2 py-1 rounded-md shadow-sm hover:underline">발급받기 ↗</a>
                </label>
                <div className="relative">
                  <input
                    type={showGemini ? "text" : "password"}
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="Gemini API Key를 입력하세요"
                    className="w-full pl-4 pr-12 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#5B6CFF] outline-none font-mono text-sm shadow-inner transition-all"
                  />
                  <button
                    onClick={() => setShowGemini(!showGemini)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5B6CFF] transition-colors"
                  >
                    <ToggleIcon show={showGemini} />
                  </button>
                </div>
              </div>
            )}

            {aiModel.startsWith('gpt') && (
              <div className="p-6 rounded-2xl border-2 border-[#5B6CFF] border-opacity-40 bg-[#F8FAFF] animate-in zoom-in-95 duration-300">
                <label className="block text-xs font-bold text-[#5B6CFF] mb-3 uppercase tracking-widest flex items-center justify-between">
                  <span>OpenAI API Key</span>
                  <a href="https://platform.openai.com/api-keys" target="_blank" className="text-[10px] bg-white px-2 py-1 rounded-md shadow-sm hover:underline">발급받기 ↗</a>
                </label>
                <div className="relative">
                  <input
                    type={showOpenai ? "text" : "password"}
                    value={openaiApiKey}
                    onChange={(e) => setOpenaiApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full pl-4 pr-12 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#5B6CFF] outline-none font-mono text-sm shadow-inner transition-all"
                  />
                  <button
                    onClick={() => setShowOpenai(!showOpenai)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5B6CFF] transition-colors"
                  >
                    <ToggleIcon show={showOpenai} />
                  </button>
                </div>
              </div>
            )}

            {aiModel.startsWith('claude') && (
              <div className="p-6 rounded-2xl border-2 border-[#5B6CFF] border-opacity-40 bg-[#F8FAFF] animate-in zoom-in-95 duration-300">
                <label className="block text-xs font-bold text-[#5B6CFF] mb-3 uppercase tracking-widest flex items-center justify-between">
                  <span>Anthropic API Key</span>
                  <a href="https://console.anthropic.com/settings/keys" target="_blank" className="text-[10px] bg-white px-2 py-1 rounded-md shadow-sm hover:underline">발급받기 ↗</a>
                </label>
                <div className="relative">
                  <input
                    type={showAnthropic ? "text" : "password"}
                    value={anthropicApiKey}
                    onChange={(e) => setAnthropicApiKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="w-full pl-4 pr-12 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#5B6CFF] outline-none font-mono text-sm shadow-inner transition-all"
                  />
                  <button
                    onClick={() => setShowAnthropic(!showAnthropic)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5B6CFF] transition-colors"
                  >
                    <ToggleIcon show={showAnthropic} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notion Connection Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="text-lg font-bold text-[#2B2D42]">Notion 연동 설정</h3>
          <p className="text-sm text-gray-500">지식 자산을 저장할 Notion 정보를 입력하세요.</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-2">Notion API Key</label>
              <div className="relative">
                <input
                  type={showNotion ? "text" : "password"}
                  value={notionApiKey}
                  onChange={(e) => setNotionApiKey(e.target.value)}
                  placeholder="secret_..."
                  className="w-full pl-4 pr-12 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5B6CFF] focus:border-transparent outline-none transition-all"
                />
                <button
                  onClick={() => setShowNotion(!showNotion)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5B6CFF] transition-colors"
                >
                  <ToggleIcon show={showNotion} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Notion Database ID</label>
              <input
                type="text"
                value={notionDatabaseId}
                onChange={(e) => setNotionDatabaseId(e.target.value)}
                placeholder="Database ID..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5B6CFF] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-10 py-4 rounded-2xl font-bold text-white shadow-xl transition-all ${isSaving ? 'bg-gray-400' : 'bg-[#5B6CFF] hover:bg-[#4A5BEF] hover:scale-105 active:scale-95'
                }`}
            >
              {isSaving ? "처리 중..." : "모든 설정 저장하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotionSettings;
