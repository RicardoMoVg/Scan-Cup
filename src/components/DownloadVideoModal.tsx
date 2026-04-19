import { useState } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { Media } from '@capacitor-community/media';
import { API_BASE } from '../utils/apiBase';

interface DownloadVideoModalProps {
    video: any;
    activeFilter: string;
    pixelSize: number;
    onClose: () => void;
    onDownloadStart: () => void;
    onDownloadComplete: (success: boolean) => void;
}

export function DownloadVideoModal({ video, activeFilter, pixelSize, onClose, onDownloadStart, onDownloadComplete }: DownloadVideoModalProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [progressText, setProgressText] = useState('');

    const applyCloudinaryFilter = (originalUrl: string, filterType: string, customPixel: number) => {
        if (filterType === 'none') return originalUrl;

        let effectParam = '';
        switch (filterType) {
            case 'pixelate':
                effectParam = `e_pixelate:${customPixel}`;
                break;
            case 'vintage':
                effectParam = 'e_sepia:50,e_contrast:10,e_saturation:-20';
                break;
            case 'blur':
                effectParam = 'e_blur:200';
                break;
            case 'thermal':
                effectParam = 'e_negate';
                break;
            case 'color':
                effectParam = 'e_saturation:100,e_hue:15';
                break;
            default:
                return originalUrl;
        }

        // Si la URL ya es de cloudinary, inyectamos el parámetro de efecto
        if (originalUrl.includes('/upload/') && !originalUrl.includes(effectParam)) {
            return originalUrl.replace('/upload/', `/upload/${effectParam}/`);
        }
        return originalUrl;
    };

    const downloadVideo = async (withFilter: boolean) => {
        try {
            setIsDownloading(true);
            onDownloadStart();
            setProgressText(withFilter ? 'Generando filtro en la nube...' : 'Descargando video...');

            const cloudinaryUrl = withFilter ? applyCloudinaryFilter(video.url, activeFilter, pixelSize) : video.url;

            // Preservar la extensión real del video (puede ser .webm, .mp4, etc.)
            const rawExt = cloudinaryUrl.split('?')[0].split('.').pop() || 'mp4';
            const fileName = `ScanCup_Epic_${Date.now()}.${rawExt}`;

            // En navegador web (npm run dev) usamos descarga clásica con anchor
            if (!Capacitor.isNativePlatform()) {
                const link = document.createElement('a');
                link.href = cloudinaryUrl;
                link.setAttribute('download', fileName);
                link.setAttribute('target', '_blank');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setProgressText('¡Listo!');
                onDownloadComplete(true);
                setIsDownloading(false);
                onClose();
                return;
            }

            // En APK nativa: enrutamos por el proxy del backend para evitar bloqueos de Cloudinary
            // (Cloudinary puede rechazar peticiones directas desde apps nativas sin Origin válido)
            const proxyUrl = `${API_BASE}/api/video/proxy?url=${encodeURIComponent(cloudinaryUrl)}`;

            const savedFile = await Filesystem.downloadFile({
                url: proxyUrl,
                path: fileName,
                directory: Directory.Cache
            });

            if (!savedFile.path) {
                throw new Error('El archivo descargado no tiene ruta válida');
            }

            setProgressText('Guardando en tu Galería...');

            try {
                await Media.saveVideo({ path: savedFile.path });
            } catch (mediaError) {
                console.warn('Media plugin err, continuing:', mediaError);
            }

            setProgressText('¡Listo!');

            await Share.share({
                title: 'Mi Video Épico de ScanCup',
                text: '¡Mira mi video desde ScanCup!',
                url: savedFile.path,
                dialogTitle: 'Compartir Video Épico'
            });

            onDownloadComplete(true);
        } catch (error: any) {
            console.error('Download error:', error);
            onDownloadComplete(false);
            const detail = error?.message || error?.toString() || 'Error desconocido';
            alert(`Error al descargar el video:\n${detail}\n\nVerifica tu conexión a internet.`);
        } finally {
            setIsDownloading(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-gray-800 shadow-2xl w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in duration-300">

                {isDownloading ? (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <div className="w-16 h-16 border-4 border-wc-red border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-white font-bold">{progressText}</p>
                    </div>
                ) : (
                    <>
                        <h3 className="text-white font-black text-xl mb-2 text-center uppercase tracking-widest">
                            Guardar <span className="text-wc-red">Video</span>
                        </h3>
                        <p className="text-gray-400 text-sm mb-8 text-center text-pretty">¿Cómo te gustaría descargar y compartir tu video épico?</p>

                        <div className="flex flex-col gap-4 w-full">
                            <button
                                onClick={() => downloadVideo(false)}
                                className="w-full bg-gray-800 text-white font-bold py-4 rounded-xl border border-gray-700 hover:bg-gray-700 transition"
                            >
                                Descargar Original
                                <div className="text-xs text-gray-400 font-normal mt-1">Sin filtros aplicados</div>
                            </button>

                            {activeFilter !== 'none' && (
                                <button
                                    onClick={() => downloadVideo(true)}
                                    className="w-full bg-wc-red text-white font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(230,57,70,0.4)] hover:bg-red-500 transition relative overflow-hidden group"
                                >
                                    Descargar Modificado
                                    <div className="text-xs text-white/70 font-normal mt-1">Con filtro activo</div>
                                    <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:animate-[shine_1s_ease-in-out]"></div>
                                </button>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="mt-6 text-gray-500 hover:text-white font-bold uppercase text-xs tracking-widest transition"
                        >
                            Cancelar
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
