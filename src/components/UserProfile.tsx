import { useState, useRef, Suspense } from 'react';
import type { User } from '../types';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OBJLoader, MTLLoader } from 'three-stdlib';
import * as THREE from 'three';
import { API_BASE } from '../utils/apiBase';

function BallObjModel() {
    const materials = useLoader(MTLLoader, '/models/Ball OBJ.mtl');
    const obj = useLoader(OBJLoader, '/models/Ball OBJ.obj', (loader: any) => {
        materials.preload();
        loader.setMaterials(materials);
    });

    const meshRef = useRef<THREE.Group>(null!);

    useFrame((_: any, delta: number) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <group ref={meshRef} scale={[0.8, 0.8, 0.8]} position={[0, -0.5, 0]}>
            <primitive object={obj} />
        </group>
    );
}

interface UserProfileProps {
    user: User;
    onBack: () => void;
    onAvatarUpdate?: (url: string) => void;
}

export function UserProfile({ user, onBack, onAvatarUpdate }: UserProfileProps) {
    const [localAvatar, setLocalAvatar] = useState<string | null>(user.avatarUrl || null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const levelProgress = ((user.level % 10) / 10) * 100;
    const collectedCards = user.collectionCount || 0;
    const currentAvatar = localAvatar;

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview local instantáneo mientras sube
        const reader = new FileReader();
        reader.onload = (ev) => setLocalAvatar(ev.target?.result as string);
        reader.readAsDataURL(file);

        const token = localStorage.getItem('auth_token');
        if (!token) {
            setUploadError('Sesión no iniciada');
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('avatar', file);

            // No pongas Content-Type manualmente: el browser lo pone con el boundary correcto
            const res = await fetch(`${API_BASE}/api/profile/avatar`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                setLocalAvatar(data.avatarUrl);
                onAvatarUpdate?.(data.avatarUrl);
            } else {
                setUploadError(data.message || 'Error al subir la foto');
                setLocalAvatar(user.avatarUrl || null);
            }
        } catch {
            setUploadError('Error de conexión al subir la foto');
            setLocalAvatar(user.avatarUrl || null);
        } finally {
            setIsUploading(false);
            // Limpia el input para poder seleccionar la misma foto de nuevo
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const achievements = [
        { icon: '🏆', label: 'Coleccionista', unlocked: collectedCards >= 10,  requirement: '10+ cartas' },
        { icon: '⚡', label: 'Explorador',    unlocked: collectedCards >= 24,  requirement: '24+ cartas' },
        { icon: '🎯', label: 'Maestro',       unlocked: collectedCards >= 36,  requirement: '36+ cartas' },
        { icon: '👑', label: 'Leyenda',       unlocked: collectedCards >= 48,  requirement: '48 cartas'  },
    ];

    return (
        <div className="min-h-screen bg-wc-light-bg p-6 pb-24">
            <div className="w-full max-w-md mx-auto">

                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={onBack}
                        className="mr-4 p-3 rounded-full hover:bg-gray-100 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg mb-4">

                    {/* Avatar + datos básicos */}
                    <div className="flex items-center gap-5 mb-8">
                        <div className="relative">

                            {/* Foto o bola 3D */}
                            <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-wc-red shadow-md bg-gray-900 flex items-center justify-center">
                                {currentAvatar ? (
                                    <img
                                        src={currentAvatar}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                                        <ambientLight intensity={1.5} />
                                        <directionalLight position={[5, 10, 5]} intensity={2} />
                                        <Suspense fallback={null}>
                                            <BallObjModel />
                                        </Suspense>
                                        <OrbitControls enableZoom={false} enablePan={false} />
                                    </Canvas>
                                )}
                            </div>

                            {/* Botón de cámara sobre el avatar */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="absolute -bottom-2 -left-2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50"
                                title="Cambiar foto"
                            >
                                {isUploading ? (
                                    <svg className="animate-spin w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>

                            {/* Input de archivo oculto */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                            />

                            {/* Badge de nivel */}
                            <div className="absolute -bottom-2 -right-2 bg-wc-green text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-md">
                                Nvl {user.level}
                            </div>
                        </div>

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500 text-base">{user.email}</p>

                            {uploadError && (
                                <p className="text-red-500 text-xs mt-1">{uploadError}</p>
                            )}
                            {isUploading && (
                                <p className="text-gray-400 text-xs mt-1">Subiendo foto...</p>
                            )}

                            {user.rank && (
                                <div className="inline-flex items-center gap-1 bg-wc-gold/20 border border-wc-gold px-3 py-1.5 rounded-full mt-2">
                                    <span className="text-wc-gold text-sm">⭐</span>
                                    <span className="text-wc-gold font-bold text-sm">Rank #{user.rank}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="mb-8">
                        <div className="flex justify-between text-sm font-bold text-gray-500 mb-3">
                            <span>Progreso al Nivel {user.level + 1}</span>
                            <span className="text-wc-green">{levelProgress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-wc-green rounded-full transition-all duration-500"
                                style={{ width: `${levelProgress}%` }}
                            />
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-wc-red/10 p-4 rounded-xl text-center border border-wc-red/20">
                            <div className="text-sm text-gray-600 mb-2">Puntos</div>
                            <div className="text-2xl font-bold text-wc-red">{user.points.toLocaleString()}</div>
                        </div>
                        <div className="bg-wc-green/10 p-4 rounded-xl text-center border border-wc-green/20">
                            <div className="text-sm text-gray-600 mb-2">Cartas</div>
                            <div className="text-2xl font-bold text-wc-green">{user.collectionCount || 0}</div>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-xl text-center border border-gray-200">
                            <div className="text-sm text-gray-600 mb-2">ID</div>
                            <div className="text-xl font-bold text-gray-700">#{user.id}</div>
                        </div>
                    </div>

                    {/* Logros */}
                    <div className="mb-8">
                        <h3 className="text-base font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <span>🏅</span> Logros
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                            {achievements.map((a, index) => (
                                <div
                                    key={index}
                                    title={a.unlocked ? '¡Desbloqueado!' : `Requiere: ${a.requirement}`}
                                    className={`p-4 rounded-lg border transition-all ${a.unlocked
                                        ? a.label === 'Coleccionista' ? 'bg-wc-gold/20 border-wc-gold/40'
                                        : a.label === 'Explorador'   ? 'bg-wc-green/20 border-wc-green/40'
                                        : a.label === 'Maestro'      ? 'bg-wc-red/20 border-wc-red/40'
                                                                      : 'bg-purple-500/20 border-purple-500/40'
                                        : 'bg-gray-100 border-gray-200 opacity-50'
                                    }`}
                                >
                                    <div className="text-3xl text-center mb-2">{a.icon}</div>
                                    <p className={`text-[10px] text-center font-bold ${a.unlocked
                                        ? a.label === 'Coleccionista' ? 'text-wc-gold'
                                        : a.label === 'Explorador'   ? 'text-wc-green'
                                        : a.label === 'Maestro'      ? 'text-wc-red'
                                                                      : 'text-purple-600'
                                        : 'text-gray-400'
                                    }`}>
                                        {a.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="py-4 bg-wc-green text-white rounded-xl font-bold text-base hover:bg-green-700 transition shadow-md disabled:opacity-50"
                        >
                            {isUploading ? 'Subiendo...' : 'Cambiar Foto'}
                        </button>
                        <button className="py-4 bg-gray-100 border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-base hover:bg-gray-200 transition">
                            Compartir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
