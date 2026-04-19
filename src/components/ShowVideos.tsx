import { useRef } from 'react';

interface Video {
    id: number;
    title: string;
    country: string;
    url: string;
}

interface ShowVideosProps {
    onVideoSelect: (video: Video) => void;
    onBack: () => void;
}

function VideoCard({ video, onSelect }: { video: Video; onSelect: () => void }) {
    const ref = useRef<HTMLVideoElement>(null);

    const handleLoadedMetadata = () => {
        if (ref.current) ref.current.currentTime = 1;
    };

    const handleMouseOver = () => {
        ref.current?.play();
    };

    const handleMouseOut = () => {
        if (ref.current) {
            ref.current.pause();
            ref.current.currentTime = 1;
        }
    };

    return (
        <div
            onClick={onSelect}
            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer transform hover:scale-[1.02] transition-all duration-300 group"
        >
            <div className="relative aspect-video bg-gray-900 overflow-hidden">
                <video
                    ref={ref}
                    src={`${video.url}#t=0.001`}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={handleLoadedMetadata}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                />
                {/* Play icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="p-4 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg leading-tight">{video.title}</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">{video.country}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export function ShowVideos({ onVideoSelect, onBack }: ShowVideosProps) {
    const videos: Video[] = [
        {
            id: 1,
            title: 'Gol de Cristiano Ronaldo',
            country: 'Portugal',
            url: 'https://res.cloudinary.com/dowxmspke/video/upload/v1774289033/Relato_de_Mariano_Closs_Gol_de_empate_de_tiro_libre_de_Cristiano_Ronaldo_739gFc2zg78_zhkarj.mp4'
        },
        {
            id: 2,
            title: 'Gol de Pulisic',
            country: 'EEUU',
            url: 'https://res.cloudinary.com/dowxmspke/video/upload/v1776566064/Christian_Pulisic_s_Goal_v_IR_Iran_2022_FIFA_World_Cup_HPg5hthnQ5E_r0f3wi.mp4'
        },
        {
            id: 3,
            title: 'Gol de Neymar',
            country: 'Brasil',
            url: 'https://res.cloudinary.com/dowxmspke/video/upload/v1774289036/GOL_DO_NEYMAR_BRASIL_X_CRO%C3%81CIA_-_COPA_DO_MUNDO_2022_-_GLOBO_mPrBGrizkQM_e3c6sl.webm'
        },
        {
            id: 4,
            title: 'Gol de Iniesta',
            country: 'España',
            url: 'https://res.cloudinary.com/dowxmspke/video/upload/v1776566065/Gol_de_Andres_Iniesta-Espa%C3%B1a_Campeon_6-EqlQMPmDI_bwtgrz.mp4'
        },
        {
            id: 5,
            title: 'Golazo de Son Heung-Min',
            country: 'Corea',
            url: 'https://res.cloudinary.com/dowxmspke/video/upload/v1774289035/Golazo_de_Son_Heung-Min_M%C3%A9xico_no_lo_vio_venir_Mexico_vs_Corea_eF8XL0Bk9O0_n4sxy8.mp4'
        },
        {
            id: 6,
            title: 'Empate de Mbappé',
            country: 'Francia',
            url: 'https://res.cloudinary.com/dowxmspke/video/upload/v1774289034/MBAPPE_EMPATA_EL_PARTIDO_VS_ARGENTINA_Argentina_2_vs_Francia_2_GBoh2c86Fho_ed8x3g.mp4'
        },
        {
            id: 7,
            title: 'Gol de Messi',
            country: 'Argentina',
            url: 'https://res.cloudinary.com/dowxmspke/video/upload/v1776566114/Messi_dbpou0.mp4'
        },
        {
            id: 8,
            title: 'Gol de Kubo',
            country: 'Japón',
            url: 'https://res.cloudinary.com/dowxmspke/video/upload/v1776566113/TAKEFUSA_KUBO_-_INSOLITO_GOL_JAPON_HOY_TV_ZmEZt5TsRw4_btrzem.mp4'
        },
        {
            id: 9,
            title: 'Momento Épico 3',
            country: 'Copa Mundial',
            url: 'https://res.cloudinary.com/dowxmspke/video/upload/v1776566114/Messi_dbpou0.mp4'
        },
        {
            id: 10,
            title: 'Momento Épico 4',
            country: 'Copa Mundial',
            url: 'https://res.cloudinary.com/dowxmspke/video/upload/v1776566145/Video_4_szz6xr.mp4'
        },
        {
            id: 11,
            title: 'Momento Épico 5',
            country: 'Copa Mundial',
            url: 'https://res.cloudinary.com/dowxmspke/video/upload/v1776566161/Video_5_fwheac.mp4'
        },
        {
            id: 12,
            title: 'Momento Épico 6',
            country: 'Copa Mundial',
            url: 'https://res.cloudinary.com/dowxmspke/video/upload/v1776566181/Video_6_dyglqh.mp4'
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
                    <VideoCard
                        key={video.id}
                        video={video}
                        onSelect={() => onVideoSelect(video)}
                    />
                ))}
            </div>
        </div>
    );
}
