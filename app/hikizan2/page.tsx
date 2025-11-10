"use client"

import { useState } from "react"
import { Button, Center, Stack } from "@mantine/core"
import { useRouter } from "next/navigation"
import { Subtraction2Game } from "../../components/subtraction2-game"
import { getSavedStateInfo, loadGameState, clearGameState, saveGameState, type GameState } from "../../utils/storage"

export default function Hikizan2Page() {
  const [isStarted, setIsStarted] = useState(false)
  const router = useRouter()

  const handleStateChange = (gameState: Omit<GameState, 'savedAt'>) => {
    const stateWithSavedAt = {
      ...gameState,
      savedAt: Date.now()
    }
    saveGameState(stateWithSavedAt)
  }

  const initialState = loadGameState()

  if (!isStarted) {
    return (
      <Center style={{ minHeight: '100vh', padding: '1rem' }}>
        <Stack gap="xl" style={{ width: '100%', maxWidth: '400px' }}>
          <Button
            onClick={() => setIsStarted(true)}
            size="xl"
            color="purple"
            variant="filled"
            radius="xl"
            fullWidth
            style={{ height: '80px', fontSize: '2rem', fontWeight: 'bold' }}
          >
            ひきざん2を始める
          </Button>
          <Button
            onClick={() => router.push('/')}
            size="lg"
            color="gray"
            variant="outline"
            radius="xl"
            fullWidth
            style={{ height: '60px' }}
          >
            ホームに戻る
          </Button>
        </Stack>
      </Center>
    )
  }

  return (
    <Subtraction2Game
      initialState={initialState?.mode === "subtraction2" ? initialState : undefined}
      onStateChange={handleStateChange}
      onComplete={() => {
        clearGameState()
        router.push('/')
      }}
    />
  )
}