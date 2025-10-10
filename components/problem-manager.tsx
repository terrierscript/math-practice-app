"use client"

import { useState } from "react"
import { Stack, Group, Text } from "@mantine/core"
import { type Problem } from "../utils/problems"
import { NumberPad } from "./number-pad"
import { TwoDigitNumberPad } from "./two-digit-number-pad"
import { ProblemDisplay } from "./problem-display"

interface ProblemManagerProps {
  problem: Problem
  numbers: number[]
  baseColor: string
  selectedCorrectColor: string
  selectedWrongColor: string
  onCorrect: (hasWrongAnswer: boolean) => void
  useTwoDigitInput?: boolean
}

export function ProblemManager({
  problem,
  numbers,
  baseColor,
  selectedCorrectColor,
  selectedWrongColor,
  onCorrect,
  useTwoDigitInput = false
}: ProblemManagerProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
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

  return (
    <Stack gap="xl" data-testid="problem-manager">
      <ProblemDisplay
        num1={problem.num1}
        num2={problem.num2}
        operator={problem.operator}
        selectedAnswer={selectedAnswer}
        isWrong={isWrong}
      />

      {useTwoDigitInput ? (
        <TwoDigitNumberPad
          selectedAnswer={selectedAnswer}
          isWrong={isWrong}
          onNumberClick={handleNumberClick}
          baseColor={baseColor}
          selectedCorrectColor={selectedCorrectColor}
          selectedWrongColor={selectedWrongColor}
        />
      ) : (
        <NumberPad
          numbers={numbers}
          selectedAnswer={selectedAnswer}
          isWrong={isWrong}
          onNumberClick={handleNumberClick}
          baseColor={baseColor}
          selectedCorrectColor={selectedCorrectColor}
          selectedWrongColor={selectedWrongColor}
        />
      )}
    </Stack>
  )
}