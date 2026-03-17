import { useEffect, useState } from "react"
import type { Card } from "../types"
import { CardStats } from "./CardStats"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import Modelo from "./Modelo"


interface ScanResultProps {
  card: Card
  modelId?: string | null
  onAdd: () => void
  onDiscard: () => void
  onStartTrivia: () => void
}

export function ScanResult({
  card,
  modelId,
  onAdd,
  onDiscard,
  onStartTrivia
}: ScanResultProps) {

  const [animate, setAnimate] = useState(false)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    setAnimate(true)
  }, [])

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
        <div
          className={`w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] overflow-hidden shadow-2xl transform transition-transform duration-500 ease-out ${animate ? "translate-y-0" : "translate-y-full"
            }`}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center p-6 pb-2">
            <button
              onClick={onDiscard}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              ✖
            </button>

            <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-100 px-3 py-1 rounded-full">
              Auto Increíble • Edición Legendaria
            </div>

            <div className="w-8" />
          </div>

          {/* CONTENIDO */}
          <div className="px-6 pb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Carta Escaneada
            </h2>

            {modelId && (
              <div className="mt-10 mb-10 relative flex justify-center">

                {/* Glow detrás */}
                <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>

                {/* Contenedor sin fondo */}
                <div className="relative z-10 w-72 aspect-[3/4]">

                  <Canvas
                    camera={{ position: [0, 0, 4], fov: 50 }}
                    gl={{
                      alpha: true,
                      antialias: true
                    }}
                    onCreated={({ gl }: any) => {
                      gl.setClearColor(0x000000, 0)
                    }}
                  >

                    {/* Luz base natural */}
                    <hemisphereLight
                      intensity={0.7}
                      groundColor="#555555"
                    />

                    {/* Luz principal frontal */}
                    <directionalLight
                      position={[3, 4, 5]}
                      intensity={0.9}
                    />

                    {/* Luz secundaria lateral */}
                    <directionalLight
                      position={[-3, -2, 5]}
                      intensity={0.4}
                    />

                    {/* Luz trasera suave */}
                    <directionalLight
                      position={[0, 2, -5]}
                      intensity={0.35}
                    />

                    {/* Modelo escalado y centrado */}
                    <group
                      scale={0.60}
                      position={[0, 0, 0]}
                      rotation={[50.2, -26.5, 49.85]}
                    >
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
                  onClick={onAdd}
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

      {showStats && (
        <CardStats
          card={card}
          onClose={() => {
            setShowStats(false)
          }}
        />
      )}
    </>
  )
}