import { useEffect, useState, useRef, Suspense, useMemo, Component } from "react"
import type { ReactNode } from "react"
import type { Card } from "../types"
import { CardStats } from "./CardStats"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, useTexture } from "@react-three/drei"
import Modelo from "./Modelo"
import { OBJLoader } from 'three-stdlib'
import confetti from 'canvas-confetti'
import * as THREE from 'three'

// ── Error boundary para la pelota (Three.js puede fallar silenciosamente) ─────
class BallErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

// ── Pelota 3D ──────────────────────────────────────────────────────────────────
const IMPACT_TIME = 1.2

function BallScene({ onImpact }: { onImpact: () => void }) {
  const groupRef = useRef<THREE.Group>(null!)
  const impactFired = useRef(false)
  const elapsed = useRef(0)

  const obj = useLoader(OBJLoader, '/models/soccer_ball.obj')
  const textures = useTexture({
    map:          '/textures/txtbalon/football_ball_BaseColor.png',
    roughnessMap: '/textures/txtbalon/football_ball_Roughness.png',
    metalnessMap: '/textures/txtbalon/football_ball_Metallic.png',
    normalMap:    '/textures/txtbalon/football_ball_Normal.png',
  })

  const ball = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map:          textures.map,
      roughnessMap: textures.roughnessMap,
      metalnessMap: textures.metalnessMap,
      normalMap:    textures.normalMap,
      metalness:    1,
      roughness:    1,
    })
    const group = new THREE.Group()
    obj.traverse((child: any) => {
      if (!child.isMesh) return
      group.add(new THREE.Mesh(child.geometry.clone(), mat))
    })
    return group
  }, [obj, textures])

  useFrame((_state: any, delta: number) => {
    if (!groupRef.current) return
    elapsed.current += delta
    const t = elapsed.current

    if (t < IMPACT_TIME) {
      const eased = 1 - Math.pow(1 - t / IMPACT_TIME, 3)
      groupRef.current.position.y = -9 + eased * 9
      groupRef.current.rotation.x += delta * 14
      groupRef.current.rotation.z += delta * 7
    } else if (!impactFired.current) {
      impactFired.current = true
      groupRef.current.position.y = 0
      onImpact()
    } else {
      const t2 = t - IMPACT_TIME
      groupRef.current.position.y = Math.sin(t2 * 5) * 1.8 * Math.exp(-t2 * 2.5)
      groupRef.current.rotation.x += delta * 10
      groupRef.current.rotation.z += delta * 5
    }
  })

  return (
    <group ref={groupRef} position={[0, -9, 0]} scale={0.2}>
      <primitive object={ball} />
    </group>
  )
}

// ── ScanResult ─────────────────────────────────────────────────────────────────
interface ScanResultProps {
  card: Card
  modelId?: string | null
  onAdd: () => void
  onDiscard: () => void
  onStartTrivia: () => void
}

