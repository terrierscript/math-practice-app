"use client"

import { useState } from "react"
import { Stack } from "@mantine/core"
import { type Problem } from "../utils/problems"
import { TwoDigitNumberPad } from "./two-digit-number-pad"
import { ProblemDisplay } from "./problem-display"

interface MultiplicationProblemManagerProps {
  problem: Problem
  baseColor: string
  selectedCorrectColor: string
  selectedWrongColor: string
  onCorrect: (hasWrongAnswer: boolean) => void
}

export function MultiplicationProblemManager({
  problem,
  baseColor,
  selectedCorrectColor,
  selectedWrongColor,
  onCorrect
}: MultiplicationProblemManagerProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState<number | null>(null)
  const [isWrong, setIsWrong] = useState(false)
  const [hasWrongAnswer, setHasWrongAnswer] = useState(false)

  const handleNumberClick = (num: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(num)
      setIsWrong(false)
    } else if (selectedAnswer === num) {
      if (num === problem.answer) {
        // 正解の場合
        onCorrect(hasWrongAnswer)
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

  const handleInputChange = (value: number | null) => {
    setInputValue(value)
  }

  return (
    <Stack gap="xl" data-testid="multiplication-problem-manager">
      <ProblemDisplay
        num1={problem.num1}
        num2={problem.num2}
        operator={problem.operator}
        selectedAnswer={inputValue !== null ? inputValue : selectedAnswer}
        isWrong={isWrong}
      />

      <TwoDigitNumberPad
        selectedAnswer={selectedAnswer}
        isWrong={isWrong}
        onNumberClick={handleNumberClick}
        onInputChange={handleInputChange}
        baseColor={baseColor}
        selectedCorrectColor={selectedCorrectColor}
        selectedWrongColor={selectedWrongColor}
      />
    </Stack>
  )
}