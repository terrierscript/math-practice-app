import { Button, Card, Text, Stack } from "@mantine/core"
import { formatTime } from "../utils/time"

interface GameCompletionProps {
  totalProblems: number
  score: number
  elapsedSeconds: number
  onComplete?: () => void
  buttonColor?: string
}

export function GameCompletion({ 
  totalProblems, 
  score, 
  elapsedSeconds, 
  onComplete, 
  buttonColor = "blue" 
}: GameCompletionProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <Card withBorder shadow="lg" padding="xl" style={{ textAlign: 'center' }}>
        <Stack gap="lg">
          <Text size="4rem">🎉</Text>
          <Text size="2xl" fw="bold" c="blue">おつかれさまでした！</Text>
          <Stack gap="sm">
            <Text size="xl">全{totalProblems}問完了！</Text>
            <Text size="xl">正解数: {score}問</Text>
            <Text size="xl">かかった時間: {formatTime(elapsedSeconds)}</Text>
          </Stack>
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
    </div>
  )
}