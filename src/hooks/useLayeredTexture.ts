import { useTexture } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Carga N texturas en paralelo y las composita en un CanvasTexture de una sola pasada.
 * Optimizado: una sola textura GPU, un solo draw call por cara.
 */
export function useLayeredTexture(paths: string[]): THREE.Texture {
  const textures = useTexture(paths) as THREE.Texture[]

  return useMemo(() => {
    const texArray = Array.isArray(textures) ? textures : [textures]

    // Con una sola capa no hace falta componer, reutilizamos directo
    if (texArray.length === 1) return texArray[0]

    const firstImage = texArray[0].image as HTMLImageElement
    const w = firstImage?.naturalWidth || firstImage?.width || 1024
    const h = firstImage?.naturalHeight || firstImage?.height || 1024

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h

    const ctx = canvas.getContext('2d')!
    for (const tex of texArray) {
      if (tex.image) {
        ctx.drawImage(tex.image as HTMLImageElement, 0, 0, w, h)
      }
    }

    const composed = new THREE.CanvasTexture(canvas)
    // Mantener la misma orientación que las texturas originales
    composed.flipY = texArray[0].flipY
    composed.colorSpace = texArray[0].colorSpace
    composed.needsUpdate = true
    return composed
    // Spread como deps para que useMemo reaccione si cambia alguna textura
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(Array.isArray(textures) ? textures : [textures])])
}
