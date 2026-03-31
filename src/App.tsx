import { useState, useRef, useCallback } from 'react'
import { useTour } from './hooks/useTour'
import { mockUser, mockCards } from './data/mock'
import type { Card } from './types'
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
import { generateTriviaQuestions, playerNameMap, modelToCardId } from './utils/triviaApi'
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
  const [userCards, setUserCards] = useState<Card[]>(mockCards)
  const { startTour } = useTour()

  const fetchUserCollection = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/collection', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        const cards: Card[] = data.cards.map((c: any) => ({
          id: c.CardId,
          name: c.Name,
          description: c.Description || '',
          imageUrl: c.ImageUrl || `/textures/textV2/${c.CardId.toLowerCase().replace('-', '')}_1.png`,
          country: c.Country,
          position: c.Position,
          stats: { speed: c.StatSpeed, shooting: c.StatShooting, power: c.StatPower },
          rarity: c.Rarity as 'common' | 'rare' | 'legendary',
          isCollected: c.IsCollected === 1 || c.IsCollected === true,
        }))
        setUserCards(cards)
        return cards.filter(c => c.isCollected).length
      }
    } catch (err) {
      console.error('Error al cargar colección:', err)
    }
    return 0
  }, [])

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
            onLogin={async (token, dbUser) => {
               localStorage.setItem('auth_token', token);
               const collectedCount = await fetchUserCollection(token)
               const mappedUser = {
                 id: dbUser.UserId?.toString() || dbUser.id || mockUser.id,
                 name: dbUser.Name || dbUser.name || 'Usuario',
                 email: dbUser.Email || dbUser.email || '',
                 avatarUrl: dbUser.AvatarUrl || dbUser.avatarUrl || null,
                 level: dbUser.Level ?? dbUser.level ?? 1,
                 points: dbUser.Points ?? dbUser.points ?? 0,
                 rank: dbUser.Rank ?? dbUser.rank,
                 collectionCount: dbUser.collectionCount || collectedCount || 0
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
        return <UserCollection cards={userCards} />

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

      case 'scan-result': {
        // Busca la carta real: primero en userCards, luego en mockCards, último fallback
        const cardId = scannedModelId ? (modelToCardId[scannedModelId] || scannedModelId) : null
        const scannedCard =
          (cardId && userCards.find(c => c.id === cardId)) ||
          (cardId && mockCards.find(c => c.id === cardId)) ||
          mockCards[0]
        return (
          <ScanResult
            card={scannedCard}
            modelId={scannedModelId}
            onAdd={async () => {
              const token = localStorage.getItem('auth_token');
              if (cardId && token) {
                try {
                  const res = await fetch('/api/collection/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ cardId })
                  });
                  const data = await res.json();
                  if (data.success) {
                    setCurrentUser((prev: any) => ({
                      ...prev,
                      points: data.points,
                      level: data.level,
                      collectionCount: data.collectionCount
                    }));
                    await fetchUserCollection(token);
                  } else {
                    console.error(`No se pudo agregar la carta ${cardId}:`, data.message);
                  }
                } catch (err) {
                  console.error('Error al guardar carta:', err);
                }
              }
              setView('user-collection');
            }}
            onDiscard={() => {
              setScannedModelId(null)
              setView('home')
            }}
            onStartTrivia={handleStartTrivia}
          />
        )
      }

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
            onFinish={async (score: number) => {
              const token = localStorage.getItem('auth_token');
              if (currentUser && token) {
                const cardId = scannedModelId ? modelToCardId[scannedModelId] : null;
                try {
                  // Guardar carta en la colección
                  if (cardId) {
                    const cardRes = await fetch('/api/collection/add', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                      body: JSON.stringify({ cardId })
                    });
                    const cardData = await cardRes.json();
                    if (cardData.success) {
                      setCurrentUser((prev: any) => ({
                        ...prev,
                        collectionCount: cardData.collectionCount
                      }));
                    }
                  }
                  // Guardar puntaje de trivia
                  const scoreRes = await fetch('/api/trivia/save-score', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ pointsEarned: score * 100 })
                  });
                  const scoreData = await scoreRes.json();
                  if (scoreData.success) {
                    setCurrentUser((prev: any) => ({
                      ...prev,
                      points: scoreData.points,
                      level: scoreData.level
                    }));
                  }
                  await fetchUserCollection(token);
                } catch (err) {
                  console.error('Error al finalizar trivia:', err);
                }
              }
              setScannedModelId(null);
              setView('home');
            }}
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
    <div className="font-heading bg-wc-light-bg min-h-screen overflow-x-hidden">
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