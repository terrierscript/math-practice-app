"use client"

import { useState, useEffect } from "react"
import { Button, Stack, Card, Text } from "@mantine/core"
import { AdditionGame } from "../components/addition-game"
import { SubtractionGame } from "../components/subtraction-game"
import { getSavedStateInfo, loadGameState, clearGameState, confirmClearData, saveGameState, type GameMode, type GameState } from "../utils/storage"

type Mode = GameMode | null

export default function MathPracticePage() {
  const [mode, setMode] = useState<Mode>(null)
  const [savedStateInfo, setSavedStateInfo] = useState<ReturnType<typeof getSavedStateInfo>>(null)

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <Stack gap="xl" style={{ width: '100%', maxWidth: '400px' }}>
          {savedStateInfo && (
            <Card withBorder shadow="md" padding="lg">
              <Stack gap="sm">
                <Text size="lg" fw="bold" c="green">
                  前回の続きから始められます
                </Text>
                <Text c="dimmed">
                  {savedStateInfo.mode === "addition" ? "たしざん" : "ひきざん"} - {savedStateInfo.progress} ({savedStateInfo.timeAgo}に保存)
                </Text>
                <Button
                  onClick={handleContinue}
                  size="lg"
                  color="green"
                  variant="filled"
                  radius="xl"
                  fullWidth
                  style={{ height: '64px', fontSize: '1.5rem', fontWeight: 'bold' }}
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
          >
            ひきざん
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
            >
              保存データを削除
            </Button>
          )}
        </Stack>
      </div>
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
  ) : (
    <SubtractionGame 
      initialState={initialState?.mode === "subtraction" ? initialState : undefined}
      onStateChange={handleStateChange}
      onComplete={() => {
        clearGameState()
        setMode(null)
        setSavedStateInfo(null)
      }} 
    />
  )
}
