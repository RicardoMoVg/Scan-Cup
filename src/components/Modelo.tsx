import { useLoader, useFrame, useThree } from '@react-three/fiber'
import { OBJLoader } from 'three-stdlib'
import { TextureLoader } from 'three'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

interface ModeloProps {
  textureId: string
  qrData?: any
  preview?: boolean
}

export default function Modelo({ textureId, qrData, preview }: ModeloProps) {
  const trackingRef = useRef<THREE.Group>(null!)
  const animationRef = useRef<THREE.Group>(null!)

  const { camera, size } = useThree()

  const obj = useLoader(OBJLoader, '/models/cromo.obj')

  const resolvePath = (suffix: string) =>
    `/textures/${textureId}_${suffix}.png`

  const texFront = useLoader(TextureLoader, resolvePath('1'))
  const texBack = useLoader(TextureLoader, resolvePath('2'))

  // Crear modelo con frente y reverso reales
  const model = useMemo(() => {
    const group = new THREE.Group()

    obj.traverse((child: any) => {
      if (!child.isMesh) return

      const geometry = child.geometry.clone()

      // Material frente
      const frontMaterial = new THREE.MeshStandardMaterial({
        map: texFront,
        side: THREE.FrontSide,
      })

      // Material reverso
      const backMaterial = new THREE.MeshStandardMaterial({
        map: texBack,
        side: THREE.BackSide,
      })

      const frontMesh = new THREE.Mesh(geometry, frontMaterial)
      const backMesh = new THREE.Mesh(geometry, backMaterial)

      group.add(frontMesh)
      group.add(backMesh)
    })

    return group
  }, [obj, texFront, texBack])

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