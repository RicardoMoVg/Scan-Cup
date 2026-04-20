import { useState } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';
import { Media } from '@capacitor-community/media';
import { API_BASE } from '../utils/apiBase';

interface DownloadVideoModalProps {
    video: any;
    videoRef: React.RefObject<HTMLVideoElement>;
    activeFilter: string;
    pixelSize: number;
    localPath: string | null;
    onClose: () => void;
    onDownloadStart: () => void;
    onDownloadComplete: (success: boolean) => void;
}

// Mapa de filtros CSS idéntico al usado en EditVideos para preview
const CSS_FILTERS: Record<string, string> = {
    vintage: 'sepia(0.5) contrast(1.2)',
    blur: 'blur(4px)',
    thermal: 'invert(1) hue-rotate(180deg) contrast(1.5)',
    color: 'saturate(2) contrast(1.1) hue-rotate(15deg)',
};

function drawFilteredFrame(
    ctx: CanvasRenderingContext2D,
    videoEl: HTMLVideoElement,
    w: number,
    h: number,
    activeFilter: string,
    pixelSize: number
) {
    if (activeFilter === 'pixelate') {
        const size = Math.max(1, pixelSize);
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(videoEl, 0, 0, Math.ceil(w / size), Math.ceil(h / size));
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(ctx.canvas, 0, 0, Math.ceil(w / size), Math.ceil(h / size), 0, 0, w, h);
    } else {
        ctx.filter = CSS_FILTERS[activeFilter] || 'none';
        ctx.drawImage(videoEl, 0, 0, w, h);
        ctx.filter = 'none';
    }
}

