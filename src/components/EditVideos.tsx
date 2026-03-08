import { useState, useRef } from 'react';

interface EditVideosProps {
    video: any;
    onBack: () => void;
}

export function EditVideos({ video, onBack }: EditVideosProps) {
    const [activeFilter, setActiveFilter] = useState('none');

    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const filters = [
        { id: 'none', label: 'Normal', style: {} },
        { id: 'pixelate', label: 'Pixelado', style: { filter: 'url(#pixelate)' } },
        { id: 'vintage', label: 'Vintage', style: { filter: 'sepia(0.5) contrast(1.2)' } },
        { id: 'blur', label: 'Difuminado', style: { filter: 'blur(4px)' } },
        { id: 'thermal', label: 'Aberración', style: { filter: 'invert(1) hue-rotate(180deg) contrast(1.5)' } },
        { id: 'color', label: 'Color', style: { filter: 'saturate(2) contrast(1.1) hue-rotate(15deg)' } },
    ];

    const SvgFilters = () => (
        <svg className="hidden">
            <defs>
                <filter id="pixelate" x="0" y="0">
                    <feFlood x="16" y="16" height="2" width="2" />
                    <feComposite width="32" height="32" />
                    <feTile result="a" />
                    <feComposite in="SourceGraphic" in2="a" operator="in" />
                    <feMorphology operator="dilate" radius="16" />
                </filter>
            </defs>
        </svg>
    );

    return (
        <div className="min-h-screen bg-wc-dark-bg flex flex-col font-heading">
            <SvgFilters />

            {/* Header */}
            <div className="relative p-6 z-20 flex justify-between items-center bg-wc-dark-bg/95 border-b border-gray-800">
                <button onClick={onBack} className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-white font-black text-lg tracking-widest uppercase">
                    Momento <span className="text-wc-red">Épico</span>
                </h2>
                <button className="text-white font-bold text-sm bg-wc-green px-6 py-2.5 rounded-full shadow-[0_0_15px_rgba(0,135,81,0.5)] hover:bg-wc-green-light transition-all transform hover:scale-105">
                    GUARDAR
                </button>
            </div>

            {/* Video Preview Area */}
            <div className="flex-1 relative flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-gray-800/20 via-wc-dark-bg to-wc-dark-bg">
                {video?.url ? (
                    <div className="w-full max-w-3xl relative flex flex-col items-center shadow-2xl rounded-2xl border border-gray-800 bg-black">
                        <div className="relative w-full aspect-video bg-black overflow-hidden rounded-t-2xl group flex justify-center items-center">
                            <video
                                ref={videoRef}
                                src={video.url}
                                autoPlay
                                loop
                                playsInline
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={handleLoadedMetadata}
                                onClick={togglePlay}
                                className="w-full h-full object-cover transition-all duration-500 ease-in-out cursor-pointer"
                                style={filters.find(f => f.id === activeFilter)?.style}
                            />
                            {/* Play/Pause Overlay */}
                            <div
                                className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${isPlaying ? 'opacity-0' : 'opacity-100'}`}
                            >
                                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        {/* Video Controls */}
                        <div className="w-full bg-[#111] p-5 rounded-b-2xl flex flex-col gap-4 border-t border-gray-800 shadow-inner">
                            <div className="relative group/slider flex items-center h-4">
                                <input
                                    type="range"
                                    min={0}
                                    max={duration || 100}
                                    step="0.01"
                                    value={currentTime}
                                    onChange={handleSeek}
                                    aria-label="Línea de tiempo del video"
                                    className="absolute w-full h-1.5 bg-gray-700/50 rounded-lg appearance-none cursor-pointer accent-wc-red hover:h-2 transition-all z-10"
                                />
                                {/* Custom Progress Bar Fill */}
                                <div
                                    className="absolute h-1.5 bg-wc-red rounded-l-lg group-hover/slider:h-2 transition-all pointer-events-none z-0"
                                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between text-xs font-mono text-gray-400 font-bold bg-black/30 px-3 py-1.5 rounded-md self-center">
                                <span className="text-white">{formatTime(currentTime)}</span>
                                <span className="mx-2 opacity-50">/</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-3xl aspect-video bg-[#111] shadow-2xl relative overflow-hidden transition-all duration-500 flex items-center justify-center rounded-2xl border border-gray-800">
                        <span className="text-gray-600 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Selecciona un Video
                        </span>
                    </div>
                )}
            </div>

            {/* Filter Controls */}
            <div className="flex overflow-x-auto px-8 space-x-6 pb-4 custom-scrollbar snap-x">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`shrink-0 flex flex-col items-center space-y-3 group snap-center transition-all ${activeFilter === filter.id ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                            }`}
                    >
                        <div className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 p-1 ${activeFilter === filter.id
                            ? 'border-wc-red scale-110 shadow-[0_0_20px_rgba(230,57,70,0.3)]'
                            : 'border-transparent group-hover:border-white/20 hover:scale-105 bg-gray-800/50'
                            }`}>
                            {/* SOLUCIÓN CREATIVA: 
                                    1. Fondo con gradiente para que los colores reaccionen al filtro.
                                    2. style={filter.style} aplica el CSS del filtro al propio botón. 
                                */}
                            <div
                                className="w-full h-full rounded-xl overflow-hidden relative flex items-center justify-center bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500"
                                style={filter.style}
                            >
                                {/* Capa oscura semitransparente para que el texto siempre sea legible */}
                                <div className="absolute inset-0 bg-black/30"></div>

                                {/* Aquí insertamos el nombre de manera dinámica */}
                                <span className="text-[10px] text-white uppercase font-black relative z-10 tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center px-1">
                                    {filter.label}
                                </span>
                            </div>
                        </div>

                        <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${activeFilter === filter.id ? 'text-wc-red' : 'text-gray-500'
                            }`}>
                            {filter.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
