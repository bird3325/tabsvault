
import React from 'react';

interface SidebarProps {
  activeTab: 'dashboard' | 'history' | 'settings' | 'guide';
  setActiveTab: (tab: 'dashboard' | 'history' | 'settings' | 'guide') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: '대시보드', icon: '📊' },
    { id: 'history', label: '보관 내역', icon: '📁' },
    { id: 'guide', label: '이용가이드', icon: '📖' },
    {
      id: 'settings', label: '설정', icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
        </svg>
      )
    },
  ] as const;

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col h-full shadow-sm">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#5B6CFF] rounded-xl flex items-center justify-center text-white text-xl font-bold">
          TV
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#2B2D42]">TabVault</h1>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${activeTab === item.id
              ? 'bg-[#E2E6FF] text-[#5B6CFF]'
              : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-[#5B6CFF]/5 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">현재 등급</p>
          <p className="text-sm font-bold text-[#5B6CFF]">Pro Plan</p>
          <div className="mt-2 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#5B6CFF] h-full w-[80%]"></div>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">Notion 동기화 무제한</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
