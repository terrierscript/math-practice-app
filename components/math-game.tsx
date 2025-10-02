"use client"

import { useState, useEffect } from "react"
import { Button, Text, Stack, Group, Center } from "@mantine/core"
import { type Problem } from "../utils/problems"
import { GameCompletion } from "./game-completion"
import { NumberPad } from "./number-pad"
import { ProblemDisplay } from "./problem-display"
import { formatTime } from "../utils/time"
import { type GameMode, type GameState, type ProblemResult } from "../utils/storage"

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
  const [problemResults, setProblemResults] = useState<ProblemResult[]>(initialState?.problemResults ?? [])
  const [hasWrongAnswer, setHasWrongAnswer] = useState(false) // 現在の問題で間違えたかどうか

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
      problems,
      problemResults
    }

    onStateChange?.(gameState)
  }, [mode, currentIndex, score, elapsedSeconds, problems, problemResults, isReady, isCompleted, onStateChange])

  const currentProblem = problems[currentIndex]

  const handleNumberClick = (num: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(num)
      setIsWrong(false)
    } else if (selectedAnswer === num) {
      if (num === currentProblem.answer) {
        // 正解の場合
        const result: ProblemResult = {
          problem: currentProblem,
          isCorrect: !hasWrongAnswer // 一度でも間違えていたらfalse
        }
        
        // 一度も間違えずに正解した場合のみスコアに加算
        if (!hasWrongAnswer) {
          setScore(score + 1)
        }
        
        const newResults = [...problemResults, result]
        setProblemResults(newResults)
        
        setSelectedAnswer(null)
        setIsWrong(false)
        setHasWrongAnswer(false) // 次の問題に向けてリセット

        if (currentIndex < problems.length - 1) {
          setCurrentIndex(currentIndex + 1)
        } else {
          setIsCompleted(true)
        }
      } else {
        // 不正解の場合
        setIsWrong(true)
        setHasWrongAnswer(true)
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
        problemResults={problemResults}
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
            <Group gap="lg">
              <Text size="sm" c="green" fw="bold">
                正解: {problemResults.filter(r => r.isCorrect).length}問
              </Text>
              <Text size="sm" c="red" fw="bold">
                間違い: {problemResults.filter(r => !r.isCorrect).length}問
              </Text>
            </Group>
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