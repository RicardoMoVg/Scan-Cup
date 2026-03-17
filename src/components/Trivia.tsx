import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Modelo from './Modelo';
import type { TriviaQuestion, PlayerInfo } from '../utils/triviaApi';

interface TriviaProps {
    modelId?: string | null;
    playerInfo: PlayerInfo;
    questions: TriviaQuestion[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
}

export function Trivia({ modelId, playerInfo, questions, isLoading, error, onRetry }: TriviaProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState(0);

    const handleAnswer = (id: string) => {
        if (selectedAnswer) return;
        setSelectedAnswer(id);
        if (id === questions[currentQuestionIndex].correct) {
            setScore(prev => prev + 1);
        }
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedAnswer(null);
            } else {
                setIsFinished(true);
            }
        }, 1500);
    };

    // --- LOADING STATE ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#022c22] text-white flex flex-col items-center justify-center gap-6 p-6">
                <div className="absolute inset-0 bg-wc-green-light blur-[150px] opacity-20 -z-10"></div>
                <div className="w-16 h-16 border-4 border-wc-green border-t-transparent rounded-full animate-spin"></div>
                <div className="text-center">
                    <p className="text-xl font-bold text-wc-green">Generando trivia...</p>
                    <p className="text-gray-400 text-sm mt-1">La IA está preparando preguntas sobre {playerInfo.name}</p>
                </div>
            </div>
        );
    }

    // --- ERROR STATE ---
    if (error) {
        return (
            <div className="min-h-screen bg-[#022c22] text-white flex flex-col items-center justify-center gap-6 p-6">
                <div className="absolute inset-0 bg-wc-green-light blur-[150px] opacity-20 -z-10"></div>
                <div className="text-5xl">⚠️</div>
                <div className="text-center">
                    <p className="text-xl font-bold text-wc-red">Error al generar la trivia</p>
                    <p className="text-gray-400 text-sm mt-2 max-w-xs">{error}</p>
                </div>
                <button
                    onClick={onRetry}
                    className="py-3 px-8 rounded-full bg-wc-green text-white font-bold hover:bg-green-500 transition-all shadow-lg active:scale-95"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    // --- FINISHED STATE ---
    if (isFinished) {
        return (
            <div className="min-h-screen bg-[#022c22] text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-wc-green-light blur-[150px] opacity-20 -z-10"></div>
                <h2 className="text-4xl font-bold text-center mb-4 text-wc-green drop-shadow-lg">¡Trivia Completada!</h2>
                <p className="text-gray-300 text-lg mb-2 text-center max-w-xs">
                    Has respondido <span className="text-wc-green font-bold">{score}</span> de <span className="font-bold">{questions.length}</span> preguntas correctamente.
                </p>
                <p className="text-gray-400 text-sm mb-8 text-center">sobre {playerInfo.name}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="py-4 px-10 rounded-full bg-wc-green text-white font-bold hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] active:scale-95"
                >
                    Volver al Inicio
                </button>
            </div>
        );
    }

    if (questions.length === 0) return null;

    const question = questions[currentQuestionIndex];

    // --- QUESTION STATE ---
    return (
        <div className="min-h-screen bg-[#022c22] text-white p-6 pb-24 relative overflow-hidden">
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-green-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-wc-green-light rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <button
                    className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition backdrop-blur-sm"
                    onClick={() => window.location.reload()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="text-right">
                    <div className="text-xs font-bold text-wc-red tracking-widest uppercase mb-1">RACHA</div>
                    <div className="text-xl font-bold flex items-center justify-end space-x-1">
                        <span>🔥</span>
                        <span>{question.streak}</span>
                    </div>
                </div>
            </div>

            <div className="mb-8 relative z-10">
                <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                    <span className="text-wc-red">Pregunta {question.number}/{question.total}</span>
                    <span>Nivel: {question.level}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-wc-red rounded-full shadow-[0_0_10px_rgba(230,57,70,0.5)] transition-all duration-500"
                        style={{ width: `${(question.number / question.total) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="relative z-10">
                <div className="flex justify-center mb-8 relative">
                    <div className="relative w-48 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border-2 border-white/10">
                        <div className="absolute inset-0 bg-red-500/10 blur-xl rounded-full scale-150 animate-pulse"></div>
                        <div className="absolute inset-0 z-10">
                            <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} gl={{ alpha: true, antialias: true }}>
                                <hemisphereLight intensity={0.7} groundColor="#555555" />
                                <directionalLight position={[3, 4, 5]} intensity={0.9} />
                                <directionalLight position={[-3, -2, 5]} intensity={0.4} />
                                <directionalLight position={[0, 2, -5]} intensity={0.35} />
                                <group scale={0.75} position={[0, -0.2, 0]} rotation={[50.2, -26.5, 49.85]}>
                                    {modelId && <Modelo textureId={modelId} />}
                                </group>
                                <OrbitControls enableZoom={false} enablePan={false} />
                            </Canvas>
                        </div>
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent z-20 pointer-events-none"></div>
                        <div className="absolute bottom-3 left-3 text-left z-30 pointer-events-none">
                            <div className="font-bold text-lg leading-none">{playerInfo.name}</div>
                            <div className="text-[10px] text-gray-300">{playerInfo.position} • {playerInfo.team}</div>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md p-1 rounded-full border border-white/20 z-30 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="absolute inset-0 bg-wc-green-light blur-2xl opacity-20 -z-10"></div>
                </div>

                <h2 className="text-2xl font-bold text-center mb-8 leading-tight drop-shadow-lg">
                    {question.text}
                </h2>

                <div className="space-y-3">
                    {question.options.map((option) => {
                        const isSelected = selectedAnswer === option.id;
                        const isCorrect = option.id === question.correct;
                        const showCorrect = selectedAnswer !== null && isCorrect;
                        const showIncorrect = isSelected && !isCorrect;

                        let buttonClass = 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10';
                        let badgeClass = 'bg-white/10 text-gray-400 group-hover:bg-white/20 group-hover:text-white';

                        if (showCorrect) {
                            buttonClass = 'bg-wc-green text-white shadow-lg transform scale-[1.02] border-wc-green';
                            badgeClass = 'bg-white text-wc-green';
                        } else if (showIncorrect) {
                            buttonClass = 'bg-wc-red text-white shadow-lg transform scale-[1.02] border-wc-red';
                            badgeClass = 'bg-white text-wc-red';
                        } else if (selectedAnswer) {
                            buttonClass = 'bg-white/5 text-gray-500 border-white/5 opacity-50';
                        }

                        return (
                            <button
                                key={option.id}
                                disabled={selectedAnswer !== null}
                                onClick={() => handleAnswer(option.id)}
                                className={`w-full p-4 rounded-xl flex items-center justify-between font-bold transition-all duration-200 group relative overflow-hidden ${buttonClass}`}
                            >
                                <div className="flex items-center space-x-4 relative z-10 w-full">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${badgeClass}`}>
                                        {option.id}
                                    </div>
                                    <span>{option.text}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
