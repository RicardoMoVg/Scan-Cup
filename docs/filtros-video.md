# Filtros de Video — EditVideos

## Resumen

La pantalla de edición de video (`EditVideos.tsx`) permite aplicar 6 filtros visuales a cualquier video seleccionado. Cinco de ellos funcionan con CSS puro y uno (`Pixelado`) usa Canvas 2D para renderizado frame a frame.

---

## Los 6 filtros

| ID | Nombre | Técnica | Efecto visual |
|---|---|---|---|
| `none` | Normal | — | Sin filtro |
| `pixelate` | Pixelado | Canvas 2D | Reduce y escala el frame para pixelar |
| `vintage` | Vintage | CSS filter | Tono sepia + contraste |
| `blur` | Difuminado | CSS filter | Desenfoque gaussiano |
| `thermal` | Aberración | CSS filter | Inversión de colores + rotación de matiz |
| `color` | Color | CSS filter | Saturación y matiz aumentados |

---

## Cómo funciona cada técnica

### Filtros CSS (Vintage, Difuminado, Aberración, Color)

Se aplican directamente sobre el elemento `<video>` mediante la propiedad CSS `filter`. Son instantáneos, no requieren procesamiento adicional y el video sigue reproduciéndose normalmente.

```ts
const filters = [
  { id: 'vintage',  style: { filter: 'sepia(0.5) contrast(1.2)' } },
  { id: 'blur',     style: { filter: 'blur(4px)' } },
  { id: 'thermal',  style: { filter: 'invert(1) hue-rotate(180deg) contrast(1.5)' } },
  { id: 'color',    style: { filter: 'saturate(2) contrast(1.1) hue-rotate(15deg)' } },
]
```

El estilo se aplica dinámicamente:

```tsx
<video
  style={filters.find(f => f.id === activeFilter)?.style}
/>
```

---

### Filtro Pixelado — Canvas 2D

Es el único filtro que **no usa CSS**. En su lugar, oculta el `<video>` y lo reemplaza visualmente por un `<canvas>` que se actualiza frame a frame usando `requestAnimationFrame`.

#### Paso a paso del algoritmo

```
Cada frame (requestAnimationFrame):
  1. Dibuja el video en el canvas reducido (÷ pixelSize)
  2. Vuelve a dibujar el canvas pequeño → canvas completo
     con imageSmoothingEnabled = false
  → Resultado: imagen pixelada
```

#### Código del renderizado

```ts
const renderPixelated = () => {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;   // ancho real del video
  const h = canvas.height;  // alto real del video
  const size = pixelSize;   // tamaño del bloque (2–32px)

  // Paso 1: dibuja el video a escala reducida (crea los "bloques")
  ctx.drawImage(video, 0, 0, Math.ceil(w / size), Math.ceil(h / size));

  // Paso 2: escala de vuelta sin suavizado → efecto pixelado
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    canvas,
    0, 0, Math.ceil(w / size), Math.ceil(h / size),  // fuente (pequeña)
    0, 0, w, h                                         // destino (tamaño real)
  );

  animFrameRef.current = requestAnimationFrame(renderPixelated);
};
```

#### Control de visibilidad

```tsx
{/* Video: se oculta cuando el filtro es pixelado */}
<video
  style={activeFilter === 'pixelate' ? { visibility: 'hidden' } : estiloFiltroCSS}
/>

{/* Canvas: solo visible con filtro pixelado */}
<canvas
  style={{ display: activeFilter === 'pixelate' ? 'block' : 'none' }}
/>
```

Se usa `visibility: hidden` (no `display: none`) en el video para que **siga reproduciéndose** aunque no se vea — el canvas lo necesita como fuente de frames.

#### Intensidad del pixelado

El slider de **Píxeles** controla el tamaño de cada bloque (de 2 a 32). A mayor valor, mayor pixelado:

| Valor | Efecto |
|---|---|
| 2 | Casi imperceptible |
| 8 | Pixelado moderado (default) |
| 32 | Bloques muy grandes |

---

## Sincronización del canvas con el video

Cuando el video carga su metadata, el canvas ajusta sus dimensiones reales para coincidir con la resolución del video:

```ts
const handleLoadedMetadata = () => {
  canvasRef.current.width  = videoRef.current.videoWidth  || 1280;
  canvasRef.current.height = videoRef.current.videoHeight || 720;
}
```

Esto es importante: si el canvas tuviera dimensiones distintas al video, el pixelado quedaría deformado.

---

## Ciclo de vida del `requestAnimationFrame`

El loop de animación se inicia y cancela reactivamente con `useEffect`:

```ts
useEffect(() => {
  if (activeFilter !== 'pixelate') {
    cancelAnimationFrame(animFrameRef.current); // detiene el loop si se cambia de filtro
    return;
  }

  animFrameRef.current = requestAnimationFrame(renderPixelated); // inicia el loop

  return () => cancelAnimationFrame(animFrameRef.current); // limpieza al desmontar
}, [activeFilter, pixelSize]);
```

Esto garantiza que el loop **solo corra cuando es necesario**, evitando consumo innecesario de CPU.

---

## Diagrama de estados del filtro activo

```
activeFilter = 'none'
  → <video> visible, sin estilo
  → <canvas> oculto, loop detenido

activeFilter = 'vintage' | 'blur' | 'thermal' | 'color'
  → <video> visible con CSS filter aplicado
  → <canvas> oculto, loop detenido

activeFilter = 'pixelate'
  → <video> invisible (visibility: hidden), sin CSS filter
  → <canvas> visible, loop activo (requestAnimationFrame)
  → Intensidad controlada por slider (pixelSize: 2–32)
```

---

## Estructura de archivos

| Archivo | Contenido |
|---|---|
| `src/components/EditVideos.tsx` | Toda la lógica de filtros y reproducción |
| `public/Iconos/normal.png` | Ícono del filtro Normal |
| `public/Iconos/pixelado.png` | Ícono del filtro Pixelado |
| `public/Iconos/vintage.png` | Ícono del filtro Vintage |
| `public/Iconos/difuminado.png` | Ícono del filtro Difuminado |
| `public/Iconos/aberración.png` | Ícono del filtro Aberración |
| `public/Iconos/color.png` | Ícono del filtro Color |
