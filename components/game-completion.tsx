import { Button, Card, Text, Stack, Center, Group, Divider } from "@mantine/core"
import { formatTime } from "../utils/time"
import { type ProblemResult, type GameMode, calculateScore } from "../utils/storage"
import { sendCompletionEmail } from "../utils/email"
import { useEffect } from "react"

interface GameCompletionProps {
  mode: GameMode
  totalProblems: number
  score: number
  elapsedSeconds: number
  problemResults: ProblemResult[]
  onComplete?: () => void
  buttonColor?: string
  sendEmail?: boolean
}

export function GameCompletion({ 
  mode,
  totalProblems, 
  score, 
  elapsedSeconds, 
  problemResults,
  onComplete, 
  buttonColor = "blue",
  sendEmail = true
}: GameCompletionProps) {
  const scoreData = calculateScore(problemResults)

  // ゲーム完了時にメールを送信
  useEffect(() => {
    if (!sendEmail) return

    const sendEmailAsync = async () => {
      try {
        await sendCompletionEmail({
          mode,
          problemResults,
          elapsedSeconds
        })
      } catch (error) {
        console.error('メール送信でエラーが発生しました:', error)
      }
    }

    sendEmailAsync()
  }, [mode, problemResults, elapsedSeconds, sendEmail])
  
  return (
    <Center style={{ minHeight: '100vh', padding: '1rem' }}>
      <Card withBorder shadow="lg" padding="xl" style={{ textAlign: 'center', maxWidth: '500px' }} data-testid="game-completion">
        <Stack gap="lg">
          <Text size="4rem">🎉</Text>
          <Text size="2xl" fw="bold" c="blue" data-testid="completion-title">おつかれさまでした！</Text>
          
          <Divider />
          
          <Stack gap="md" data-testid="game-results">
            <Text size="xl" fw="bold">結果</Text>
            <Group justify="space-between">
              <Text size="lg">全問題数</Text>
              <Text size="lg" fw="bold" data-testid="total-problems">{scoreData.totalProblems}問</Text>
            </Group>
            <Group justify="space-between">
              <Text size="lg">正解数</Text>
              <Text size="lg" fw="bold" c="green" data-testid="correct-problems">{scoreData.correctProblems}問</Text>
            </Group>
            <Group justify="space-between">
              <Text size="lg">間違い数</Text>
              <Text size="lg" fw="bold" c="red" data-testid="incorrect-problems">{scoreData.totalProblems - scoreData.correctProblems}問</Text>
            </Group>
            <Group justify="space-between">
              <Text size="lg">正解率</Text>
              <Text size="lg" fw="bold" c="green" data-testid="correct-rate">{scoreData.correctRate}%</Text>
            </Group>
            <Group justify="space-between">
              <Text size="lg">かかった時間</Text>
              <Text size="lg" fw="bold" data-testid="elapsed-time">{formatTime(elapsedSeconds)}</Text>
            </Group>
          </Stack>
          
          {scoreData.correctRate < 100 && (
            <>
              <Divider />
              <Stack gap="sm" data-testid="incorrect-problems-list">
                <Text size="md" fw="bold" c="red">間違えた問題</Text>
                {problemResults
                  .filter(result => !result.isCorrect)
                  .map((result, index) => (
                    <Text key={index} size="sm" ta="center" data-testid={`incorrect-problem-${index}`}>
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
              data-testid="back-to-menu-button"
            >
              メニューに戻る
            </Button>
          )}
        </Stack>
      </Card>
    </Center>
  )
}