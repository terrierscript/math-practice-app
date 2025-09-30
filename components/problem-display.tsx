import { Card, Text } from "@mantine/core"

interface ProblemDisplayProps {
  num1: number
  num2: number
  operator: "+" | "-" | "×" | "÷"
  selectedAnswer: number | null
  isWrong: boolean
}

export function ProblemDisplay({
  num1,
  num2,
  operator,
  selectedAnswer,
  isWrong
}: ProblemDisplayProps) {
  return (
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
        {num1} {operator} {num2} ={" "}
        <span style={{ color: selectedAnswer !== null ? (isWrong ? 'var(--mantine-color-red-6)' : 'var(--mantine-color-blue-6)') : 'inherit' }}>
          {selectedAnswer !== null ? selectedAnswer : "?"}
        </span>
      </Text>
    </Card>
  )
}