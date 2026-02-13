
import React from 'react';

interface BottomNavProps {
    activeTab: 'dashboard' | 'history' | 'settings';
    setActiveTab: (tab: 'dashboard' | 'history' | 'settings') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'dashboard', label: '홈', icon: '📊' },
        { id: 'history', label: '기록', icon: '📁' },
        {
            id: 'settings', label: '설정', icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
                </svg>
            )
        },
    ] as const;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-50">
            <nav className="glass rounded-2xl p-2 flex items-center justify-around shadow-2xl border border-white/50 backdrop-blur-xl bg-white/80">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all duration-300 ${activeTab === item.id
                            ? 'bg-[#5B6CFF] text-white scale-105 shadow-lg shadow-[#5B6CFF]/30'
                            : 'text-gray-400 hover:text-[#5B6CFF]'
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className={`text-[10px] font-bold ${activeTab === item.id ? 'block' : 'hidden md:block'}`}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default BottomNav;
