import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import type { Match } from '../types'
import { API_BASE } from '../utils/apiBase'

export interface GoalNotification {
    id: string
    player: string
    minute: number
    homeTeam: string
    homeFlag: string
    awayTeam: string
    awayFlag: string
    homeScore: number
    awayScore: number
    scoringTeam: 'home' | 'away'
}

export function useMatches() {
    const [matches, setMatches] = useState<Match[]>([])
    const [connected, setConnected] = useState(false)
    const [goalNotification, setGoalNotification] = useState<GoalNotification | null>(null)
    const seenEventIds = useRef<Set<string>>(new Set())
    const isInitialLoad = useRef(true)

    useEffect(() => {
        const socket: Socket = io(API_BASE || undefined, {
            path: '/socket.io',
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 2000,
            reconnectionDelayMax: 10000,
        })

        socket.on('connect', () => setConnected(true))
        socket.on('disconnect', () => setConnected(false))
        socket.on('matches:update', (data: Match[]) => {
            // Detectar goles nuevos (ignorar la carga inicial)
            for (const match of data) {
                for (const event of match.events) {
                    if (event.type === 'goal') {
                        if (!isInitialLoad.current && !seenEventIds.current.has(event.id)) {
                            setGoalNotification({
                                id: event.id,
                                player: event.player,
                                minute: event.minute,
                                homeTeam: match.homeTeam,
                                homeFlag: match.homeFlag,
                                awayTeam: match.awayTeam,
                                awayFlag: match.awayFlag,
                                homeScore: match.homeScore,
                                awayScore: match.awayScore,
                                scoringTeam: event.team,
                            })
                        }
                        seenEventIds.current.add(event.id)
                    }
                }
            }
            isInitialLoad.current = false
            setMatches(data)
        })

        return () => { socket.disconnect() }
    }, [])

    return {
        matches,
        connected,
        goalNotification,
        clearGoalNotification: () => setGoalNotification(null),
    }
}
