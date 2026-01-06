"use client"

import { useState } from "react"
import { Button, Center, Stack, Text, SimpleGrid } from "@mantine/core"
import { useRouter } from "next/navigation"
import { MultiplicationGame } from "../../components/multiplication-game"
import { getSavedStateInfo, loadGameState, clearGameState, saveGameState, type GameState } from "../../utils/storage"
import { generateMultiplicationTableProblems } from "../../utils/problems"

export default function MultiplePage() {
  const [selectedTable, setSelectedTable] = useState<number | null>(null)
  const router = useRouter()

  const handleStateChange = (gameState: Omit<GameState, 'savedAt'>) => {
    const stateWithSavedAt = {
      ...gameState,
      savedAt: Date.now()
    }
    saveGameState(stateWithSavedAt)
  }

  const initialState = loadGameState()

  if (selectedTable === null) {
    return (
      <Center style={{ minHeight: '100vh', padding: '1rem' }}>
        <Stack gap="xl" style={{ width: '100%', maxWidth: '500px' }}>
          <Text 
            size="2rem" 
            fw="bold" 
            ta="center"
            c="dark"
          >
            かけざん（各段）
          </Text>
          <SimpleGrid cols={3} spacing="md">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((table) => (
              <Button
                key={table}
                onClick={() => setSelectedTable(table)}
                size="xl"
                color="green"
                variant="filled"
                radius="xl"
                style={{ height: '80px', fontSize: '1.5rem', fontWeight: 'bold' }}
              >
                {table}の段
              </Button>
            ))}
          </SimpleGrid>
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

  // 選択された段の問題を生成
  const problems = generateMultiplicationTableProblems(selectedTable)

  return (
    <MultiplicationGame
      problems={problems}
      initialState={undefined}
      onStateChange={() => {}}
      onComplete={() => {
        clearGameState()
        setSelectedTable(null)
      }}
    />
  )
}
