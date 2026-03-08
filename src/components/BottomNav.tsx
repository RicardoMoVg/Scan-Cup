interface BottomNavProps {
    currentView: 'home' | 'user-collection' | 'catalog' | 'profile' | 'trivia' | 'market' | 'show-videos' | 'edit-video';
    onChangeView: (view: 'home' | 'user-collection' | 'catalog' | 'profile' | 'trivia' | 'market' | 'show-videos' | 'edit-video') => void;
}

export function BottomNav({ currentView, onChangeView }: BottomNavProps) {
    const navItems = [
        {
            id: 'user-collection',
            label: 'Collection',
            icon: (active: boolean) => (
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            )
        },
        {
            id: 'home',
            label: 'Home',
            icon: (active: boolean) => (
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: (active: boolean) => (
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            id: 'show-videos',
            label: 'Videos',
            icon: (active: boolean) => (
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${active ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center z-50 shadow-lg">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => onChangeView(item.id as any)}
                    className="flex flex-col items-center justify-center space-y-1 w-full"
                >
                    <div className={`p-1 rounded-full ${currentView === item.id ? 'text-wc-green bg-wc-green/10' : 'text-gray-400 hover:text-gray-600'}`}>
                        {item.icon(currentView === item.id)}
                    </div>
                    <span className={`text-[10px] font-medium ${currentView === item.id ? 'text-wc-green' : 'text-gray-400'}`}>
                        {item.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
