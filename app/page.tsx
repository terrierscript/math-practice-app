"use client"

import { useState, useEffect } from "react"
import { Button, Stack, Card, Text, Center, Divider } from "@mantine/core"
import { useRouter } from "next/navigation"
import { AdditionGame } from "../components/addition-game"
import { SubtractionGame } from "../components/subtraction-game"
import { MultiplicationGame } from "../components/multiplication-game"
import { getSavedStateInfo, loadGameState, clearGameState, confirmClearData, saveGameState, type GameMode, type GameState } from "../utils/storage"

type Mode = GameMode | null

export default function MathPracticePage() {
  const [mode, setMode] = useState<Mode>(null)
  const [savedStateInfo, setSavedStateInfo] = useState<ReturnType<typeof getSavedStateInfo>>(null)
  const router = useRouter()

  useEffect(() => {
    setSavedStateInfo(getSavedStateInfo())
  }, [])

  const handleContinue = () => {
    const savedState = loadGameState()
    if (savedState) {
      setMode(savedState.mode)
    }
  }

  const handleNewGame = (gameMode: GameMode) => {
    clearGameState()
    setMode(gameMode)
  }

  const handleClearData = () => {
    if (confirmClearData()) {
      clearGameState()
      setSavedStateInfo(null)
    }
  }

  if (mode === null) {
    return (
      <Center style={{ minHeight: '100vh', padding: '1rem' }}>
        <Stack gap="xl" style={{ width: '100%', maxWidth: '400px' }} data-testid="main-menu">
          {savedStateInfo && (
            <Card withBorder shadow="md" padding="lg" data-testid="continue-game-card">
              <Stack gap="sm">
                <Text size="lg" fw="bold" c="green">
                  前回の続きから始められます
                </Text>
                <Text c="dimmed" data-testid="saved-game-info">
                  {savedStateInfo.mode === "addition" ? "たしざん" : savedStateInfo.mode === "subtraction" ? "ひきざん" : "かけざん"} - {savedStateInfo.progress} ({savedStateInfo.timeAgo}に保存)
                </Text>
                <Button
                  onClick={handleContinue}
                  size="lg"
                  color="green"
                  variant="filled"
                  radius="xl"
                  fullWidth
                  style={{ height: '64px', fontSize: '1.5rem', fontWeight: 'bold' }}
                  data-testid="continue-game-button"
                >
                  続きから始める
                </Button>
              </Stack>
            </Card>
          )}
          
          <Button 
            onClick={() => handleNewGame("addition")} 
            size="xl" 
            color="orange"
            variant="filled"
            radius="xl"
            fullWidth
            style={{ height: '80px', fontSize: '2rem', fontWeight: 'bold' }}
            data-testid="addition-game-button"
          >
            たしざん
          </Button>
          <Button
            onClick={() => handleNewGame("subtraction")}
            size="xl"
            color="blue"
            variant="filled"
            radius="xl"
            fullWidth
            style={{ height: '80px', fontSize: '2rem', fontWeight: 'bold' }}
            data-testid="subtraction-game-button"
          >
            ひきざん
          </Button>
          <Divider/>
          <Button
            onClick={() => handleNewGame("multiplication")}
            size="xl"
            color="green"
            variant="filled"
            radius="xl"
            fullWidth
            style={{ height: '80px', fontSize: '2rem', fontWeight: 'bold' }}
            data-testid="multiplication-game-button"
          >
            かけざん
          </Button>
          
          <Button
            onClick={() => router.push('/scores')}
            size="lg"
            color="grape"
            variant="outline"
            radius="xl"
            fullWidth
            style={{ height: '60px', fontSize: '1.25rem', fontWeight: 'bold' }}
            data-testid="records-button"
          >
            📊 記録を見る
          </Button>

          {savedStateInfo && (
            <Button
              onClick={handleClearData}
              size="md"
              color="red"
              variant="outline"
              radius="xl"
              fullWidth
              style={{ height: '48px', fontSize: '1rem', fontWeight: 'bold', marginTop: '1rem' }}
              data-testid="clear-data-button"
            >
              保存データを削除
            </Button>
          )}
        </Stack>
      </Center>
    )
  }

  const handleStateChange = (state: Omit<GameState, 'savedAt'>) => {
    const gameState = {
      ...state,
      savedAt: Date.now()
    }
    saveGameState(gameState)
  }

  const initialState = loadGameState()

  return mode === "addition" ? (
    <AdditionGame 
      initialState={initialState?.mode === "addition" ? initialState : undefined}
      onStateChange={handleStateChange}
      onComplete={() => {
        clearGameState()
        setMode(null)
        setSavedStateInfo(null)
      }} 
    />
  ) : mode === "subtraction" ? (
    <SubtractionGame 
      initialState={initialState?.mode === "subtraction" ? initialState : undefined}
      onStateChange={handleStateChange}
      onComplete={() => {
        clearGameState()
        setMode(null)
        setSavedStateInfo(null)
      }} 
    />
  ) : (
    <MultiplicationGame 
      initialState={initialState?.mode === "multiplication" ? initialState : undefined}
      onStateChange={handleStateChange}
      onComplete={() => {
        clearGameState()
        setMode(null)
        setSavedStateInfo(null)
      }} 
    />
  )
}
