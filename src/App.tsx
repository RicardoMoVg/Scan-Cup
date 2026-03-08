import { useState } from 'react'
import { mockUser, mockCards } from './data/mock'
import { BottomNav } from './components/BottomNav'
import { Home } from './components/Home'
import { UserCollection } from './components/UserCollection'
import { CatalogCollection } from './components/CatalogCollection'
import { UserProfile } from './components/UserProfile'
import { ARView } from './components/ARView'
import { Trivia } from './components/Trivia'
import { ScanResult } from './components/ScanResult'
import { ShowVideos } from './components/ShowVideos'
import { EditVideos } from './components/EditVideos'

function App() {
  const [view, setView] = useState<
    | 'home'
    | 'scan'
    | 'user-collection'
    | 'catalog'
    | 'profile'
    | 'trivia'
    | 'market'
    | 'scan-result'
    | 'show-videos'
    | 'edit-video'
  >('home')

  const [selectedVideo, setSelectedVideo] = useState<any>(null)

  // guarda el modelId escaneado
  const [scannedModelId, setScannedModelId] = useState<string | null>(null)

  const handleNavChange = (newView: typeof view) => {
    setView(newView)
  }

  const renderContent = () => {
    switch (view) {
      case 'home':
        return (
          <Home
            user={mockUser}
            onScanClick={() => setView('scan')}
            onViewCollection={() => setView('user-collection')}
          />
        )

      case 'user-collection':
        return <UserCollection cards={mockCards} />

      case 'catalog':
        return (
          <CatalogCollection
            cards={mockCards}
            onBack={() => setView('home')}
          />
        )

      case 'profile':
        return (
          <UserProfile
            user={mockUser}
            onBack={() => setView('home')}
          />
        )

      case 'scan':
        return (
          <ARView
            onScan={(id) => {
              setScannedModelId(id)   // guarda el ID real del QR
              setView('scan-result')  // cambia vista
            }}
            onBack={() => setView('home')}
          />
        )

      case 'scan-result':
        return (
          <ScanResult
            card={mockCards[0]}
            modelId={scannedModelId}  // ahora sí lo pasa correctamente
            onAdd={() => {
              setView('user-collection')
            }}
            onDiscard={() => {
              setScannedModelId(null) // limpia
              setView('home')
            }}
            onStartTrivia={() => setView('trivia')}
          />
        )

      case 'show-videos':
        return (
          <ShowVideos
            onVideoSelect={(video) => {
              setSelectedVideo(video)
              setView('edit-video')
            }}
            onBack={() => setView('home')}
          />
        )

      case 'edit-video':
        return (
          <EditVideos
            video={selectedVideo}
            onBack={() => setView('show-videos')}
          />
        )

      case 'trivia':
        return <Trivia modelId={scannedModelId} />

      case 'market':
        return (
          <div className="flex items-center justify-center h-screen bg-wc-light-bg text-gray-800 font-bold">
            Próximamente: Tienda
          </div>
        )

      default:
        return <div>Vista no encontrada</div>
    }
  }

  return (
    <div className="font-heading bg-wc-light-bg min-h-screen">
      {renderContent()}

      {view !== 'scan' && view !== 'scan-result' && (
        <BottomNav
          currentView={view}
          onChangeView={handleNavChange}
        />
      )}
    </div>
  )
}

export default App