"use client"

import { useState, useEffect } from "react"
import { Button, Card, Text, Stack, Group, Grid } from "@mantine/core"
import { saveGameState, loadGameState, clearGameState } from "@/utils/storage"

type Problem = {
  num1: number
  num2: number
  answer: number
}

export function AdditionGame({ onComplete }: { onComplete?: () => void }) {
  const [problems, setProblems] = useState<Problem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isWrong, setIsWrong] = useState(false)
  const [score, setScore] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    // 保存された状態を確認
    const savedState = loadGameState()
    
    if (savedState && savedState.mode === "addition") {
      // 保存された状態を復元
      setProblems(savedState.problems)
      setCurrentIndex(savedState.currentIndex)
      setScore(savedState.score)
      setElapsedSeconds(savedState.elapsedSeconds)
      setIsReady(true)
    } else {
      // 新しいゲームを開始
      const allProblems: Problem[] = []

      for (let i = 0; i <= 9; i++) {
        for (let j = 0; j <= 9; j++) {
          if (i + j <= 10 && i + j > 0) {
            allProblems.push({
              num1: i,
              num2: j,
              answer: i + j,
            })
          }
        }
      }

      const shuffled = allProblems.sort(() => Math.random() - 0.5)
      setProblems(shuffled)
      setIsReady(true)
    }
  }, [])

  useEffect(() => {
    if (!isReady) return

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isReady])

  // 状態が変更されるたびに保存
  useEffect(() => {
    if (!isReady || isCompleted || problems.length === 0) return

    const gameState = {
      mode: "addition" as const,
      currentIndex,
      score,
      elapsedSeconds,
      problems,
      savedAt: Date.now()
    }

    saveGameState(gameState)
  }, [currentIndex, score, elapsedSeconds, problems, isReady, isCompleted])

  const currentProblem = problems[currentIndex]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleNumberClick = (num: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(num)
      setIsWrong(false)
    } else if (selectedAnswer === num) {
      if (num === currentProblem.answer) {
        setScore(score + 1)
        setSelectedAnswer(null)
        setIsWrong(false)

        if (currentIndex < problems.length - 1) {
          setCurrentIndex(currentIndex + 1)
        } else {
          setIsCompleted(true)
        }
      } else {
        setIsWrong(true)
      }
    } else {
      setSelectedAnswer(num)
      setIsWrong(false)
    }
  }

  if (!isReady || !currentProblem) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text size="xl" fw="bold">読み込み中...</Text>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <Card withBorder shadow="lg" padding="xl" style={{ textAlign: 'center' }}>
          <Stack gap="lg">
            <Text size="4rem">🎉</Text>
            <Text size="2xl" fw="bold" c="blue">おつかれさまでした！</Text>
            <Stack gap="sm">
              <Text size="xl">全{problems.length}問完了！</Text>
              <Text size="xl">正解数: {score}問</Text>
              <Text size="xl">かかった時間: {formatTime(elapsedSeconds)}</Text>
            </Stack>
            <Stack gap="md">
              <Button 
                onClick={() => {
                  clearGameState()
                  setCurrentIndex(0)
                  setScore(0)
                  setElapsedSeconds(0)
                  setIsCompleted(false)
                  setSelectedAnswer(null)
                  setIsWrong(false)
                  
                  // 新しい問題セットを生成
                  const allProblems: Problem[] = []
                  for (let i = 0; i <= 9; i++) {
                    for (let j = 0; j <= 9; j++) {
                      if (i + j <= 10 && i + j > 0) {
                        allProblems.push({
                          num1: i,
                          num2: j,
                          answer: i + j,
                        })
                      }
                    }
                  }
                  const shuffled = allProblems.sort(() => Math.random() - 0.5)
                  setProblems(shuffled)
                }}
                size="lg"
                color="orange"
                variant="filled"
                radius="xl"
                fullWidth
                style={{ height: '64px', fontSize: '1.25rem', fontWeight: 'bold' }}
              >
                もう一度やる
              </Button>
              {onComplete && (
                <Button 
                  onClick={onComplete}
                  size="lg"
                  color="blue"
                  variant="filled"
                  radius="xl"
                  fullWidth
                  style={{ height: '64px', fontSize: '1.25rem', fontWeight: 'bold' }}
                >
                  メニューに戻る
                </Button>
              )}
            </Stack>
          </Stack>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '48rem' }}>
        <Stack gap="xl">
          <Group justify="center" gap="lg">
            <Text size="lg" c="dimmed">
              {currentIndex + 1} / {problems.length}
            </Text>
            <Text size="lg" c="dimmed">|</Text>
            <Text size="lg" c="dimmed">{formatTime(elapsedSeconds)}</Text>
          </Group>

          <Card withBorder shadow="lg" padding="xl">
            <Text 
              size="4rem" 
              fw="bold" 
              ta="center"
              c={isWrong ? "red" : undefined}
              style={{ 
                fontSize: 'clamp(3rem, 8vw, 5rem)',
                transition: 'color 0.2s'
              }}
            >
              {currentProblem.num1} + {currentProblem.num2} ={" "}
              <span style={{ color: selectedAnswer !== null ? (isWrong ? 'var(--mantine-color-red-6)' : 'var(--mantine-color-blue-6)') : 'inherit' }}>
                {selectedAnswer !== null ? selectedAnswer : "?"}
              </span>
            </Text>
          </Card>

          <Grid gutter="md">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <Grid.Col span={{ base: 6, xs: 4, sm: 2.4 }} key={num}>
                <Button
                  onClick={() => handleNumberClick(num)}
                  size="lg"
                  fullWidth
                  variant="filled"
                  radius="xl"
                  color={
                    selectedAnswer === num
                      ? isWrong
                        ? "red"
                        : "blue"
                      : "orange"
                  }
                  style={{
                    height: '4rem',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    transform: selectedAnswer === num ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.2s'
                  }}
                >
                  {num}
                </Button>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </div>
    </div>
  )
}
