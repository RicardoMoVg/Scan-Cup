import { useState, useRef } from 'react'
import { useTour } from './hooks/useTour'
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
import { generateTriviaQuestions, playerNameMap } from './utils/triviaApi'
import type { TriviaQuestion, PlayerInfo } from './utils/triviaApi'
import { Login } from './components/Login'

function App() {
  const [view, setView] = useState<
    | 'login'
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
  >('login')

  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { startTour } = useTour()

  // guarda el modelId escaneado
  const [scannedModelId, setScannedModelId] = useState<string | null>(null)

  // estado de la trivia generada por IA
  const [triviaQuestions, setTriviaQuestions] = useState<TriviaQuestion[]>([])
  const [triviaLoading, setTriviaLoading] = useState(false)
  const [triviaError, setTriviaError] = useState<string | null>(null)
  const [triviaPlayerInfo, setTriviaPlayerInfo] = useState<PlayerInfo>(playerNameMap['ochoa2026'])
  const startTriviaLock = useRef(false)

  const handleStartTrivia = () => {
    if (startTriviaLock.current) return
    startTriviaLock.current = true

    const playerInfo = (scannedModelId && playerNameMap[scannedModelId]) ? playerNameMap[scannedModelId] : playerNameMap['ochoa2026']
    setTriviaPlayerInfo(playerInfo)
    setTriviaQuestions([])
    setTriviaError(null)
    setTriviaLoading(true)
    setView('trivia')
    generateTriviaQuestions(playerInfo.name)
      .then(setTriviaQuestions)
      .catch((err: Error) => setTriviaError(err.message))
      .finally(() => {
        setTriviaLoading(false)
        startTriviaLock.current = false
      })
  }

  const handleNavChange = (newView: typeof view) => {
    setView(newView)
  }

  const renderContent = () => {
    switch (view) {
      case 'login':
        return (
          <Login 
            onLogin={(token, dbUser) => {
               localStorage.setItem('auth_token', token);
               const mappedUser = {
                 id: dbUser.UserId?.toString() || dbUser.id || mockUser.id,
                 name: dbUser.Name || dbUser.name || 'Usuario',
                 email: dbUser.Email || dbUser.email || '',
                 avatarUrl: dbUser.AvatarUrl || dbUser.avatarUrl || null,
                 level: dbUser.Level ?? dbUser.level ?? 1,
                 points: dbUser.Points ?? dbUser.points ?? 0,
                 rank: dbUser.Rank ?? dbUser.rank,
                 collectionCount: dbUser.collectionCount || 0
               };
               setCurrentUser(mappedUser);
               setView('home');
            }}
          />
        )

      case 'home':
        return (
          <Home
            user={currentUser || mockUser}
            onScanClick={() => setView('scan')}
            onViewCollection={() => setView('user-collection')}
            onStartTour={startTour}
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
            user={currentUser || mockUser}
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
            onStartTrivia={handleStartTrivia}
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
        return (
          <Trivia
            modelId={scannedModelId}
            playerInfo={triviaPlayerInfo}
            questions={triviaQuestions}
            isLoading={triviaLoading}
            error={triviaError}
            onRetry={handleStartTrivia}
          />
        )

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

      {view !== 'scan' && view !== 'login' && view !== 'scan-result' && (
        <BottomNav
          currentView={view}
          onChangeView={handleNavChange}
        />
      )}
    </div>
  )
}

export default App