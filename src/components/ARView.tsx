import { useEffect, useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Modelo from './Modelo'
import jsQR from 'jsqr'
import confetti from 'canvas-confetti'

interface ARViewProps {
  onScan: (cardId: string) => void
  onBack: () => void
}

export function ARView({ onScan, onBack }: ARViewProps) {
  const [modelId, setModelId] = useState<string | null>(null)
  const [qrData, setQrData] = useState<any>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number>()
  const isActiveRef = useRef(true)
  const missCounter = useRef(0)
  const frameSkip = useRef(0)


  useEffect(() => {
    isActiveRef.current = true

    navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    }).then(stream => {
      if (!isActiveRef.current) {
        stream.getTracks().forEach(track => track.stop())
        return
      }

      streamRef.current = stream

      if (!videoRef.current) return
      videoRef.current.srcObject = stream
      videoRef.current.play().catch(e => {
        if (e.name !== 'AbortError') {
          console.warn("Autoplay prevent o interrumpido:", e);
        }
      })

      const scan = () => {
        if (!isActiveRef.current) return

        frameSkip.current++
        if (frameSkip.current % 3 !== 0) {
          animationRef.current = requestAnimationFrame(scan)
          return
        }

        const video = videoRef.current
        const canvas = canvasRef.current

        if (!video || !canvas || video.videoWidth === 0) {
          animationRef.current = requestAnimationFrame(scan)
          return
        }

        const scale = 0.75
        const scanWidth = video.videoWidth * scale
        const scanHeight = video.videoHeight * scale

        canvas.width = scanWidth
        canvas.height = scanHeight

        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) return

        ctx.drawImage(video, 0, 0, scanWidth, scanHeight)

        const imageData = ctx.getImageData(0, 0, scanWidth, scanHeight)
        const code = jsQR(imageData.data, scanWidth, scanHeight, { inversionAttempts: "attemptBoth" })

        if (code) {
          if (!modelId) setModelId(code.data)

          // Usar el tamaño real del video en pantalla
          const rect = video.getBoundingClientRect()
          const scaleX = rect.width / scanWidth
          const scaleY = rect.height / scanHeight

          const scaledLocation = {
            topLeftCorner: {
              x: code.location.topLeftCorner.x * scaleX,
              y: code.location.topLeftCorner.y * scaleY
            },
            topRightCorner: {
              x: code.location.topRightCorner.x * scaleX,
              y: code.location.topRightCorner.y * scaleY
            },
            bottomRightCorner: {
              x: code.location.bottomRightCorner.x * scaleX,
              y: code.location.bottomRightCorner.y * scaleY
            }
          }

          setQrData(scaledLocation)
          missCounter.current = 0
        } else {
          missCounter.current++
          if (missCounter.current > 15) {
            setQrData(null)
          }
        }

        animationRef.current = requestAnimationFrame(scan)
      }

      scan()
    })

    return () => {
      isActiveRef.current = false
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.srcObject = null
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  const handleBack = () => {
    isActiveRef.current = false
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.srcObject = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    onBack()
  }

  const handleCelebrate = () => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.7 },
      colors: ['#FFD700', '#FF0000', '#008000', '#0000FF']
    })
  }

  return (
    <div className="relative w-full h-screen bg-wc-dark-bg overflow-hidden flex flex-col items-center justify-center">
      
      {/* Elementos decorativos del fondo */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-wc-green rounded-full blur-[100px] opacity-20"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-wc-red rounded-full blur-[100px] opacity-20"></div>

      {/* Header */}
      <div className="absolute top-0 w-full p-8 text-center z-20 flex justify-between items-center">
        <button
          onClick={handleBack}
          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition"
        >
          ✖
        </button>
        <h2 className="text-white text-xl font-bold tracking-wider">ESCANEAR CARTA</h2>
        <div className="w-10"></div> {/* Espaciador para centrar el título */}
      </div>

      {/* Contenedor de la cámara */}
      <div className="relative w-80 h-[450px] bg-black rounded-[40px] overflow-hidden shadow-[0_0_40px_rgba(0,209,178,0.2)] border-2 border-wc-green-light/50">
        
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        <canvas ref={canvasRef} className="hidden" />

        <Canvas className="absolute inset-0 z-0">
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          {modelId && qrData && (
            <Modelo
              textureId={`textV2/${modelId}`}
              frontLayers={['1', '2', '3']}
              backSuffix="4"
              parallax={true}
              qrData={qrData}
            />
          )}
        </Canvas>

        {/* UI del marco de escaneo */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Esquinas del marco */}
          <div className="absolute top-6 left-6 w-10 h-10 border-t-4 border-l-4 border-wc-green-light rounded-tl-xl"></div>
          <div className="absolute top-6 right-6 w-10 h-10 border-t-4 border-r-4 border-wc-green-light rounded-tr-xl"></div>
          <div className="absolute bottom-6 left-6 w-10 h-10 border-b-4 border-l-4 border-wc-green-light rounded-bl-xl"></div>
          <div className="absolute bottom-6 right-6 w-10 h-10 border-b-4 border-r-4 border-wc-green-light rounded-br-xl"></div>
          
          {/* Línea de escaneo animada */}
          {!modelId && (
            <div className="absolute inset-y-8 left-6 right-6 overflow-hidden">
              <div className="absolute left-0 right-0 h-[2px] bg-wc-neon-green shadow-[0_0_15px_#39FF14] z-10 animate-[scan_2.5s_ease-in-out_infinite]" />
            </div>
          )}

          {/* Borde de éxito */}
          {modelId && qrData && (
            <div className="absolute inset-0 border-4 border-wc-gold rounded-[40px] transition-all duration-300"></div>
          )}
        </div>
      </div>

      {/* Controles inferiores */}
      <div className="absolute bottom-0 w-full p-8 flex flex-col items-center gap-6 z-20 pb-12">
        {modelId && qrData ? (
          <div className="w-full flex flex-col gap-4 animate-slide-down">
            <button
              onClick={() => onScan(modelId)}
              className="w-full py-4 bg-wc-green-light text-black font-bold rounded-2xl shadow-[0_10px_20px_rgba(0,209,178,0.3)] text-lg hover:-translate-y-1 transition"
            >
              VER CARTA
            </button>
            <button
              onClick={handleCelebrate}
              className="w-full py-4 bg-wc-gold text-black font-bold rounded-2xl shadow-[0_10px_20px_rgba(255,215,0,0.3)] text-lg flex items-center justify-center gap-2 hover:-translate-y-1 transition"
            >
              <span>🎉</span> ¡Celebrar!
            </button>
          </div>
        ) : (
          <div className="text-center px-6">
            <p className="text-white font-medium mb-1 text-lg">Apunta al código QR</p>
            <p className="text-gray-400 text-sm">Mantén la carta estable en el recuadro</p>
          </div>
        )}
      </div>

    </div>
  )
}