async function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export function DownloadVideoModal({
    video,
    videoRef,
    activeFilter,
    pixelSize,
    localPath,
    onClose,
    onDownloadStart,
    onDownloadComplete,
}: DownloadVideoModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progressText, setProgressText] = useState('');
    const [recordingProgress, setRecordingProgress] = useState(0);

    const saveAndShare = async (filePath: string) => {
        try {
            await Media.saveVideo({ path: filePath });
        } catch (e) {
            console.warn('[Modal] Media.saveVideo falló, continuando:', e);
        }
        await Share.share({
            title: 'Mi Video Épico de ScanCup',
            text: '¡Mira mi video desde ScanCup!',
            url: filePath,
            dialogTitle: 'Compartir Video',
        });
    };

    const buildProxyUrl = (videoUrl: string, filename: string) =>
        `${API_BASE}/api/video/proxy?url=${encodeURIComponent(videoUrl)}&filename=${encodeURIComponent(filename)}`;

    // Descarga el original: si ya está local solo copia a galería, sin red
    const downloadOriginal = async () => {
        try {
            setIsProcessing(true);
            onDownloadStart();

            const ext = video.url.split('?')[0].split('.').pop() || 'mp4';
            const filename = `ScanCup_${(video.title as string | undefined)?.replace(/\s+/g, '_') || Date.now()}.${ext}`;

            if (Capacitor.isNativePlatform() && localPath) {
                // Ya descargado localmente — copiar directo a galería sin red
                setProgressText('Guardando en tu Galería…');
                await saveAndShare(localPath);
            } else if (Capacitor.isNativePlatform()) {
                // Nativo pero sin copia local — descargar via proxy y guardar en caché
                setProgressText('Descargando video…');
                const proxyUrl = buildProxyUrl(video.url, filename);
                const response = await fetch(proxyUrl);
                if (!response.ok) throw new Error(`Error ${response.status} al descargar`);
                const blob = await response.blob();
                const base64 = await blobToBase64(blob);
                const saved = await Filesystem.writeFile({
                    path: filename,
                    data: base64,
                    directory: Directory.Cache,
                });
                setProgressText('Guardando en tu Galería…');
                await saveAndShare(saved.uri);
            } else {
                // Web — usar proxy para forzar descarga (evita restricción cross-origin)
                setProgressText('Descargando video…');
                const proxyUrl = buildProxyUrl(video.url, filename);
                const link = document.createElement('a');
                link.href = proxyUrl;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            setProgressText('¡Listo!');
            onDownloadComplete(true);
        } catch (e: any) {
            console.error('[Modal] downloadOriginal error:', e);
            onDownloadComplete(false);
            alert(`Error al guardar el video:\n${e?.message || e}`);
        } finally {
            setIsProcessing(false);
            onClose();
        }
    };

    // Aplica el filtro localmente usando Canvas + MediaRecorder y guarda el resultado
    const downloadWithFilter = async () => {
        const videoEl = videoRef.current;
        if (!videoEl) {
            alert('No se pudo acceder al video. Intenta de nuevo.');
            return;
        }

        try {
            setIsProcessing(true);
            setRecordingProgress(0);
            onDownloadStart();
            setProgressText('Preparando grabación…');

            const w = videoEl.videoWidth || 1280;
            const h = videoEl.videoHeight || 720;

            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d')!;

            // Elegir el mejor formato disponible en este WebView
            const mimeType =
                ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4']
                    .find(t => MediaRecorder.isTypeSupported(t)) ?? 'video/webm';

            const stream = canvas.captureStream(30);
            const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3_000_000 });
            const chunks: Blob[] = [];

            recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

            // Grabación en tiempo real
            await new Promise<void>((resolve, reject) => {
                recorder.onstop = () => resolve();
                recorder.onerror = () => reject(new Error('Fallo al grabar'));

                const duration = videoEl.duration || 1;

                const drawLoop = () => {
                    if (recorder.state === 'inactive') return;
                    if (videoEl.ended) {
                        // Dejar que MediaRecorder reciba los últimos frames antes de parar
                        setTimeout(() => {
                            if (recorder.state !== 'inactive') recorder.stop();
                        }, 300);
                        return;
                    }
                    setRecordingProgress(Math.round((videoEl.currentTime / duration) * 100));
                    drawFilteredFrame(ctx, videoEl, w, h, activeFilter, pixelSize);
                    requestAnimationFrame(drawLoop);
                };

                videoEl.currentTime = 0;
                recorder.start(200);

                videoEl.play()
                    .then(() => {
                        setProgressText('Aplicando filtro…');
                        requestAnimationFrame(drawLoop);
                    })
                    .catch(reject);

                videoEl.onended = () => {
                    if (recorder.state !== 'inactive') recorder.stop();
                };
            });

            setProgressText('Codificando video…');
            setRecordingProgress(100);

            const blob = new Blob(chunks, { type: mimeType });
            const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
            const fileName = `ScanCup_filtered_${Date.now()}.${ext}`;

            if (Capacitor.isNativePlatform()) {
                const base64 = await blobToBase64(blob);
                const saved = await Filesystem.writeFile({
                    path: fileName,
                    data: base64,
                    directory: Directory.Cache,
                });
                setProgressText('Guardando en tu Galería…');
                await saveAndShare(saved.uri);
            } else {
                // En web: descarga directa del blob
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(url);
            }

            setProgressText('¡Listo!');
            onDownloadComplete(true);
        } catch (e: any) {
            console.error('[Modal] downloadWithFilter error:', e);
            onDownloadComplete(false);
            alert(`Error al procesar el video:\n${e?.message || e}`);
        } finally {
            setIsProcessing(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-gray-800 shadow-2xl w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in duration-300">

                {isProcessing ? (
                    <div className="flex flex-col items-center gap-4 py-8 w-full">
                        <div className="w-16 h-16 border-4 border-wc-red border-t-transparent rounded-full animate-spin" />
                        <p className="text-white font-bold text-center">{progressText}</p>
                        {recordingProgress > 0 && recordingProgress < 100 && (
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-wc-red h-2 rounded-full transition-all duration-200"
                                    style={{ width: `${recordingProgress}%` }}
                                />
                            </div>
                        )}
                        {recordingProgress > 0 && recordingProgress < 100 && (
                            <p className="text-gray-400 text-xs">
                                {recordingProgress}% — se procesa en tiempo real
                            </p>
                        )}
                    </div>
                ) : (
                    <>
                        <h3 className="text-white font-black text-xl mb-2 text-center uppercase tracking-widest">
                            Guardar <span className="text-wc-red">Video</span>
                        </h3>
                        <p className="text-gray-400 text-sm mb-8 text-center text-pretty">
                            ¿Cómo quieres guardar tu momento épico?
                        </p>

                        <div className="flex flex-col gap-4 w-full">
                            <button
                                onClick={downloadOriginal}
                                className="w-full bg-gray-800 text-white font-bold py-4 rounded-xl border border-gray-700 hover:bg-gray-700 transition"
                            >
                                Guardar Original
                                <div className="text-xs text-gray-400 font-normal mt-1">
                                    {localPath ? 'Guardado en tu dispositivo ✓' : 'Sin filtros'}
                                </div>
                            </button>

                            {activeFilter !== 'none' && (
                                <button
                                    onClick={downloadWithFilter}
                                    className="w-full bg-wc-red text-white font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(230,57,70,0.4)] hover:bg-red-500 transition relative overflow-hidden group"
                                >
                                    Guardar con Filtro
                                    <div className="text-xs text-white/70 font-normal mt-1">
                                        Procesado en tu teléfono
                                    </div>
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
