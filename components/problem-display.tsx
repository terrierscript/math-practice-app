import { Card, Text, Group } from "@mantine/core"

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
    <Card withBorder shadow="lg" padding="xl" data-testid="problem-display">
      <Group 
        gap="md" 
        justify="center"
        wrap="nowrap"
        data-testid="problem-equation"
        style={{
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          fontWeight: 'bold',
        }}
      >
        <Text 
          fw="bold"
          c={isWrong ? "red" : undefined}
          style={{ 
            fontSize: 'inherit',
            transition: 'color 0.2s',
            whiteSpace: 'nowrap'
          }}
          data-testid="problem-num1"
        >
          {num1}
        </Text>
        <Text 
          fw="bold"
          c={isWrong ? "red" : undefined}
          style={{ 
            fontSize: 'inherit',
            transition: 'color 0.2s',
            whiteSpace: 'nowrap'
          }}
          data-testid="problem-operator"
        >
          {operator}
        </Text>
        <Text 
          fw="bold"
          c={isWrong ? "red" : undefined}
          style={{ 
            fontSize: 'inherit',
            transition: 'color 0.2s',
            whiteSpace: 'nowrap'
          }}
          data-testid="problem-num2"
        >
          {num2}
        </Text>
        <Text 
          fw="bold"
          c={isWrong ? "red" : undefined}
          style={{ 
            fontSize: 'inherit',
            transition: 'color 0.2s',
            whiteSpace: 'nowrap'
          }}
        >
          =
        </Text>
        <Text 
          fw="bold"
          c={selectedAnswer !== null ? (isWrong ? 'red' : 'blue') : (isWrong ? "red" : undefined)}
          style={{ 
            fontSize: 'inherit',
            transition: 'color 0.2s',
            whiteSpace: 'nowrap'
          }}
          data-testid="problem-answer"
        >
          {selectedAnswer !== null ? selectedAnswer : "?"}
        </Text>
      </Group>
    </Card>
  )
}