export function ScanResult({ card, modelId, onAdd, onDiscard, onStartTrivia }: ScanResultProps) {
  const [animate,      setAnimate]      = useState(false)
  const [showStats,    setShowStats]    = useState(false)
  const [adding,       setAdding]       = useState(false)
  const [cardFlying,   setCardFlying]   = useState(false)
  const [showUnlocked, setShowUnlocked] = useState(false)

  useEffect(() => { setAnimate(true) }, [])

  // ── Confetti ────────────────────────────────────────────────────────────────
  const fireConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { x: 0.5, y: 0.55 },
      colors: ['#e63946', '#008751', '#FFD700', '#ffffff', '#4ade80'] })
    setTimeout(() => {
      confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 0.15, y: 0.6 },
        colors: ['#e63946', '#FFD700', '#ffffff'] })
      confetti({ particleCount: 60, angle: 60,  spread: 60, origin: { x: 0.85, y: 0.6 },
        colors: ['#008751', '#FFD700', '#4ade80'] })
    }, 180)
  }

  // ── Click en "Agregar" ──────────────────────────────────────────────────────
  // onAdd() se programa aquí, de forma garantizada, sin depender de la pelota 3D.
  const handleAddClick = () => {
    setAdding(true)
    fireConfetti()
    setShowUnlocked(true)
    setTimeout(() => setCardFlying(true), 150)
    setTimeout(() => onAdd(), 2000)
  }

  // ── La pelota llama esto si carga (da confetti extra en el impacto) ──────────
  const handleImpact = () => {
    fireConfetti()
  }

  return (
    <>
      {/* ── Modal principal ───────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
        <div className={`w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] overflow-hidden shadow-2xl transform transition-transform duration-500 ease-out ${animate ? "translate-y-0" : "translate-y-full"}`}>

          {/* HEADER */}
          <div className="flex justify-between items-center p-6 pb-2">
            <button onClick={onDiscard} className="p-2 rounded-full hover:bg-gray-100">✖</button>
            <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-100 px-3 py-1 rounded-full">
              Auto Increíble • Edición Legendaria
            </div>
            <div className="w-8" />
          </div>

          {/* CARTA 3D */}
          <div className="px-6 pb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Carta Escaneada</h2>

            {modelId && (
              <div className="mt-10 mb-10 relative flex justify-center">
                <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full scale-150 animate-pulse pointer-events-none" />
                <div className="relative z-10 w-72 aspect-[3/4]">
                  <Canvas
                    camera={{ position: [0, 0, 4], fov: 50 }}
                    gl={{ alpha: true, antialias: true }}
                    onCreated={({ gl }: any) => gl.setClearColor(0x000000, 0)}
                  >
                    <hemisphereLight intensity={0.7} groundColor="#555555" />
                    <directionalLight position={[3, 4, 5]} intensity={0.9} />
                    <directionalLight position={[-3, -2, 5]} intensity={0.4} />
                    <directionalLight position={[0, 2, -5]} intensity={0.35} />
                    <group scale={0.60} position={[0, 0, 0]} rotation={[50.2, -26.5, 49.85]}>
                      <Modelo
                        textureId={`textV2/${modelId}`}
                        frontLayers={['1', '2', '3']}
                        backSuffix="4"
                        parallax={true}
                        preview={true}
                      />
                    </group>
                    <OrbitControls enableZoom enablePan={false} />
                  </Canvas>
                </div>
              </div>
            )}

            {/* BOTONES */}
            <div className="flex flex-col gap-3 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddClick}
                  className="py-4 px-4 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all shadow-lg active:scale-95"
                >
                  Agregar
                </button>
                <button
                  onClick={() => setShowStats(true)}
                  className="py-4 px-4 rounded-2xl bg-white border border-gray-300 font-bold hover:bg-gray-100 transition-all shadow-lg text-gray-800 active:scale-95"
                >
                  Estadísticas
                </button>
              </div>
              <button
                onClick={onStartTrivia}
                className="py-4 px-4 rounded-2xl bg-wc-red text-white font-bold hover:bg-red-700 transition-all shadow-lg active:scale-95"
              >
                Jugar Trivia
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Overlay de celebración ────────────────────────────────────────── */}
      {adding && (
        <div className="fixed inset-0 z-[60] overflow-hidden">

          {/* Fondo */}
          <div className="absolute inset-0 bg-black/95" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`w-80 h-80 rounded-full blur-[120px] transition-all duration-700 ${showUnlocked ? 'bg-green-500/40 scale-150' : 'bg-green-500/10'}`} />
          </div>

          {/* Pelota 3D — visual únicamente, no bloquea onAdd() */}
          <div className="absolute inset-0 pointer-events-none">
            <Canvas
              camera={{ position: [0, 0, 7], fov: 55 }}
              gl={{ alpha: true, antialias: true }}
              onCreated={({ gl }: any) => gl.setClearColor(0x000000, 0)}
              style={{ width: '100%', height: '100%' }}
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={2} />
              <directionalLight position={[-4, -2, 4]} intensity={1} />
              <pointLight position={[0, 2, 4]} intensity={1.5} color="#86efac" />
              <BallErrorBoundary>
                <Suspense fallback={null}>
                  <BallScene onImpact={handleImpact} />
                </Suspense>
              </BallErrorBoundary>
            </Canvas>
          </div>

          {/* Carta — vuela hacia arriba */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`relative transition-all ease-in-out ${cardFlying ? 'duration-500 -translate-y-[260px] scale-50 opacity-0' : 'duration-300 translate-y-0 scale-100 opacity-100'}`}>
              <div className={`absolute -inset-6 rounded-full blur-2xl transition-all duration-500 ${showUnlocked ? 'bg-yellow-400/30' : 'bg-transparent'}`} />
              {modelId ? (
                <img
                  src={`/textures/textV2/${modelId}_1.png`}
                  alt={card.name}
                  className="relative w-44 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/10"
                />
              ) : (
                <div className="relative w-44 aspect-[3/4] rounded-2xl bg-gradient-to-br from-green-800 to-green-950 border border-white/10 flex items-center justify-center shadow-2xl">
                  <span className="text-white font-bold text-center px-4">{card.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Texto */}
          <div className={`absolute top-[15%] left-0 right-0 text-center pointer-events-none transition-all duration-500 ${showUnlocked ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="text-green-400/80 text-xs font-black uppercase tracking-[0.3em] mb-2">¡Nueva carta desbloqueada!</p>
            <h2 className="text-5xl font-black text-white uppercase italic"
              style={{ textShadow: '0 0 40px rgba(74,222,128,0.9), 0 0 80px rgba(74,222,128,0.4)' }}>
              ¡Ganaste!
            </h2>
            <p className="text-white/70 font-bold text-lg mt-3 tracking-wide">{card.name}</p>
          </div>

          {/* XP */}
          <div className={`absolute bottom-[15%] left-0 right-0 text-center pointer-events-none transition-all duration-700 delay-300 ${showUnlocked ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
              <span className="text-yellow-400 text-xl">⭐</span>
              <span className="text-white font-black text-lg">+50 XP</span>
            </div>
          </div>

        </div>
      )}

      {showStats && (
        <CardStats card={card} onClose={() => setShowStats(false)} />
      )}
    </>
  )
}
