import { useState, useEffect } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { API_BASE } from '../utils/apiBase';

export type DownloadStatus = 'idle' | 'downloading' | 'done' | 'error';

export interface VideoLocalState {
    status: DownloadStatus;
    localPath: string | null;
    webSrc: string | null;
}

const STORAGE_KEY = 'scancup_local_videos_v1';

function loadPersisted(): Record<number, { localPath: string }> {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
        return {};
    }
}

function savePersisted(id: number, localPath: string) {
    const saved = loadPersisted();
    saved[id] = { localPath };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

export function useLocalVideos(_videos?: { id: number; url: string }[]) {
    const [states, setStates] = useState<Record<number, VideoLocalState>>({});

    // Al montar, restaurar videos ya descargados verificando que el archivo aún exista
    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;
        const persisted = loadPersisted();
        (async () => {
            const verified: Record<number, VideoLocalState> = {};
            for (const [idStr, data] of Object.entries(persisted)) {
                const id = Number(idStr);
                try {
                    await Filesystem.stat({ path: data.localPath, directory: Directory.Data });
                    verified[id] = {
                        status: 'done',
                        localPath: data.localPath,
                        webSrc: Capacitor.convertFileSrc(data.localPath),
                    };
                } catch {
                    // archivo borrado, ignorar
                }
            }
            if (Object.keys(verified).length > 0) {
                setStates(prev => ({ ...prev, ...verified }));
            }
        })();
    }, []);

    const downloadVideo = async (video: { id: number; url: string }) => {
        if (!Capacitor.isNativePlatform()) return;
        const current = states[video.id];
        if (current?.status === 'downloading' || current?.status === 'done') return;

        const ext = video.url.split('?')[0].split('.').pop() || 'mp4';
        const filePath = `videos/video_${video.id}.${ext}`;

        setStates(prev => ({
            ...prev,
            [video.id]: { status: 'downloading', localPath: null, webSrc: null },
        }));

        try {
            // Crear directorio si no existe
            try {
                await Filesystem.mkdir({ path: 'videos', directory: Directory.Data, recursive: true });
            } catch { /* ya existe */ }

            // Usar el proxy del backend para evitar bloqueos de Cloudinary en Android
            const downloadUrl = API_BASE
                ? `${API_BASE}/api/video/proxy?url=${encodeURIComponent(video.url)}`
                : video.url;

            const result = await Filesystem.downloadFile({
                url: downloadUrl,
                path: filePath,
                directory: Directory.Data,
            });

            if (!result.path) throw new Error('Sin ruta al descargar');

            const webSrc = Capacitor.convertFileSrc(result.path);
            setStates(prev => ({
                ...prev,
                [video.id]: { status: 'done', localPath: result.path!, webSrc },
            }));
            savePersisted(video.id, result.path!);
        } catch (e: any) {
            console.error(`[useLocalVideos] error descargando video ${video.id}:`, e);
            setStates(prev => ({
                ...prev,
                [video.id]: { status: 'error', localPath: null, webSrc: null },
            }));
        }
    };

    const getVideoSrc = (video: { id: number; url: string }): string => {
        if (!Capacitor.isNativePlatform()) return video.url;
        const state = states[video.id];
        return (state?.status === 'done' && state.webSrc) ? state.webSrc : video.url;
    };

    return { states, downloadVideo, getVideoSrc };
}
