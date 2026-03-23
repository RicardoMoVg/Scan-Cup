import { useLoader, useFrame, useThree } from '@react-three/fiber'
import { OBJLoader } from 'three-stdlib'
import { useTexture } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

/** Separación en Z entre capas de parallax (unidades del modelo) */
const PARALLAX_Z_GAP = 0.04

interface ModeloProps {
  textureId: string
  /** Sufijos de las capas del frente en orden (base → tope). Default: ['1'] */
  frontLayers?: string[]
  /** Sufijo de la textura de reverso. Default: '2' */
  backSuffix?: string
  /** Activa el modo parallax: cada capa se renderiza en un Z distinto */
  parallax?: boolean
  qrData?: any
  preview?: boolean
}

export default function Modelo({
  textureId,
  frontLayers = ['1'],
  backSuffix = '2',
  parallax = false,
  qrData,
  preview,
}: ModeloProps) {
  const trackingRef = useRef<THREE.Group>(null!)
  const animationRef = useRef<THREE.Group>(null!)

  const { camera, size } = useThree()

  const obj = useLoader(OBJLoader, '/models/cromo.obj')

  const resolvePath = (suffix: string) =>
    `/textures/${textureId}_${suffix}.png`

  // Carga todas las capas del frente en paralelo (Suspense cache de drei)
  const frontPaths = frontLayers.map(resolvePath)
  const loadedFront = useTexture(frontPaths) as THREE.Texture[]
  const texBack = useTexture(resolvePath(backSuffix))

  const model = useMemo(() => {
    const group = new THREE.Group()
    const texArray = Array.isArray(loadedFront) ? loadedFront : [loadedFront]

    obj.traverse((child: any) => {
      if (!child.isMesh) return

      const geometry = child.geometry.clone()

      if (parallax) {
        // ── Modo parallax ──────────────────────────────────────────────
        // Cada capa es un mesh independiente desplazado en Z.
        // La capa base (i=0) es opaca y escribe depth.
        // Las capas superiores son transparentes (alpha del PNG).
        texArray.forEach((tex, i) => {
          const mat = new THREE.MeshStandardMaterial({
            map: tex,
            side: THREE.FrontSide,
            transparent: i > 0,
            alphaTest: i > 0 ? 0.01 : 0,
            depthWrite: i === 0,
          })
          const mesh = new THREE.Mesh(geometry, mat)
          mesh.position.z = i * PARALLAX_Z_GAP
          mesh.renderOrder = i
          group.add(mesh)
        })
      } else {
        // ── Modo normal (una sola capa de frente) ──────────────────────
        const frontMat = new THREE.MeshStandardMaterial({
          map: texArray[0],
          side: THREE.FrontSide,
        })
        group.add(new THREE.Mesh(geometry, frontMat))
      }

      // Reverso (siempre presente)
      const backMat = new THREE.MeshStandardMaterial({
        map: texBack,
        side: THREE.BackSide,
      })
      group.add(new THREE.Mesh(geometry, backMat))
    })

    return group
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obj, ...loadedFront, texBack, parallax])

  const targetPosition = useRef(new THREE.Vector3())

  useFrame((state: any, delta: number) => {
    if (!trackingRef.current || !animationRef.current) return

    if (!qrData) {
      if (!preview) {
        trackingRef.current.visible = false
        return
      }

      // Modo preview (ScanResult)
      trackingRef.current.visible = true
      trackingRef.current.position.set(0, 0, 0)
      return
    }

    trackingRef.current.visible = true

    const { topLeftCorner, topRightCorner, bottomRightCorner } = qrData

    const centerX = (topLeftCorner.x + bottomRightCorner.x) / 2
    const centerY = (topLeftCorner.y + bottomRightCorner.y) / 2

    const mirroredX = size.width - centerX

    const ndcX = (mirroredX / size.width) * 2 - 1
    const ndcY = -(centerY / size.height) * 2 + 1

    const vector = new THREE.Vector3(ndcX, ndcY, 0.5)
    vector.unproject(camera)

    const dir = vector.sub(camera.position).normalize()

    const qrWidth = Math.hypot(
      topRightCorner.x - topLeftCorner.x,
      topRightCorner.y - topLeftCorner.y
    )

    const distance = THREE.MathUtils.clamp(700 / qrWidth, 2, 12)

    const pos = camera.position.clone().add(dir.multiplyScalar(distance))

    targetPosition.current.copy(pos)

    // Seguimiento ULTRA fluido
    const damping = 1 - Math.exp(-15 * delta)
    trackingRef.current.position.lerp(targetPosition.current, damping)

    // ROTACIÓN INFINITA REAL NO FAKE
    animationRef.current.rotation.y += delta * 2

    // Flotación constante suave
    animationRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.15
  })

  return (
    <group ref={trackingRef} scale={[1.4, 1.4, 1.4]}>
      <group ref={animationRef}>
        <primitive object={model} />
      </group>
    </group>
  )
}
