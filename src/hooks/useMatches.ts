import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import type { Match } from '../types'

export function useMatches() {
    const [matches, setMatches] = useState<Match[]>([])
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        const socket: Socket = io({ path: '/socket.io' })

        socket.on('connect', () => setConnected(true))
        socket.on('disconnect', () => setConnected(false))
        socket.on('matches:update', (data: Match[]) => setMatches(data))

        return () => { socket.disconnect() }
    }, [])

    return { matches, connected }
}
