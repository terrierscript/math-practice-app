import { Button, Card, Text, Stack, Center, Group, Divider } from "@mantine/core"
import { formatTime } from "../utils/time"
import { type ProblemResult, calculateScore } from "../utils/storage"

interface GameCompletionProps {
  totalProblems: number
  score: number
  elapsedSeconds: number
  problemResults: ProblemResult[]
  onComplete?: () => void
  buttonColor?: string
}

export function GameCompletion({ 
  totalProblems, 
  score, 
  elapsedSeconds, 
  problemResults,
  onComplete, 
  buttonColor = "blue" 
}: GameCompletionProps) {
  const scoreData = calculateScore(problemResults)
  
  return (
    <Center style={{ minHeight: '100vh', padding: '1rem' }}>
      <Card withBorder shadow="lg" padding="xl" style={{ textAlign: 'center', maxWidth: '500px' }}>
        <Stack gap="lg">
          <Text size="4rem">🎉</Text>
          <Text size="2xl" fw="bold" c="blue">おつかれさまでした！</Text>
          
          <Divider />
          
          <Stack gap="md">
            <Text size="xl" fw="bold">結果</Text>
            <Group justify="space-between">
              <Text size="lg">全問題数</Text>
              <Text size="lg" fw="bold">{scoreData.totalProblems}問</Text>
            </Group>
            <Group justify="space-between">
              <Text size="lg">正解数</Text>
              <Text size="lg" fw="bold" c="green">{scoreData.correctProblems}問</Text>
            </Group>
            <Group justify="space-between">
              <Text size="lg">間違い数</Text>
              <Text size="lg" fw="bold" c="red">{scoreData.totalProblems - scoreData.correctProblems}問</Text>
            </Group>
            <Group justify="space-between">
              <Text size="lg">正解率</Text>
              <Text size="lg" fw="bold" c="green">{scoreData.correctRate}%</Text>
            </Group>
            <Group justify="space-between">
              <Text size="lg">かかった時間</Text>
              <Text size="lg" fw="bold">{formatTime(elapsedSeconds)}</Text>
            </Group>
          </Stack>
          
          {scoreData.correctRate < 100 && (
            <>
              <Divider />
              <Stack gap="sm">
                <Text size="md" fw="bold" c="red">間違えた問題</Text>
                {problemResults
                  .filter(result => !result.isCorrect)
                  .map((result, index) => (
                    <Text key={index} size="sm" ta="center">
                      {result.problem.num1} {result.problem.operator} {result.problem.num2} = {result.problem.answer}
                    </Text>
                  ))}
              </Stack>
            </>
          )}
          
          {onComplete && (
            <Button 
              onClick={onComplete}
              size="lg"
              color={buttonColor}
              variant="filled"
              radius="xl"
              fullWidth
              style={{ height: '64px', fontSize: '1.25rem', fontWeight: 'bold' }}
            >
              メニューに戻る
            </Button>
          )}
        </Stack>
      </Card>
    </Center>
  )
}