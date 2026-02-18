
import React from 'react';

const UserGuide: React.FC = () => {
    const steps = [
        {
            title: "TabsVault 소개",
            description: "TabVault는 열려있는 수많은 브라우저 탭을 AI가 논리적으로 분류하고, 지식 자산으로서 Notion에 깔끔하게 보관해주는 지능형 탭 관리 도구입니다.",
            icon: "✨",
            color: "bg-blue-50"
        },
        {
            title: "1단계: Gemini API 키 설정",
            description: "AI 엔진을 사용하기 위해 Google AI Studio(aistudio.google.com)에서 API 키를 발급받아 '설정' 메뉴에 입력하세요.",
            icon: "🔑",
            color: "bg-amber-50"
        },
        {
            title: "2단계: Notion 연동하기",
            description: "Notion 통합 페이지에서 API 키와 목표 페이지 ID를 가져와 연결하세요. 동기화 버튼 클릭 한 번으로 탭 데이터가 표 형식으로 저장됩니다.",
            icon: "📓",
            color: "bg-gray-50"
        },
        {
            title: "3단계: 지능형 탭 정리",
            description: "대시보드에서 'AI 분석'을 실행하면 탭들이 주제별로 그룹화됩니다. 정리할 그룹을 선택하고 Notion에 저장하여 브라우저 부하를 줄이세요.",
            icon: "🚀",
            color: "bg-green-50"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-[#2B2D42] tracking-tight">이용 가이드</h2>
                <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
                    TabVault를 100% 활용하여 생산성을 극대화하는 방법을 알아보세요.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={`premium-card p-8 group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden`}
                    >
                        <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:shadow-md transition-all`}>
                            {step.icon}
                        </div>
                        <h3 className="text-xl font-bold text-[#2B2D42] mb-3">{step.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium">
                            {step.description}
                        </p>
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="text-8xl select-none">{step.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 상세 발급 방법 섹션 */}
            <div className="space-y-16 pt-8">
                {/* Gemini 가이드 섹션 */}
                <div className="border-t border-gray-100 pt-10">
                    <div className="flex flex-col lg:flex-row gap-10">
                        <div className="flex-1 space-y-6">
                            <h3 className="text-2xl font-bold text-[#2B2D42] flex items-center gap-3">
                                <span className="w-8 h-8 bg-[#4285F4] text-white rounded-lg flex items-center justify-center text-sm font-black">1</span>
                                Gemini API 키 발급 방법
                            </h3>
                            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">
                                <ol className="space-y-4 text-gray-600 text-[14px] leading-relaxed">
                                    <li className="flex gap-4">
                                        <span className="font-black text-[#4285F4] pt-0.5">01</span>
                                        <span><a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-[#4285F4] font-bold underline decoration-2 underline-offset-4 hover:text-[#3367D6] transition-colors">Google AI Studio</a>에 접속하여 로그인합니다.</span>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="font-black text-[#4285F4] pt-0.5">02</span>
                                        <span>사이드바에서 <b>'Get API key'</b> 메인 버튼을 클릭합니다.</span>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="font-black text-[#4285F4] pt-0.5">03</span>
                                        <span><b>'Create API key in new project'</b>를 선택하여 키를 즉시 생성합니다.</span>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="font-black text-[#4285F4] pt-0.5">04</span>
                                        <span>생성된 <code>AIza...</code> 형태의 키를 복사하여 TabsVault 설정창에 붙여넣으세요.</span>
                                    </li>
                                </ol>
                            </div>
                        </div>

                        {/* Gemini Visual Guide (SVG Mockup) */}
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-full max-w-[400px] aspect-[4/3] bg-gray-50 rounded-3xl border border-gray-200 shadow-xl overflow-hidden group/gemini relative">
                                <div className="absolute inset-0 bg-white m-4 rounded-xl border border-gray-100 shadow-inner p-4 space-y-4">
                                    <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        <div className="ml-4 h-4 w-32 bg-gray-100 rounded-full"></div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-1/4 space-y-2 pt-2">
                                            <div className="h-2 w-full bg-blue-600/20 rounded-full animate-pulse"></div>
                                            <div className="h-6 w-full bg-blue-600 rounded-lg shadow-sm flex items-center justify-center">
                                                <div className="w-3 h-3 text-white">✨</div>
                                            </div>
                                            <div className="h-2 w-2/3 bg-gray-100 rounded-full"></div>
                                        </div>
                                        <div className="flex-1 space-y-4 pt-2">
                                            <div className="h-4 w-3/4 bg-gray-900 rounded-md"></div>
                                            <div className="h-24 w-full border-2 border-blue-600 border-dashed rounded-xl flex items-center justify-center bg-blue-50/50 group-hover/gemini:bg-blue-50 transition-colors">
                                                <div className="text-center space-y-2">
                                                    <div className="h-8 w-32 bg-blue-600 rounded-lg mx-auto shadow-lg flex items-center justify-center text-[10px] text-white font-bold">Create API key</div>
                                                    <div className="text-[10px] text-blue-600 font-medium">Click here to start</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notion 가이드 섹션 */}
                <div>
                    <div className="flex flex-col lg:flex-row-reverse gap-10">
                        <div className="flex-1 space-y-6">
                            <h3 className="text-2xl font-bold text-[#2B2D42] flex items-center gap-3">
                                <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-sm font-black">2</span>
                                Notion 연동 및 ID 추출 방법
                            </h3>
                            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-8">
                                <div className="space-y-4">
                                    <h4 className="font-bold text-[#2B2D42] flex items-center gap-2 text-base">
                                        <span className="text-lg">🔑</span> API 토큰 발급
                                    </h4>
                                    <ul className="space-y-3 text-gray-600 text-[14px]">
                                        <li className="flex gap-3">
                                            <span className="text-black font-black">•</span>
                                            <span><a href="https://www.notion.so/my-integrations" target="_blank" className="text-blue-600 font-bold underline decoration-2 underline-offset-4">Notion 통합 페이지</a>에서 <b>'내 통합' → '새 통합'</b>을 생성합니다.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-black font-black">•</span>
                                            <span>발급된 <b>'Internal Integration Token'</b>을 TabsVault의 Notion API Key에 입력하세요.</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-gray-50">
                                    <h4 className="font-bold text-[#2B2D42] flex items-center gap-2 text-base">
                                        <span className="text-lg">🔗</span> Database ID & 연결 추가
                                    </h4>
                                    <ul className="space-y-3 text-gray-600 text-[14px]">
                                        <li className="flex gap-3">
                                            <span className="text-black font-black">•</span>
                                            <span>연동할 노션 페이지 우측 상단 <b>'...' → '연결 추가'</b>에서 생성한 통합 이름을 꼭 선택하세요.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="text-black font-black pt-1">•</span>
                                            <span className="leading-relaxed font-medium text-gray-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                                                URL 중 <code>notion.so/</code> 와 <code>?v=...</code> 사이의 <b>32자리 랜덤 문자열</b>만 복사하여 입력합니다.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Notion Visual Guide (CSS Mockup) */}
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-full max-w-[400px] space-y-6">
                                {/* URL Bar Mockup */}
                                <div className="bg-gray-100 p-1.5 rounded-xl border border-gray-200 shadow-sm overflow-hidden group/url">
                                    <div className="bg-white px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-mono whitespace-nowrap overflow-hidden">
                                        <span className="text-gray-400">https://notion.so/</span>
                                        <span className="bg-amber-400/20 text-amber-700 px-1 py-0.5 rounded border border-amber-400/30 font-black animate-pulse group-hover/url:bg-amber-400/40 transition-colors">7a8b9c0d... (32자리)</span>
                                        <span className="text-gray-400">?v=4f5e6d...</span>
                                    </div>
                                    <div className="mt-1 text-center text-[9px] font-bold text-amber-600 uppercase tracking-tighter">Copy this part for Database ID</div>
                                </div>

                                {/* Connection Menu Mockup */}
                                <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-6 relative overflow-hidden group/conn">
                                    <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-2">
                                        <div className="h-3 w-20 bg-gray-100 rounded-full"></div>
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                                            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                                            <div className="w-1.5 h-1.5 bg-[#5B6CFF] rounded-full animate-ping"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-2 w-full bg-gray-50 rounded-full"></div>
                                        <div className="h-2 w-2/3 bg-gray-50 rounded-full"></div>
                                        <div className="flex items-center gap-2 mt-4 p-2.5 bg-gray-50 rounded-xl border border-dashed border-gray-200 group-hover/conn:border-[#5B6CFF] transition-colors">
                                            <div className="w-7 h-7 bg-[#5B6CFF] rounded-lg flex items-center justify-center text-white text-[10px] font-bold">TV</div>
                                            <div className="flex-1">
                                                <div className="h-2 w-16 bg-gray-900 rounded-full mb-1.5"></div>
                                                <div className="h-1.5 w-10 bg-gray-300 rounded-full font-bold">TabsVault</div>
                                            </div>
                                            <div className="text-[9px] font-black text-[#5B6CFF]">Add Connection</div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#5B6CFF]/5 -mr-12 -mt-12 rounded-full blur-2xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 하단 강조 섹션 (리뉴얼 디자인) */}
            <div className="relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#5B6CFF] via-[#7080FF] to-[#8C9BFF] rounded-[40px] transform group-hover:scale-[1.01] transition-transform duration-500 shadow-2xl"></div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl -ml-24 -mb-24"></div>

                <div className="relative p-12 md:p-16 text-center space-y-8">
                    <div className="inline-flex px-5 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-sm">
                        Pro Tip ✨
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                            브라우저를 가볍게,<br />
                            머릿속은 <span className="text-blue-100">선명하게</span>
                        </h4>
                        <div className="w-16 h-1.5 bg-white/30 rounded-full mx-auto"></div>
                    </div>

                    <p className="text-blue-50/90 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
                        탭 분석 기능은 현재 열려있는 탭의 제목과 URL을 기반으로 가장 관련성 높은 카테고리를 추천합니다.
                        저장된 모든 정보는 여러분의 Notion 데이터베이스에서 언제든지 다시 검색하고 활용할 수 있습니다.
                    </p>
                </div>

                {/* Large Background Icon */}
                <div className="absolute right-12 bottom-0 opacity-[0.07] translate-y-1/4">
                    <span className="text-[180px] select-none font-black text-white">Tab</span>
                </div>
            </div>

            <div className="text-center pb-12">
                <p className="text-sm text-gray-400 font-medium">
                    추가 도움이 필요하신가요? <a href="#" className="text-[#5B6CFF] hover:underline">고객 지원 센터 ↗</a>
                </p>
            </div>
        </div>
    );
};

export default UserGuide;
