"use client"

import { useState } from "react"
import { Stack, Grid } from "@mantine/core"
import { type Problem } from "../utils/problems"
import { TwoDigitNumberPad } from "./two-digit-number-pad"
import { ProblemDisplay } from "./problem-display"
import { MultiplicationPreview } from "./multiplication-preview"

interface MultipleDigitProblemManagerProps {
  problem: Problem
  baseColor: string
  selectedCorrectColor: string
  selectedWrongColor: string
  onCorrect: (hasWrongAnswer: boolean) => void
}

export function MultipleDigitProblemManager({
  problem,
  baseColor,
  selectedCorrectColor,
  selectedWrongColor,
  onCorrect
}: MultipleDigitProblemManagerProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState<number | null>(null)
  const [isWrong, setIsWrong] = useState(false)
  const [hasWrongAnswer, setHasWrongAnswer] = useState(false)

  const handleSubmit = () => {
    if (inputValue === null) return
    
    setSelectedAnswer(inputValue)
    
    if (inputValue === problem.answer) {
      // 正解の場合
      onCorrect(hasWrongAnswer)
    } else {
      // 不正解の場合
      setIsWrong(true)
      setHasWrongAnswer(true)
    }
  }

  const handleInputChange = (value: number | null) => {
    setInputValue(value)
    // 入力値が変わったら間違い状態をクリア
    if (isWrong) {
      setIsWrong(false)
    }
  }

  return (
    <div data-testid="multiple-digit-problem-manager">
      <Grid gutter="xl" align="flex-start">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            <ProblemDisplay
              num1={problem.num1}
              num2={problem.num2}
              operator={problem.operator}
              selectedAnswer={inputValue !== null ? inputValue : selectedAnswer}
              isWrong={isWrong}
            />
            {problem.operator === "×" && (
              <MultiplicationPreview 
                num1={problem.num1} 
                num2={problem.num2} 
              />
            )}
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TwoDigitNumberPad
            selectedAnswer={selectedAnswer}
            isWrong={isWrong}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            baseColor={baseColor}
            selectedCorrectColor={selectedCorrectColor}
            selectedWrongColor={selectedWrongColor}
          />
        </Grid.Col>
      </Grid>
    </div>
  )
}