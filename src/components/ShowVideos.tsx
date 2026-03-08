interface ShowVideosProps {
    onVideoSelect: (video: any) => void;
    onBack: () => void;
}

export function ShowVideos({ onVideoSelect, onBack }: ShowVideosProps) {
    const videos = [
        {
            id: 1,
            title: 'Gol de Messi',
            duration: 'Valioso',
            thumbnail: 'https://images.unsplash.com/photo-1517466787929-bc90951d6dbd?q=80&w=2670',
            url: "/videos/Messi.mp4"
        },
        {
            id: 2,
            title: 'Gol de Iniesta',
            duration: 'Mundial',
            thumbnail: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=2564',
            url: "/videos/Gol de Andres Iniesta-España Campeon [6-EqlQMPmDI].mp4"
        }
    ];

    return (
        <div className="min-h-screen bg-wc-light-bg pb-24">
            <div className="bg-wc-red pt-12 pb-6 px-6 rounded-b-[40px] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
                <div className="flex justify-between items-center relative z-10">
                    <button onClick={onBack} className="p-2 bg-white/20 rounded-full text-white backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider italic">Momentos Épicos</h1>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {videos.map((video) => (
                    <div
                        key={video.id}
                        onClick={() => onVideoSelect(video)}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer transform hover:scale-[1.02] transition-all duration-300 group"
                    >
                        <div className="relative aspect-video bg-gray-200 flex items-center justify-center overflow-hidden">
                            <video
                                src={video.url}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                                onMouseOver={e => e.currentTarget.play()}
                                onMouseOut={e => {
                                    e.currentTarget.pause();
                                    e.currentTarget.currentTime = 0;
                                }}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                        </div>
                        <div className="p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg leading-tight">{video.title}</h3>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Copa Mundial 2022</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
