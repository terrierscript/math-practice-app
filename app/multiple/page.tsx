"use client"

import { useState } from "react"
import { Button, Center, Stack, Text, SimpleGrid } from "@mantine/core"
import { useRouter } from "next/navigation"
import { MultiplicationGame } from "../../components/multiplication-game"
import { MultiplicationAccuracyMap } from "../../components/multiplication-accuracy-map"
import { getSavedStateInfo, loadGameState, clearGameState, saveGameState, type GameState } from "../../utils/storage"
import { generateMultiplicationTableProblems, generateOnePerMultiplicationTableProblems, generateRandomMultiplicationProblems } from "../../utils/problems"

type MultiplicationMode = number | "random" | "one-per-table" | "accuracy-map" | null

export default function MultiplePage() {
  const [selectedTable, setSelectedTable] = useState<MultiplicationMode>(null)
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
            かけざん
          </Text>
          <Button
            onClick={() => setSelectedTable("random")}
            size="xl"
            color="orange"
            variant="filled"
            radius="xl"
            fullWidth
            style={{ height: '80px', fontSize: '1.5rem', fontWeight: 'bold' }}
            data-testid="random-multiplication-button"
          >
            9×9ランダム（81問）
          </Button>
          <Button
            onClick={() => setSelectedTable("accuracy-map")}
            size="xl"
            color="blue"
            variant="outline"
            radius="xl"
            fullWidth
            style={{ height: '64px', fontSize: '1.25rem', fontWeight: 'bold' }}
            data-testid="multiplication-accuracy-map-button"
          >
            正解率を9×9マップで見る
          </Button>
          <Button
            onClick={() => setSelectedTable("one-per-table")}
            size="xl"
            color="teal"
            variant="filled"
            radius="xl"
            fullWidth
            style={{ height: '80px', fontSize: '1.5rem', fontWeight: 'bold' }}
            data-testid="one-per-table-multiplication-button"
          >
            各段から1問ずつ（9問）
          </Button>
          <Text size="lg" fw="bold" ta="center" c="dimmed">
            各段から選ぶ
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

  if (selectedTable === "accuracy-map") {
    return <MultiplicationAccuracyMap onBack={() => setSelectedTable(null)} />
  }

  const problems = selectedTable === "random"
    ? generateRandomMultiplicationProblems()
    : selectedTable === "one-per-table"
      ? generateOnePerMultiplicationTableProblems()
      : generateMultiplicationTableProblems(selectedTable)

  return (
    <MultiplicationGame
      problems={problems}
      initialState={undefined}
      onStateChange={() => {}}
      onComplete={() => {
        clearGameState()
        setSelectedTable(null)
      }}
      sendEmail={false}
    />
  )
}
