"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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
  }, [])

  useEffect(() => {
    if (!isReady) return

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isReady])

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-2xl font-bold">読み込み中...</p>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="p-8 md:p-12 bg-card shadow-lg text-center space-y-6">
          <div className="text-6xl">🎉</div>
          <h2 className="text-4xl font-bold text-primary">おつかれさまでした！</h2>
          <div className="text-2xl space-y-2">
            <p>全{problems.length}問完了！</p>
            <p>正解数: {score}問</p>
            <p>かかった時間: {formatTime(elapsedSeconds)}</p>
          </div>
          <div className="space-y-4">
            <Button 
              onClick={() => {
                setCurrentIndex(0)
                setScore(0)
                setElapsedSeconds(0)
                setIsCompleted(false)
                setSelectedAnswer(null)
                setIsWrong(false)
              }}
              size="lg"
              className="h-16 px-8 text-2xl font-bold"
            >
              もう一度やる
            </Button>
            {onComplete && (
              <Button 
                onClick={onComplete}
                size="lg"
                variant="outline"
                className="h-16 px-8 text-2xl font-bold"
              >
                メニューに戻る
              </Button>
            )}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex items-center justify-center gap-4 text-xl text-muted-foreground">
          <p>
            {currentIndex + 1} / {problems.length}
          </p>
          <span>|</span>
          <p>{formatTime(elapsedSeconds)}</p>
        </div>

        <Card className="p-8 md:p-12 bg-card shadow-lg">
          <div className="text-center">
            <div
              className={`text-6xl md:text-8xl font-bold transition-colors ${
                isWrong ? "text-destructive" : "text-foreground"
              }`}
            >
              {currentProblem.num1} + {currentProblem.num2} ={" "}
              <span className={selectedAnswer !== null ? (isWrong ? "text-destructive" : "text-primary") : ""}>
                {selectedAnswer !== null ? selectedAnswer : "?"}
              </span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-5 gap-3 md:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <Button
              key={num}
              onClick={() => handleNumberClick(num)}
              size="lg"
              className={`h-16 md:h-20 text-3xl md:text-4xl font-bold transition-all ${
                selectedAnswer === num
                  ? isWrong
                    ? "bg-destructive hover:bg-destructive text-destructive-foreground scale-110"
                    : "bg-primary hover:bg-primary text-primary-foreground scale-110"
                  : "bg-accent hover:bg-accent/90 text-accent-foreground"
              }`}
            >
              {num}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
