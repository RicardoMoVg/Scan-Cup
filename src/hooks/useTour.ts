import { useEffect } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const TOUR_KEY = 'scancup_tour_done'

export function useTour() {
  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      doneBtnText: '¡Listo!',
      progressText: '{{current}} de {{total}}',
      steps: [
        {
          element: '#scan-button',
          popover: {
            title: 'Escanea tus cartas',
            description: 'Toca este botón para activar la cámara y escanear una carta física. ¡Así la agregas a tu colección!',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#recent-activity',
          popover: {
            title: 'Tu progreso',
            description: 'Aquí puedes ver cuántas cartas has coleccionado y qué tan cerca estás de completar el álbum.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#view-collection-btn',
          popover: {
            title: 'Ver mi colección',
            description: 'Accede rápidamente a todas las cartas que ya has escaneado.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#nav-user-collection',
          popover: {
            title: 'Mi Colección',
            description: 'Tu biblioteca personal de cartas coleccionadas. Filtra y busca tus jugadores favoritos.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#nav-profile',
          popover: {
            title: 'Tu Perfil',
            description: 'Revisa tus estadísticas, logros y personaliza tu cuenta.',
            side: 'top',
            align: 'center',
          },
        },
        {
          element: '#nav-show-videos',
          popover: {
            title: 'Videos',
            description: 'Mira los videos exclusivos asociados a tus cartas. ¡Contenido único por jugador!',
            side: 'top',
            align: 'center',
          },
        },
      ],
    })

    driverObj.drive()
    localStorage.setItem(TOUR_KEY, 'true')
  }

  useEffect(() => {
    if (!localStorage.getItem(TOUR_KEY)) {
      const timer = setTimeout(startTour, 600)
      return () => clearTimeout(timer)
    }
  }, [])

  return { startTour }
}
