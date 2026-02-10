
import React from 'react';

interface BottomNavProps {
    activeTab: 'dashboard' | 'history' | 'settings';
    setActiveTab: (tab: 'dashboard' | 'history' | 'settings') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'dashboard', label: '홈', icon: '📊' },
        { id: 'history', label: '기록', icon: '📁' },
        { id: 'settings', label: '설정', icon: '⚙️' },
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
