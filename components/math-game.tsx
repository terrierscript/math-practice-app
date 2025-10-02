"use client"

import { useState, useEffect } from "react"
import { Button, Text, Stack, Group, Center } from "@mantine/core"
import { type Problem } from "../utils/problems"
import { GameCompletion } from "./game-completion"
import { NumberPad } from "./number-pad"
import { ProblemDisplay } from "./problem-display"
import { formatTime } from "../utils/time"
import { type GameMode, type GameState } from "../utils/storage"

interface MathGameProps {
  mode: GameMode
  numbers: number[]
  baseColor: string
  selectedCorrectColor: string
  selectedWrongColor: string
  buttonColor: string
  initialState?: GameState
  problems: Problem[]
  onComplete: () => void
  onStateChange: (state: Omit<GameState, 'savedAt'>) => void
}

export function MathGame({
  mode,
  numbers,
  baseColor,
  selectedCorrectColor,
  selectedWrongColor,
  buttonColor,
  initialState,
  problems,
  onComplete,
  onStateChange
}: MathGameProps) {
  const [currentIndex, setCurrentIndex] = useState(initialState?.currentIndex ?? 0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isWrong, setIsWrong] = useState(false)
  const [score, setScore] = useState(initialState?.score ?? 0)
  const [elapsedSeconds, setElapsedSeconds] = useState(initialState?.elapsedSeconds ?? 0)
  const [isCompleted, setIsCompleted] = useState(false)

  // 初期化完了をマーク
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady || isCompleted) return

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isReady, isCompleted])

  // 状態が変更されるたびに外部に通知
  useEffect(() => {
    if (!isReady || isCompleted || problems.length === 0) return

    const gameState = {
      mode,
      currentIndex,
      score,
      elapsedSeconds,
      problems
    }

    onStateChange?.(gameState)
  }, [mode, currentIndex, score, elapsedSeconds, problems, isReady, isCompleted, onStateChange])

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
      <Center style={{ minHeight: '100vh' }}>
        <Text size="xl" fw="bold">読み込み中...</Text>
      </Center>
    )
  }

  if (isCompleted) {
    return (
      <GameCompletion 
        totalProblems={problems.length}
        score={score}
        elapsedSeconds={elapsedSeconds}
        onComplete={onComplete}
        buttonColor={buttonColor}
      />
    )
  }

  return (
    <Center style={{ minHeight: '100vh', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '48rem' }}>
        <Stack gap="xl">
          <Group justify="space-between" align="center">
            
            <Group gap="lg">
              <Text size="lg" c="dimmed">
                {currentIndex + 1} / {problems.length}
              </Text>
              <Text size="lg" c="dimmed">|</Text>
              <Text size="lg" c="dimmed">{formatTime(elapsedSeconds)}</Text>
            </Group>
            <div style={{ width: '80px' }} />
          </Group>

          <ProblemDisplay
            num1={currentProblem.num1}
            num2={currentProblem.num2}
            operator={currentProblem.operator}
            selectedAnswer={selectedAnswer}
            isWrong={isWrong}
          />

          <NumberPad
            numbers={numbers}
            selectedAnswer={selectedAnswer}
            isWrong={isWrong}
            onNumberClick={handleNumberClick}
            baseColor={baseColor}
            selectedCorrectColor={selectedCorrectColor}
            selectedWrongColor={selectedWrongColor}
          />
        </Stack>
      </div>
    </Center>
  )
}