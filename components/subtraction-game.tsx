"use client"

import { useState, useEffect } from "react"
import { Button, Card, Text, Stack, Group } from "@mantine/core"
import { saveGameState, loadGameState, clearGameState, confirmClearData } from "../utils/storage"
import { generateSubtractionProblems, type Problem } from "../utils/problems"
import { GameCompletion } from "./game-completion"
import { NumberPad } from "./number-pad"
import { formatTime } from "../utils/time"

export function SubtractionGame({ onComplete }: { onComplete?: () => void }) {
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
    
    if (savedState && savedState.mode === "subtraction") {
      // 保存された状態を復元
      setProblems(savedState.problems)
      setCurrentIndex(savedState.currentIndex)
      setScore(savedState.score)
      setElapsedSeconds(savedState.elapsedSeconds)
      setIsReady(true)
    } else {
      // 新しいゲームを開始
      const newProblems = generateSubtractionProblems()
      setProblems(newProblems)
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
      mode: "subtraction" as const,
      currentIndex,
      score,
      elapsedSeconds,
      problems,
      savedAt: Date.now()
    }

    saveGameState(gameState)
  }, [currentIndex, score, elapsedSeconds, problems, isReady, isCompleted])

  const handleClearData = () => {
    if (confirmClearData()) {
      clearGameState()
      if (onComplete) {
        onComplete()
      }
    }
  }

  const currentProblem = problems[currentIndex]

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
      <GameCompletion 
        totalProblems={problems.length}
        score={score}
        elapsedSeconds={elapsedSeconds}
        onComplete={onComplete}
        buttonColor="orange"
      />
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '48rem' }}>
        <Stack gap="xl">
          <Group justify="space-between" align="center">
            <Button
              onClick={handleClearData}
              size="xs"
              color="red"
              variant="outline"
              radius="xl"
            >
              データ削除
            </Button>
            <Group gap="lg">
              <Text size="lg" c="dimmed">
                {currentIndex + 1} / {problems.length}
              </Text>
              <Text size="lg" c="dimmed">|</Text>
              <Text size="lg" c="dimmed">{formatTime(elapsedSeconds)}</Text>
            </Group>
            <div style={{ width: '80px' }} />
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
              {currentProblem.num1} - {currentProblem.num2} ={" "}
              <span style={{ color: selectedAnswer !== null ? (isWrong ? 'var(--mantine-color-red-6)' : 'var(--mantine-color-blue-6)') : 'inherit' }}>
                {selectedAnswer !== null ? selectedAnswer : "?"}
              </span>
            </Text>
          </Card>

          <NumberPad
            numbers={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
            selectedAnswer={selectedAnswer}
            isWrong={isWrong}
            onNumberClick={handleNumberClick}
            baseColor="blue"
            selectedCorrectColor="blue"
            selectedWrongColor="red"
          />
        </Stack>
      </div>
    </div>
  )
}
