"use client"

import { useState, useEffect } from "react"
import { Button, Text, Stack, Group, Center } from "@mantine/core"
import { type Problem } from "../utils/problems"
import { GameCompletion } from "./game-completion"
import { ProblemManager } from "./problem-manager"
import { formatTime } from "../utils/time"
import { type GameMode, type GameState, type ProblemResult, saveGameRecord, calculateScore } from "../utils/storage"

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
  const [score, setScore] = useState(initialState?.score ?? 0)
  const [elapsedSeconds, setElapsedSeconds] = useState(initialState?.elapsedSeconds ?? 0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [problemResults, setProblemResults] = useState<ProblemResult[]>(initialState?.problemResults ?? [])

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

  const handleCorrect = (hasWrongAnswer: boolean) => {
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

    if (currentIndex < problems.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // ゲーム完了時に記録を保存
      const scoreData = calculateScore(newResults)
      saveGameRecord(mode, problems.length, scoreData.correctProblems, elapsedSeconds, newResults)
      setIsCompleted(true)
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
        mode={mode}
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
      <div style={{ width: '100%', maxWidth: '48rem' }} data-testid="math-game">
        <Stack gap="xl">
          <Group justify="space-between" align="center" data-testid="game-header">
            <Group gap="lg" data-testid="game-progress">
              <Text size="lg" c="dimmed" data-testid="problem-counter">
                {currentIndex + 1} / {problems.length}
              </Text>
              <Text size="lg" c="dimmed">|</Text>
              <Text size="lg" c="dimmed" data-testid="elapsed-time">{formatTime(elapsedSeconds)}</Text>
            </Group>
            <Group gap="lg" data-testid="game-stats">
              <Text size="sm" c="green" fw="bold" data-testid="correct-count">
                正解: {problemResults.filter(r => r.isCorrect).length}問
              </Text>
              <Text size="sm" c="red" fw="bold" data-testid="incorrect-count">
                間違い: {problemResults.filter(r => !r.isCorrect).length}問
              </Text>
            </Group>
          </Group>

          <ProblemManager
            key={currentIndex} // キーを指定することで問題が変わったときにコンポーネントを再マウント
            problem={currentProblem}
            numbers={numbers}
            baseColor={baseColor}
            selectedCorrectColor={selectedCorrectColor}
            selectedWrongColor={selectedWrongColor}
            onCorrect={handleCorrect}
          />
        </Stack>
      </div>
    </Center>
  )
}