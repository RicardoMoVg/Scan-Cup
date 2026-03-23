import { AdvancedVideo } from '@cloudinary/react';
import { cld } from '../utils/cloudinary';

interface ShowVideosProps {
    onVideoSelect: (video: any) => void;
    onBack: () => void;
}

export function ShowVideos({ onVideoSelect, onBack }: ShowVideosProps) {
    const videos = [
        {
            id: 1,
            title: 'Golazo de Son Heung-Min',
            duration: 'Corea',
            thumbnail: '',
            publicId: 'Golazo_de_Son_Heung-Min_México_no_lo_vio_venir_Mexico_vs_Corea_eF8XL0Bk9O0_n4sxy8'
        },
        {
            id: 2,
            title: 'Gol de Neymar',
            duration: 'Brasil',
            thumbnail: '',
            publicId: 'GOL_DO_NEYMAR_BRASIL_X_CROÁCIA_-_COPA_DO_MUNDO_2022_-_GLOBO_mPrBGrizkQM_e3c6sl'
        },
        {
            id: 3,
            title: 'Gol de Pulisic',
            duration: 'EEUU',
            thumbnail: '',
            publicId: 'Christian_Pulisic_s_Goal_v_IR_Iran_2022_FIFA_World_Cup_HPg5hthnQ5E_kwnqon'
        },
        {
            id: 4,
            title: 'Gol de Kubo',
            duration: 'Japón',
            thumbnail: '',
            publicId: 'TAKEFUSA_KUBO_-_INSOLITO_GOL_JAPON_HOY_TV_ZmEZt5TsRw4_qsxs6t'
        },
        {
            id: 5,
            title: 'Empate de Mbappé',
            duration: 'Francia',
            thumbnail: '',
            publicId: 'MBAPPE_EMPATA_EL_PARTIDO_VS_ARGENTINA_Argentina_2_vs_Francia_2_GBoh2c86Fho_ed8x3g'
        },
        {
            id: 6,
            title: 'Empate de Cristiano',
            duration: 'Portugal',
            thumbnail: '',
            publicId: 'Relato_de_Mariano_Closs_Gol_de_empate_de_tiro_libre_de_Cristiano_Ronaldo_739gFc2zg78_zhkarj'
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
                            {(video as any).publicId ? (
                                <AdvancedVideo
                                    cldVid={cld.video((video as any).publicId)}
                                    poster={cld.video((video as any).publicId).format('jpg').toURL()}
                                    className="w-full h-full object-cover"
                                    muted
                                    playsInline
                                    onMouseOver={(e: any) => e.currentTarget.play()}
                                    onMouseOut={(e: any) => {
                                        e.currentTarget.pause();
                                        e.currentTarget.currentTime = 0;
                                    }}
                                />
                            ) : (
                                <video
                                    src={(video as any).url}
                                    className="w-full h-full object-cover"
                                    muted
                                    playsInline
                                    onMouseOver={e => e.currentTarget.play()}
                                    onMouseOut={e => {
                                        e.currentTarget.pause();
                                        e.currentTarget.currentTime = 0;
                                    }}
                                />
                            )}
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
